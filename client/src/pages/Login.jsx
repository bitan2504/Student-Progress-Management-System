import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Context from '../context/context';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setToken, user, setUser, navigate } = useContext(Context);

  useEffect(() => {
    if (user) {
      navigate('/');
      console.log('User is already logged in, redirecting to home page.');
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    console.log('Username:', username);
    console.log('Password:', password);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/login`,
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );
      console.log('Response:', response);

      if (response.status === 200) {
        const accessToken = response.data.accessToken;
        setToken(accessToken);
        setUser(true);
        toast.success('Login successful');
      } else {
        setUser(false);
        setToken('');
        toast.error('Login failed');
        console.error('Login failed:', response.data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="bg-white p-8 rounded-xl shadow-lg min-w-[320px] w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Admin Login
        </h2>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block mb-2 text-gray-600 font-medium"
          >
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-gray-600 font-medium"
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-md font-bold text-base hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
}
