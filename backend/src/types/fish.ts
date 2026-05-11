export type FishCategory = 'freshwater' | 'saltwater' | 'both' | 'other';

export interface Fish {
    id: number;
    common_name: string;
    scientific_name: string | null;
    category: FishCategory;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface CreateFishInput {
    common_name: string;
    scientific_name?: string;
    category?: 'freshwater' | 'saltwater' | 'both' | 'other';
}