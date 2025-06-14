import axios from 'axios';

export default async (handles) => {
    try {
        const response = await axios.get('https://codeforces.com/api/user.info', {
            params: {
                handles: handles.join(';'),
                checkHistoricHandles: false
            }
        });
        if (response.data.status === 'OK') {
            return response.data.result;
        } else {
            throw new Error('Failed to fetch user info');
        }
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw new Error('Failed to fetch user info');
    }
};