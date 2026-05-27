import { apiRequest }                                from '@/lib/api';
import { Catch, CreateCatchInput, UpdateCatchInput } from '@/types/catch';

export function getMyCatches(token: string): Promise<Catch[]> {
    return apiRequest<Catch[]>('/catches', {
        token,
    });
}

export function getMyCatchById(id: number, token: string): Promise<Catch> {
    return apiRequest<Catch>(`/catches/${id}`, {
        token,
    });
}

export function createCatch(input: CreateCatchInput, token: string): Promise<Catch> {
    return apiRequest<Catch>('/catches', {
        method: 'POST',
        body: input,
        token,
    });
}

export function updateCatch(id: number, input: UpdateCatchInput, token: string): Promise<Catch> {
    return apiRequest<Catch>(`/catches/${id}`, {
        method: 'PATCH',
        body: input,
        token,
    });
}

export function deleteCatch(id: number, token: string): Promise<void> {
    return apiRequest<void>(`/catches/${id}`, {
        method: 'DELETE',
        token,
    });
}