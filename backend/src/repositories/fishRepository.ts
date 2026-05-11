import { pool }                  from '../db/pool';
import { CreateFishInput, Fish } from "../types/fish";

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