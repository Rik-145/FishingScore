import { CreateSessionInput, Session, UpdateSessionInput } from '../types/session';
import * as sessionRepository                              from '../repositories/sessionRepository';

function isValidDate(value: string): boolean {
    const date = new Date(value);

    return !Number.isNaN(date.getTime());
}

export async function getUserSessions(userId: number): Promise<Session[]> {
    return sessionRepository.findSessionsByUserId(userId);
}

export async function getUserSessionById(sessionId: number, userId: number): Promise<Session> {
    const session = await sessionRepository.findSessionByIdAndUserId(sessionId, userId);

    if (!session) {
        throw new Error('Session not found');
    }

    return session;
}

export async function createSession(userId: number, input: CreateSessionInput): Promise<Session> {
    const title = input.title?.trim() || null;
    const location = input.location?.trim() || null;
    const notes = input.notes?.trim() || null;

    if (title && title.length < 2) {
        throw new Error('Session title must be at least 2 characters');
    }

    if (input.started_at && !isValidDate(input.started_at)) {
        throw new Error('Invalid start date');
    }

    if (input.ended_at && !isValidDate(input.ended_at)) {
        throw new Error('Invalid end date');
    }

    if (input.started_at && input.ended_at) {
        const startedAt = new Date(input.started_at);
        const endedAt = new Date(input.ended_at);

        if (endedAt < startedAt) {
            throw new Error('End date cannot be before start date');
        }
    }


    return sessionRepository.createSession(
        userId, {
            title: title ?? undefined,
            location: location ?? undefined,
            started_at: input.started_at,
            ended_at: input.ended_at,
            notes: notes ?? undefined
        });
}

export async function updateUserSession(sessionId: number, userId: number, input: UpdateSessionInput): Promise<Session> {
    if (!Number.isInteger(sessionId) || sessionId <= 0) {
        throw new Error('Invalid session id');
    }

    const title = input.title?.trim() || undefined;
    const location = input.location?.trim() || undefined;
    const notes = input.notes?.trim() || undefined;

    if (title !== undefined && title.length < 2) {
        throw new Error('Session title must be at least 2 characters');
    }

    if (input.started_at && !isValidDate(input.started_at)) {
        throw new Error('Invalid start date');
    }

    if (input.ended_at && !isValidDate(input.ended_at)) {
        throw new Error('Invalid end date');
    }

    if (input.started_at && input.ended_at) {
        const startedAt = new Date(input.started_at);
        const endedAt = new Date(input.ended_at);

        if (endedAt < startedAt) {
            throw new Error('End date cannot be before start date');
        }
    }

    const session = await sessionRepository.updateSessionByIdAndUserId(sessionId, userId,
        {
            ...input,
            title,
            location,
            notes
        }
    );

    if (!session) {
        throw new Error('Session not found');
    }

    return session;
}

export async function deleteUserSession(sessionId: number, userId: number): Promise<void> {
    if (!Number.isInteger(sessionId) || sessionId <= 0) {
        throw new Error('Invalid session id');
    }

    const deleted = await sessionRepository.deleteSessionByIdAndUserId(sessionId, userId);

    if (!deleted) {
        throw new Error('Session not found');
    }
}