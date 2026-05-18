import { Request, Response } from 'express';
import * as fishService      from '../services/fishService';

export async function getAllFish(req: Request, res: Response): Promise<void> {
    try {
        const fish = await fishService.getAllFish();

        res.json(fish);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch fish",
        });
    }
}

export async function createFish(req: Request, res: Response): Promise<void> {
    try {
        const fish = await fishService.createFish(req.body);

        res.status(201).json(fish);
    } catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : "Failed to create fish",
        });
    }
}

export async function updateFish(req: Request, res: Response): Promise<void> {
    try {
        const fishId = Number(req.params.id);

        if (Number.isNaN(fishId)) {
            res.status(400).json({
                message: 'Invalid fish id',
            });
            return;
        }

        const fish = await fishService.updateFish(fishId, req.body);

        res.json(fish);
    } catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : "Failed to update fish"
        });
    }
}

export async function deactivateFish(req: Request, res: Response): Promise<void> {
    try {
        const fishId = Number(req.params.id);

        if (Number.isNaN(fishId)) {
            res.status(400).json({
                message: 'Invalid fish id',
            });
            return;
        }

        const fish = await fishService.setFishActiveStatus(fishId, false);

        res.json(fish);
    } catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : "Failed to deactivate fish"
        });
    }
}

export async function activateFish(req: Request, res: Response): Promise<void> {
    try {
        const fishId = Number(req.params.id);

        if (Number.isNaN(fishId)) {
            res.status(400).json({
                message: 'Invalid fish id',
            });
            return;
        }

        const fish = await fishService.setFishActiveStatus(fishId, true);

        res.json(fish);
    } catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : "Failed to activate fish",
        });
    }
}