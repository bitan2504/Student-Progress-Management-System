import Admin from '../models/admin.js';

/**
 * Handles admin login requests.
 *
 * Authenticates an admin user by verifying the provided username and password.
 * If authentication is successful, generates and returns access and refresh tokens,
 * sets them as HTTP-only cookies, and includes the access token in the response header.
 *
 * @async
 * @function login
 * @param {import('express').Request} req - Express request object containing username and password in the body.
 * @param {import('express').Response} res - Express response object used to send the response.
 * @returns {Promise<void>} Sends a JSON response with a success message and access token if authentication succeeds,
 * or an error message if authentication fails.
 *
 * @throws {500} Internal server error if an unexpected error occurs during the login process.
 */
const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res
                .status(401)
                .json({ message: 'Invalid username or password' });
        }
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ message: 'Invalid username or password' });
        }
        const accessToken = await admin.createAccessToken();
        const refreshToken = await admin.createRefreshToken();
        res.status(200)
            .header('Authorization', `Bearer ${accessToken}`)
            .cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'none',
            })
            .cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
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

const logout = async (req, res) => {
    try {
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
        })
            .clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'none',
            })
            .status(200)
            .json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// for experimental purposes, this function is used to register a new admin
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

export { login, logout, register };
