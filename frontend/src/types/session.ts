export interface Session {
    id: number;
    user_id: number;
    title: string | null;
    location: string | null;
    started_at: string;
    ended_at: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateSessionInput {
    title?: string;
    location?: string;
    started_at?: string;
    ended_at?: string | null;
    notes?: string;
}

export interface UpdateSessionInput {
    title?: string;
    location?: string;
    started_at?: string;
    ended_at?: string | null;
    notes?: string;
}