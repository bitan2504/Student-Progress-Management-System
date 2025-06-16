import { Link } from 'react-router-dom';
import './Navbar.css';
import { useContext } from 'react';
import Context from '../context/context.jsx';
import axios from 'axios';

export default function App() {
  const { user, setUser, token, setToken } = useContext(Context);
  console.log('User in Navbar:', user);
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
          <form
            onSubmit={() => {
              try {
                const response = axios.get(
                  `${import.meta.env.VITE_API_URL}/admin/logout`,
                  {
                    headers: {
                      'Authorization': `Bearer ${token}`,
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
            }}
          >
            <button className="ml-4 logout">Logout</button>
          </form>
        ) : (
          <Link to="/login" className="ml-4 login">
            Login as Admin
          </Link>
        )}
      </div>
    </div>
  );
}
