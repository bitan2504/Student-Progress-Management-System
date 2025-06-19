import mongoose from 'mongoose';

/**
 * Mongoose schema for the Student model.
 *
 * Represents a student with personal and Codeforces-related information.
 *
 * Fields:
 * @property {String} name - The full name of the student. Required and trimmed.
 * @property {String} email - The unique email address of the student. Required and trimmed.
 * @property {Number} phoneNumber - The 10-digit phone number of the student. Required and validated for format.
 * @property {String} codeforcesHandle - The Codeforces handle/username of the student. Required and trimmed.
 * @property {Number} currentRating - The current Codeforces rating of the student. Required.
 * @property {Number} maxRating - The maximum Codeforces rating achieved by the student. Required.
 */
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
        validate: {
            validator: function (v) {
                // Checks for a 10-digit phone number (adjust as needed)
                return /^\d{10}$/.test(v.toString());
            },
            message: (props) => `${props.value} is not a valid phone number!`,
        },
        unique: true,
    },
    codeforcesHandle: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    codeforcesData: {
        type: Object,
        default: {},
    },
    inactivityWarnings: {
        type: Number,
        default: 0,
    },
    contestHistory: {
        type: Array,
        default: [],
    },
});

export default mongoose.model('Student', studentSchema);
