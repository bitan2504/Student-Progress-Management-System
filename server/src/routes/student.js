import { Router } from 'express';
import { addStudent, fetchCodeforcesInfo, fetchPage } from '../controllers/student.js';
import authMiddleware from '../middlewares/auth.js';

const router = Router();

router.post('/addStudent', authMiddleware, addStudent);
router.post('/fetchCodeforcesInfo', authMiddleware, fetchCodeforcesInfo);
router.get('/fetchPage', authMiddleware, fetchPage);

export default router;