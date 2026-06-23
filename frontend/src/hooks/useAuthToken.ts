import { useCallback } from 'react';
import { useRouter }   from '@/i18n/navigation';
import { getToken }    from '@/lib/authStorage';

export function useAuthToken() {
    const router = useRouter();

    const requireToken = useCallback((): string | null => {
        const token = getToken();

        if (!token) {
            router.push('/login');
            return null;
        }

        return token;
    }, [router]);

    return { requireToken };
}