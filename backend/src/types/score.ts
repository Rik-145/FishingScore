export interface SessionScoreRow {
    session_id: number;
    user_id: number;
    username: string;
    started_at: Date;
    ended_at: Date | null;
    fish_count: number;
    total_weight_grams: number;
    total_length_cm: number;
}

export interface SessionScore {
    session_id: number;
    user_id: number;
    username: string;
    fish_count: number;
    total_weight_grams: number;
    total_length_cm: number;
    session_hours: number;
    score: number;
}

export interface LeaderboardEntry {
    user_id: number;
    username: string;
    total_sessions: number;
    total_catches: number;
    total_weight_grams: number;
    total_length_cm: number;
    total_score: number;
}