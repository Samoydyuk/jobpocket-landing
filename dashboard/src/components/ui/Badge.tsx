import { useTheme } from '../../theme/ThemeContext';
import type { JobStatus } from '../../api/types';

const STATUS_COLORS: Record<string, { light: string; dark: string }> = {
  DRAFT: { light: '#6B7280', dark: '#9CA3AF' },
  SENT: { light: '#2F6FED', dark: '#6EA0FF' },
  APPROVED: { light: '#2EAA65', dark: '#4ADE80' },
  SCHEDULED: { light: '#6366F1', dark: '#A5B4FC' },
  IN_PROGRESS: { light: '#E6A23C', dark: '#FBBF24' },
  PAUSED: { light: '#8B5CF6', dark: '#C4B5FD' },
  COMPLETED: { light: '#16A34A', dark: '#4ADE80' },
  INVOICED: { light: '#7C3AED', dark: '#A78BFA' },
  PAID: { light: '#059669', dark: '#34D399' },
  CANCELLED: { light: '#E05252', dark: '#FB7185' },
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft', SENT: 'Sent', APPROVED: 'Approved', SCHEDULED: 'Scheduled',
  IN_PROGRESS: 'In Progress', PAUSED: 'Paused', COMPLETED: 'Completed',
  INVOICED: 'Invoiced', PAID: 'Paid', CANCELLED: 'Cancelled',
  UNPAID: 'Unpaid', PARTIAL: 'Partial', REFUNDED: 'Refunded',
};

export function Badge({ status, label }: { status: string; label?: string }) {
  const { isDark } = useTheme();
  const colors = STATUS_COLORS[status] || STATUS_COLORS.DRAFT;
  const color = isDark ? colors.dark : colors.light;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 10px',
      borderRadius: 'var(--radius-pill)',
      fontSize: 12,
      fontWeight: 600,
      color,
      background: `${color}18`,
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', background: color,
      }} />
      {label || STATUS_LABELS[status] || status}
    </span>
  );
}

export function getStatusColor(status: string, isDark: boolean): string {
  const entry = STATUS_COLORS[status];
  return entry ? (isDark ? entry.dark : entry.light) : (isDark ? '#9CA3AF' : '#6B7280');
}
