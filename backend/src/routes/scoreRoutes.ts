import { Router }            from 'express';
import { authenticateToken } from "../middleware/authMiddleware";
import * as scoreController  from "../controllers/scoreController";
import { asyncHandler }      from "../utils/asyncHandler";

const router = Router();

router.get('/leaderboard', asyncHandler(scoreController.getLeaderboard));
router.get('/me', authenticateToken, asyncHandler(scoreController.getMyScore));
router.get('/sessions', authenticateToken, asyncHandler(scoreController.getMySessionScores));

export default router;