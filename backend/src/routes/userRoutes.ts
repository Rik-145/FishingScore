import { Router }           from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import * as userController from '../controllers/userController';

const router = Router();

router.patch('/me', authenticateToken, userController.updateMyProfile);
router.patch('/me/password', authenticateToken, userController.changeMyPassword);
router.patch('/me/deactivate', authenticateToken, userController.deactivateMyAccount);

export default router;