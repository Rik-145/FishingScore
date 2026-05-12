export type UserRole = 'admin' | 'moderator' | 'user';

export interface User {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    role: UserRole;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    last_login_at: Date | null;
}

export interface PublicUser {
    id: number;
    username: string;
    email: string;
    role: UserRole;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    last_login_at: Date | null;
}

export interface CreateUserData {
    username: string;
    email: string;
    password_hash: string;
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