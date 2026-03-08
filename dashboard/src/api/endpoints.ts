import { apiFetch } from './client';
import type {
  User, Job, Client, DashboardStats, ReportStats, DetailedReportData,
  Document, CreateDocumentInput, InvoiceTemplate, CreateTemplateInput,
  Payment, PaymentStats, StripeConnectStatus,
  Expense, ExpenseSummary,
  TimeEntry, TimeSummary,
  RecurringJob, CreateRecurringInput,
  TeamMember, Company, Invitation,
  BookingRequest, BookingService, BookingSchedule, BookingDateOverride, BookingSettings,
  PartStock, PartUsageLog, InventorySummary,
  CustomJobType,
  PlacePrediction, PlaceDetails,
  JobPhoto,
  CreateJobInput, CreateClientInput,
} from './types';

// ==================== Auth ====================

export const authApi = {
  sendEmailCode: (email: string) =>
    apiFetch<{ success: boolean }>('/auth/send-email-code', {
      method: 'POST', body: JSON.stringify({ email }),
    }),
  verifyEmail: (email: string, code: string) =>
    apiFetch<{ success: boolean; isNewUser: boolean; token?: string; user?: User }>('/auth/verify-email', {
      method: 'POST', body: JSON.stringify({ email, code }),
    }),
  me: () => apiFetch<{ user: User }>('/auth/me'),
  updateSettings: (settings: Partial<User>) =>
    apiFetch<{ user: User }>('/auth/settings', {
      method: 'PUT', body: JSON.stringify(settings),
    }),
  createQrSession: () =>
    apiFetch<{ sessionId: string }>('/auth/qr-session', { method: 'POST', body: JSON.stringify({}) }),
  pollQrSession: (sessionId: string) =>
    apiFetch<{ status: 'pending' | 'confirmed' | 'expired'; token?: string; user?: User }>(`/auth/qr-session/${sessionId}`),
};

// ==================== Stats ====================

export const statsApi = {
  dashboard: () => apiFetch<DashboardStats>('/stats/dashboard'),
  today: () => apiFetch<{ jobs: Job[] }>('/stats/today'),
  upcoming: (days = 7) => apiFetch<{ jobs: Job[] }>(`/stats/upcoming?days=${days}`),
  reports: (period = 'month') => apiFetch<ReportStats>(`/stats/reports?period=${period}`),
  revenue: (params?: { period?: string; start?: string; end?: string }) => {
    const qs = new URLSearchParams();
    if (params?.period) qs.set('period', params.period);
    if (params?.start) qs.set('start', params.start);
    if (params?.end) qs.set('end', params.end);
    return apiFetch<ReportStats>(`/stats/revenue?${qs}`);
  },
  team: () => apiFetch<{ members: Array<{ id: string; name: string; hoursWorked: number; jobsCompleted: number; revenue: number }> }>('/stats/team'),
};

// ==================== Jobs ====================

export const jobsApi = {
  list: (params: { status?: string; search?: string; clientId?: string; limit?: number; offset?: number; sort?: string; startDate?: string; endDate?: string }) => {
    const qs = new URLSearchParams();
    if (params.status) qs.set('status', params.status);
    if (params.search) qs.set('search', params.search);
    if (params.clientId) qs.set('clientId', params.clientId);
    if (params.limit) qs.set('limit', String(params.limit));
    if (params.offset) qs.set('offset', String(params.offset));
    if (params.sort) qs.set('sort', params.sort);
    if (params.startDate) qs.set('startDate', params.startDate);
    if (params.endDate) qs.set('endDate', params.endDate);
    return apiFetch<{ jobs: Job[]; total: number; hasMore: boolean }>(`/jobs?${qs}`);
  },
  get: (id: string) => apiFetch<Job>(`/jobs/${id}`),
  create: (data: CreateJobInput) =>
    apiFetch<Job>('/jobs', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Job>) =>
    apiFetch<Job>(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateStatus: (id: string, status: string) =>
    apiFetch<Job>(`/jobs/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  updateLineItems: (id: string, lineItems: Array<{ description: string; quantity: number; unitPrice: number; total: number; category?: string; isTaxable?: boolean }>) =>
    apiFetch<Job>(`/jobs/${id}/line-items`, { method: 'PUT', body: JSON.stringify({ lineItems }) }),
  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/jobs/${id}`, { method: 'DELETE' }),
  assign: (id: string, teamMemberId: string) =>
    apiFetch<{ success: boolean }>(`/jobs/${id}/assign`, { method: 'POST', body: JSON.stringify({ teamMemberId }) }),
  unassign: (id: string) =>
    apiFetch<{ success: boolean }>(`/jobs/${id}/unassign`, { method: 'POST', body: JSON.stringify({}) }),
  sendEstimate: (id: string, data?: { templateId?: string }) =>
    apiFetch<{ success: boolean }>(`/jobs/${id}/send-estimate`, { method: 'POST', body: JSON.stringify(data || {}) }),
  sendInvoice: (id: string, data?: { templateId?: string }) =>
    apiFetch<{ success: boolean }>(`/jobs/${id}/send-invoice`, { method: 'POST', body: JSON.stringify(data || {}) }),
};

// ==================== Clients ====================

export const clientsApi = {
  list: (params: { search?: string; limit?: number; offset?: number }) => {
    const qs = new URLSearchParams();
    if (params.search) qs.set('search', params.search);
    if (params.limit) qs.set('limit', String(params.limit));
    if (params.offset) qs.set('offset', String(params.offset));
    return apiFetch<{ clients: Client[]; total: number }>(`/clients?${qs}`);
  },
  get: (id: string) => apiFetch<{ client: Client; jobs: Job[] }>(`/clients/${id}`),
  create: (data: CreateClientInput) =>
    apiFetch<Client>('/clients', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<CreateClientInput>) =>
    apiFetch<Client>(`/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/clients/${id}`, { method: 'DELETE' }),
};

// ==================== Documents ====================

export const documentsApi = {
  list: (params?: { type?: string; jobId?: string; limit?: number; offset?: number }) => {
    const qs = new URLSearchParams();
    if (params?.type) qs.set('type', params.type);
    if (params?.jobId) qs.set('jobId', params.jobId);
    if (params?.limit) qs.set('limit', String(params.limit));
    if (params?.offset) qs.set('offset', String(params.offset));
    return apiFetch<{ documents: Document[]; total: number }>(`/documents?${qs}`);
  },
  get: (id: string) => apiFetch<Document>(`/documents/${id}`),
  create: (data: CreateDocumentInput) =>
    apiFetch<Document>('/documents', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<CreateDocumentInput>) =>
    apiFetch<Document>(`/documents/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/documents/${id}`, { method: 'DELETE' }),
  send: (id: string) =>
    apiFetch<{ success: boolean }>(`/documents/${id}/send`, { method: 'POST', body: JSON.stringify({}) }),
};

// ==================== Templates ====================

export const templatesApi = {
  list: () => apiFetch<{ templates: InvoiceTemplate[] }>('/templates'),
  presets: () => apiFetch<{ templates: InvoiceTemplate[] }>('/templates/presets'),
  get: (id: string) => apiFetch<InvoiceTemplate>(`/templates/${id}`),
  create: (data: CreateTemplateInput) =>
    apiFetch<InvoiceTemplate>('/templates', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<CreateTemplateInput>) =>
    apiFetch<InvoiceTemplate>(`/templates/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/templates/${id}`, { method: 'DELETE' }),
  duplicate: (id: string) =>
    apiFetch<InvoiceTemplate>(`/templates/${id}/duplicate`, { method: 'POST', body: JSON.stringify({}) }),
  setDefault: (id: string) =>
    apiFetch<{ success: boolean }>(`/templates/${id}/default`, { method: 'PUT', body: JSON.stringify({}) }),
};

// ==================== Payments ====================

export const paymentsApi = {
  list: (params?: { jobId?: string; method?: string; limit?: number; offset?: number }) => {
    const qs = new URLSearchParams();
    if (params?.jobId) qs.set('jobId', params.jobId);
    if (params?.method) qs.set('method', params.method);
    if (params?.limit) qs.set('limit', String(params.limit));
    if (params?.offset) qs.set('offset', String(params.offset));
    return apiFetch<{ payments: Payment[]; total: number }>(`/payments?${qs}`);
  },
  summary: () => apiFetch<PaymentStats>('/payments/summary'),
  connectStatus: () => apiFetch<StripeConnectStatus>('/payments/connect-status'),
  createSession: (jobId: string, amount: number) =>
    apiFetch<{ url: string }>('/payments/create-session', {
      method: 'POST', body: JSON.stringify({ jobId, amount }),
    }),
  recordCash: (data: { jobId: string; amount: number; method: string; notes?: string; isDeposit?: boolean }) =>
    apiFetch<Payment>('/payments/record-cash', {
      method: 'POST', body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Payment>) =>
    apiFetch<Payment>(`/payments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/payments/${id}`, { method: 'DELETE' }),
};

// ==================== Expenses ====================

export const expensesApi = {
  list: (params?: { category?: string; jobId?: string; startDate?: string; endDate?: string; limit?: number; offset?: number }) => {
    const qs = new URLSearchParams();
    if (params?.category) qs.set('category', params.category);
    if (params?.jobId) qs.set('jobId', params.jobId);
    if (params?.startDate) qs.set('startDate', params.startDate);
    if (params?.endDate) qs.set('endDate', params.endDate);
    if (params?.limit) qs.set('limit', String(params.limit));
    if (params?.offset) qs.set('offset', String(params.offset));
    return apiFetch<{ expenses: Expense[]; total: number }>(`/expenses?${qs}`);
  },
  get: (id: string) => apiFetch<Expense>(`/expenses/${id}`),
  create: (data: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) =>
    apiFetch<Expense>('/expenses', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Expense>) =>
    apiFetch<Expense>(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/expenses/${id}`, { method: 'DELETE' }),
  summary: (year?: number) =>
    apiFetch<ExpenseSummary>(`/expenses/summary${year ? `?year=${year}` : ''}`),
};

// ==================== Time Tracking ====================

export const timeTrackingApi = {
  list: (params?: { startDate?: string; endDate?: string; jobId?: string; teamMemberId?: string }) => {
    const qs = new URLSearchParams();
    if (params?.startDate) qs.set('startDate', params.startDate);
    if (params?.endDate) qs.set('endDate', params.endDate);
    if (params?.jobId) qs.set('jobId', params.jobId);
    if (params?.teamMemberId) qs.set('teamMemberId', params.teamMemberId);
    return apiFetch<{ entries: TimeEntry[] }>(`/time?${qs}`);
  },
  active: () => apiFetch<{ entry: TimeEntry | null }>('/time/active'),
  summary: (params?: { startDate?: string; endDate?: string; period?: string }) => {
    const qs = new URLSearchParams();
    if (params?.startDate) qs.set('startDate', params.startDate);
    if (params?.endDate) qs.set('endDate', params.endDate);
    if (params?.period) qs.set('period', params.period);
    return apiFetch<TimeSummary>(`/time/summary?${qs}`);
  },
  clockIn: (data: { jobId: string; notes?: string }) =>
    apiFetch<TimeEntry>('/time/clock-in', { method: 'POST', body: JSON.stringify(data) }),
  clockOut: (data?: { notes?: string }) =>
    apiFetch<TimeEntry>('/time/clock-out', { method: 'POST', body: JSON.stringify(data || {}) }),
  update: (id: string, data: Partial<TimeEntry>) =>
    apiFetch<TimeEntry>(`/time/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/time/${id}`, { method: 'DELETE' }),
};

// ==================== Recurring ====================

export const recurringApi = {
  list: () => apiFetch<{ recurring: RecurringJob[] }>('/recurring'),
  get: (id: string) => apiFetch<RecurringJob>(`/recurring/${id}`),
  create: (data: CreateRecurringInput) =>
    apiFetch<RecurringJob>('/recurring', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<CreateRecurringInput & { isActive: boolean }>) =>
    apiFetch<RecurringJob>(`/recurring/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/recurring/${id}`, { method: 'DELETE' }),
  run: (id: string) =>
    apiFetch<{ job: Job }>(`/recurring/${id}/run`, { method: 'POST', body: JSON.stringify({}) }),
};

// ==================== Team ====================

export const teamsApi = {
  me: () => apiFetch<{ userId: string; companyId: string | null; teamMemberId: string | null; role: string | null }>('/teams/me'),
  list: () => apiFetch<{ members: TeamMember[] }>('/teams'),
  invite: (data: { name: string; email?: string; phone?: string; role?: string }) =>
    apiFetch<{ invitation: Invitation }>('/teams/invite', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<TeamMember>) =>
    apiFetch<TeamMember>(`/teams/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) =>
    apiFetch<{ success: boolean }>(`/teams/${id}`, { method: 'DELETE' }),
};

// ==================== Companies ====================

export const companiesApi = {
  list: () => apiFetch<{ companies: Company[] }>('/companies'),
  current: () => apiFetch<Company>('/companies/current'),
  update: (id: string, data: Partial<Company>) =>
    apiFetch<Company>(`/companies/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// ==================== Invitations ====================

export const invitationsApi = {
  pending: () => apiFetch<{ invitations: Invitation[] }>('/invitations/pending'),
  accept: (token: string) =>
    apiFetch<{ success: boolean }>(`/invitations/accept/${token}`, { method: 'POST', body: JSON.stringify({}) }),
  revoke: (id: string) =>
    apiFetch<{ success: boolean }>(`/invitations/${id}`, { method: 'DELETE' }),
};

// ==================== Booking ====================

export const bookingApi = {
  requests: (status?: string) => {
    const qs = status ? `?status=${status}` : '';
    return apiFetch<{ requests: BookingRequest[]; total: number }>(`/booking/requests${qs}`);
  },
  acceptRequest: (id: string, data?: { scheduledStart?: string; scheduledEnd?: string }) =>
    apiFetch<BookingRequest>(`/booking/requests/${id}/accept`, { method: 'POST', body: JSON.stringify(data || {}) }),
  declineRequest: (id: string) =>
    apiFetch<BookingRequest>(`/booking/requests/${id}/decline`, { method: 'POST', body: JSON.stringify({}) }),
  services: () => apiFetch<{ services: BookingService[] }>('/booking/services'),
  createService: (data: Partial<BookingService>) =>
    apiFetch<BookingService>('/booking/services', { method: 'POST', body: JSON.stringify(data) }),
  updateService: (id: string, data: Partial<BookingService>) =>
    apiFetch<BookingService>(`/booking/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteService: (id: string) =>
    apiFetch<{ success: boolean }>(`/booking/services/${id}`, { method: 'DELETE' }),
  settings: () => apiFetch<BookingSettings>('/booking/settings'),
  updateSettings: (data: Partial<BookingSettings>) =>
    apiFetch<BookingSettings>('/booking/settings', { method: 'PUT', body: JSON.stringify(data) }),
  availability: () => apiFetch<{ schedule: BookingSchedule; overrides: BookingDateOverride[] }>('/booking/availability'),
  updateAvailability: (data: Partial<BookingSchedule>) =>
    apiFetch<BookingSchedule>('/booking/availability', { method: 'PUT', body: JSON.stringify(data) }),
  addOverride: (data: Omit<BookingDateOverride, 'id' | 'userId' | 'createdAt'>) =>
    apiFetch<BookingDateOverride>('/booking/availability/overrides', { method: 'POST', body: JSON.stringify(data) }),
  deleteOverride: (id: string) =>
    apiFetch<{ success: boolean }>(`/booking/availability/overrides/${id}`, { method: 'DELETE' }),
};

// ==================== Inventory ====================

export const inventoryApi = {
  list: (params?: { search?: string; category?: string; location?: string; lowStock?: boolean; limit?: number; offset?: number }) => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set('search', params.search);
    if (params?.category) qs.set('category', params.category);
    if (params?.location) qs.set('location', params.location);
    if (params?.lowStock) qs.set('lowStock', 'true');
    if (params?.limit) qs.set('limit', String(params.limit));
    if (params?.offset) qs.set('offset', String(params.offset));
    return apiFetch<{ parts: PartStock[]; total: number }>(`/inventory?${qs}`);
  },
  get: (id: string) => apiFetch<{ part: PartStock; transactions: PartUsageLog[] }>(`/inventory/${id}`),
  create: (data: Omit<PartStock, 'id' | 'userId' | 'isActive' | 'createdAt' | 'updatedAt'>) =>
    apiFetch<PartStock>('/inventory', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<PartStock>) =>
    apiFetch<PartStock>(`/inventory/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/inventory/${id}`, { method: 'DELETE' }),
  adjust: (id: string, data: { quantity: number; notes?: string }) =>
    apiFetch<PartStock>(`/inventory/${id}/adjust`, { method: 'POST', body: JSON.stringify(data) }),
  transfer: (id: string, data: { location: string; quantity: number }) =>
    apiFetch<PartStock>(`/inventory/${id}/transfer`, { method: 'POST', body: JSON.stringify(data) }),
  lowStock: () => apiFetch<{ parts: PartStock[] }>('/inventory/low-stock'),
  summary: () => apiFetch<InventorySummary>('/inventory/summary'),
};

// ==================== Photos ====================

export const photosApi = {
  listByJob: (jobId: string) => apiFetch<{ photos: JobPhoto[] }>(`/photos/${jobId}`),
  requestUpload: (data: { jobId: string; photos: Array<{ fileName: string; mimeType?: string; fileSize: number; category?: string }> }) =>
    apiFetch<{ uploads: Array<{ photoId: string; uploadUrl: string; token: string }> }>('/photos/upload-url', {
      method: 'POST', body: JSON.stringify(data),
    }),
  confirmUpload: (data: { uploads: Array<{ photoId: string; token: string }> }) =>
    apiFetch<{ success: boolean }>('/photos/confirm', {
      method: 'POST', body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/photos/${id}`, { method: 'DELETE' }),
};

// ==================== Custom Job Types ====================

export const customJobTypesApi = {
  list: () => apiFetch<{ jobTypes: CustomJobType[] }>('/custom-job-types'),
  create: (data: { name: string; icon: string; vertical?: string }) =>
    apiFetch<CustomJobType>('/custom-job-types', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<CustomJobType>) =>
    apiFetch<CustomJobType>(`/custom-job-types/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/custom-job-types/${id}`, { method: 'DELETE' }),
};

// ==================== Exports ====================

export const exportsApi = {
  jobsCsvUrl: (params?: { startDate?: string; endDate?: string }) => {
    const qs = new URLSearchParams();
    if (params?.startDate) qs.set('startDate', params.startDate);
    if (params?.endDate) qs.set('endDate', params.endDate);
    const token = localStorage.getItem('jp_token');
    if (token) qs.set('token', token);
    const base = import.meta.env.VITE_API_URL || 'https://jobpocketapp-production.up.railway.app';
    return `${base}/exports/jobs-csv?${qs}`;
  },
  expensesCsvUrl: (params?: { startDate?: string; endDate?: string }) => {
    const qs = new URLSearchParams();
    if (params?.startDate) qs.set('startDate', params.startDate);
    if (params?.endDate) qs.set('endDate', params.endDate);
    const token = localStorage.getItem('jp_token');
    if (token) qs.set('token', token);
    const base = import.meta.env.VITE_API_URL || 'https://jobpocketapp-production.up.railway.app';
    return `${base}/exports/expenses-csv?${qs}`;
  },
  taxReport: (params?: { year?: number; quarter?: number }) => {
    const qs = new URLSearchParams();
    if (params?.year) qs.set('year', String(params.year));
    if (params?.quarter) qs.set('quarter', String(params.quarter));
    return apiFetch<DetailedReportData>(`/exports/tax-report?${qs}`);
  },
};

// ==================== Places ====================

export const placesApi = {
  autocomplete: (input: string) =>
    apiFetch<{ predictions: PlacePrediction[] }>(`/places/autocomplete?input=${encodeURIComponent(input)}`),
  details: (placeId: string) =>
    apiFetch<PlaceDetails>(`/places/details?placeId=${placeId}`),
};

// ==================== Portal ====================

export const portalApi = {
  getLink: (clientId: string) =>
    apiFetch<{ url: string; token: string }>(`/portal-settings/link/${clientId}`),
  revokeAccess: (clientId: string) =>
    apiFetch<{ success: boolean }>(`/portal-settings/token/${clientId}`, { method: 'DELETE' }),
};
