'use client';

import { type FormEvent, useEffect, useState }         from 'react';
import { useTranslations }                             from 'next-intl';
import { useRouter }                                   from '@/i18n/navigation';
import { getToken, removeToken }                       from '@/lib/authStorage';
import { createSession, finishSession, getMySessions } from '@/services/sessionService';
import type { Session }                                from '@/types/session';

export default function SessionsPage() {
    const router = useRouter();
    const t = useTranslations('SessionsPage');

    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [notes, setNotes] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [finishedSessionId, setFinishedSessionId] = useState<number | null>(null);

    useEffect(() => {
        async function loadSessions() {
            const token = getToken();

            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const currentSessions = await getMySessions(token);
                setSessions(currentSessions);
            } catch {
                removeToken();
                router.push('/login');
            } finally {
                setLoading(false);
            }
        }

        void loadSessions();
    }, [router]);

    async function handleCreateSession(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const token = getToken();

        if (!token) {
            router.push('/login');
            return;
        }

        setErrorMessage('');
        setIsCreating(true);

        try {
            const session = await createSession(
                {
                    title,
                    location,
                    notes,
                },
                token,
            );

            setSessions((currentSessions) => [session, ...currentSessions]);
            setTitle('');
            setLocation('');
            setNotes('');
        } catch {
            setErrorMessage(t('createError'));
        } finally {
            setIsCreating(false);
        }
    }

    async function handleFinishSession(sessionId: number) {
        const token = getToken();

        if (!token) {
            router.push('/login');
            return;
        }

        setErrorMessage('');
        setFinishedSessionId(sessionId);

        try {
            const finishedSession = await finishSession(sessionId, token);

            setSessions((currentSessions) =>
                currentSessions.map((session) =>
                    session.id === sessionId ? finishedSession : session,
                ),
            );
        } catch {
            setErrorMessage(t('finishError'));
        } finally {
            setFinishedSessionId(null);
        }
    }

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
            <section className="mx-auto max-w-5xl">
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

                <form
                    onSubmit={handleCreateSession}
                    className="mt-8 grid gap-4 rounded-lg border border-slate-200 bg-white p-6"
                >
                    <h2 className="text-lg font-bold text-slate-950">
                        {t('createTitle')}
                    </h2>

                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="grid gap-2 text-sm font-semibold text-slate-700">
                            {t('sessionTitle')}
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="rounded-md border border-slate-300 px-4 py-3 text-base outline-none focus:border-teal-600"
                            />
                        </label>

                        <label className="grid gap-2 text-sm font-semibold text-slate-700">
                            {t('location')}
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="rounded-md border border-slate-300 px-4 py-3 text-base outline-none focus:border-teal-600"
                            />
                        </label>
                    </div>

                    <label className="grid gap-2 text-sm font-semibold text-slate-700">
                        {t('notes')}
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="min-h-24 rounded-md border border-slate-300 px-4 py-3 text-base outline-none focus:border-teal-600"
                        />
                    </label>

                    {errorMessage && (
                        <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-800">
                            {errorMessage}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isCreating}
                        className="w-fit rounded-md bg-teal-700 px-4 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isCreating ? t('creating') : t('createButton')}
                    </button>
                </form>

                <div className="mt-8 grid gap-4">
                    {sessions.map((session) => (
                        <article
                            key={session.id}
                            className="rounded-lg border border-slate-200 bg-white p-6"
                        >
                            <h2 className="font-bold text-slate-950">
                                {session.title ?? t('untitledSession')}
                            </h2>

                            <p className="mt-2 text-sm text-slate-600">
                                {session.location ?? t('noLocation')}
                            </p>

                            <div className="mt-4 grid gap-2 text-sm text-slate-600">
                                <p>
                                    {t('startedAt')}: {new Date(session.started_at).toLocaleString()}
                                </p>
                                <p>
                                    {session.ended_at
                                        ? `${t('endedAt')}: ${new Date(session.ended_at).toLocaleString()}`
                                        : t('openSession')}
                                </p>
                            </div>

                            {!session.ended_at && (
                                <button
                                    type="button"
                                    onClick={() => handleFinishSession(session.id)}
                                    disabled={finishedSessionId === session.id}
                                    className="mt-4 rounded-md border border-slate-300 bg-white px-4 py-2 font-bold text-slate-900 hover:border-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {finishedSessionId === session.id ? t('finishing') : t('finishSession')}
                                </button>
                            )}
                        </article>
                    ))}

                    {sessions.length === 0 && (
                        <p className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600">
                            {t('noSessions')}
                        </p>
                    )}
                </div>
            </section>
        </main>
    );
}