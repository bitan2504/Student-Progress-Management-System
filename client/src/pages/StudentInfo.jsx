import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Context from '../context/context.jsx';

export default function StudentInfo() {
    const { handle } = useParams();
    const [studentInfo, setStudentInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showDetails, setShowDetails] = useState(false);
    const { token } = useContext(Context);

    useEffect(() => {
        if (!handle) return;
        setLoading(true);
        setError('');
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
                setStudentInfo(Array.isArray(response.data) ? response.data[0] : response.data);
            } catch (error) {
                setError('Failed to fetch student information.');
            } finally {
                setLoading(false);
            }
        };
        fetchStudentInfo();
    }, [handle, token]);

    const handleRefresh = () => {
        setStudentInfo(null);
        setShowDetails(false);
        setError('');
        setLoading(true);
        // Re-run the effect by changing handle (simulate)
        setTimeout(() => {
            setLoading(false);
            setError('Manual refresh is not implemented in this demo.');
        }, 1000);
    };

    return (
        <div className="flex flex-col justify-center items-center mt-10 p-6 bg-white rounded-lg shadow min-w-[350px]">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
                Student Information
            </h2>
            <div className="flex gap-4 mb-4">
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    onClick={() => setShowDetails((prev) => !prev)}
                    disabled={!studentInfo}
                >
                    {showDetails ? 'Hide Details' : 'Show Details'}
                </button>
                <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    onClick={handleRefresh}
                >
                    Refresh
                </button>
            </div>
            {loading && <div className="text-gray-500">Loading student information...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {studentInfo && (
                <div className="w-full max-w-md animate-fade-in">
                    <div className="flex justify-center mb-4">
                        <img
                            src={studentInfo.avatar || studentInfo.titlePhoto}
                            alt="Avatar"
                            className="w-24 h-24 rounded-full object-cover border shadow"
                        />
                    </div>
                    <div className="mb-2 text-center">
                        {studentInfo.handle}
                    </div>
                    {showDetails && (
                        <div className="space-y-2 mt-2">
                            <div>
                                <span className="font-semibold">Name:</span>{' '}
                                {studentInfo.firstName || ''} {studentInfo.lastName || ''}
                            </div>
                            <div>
                                <span className="font-semibold">Email:</span> {studentInfo.email || 'N/A'}
                            </div>
                            <div>
                                <span className="font-semibold">City:</span> {studentInfo.city || 'N/A'}
                            </div>
                            <div>
                                <span className="font-semibold">Country:</span> {studentInfo.country || 'N/A'}
                            </div>
                            <div>
                                <span className="font-semibold">Organization:</span> {studentInfo.organization || 'N/A'}
                            </div>
                            <div>
                                <span className="font-semibold">Rating:</span> {studentInfo.rating ?? 'N/A'}
                            </div>
                            <div>
                                <span className="font-semibold">Rank:</span> {studentInfo.rank || 'N/A'}
                            </div>
                            <div>
                                <span className="font-semibold">Max Rating:</span> {studentInfo.maxRating ?? 'N/A'}
                            </div>
                            <div>
                                <span className="font-semibold">Max Rank:</span> {studentInfo.maxRank || 'N/A'}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
