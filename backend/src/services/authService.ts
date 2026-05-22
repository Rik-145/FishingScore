import bcrypt                                    from 'bcrypt';
import jwt                                       from 'jsonwebtoken';
import { LoginInput, PublicUser, RegisterInput } from "../types/user";
import * as userRepository                       from '../repositories/userRepository';
import { AppError }                              from "../utils/AppError";

interface AuthResult {
    user: PublicUser;
    token: string;
}

function createToken(user: PublicUser): string {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new AppError('JWT secret is not configured', 500);
    }

    return jwt.sign(
        {
            userId: user.id,
            role: user.role,
        },
        jwtSecret,
        {
            expiresIn: '7d',
        }
    );
}

export async function register(input: RegisterInput): Promise<AuthResult> {
    const username = input.username.trim();
    const email = input.email.trim().toLowerCase();

    if (username.length < 3) {
        throw new AppError('Username must have at least 3 characters', 400);
    }

    if (input.password.length < 6) {
        throw new AppError('Password must have at least 6 characters', 400);
    }

    const existingUser = await userRepository.findUserByEmail(email);

    if (existingUser) {
        throw new AppError('Email is already in use', 409);
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = await userRepository.createUser({
        username,
        email,
        password_hash: passwordHash
    });

    const token = createToken(user);

    return {
        user,
        token
    };
}

export async function login(input: LoginInput): Promise<AuthResult> {
    const email = input.email.trim().toLowerCase();

    const user = await userRepository.findUserByEmail(email);

    if (!user || !user.is_active) {
        throw new AppError('Invalid email or password', 401);
    }

    const passwordMatches = await bcrypt.compare(input.password, user.password_hash);

    if (!passwordMatches) {
        throw new AppError('Invalid email or password', 401);
    }

    await userRepository.updateLastLogin(user.id);

    const publicUser: PublicUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_login_at: new Date()
    };

    const token = createToken(publicUser);

    return {
        user: publicUser,
        token
    };
}