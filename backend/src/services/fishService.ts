import { CreateFishInput, Fish } from '../types/fish';
import * as fishRepository from '../repositories/fishRepository';

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
