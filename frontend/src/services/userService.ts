import { apiRequest }                                                                  from '@/lib/api';
import { ChangePasswordInput, DeactivateAccountInput, PublicUser, UpdateProfileInput } from '@/types/user';

export function updateMyProfile(input: UpdateProfileInput, token: string): Promise<PublicUser> {
    return apiRequest<PublicUser>('/users/me', {
        method: 'PATCH',
        body: input,
        token,
    });
}

export function changeMyPassword(input: ChangePasswordInput, token: string): Promise<void> {
    return apiRequest<void>('/users/me/password', {
        method: 'PATCH',
        body: input,
        token,
    });
}

export function deactivateMyAccount(input: DeactivateAccountInput, token: string): Promise<void> {
    return apiRequest<void>('/users/me/deactivate', {
        method: 'PATCH',
        body: input,
        token,
    });
}