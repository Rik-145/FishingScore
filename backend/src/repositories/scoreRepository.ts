import { pool }            from '../db/pool';
import { SessionScoreRow } from "../types/score";

export async function findSessionScoreRows(): Promise<SessionScoreRow[]> {
    const result = await pool.query<SessionScoreRow>(
        `
            SELECT s.id AS session_id,
                   s.user_id,
                   u.username,
                   s.started_at,
                   s.ended_at,
            COUNT(c.id)::int AS fish_count, 
            COALESCE(SUM(c.weight_grams), 0)::int AS total_weight_grams, 
            COALESCE(SUM(c.length_cm), 0)::float AS total_length_cm
            FROM sessions s
                     JOIN users u ON u.id = s.user_id
                     LEFT JOIN catches c ON c.session_id = s.id
            WHERE u.is_active = true
            GROUP BY s.id,
                     s.user_id,
                     u.username,
                     s.started_at,
                     s.ended_at
            ORDER BY s.started_at DESC
        `
    );

    return result.rows;
}

export async function findSessionScoreRowsByUserId(userId: number): Promise<SessionScoreRow[]> {
    const result = await pool.query<SessionScoreRow>(
        `
            SELECT s.id AS session_id,
                   s.user_id,
                   u.username,
                   s.started_at,
                   s.ended_at, 
            COUNT(c.id)::int AS fish_count,
            COALESCE(SUM(c.weight_grams), 0)::int AS total_weight_grams,
            COALESCE(SUM(c.length_cm), 0)::float AS total_length_cm
            FROM sessions s
                JOIN users u
            ON u.id = s.user_id
                LEFT JOIN catches c ON c.session_id = s.id
            WHERE s.user_id = $1
              AND u.is_active = true
            GROUP BY
                s.id,
                s.user_id,
                u.username,
                s.started_at,
                s.ended_at
            ORDER BY s.started_at DESC
        `,
        [
            userId
        ]
    );

    return result.rows;
}