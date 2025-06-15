import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import Context from '../context/context.jsx';

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '24px',
  background: '#fff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  borderRadius: '8px',
  overflow: 'hidden',
};

const thStyle = {
  background: '#1976d2',
  color: '#fff',
  padding: '12px 8px',
  textAlign: 'left',
  fontWeight: 600,
};

const tdStyle = {
  padding: '10px 8px',
  borderBottom: '1px solid #eee',
};

const trHover = {
  background: '#f5faff',
};

const buttonStyle = {
  background: '#1976d2',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  padding: '8px 16px',
  margin: '0 8px',
  cursor: 'pointer',
  fontWeight: 500,
  fontSize: '1rem',
};

const buttonDisabled = {
  ...buttonStyle,
  background: '#b0b0b0',
  cursor: 'not-allowed',
};

export default function Table() {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const { token, user, navigate } = useContext(Context);

  const fetchPage = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/student/fetchPage`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            start: page - 1,
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setRows(response.data.students);
      } else {
        setRows([]);
      }
    } catch (error) {
      setRows([]);
    }
  };

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }
    fetchPage();
  }, [page, user, token, navigate]);

  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 24 }}>
      <h2 style={{ color: '#1976d2', marginBottom: 16, textAlign: 'center' }}>
        Student Progress Tracker
      </h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} style={thStyle}>
                {col
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase())
                  .trim()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} style={idx % 2 === 0 ? {} : trHover}>
              {columns.map((col) => (
                <td key={col} style={tdStyle}>
                  {row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <button
          style={page === 1 ? buttonDisabled : buttonStyle}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span style={{ margin: '0 12px', fontWeight: 500, fontSize: '1.1rem' }}>
          Page {page}
        </span>
        <button style={buttonStyle} onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
