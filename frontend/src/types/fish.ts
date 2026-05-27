export type FishCategory = 'freshwater' | 'saltwater' | 'both' | 'other';

export interface Fish {
    id: number;
    common_name: string;
    scientific_name: string | null;
    category: FishCategory;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateFishInput {
    common_name: string;
    scientific_name?: string | null;
    category?: FishCategory;
}

export interface UpdateFishInput {
    common_name?: string;
    scientific_name?: string | null;
    category?: FishCategory;
    is_active?: boolean;
}