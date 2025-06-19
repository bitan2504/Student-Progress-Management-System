import axios from 'axios';

export default async (handle) => {
    try {
        const response = await axios.get(
            `https://codeforces.com/api/user.rating?handle=${handle}`
        );
        if (response.data.status === 'OK') {
            return response.data.result;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error in contest_history:', error);
        return null;
    }
};
