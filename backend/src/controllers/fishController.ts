import { Request, Response } from 'express';
import * as fishService      from '../services/fishService';
import { AppError }          from "../utils/AppError";

export async function getAllFish(req: Request, res: Response): Promise<void> {
    const fish = await fishService.getAllFish();

    res.json(fish);
}

export async function createFish(req: Request, res: Response): Promise<void> {
    const fish = await fishService.createFish(req.body);

    res.status(201).json(fish);
}

export async function updateFish(req: Request, res: Response): Promise<void> {
    const fishId = Number(req.params.id);

    if (Number.isNaN(fishId)) {
        throw new AppError('Invalid fish id', 400);
    }

    const fish = await fishService.updateFish(fishId, req.body);

    res.json(fish);
}

export async function deactivateFish(req: Request, res: Response): Promise<void> {
    const fishId = Number(req.params.id);

    if (Number.isNaN(fishId)) {
        throw new AppError('Invalid fish id', 400);
    }

    const fish = await fishService.setFishActiveStatus(fishId, false);

    res.json(fish);
}

export async function activateFish(req: Request, res: Response): Promise<void> {
    const fishId = Number(req.params.id);

    if (Number.isNaN(fishId)) {
        throw new AppError('Invalid fish id', 400);
    }

    const fish = await fishService.setFishActiveStatus(fishId, true);

    res.json(fish);
}