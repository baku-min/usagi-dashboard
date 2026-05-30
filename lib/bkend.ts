const API_BASE    = process.env.NEXT_PUBLIC_BKEND_API_URL  || 'https://api.bkend.ai/v1';
const PROJECT_ID  = process.env.NEXT_PUBLIC_BKEND_PROJECT_ID || '';
const ENVIRONMENT = process.env.NEXT_PUBLIC_BKEND_ENV       || 'dev';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('bkend_access_token')
    : null;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-project-id': PROJECT_ID,
      'x-environment': ENVIRONMENT,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export const bkend = {
  auth: {
    signup: (body: { email: string; password: string; displayName: string; role: string }) =>
      request<{ accessToken: string; refreshToken: string; user: Record<string, unknown> }>(
        '/auth/email/signup', { method: 'POST', body: JSON.stringify(body) }
      ),
    signin: (body: { email: string; password: string }) =>
      request<{ accessToken: string; refreshToken: string; user: Record<string, unknown> }>(
        '/auth/email/signin', { method: 'POST', body: JSON.stringify(body) }
      ),
    me: () =>
      request<Record<string, unknown>>('/auth/me'),
    signout: () =>
      request<void>('/auth/signout', { method: 'POST' }),
  },

  data: {
    list: <T>(table: string, params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<{ data: T[]; total: number }>(`/data/${table}${qs}`);
    },
    get: <T>(table: string, id: string) =>
      request<T>(`/data/${table}/${id}`),
    create: <T>(table: string, body: unknown) =>
      request<T>(`/data/${table}`, { method: 'POST', body: JSON.stringify(body) }),
    update: <T>(table: string, id: string, body: unknown) =>
      request<T>(`/data/${table}/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (table: string, id: string) =>
      request<void>(`/data/${table}/${id}`, { method: 'DELETE' }),
  },
};
