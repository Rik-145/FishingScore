'use client';

import { useEffect, useState }   from 'react';
import { useTranslations }       from 'next-intl';
import { getMe }                 from '@/services/authService';
import { removeToken }           from '@/lib/authStorage';
import { Link, useRouter }       from '@/i18n/navigation';
import type { PublicUser }       from '@/types/user';
import { getMySessions }         from '@/services/sessionService';
import { getMyScore }            from '@/services/scoreService';
import { getMyCatches }          from '@/services/catchService';
import { getAllFish }            from '@/services/fishService';
import type { Session }          from '@/types/session';
import type { Catch }            from '@/types/catch';
import type { LeaderboardEntry } from '@/types/score';
import type { Fish }             from '@/types/fish';
import { useAuthToken }          from '@/hooks/useAuthToken';

export default function DashboardPage() {
    const router = useRouter();
    const t = useTranslations('DashboardPage');
    const { requireToken } = useAuthToken();

    const [user, setUser] = useState<PublicUser | null>(null);
    const [score, setScore] = useState<LeaderboardEntry | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [catches, setCatches] = useState<Catch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fish, setFish] = useState<Fish[]>([]);

    useEffect(() => {
        async function loadUser() {
            const token = requireToken();

            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const [currentUser, currentScore, currentSessions, currentCatches, currentFish] = await Promise.all([
                    getMe(token),
                    getMyScore(token),
                    getMySessions(token),
                    getMyCatches(token),
                    getAllFish(),
                ]);

                setUser(currentUser);
                setScore(currentScore);
                setSessions(currentSessions);
                setCatches(currentCatches);
                setFish(currentFish);
            } catch {
                removeToken();
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        }

        void loadUser();
    }, [router, requireToken]);

    if (isLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
                <p className="text-slate-600">
                    {t('loading')}
                </p>
            </main>
        );
    }

    if (!user) {
        return null;
    }

    function getFishName(fishId: number): string {
        return fish.find((fishItem) => fishItem.id === fishId)?.common_name ?? t('unknownFish');
    }

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-10">
            <section className="mx-auto max-w-5xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
                            Fishing Score
                        </p>

                        <h1 className="mt-2 text-3xl font-bold text-slate-950 md:text-4xl">
                            {t('title', { username: user.username })}
                        </h1>
                    </div>
                </div>

                <div className="mt-10 grid gap-4 md:grid-cols-3">
                    <article className="rounded-lg border border-slate-200 bg-white p-6">
                        <h2 className="font-bold text-slate-950">
                            {t('totalScore')}
                        </h2>

                        <p className="mt-3 text-4xl font-bold text-slate-950">
                            {score?.total_score ?? 0}
                        </p>

                        <Link
                            href="/leaderboard"
                            className="mt-5 inline-flex w-full justify-center rounded-md bg-teal-700 px-4 py-3 font-bold text-white hover:bg-teal-800 sm:w-fit"
                        >
                            {t('viewLeaderboard')}
                        </Link>
                    </article>

                    <article className="rounded-lg border border-slate-200 bg-white p-6">
                        <h2 className="font-bold text-slate-950">
                            {t('totalSessions')}
                        </h2>

                        <p className="mt-3 text-4xl font-bold text-slate-950">
                            {sessions.length}
                        </p>

                        <Link
                            href="/sessions"
                            className="mt-5 inline-flex w-full justify-center rounded-md bg-teal-700 px-4 py-3 font-bold text-white hover:bg-teal-800 sm:w-fit"
                        >
                            {t('viewSessions')}
                        </Link>
                    </article>

                    <article className="rounded-lg border border-slate-200 bg-white p-6">
                        <h2 className="font-bold text-slate-950">
                            {t('totalCatches')}
                        </h2>

                        <p className="mt-3 text-4xl font-bold text-slate-950">
                            {catches.length}
                        </p>

                        <Link
                            href="/catches"
                            className="mt-5 inline-flex w-full justify-center rounded-md bg-teal-700 px-4 py-3 font-bold text-white hover:bg-teal-800 sm:w-fit"
                        >
                            {t('viewCatches')}
                        </Link>
                    </article>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    <section className="rounded-lg border border-slate-200 bg-white p-6">
                        <h2 className="text-lg font-bold text-slate-950">
                            {t('recentSessions')}
                        </h2>

                        <div className="mt-4 grid gap-3">
                            {sessions.slice(0, 5).map((session) => (
                                <article
                                    key={session.id}
                                    className="rounded-md border border-slate-200 bg-slate-50 p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold uppercase text-teal-700">
                                                {session.ended_at ? t('finishedSession') : t('openSession')}
                                            </p>

                                            <h3 className="mt-1 wrap-break-word font-bold text-slate-950">
                                                {session.title ?? t('untitledSession')}
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-600">
                                                {session.location ?? t('noLocation')}
                                            </p>
                                        </div>

                                        <p className="shrink-0 text-xs font-semibold text-slate-500">
                                            {new Date(session.started_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </article>
                            ))}

                            {sessions.length === 0 && (
                                <p className="text-sm text-slate-600">
                                    {t('noSessions')}
                                </p>
                            )}
                        </div>
                    </section>

                    <section className="rounded-lg border border-slate-200 bg-white p-6">
                        <h2 className="text-lg font-bold text-slate-950">
                            {t('recentCatches')}
                        </h2>

                        <div className="mt-4 grid gap-3">
                            {catches.slice(0, 5).map((catchItem) => (
                                <article
                                    key={catchItem.id}
                                    className="rounded-md border border-slate-200 bg-slate-50 p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold uppercase text-teal-700">
                                                {t('catch')}
                                            </p>

                                            <h3 className="mt-1 wrap-break-word font-bold text-slate-950">
                                                {getFishName(catchItem.fish_id)}
                                            </h3>
                                        </div>

                                        <p className="shrink-0 text-xs font-semibold text-slate-500">
                                            {new Date(catchItem.caught_at).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                                        <div className="rounded-md bg-white p-3">
                                            <p className="font-semibold text-slate-500">
                                                {t('weight')}
                                            </p>

                                            <p className="mt-1 font-bold text-slate-950">
                                                {catchItem.weight_grams ? `${Number(catchItem.weight_grams)} g` : t('noWeight')}
                                            </p>
                                        </div>

                                        <div className="rounded-md bg-white p-3">
                                            <p className="font-semibold text-slate-500">
                                                {t('length')}
                                            </p>

                                            <p className="mt-1 font-bold text-slate-950">
                                                {catchItem.length_cm ? `${Number(catchItem.length_cm)} cm` : t('noLength')}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            ))}

                            {catches.length === 0 && (
                                <p className="text-sm text-slate-600">
                                    {t('noCatches')}
                                </p>
                            )}
                        </div>
                    </section>
                </div>
            </section>
        </main>
    );
}