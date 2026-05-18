import { Response }             from 'express';
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import * as catchService        from '../services/catchService';

export async function getMyCatches(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({
                message: 'Unauthenticated'
            });
            return;
        }

        const catches = await catchService.getUserCatches(req.user.userId);

        res.json(catches);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch catches'
        });
    }
}

export async function getMyCatchById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({
                message: 'Unauthenticated'
            });
            return;
        }

        const catchId = Number(req.params.id);

        if (Number.isNaN(catchId)) {
            res.status(400).json({
                message: 'Invalid Catch ID'
            });
            return;
        }
        
        const catchItem = await catchService.getUserCatchById(catchId, req.user.userId);

        res.json(catchItem);
    } catch (error) {
        res.status(404).json({
            message: error instanceof Error ? error.message : 'Catch not found'
        });
    }
}

export async function createCatch(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({
                message: 'Unauthenticated'
            });
            return;
        }

        const catchItem = await catchService.createCatch(req.user.userId, req.body);

        res.status(201).json(catchItem);
    } catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : 'Failed to create catch'
        });
    }
}