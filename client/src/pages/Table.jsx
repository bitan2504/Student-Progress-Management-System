import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import Context from '../context/context.jsx';
import { Link } from 'react-router-dom';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

export default function Table() {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [editable, setEditable] = useState(null);
  const [editInputs, setEditInputs] = useState({});
  const { token, user, navigate, ratingColor } = useContext(Context);

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
      console.log(response.data.students);

      if (response.status === 200) {
        setRows(response.data.students);
      } else {
        setRows([]);
        toast.error(response.data.message || 'Failed to fetch students');
      }
    } catch (error) {
      setRows([]);
      console.log(error);
      toast.error('Failed to fetch students');
    }
  };

  useEffect(() => {
    if (user !== undefined && (user === false || token === '')) {
      navigate('/login');
      return;
    }
    fetchPage();
  }, [page, user, token, navigate]);

  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  function handleEdit(e) {
    e.preventDefault();
    setEditable(e.target.value);
    setEditInputs(rows[e.target.value]);
  }

  async function submitEdit(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/student/editStudent`,
        editInputs,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        toast.success('Successfully editted student details');
        const newRows = rows;
        newRows[editable] = response.data.data;
        setRows(newRows);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.toString());
    } finally {
      setEditInputs({});
      setEditable(null);
    }
  }

  function cancelEdit(e) {
    e.preventDefault();
    setEditInputs({});
    setEditable(null);
  }

  useEffect(() => {
    console.log(editable);
    console.log(editInputs);
  }, [editable]);

  return (
    <div className="flex flex-col justify-center items-center mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-blue-700">
        Student Progress Tracker
      </h2>
      <p className="ml-[200px] w-full text-left text-sm">
        To add new student <u>{<Link to="/add">click here</Link>}</u>.
      </p>
      <div>
        {columns.length > 0 && (
          <table className="overflow-auto w-fit border-collapse text-sm">
            <thead>
              <tr>
                {columns.map((col) =>
                  col !== '_id' && col !== 'codeforcesData' ? (
                    <th
                      key={col}
                      className="bg-blue-700 text-white px-4 py-3 text-left font-semibold"
                    >
                      {col
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, (str) => str.toUpperCase())
                        .trim()}
                    </th>
                  ) : (
                    <></>
                  )
                )}
                <th className="bg-blue-700 text-white px-4 py-3 font-semibold">
                  Edit Profile
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  className={`w-20 ${idx % 2 === 0 ? '' : 'bg-blue-50'}`}
                >
                  {columns.map((col) =>
                    col !== '_id' && col !== 'codeforcesData' ? (
                      <td
                        key={col}
                        className={`px-4 py-2 border-b border-gray-200 ${col === 'rank' ? ratingColor[row[col]] + ' font-semibold' : ''}`}
                      >
                        {editable != idx ||
                        [
                          'phoneNumber',
                          'name',
                          'codeforcesHandle',
                          'email',
                        ].findIndex((item) => item === col) === -1 ? (
                          <>
                            {col !== 'codeforcesHandle' ? (
                              row[col]
                            ) : (
                              <Link
                                to={`/student/${row.codeforcesHandle}`}
                                className="text-blue-500 hover:underline"
                              >
                                {row[col]}
                              </Link>
                            )}
                          </>
                        ) : (
                          <input
                            type="text"
                            key={idx}
                            value={editInputs[col]}
                            onChange={(e) => {
                              setEditInputs({
                                ...editInputs,
                                [col]: e.target.value,
                              });
                            }}
                            className="w-20"
                          />
                        )}
                      </td>
                    ) : (
                      <></>
                    )
                  )}
                  <td>
                    {idx != editable ? (
                      <button
                        className={`text-center text-white hover:text-blue-600 duration-500 w-full h-full`}
                        value={idx}
                        onClick={handleEdit}
                      >
                        Edit
                      </button>
                    ) : (
                      <div className="w-full flex justify-evenly">
                        <button onClick={submitEdit}>
                          <CheckIcon
                            className="w-6 h-6 text-green-500"
                            aria-hidden="true"
                          />
                        </button>
                        <button onClick={cancelEdit}>
                          <XMarkIcon
                            className="w-6 h-6 text-red-500"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
