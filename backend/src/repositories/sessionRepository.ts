import { pool }                                            from '../db/pool';
import { CreateSessionInput, Session, UpdateSessionInput } from '../types/session';

export async function findSessionsByUserId(userId: number): Promise<Session[]> {
    const result = await pool.query<Session>(
        `
            SELECT id,
                   user_id,
                   title,
                   location,
                   started_at,
                   ended_at,
                   notes,
                   created_at,
                   updated_at
            FROM sessions
            WHERE user_id = $1
            ORDER BY started_at DESC
        `,
        [userId]
    );

    return result.rows;
}

export async function findSessionByIdAndUserId(sessionId: number, userId: number): Promise<Session | null> {
    const result = await pool.query<Session>(
        `
            SELECT id,
                   user_id,
                   title,
                   location,
                   started_at,
                   ended_at,
                   notes,
                   created_at,
                   updated_at
            FROM sessions
            WHERE id = $1
              AND user_id = $2 LIMIT 1
        `,
        [sessionId, userId]
    );

    return result.rows[0] ?? null;
}

export async function createSession(userId: number, input: CreateSessionInput): Promise<Session> {
    const result = await pool.query<Session>(
        `
            INSERT INTO sessions(user_id,
                                 title,
                                 location,
                                 started_at,
                                 ended_at,
                                 notes)
            VALUES ($1,
                    $2,
                    $3,
                    COALESCE($4, NOW()),
                    $5,
                    $6) RETURNING
                id,
                user_id,
                title,
                location,
                started_at,
                ended_at,
                notes,
                created_at,
                updated_at
        `,
        [
            userId,
            input.title ?? null,
            input.location ?? null,
            input.started_at ?? null,
            input.ended_at ?? null,
            input.notes ?? null
        ]
    );

    return result.rows[0];
}

export async function updateSessionByIdAndUserId(sessionId: number, userId: number, input: UpdateSessionInput): Promise<Session | null> {
    const result = await pool.query<Session>(
        `
            UPDATE sessions
            SET title      = COALESCE($3, title),
                location   = COALESCE($4, location),
                started_at = COALESCE($5, started_at),
                ended_at   = COALESCE($6, ended_at),
                notes      = COALESCE($7, notes),
                updated_at = NOW()
            WHERE id = $1
              AND user_id = $2 RETURNING
                id,
                user_id,
                title,
                location,
                started_at,
                ended_at,
                notes,
                created_at,
                updated_at
        `,
        [
            sessionId,
            userId,
            input.title,
            input.location,
            input.started_at,
            input.ended_at,
            input.notes
        ]
    );

    return result.rows[0] ?? null;
}

export async function deleteSessionByIdAndUserId(sessionId: number, userId: number): Promise<boolean> {
    const result = await pool.query(
        `
            DELETE
            FROM sessions
            WHERE id = $1
              AND user_id = $2
        `,
        [
            sessionId,
            userId
        ]
    );

    return (result.rowCount ?? 0) > 0;
}