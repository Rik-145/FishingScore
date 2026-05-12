import { Router }           from 'express';
import { authenticateToken } from "../middleware/authMiddleware";
import * as authController  from '../controllers/authController';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticateToken, authController.me);

export default router;