'use client';

import { type FormEvent, useEffect, useState }                              from 'react';
import { useTranslations }                                                  from 'next-intl';
import { getToken, removeToken }                                            from '@/lib/authStorage';
import { activateFish, createFish, deactivateFish, getAllFish, updateFish } from '@/services/fishService';
import type { Fish, FishCategory }                                          from '@/types/fish';
import type { PublicUser }                                                  from '@/types/user';
import { getMe }                                                            from '@/services/authService';

export default function FishPage() {
    const t = useTranslations('FishPage');

    const [fish, setFish] = useState<Fish[]>([]);
    const [user, setUser] = useState<PublicUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [commonName, setCommonName] = useState('');
    const [scientificName, setScientificName] = useState('');
    const [category, setCategory] = useState<FishCategory>('freshwater');
    const [editingFishId, setEditingFishId] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [updatingStatusFishId, setUpdatingStatusFishId] = useState<number | null>(null);

    useEffect(() => {
        async function loadData() {
            const token = getToken();

            try {
                const currentFish = await getAllFish();
                setFish(currentFish);

                if (token) {
                    const currentUser = await getMe(token);
                    setUser(currentUser);
                }
            } catch {
                if (token) {
                    removeToken();
                }
            } finally {
                setLoading(false);
            }
        }

        void loadData();
    }, []);

    const canManageFish = user?.role === 'admin' || user?.role === 'moderator';

    async function handleSubmitFish(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const token = getToken();

        if (!token) {
            setErrorMessage(t('createError'));
            return;
        }

        if (commonName.trim().length < 2) {
            setErrorMessage(t('nameRequired'));
            return;
        }

        setErrorMessage('');
        setIsSaving(true);

        try {
            if (editingFishId) {
                const updatedFish = await updateFish(
                    editingFishId,
                    {
                        common_name: commonName.trim(),
                        scientific_name: scientificName.trim() || null,
                        category,
                    },
                    token,
                );

                setFish((currentFish) =>
                    currentFish.map((fishItem) =>
                        fishItem.id === editingFishId ? updatedFish : fishItem,
                    ),
                );

                setEditingFishId(null);
            } else {
                const createdFish = await createFish(
                    {
                        common_name: commonName.trim(),
                        scientific_name: scientificName.trim() || null,
                        category,
                    },
                    token,
                );

                setFish((currentFish) => [...currentFish, createdFish]);
            }

            setCommonName('');
            setScientificName('');
            setCategory('freshwater');
        } catch {
            setErrorMessage(editingFishId ? t('updateError') : t('createError'));
        } finally {
            setIsSaving(false);
        }
    }

    function handleEditFish(fishItem: Fish) {
        setEditingFishId(fishItem.id);
        setCommonName(fishItem.common_name);
        setScientificName(fishItem.scientific_name ?? '');
        setCategory(fishItem.category);
        setErrorMessage('');
    }

    async function handleToggleFishStatus(fishItem: Fish) {
        const token = getToken();

        if (!token) {
            setErrorMessage(t('statusError'));
            return;
        }

        setErrorMessage('');
        setUpdatingStatusFishId(fishItem.id);

        try {
            const updatedFish = fishItem.is_active
                ? await deactivateFish(fishItem.id, token)
                : await activateFish(fishItem.id, token);

            setFish((currentFish) =>
                currentFish.map((currentFishItem) =>
                    currentFishItem.id === fishItem.id ? updatedFish : currentFishItem,
                ),
            );
        } catch {
            setErrorMessage(t('statusError'));
        } finally {
            setUpdatingStatusFishId(null);
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

                {canManageFish && (
                    <p className="mt-6 rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm font-semibold text-slate-800">
                        Admin/Moderator mode
                    </p>
                )}

                {canManageFish && (
                    <form
                        onSubmit={handleSubmitFish}
                        className="mt-8 grid gap-4 rounded-lg border border-slate-200 bg-white p-6"
                    >
                        <h2 className="text-lg font-bold text-slate-950">
                            {editingFishId ? t('editTitle') : t('createTitle')}
                        </h2>

                        <div className="grid gap-4 md:grid-cols-2">
                            <label className="grid gap-2 text-sm font-semibold text-slate-700">
                                {t('commonName')}
                                <input
                                    type="text"
                                    value={commonName}
                                    onChange={(e) => setCommonName(e.target.value)}
                                    required
                                    minLength={2}
                                    className="rounded-md border border-slate-300 px-4 py-3 text-base outline-none focus:border-teal-600"
                                />
                            </label>

                            <label className="grid gap-2 text-sm font-semibold text-slate-700">
                                {t('scientificName')}
                                <input
                                    type="text"
                                    value={scientificName}
                                    onChange={(e) => setScientificName(e.target.value)}
                                    className="rounded-md border border-slate-300 px-4 py-3 text-base outline-none focus:border-teal-600"
                                />
                            </label>
                        </div>

                        <label className="grid gap-2 text-sm font-semibold text-slate-700">
                            {t('category')}
                            <select
                                value={category}
                                onChange={(event) => setCategory(event.target.value as FishCategory)}
                                className="rounded-md border border-slate-300 px-4 py-3 text-base outline-none focus:border-teal-600"
                            >
                                <option value="freshwater">{t('freshwater')}</option>
                                <option value="saltwater">{t('saltwater')}</option>
                                <option value="both">{t('both')}</option>
                                <option value="other">{t('other')}</option>
                            </select>
                        </label>

                        {errorMessage && (
                            <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-800">
                                {errorMessage}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-fit rounded-md bg-teal-700 px-4 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isSaving
                                ? editingFishId ? t('saving') : t('creating')
                                : editingFishId ? t('saveButton') : t('createButton')
                            }
                        </button>
                    </form>
                )}

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                    {fish.map((fishItem) => (
                        <article
                            key={fishItem.id}
                            className="rounded-lg border border-slate-200 bg-white p-6"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="font-bold text-slate-950">
                                        {fishItem.common_name}
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-600">
                                        {fishItem.scientific_name ?? '-'}
                                    </p>
                                </div>

                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                                        {fishItem.is_active ? t('active') : t('inactive')}
                                </span>
                            </div>

                            <p className="mt-4 text-sm text-slate-600">
                                {t('category')}: {t(fishItem.category)}
                            </p>

                            {canManageFish && (
                                <div className="mt-4 flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleEditFish(fishItem)}
                                        className="rounded-md border border-slate-300 bg-white px-4 py-2 font-bold text-slate-900 hover:border-teal-700"
                                    >
                                        {t('editFish')}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleToggleFishStatus(fishItem)}
                                        disabled={updatingStatusFishId === fishItem.id}
                                        className="rounded-md border border-slate-300 bg-white px-4 py-2 font-bold text-slate-900 hover:border-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {updatingStatusFishId === fishItem.id
                                            ? t('updatingStatus')
                                            : fishItem.is_active ? t('deactivateFish') : t('activateFish')}
                                    </button>
                                </div>
                            )}
                        </article>
                    ))}

                    {fish.length === 0 && (
                        <p className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600">
                            {t('noFish')}
                        </p>
                    )}
                </div>
            </section>
        </main>
    );
}