import { CreateSessionInput, Session } from '../types/session';
import * as sessionRepository          from '../repositories/sessionRepository';

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