import { apiRequest }                     from '@/lib/api';
import { LeaderboardEntry, SessionScore } from '@/types/score';

export function getLeaderboard(): Promise<LeaderboardEntry[]> {
    return apiRequest<LeaderboardEntry[]>('/scores/leaderboard');
}

export function getMyScore(token: string): Promise<LeaderboardEntry> {
    return apiRequest<LeaderboardEntry>('/scores/me', {
        token,
    });
}

export function getMySessionScores(token: string): Promise<SessionScore[]> {
    return apiRequest<SessionScore[]>('/scores/sessions', {
        token,
    });
}