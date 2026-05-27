export type UserRole = 'admin' | 'moderator' | 'user';

export interface PublicUser {
    id: number;
    username: string;
    email: string;
    role: UserRole;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    last_login_at: string | null;
}

export interface AuthResponse {
    user: PublicUser;
    token: string;
}

export interface RegisterInput {
    username: string;
    email: string;
    password: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface UpdateProfileInput {
    username?: string;
    email?: string;
}

export interface ChangePasswordInput {
    current_password: string;
    new_password: string;
}

export interface DeactivateAccountInput {
    current_password: string;
}