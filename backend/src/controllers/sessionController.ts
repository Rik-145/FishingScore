import { Response }             from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import * as sessionService      from '../services/sessionService';
import { AppError }             from '../utils/AppError';

export async function getMySessions(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
        throw new AppError('Unauthenticated', 401);
    }

    const sessions = await sessionService.getUserSessions(req.user.userId);

    res.json(sessions);
}

export async function getMySessionById(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
        throw new AppError('Unauthenticated', 401);
    }

    const sessionId = Number(req.params.id);

    if (Number.isNaN(sessionId)) {
        throw new AppError('Invalid session id', 400);
    }

    const session = await sessionService.getUserSessionById(sessionId, req.user.userId);

    res.json(session);
}

export async function createSession(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
        throw new AppError('Unauthenticated', 401);
    }

    const session = await sessionService.createSession(req.user.userId, req.body);

    res.status(201).json(session);
}

export async function updateMySession(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
        throw new AppError('Unauthenticated', 401);
    }

    const sessionId = Number(req.params.id);

    if (Number.isNaN(sessionId)) {
        throw new AppError('Invalid session id', 400);
    }

    const session = await sessionService.updateUserSession(
        sessionId,
        req.user.userId,
        req.body
    );

    res.json(session);
}

export async function deleteMySession(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
        throw new AppError('Unauthenticated', 401);
    }

    const sessionId = Number(req.params.id);

    if (Number.isNaN(sessionId)) {
        throw new AppError('Invalid session id', 400);
    }

    await sessionService.deleteUserSession(sessionId, req.user.userId);

    res.status(204).send();
}