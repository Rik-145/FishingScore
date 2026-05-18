import { CreateFishInput, Fish, UpdateFishInput } from '../types/fish';
import * as fishRepository                        from '../repositories/fishRepository';

export async function getAllFish(): Promise<Fish[]> {
    return fishRepository.findAllFish();
}

export async function createFish(input: CreateFishInput): Promise<Fish> {
    const commonName = input.common_name.trim();

    if (commonName.length < 2) {
        throw new Error("Fish common name must have at least 2 characters");
    }

    return fishRepository.createFish({
        ...input,
        common_name: commonName,
    });
}

export async function updateFish(fishId: number, input: UpdateFishInput): Promise<Fish> {
    if (!Number.isInteger(fishId) || fishId <= 0) {
        throw new Error('Invalid fish id');
    }

    const commonName = input.common_name?.trim();

    if (commonName !== undefined && commonName.length < 2) {
        throw new Error('Fish common name must have at least 2 characters');
    }

    const scientificName = input.scientific_name?.trim();

    if (scientificName !== undefined && scientificName.length < 2) {
        throw new Error('Fish scientific name must have at least 2 characters');
    }

    if (input.category) {
        const allowedCategories = ['freshwater', 'saltwater', 'both', 'other'];

        if (!allowedCategories.includes(input.category)) {
            throw new Error('Invalid fish category');
        }
    }

    const fish = await fishRepository.updateFish(fishId, {
        ...input,
        common_name: commonName,
        scientific_name: scientificName
    });

    if (!fish) {
        throw new Error('Fish not found');
    }

    return fish;
}

export async function setFishActiveStatus(fishId: number, isActive: boolean): Promise<Fish> {
    if (!Number.isInteger(fishId) || fishId <= 0) {
        throw new Error('Invalid fish id');
    }

    const fish = await fishRepository.setFishActiveStatus(fishId, isActive);

    if (!fish) {
        throw new Error('Fish not found');
    }

    return fish;
}
