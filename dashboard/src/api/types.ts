// ==================== Enums & Unions ====================

export type Plan = 'FREE' | 'PRO' | 'BUSINESS';
export type JobStatus = 'DRAFT' | 'SENT' | 'APPROVED' | 'SCHEDULED' | 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED' | 'INVOICED' | 'PAID' | 'CANCELLED';
export type PaymentStatus = 'UNPAID' | 'PARTIAL' | 'PAID' | 'REFUNDED';
export type PaymentMethod = 'STRIPE' | 'CASH' | 'CHECK' | 'BANK_TRANSFER' | 'OTHER';
export type DocumentType = 'ESTIMATE' | 'INVOICE';
export type TemplateLayout = 'CLASSIC' | 'MODERN' | 'DETAILED' | 'COMPACT';
export type TeamRole = 'OWNER' | 'WORKER';
export type MemberStatus = 'INVITED' | 'ACTIVE' | 'INACTIVE';
export type AssignmentStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';
export type RecurringFrequency = 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
export type PhotoCategory = 'BEFORE' | 'DURING' | 'AFTER' | 'ISSUE' | 'GENERAL';
export type BookingRequestStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED';
export type PartLocation = 'VAN' | 'WAREHOUSE' | 'ORDERED';
export type PartUsageType = 'USED_ON_JOB' | 'RESTOCKED' | 'ADJUSTED' | 'TRANSFERRED' | 'RETURNED';

export type ExpenseCategory =
  | 'MATERIALS' | 'TOOLS' | 'FUEL' | 'VEHICLE' | 'INSURANCE'
  | 'LICENSE' | 'MARKETING' | 'OFFICE' | 'UTILITIES' | 'LABOR' | 'OTHER';

export type PartCategory =
  | 'COMPRESSOR' | 'THERMOSTAT' | 'MOTOR' | 'VALVE' | 'FILTER'
  | 'BELT' | 'GASKET' | 'CONTROL_BOARD' | 'SENSOR' | 'HEATING_ELEMENT'
  | 'FAN' | 'PUMP' | 'SWITCH' | 'CAPACITOR' | 'RELAY'
  | 'DOOR_SEAL' | 'HOSE' | 'TIMER' | 'IGNITER' | 'OTHER';

// ==================== Core Entities ====================

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
  estimateCounter?: number;
  invoiceCounter?: number;
  taxName?: string;
  businessState?: string | null;
  currentCompanyId?: string | null;
  defaultTemplateId?: string | null;
  aboutBio?: string | null;
  websiteUrl?: string | null;
  serviceZipCodes?: string[];
  serviceRadius?: number | null;
  licenseNumber?: string | null;
  technicianSignature?: string | null;
}

export interface Client {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  zipCode?: string | null;
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
  partStockId?: string;
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
  assignedToId?: string;
  assignedTo?: TeamMember;
  assignmentStatus?: AssignmentStatus;
  assignments?: JobAssignment[];
  priority?: number;
  totalPaid?: number;
  photoCount?: number;
  templateId?: string;
  customFieldValues?: Record<string, string>;
  vertical?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobAssignment {
  id: string;
  jobId: string;
  teamMemberId: string;
  teamMember: TeamMember;
  status: AssignmentStatus;
  assignedAt: string;
  respondedAt?: string;
}

// ==================== Team & Company ====================

export interface TeamMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: TeamRole;
  status: MemberStatus;
  userId?: string;
  assignedJobsCount?: number;
  invitedAt?: string;
  acceptedAt?: string;
}

export interface Company {
  id: string;
  name: string;
  ownerId: string;
  owner?: { id: string; businessName: string; phone: string; email?: string };
  role?: TeamRole;
  status?: MemberStatus;
  teamSize?: number;
  stats?: { teamSize: number; totalJobs: number; totalClients: number };
  businessType?: string;
  businessVertical?: string;
  businessLogo?: string;
  businessAddress?: string;
  businessPhone?: string;
  businessEmail?: string;
  taxRate?: number;
  timezone?: string;
  currency?: string;
  createdAt: string;
}

export interface Invitation {
  id: string;
  token: string;
  name: string;
  company: { id: string; name: string; businessLogo?: string };
  invitedBy: string;
  role: TeamRole;
  createdAt: string;
  expiresAt: string;
}

// ==================== Documents ====================

export interface Document {
  id: string;
  jobId: string;
  userId: string;
  type: DocumentType;
  documentNumber: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  subtotal: number;
  tax: number;
  total: number;
  taxRate: number;
  lineItems: { description: string; quantity: number; unitPrice: number; total: number }[];
  dueDate?: string;
  notes?: string;
  terms?: string;
  sentAt?: string;
  viewedAt?: string;
  paidAt?: string;
  pdfUrl?: string;
  signatureUrl?: string;
  signedAt?: string;
  signerName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentInput {
  jobId: string;
  type: DocumentType;
  documentNumber: string;
  clientName: string;
  clientEmail?: string | null;
  clientPhone?: string | null;
  clientAddress?: string | null;
  subtotal: number;
  tax: number;
  total: number;
  taxRate: number;
  lineItems: { description: string; quantity: number; unitPrice: number; total: number }[];
  dueDate?: string | null;
  notes?: string | null;
  terms?: string | null;
}

// ==================== Templates ====================

export interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number' | 'textarea';
  options?: string[];
  required: boolean;
  defaultValue?: string;
  placeholder?: string;
  width: 'full' | 'half';
  order: number;
}

export interface QRCodeSettings {
  enabled: boolean;
  type: 'payment' | 'review' | 'website' | 'custom';
  url?: string;
  reviewPlatform?: 'google' | 'yelp' | 'facebook';
  position: 'header' | 'footer';
  size: 'small' | 'medium' | 'large';
}

export interface InvoiceTemplate {
  id: string;
  userId?: string;
  companyId?: string;
  name: string;
  industry?: string;
  layout: TemplateLayout;
  customFields: CustomField[];
  qrCodeSettings?: QRCodeSettings;
  colors?: { primary: string; secondary?: string; accent?: string };
  showServicesList: boolean;
  servicesList?: string;
  isPreset: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateInput {
  name: string;
  industry?: string;
  layout?: TemplateLayout;
  customFields?: CustomField[];
  qrCodeSettings?: QRCodeSettings;
  colors?: { primary: string; secondary?: string; accent?: string };
  showServicesList?: boolean;
  servicesList?: string;
}

// ==================== Payments ====================

export interface Payment {
  id: string;
  jobId: string;
  userId: string;
  amount: number;
  platformFee: number;
  netAmount: number;
  stripeSessionId?: string;
  stripePaymentId?: string;
  method: PaymentMethod;
  status: string;
  isDeposit?: boolean;
  paidAt?: string;
  createdAt: string;
  job?: { id: string; type?: string; client?: { name: string } };
}

export interface PaymentStats {
  period: string;
  totalInvoiced: number;
  paidJobs: number;
  paidRate: number;
  platformFeesCollected: number;
  stripeRevenue: number;
  stripePaymentCount: number;
  manualRevenue: number;
  manualPaymentCount: number;
}

export interface StripeConnectStatus {
  connected: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  accountId?: string;
}

// ==================== Expenses ====================

export interface Expense {
  id: string;
  userId: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
  vendor?: string;
  receiptUrl?: string;
  notes?: string;
  jobId?: string;
  mileage?: number;
  mileageRate?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseSummary {
  year: number;
  totalExpenses: number;
  byCategory: { category: ExpenseCategory; total: number; count: number }[];
  byMonth: { month: string; total: number }[];
}

// ==================== Time Tracking ====================

export interface TimeEntry {
  id: string;
  jobId: string;
  userId: string;
  teamMemberId?: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  notes?: string;
  breakMinutes: number;
  createdAt: string;
  updatedAt: string;
  job?: { id: string; type?: string; address: string; status: string; client?: { id: string; name: string } };
  teamMember?: { id: string; name: string };
}

export interface TimeSummary {
  totalMinutes: number;
  totalHours: number;
  totalBreakMinutes: number;
  entriesCount: number;
  byDay: { date: string; minutes: number; hours: number }[];
  byType: { type: string; minutes: number; hours: number }[];
}

// ==================== Recurring Jobs ====================

export interface RecurringJob {
  id: string;
  userId: string;
  clientId: string;
  type?: string;
  address: string;
  notes?: string;
  lineItems: { description: string; quantity: number; unitPrice: number; total: number }[];
  subtotal: number;
  tax: number;
  total: number;
  taxRate: number;
  frequency: RecurringFrequency;
  dayOfWeek?: number;
  dayOfMonth?: number;
  startDate: string;
  endDate?: string;
  nextRunAt: string;
  isActive: boolean;
  lastRunAt?: string;
  jobsGenerated: number;
  createdAt: string;
  updatedAt: string;
  client?: { id: string; name: string; phone?: string; email?: string; address?: string };
  generatedJobs?: { id: string; status: string; scheduledAt?: string; total: number; createdAt: string }[];
}

export interface CreateRecurringInput {
  clientId: string;
  type?: string;
  address: string;
  notes?: string;
  lineItems: { description: string; quantity: number; unitPrice: number; total: number }[];
  taxRate?: number;
  frequency: RecurringFrequency;
  dayOfWeek?: number;
  dayOfMonth?: number;
  startDate: string;
  endDate?: string;
}

// ==================== Booking ====================

export interface BookingRequest {
  id: string;
  userId: string;
  teamMemberId?: string | null;
  clientName: string;
  clientPhone: string;
  clientEmail?: string | null;
  clientAddress?: string | null;
  serviceType: string;
  description?: string | null;
  preferredDate?: string | null;
  preferredTime?: string | null;
  scheduledStart?: string | null;
  scheduledEnd?: string | null;
  status: BookingRequestStatus;
  jobId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BookingService {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  duration?: number | null;
  priceFrom?: number | null;
  priceTo?: number | null;
  isActive: boolean;
  sortOrder: number;
  teamMemberIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WeekdayConfig {
  enabled: boolean;
  start?: string;
  end?: string;
}

export interface BookingSchedule {
  id: string;
  userId: string;
  teamMemberId?: string | null;
  weeklyHours: Record<string, WeekdayConfig>;
  bufferMinutes: number;
  minLeadHours: number;
  maxAdvanceDays: number;
  slotDuration: number;
  schedulingMode: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingDateOverride {
  id: string;
  userId: string;
  teamMemberId?: string | null;
  date: string;
  isBlocked: boolean;
  start?: string | null;
  end?: string | null;
  reason?: string | null;
  createdAt: string;
}

export interface BookingSettings {
  bookingSlug: string | null;
  bookingEnabled: boolean;
  portalEnabled: boolean;
  portalColor: string | null;
  portalWelcomeText: string | null;
  bookingUrl: string | null;
  pendingCount: number;
}

// ==================== Inventory ====================

export interface PartStock {
  id: string;
  userId: string;
  companyId?: string;
  partNumber: string;
  name: string;
  description?: string;
  brand?: string;
  compatibleModels: string[];
  category: PartCategory;
  quantity: number;
  location: PartLocation;
  costPrice: number;
  sellPrice: number;
  reorderLevel: number;
  preferredSupplier?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PartUsageLog {
  id: string;
  partStockId: string;
  userId: string;
  type: PartUsageType;
  quantity: number;
  previousQty: number;
  newQty: number;
  jobId?: string;
  notes?: string;
  createdAt: string;
}

export interface InventorySummary {
  totalParts: number;
  totalValue: number;
  lowStockCount: number;
  byCategory: Record<string, number>;
  byLocation: Record<string, number>;
}

// ==================== Photos ====================

export interface JobPhoto {
  id: string;
  jobId: string;
  userId: string;
  teamMemberId?: string;
  category: PhotoCategory;
  caption?: string;
  url: string;
  thumbnailUrl: string;
  fileName: string;
  fileSize: number;
  takenAt: string;
  createdAt: string;
}

// ==================== Places ====================

export interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: { main_text: string; secondary_text: string };
}

export interface PlaceDetails {
  formatted_address: string;
  address_components?: { long_name: string; short_name: string; types: string[] }[];
  geometry?: { location: { lat: number; lng: number } };
}

// ==================== Custom Job Types ====================

export interface CustomJobType {
  id: string;
  userId: string;
  companyId?: string;
  name: string;
  icon: string;
  vertical?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==================== Stats ====================

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

export interface DetailedReportData {
  period: { start: string; end: string };
  summary: {
    totalRevenue: number;
    totalSubtotal: number;
    totalTax: number;
    totalExpenses: number;
    netProfit: number;
    profitMargin: number;
    paidJobsCount: number;
    totalJobsCount: number;
    expensesCount: number;
    averageJobValue: number;
  };
  revenueByService: Record<string, { count: number; revenue: number }>;
  expensesByCategory: Record<string, { count: number; amount: number }>;
  chartData: { label: string; revenue: number; expenses: number; profit: number }[];
}

// ==================== Create Inputs ====================

export interface CreateJobInput {
  clientId?: string;
  type?: string;
  address?: string;
  notes?: string;
  lineItems: Omit<LineItem, 'id'>[];
  taxRate?: number;
  scheduledAt?: string;
  templateId?: string;
  customFieldValues?: Record<string, string>;
}

export interface CreateClientInput {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  tags?: string[];
}
