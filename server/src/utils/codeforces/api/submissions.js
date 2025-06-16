import axios from 'axios';

export default async (handle) => {
  try {
    const response = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`);
    return response.data.result;
  } catch (error) {
    console.error("Error fetching submissions:", error);
    throw error;
  }
};
