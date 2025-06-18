// Load environment variables from .env file located one directory up
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './db.js';
import app from './app.js';
import chalk from 'chalk';
import { startCronJob } from './cron.js';

connectDB()
    .then(() => {
        // Start the server after successful database connection
        const PORT = process.env.PORT || 8000;
        app.listen(PORT, () => {
            console.log(chalk.green(`Server is running on port ${PORT}`));
        });
        startCronJob();
    })
    .catch((error) => {
        // Log error if database connection fails
        console.error(
            chalk.red('Failed to connect to the database:', error.message)
        );
    });
