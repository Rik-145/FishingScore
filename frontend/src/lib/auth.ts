import * as authService                            from '@/services/authService';
import { AuthResponse, LoginInput, RegisterInput } from '@/types/user';
import { removeToken, saveToken }                  from '@/lib/authStorage';

export async function login(input: LoginInput): Promise<AuthResponse> {
    const result = await authService.login(input);

    saveToken(result.token);

    return result;
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
    const result = await authService.register(input);

    saveToken(result.token);

    return result;
}

export function logout(): void {
    removeToken();
}