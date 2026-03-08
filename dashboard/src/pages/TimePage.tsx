import { useQuery } from '@tanstack/react-query';
import { Clock } from 'lucide-react';
import { timeTrackingApi } from '../api/endpoints';
import { formatDate, formatDuration } from '../utils/formatters';
import type { TimeEntry, TimeSummary } from '../api/types';

export function TimePage() {
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['timeEntries'],
    queryFn: async () => (await timeTrackingApi.list()).entries,
  });

  const { data: summary } = useQuery({
    queryKey: ['timeEntries', 'summary'],
    queryFn: () => timeTrackingApi.summary(),
  });

  const activeEntry = entries.find((e: TimeEntry) => !e.endTime);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Time Tracking</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Hours', value: `${summary?.totalHours?.toFixed(1) ?? 0}h` },
          { label: 'Entries', value: summary?.entriesCount ?? entries.length },
          { label: 'Break Time', value: formatDuration(summary?.totalBreakMinutes ?? 0) },
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

      {activeEntry && (
        <div style={{
          background: 'var(--badge-info-bg)', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--accent-primary)40', padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
        }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: 'var(--status-success)',
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Timer Running</div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
              {activeEntry.job?.type || activeEntry.job?.address || 'No job'}
            </div>
          </div>
        </div>
      )}

      <div style={{
        background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--stroke-hairline)', overflow: 'hidden',
      }}>
        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading...</div>
        ) : entries.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <Clock size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
            <div>No time entries</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--stroke-hairline)' }}>
                {['Job', 'Team Member', 'Duration', 'Date'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((entry: TimeEntry) => (
                <tr key={entry.id} style={{ borderBottom: '1px solid var(--stroke-hairline)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{entry.job?.type || entry.job?.address || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>{entry.teamMember?.name || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {entry.duration ? formatDuration(entry.duration) : (
                      <span style={{ color: 'var(--status-success)', fontWeight: 600 }}>Running...</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-tertiary)' }}>
                    {formatDate(entry.startTime)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
