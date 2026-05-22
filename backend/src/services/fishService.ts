import { CreateFishInput, Fish, UpdateFishInput } from '../types/fish';
import * as fishRepository                        from '../repositories/fishRepository';
import { AppError }                               from '../utils/AppError';

export async function getAllFish(): Promise<Fish[]> {
    return fishRepository.findAllFish();
}

export async function createFish(input: CreateFishInput): Promise<Fish> {
    const commonName = input.common_name.trim();

    if (commonName.length < 2) {
        throw new AppError('Fish common name must have at least 2 characters', 400);
    }

    return fishRepository.createFish({
        ...input,
        common_name: commonName,
    });
}

export async function updateFish(fishId: number, input: UpdateFishInput): Promise<Fish> {
    if (!Number.isInteger(fishId) || fishId <= 0) {
        throw new AppError('Invalid fish id', 400);
    }

    const commonName = input.common_name?.trim();

    if (commonName !== undefined && commonName.length < 2) {
        throw new AppError('Fish common name must have at least 2 characters', 400);
    }

    const scientificName = input.scientific_name?.trim();

    if (scientificName !== undefined && scientificName.length < 2) {
        throw new AppError('Fish scientific name must have at least 2 characters', 400);
    }

    if (input.category) {
        const allowedCategories = ['freshwater', 'saltwater', 'both', 'other'];

        if (!allowedCategories.includes(input.category)) {
            throw new AppError('Invalid fish category', 400);
        }
    }

    const fish = await fishRepository.updateFish(fishId, {
        ...input,
        common_name: commonName,
        scientific_name: scientificName
    });

    if (!fish) {
        throw new AppError('Fish not found', 404);
    }

    return fish;
}

export async function setFishActiveStatus(fishId: number, isActive: boolean): Promise<Fish> {
    if (!Number.isInteger(fishId) || fishId <= 0) {
        throw new AppError('Invalid fish id', 400);
    }

    const fish = await fishRepository.setFishActiveStatus(fishId, isActive);

    if (!fish) {
        throw new AppError('Fish not found', 404);
    }

    return fish;
}
