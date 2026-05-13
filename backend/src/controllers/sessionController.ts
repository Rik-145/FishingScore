import { Response }             from 'express';
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import * as sessionService      from '../services/sessionService';

export async function getMySessions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({
                message: 'Unauthenticated'
            });
            return;
        }

        const sessions = await sessionService.getUserSessions(req.user.userId);

        res.json(sessions);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch sessions'
        });
    }
}

export async function getMySessionById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({
                message: 'Unauthenticated'
            });
            return;
        }

        const sessionId = Number(req.params.id);

        if (Number.isNaN(sessionId)) {
            res.status(400).json({
                message: 'Invalid session ID'
            });
            return;
        }

        const session = await sessionService.getUserSessionById(sessionId, req.user.userId);

        res.json(session);
    } catch (error) {
        res.status(404).json({
            message: error instanceof Error ? error.message : 'Session not found'
        });
    }
}

export async function createSession(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({
                message: 'Unauthenticated'
            });
            return;
        }

        const session = await sessionService.createSession(req.user.userId, req.body);

        res.status(201).json(session);
    } catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : 'Failed to create session'
        });
    }
}