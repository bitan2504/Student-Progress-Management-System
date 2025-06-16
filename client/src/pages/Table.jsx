import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import Context from '../context/context.jsx';
import { Link } from 'react-router-dom';

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
            'Authorization': `Bearer ${token}`,
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
      console.log(error);
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
    <div className="flex flex-col justify-center items-center mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        Student Progress Tracker
      </h2>
      <div>
        <table className="overflow-auto w-fit border-collapse text-sm">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="bg-blue-700 text-white px-4 py-3 text-center font-semibold"
                >
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
              <tr key={idx} className={idx % 2 === 0 ? '' : 'bg-blue-50'}>
                {columns.map((col) => (
                  <td
                    key={col}
                    className="px-4 py-2 border-b border-gray-200 text-center"
                  >
                    {row[col]}
                  </td>
                ))}
                <td className="px-4 py-2 border-b border-gray-200 text-center">
                  <Link
                    to={`/student/${row.codeforcesHandle}`}
                    className="text-blue-500 hover:underline"
                  >
                    View Profile
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        {rows.length === 0 ? (
          <p className="text-gray-500 text-center">
            No data available for the current page.
          </p>
        ) : (
          <p className="text-gray-500 text-center">
            Showing results for page {page}
          </p>
        )}
      </div>
      <div className="mt-6 text-center">
        <button
          className={`bg-blue-700 text-white px-4 py-2 rounded mr-3 font-medium transition disabled:bg-gray-400 disabled:cursor-not-allowed`}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="mx-3 font-semibold text-lg">Page {page}</span>
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded ml-3 font-medium transition"
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
