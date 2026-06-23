import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { notFound }                          from 'next/navigation';
import { routing }                           from '@/i18n/routing';
import type { ReactNode } from 'react';
import AppNavbar          from '@/components/AppNavbar';

type LocaleLayoutProps = {
    children: ReactNode;
    params: Promise<{
        locale: string;
    }>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
    const { locale } = await params;

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    return (
        <NextIntlClientProvider>
            <AppNavbar />
            {children}
        </NextIntlClientProvider>
    );
}