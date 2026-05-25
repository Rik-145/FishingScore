import { Response }             from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import * as scoreService        from '../services/scoreService';
import { AppError }             from '../utils/AppError';

export async function getLeaderboard(req: AuthenticatedRequest, res: Response): Promise<void> {
    const leaderboard = await scoreService.getLeaderboard();

    res.json(leaderboard);
}

export async function getMyScore(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
        throw new AppError('Unauthenticated', 401);
    }

    const score = await scoreService.getMyScore(req.user.userId);

    if (!score) {
        res.json({
            user_id: req.user.userId,
            total_sessions: 0,
            total_catches: 0,
            total_weight_grams: 0,
            total_length_cm: 0,
            total_score: 0
        });
        return;
    }

    res.json(score);
}

export async function getMySessionScores(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
        throw new AppError('Unauthenticated', 401);
    }

    const scores = await scoreService.getMySessionScores(req.user.userId);

    res.json(scores);
}