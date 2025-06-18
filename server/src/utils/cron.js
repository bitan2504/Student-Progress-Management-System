import cron from 'node-cron';
import Admin from '../models/admin.js';
import syncInfo from './codeforces/api/sync.js';

let cronInstances = null;

async function startCronJob() {
    try {
        const admin = await Admin.findOne({});
        const cronSchedule = admin?.cronSchedule || '0 0 * * *'; // Default to daily at midnight if no schedule is set

        cronInstances = cron.schedule(
            cronSchedule,
            () => {
                console.log(`Running cron job with schedule: ${cronSchedule}`);
                syncInfo();
            },
            {
                scheduled: true,
                timezone: 'Asia/Kolkata', // Set the timezone to Indian Standard Time
            }
        );
    } catch (error) {
        console.error('Error starting cron job:', error);
    }
}

async function updateCronSchedule(newSchedule) {
    console.log('Updating cron schedule to:', newSchedule);
    try {
        if (cronInstances) {
            cronInstances.stop();
        }

        const admin = await Admin.findOne({});
        if (admin) {
            admin.cronSchedule = newSchedule;
            await admin.save();
        }

        cronInstances = cron.schedule(
            newSchedule,
            async () => {
                console.log(
                    `Running cron job with new schedule: ${newSchedule}`
                );
                await syncInfo();
            },
            {
                scheduled: true,
                timezone: 'Asia/Kolkata', // Set the timezone to Indian Standard Time
            }
        );
        // console.log('Cron schedule updated successfully:', cronInstances);
        return cronInstances;
    } catch (error) {
        console.error('Error updating cron schedule:', error);
        return null;
    }
}

export { updateCronSchedule, startCronJob };
