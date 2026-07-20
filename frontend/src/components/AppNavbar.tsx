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
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    function closeMenu() {
        setIsMenuOpen(false);
    }

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
            <nav
                className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center justify-between gap-3">
                    <Link
                        href="/"
                        className="shrink-0 font-bold text-slate-950"
                    >
                        Fishing Score
                    </Link>

                    <div className="flex shrink-0 items-center gap-2 md:hidden">
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
                            <Link
                                href="/login"
                                className="rounded-md bg-teal-700 px-3 py-2 text-sm font-bold text-white hover:bg-teal-800"
                            >
                                {t('login')}
                            </Link>
                        )}
                    </div>
                </div>

                <div className="md:hidden">
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen((current) => !current)}
                        className="flex w-full items-center justify-between rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-900 hover:border-teal-700"
                    >
                        {t('menu')}
                        <span>{isMenuOpen ? '-' : '+'}</span>
                    </button>

                    {isMenuOpen && (
                        <div className="mt-3 grid gap-2 rounded-lg border border-slate-200 bg-white p-3">
                            <Link
                                href="/dashboard"
                                onClick={closeMenu}
                                className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-teal-700"
                            >
                                {t('dashboard')}
                            </Link>

                            <Link
                                href="/sessions"
                                onClick={closeMenu}
                                className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-teal-700"
                            >
                                {t('sessions')}
                            </Link>

                            <Link
                                href="/catches"
                                onClick={closeMenu}
                                className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-teal-700"
                            >
                                {t('catches')}
                            </Link>

                            <Link
                                href="/fish"
                                onClick={closeMenu}
                                className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-teal-700"
                            >
                                {t('fish')}
                            </Link>

                            <Link
                                href="/leaderboard"
                                onClick={closeMenu}
                                className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-teal-700"
                            >
                                {t('leaderboard')}
                            </Link>
                        </div>
                    )}
                </div>

                <div className="hidden items-center gap-3 text-sm font-semibold md:flex">
                    <Link
                        href="/dashboard"
                        className="shrink-0 text-slate-700 hover:text-teal-700"
                    >
                        {t('dashboard')}
                    </Link>

                    <Link
                        href="/sessions"
                        className="shrink-0 text-slate-700 hover:text-teal-700"
                    >
                        {t('sessions')}
                    </Link>

                    <Link
                        href="/catches"
                        className="shrink-0 text-slate-700 hover:text-teal-700"
                    >
                        {t('catches')}
                    </Link>

                    <Link
                        href="/fish"
                        className="shrink-0 text-slate-700 hover:text-teal-700"
                    >
                        {t('fish')}
                    </Link>

                    <Link
                        href="/leaderboard"
                        className="shrink-0 text-slate-700 hover:text-teal-700"
                    >
                        {t('leaderboard')}
                    </Link>
                </div>

                <div className="hidden items-center gap-3 md:flex">
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