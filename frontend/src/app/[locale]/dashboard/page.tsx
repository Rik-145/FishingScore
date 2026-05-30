'use client';

import { useEffect, useState }   from 'react';
import { useTranslations }       from 'next-intl';
import { getMe }                 from '@/services/authService';
import { getToken, removeToken } from '@/lib/authStorage';
import { useRouter }             from '@/i18n/navigation';
import type { PublicUser }       from '@/types/user';

export default function DashboardPage() {
    const router = useRouter();
    const t = useTranslations('DashboardPage');

    const [user, setUser] = useState<PublicUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            const token = getToken();

            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const currentUser = await getMe(token);
                setUser(currentUser);
            } catch {
                removeToken();
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        }

        void loadUser();
    }, [router]);

    function handleLogout() {
        removeToken();
        router.push('/');
    }

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

    return (
        <main className="min-h-screen bg-slate-50 px-6 py-10">
            <section className="mx-auto max-w-5xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
                            Fishing Score
                        </p>
                        <h1 className="mt-2 text-4xl font-bold text-slate-950">
                            {t('title', { username: user.username })}
                        </h1>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-md border border-slate-300 bg-white px-4 py-2 font-bold text-slate-900 hover:border-teal-700"
                    >
                        {t('logout')}
                    </button>
                </div>

                <div className="mt-10 grid gap-4 md:grid-cols-3">
                    <article className="rounded-lg border border-slate-200 bg-white p-6">
                        <h2 className="font-bold text-slate-950">
                            {t('sessions')}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            {t('sessionsDescription')}
                        </p>
                    </article>

                    <article className="rounded-lg border border-slate-200 bg-white p-6">
                        <h2 className="font-bold text-slate-950">
                            {t('catches')}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            {t('catchesDescription')}
                        </p>
                    </article>

                    <article className="rounded-lg border border-slate-200 bg-white p-6">
                        <h2 className="font-bold text-slate-950">
                            {t('score')}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            {t('scoreDescription')}
                        </p>
                    </article>
                </div>
            </section>
        </main>
    );
}