import { pool }                             from '../db/pool';
import { CreateUserData, PublicUser, User } from '../types/user';

export async function findUserByEmail(email: string): Promise<User | null> {
    const result = await pool.query<User>(
        `
            SELECT id,
                   username,
                   email,
                   password_hash,
                   role,
                   is_active,
                   created_at,
                   updated_at,
                   last_login_at
            FROM users
            WHERE email = $1 LIMIT 1
        `,
        [email]
    );

    return result.rows[0] ?? null;
}

export async function findPublicUserById(id: number): Promise<PublicUser | null> {
    const result = await pool.query<PublicUser>(
        `
            SELECT id,
                   username,
                   email,
                   role,
                   is_active,
                   created_at,
                   updated_at,
                   last_login_at
            FROM users
            WHERE id = $1 LIMIT 1
        `,
        [id]
    );

    return result.rows[0] ?? null;
}

export async function createUser(input: CreateUserData): Promise<PublicUser> {
    const result = await pool.query<PublicUser>(
        `
            INSERT INTO users (username, email, password_hash)
            VALUES ($1, $2, $3) RETURNING 
                id, 
                username, 
                email, 
                role, 
                is_active, 
                created_at, 
                updated_at, 
                last_login_at
        `,
        [
            input.username,
            input.email,
            input.password_hash
        ]
    );

    return result.rows[0];
}

export async function updateLastLogin(userId: number): Promise<void> {
    await pool.query(
        `
            UPDATE users
            SET last_login_at = NOW(),
                updated_at    = NOW()
            WHERE id = $1
        `, [userId]
    );
}