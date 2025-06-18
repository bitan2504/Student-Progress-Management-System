import user_info from '../utils/codeforces/api/user_info.js';
import Student from '../models/student.js';
import submissions from '../utils/codeforces/api/submissions.js';

/**
 * Adds a new student to the database after checking for duplicates.
 *
 * @async
 * @function addStudent
 * @param {import('express').Request} req - Express request object containing name, email, phoneNumber, and codeforcesHandle in the body.
 * @param {import('express').Response} res - Express response object used to send the response.
 * @returns {Promise<void>} Sends a success message upon successful creation or an error message if something goes wrong.
 *
 * @throws {401} If a student with the same email, phoneNumber, or Codeforces handle already exists.
 * @throws {500} If an internal server error occurs.
 */
const addStudent = async (req, res) => {
    try {
        // Extract student details from request body
        const { name, email, phoneNumber, codeforcesHandle } = req.body;

        const existingStudent = await Student.findOne({
            $or: [{ email }, { phoneNumber }, { codeforcesHandle }],
        });

        if (existingStudent) {
            return res.status(401).json({
                message:
                    'Student with same email, phone number or codeforces handle already exists',
            });
        }

        const codeforcesData = await user_info([codeforcesHandle]);

        // Create a new student document
        const newStudent = new Student({
            name,
            email,
            phoneNumber,
            codeforcesHandle,
            codeforcesData: codeforcesData[0],
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
};

/**
 * Edits the details of an existing student based on provided ID.
 * Also updates the Codeforces info if the handle has changed.
 *
 * @async
 * @function editStudent
 * @param {import('express').Request} req - Express request object containing _id, name, email, phoneNumber, and codeforcesHandle in the body.
 * @param {import('express').Response} res - Express response object used to send the response.
 * @returns {Promise<void>} Sends updated student data and a success message if successful.
 *
 * @throws {401} If no student found or duplicate exists with the same email/handle/phone.
 * @throws {500} If an internal server error occurs.
 */
const editStudent = async (req, res) => {
    try {
        // Extract student details from request body
        const { _id, name, email, phoneNumber, codeforcesHandle } = req.body;

        // Log the incoming request for debugging
        console.log('Editing Student: ', {
            _id,
            name,
            email,
            phoneNumber,
            codeforcesHandle,
        });

        // edit student data and check if duplicate exists
        const student = await Student.findById(_id);
        if (!student) {
            return res.status(401).json({ message: 'An unkwon error ocurred' });
        }

        const existingStudents = await Student.find({
            $or: [{ email, phoneNumber, codeforcesHandle }],
        });
        console.log(existingStudents);
        if (
            existingStudents.filter((item) => String(item._id) !== _id).length >
            0
        ) {
            return res.status(401).json({
                message:
                    'Student with given email, phone number or codeforces handle already exists',
            });
        }
        student.name = name;
        student.email = email;
        student.phoneNumber = phoneNumber;

        if (student.codeforcesHandle !== codeforcesHandle) {
            student.codeforcesHandle = codeforcesHandle;
            const codeforcesData = await user_info([codeforcesHandle]);
            student.codeforcesData = codeforcesData[0];
        }
        // Save the student to the database
        await student.save();

        const data = student.toObject();
        if (data.codeforcesData) {
            data.rating = data.codeforcesData.rating;
            data.rank = data.codeforcesData.rank;
            data.maxRating = data.codeforcesData.maxRating;
            data.maxRank = data.codeforcesData.maxRank;
        } else {
            data.rating = 'N/A';
            data.rank = 'N/A';
            data.maxRating = 'N/A';
            data.maxRank = 'N/A';
        }

        // Log success and send response
        console.log('Student editted successfully:', data._id);
        res.status(201).json({
            data: data,
            message: 'Student editted successfully',
        });
    } catch (error) {
        // Log error details for debugging
        console.error('Error adding student:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Fetches a paginated list of students.
 *
 * @async
 * @function fetchPage
 * @param {import('express').Request} req - Express request object with optional query params `start` and `limit`.
 * @param {import('express').Response} res - Express response object used to send the response.
 * @returns {Promise<void>} Sends a paginated array of student documents.
 *
 * @throws {500} If an internal server error occurs.
 */
const fetchPage = async (req, res) => {
    try {
        let { start, limit } = req.query;
        start = start || 0;
        limit = limit || 25;

        // Log the pagination parameters
        console.log(`Fetching students from ${start} with limit ${limit}`);

        // Fetch students using aggregation with skip and limit
        const students = await Student.aggregate([
            { $skip: parseInt(start) * parseInt(limit) },
            { $limit: parseInt(limit) },
            { $project: { __v: 0 } },
        ]);

        console.log(students.codeforcesData);
        students.forEach((student, index) => {
            if (student.codeforcesData) {
                student.rating = student.codeforcesData.rating;
                student.rank = student.codeforcesData.rank;
                student.maxRating = student.codeforcesData.maxRating;
                student.maxRank = student.codeforcesData.maxRank;
            } else {
                student.rating = 'N/A';
                student.rank = 'N/A';
                student.maxRating = 'N/A';
                student.maxRank = 'N/A';
            }
        });

        // Log the number of students fetched
        console.log(`Fetched ${students.length} students`);

        res.status(400).json({
            students,
            message: 'Students fetched successfully',
        });
    } catch (error) {
        // Log error details for debugging
        console.error('Error fetching student:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Fetches Codeforces user data for a single handle stored in the database.
 *
 * @async
 * @function fetchCodeforcesInfo
 * @param {import('express').Request} req - Express request object containing `codeforcesHandle` in the body.
 * @param {import('express').Response} res - Express response object used to send the response.
 * @returns {Promise<void>} Sends the codeforcesData object associated with the handle.
 *
 * @throws {400} If the handle is missing.
 * @throws {500} If an internal server error occurs or student is not found.
 */
const fetchCodeforcesInfo = async (req, res) => {
    try {
        const { codeforcesHandle } = req.body;

        // Validate input
        if (!codeforcesHandle) {
            console.warn('Invalid Codeforces handle:', codeforcesHandle);
            return res
                .status(400)
                .json({ message: 'Invalid Codeforces handle' });
        }

        // Log the handles being fetched
        console.log('Fetching Codeforces info for handle:', codeforcesHandle);

        // Fetch user info from Codeforces API
        const userInfo = await Student.findOne({ codeforcesHandle });

        if (!userInfo) {
            console.error('Error fetching student info:', error);
            res.status(500).json({ message: 'An unknown error occurred' });
        }

        // Log success and send response
        console.log('Fetched Codeforces user info successfully');
        res.status(200).json({
            data: userInfo?.codeforcesData,
            message: 'Fetched Codeforces user info successfully',
        });
    } catch (error) {
        // Log error details for debugging
        console.error('Error fetching student info:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Fetches Codeforces submission data for a specific user handle.
 *
 * @async
 * @function fetchSubmissions
 * @param {import('express').Request} req - Express request object containing `codeforcesHandle` in the body.
 * @param {import('express').Response} res - Express response object used to send the response.
 * @returns {Promise<void>} Sends an array of submission data or an error message.
 *
 * @throws {400} If the handle is not provided.
 * @throws {404} If no submissions are found.
 * @throws {500} If an internal server error occurs.
 */
const fetchSubmissions = async (req, res) => {
    try {
        const { codeforcesHandle } = req.body;

        if (!codeforcesHandle) {
            return res
                .status(400)
                .json({ message: 'Invalid Codeforces handle' });
        }
        console.log('Fetching submissions for handle:', codeforcesHandle);

        // Fetch submissions from Codeforces API
        const response = await submissions(codeforcesHandle);
        if (!response || response.length === 0) {
            return res.status(404).json({ message: 'No submissions found' });
        }

        // Log success and send response
        console.log('Fetched submissions successfully');
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export {
    addStudent,
    fetchPage,
    fetchCodeforcesInfo,
    fetchSubmissions,
    editStudent,
};
