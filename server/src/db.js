import mongoose from 'mongoose';
import chalk from 'chalk';

/**
 * Asynchronously connects to the MongoDB database using the connection URI specified in the environment variables.
 * Logs a success message with the connected host on successful connection.
 * Logs an error message and exits the process if the connection fails.
 *
 * @async
 * @function connectDB
 * @returns {Promise<mongoose.Mongoose>} The mongoose connection instance.
 * @throws Will exit the process if the connection fails.
 */
const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB using the URI from environment variables
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI);

        // Log success message with the connected host
        console.log(
            chalk.green('MongoDB connected successfully:'),
            connectionInstance.connection.host
        );
        return connectionInstance;
    } catch (error) {
        // Log error message and exit the process if connection fails
        console.error(chalk.red('Error connecting to MongoDB:'), error.message);
        process.exit(1);
    }
}

// Export the connectDB function as the default export
export default connectDB;