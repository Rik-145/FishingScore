'use client';

import { useEffect, useState }          from 'react';
import { useLocale, useTranslations }   from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { getToken, removeToken }        from '@/lib/authStorage';
import { getMe }                        from '@/services/authService';
import type { PublicUser }              from '@/types/user';

export default function AppNavbar() {
    const t = useTranslations('Navigation');
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();

    const [user, setUser] = useState<PublicUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            setIsLoading(true);

            const token = getToken();

            if (!token) {
                setUser(null);
                setIsLoading(false);
                return;
            }

            try {
                const currentUser = await getMe(token);
                setUser(currentUser);
            } catch {
                removeToken();
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        }

        void loadUser();
    }, [pathname]);

    function handleLogout() {
        removeToken();
        setUser(null);
        router.push('/');
    }

    function switchLocale(nextLocale: 'en' | 'pt') {
        router.replace(pathname, {
            locale: nextLocale,
        });
    }

    return (
        <header className="border-b border-slate-200 bg-white">
            <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
                <Link
                    href="/"
                    className="font-bold text-slate-950"
                >
                    Fishing Score
                </Link>

                <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
                    <Link
                        href="/dashboard"
                        className="text-slate-700 hover:text-teal-700"
                    >
                        {t('dashboard')}
                    </Link>

                    <Link
                        href="/sessions"
                        className="text-slate-700 hover:text-teal-700"
                    >
                        {t('sessions')}
                    </Link>

                    <Link
                        href="/catches"
                        className="text-slate-700 hover:text-teal-700"
                    >
                        {t('catches')}
                    </Link>

                    <Link
                        href="/fish"
                        className="text-slate-700 hover:text-teal-700"
                    >
                        {t('fish')}
                    </Link>

                    <Link
                        href="/leaderboard"
                        className="text-slate-700 hover:text-teal-700"
                    >
                        {t('leaderboard')}
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => switchLocale(locale === 'pt' ? 'en' : 'pt')}
                        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-900 hover:border-teal-700"
                    >
                        {locale === 'pt' ? 'EN' : 'PT'}
                    </button>

                    {!isLoading && user && (
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-md bg-teal-700 px-3 py-2 text-sm font-bold text-white hover:bg-teal-800"
                        >
                            {t('logout')}
                        </button>
                    )}

                    {!isLoading && !user && (
                        <>
                            <Link
                                href="/login"
                                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-900 hover:border-teal-700"
                            >
                                {t('login')}
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-md bg-teal-700 px-3 py-2 text-sm font-bold text-white hover:bg-teal-800"
                            >
                                {t('register')}
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}