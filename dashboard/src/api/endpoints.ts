import { apiFetch } from './client';
import type { User, Job, Client, DashboardStats, ReportStats } from './types';

// Auth
export const authApi = {
  sendEmailCode: (email: string) =>
    apiFetch<{ success: boolean }>('/auth/send-email-code', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  verifyEmail: (email: string, code: string) =>
    apiFetch<{ success: boolean; isNewUser: boolean; token?: string; user?: User }>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    }),
  me: () => apiFetch<{ user: User }>('/auth/me'),
};

// Dashboard Stats
export const statsApi = {
  dashboard: () => apiFetch<DashboardStats>('/stats/dashboard'),
  today: () => apiFetch<{ jobs: Job[] }>('/stats/today'),
  upcoming: (days = 7) => apiFetch<{ jobs: Job[] }>(`/stats/upcoming?days=${days}`),
  reports: (period = 'month') => apiFetch<ReportStats>(`/stats/reports?period=${period}`),
};

// Jobs
export const jobsApi = {
  list: (params: { status?: string; search?: string; clientId?: string; limit?: number; offset?: number; sort?: string }) => {
    const qs = new URLSearchParams();
    if (params.status) qs.set('status', params.status);
    if (params.search) qs.set('search', params.search);
    if (params.clientId) qs.set('clientId', params.clientId);
    if (params.limit) qs.set('limit', String(params.limit));
    if (params.offset) qs.set('offset', String(params.offset));
    if (params.sort) qs.set('sort', params.sort);
    return apiFetch<{ jobs: Job[]; total: number; hasMore: boolean }>(`/jobs?${qs}`);
  },
  get: (id: string) => apiFetch<Job>(`/jobs/${id}`),
  update: (id: string, data: Partial<Job>) =>
    apiFetch<Job>(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// Clients
export const clientsApi = {
  list: (params: { search?: string; limit?: number; offset?: number }) => {
    const qs = new URLSearchParams();
    if (params.search) qs.set('search', params.search);
    if (params.limit) qs.set('limit', String(params.limit));
    if (params.offset) qs.set('offset', String(params.offset));
    return apiFetch<{ clients: Client[]; total: number }>(`/clients?${qs}`);
  },
  get: (id: string) => apiFetch<{ client: Client; jobs: Job[] }>(`/clients/${id}`),
};
