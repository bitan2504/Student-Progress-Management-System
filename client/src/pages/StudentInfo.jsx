import axios from 'axios';
import { use, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Context from '../context/context.jsx';

function SubmissionApp({ submissions, setSubmissions, handle, token }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const filters = {
    '7 days': 7 * 24 * 60 * 60,
    '30 days': 30 * 24 * 60 * 60,
    '90 days': 90 * 24 * 60 * 60,
  };
  const [selectedFilter, setSelectedFilter] = useState('7 days');
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [mostDifficultProblem, setMostDifficultProblem] = useState('N/A');
  const [mostDifficultProblemRating, setMostDifficultProblemRating] =
    useState(0);
  const [totalProblemsSolved, setTotalProblemsSolved] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [averageProblemsSolved, setAverageProblemsSolved] = useState(0);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/student/fetchSubmissions`,
        { codeforcesHandle: handle },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setLoading(false);
        setSubmissions(response.data);
        setError('');
      } else {
        setLoading(false);
        setSubmissions([]);
        setError('Failed to fetch submissions. Please try again later.');
        console.error('Error fetching submissions:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setSubmissions([]);
      setError('Failed to fetch submissions.');
    }
  };

  const analyzeSubmissions = () => {
    const now = Date.now() / 1000;
    const filteredSubmissions = submissions.filter((submission) => {
      return (
        submission.verdict === 'OK' &&
        now - submission.creationTimeSeconds <= filters[selectedFilter]
      );
    });
    setFilteredSubmissions(filteredSubmissions);
    console.log('Filtered submissions:', filteredSubmissions);
  };

  const analyzeFilteredSubmissions = () => {
    let totalRating = 0,
      totalRatedProblems = 0;
    filteredSubmissions.forEach((submission) => {
      if (
        submission.problem.rating &&
        submission.problem.rating > mostDifficultProblemRating
      ) {
        setMostDifficultProblemRating(submission.problem.rating);
        setMostDifficultProblem(submission.problem.name);
      }
      totalRating += submission.problem.rating || 0;
      totalRatedProblems += submission.problem.rating ? 1 : 0;
    });
    setAverageRating(
      totalRatedProblems > 0 ? (0.0 + totalRating) / totalRatedProblems : 0
    );
    setTotalProblemsSolved(filteredSubmissions.length);
    setAverageProblemsSolved(
      totalRatedProblems > 0
        ? (0.0 + totalRatedProblems) / totalRatedProblems
        : 0
    );
  };

  useEffect(() => {
    if (!handle) return;
    fetchSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle, token]);

  useEffect(() => {
    if (submissions.length === 0) return;
    analyzeSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissions, selectedFilter]);

  useEffect(() => {
    if (filteredSubmissions.length === 0) return;
    analyzeFilteredSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredSubmissions]);

  return (
    <div className="w-3/5 mx-auto flex flex-col items-center p-8 bg-zinc-100 rounded-lg shadow-md">
      {!loading && filteredSubmissions.length === 0 ? (
        <div className="text-gray-500">No submissions found.</div>
      ) : loading ? (
        <div className="animate-pulse">Loading...</div>
      ) : (
        <div>
          <h4 className="text-lg text-center text-blue-700 font-bold mb-4">
            Statistics
          </h4>
          <div className="text-right">
            <label className="text-gray-600  text-sm mr-2">
              Choose statistics filter for
            </label>
            <select
              className="border border-gray-300 rounded px-2 py-1 text-sm"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              {Object.keys(filters).map((filter) => (
                <option key={filter} value={filter} className='text-sm'>
                  {filter}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div>{`${totalProblemsSolved} problems`}</div>
              <div className="text-zinc-400 text-sm">{`solved in last ${selectedFilter}`}</div>
            </div>
            <div>
              <div>
                {mostDifficultProblem ? mostDifficultProblem : 'N/A'}
                {mostDifficultProblemRating > 0 && (
                  <span className="text-gray-500 font-semibold">
                    {', ' + mostDifficultProblemRating}
                  </span>
                )}
              </div>
              <div className="text-zinc-400 text-sm">
                {`Most Difficult Problem solved`}
              </div>
            </div>
            <div>
              <div>{`${averageProblemsSolved.toFixed(0)} problems`}</div>
              <div className="text-zinc-400 text-sm">{`per day in last ${selectedFilter}`}</div>
            </div>
            <div>
              <div>{`${averageRating.toFixed(0)} rated problem`}</div>
              <div className="text-zinc-400 text-sm">{`average in last ${selectedFilter}`}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudentInfo() {
  const ratingColor = {
    newbie: 'text-gray-500',
    pupil: 'text-green-500',
    specialist: 'text-cyan-600',
    expert: 'text-blue-500',
    'candidate master': 'text-purple-500',
    master: 'text-yellow-500',
    'international master': 'text-orange-500',
    grandmaster: 'text-red-500',
    'international grandmaster': 'text-pink-500',
    'legendary grandmaster': 'text-indigo-500',
    unrated: 'text-black-500',
  };
  const { handle } = useParams();
  const [studentInfo, setStudentInfo] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token, navigate, user } = useContext(Context);

  const fetchStudentInfo = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/student/fetchCodeforcesInfo`,
        { codeforcesHandles: [handle] },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setStudentInfo(
        Array.isArray(response.data) ? response.data[0] : response.data
      );
      console.log('Student Info:', response);
    } catch (error) {
      setError('Failed to fetch student information.');
      console.error('Error fetching student info:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) navigate('/login');
    if (!handle) return;
    setLoading(true);
    setError('');
    fetchStudentInfo();
  }, [handle, token, user]);

  const handleRefresh = () => {
    setStudentInfo(null);
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setLoading(true);
      setError('');
      fetchStudentInfo();
    }, 1000);
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="mx-auto w-3/5 flex flex-col justify-center items-center bg-zinc-100 p-8 rounded-xl shadow-lg">
        <div className="flex gap-4 mb-4"></div>
        {loading && (
          <div className="text-gray-500">Loading student information...</div>
        )}
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {studentInfo && (
          <div className="flex felx-row gap-8 items-center">
            <div>
              <div
                className={`font-bold text-md ${ratingColor[studentInfo.rank]}`}
              >
                {studentInfo.rank.charAt(0).toUpperCase() +
                  studentInfo.rank.slice(1)}
              </div>
              <div
                className={`text-2xl font-bold ${ratingColor[studentInfo.rank]}`}
              >
                {studentInfo.handle}
              </div>
              <div>
                <span>
                  {studentInfo.firstName + ' ' + studentInfo.lastName}
                </span>
                <span>{studentInfo.city ? `, ${studentInfo.city}` : ''}</span>
                <span>
                  {studentInfo.country ? `, ${studentInfo.country}` : ''}
                </span>
              </div>
              <div className="text-zinc-500 font-semibold">
                {`Organization: ${studentInfo.organization ? studentInfo.organization : 'N/A'}`}
              </div>
              <div>
                <span>Contest Rating: </span>
                <span
                  className={`${ratingColor[studentInfo.rank]} font-semibold`}
                >{`${studentInfo.rating ? studentInfo.rating : 'N/A'}`}</span>
                {studentInfo.maxRating && studentInfo.maxRank && (
                  <>
                    <span>{` (max. `}</span>
                    <span
                      className={`${ratingColor[studentInfo.maxRank]} font-semibold`}
                    >
                      {`${studentInfo.maxRating}, ${studentInfo.maxRank.charAt(0).toUpperCase() + studentInfo.maxRank.slice(1)}`}
                    </span>
                    <span>{`)`}</span>
                  </>
                )}
              </div>
            </div>
            <div>
              <img
                src={studentInfo.avatar || studentInfo.titlePhoto}
                alt={`${studentInfo.handle}'s avatar`}
              />
            </div>
          </div>
        )}
      </div>
      {studentInfo && (
        <SubmissionApp
          submissions={submissions}
          setSubmissions={setSubmissions}
          handle={studentInfo.handle}
          token={token}
        />
      )}
    </div>
  );
}
