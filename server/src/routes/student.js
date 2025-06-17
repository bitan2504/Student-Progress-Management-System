import { Router } from 'express';
import {
    addStudent,
    fetchCodeforcesInfo,
    fetchPage,
    fetchSubmissions,
    editStudent,
} from '../controllers/student.js';
import authMiddleware from '../middlewares/auth.js';

const router = Router();

router.post('/addStudent', authMiddleware, addStudent);
router.post('/editStudent', authMiddleware, editStudent);
router.post('/fetchCodeforcesInfo', authMiddleware, fetchCodeforcesInfo);
router.get('/fetchPage', authMiddleware, fetchPage);
router.post('/fetchSubmissions', authMiddleware, fetchSubmissions);

export default router;
