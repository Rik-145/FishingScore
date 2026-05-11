import { Request, Response } from 'express';
import * as fishService from '../services/fishService';

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