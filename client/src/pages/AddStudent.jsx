import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Context from '../context/context.jsx';

const inputClass =
  'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition';
const labelClass = 'block mb-1 font-medium text-gray-700';
const formGroupClass = 'mb-5';

const AddStudent = () => {
  const { token, setToken, setUser } = useContext(Context);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    codeforcesHandle: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/student/addStudent`,
        form,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        toast.success('Student added successfully!');
        setForm({
          name: '',
          email: '',
          phoneNumber: '',
          codeforcesHandle: '',
        });
      } else {
        toast.error('Failed to add student. Please try again.');
        console.error('Failed to add student:', response.data);
      }
    } catch (error) {
      console.error('Error adding student:', error);
      if (error.response && error.response.status === 401) {
        toast.error('Unauthorized. Please log in again.');
        setToken('');
        setUser(undefined);
      } else {
        toast.error('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Add Student
        </h2>
        <form onSubmit={handleSubmit}>
          <div className={formGroupClass}>
            <label className={labelClass}>Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
              required
              placeholder="Enter student's name"
            />
          </div>
          <div className={formGroupClass}>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
              required
              placeholder="Enter student's email"
            />
          </div>
          <div className={formGroupClass}>
            <label className={labelClass}>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className={inputClass}
              required
              placeholder="Enter phone number"
            />
          </div>
          <div className={formGroupClass}>
            <label className={labelClass}>Codeforces Handle</label>
            <input
              type="text"
              name="codeforcesHandle"
              value={form.codeforcesHandle}
              onChange={handleChange}
              className={inputClass}
              required
              placeholder="Enter Codeforces handle"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Add Student
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
