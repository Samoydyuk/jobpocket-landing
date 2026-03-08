import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Repeat } from 'lucide-react';
import { recurringApi } from '../api/endpoints';
import { Tabs } from '../components/ui/Tabs';
import { formatCurrency } from '../utils/formatters';
import type { RecurringJob } from '../api/types';

const FREQ_LABELS: Record<string, string> = {
  WEEKLY: 'Weekly', BIWEEKLY: 'Bi-weekly',
  MONTHLY: 'Monthly', QUARTERLY: 'Quarterly', YEARLY: 'Yearly',
};

export function RecurringPage() {
  const [activeTab, setActiveTab] = useState('active');

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['recurringJobs'],
    queryFn: async () => (await recurringApi.list()).recurring,
  });

  const filtered = jobs.filter((j: RecurringJob) =>
    activeTab === 'active' ? j.isActive : !j.isActive
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Recurring Jobs</h1>
      </div>

      <Tabs
        tabs={[
          { value: 'active', label: 'Active', count: jobs.filter((j: RecurringJob) => j.isActive).length },
          { value: 'paused', label: 'Paused', count: jobs.filter((j: RecurringJob) => !j.isActive).length },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      <div style={{
        background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--stroke-hairline)', marginTop: 16, overflow: 'hidden',
      }}>
        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <Repeat size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
            <div>No recurring jobs</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filtered.map((job: RecurringJob) => (
              <div key={job.id} style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '14px 20px',
                borderBottom: '1px solid var(--stroke-hairline)',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {job.type || job.address}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
                    {job.client?.name || '—'} · {FREQ_LABELS[job.frequency] || job.frequency}
                  </div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{formatCurrency(job.total || 0)}</div>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                  background: job.isActive ? '#2EAA6518' : 'var(--bg-tertiary)',
                  color: job.isActive ? '#2EAA65' : 'var(--text-tertiary)',
                }}>
                  {job.isActive ? 'Active' : 'Paused'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
