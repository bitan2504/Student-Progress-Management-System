import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Context from '../context/context.jsx';
import VerticalBarChart from '../components/VerticalBarChart.jsx';
import { toast } from 'react-toastify';

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

  const [problemByRating, setProblemByRating] = useState(new Map());

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
      totalRatedProblems = 0,
      mostDifficultProblemRating = 0,
      mostDifficultProblem = 'N/A';
    const problemByRatingMap = new Map();
    filteredSubmissions.forEach((submission) => {
      if (
        (submission.problem.rating || submission.problem.points) &&
        (submission.problem.rating > mostDifficultProblemRating ||
          submission.problem.points > mostDifficultProblemRating)
      ) {
        mostDifficultProblemRating =
          submission.problem.rating || submission.problem.points;
        mostDifficultProblem = submission.problem.name;
      }
      totalRating +=
        submission.problem.rating || submission.problem.points || 0;
      totalRatedProblems +=
        submission.problem.rating || submission.problem.points ? 1 : 0;

      problemByRatingMap.set(
        submission.problem.rating || submission.problem.points || 800,
        (problemByRatingMap.get(
          submission.problem.rating || submission.problem.points || 800
        ) || 0) + 1
      );
    });

    setMostDifficultProblem(mostDifficultProblem);
    setMostDifficultProblemRating(mostDifficultProblemRating);
    setAverageRating(
      totalRatedProblems > 0 ? (0.0 + totalRating) / totalRatedProblems : 0
    );
    setTotalProblemsSolved(filteredSubmissions.length);
    setAverageProblemsSolved(
      totalRatedProblems > 0
        ? (0.0 + totalRatedProblems) / totalRatedProblems
        : 0
    );
    setProblemByRating(problemByRatingMap);
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
                <option key={filter} value={filter} className="text-sm">
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
      <VerticalBarChart problemByRating={problemByRating} />
    </div>
  );
}

function ContestHistory({ contestHistory }) {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const filters = {
    '30 days': 30 * 24 * 60 * 60,
    '90 days': 90 * 24 * 60 * 60,
    '365 days': 365 * 24 * 60 * 60,
    All: null,
  };

  const filterContests = () => {
    if (!contestHistory) return [];
    if (selectedFilter === 'All') return contestHistory;
    const now = Date.now() / 1000;
    return contestHistory.filter(
      (contest) =>
        now - (contest.ratingUpdateTimeSeconds || 0) <= filters[selectedFilter]
    );
  };

  const filteredContests = filterContests();

  if (!contestHistory || contestHistory.length === 0) {
    return (
      <div className="w-3/5 mx-auto mt-8 p-6 bg-zinc-100 rounded-lg shadow-md text-gray-500 text-center">
        No contest history available.
      </div>
    );
  }

  return (
    <div className="w-3/5 mx-auto mt-8 p-6 bg-zinc-100 rounded-lg shadow-md">
      <h4 className="text-lg text-blue-700 font-bold mb-4 text-center">
        Contest History
      </h4>
      <div className="flex justify-end mb-2">
        <label className="text-gray-600 text-sm mr-2">Show for</label>
        <select
          className="border border-gray-300 rounded px-2 py-1 text-sm"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          {Object.keys(filters).map((filter) => (
            <option key={filter} value={filter}>
              {filter}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Contest</th>
              <th className="px-4 py-2">Rank</th>
              <th className="px-4 py-2">Old Rating</th>
              <th className="px-4 py-2">New Rating</th>
              <th className="px-4 py-2">Change</th>
            </tr>
          </thead>
          <tbody>
            {filteredContests.map((contest, idx) => (
              <tr key={contest.contestId} className="border-t">
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">
                  <a
                    href={`https://codeforces.com/contest/${contest.contestId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {contest.contestName}
                  </a>
                </td>
                <td className="px-4 py-2">{contest.rank}</td>
                <td className="px-4 py-2">{contest.oldRating}</td>
                <td className="px-4 py-2">{contest.newRating}</td>
                <td
                  className={`px-4 py-2 font-semibold ${
                    contest.newRating - contest.oldRating >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {contest.newRating - contest.oldRating >= 0 ? '+' : ''}
                  {contest.newRating - contest.oldRating}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredContests.length === 0 && (
          <div className="text-gray-500 text-center mt-4">
            No contests in selected period.
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudentInfo() {
  const { handle } = useParams();
  const [studentInfo, setStudentInfo] = useState(null);
  const [contestHistory, setContestHistory] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token, navigate, user, ratingColor } = useContext(Context);

  const fetchStudentInfo = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/student/fetchCodeforcesInfo`,
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
        setStudentInfo(response.data.codeforcesData);
        setContestHistory(response.data.contestHistory || []);
      }
    } catch (error) {
      setError('Failed to fetch student information.');
      console.error('Error fetching student info:', error);
      toast.error(error.toString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(user, user !== undefined);
    if (user !== undefined && (!user || !token)) {
      navigate('/login');
      return;
    }
    if (!handle) return;
    setLoading(true);
    setError('');
    fetchStudentInfo();
  }, [handle, token, user, navigate]);

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
        <>
          <ContestHistory contestHistory={contestHistory} />
          <SubmissionApp
            submissions={submissions}
            setSubmissions={setSubmissions}
            handle={studentInfo.handle}
            token={token}
          />
        </>
      )}
    </div>
  );
}
