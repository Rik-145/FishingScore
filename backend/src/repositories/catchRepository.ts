import { pool }                                      from '../db/pool';
import { Catch, CreateCatchInput, UpdateCatchInput } from '../types/catch';

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
                    $6) 
            RETURNING 
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

export async function updateCatchByIdAndUserId(catchId: number, userId: number, input: UpdateCatchInput): Promise<Catch | null> {
    const result = await pool.query<Catch>(
        `
            UPDATE catches c
            SET fish_id      = COALESCE($3, c.fish_id),
                session_id   = COALESCE($4, c.session_id),
                weight_grams = COALESCE($5, c.weight_grams),
                length_cm    = COALESCE($6, c.length_cm),
                caught_at    = COALESCE($7, c.caught_at),
                notes        = COALESCE($8, c.notes),
                updated_at   = NOW() 
            FROM sessions s
            WHERE c.session_id = s.id
              AND c.id = $1
              AND s.user_id = $2
            RETURNING
                c.id,
                c.fish_id,
                c.session_id,
                c.weight_grams,
                c.length_cm,
                c.caught_at,
                c.notes,
                c.created_at,
                c.updated_at
            `,
        [
            catchId,
            userId,
            input.fish_id,
            input.session_id,
            input.weight_grams,
            input.length_cm,
            input.caught_at,
            input.notes
        ]
    );

    return result.rows[0] ?? null;
}

export async function deleteCatchByIdAndUserId(catchId: number, userId: number): Promise<boolean> {
    const result = await pool.query(
        `
            DELETE
            FROM catches c 
            USING sessions s
            WHERE c.session_id = s.id
              AND c.id = $1
              AND s.user_id = $2
        `,
        [
            catchId,
            userId,
        ]
    );

    return (result.rowCount ?? 0) > 0;
}