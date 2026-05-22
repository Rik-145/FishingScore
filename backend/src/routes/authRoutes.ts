import { Router }           from 'express';
import { authenticateToken } from "../middleware/authMiddleware";
import * as authController from '../controllers/authController';
import { asyncHandler }    from "../utils/asyncHandler";

const router = Router();

router.post('/register', asyncHandler(authController.register));
router.post('/login', asyncHandler(authController.login));
router.get('/me', authenticateToken, asyncHandler(authController.me));

export default router;