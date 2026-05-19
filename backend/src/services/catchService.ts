import { Catch, CreateCatchInput, UpdateCatchInput } from "../types/catch";
import * as catchRepository                          from '../repositories/catchRepository';
import * as fishRepository                           from '../repositories/fishRepository';
import * as sessionRepository                        from '../repositories/sessionRepository';

function isValidDate(value: string): boolean {
    const date = new Date(value);

    return !Number.isNaN(date.getTime());
}

function validatePositiveInteger(value: number, fieldName: string): void {
    if (!Number.isInteger(value) || value <= 0) {
        throw new Error(`${fieldName} must be a positive integer`);
    }
}

function validateOptionalPositiveNumber(value: number | null | undefined, fieldName: string): void {
    if (value === undefined || value === null) {
        return;
    }

    if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
        throw new Error(`${fieldName} must be a positive number`);
    }
}


export async function getUserCatches(userId: number): Promise<Catch[]> {
    return catchRepository.findCatchesByUserId(userId);
}

export async function getUserCatchById(catchId: number, userId: number): Promise<Catch> {
    const catchItem = await catchRepository.findCatchByIdAndUserId(catchId, userId);

    if (!catchItem) {
        throw new Error('Catch not found');
    }

    return catchItem;
}

export async function createCatch(userId: number, input: CreateCatchInput): Promise<Catch> {
    validatePositiveInteger(input.fish_id, 'Fish id');
    validatePositiveInteger(input.session_id, 'Session ID');

    validateOptionalPositiveNumber(input.weight_grams, 'Weight');
    validateOptionalPositiveNumber(input.length_cm, 'Length');

    if (input.caught_at && !isValidDate(input.caught_at)) {
        throw new Error('Invalid caught date');
    }

    const session = await sessionRepository.findSessionByIdAndUserId(input.session_id, userId);

    if (!session) {
        throw new Error('Session not found');
    }

    const fish = await fishRepository.findFishById(input.fish_id);

    if (!fish) {
        throw new Error('Fish not found');
    }

    const notes = input.notes?.trim() || null;

    return catchRepository.createCatch({
        fish_id: input.fish_id,
        session_id: input.session_id,
        weight_grams: input.weight_grams,
        length_cm: input.length_cm,
        caught_at: input.caught_at,
        notes: notes ?? undefined
    });
}

export async function updateUserCatch(catchId: number, userId: number, input: UpdateCatchInput): Promise<Catch> {
    validatePositiveInteger(catchId, 'Catch id');

    if (input.fish_id !== undefined) {
        validatePositiveInteger(input.fish_id, 'Fish id');

        const fish = await fishRepository.findFishById(input.fish_id);

        if (!fish) {
            throw new Error('Fish not found');
        }
    }

    if (input.session_id !== undefined) {
        validatePositiveInteger(input.session_id, 'Session id');

        const session = await sessionRepository.findSessionByIdAndUserId(input.session_id, userId);

        if (!session) {
            throw new Error('Session not found');
        }
    }

    validateOptionalPositiveNumber(input.weight_grams, 'Weight');
    validateOptionalPositiveNumber(input.length_cm, 'Length');

    if (input.caught_at && !isValidDate(input.caught_at)) {
        throw new Error('Invalid caught date');
    }

    const notes = input.notes?.trim() || undefined;

    const catchItem = await catchRepository.updateCatchByIdAndUserId(catchId, userId,
        {
            ...input,
            notes
        }
    );

    if (!catchItem) {
        throw new Error('Catch not found');
    }

    return catchItem;
}

export async function deleteUserCatch(catchId: number, userId: number): Promise<void> {
    validatePositiveInteger(catchId, 'Catch id');

    const deleted = await catchRepository.deleteCatchByIdAndUserId(catchId, userId);

    if (!deleted) {
        throw new Error('Catch not found');
    }
}