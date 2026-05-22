import { Response }             from 'express';
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import * as catchService        from '../services/catchService';
import { AppError }             from "../utils/AppError";

export async function getMyCatches(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
        throw new AppError('Unauthenticated', 401);
    }

    const catches = await catchService.getUserCatches(req.user.userId);

    res.json(catches);
}

export async function getMyCatchById(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
        throw new AppError('Unauthenticated', 401);
    }

    const catchId = Number(req.params.id);

    if (Number.isNaN(catchId)) {
        throw new AppError('Invalid catch id', 400);
    }

    const catchItem = await catchService.getUserCatchById(catchId, req.user.userId);

    res.json(catchItem);
}

export async function createCatch(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
        throw new AppError('Unauthenticated', 401);
    }

    const catchItem = await catchService.createCatch(req.user.userId, req.body);

    res.status(201).json(catchItem);
}

export async function updateMyCatch(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
        throw new AppError('Unauthenticated', 401);
    }

    const catchId = Number(req.params.id);

    if (Number.isNaN(catchId)) {
        throw new AppError('Invalid catch id', 400);
    }

    const catchItem = await catchService.updateUserCatch(catchId, req.user.userId, req.body);

    res.json(catchItem);
}

export async function deleteMyCatch(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
        throw new AppError('Unauthenticated', 401);
    }

    const catchId = Number(req.params.id);

    if (Number.isNaN(catchId)) {
        throw new AppError('Invalid catch id', 400);
    }

    await catchService.deleteUserCatch(catchId, req.user.userId);

    res.status(204).send();
}