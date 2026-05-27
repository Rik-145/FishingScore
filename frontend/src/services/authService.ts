import { apiRequest }                                          from '@/lib/api';
import { AuthResponse, LoginInput, PublicUser, RegisterInput } from '@/types/user';

export function register(input: RegisterInput): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/register', {
        method: 'POST',
        body: input,
    });
}

export function login(input: LoginInput): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/login', {
        method: 'POST',
        body: input,
    });
}

export function getMe(token: string): Promise<PublicUser> {
    return apiRequest<PublicUser>('/auth/me', {
        token,
    });
}