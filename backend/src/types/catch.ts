export interface Catch {
    id: number;
    fish_id: number;
    session_id: number;
    weight_grams: number | null;
    length_cm: number | null;
    caught_at: Date;
    notes: string | null;
    created_at: Date;
    updated_at: Date;
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