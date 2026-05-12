import bcrypt                                    from 'bcrypt';
import jwt                                       from 'jsonwebtoken';
import { LoginInput, PublicUser, RegisterInput } from "../types/user";
import * as userRepository                       from '../repositories/userRepository';

interface AuthResult {
    user: PublicUser;
    token: string;
}

function createToken(user: PublicUser): string {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error('JWT secret is not configured');
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
        throw new Error('Username must have at least 3 characters');
    }

    if (input.password.length < 6) {
        throw new Error('Password must have at least 6 characters');
    }

    const existingUser = await userRepository.findUserByEmail(email);

    if (existingUser) {
        throw new Error('Email is already in use');
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
        throw new Error('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(input.password, user.password_hash);

    if (!passwordMatches) {
        throw new Error('Invalid email or password');
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