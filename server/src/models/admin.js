import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * Mongoose schema for the Admin model.
 *
 * Represents an administrator with authentication credentials.
 *
 * @typedef {Object} Admin
 * @property {string} username - Unique username for the admin. Required.
 * @property {string} password - Hashed password for the admin. Required.
 * @property {string} [refreshToken] - Optional refresh token for session management.
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
    },
    refreshToken: {
        type: String,
    },
});

adminSchema.pre('save', function (next) {
    if (this.isModified) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});

adminSchema.methods.comparePassword = function (token) {
    return bcrypt.compareSync(token, this.password);
};

adminSchema.methods.createAccessToken = function () {
    return jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
};

adminSchema.methods.createRefreshToken = function () {
    return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
};

export default mongoose.model('Admin', adminSchema);
