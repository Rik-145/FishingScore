import { pool }                    from '../db/pool';
import { Catch, CreateCatchInput } from '../types/catch';

export async function findCatchesByUserId(userId: number): Promise<Catch[]> {
    const result = await pool.query<Catch>(
        `
            SELECT c.id,
                   c.fish_id,
                   c.session_id,
                   c.weight_grams,
                   c.length_cm,
                   c.caught_at,
                   c.notes,
                   c.created_at,
                   c.updated_at
            FROM catches c
                     JOIN sessions s ON s.id = c.session_id
            WHERE s.user_id = $1
            ORDER BY c.caught_at DESC
        `,
        [userId]
    );

    return result.rows;
}

export async function findCatchByIdAndUserId(catchId: number, userId: number): Promise<Catch | null> {
    const result = await pool.query<Catch>(
        `
            SELECT c.id,
                   c.fish_id,
                   c.session_id,
                   c.weight_grams,
                   c.length_cm,
                   c.caught_at,
                   c.notes,
                   c.created_at,
                   c.updated_at
            FROM catches c
                     JOIN sessions s ON s.id = c.session_id
            WHERE c.id = $1
              AND s.user_id = $2 LIMIT 1
        `,
        [catchId, userId]
    );

    return result.rows[0] ?? null;
}

export async function createCatch(input: CreateCatchInput): Promise<Catch> {
    const result = await pool.query<Catch>(
        `
            INSERT INTO catches (fish_id,
                                 session_id,
                                 weight_grams,
                                 length_cm,
                                 caught_at,
                                 notes)
            VALUES ($1,
                    $2,
                    $3,
                    $4,
                    COALESCE($5, NOW()),
                    $6) RETURNING 
            id,
            fish_id,
            session_id,
            weight_grams,
            length_cm,
            caught_at,
            notes,
            created_at,
            updated_at
        `,
        [
            input.fish_id,
            input.session_id,
            input.weight_grams ?? null,
            input.length_cm ?? null,
            input.caught_at ?? null,
            input.notes ?? null
        ]
    );

    return result.rows[0];
}