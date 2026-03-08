import { useQuery } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { statsApi, exportsApi } from '../api/endpoints';
import { formatCurrency } from '../utils/formatters';

export function ReportsPage() {
  const { data: stats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => statsApi.dashboard(),
  });

  const { data: reportStats } = useQuery({
    queryKey: ['reportStats'],
    queryFn: () => statsApi.reports(),
  });

  const handleExport = (type: string) => {
    let url: string;
    switch (type) {
      case 'jobs':
        url = exportsApi.jobsCsvUrl();
        break;
      case 'expenses':
        url = exportsApi.expensesCsvUrl();
        break;
      default:
        return;
    }
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.click();
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Reports</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Revenue', value: formatCurrency(reportStats?.totalRevenue ?? stats?.weeklyRevenue ?? 0) },
          { label: 'Total Jobs', value: reportStats?.totalJobs ?? stats?.openJobs ?? 0 },
          { label: 'Completed Jobs', value: reportStats?.completedJobs ?? 0 },
          { label: 'Avg Job Value', value: formatCurrency(reportStats?.averageJobValue ?? 0) },
          { label: 'New Clients', value: reportStats?.newClients ?? 0 },
          { label: 'Profit Margin', value: `${(reportStats?.profitMargin ?? 0).toFixed(0)}%` },
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
        border: '1px solid var(--stroke-hairline)', padding: 20,
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Export Data</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {[
            { key: 'jobs', label: 'Jobs CSV', desc: 'All jobs with details' },
            { key: 'expenses', label: 'Expenses CSV', desc: 'All expenses by category' },
          ].map((exp) => (
            <button
              key={exp.key}
              onClick={() => handleExport(exp.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--stroke-soft)', textAlign: 'left',
                background: 'var(--bg-primary)',
                transition: 'border-color 0.15s',
              }}
            >
              <Download size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{exp.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{exp.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
