import { LeaderboardEntry, SessionScore, SessionScoreRow } from "../types/score";
import * as scoreRepository                                from '../repositories/scoreRepository';

function getSessionHours(startedAt: Date | string, endedAt: Date | string | null): number {
    const start = new Date(startedAt);
    const end = endedAt ? new Date(endedAt) : new Date();

    const durationMs = end.getTime() - start.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);

    return Math.max(durationHours, 1);
}

function roundScore(score: number): number {
    return Math.round(score * 100) / 100;
}

function calculateSessionScore(row: SessionScoreRow): SessionScore {
    const sessionHours = getSessionHours(row.started_at, row.ended_at);

    const rawScore = row.fish_count * 5 + row.total_weight_grams / 250 + row.total_length_cm / 20;

    const score = rawScore / Math.sqrt(sessionHours);

    return {
        session_id: row.session_id,
        user_id: row.user_id,
        username: row.username,
        fish_count: row.fish_count,
        total_weight_grams: row.total_weight_grams,
        total_length_cm: row.total_length_cm,
        session_hours: roundScore(sessionHours),
        score: roundScore(score)
    };
}

export async function getMySessionScores(userId: number): Promise<SessionScore[]> {
    const rows = await scoreRepository.findSessionScoreRowsByUserId(userId);

    return rows.map(calculateSessionScore);
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
    const rows = await scoreRepository.findSessionScoreRows();

    const sessionScores = rows.map(calculateSessionScore);

    const leaderboard = new Map<number, LeaderboardEntry>();

    for (const session of sessionScores) {
        const existing = leaderboard.get(session.user_id);

        if (!existing) {
            leaderboard.set(session.user_id, {
                user_id: session.user_id,
                username: session.username,
                total_sessions: 1,
                total_catches: session.fish_count,
                total_weight_grams: session.total_weight_grams,
                total_length_cm: session.total_length_cm,
                total_score: session.score
            });

            continue;
        }

        existing.total_sessions += 1;
        existing.total_catches += session.fish_count;
        existing.total_weight_grams += session.total_weight_grams;
        existing.total_length_cm += session.total_length_cm;
        existing.total_score += session.score;
    }

    return Array.from(leaderboard.values()).map((entry) => ({
        ...entry,
        total_length_cm: roundScore(entry.total_length_cm),
        total_score: roundScore(entry.total_score)
    })).sort((a, b) => b.total_score - a.total_score);
}

export async function getMyScore(userId: number): Promise<LeaderboardEntry | null> {
    const leaderboard = await getLeaderboard();

    return leaderboard.find((entry) => entry.user_id === userId) ?? null;
}