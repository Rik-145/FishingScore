import { Request, Response }    from 'express';
import * as authService         from '../services/authService';
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import * as userRepository      from '../repositories/userRepository';
import { AppError }             from "../utils/AppError";

export async function register(req: Request, res: Response): Promise<void> {
    const result = await authService.register(req.body);

    res.status(201).json(result);
}

export async function login(req: Request, res: Response): Promise<void> {
    const result = await authService.login(req.body);

    res.json(result);
}

export async function me(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
        throw new AppError('Unauthenticated', 401);
    }

    const user = await userRepository.findPublicUserById(req.user.userId);

    if (!user) {
        throw new AppError('User not found', 404);

    }

    res.json(user);
}