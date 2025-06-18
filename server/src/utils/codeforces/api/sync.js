import Student from '../../../models/student.js';
import axios from 'axios';

const syncInfo = async () => {
    try {
        console.log('Syncing Codeforces data for students...');
        const students = await Student.find({
            codeforcesData: { $exists: true },
        });
        students.forEach(async (student) => {
            try {
                const response = await axios.get(
                    `https://codeforces.com/api/user.info?handles=${student.codeforcesHandle}`
                );
                if (
                    response.data.status === 'OK' &&
                    response.data.result.length > 0
                ) {
                    student.codeforcesData = response.data.result[0];
                    await student.save();
                }
            } catch (error) {
                console.error(
                    `Error fetching data for ${student.codeforcesHandle}:`,
                    error
                );
            }
        });
    } catch (error) {
        console.error('Error syncing Codeforces data:', error);
    }
};

export default syncInfo;
