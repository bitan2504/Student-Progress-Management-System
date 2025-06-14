import user_info from "../utils/codeforces/api/user_info.js";
import student from "../models/student.js";

/**
 * Controller to add a new student to the database.
 * Expects the following fields in req.body:
 * - name: String
 * - email: String
 * - phoneNumber: String
 * - codeforcesHandle: String
 */
const addStudent = async (req, res) => {
    try {
        // Extract student details from request body
        const { name, email, phoneNumber, codeforcesHandle } = req.body;

        // Log the incoming request for debugging
        console.log('Adding new student:', { name, email, phoneNumber, codeforcesHandle });

        // Create a new student document
        const newStudent = new student({
            name,
            email,
            phoneNumber,
            codeforcesHandle
        });

        // Save the student to the database
        await newStudent.save();

        // Log success and send response
        console.log('Student added successfully:', newStudent._id);
        res.status(201).json({ message: 'Student added successfully' });
    } catch (error) {
        // Log error details for debugging
        console.error('Error adding student:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

/**
 * Controller to fetch a paginated list of students from the database.
 * Expects optional 'start' and 'limit' parameters in req.params.
 * Default: start = 0, limit = 25
 */
const fetchPage = async (req, res) => {
    try {
        let { start, limit } = req.params;
        start = start || 0;
        limit = limit || 25;

        // Log the pagination parameters
        console.log(`Fetching students from ${start} with limit ${limit}`);

        // Fetch students using aggregation with skip and limit
        const students = await student.aggregate([
            { $skip: parseInt(start) },
            { $limit: parseInt(limit) }
        ]);

        // Log the number of students fetched
        console.log(`Fetched ${students.length} students`);

        res.status(200).json({ students, message: 'Students fetched successfully' });
    } catch (error) {
        // Log error details for debugging
        console.error('Error fetching student:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

/**
 * Controller to fetch Codeforces user info for given handles.
 * Expects 'codeforcesHandles' array in req.body.
 */
const fetchCodeforcesInfo = async (req, res) => {
    try {
        const { codeforcesHandles } = req.body;

        // Validate input
        if (!codeforcesHandles || !Array.isArray(codeforcesHandles) || codeforcesHandles.length === 0) {
            console.warn('Invalid Codeforces handles:', codeforcesHandles);
            return res.status(400).json({ message: 'Invalid Codeforces handles' });
        }

        // Log the handles being fetched
        console.log('Fetching Codeforces info for handles:', codeforcesHandles);

        // Fetch user info from Codeforces API
        const userInfo = await user_info(codeforcesHandles);

        // Check if user info was found
        if (!userInfo || userInfo.length === 0) {
            console.warn('No user information found for handles:', codeforcesHandles);
            return res.status(404).json({ message: 'No user information found' });
        }

        // Log success and send response
        console.log('Fetched Codeforces user info successfully');
        res.status(200).json(userInfo);
    } catch (error) {
        // Log error details for debugging
        console.error('Error fetching student info:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { addStudent, fetchPage, fetchCodeforcesInfo };