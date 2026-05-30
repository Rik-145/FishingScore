'use client';

import { useTranslations }          from 'next-intl';
import { type FormEvent, useState } from 'react';
import { Link, useRouter }          from '@/i18n/navigation';
import { login }                    from '@/lib/auth';

export default function LoginPage() {
    const router = useRouter();
    const t = useTranslations('LoginPage');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErrorMessage('');
        setIsSubmitting(true);

        try {
            await login({
                email,
                password,
            });

            router.push('/dashboard');
        } catch {
            setErrorMessage(t('fallbackError'));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
            <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
                <h1 className="mb-6 text-3xl font-bold text-slate-900">
                    {t('title')}
                </h1>

                <form onSubmit={handleSubmit} className="grid gap-5">
                    <label className="grid gap-2 text-sm font-semibold text-slate-700">
                        {t('email')}
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="rounded-md border border-slate-300 px-4 py-3 text-base outline-none focus:border-teal-600"
                        />
                    </label>

                    <label className="grid gap-2 text-sm font-semibold text-slate-700">
                        {t('password')}
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="rounded-md border border-slate-300 px-4 py-3 text-base outline-none focus:border-teal-600"
                        />
                    </label>

                    {errorMessage && (
                        <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-800">
                            {errorMessage}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-md bg-teal-700 px-4 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isSubmitting ? t('submitting') : t('submit')}
                    </button>
                </form>

                    <p className="mt-6 text-sm text-slate-600">
                        {t('doesntHaveAccount')}{' '}
                        <Link
                            href="/register"
                            className="font-bold text-teal-700 hover:text-teal-800"
                        >
                            {t('register')}
                        </Link>
                    </p>
            </section>
        </main>
    );
}