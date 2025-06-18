import Admin from '../models/admin.js';
import jwt from 'jsonwebtoken';

/**
 * Logs in an admin user.
 *
 * Authenticates an admin using the provided username and password. If successful,
 * generates access and refresh tokens, sets them as HTTP-only cookies, and returns the access token.
 *
 * @async
 * @function login
 * @param {import('express').Request} req - Express request object containing `username` and `password` in the body.
 * @param {import('express').Response} res - Express response object used to send the response.
 * @returns {Promise<void>} Responds with JSON containing a success message and access token if successful,
 * or an error message if credentials are invalid.
 *
 * @throws {500} Returns status 500 if an internal server error occurs.
 */
const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const accessToken = await admin.createAccessToken();
        const refreshToken = await admin.createRefreshToken();

        res.status(200)
            .header('Authorization', `Bearer ${accessToken}`)
            .cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            })
            .cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            })
            .json({
                message: 'Login successful',
                accessToken,
            });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Logs out an admin user.
 *
 * Clears the `accessToken` and `refreshToken` cookies to terminate the session.
 *
 * @async
 * @function logout
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Responds with a logout success message or an internal server error.
 *
 * @throws {500} Returns status 500 if an internal server error occurs.
 */
const logout = async (req, res) => {
    try {
        return res
            .clearCookie('accessToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            })
            .clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            })
            .status(200)
            .json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Automatically signs in an admin using a valid refresh token.
 *
 * Verifies the refresh token from cookies and, if valid, generates new tokens and returns them.
 *
 * @async
 * @function autosignin
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Responds with new tokens if the refresh token is valid, otherwise returns unauthorized error.
 *
 * @throws {500} Returns status 500 if an internal server error occurs.
 */
const autosignin = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const admin = await Admin.findById(decoded._id);
        if (!admin) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const accessToken = await admin.createAccessToken();
        const refreshToken = await admin.createRefreshToken();

        res.status(200)
            .header('Authorization', `Bearer ${accessToken}`)
            .cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            })
            .cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            })
            .json({
                message: 'Login successful',
                accessToken,
            });
    } catch (error) {
        console.error('Autosignin error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Registers a new admin user (for development or initial setup only).
 *
 * Creates and saves a new admin with the provided username and password.
 *
 * @async
 * @function register
 * @param {import('express').Request} req - Express request object containing `username` and `password` in the body.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Responds with a success message or an appropriate error.
 *
 * @throws {400} If username already exists.
 * @throws {500} If an internal server error occurs.
 */
const register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = new Admin({ username, password });
        await admin.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export { login, logout, register, autosignin };
