import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useContext } from 'react';
import Context from '../context/context.jsx';

const options = [
  { key: 'password', label: 'Change Password' },
  { key: 'cron', label: 'Change Cron Settings' },
];

function ChangePassword() {
  const { token } = useContext(Context);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/change-password`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        toast.success('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error('Failed to update password.');
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          'An error occurred while updating password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="max-w-md mx-auto bg-white rounded-xl shadow p-8"
      onSubmit={handleSubmit}
    >
      <h2 className="mb-6 font-semibold text-2xl text-gray-800">
        Change Password
      </h2>
      <div className="mb-5">
        <label className="block mb-2 font-medium text-gray-700">
          Current Password
        </label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
      </div>
      <div className="mb-5">
        <label className="block mb-2 font-medium text-gray-700">
          New Password
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
      </div>
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">
          Confirm New Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-400 text-white rounded-md font-semibold text-base shadow hover:from-indigo-600 hover:to-indigo-500 transition disabled:opacity-60"
      >
        {loading ? 'Updating...' : 'Update Password'}
      </button>
    </form>
  );
}

function getCronExpression(type, time, date) {
  const [hour, minute] = time.split(':').map(Number);
  switch (type) {
    case 'everyDay':
      // minute hour * * *
      return `${minute} ${hour} * * *`;
    case 'everyMonth':
      // minute hour 1 * *
      return `${minute} ${hour} 1 * *`;
    case 'specificDate':
      if (!date) return '';
      // minute hour day month *
      const [year, month, day] = date.split('-').map(Number);
      return `${minute} ${hour} ${day} ${month} *`;
    default:
      return '* * * * *';
  }
}

function ChangeCronSettings() {
  const { token } = useContext(Context);
  const [cronType, setCronType] = useState('everyDay');
  const [time, setTime] = useState('00:00');
  const [date, setDate] = useState('');
  const [cronString, setCronString] = useState('');

  const handleTypeChange = (e) => {
    setCronType(e.target.value);
    setCronString(getCronExpression(e.target.value, time, date));
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
    setCronString(getCronExpression(cronType, e.target.value, date));
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
    setCronString(getCronExpression(cronType, time, e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newSchedule = getCronExpression(cronType, time, date);
    setCronString(newSchedule);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/update-cron`,
        { newSchedule },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success('Cron settings updated successfully!');
      } else {
        toast.error('Failed to update cron settings.');
      }
    } catch (error) {
      console.error('Error generating cron expression:', error);
      toast.error(
        'An unexpected error occurred while generating the cron expression.'
      );
    }
  };

  return (
    <form
      className="max-w-md mx-auto bg-white rounded-xl shadow p-8"
      onSubmit={handleSubmit}
    >
      <h2 className="mb-6 font-semibold text-2xl text-gray-800">
        Change Cron Settings
      </h2>
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">
          Schedule Type
        </label>
        <select
          className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          value={cronType}
          onChange={handleTypeChange}
        >
          <option value="everyDay">Every Day</option>
          <option value="everyMonth">Every Month</option>
          <option value="specificDate">Specific Date</option>
        </select>
      </div>
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">Time</label>
        <input
          type="time"
          value={time}
          onChange={handleTimeChange}
          className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
      </div>
      {cronType === 'specificDate' && (
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>
      )}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">
          Generated Cron Expression
        </label>
        <input
          type="text"
          value={cronString}
          readOnly
          className="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-100 text-base"
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-400 text-white rounded-md font-semibold text-base shadow hover:from-indigo-600 hover:to-indigo-500 transition"
      >
        Update Cron
      </button>
    </form>
  );
}

const Settings = () => {
  const [selected, setSelected] = useState('password');

  let content;
  if (selected === 'password') content = <ChangePassword />;
  else if (selected === 'cron') content = <ChangeCronSettings />;

  return (
    <div className="flex min-h-[80vh] border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-lg mx-auto my-8 max-w-4xl">
      <aside className="w-64 bg-gradient-to-br from-slate-100 to-indigo-100 border-r border-gray-200 py-10 px-6 flex flex-col gap-2">
        <h3 className="text-xl font-bold mb-8 text-indigo-500 tracking-wide">
          Settings
        </h3>
        <ul className="space-y-2">
          {options.map((opt) => (
            <li key={opt.key}>
              <button
                className={`block w-full px-5 py-3 rounded-lg text-left font-medium text-base transition 
                    ${
                      selected === opt.key
                        ? 'bg-gradient-to-r from-indigo-500 to-indigo-400 text-white shadow font-bold'
                        : 'bg-transparent text-gray-700 hover:bg-indigo-50'
                    }
                    `}
                onClick={() => setSelected(opt.key)}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex-1 p-12 bg-gray-50 flex items-center justify-center">
        {content}
      </main>
    </div>
  );
};

export default Settings;
