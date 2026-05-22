import { Response }             from 'express';
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import * as userService         from '../services/userService';

export async function updateMyProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({
                message: 'Unauthenticated'
            });
            return;
        }

        const user = await userService.updateProfile(
            req.user.userId,
            req.body
        );

        res.json(user);
    } catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : 'Failed to update profile'
        });
    }
}

export async function changeMyPassword(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({
                message: 'Unauthenticated'
            });
            return;
        }

        await userService.changePassword(req.user.userId, req.body);

        res.status(204).send();
    } catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : 'Failed to change password'
        });
    }
}

export async function deactivateMyAccount(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({
                message: 'Unauthenticated'
            });
            return;
        }

        await userService.deactivateAccount(req.user.userId, req.body);

        res.status(204).send();
    } catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : 'Failed to deactivate account'
        });
    }
}