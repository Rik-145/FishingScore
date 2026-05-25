import { Router }             from "express";
import { authenticateToken }  from "../middleware/authMiddleware";
import * as sessionController from '../controllers/sessionController';
import { asyncHandler }       from "../utils/asyncHandler";

const router = Router();

router.get('/', authenticateToken, asyncHandler(sessionController.getMySessions));
router.get('/:id', authenticateToken, asyncHandler(sessionController.getMySessionById));
router.post('/', authenticateToken, asyncHandler(sessionController.createSession));
router.patch('/:id/finish', authenticateToken, asyncHandler(sessionController.finishMySession));
router.patch('/:id', authenticateToken, asyncHandler(sessionController.updateMySession));
router.delete('/:id', authenticateToken, asyncHandler(sessionController.deleteMySession));

export default router;