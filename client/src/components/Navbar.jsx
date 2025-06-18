import { Link } from 'react-router-dom';
import './Navbar.css';
import { useContext } from 'react';
import Context from '../context/context.jsx';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function App() {
  const { user, setUser, token, setToken } = useContext(Context);
  const [menuOpen, setMenuOpen] = useState(false);
  console.log('User in Navbar:', user);

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/logout`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setToken('');
        setUser(false);
        console.log('Logout successful');
        window.location.href = '/';
      } else {
        console.error('Logout failed:', response.data.message);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    setMenuOpen(false);
  }, []);

  return (
    <div className="navbar w-full py-4 px-8 flex justify-between items-center roboto">
      <div>
        <Link
          to="https://www.tle-eliminators.com/"
          className="flex flex-row items-center gap-2"
        >
          <div style={{ width: '25px', height: '25px' }}>
            <img
              src="https://www.tle-eliminators.com/static/media/tle-eliminators.866328c32b7a996da404503789dfe6c0.svg"
              alt="Logo"
            />
          </div>
          <div
            style={{
              fontWeight: '500',
              fontSize: '24px',
              color: 'rgb(2, 10, 46)',
            }}
          >
            TLE
          </div>
          <div
            style={{
              fontWeight: '500',
              fontSize: '24px',
              color: 'rgb(2, 10, 46)',
            }}
          >
            Eliminators
          </div>
        </Link>
      </div>

      <div className="flex flex-row items-center gap-2">
        <Link to="/" className="ml-4">
          Home
        </Link>
        <Link to="/table" className="ml-4">
          Table
        </Link>
        <Link to="/about" className="ml-4">
          About
        </Link>
        <Link to="/contact" className="ml-4">
          Contact
        </Link>
      </div>

      <div>
        {user ? (
          <div onClick={() => setMenuOpen((prev) => !prev)}>
            <span className="cursor-pointer">
              <img
                className="w-8 h-8 rounded-full"
                src="/account_circle_BLACK.svg"
                alt=""
              />
            </span>
            {menuOpen && (
              <div className="absolute right-8 mt-2 bg-white border rounded shadow-lg z-10">
                <Link
                  to="/settings"
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Settings
                </Link>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="ml-4 login">
            Login as Admin
          </Link>
        )}
      </div>
    </div>
  );
}
