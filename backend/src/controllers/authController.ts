import { Request, Response }    from 'express';
import * as authService         from '../services/authService';
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import * as userRepository  from '../repositories/userRepository';

export async function register(req: Request, res: Response): Promise<void> {
    try {
        const result = await authService.register(req.body);

        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : 'Failed to register user'
        });
    }
}

export async function login(req: Request, res: Response): Promise<void> {
    try {
        const result = await authService.login(req.body);

        res.json(result);
    } catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : 'Failed to login'
        });
    }
}

export async function me(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({
                message: 'Unauthenticated'
            });
            return;
        }

        const user = await userRepository.findPublicUserById(req.user.userId);

        if (!user) {
            res.status(404).json({
                message: 'User not found'
            });
            return;
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch current user'
        });
    }
}