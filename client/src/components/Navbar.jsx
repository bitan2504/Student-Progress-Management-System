import { Link } from 'react-router-dom';
import './Navbar.css';

export default function App() {
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
        <Link to="table" className="ml-4">
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
        <Link to="/login" className="ml-4 login">
          Login as Admin
        </Link>
      </div>
    </div>
  );
}
