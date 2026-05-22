import { Response }             from 'express';
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import * as userService         from '../services/userService';
import { AppError }             from "../utils/AppError";

export async function updateMyProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
        throw new AppError('Unauthenticated', 401);
    }

    const user = await userService.updateProfile(
        req.user.userId,
        req.body
    );

    res.json(user);
}

export async function changeMyPassword(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
        throw new AppError('Unauthenticated', 401);
    }

    await userService.changePassword(req.user.userId, req.body);

    res.status(204).send();
}

export async function deactivateMyAccount(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
        throw new AppError('Unauthenticated', 401);
    }

    await userService.deactivateAccount(req.user.userId, req.body);

    res.status(204).send();
}