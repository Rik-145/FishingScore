'use client';

import { type FormEvent, useEffect, useMemo, useState }        from 'react';
import { useTranslations }                                     from 'next-intl';
import { useRouter }                                           from '@/i18n/navigation';
import { removeToken }                                         from '@/lib/authStorage';
import { createCatch, deleteCatch, getMyCatches, updateCatch } from '@/services/catchService';
import { getMySessions }                                       from '@/services/sessionService';
import { getAllFish }                                          from '@/services/fishService';
import type { Catch }                                          from '@/types/catch';
import type { Session }                                        from '@/types/session';
import type { Fish }                                           from '@/types/fish';
import { useAuthToken }                                        from '@/hooks/useAuthToken';

export default function CatchesPage() {
    const router = useRouter();
    const t = useTranslations('CatchesPage');
    const { requireToken } = useAuthToken();

    const [catches, setCatches] = useState<Catch[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [fish, setFish] = useState<Fish[]>([]);
    const [loading, setLoading] = useState(true);
    const [sessionId, setSessionId] = useState('');
    const [fishId, setFishId] = useState('');
    const [weightGrams, setWeightGrams] = useState('');
    const [lengthCm, setLengthCm] = useState('');
    const [notes, setNotes] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [editingCatchId, setEditingCatchId] = useState<number | null>(null);
    const [deletingCatchId, setDeletingCatchId] = useState<number | null>(null);

    useEffect(() => {
        async function loadData() {
            const token = requireToken();

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const [currentCatches, currentSessions, currentFish] = await Promise.all([
                    getMyCatches(token),
                    getMySessions(token),
                    getAllFish(),
                ]);

                setCatches(currentCatches);
                setSessions(currentSessions);
                setFish(currentFish);
            } catch {
                removeToken();
                router.push('/login');
            } finally {
                setLoading(false);
            }
        }

        void loadData();
    }, [router, requireToken]);

    const fishById = useMemo(() => {
        return new Map(fish.map((fishItem) => [fishItem.id, fishItem]));
    }, [fish]);

    const sessionById = useMemo(() => {
        return new Map(sessions.map((session) => [session.id, session]));
    }, [sessions]);

    const openSessions = useMemo(() => {
        return sessions.filter((session) => !session.ended_at);
    }, [sessions]);

    const sessionOptions = editingCatchId !== null ? sessions : openSessions;

    async function handleSubmitCatch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const token = requireToken();

        if (!token) {
            return;
        }

        if (!sessionId || !fishId) {
            setErrorMessage(t('requiredFields'));
            return;
        }

        setErrorMessage('');
        setIsCreating(true);

        try {
            if (editingCatchId) {
                const updatedCatch = await updateCatch(
                    editingCatchId,
                    {
                        session_id: Number(sessionId),
                        fish_id: Number(fishId),
                        weight_grams: weightGrams ? Number(weightGrams) : undefined,
                        length_cm: lengthCm ? Number(lengthCm) : undefined,
                        notes: notes.trim() || undefined,
                    },
                    token,
                );

                setCatches((currentCatches) =>
                    currentCatches.map((catchItem) => catchItem.id === editingCatchId ? updatedCatch : catchItem,
                    ),
                );

                setEditingCatchId(null);
            } else {
                const catchItem = await createCatch(
                    {
                        session_id: Number(sessionId),
                        fish_id: Number(fishId),
                        weight_grams: weightGrams ? Number(weightGrams) : undefined,
                        length_cm: lengthCm ? Number(lengthCm) : undefined,
                        notes: notes.trim() || undefined,
                    },
                    token,
                );

                setCatches((currentCatches) => [catchItem, ...currentCatches]);
            }

            setSessionId('');
            setFishId('');
            setWeightGrams('');
            setLengthCm('');
            setNotes('');
        } catch {
            setErrorMessage(editingCatchId ? t('updateError') : t('createError'));
        } finally {
            setIsCreating(false);
        }
    }

    function handleEditCatch(catchItem: Catch) {
        setEditingCatchId(catchItem.id);
        setSessionId(String(catchItem.session_id));
        setFishId(String(catchItem.fish_id));
        setWeightGrams(catchItem.weight_grams ? String(catchItem.weight_grams) : '');
        setLengthCm(catchItem.length_cm ? String(catchItem.length_cm) : '');
        setNotes(catchItem.notes ?? '');
        setErrorMessage('');
    }

    async function handleDeleteCatch(catchId: number) {
        const confirmed = window.confirm(t('deleteConfirmation'));

        if (!confirmed) {
            return;
        }

        const token = requireToken();

        if (!token) {
            return;
        }

        setErrorMessage('');
        setDeletingCatchId(catchId);

        try {
            await deleteCatch(catchId, token);

            setCatches((currentCatches) =>
                currentCatches.filter((catchItem) => catchItem.id !== catchId),
            );

            if (editingCatchId === catchId) {
                setEditingCatchId(null);
                setSessionId('');
                setFishId('');
                setWeightGrams('');
                setLengthCm('');
                setNotes('');
            }
        } catch {
            setErrorMessage(t('deleteError'));
        } finally {
            setDeletingCatchId(null);
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
                    onSubmit={handleSubmitCatch}
                    className="mt-8 grid gap-4 rounded-lg border border-slate-200 bg-white p-6"
                >
                    <h2 className="text-lg font-bold text-slate-950">
                        {editingCatchId ? t('editTitle') : t('createTitle')}
                    </h2>

                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="grid gap-2 text-sm font-semibold text-slate-700">
                            {t('selectSession')}
                            <select
                                value={sessionId}
                                onChange={(e) => setSessionId(e.target.value)}
                                required
                                className="rounded-md border border-slate-300 px-4 py-3 text-base outline-none focus:border-teal-600"
                            >
                                <option value="">
                                    {t('selectSession')}
                                </option>
                                {sessionOptions.map((session) => (
                                    <option key={session.id} value={session.id}>
                                        {session.title ?? t('unknownSession')}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="grid gap-2 text-sm font-semibold text-slate-700">
                            {t('selectFish')}
                            <select
                                value={fishId}
                                onChange={(e) => setFishId(e.target.value)}
                                required
                                className="rounded-md border border-slate-300 px-4 py-3 text-base outline-none focus:border-teal-600"
                            >
                                <option value="">
                                    {t('selectFish')}
                                </option>
                                {fish.map((fishItem) => (
                                    <option key={fishItem.id} value={fishItem.id}>
                                        {fishItem.common_name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="grid gap-2 text-sm font-semibold text-slate-700">
                            {t('optionalWeight')}
                            <input
                                type="number"
                                min="1"
                                value={weightGrams}
                                onChange={(e) => setWeightGrams(e.target.value)}
                                className="rounded-md border border-slate-300 px-4 py-3 text-base outline-none focus:border-teal-600"
                            />
                        </label>

                        <label className="grid gap-2 text-sm font-semibold text-slate-700">
                            {t('optionalLength')}
                            <input
                                type="number"
                                min="1"
                                step="0.01"
                                value={lengthCm}
                                onChange={(e) => setLengthCm(e.target.value)}
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
                            ? editingCatchId ? t('saving') : t('creating')
                            : editingCatchId ? t('saveButton') : t('createButton')
                        }
                    </button>
                </form>

                <div className="mt-8 grid gap-4">
                    {catches.map((catchItem) => {
                        const fishItem = fishById.get(catchItem.fish_id);
                        const session = sessionById.get(catchItem.session_id);

                        return (
                            <article
                                key={catchItem.id}
                                className="rounded-lg border border-slate-200 bg-white p-6"
                            >
                                <h2 className="font-bold text-slate-950">
                                    {t('catchNumber', { id: catchItem.id })}
                                </h2>

                                <div className="mt-4 grid gap-2 text-sm text-slate-600">
                                    <p>
                                        {t('fish')}: {fishItem?.common_name ?? t('unknownFish')}
                                    </p>

                                    <p>
                                        {t('session')}: {session?.title ?? t('unknownSession')}
                                    </p>

                                    <p>
                                        {t('weight')}: {catchItem.weight_grams ? `${catchItem.weight_grams} g` : t('noWeight')}
                                    </p>

                                    <p>
                                        {t('length')}: {catchItem.length_cm ? `${catchItem.length_cm} cm` : t('noLength')}
                                    </p>

                                    <p>
                                        {t('caughtAt')}: {new Date(catchItem.caught_at).toLocaleString()}
                                    </p>

                                    <p>
                                        {t('notes')}: {catchItem.notes ?? t('noNotes')}
                                    </p>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleEditCatch(catchItem)}
                                        className="rounded-md border border-slate-300 bg-white px-4 py-2 font-bold text-slate-900 hover:border-teal-700"
                                    >
                                        {t('editCatch')}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDeleteCatch(catchItem.id)}
                                        disabled={deletingCatchId === catchItem.id}
                                        className="rounded-md border border-red-200 bg-white px-4 py-2 font-bold text-red-700 hover:border-red-500 disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {deletingCatchId === catchItem.id ? t('deleting') : t('deleteCatch')}
                                    </button>
                                </div>
                            </article>
                        );
                    })}

                    {catches.length === 0 && (
                        <p className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600">
                            {t('noCatches')}
                        </p>
                    )}
                </div>
            </section>
        </main>
    );
}