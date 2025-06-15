import express from 'express';
import cors from 'cors';

/**
 * Express application instance used to configure middleware, routes, and server settings.
 * @type {import('express').Express}
*/
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Enable CORS with allowed origin from environment variable
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        headers: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

// Set custom CORS headers for all incoming requests
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN);
    res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
    );
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

import studentRouter from './routes/student.js';
import adminRouter from './routes/admin.js';
app.use('/student', studentRouter);
app.use('/admin', adminRouter);

// Export the configured Express app instance
export default app;
