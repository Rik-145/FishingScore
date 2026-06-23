'use client';

import { type FormEvent, useEffect, useState }                                       from 'react';
import { useTranslations }                                                           from 'next-intl';
import { useRouter }                                                                 from '@/i18n/navigation';
import { removeToken }                                                               from '@/lib/authStorage';
import { createSession, deleteSession, finishSession, getMySessions, updateSession } from '@/services/sessionService';
import type { Session }                                                              from '@/types/session';
import { useAuthToken }                                                              from '@/hooks/useAuthToken';

export default function SessionsPage() {
    const router = useRouter();
    const t = useTranslations('SessionsPage');
    const { requireToken } = useAuthToken();

    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [notes, setNotes] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [finishedSessionId, setFinishedSessionId] = useState<number | null>(null);
    const [editingSessionId, setEditingSessionId] = useState<number | null>(null);
    const [deletingSessionId, setDeletingSessionId] = useState<number | null>(null);

    useEffect(() => {
        async function loadSessions() {
            const token = requireToken();

            if (!token) {
                setLoading(false);
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
    }, [router, requireToken]);

    async function handleSubmitSession(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const token = requireToken();

        if (!token) {
            return;
        }

        if (title.trim().length < 3) {
            setErrorMessage(t('titleRequired'));
            return;
        }

        if (location.trim().length < 3) {
            setErrorMessage(t('locationRequired'));
            return;
        }

        const sessionInput = {
            title: title.trim(),
            location: location.trim(),
            notes: notes.trim() || undefined,
        };

        setErrorMessage('');
        setIsCreating(true);

        try {
            if (editingSessionId) {
                const updatedSession = await updateSession(
                    editingSessionId,
                    sessionInput,
                    token,
                );

                setSessions((currentSessions) =>
                    currentSessions.map((session) =>
                        session.id === editingSessionId ? updatedSession : session),
                );

                setEditingSessionId(null);
            } else {
                const session = await createSession(sessionInput, token);

                setSessions((currentSessions) => [session, ...currentSessions]);
            }

            setTitle('');
            setLocation('');
            setNotes('');
        } catch {
            setErrorMessage(editingSessionId ? t('updateError') : t('createError'));
        } finally {
            setIsCreating(false);
        }
    }

    async function handleFinishSession(sessionId: number) {
        const token = requireToken();

        if (!token) {
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

    function handleEditSession(session: Session) {
        setEditingSessionId(session.id);
        setTitle(session.title ?? '');
        setLocation(session.location ?? '');
        setNotes(session.notes ?? '');
        setErrorMessage('');
    }

    async function handleDeleteSession(sessionId: number) {
        const confirmed = window.confirm(t('deleteConfirmation'));

        if (!confirmed) {
            return;
        }

        const token = requireToken();

        if (!token) {
            return;
        }

        setErrorMessage('');
        setDeletingSessionId(sessionId);

        try {
            await deleteSession(sessionId, token);

            setSessions((currentSessions) =>
                currentSessions.filter((session) => session.id !== sessionId),
            );

            if (editingSessionId === sessionId) {
                setEditingSessionId(null);
                setTitle('');
                setLocation('');
                setNotes('');
            }
        } catch {
            setErrorMessage(t('deleteError'));
        } finally {
            setDeletingSessionId(null);
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
                    onSubmit={handleSubmitSession}
                    className="mt-8 grid gap-4 rounded-lg border border-slate-200 bg-white p-6"
                >
                    <h2 className="text-lg font-bold text-slate-950">
                        {editingSessionId ? t('editTitle') : t('createTitle')}
                    </h2>

                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="grid gap-2 text-sm font-semibold text-slate-700">
                            {t('sessionTitle')}
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                minLength={3}
                                className="rounded-md border border-slate-300 px-4 py-3 text-base outline-none focus:border-teal-600"
                            />
                        </label>

                        <label className="grid gap-2 text-sm font-semibold text-slate-700">
                            {t('location')}
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                                minLength={3}
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
                        {isCreating
                            ? editingSessionId ? t('saving') : t('creating')
                            : editingSessionId ? t('saveButton') : t('createButton')}
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

                            <div className="mt-4 flex flex-wrap gap-3">
                                {!session.ended_at && (
                                    <button
                                        type="button"
                                        onClick={() => handleEditSession(session)}
                                        className="rounded-md border border-slate-300 bg-white px-4 py-2 font-bold text-slate-900 hover:border-teal-700"
                                    >
                                        {t('editSession')}
                                    </button>
                                )}

                                {!session.ended_at && (
                                    <button
                                        type="button"
                                        onClick={() => handleFinishSession(session.id)}
                                        disabled={finishedSessionId === session.id}
                                        className="rounded-md border border-slate-300 bg-white px-4 py-2 font-bold text-slate-900 hover:border-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {finishedSessionId === session.id ? t('finishing') : t('finishSession')}
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => handleDeleteSession(session.id)}
                                    disabled={deletingSessionId === session.id}
                                    className="rounded-md border border-red-200 bg-white px-4 py-2 font-bold text-red-700 hover:border-red-500 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {deletingSessionId === session.id ? t('deleting') : t('deleteSession')}
                                </button>
                            </div>
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