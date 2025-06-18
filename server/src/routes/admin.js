import { Router } from 'express';
import {
    autosignin,
    changePassword,
    login,
    logout,
    register,
    updateCron,
} from '../controllers/admin.js';
import authMiddleware from '../middlewares/auth.js';

const router = Router();
router.post('/login', login);
router.get('/auto', autosignin);
router.get('/logout', authMiddleware, logout);
router.post('/register', register);
router.post('/update-cron', authMiddleware, updateCron);
router.post('/change-password', authMiddleware, changePassword);

export default router;
