import { useQuery } from '@tanstack/react-query';
import { CreditCard } from 'lucide-react';
import { paymentsApi } from '../api/endpoints';
import { formatCurrency, formatDate } from '../utils/formatters';
import type { Payment, PaymentStats } from '../api/types';

const METHOD_LABELS: Record<string, string> = {
  STRIPE: 'Stripe', CASH: 'Cash', CHECK: 'Check',
  BANK_TRANSFER: 'Bank Transfer', OTHER: 'Other',
};

export function PaymentsPage() {
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => (await paymentsApi.list()).payments,
  });

  const { data: summary } = useQuery({
    queryKey: ['payments', 'summary'],
    queryFn: () => paymentsApi.summary(),
  });

  const totalReceived = payments.reduce((s: number, p: Payment) => s + p.amount, 0);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Payments</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Received', value: formatCurrency(totalReceived) },
          { label: 'Stripe Revenue', value: formatCurrency(summary?.stripeRevenue ?? 0) },
          { label: 'Manual Revenue', value: formatCurrency(summary?.manualRevenue ?? 0) },
        ].map((kpi) => (
          <div key={kpi.label} style={{
            background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--stroke-hairline)', padding: '16px 20px',
          }}>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{kpi.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      <div style={{
        background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--stroke-hairline)', overflow: 'hidden',
      }}>
        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading...</div>
        ) : payments.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <CreditCard size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
            <div>No payments recorded</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--stroke-hairline)' }}>
                {['Job', 'Client', 'Amount', 'Method', 'Date'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((p: Payment) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--stroke-hairline)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{p.job?.type || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>{p.job?.client?.name || '—'}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--status-success)' }}>
                    {formatCurrency(p.amount)}
                  </td>
                  <td style={{ padding: '12px 16px' }}>{METHOD_LABELS[p.method] || p.method}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-tertiary)' }}>{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
