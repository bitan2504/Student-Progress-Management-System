import Student from '../../../models/student.js';
import axios from 'axios';
import sendEmail from '../../nodemailer.js';
import user_info from './user_info.js';
import contest_history from './contest_history.js';

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const checkInactivity = async (handle) => {
    try {
        const response = await axios.get(
            `https://codeforces.com/api/user.status?handle=${handle}`
        );
        if (response.data.status === 'OK') {
            const submissions = response.data.result;
            const inactive = submissions.every((submission) => {
                const submissionDate = new Date(
                    submission.creationTimeSeconds * 1000
                );
                const now = new Date();
                const diff = now - submissionDate;
                return diff > 7 * 24 * 60 * 60 * 1000; // 7 days
            });
            if (inactive) {
                console.log(`User ${handle} has been inactive for 7 days.`);
            }
            return inactive;
        }
    } catch (error) {
        console.error('Error checking inactivity:', error);
        return null;
    }
};

const syncInfo = async () => {
    try {
        console.log('Syncing Codeforces data for students...');
        const students = await Student.find({
            codeforcesData: { $exists: true },
        });
        for (let i = 0; i < students.length; i++) {
            const student = students[i];
            try {
                const isInactive = await checkInactivity(
                    student.codeforcesHandle
                );
                if (isInactive === true) {
                    student.inactivityWarnings += 1;
                    await student.save();
                    sendEmail({
                        to: student.email,
                        subject: 'Codeforces Inactivity Warning',
                        html: `<p>Dear ${student.name},</p>
                <p>You have been <strong>inactive on Codeforces for 7 days</strong>. Please try to solve some problems to keep your skills sharp!</p>
                <p>Best regards,<br>Your Friendly Reminder Bot</p>`,
                    });
                    console.log(
                        `Sent inactivity warning to ${student.codeforcesHandle}`
                    );
                }
            } catch (error) {
                console.error(
                    `Error checking inactivity for ${student.codeforcesHandle}:`,
                    error
                );
            }

            try {
                const codeforcesData = await user_info([
                    student.codeforcesHandle,
                ]);
                const contestHistory = await contest_history(
                    student.codeforcesHandle
                );
                if (codeforcesData && codeforcesData.length > 0) {
                    student.codeforcesData = codeforcesData[0];
                }
                if (contestHistory && contestHistory.length > 0) {
                    student.contestHistory = contestHistory;
                }
                await student.save();
            } catch (error) {
                console.error(
                    `Error syncing Codeforces data for ${student.codeforcesHandle}:`,
                    error
                );
            }

            await sleep(500);
        }
    } catch (error) {
        console.error('Error syncing Codeforces data:', error);
    }
};

export default syncInfo;
