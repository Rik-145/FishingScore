import { Router }           from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import * as userController from '../controllers/userController';
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.patch('/me', authenticateToken, asyncHandler(userController.updateMyProfile));
router.patch('/me/password', authenticateToken, asyncHandler(userController.changeMyPassword));
router.patch('/me/deactivate', authenticateToken, asyncHandler(userController.deactivateMyAccount));

export default router;