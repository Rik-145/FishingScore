export interface Catch {
    id: number;
    fish_id: number;
    session_id: number;
    weight_grams: number | null;
    length_cm: number | null;
    caught_at: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateCatchInput {
    fish_id: number;
    session_id: number;
    weight_grams?: number | null;
    length_cm?: number | null;
    caught_at?: string;
    notes?: string | null;
}

export interface UpdateCatchInput {
    fish_id?: number;
    session_id?: number;
    weight_grams?: number | null;
    length_cm?: number | null;
    caught_at?: string;
    notes?: string | null;
}