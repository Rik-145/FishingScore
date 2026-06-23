'use client';

import { useEffect, useState }   from 'react';
import { useTranslations }       from 'next-intl';
import { getLeaderboard }        from '@/services/scoreService';
import type { LeaderboardEntry } from '@/types/score';

export default function LeaderboardPage() {
    const t = useTranslations('LeaderboardPage');

    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadLeaderboard() {
            try {
                const leaderboard = await getLeaderboard();
                setEntries(leaderboard);
            } finally {
                setLoading(false);
            }
        }

        void loadLeaderboard();
    }, []);

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
                <p className="text-slate-600">
                    {t('loading')}
                </p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 px-6 py-10">
            <section className="mx-auto max-w-6xl">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
                        Fishing Score
                    </p>

                    <h1 className="mt-2 text-4xl font-bold text-slate-950">
                        {t('title')}
                    </h1>

                    <p className="mt-3 text-slate-600">
                        {t('description')}
                    </p>
                </div>

                <div className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <div
                        className="grid grid-cols-8 gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
                        <span>
                            {t('rank')}
                        </span>
                        <span className="col-span-2">
                            {t('angler')}
                        </span>
                        <span>{t('score')}</span>
                        <span>{t('sessions')}</span>
                        <span>{t('catches')}</span>
                        <span>{t('weight')}</span>
                        <span>{t('length')}</span>
                    </div>

                    {entries.map((entry, index) => (
                        <div
                            key={entry.user_id}
                            className="grid grid-cols-8 gap-4 border-b border-slate-100 px-4 py-4 text-sm text-slate-700 last:border-b-0"
                        >
                            <span className="font-bold text-slate-950">
                                #{index + 1}
                            </span>
                            <span className="col-span-2 font-semibold text-slate-950">
                                {entry.username ?? '-'}
                            </span>
                            <span>{entry.total_score}</span>
                            <span>{entry.total_sessions}</span>
                            <span>{entry.total_catches}</span>
                            <span>{entry.total_weight_grams} g</span>
                            <span>{entry.total_length_cm} cm</span>
                        </div>
                    ))}

                    {entries.length === 0 && (
                        <p className="p-6 text-slate-600">
                            {t('noEntries')}
                        </p>
                    )}
                </div>
            </section>
        </main>
    );
}