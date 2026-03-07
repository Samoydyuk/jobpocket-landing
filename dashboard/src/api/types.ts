export type Plan = 'FREE' | 'PRO' | 'BUSINESS';

export type JobStatus =
  | 'DRAFT' | 'SENT' | 'APPROVED' | 'SCHEDULED'
  | 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED'
  | 'INVOICED' | 'PAID' | 'CANCELLED';

export type PaymentStatus = 'UNPAID' | 'PARTIAL' | 'PAID' | 'REFUNDED';

export interface User {
  id: string;
  phone?: string | null;
  email?: string | null;
  businessName: string;
  businessType?: string;
  businessVertical?: string;
  plan?: Plan;
  businessAddress?: string | null;
  businessEmail?: string | null;
  businessLogo?: string | null;
  businessPhone?: string | null;
  currency?: string;
  defaultTaxRate?: number;
  timezone?: string;
  weekStartDay?: number;
  estimatePrefix?: string;
  invoicePrefix?: string;
  taxName?: string;
  currentCompanyId?: string | null;
}

export interface Client {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
  tags?: string[];
  totalRevenue?: number;
  jobCount?: number;
  createdAt?: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category?: string;
  isTaxable?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'OWNER' | 'WORKER';
  status: 'INVITED' | 'ACTIVE' | 'INACTIVE';
}

export interface Job {
  id: string;
  clientId: string;
  client?: Client;
  status: JobStatus;
  type?: string;
  address: string;
  notes?: string;
  estimateNumber?: string;
  invoiceNumber?: string;
  scheduledAt?: string | null;
  completedAt?: string;
  subtotal: number;
  taxRate: number;
  tax: number;
  total: number;
  paymentStatus: PaymentStatus;
  paidAt?: string;
  lineItems: LineItem[];
  assignedTo?: TeamMember;
  priority?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  weeklyRevenue: number;
  monthlyPaid: number;
  monthlyInvoiced: number;
  monthlyPending: number;
  openJobs: number;
  unpaidAmount: number;
  unpaidCount: number;
  overdueAmount: number;
  overdueCount: number;
  paidRate: number;
  invoicedCount: number;
  paidCount: number;
  manualPaymentsAmount: number;
  stripePaymentsAmount: number;
  completedJobsTotal: number;
}

export interface ReportStats {
  totalRevenue: number;
  revenueChange: number;
  totalJobs: number;
  completedJobs: number;
  averageJobValue: number;
  newClients: number;
  chartData: { label: string; revenue: number }[];
  topServices: { name: string; count: number; revenue: number }[];
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
}
