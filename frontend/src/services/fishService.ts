import { apiRequest }                             from '@/lib/api';
import { CreateFishInput, Fish, UpdateFishInput } from '@/types/fish';

export function getAllFish(): Promise<Fish[]> {
    return apiRequest<Fish[]>('/fish');
}

export function createFish(input: CreateFishInput, token: string): Promise<Fish> {
    return apiRequest<Fish>('/fish', {
        method: 'POST',
        body: input,
        token,
    });
}

export function updateFish(id: number, input: UpdateFishInput, token: string): Promise<Fish> {
    return apiRequest<Fish>(`/fish/${id}`, {
        method: 'PATCH',
        body: input,
        token,
    });
}

export function deactivateFish(id: number, token: string): Promise<Fish> {
    return apiRequest<Fish>(`/fish/${id}/deactivate`, {
        method: 'PATCH',
        token,
    });
}

export function activateFish(id: number, token: string): Promise<Fish> {
    return apiRequest<Fish>(`/fish/${id}/activate`, {
        method: 'PATCH',
        token,
    });
}