import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

/**
 * Middleware to authenticate admin users using JWT tokens.
 *
 * Extracts the token from cookies or the Authorization header, verifies it,
 * and attaches the authenticated admin object to the request. If authentication fails,
 * responds with a 401 Unauthorized status.
 *
 * @async
 * @function authMiddleware
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<void>} Responds with 401 if authentication fails, otherwise calls next().
 *
 * @throws {Error} If token verification fails or admin is not found.
 */
const authMiddleware = async (req, res, next) => {
    try {
        const token =
            req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const admin = await Admin.findById(decoded._id);
        if (!admin) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.admin = admin;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

export default authMiddleware;
