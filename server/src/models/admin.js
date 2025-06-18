import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * Mongoose schema for the Admin model.
 *
 * Represents an administrator account with login credentials and JWT-based authentication.
 *
 * @typedef {Object} Admin
 * @property {string} username - Unique and required username of the admin.
 * @property {string} password - Required hashed password of the admin.
 * @property {string} [refreshToken] - Optional refresh token used for session management.
 */
const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
});

/**
 * Pre-save hook to hash the password before saving the document.
 * Only hashes the password if it has been modified.
 */
adminSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});

/**
 * Compares a plain text password with the hashed password.
 *
 * @method
 * @param {string} password - The plain text password to compare.
 * @returns {boolean} True if passwords match, false otherwise.
 */
adminSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

/**
 * Generates a signed JWT access token.
 *
 * @method
 * @returns {string} A JWT access token valid for the configured duration.
 */
adminSchema.methods.createAccessToken = function () {
    return jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
};

/**
 * Generates a signed JWT refresh token.
 *
 * @method
 * @returns {string} A JWT refresh token valid for the configured duration.
 */
adminSchema.methods.createRefreshToken = function () {
    return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
};

export default mongoose.model('Admin', adminSchema);
