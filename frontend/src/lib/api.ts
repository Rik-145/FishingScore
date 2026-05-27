const API_URL = process.env.NEXT_PUBLIC_API_URL;

type RequestOptions = {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    body?: unknown;
    token?: string | null;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
    if (!API_URL) {
        throw new Error('NEXT_PUBLIC_API_URL is not configured');
    }

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (options.token) {
        headers.Authorization = `Bearer ${options.token}`;
    }

    const response = await fetch(`${API_URL}${path}`, {
        method: options.method ?? 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const data = response.status === 204 ? null : await response.json();

    if (!response.ok) {
        throw new Error(data?.message ?? 'API request failed');
    }

    return data as T;
}