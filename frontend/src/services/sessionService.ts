import { apiRequest }                                      from '@/lib/api';
import { CreateSessionInput, Session, UpdateSessionInput } from '@/types/session';

export function getMySessions(token: string): Promise<Session[]> {
    return apiRequest<Session[]>('/sessions', {
        token,
    });
}

export function getMySessionById(id: number, token: string): Promise<Session> {
    return apiRequest<Session>(`/sessions/${id}`, {
        token,
    });
}

export function createSession(input: CreateSessionInput, token: string): Promise<Session> {
    return apiRequest<Session>('/sessions', {
        method: 'POST',
        body: input,
        token,
    });
}

export function updateSession(id: number, input: UpdateSessionInput, token: string): Promise<Session> {
    return apiRequest<Session>(`/sessions/${id}`, {
        method: 'PATCH',
        body: input,
        token,
    });
}

export function deleteSession(id: number, token: string): Promise<void> {
    return apiRequest<void>(`/sessions/${id}`, {
        method: 'DELETE',
        token,
    });
}

export function finishSession(id: number, token: string): Promise<Session> {
    return apiRequest<Session>(`/sessions/${id}/finish`, {
        method: 'PATCH',
        token,
    });
}