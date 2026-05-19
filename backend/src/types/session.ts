export interface Session {
    id: number;
    user_id: number;
    title: string | null;
    location: string | null;
    started_at: Date;
    ended_at: Date | null;
    notes: string | null;
    created_at: Date;
    updated_at: Date;
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
    ended_at?: string;
    notes?: string;
}