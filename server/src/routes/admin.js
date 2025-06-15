import { Router } from 'express';
import { login, logout, register } from '../controllers/admin.js';
import authMiddleware from '../middlewares/auth.js';

const router = Router();
router.post('/login', login);
router.get('/logout', authMiddleware, logout);
router.post('/register', register);

export default router;
