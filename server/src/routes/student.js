import { Router } from 'express';
import { addStudent, fetchCodeforcesInfo, fetchPage } from '../controllers/student.js';

const router = Router();

router.post('/addStudent', addStudent);
router.get('/fetchCodeforcesInfo', fetchCodeforcesInfo);
router.get('/fetchPage', fetchPage);

export default router;