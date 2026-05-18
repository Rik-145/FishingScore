import { pool }                                   from '../db/pool';
import { CreateFishInput, Fish, UpdateFishInput } from "../types/fish";

export async function findAllFish(): Promise<Fish[]> {
    const result = await pool.query<Fish>(
        `
            SELECT id,
                   common_name,
                   scientific_name,
                   category,
                   is_active,
                   created_at,
                   updated_at
            FROM fish
            ORDER BY common_name ASC`
    );

    return result.rows;
}

export async function createFish(input: CreateFishInput): Promise<Fish> {
    const result = await pool.query<Fish>(
        `
            INSERT INTO fish (common_name, scientific_name, category)
            VALUES ($1, $2, COALESCE($3, 'freshwater')) RETURNING 
                id, 
                common_name, 
                scientific_name, 
                category, 
                is_active, 
                created_at, 
                updated_at
        `,
        [
            input.common_name,
            input.scientific_name ?? null,
            input.category
        ]
    );

    return result.rows[0];
}

export async function findFishById(fishId: number): Promise<Fish | null> {
    const result = await pool.query<Fish>(
        `
            SELECT id,
                   common_name,
                   scientific_name,
                   category,
                   is_active,
                   created_at,
                   updated_at
            FROM fish
            WHERE id = $1
              AND is_active = true LIMIT 1
        `,
        [fishId]
    );

    return result.rows[0] ?? null;
}

export async function updateFish(fishId: number, input: UpdateFishInput): Promise<Fish | null> {
    const result = await pool.query<Fish>(
        `
            UPDATE fish
            SET common_name     = COALESCE($2, common_name),
                scientific_name = COALESCE($3, scientific_name),
                category        = COALESCE($4, category),
                is_active       = COALESCE($5, is_active),
                updated_at      = NOW()
            WHERE id = $1 RETURNING
                id, 
                common_name,
                scientific_name,
                category,
                is_active,
                created_at,
                updated_at
        `,
        [
            fishId,
            input.common_name,
            input.scientific_name,
            input.category,
            input.is_active
        ]
    );

    return result.rows[0] ?? null;
}

export async function setFishActiveStatus(fishId: number, isActive: boolean): Promise<Fish | null> {
    const result = await pool.query<Fish>(
        `
            UPDATE fish
            SET is_active  = $2,
                updated_at = NOW()
            WHERE id = $1 RETURNING
                id,
                common_name,
                scientific_name,
                category,
                is_active,
                created_at,
                updated_at
        `,
        [
            fishId,
            isActive
        ]
    );

    return result.rows[0] ?? null;
}