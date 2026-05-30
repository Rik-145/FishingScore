import { useTranslations } from 'next-intl';
import { Link }            from '@/i18n/navigation';

export default function HomePage() {
    const t = useTranslations('HomePage');

    return (
        <main className="min-h-screen bg-slate-50">
            <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
                <div className="max-w-3xl">
                    <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-teal-700">
                        {t('eyebrow')}
                    </p>

                    <h1 className="text-5xl font-bold text-slate-950">
                        {t('title')}
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                        {t('description')}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            href="/login"
                            className="rounded-md bg-teal-700 px-5 py-3 font-bold text-white hover:bg-teal-800"
                        >
                            {t('login')}
                        </Link>

                        <Link
                            href="/register"
                            className="rounded-md border border-slate-300 bg-white px-5 py-3 font-bold text-slate-900 hover:border-teal-700"
                        >
                            {t('createAccount')}
                        </Link>
                    </div>
                </div>

                <div className="mt-16 grid gap-4 md:grid-cols-3">
                    <article className="rounded-lg border border-slate-200 bg-white p-6">
                        <h2 className="font-bold text-slate-950">
                            {t('sessionsTitle')}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            {t('sessionsDescription')}
                        </p>
                    </article>

                    <article className="rounded-lg border border-slate-200 bg-white p-6">
                        <h2 className="font-bold text-slate-950">
                            {t('catchesTitle')}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            {t('catchesDescription')}
                        </p>
                    </article>

                    <article className="rounded-lg border border-slate-200 bg-white p-6">
                        <h2 className="font-bold text-slate-950">
                            {t('leaderboardTitle')}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            {t('leaderboardDescription')}
                        </p>
                    </article>
                </div>
            </section>
        </main>
    );
}
