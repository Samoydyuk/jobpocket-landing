import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { jobsApi } from '../api/endpoints';
import { formatCurrency } from '../utils/formatters';
import type { Job } from '../api/types';

const STATUS_COLORS: Record<string, string> = {
  DRAFT: '#94a3b8', SENT: '#8B5CF6', APPROVED: '#2F6FED',
  SCHEDULED: '#2F6FED', IN_PROGRESS: '#E6A23C', PAUSED: '#94a3b8',
  COMPLETED: '#2EAA65', INVOICED: '#14B8A6', PAID: '#2EAA65', CANCELLED: '#E05252',
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function jobLabel(job: Job) {
  return job.type || job.client?.name || 'Job';
}

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const { data: jobs = [] } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => (await jobsApi.list({})).jobs,
  });

  const jobsByDate = useMemo(() => {
    const map: Record<string, Job[]> = {};
    jobs.forEach((job) => {
      const dateKey = job.scheduledAt?.slice(0, 10);
      if (dateKey) {
        if (!map[dateKey]) map[dateKey] = [];
        map[dateKey].push(job);
      }
    });
    return map;
  }, [jobs]);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date().toISOString().slice(0, 10);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const monthLabel = currentDate.toLocaleDateString([], { month: 'long', year: 'numeric' });

  const selectedJobs = selectedDate ? jobsByDate[selectedDate] || [] : [];

  return (
    <div style={{ display: 'flex', gap: 24, height: '100%' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Calendar</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={prevMonth} style={{ padding: 6, borderRadius: 8, color: 'var(--text-secondary)' }}>
              <ChevronLeft size={20} />
            </button>
            <span style={{ fontSize: 16, fontWeight: 600, minWidth: 160, textAlign: 'center' }}>{monthLabel}</span>
            <button onClick={nextMonth} style={{ padding: 6, borderRadius: 8, color: 'var(--text-secondary)' }}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
          border: '1px solid var(--stroke-hairline)', borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}>
          {DAYS.map((d) => (
            <div key={d} style={{
              padding: '8px 4px', textAlign: 'center',
              fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)',
              background: 'var(--bg-secondary)',
              borderBottom: '1px solid var(--stroke-hairline)',
            }}>
              {d}
            </div>
          ))}
          {cells.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} style={{ minHeight: 80, background: 'var(--bg-secondary)', borderTop: i >= 7 ? '1px solid var(--stroke-hairline)' : undefined, borderLeft: i % 7 !== 0 ? '1px solid var(--stroke-hairline)' : undefined }} />;
            }
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayJobs = jobsByDate[dateKey] || [];
            const isToday = dateKey === today;
            const isSelected = dateKey === selectedDate;

            return (
              <div
                key={dateKey}
                onClick={() => setSelectedDate(dateKey)}
                style={{
                  minHeight: 80, padding: 4, cursor: 'pointer',
                  background: isSelected ? 'var(--badge-info-bg)' : 'var(--surface-card)',
                  borderTop: i >= 7 ? '1px solid var(--stroke-hairline)' : undefined,
                  borderLeft: i % 7 !== 0 ? '1px solid var(--stroke-hairline)' : undefined,
                  transition: 'background 0.15s',
                }}
              >
                <div style={{
                  fontSize: 12, fontWeight: isToday ? 700 : 400,
                  color: isToday ? '#fff' : 'var(--text-secondary)',
                  padding: '2px 4px',
                  ...(isToday ? { background: 'var(--accent-primary)', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' } : {}),
                }}>
                  {day}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
                  {dayJobs.slice(0, 3).map((job) => (
                    <div key={job.id} style={{
                      fontSize: 10, padding: '1px 4px', borderRadius: 3,
                      background: (STATUS_COLORS[job.status] || '#94a3b8') + '20',
                      color: STATUS_COLORS[job.status] || '#94a3b8',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {jobLabel(job)}
                    </div>
                  ))}
                  {dayJobs.length > 3 && (
                    <div style={{ fontSize: 10, color: 'var(--text-tertiary)', paddingLeft: 4 }}>
                      +{dayJobs.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div style={{ width: 300, flexShrink: 0 }}>
          <div style={{
            background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--stroke-hairline)', padding: 16,
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
              {new Date(selectedDate + 'T12:00:00').toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
            </h3>
            {selectedJobs.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--text-tertiary)', textAlign: 'center', padding: 20 }}>
                No jobs scheduled
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {selectedJobs.map((job) => (
                  <a key={job.id} href={`#/jobs/${job.id}`} style={{
                    display: 'block', padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--stroke-hairline)',
                    textDecoration: 'none', color: 'inherit',
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{jobLabel(job)}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
                      {job.client?.name || '—'} · {formatCurrency(job.total)}
                    </div>
                    <div style={{
                      display: 'inline-block', fontSize: 10, fontWeight: 600,
                      padding: '2px 6px', borderRadius: 4, marginTop: 4,
                      background: (STATUS_COLORS[job.status] || '#94a3b8') + '18',
                      color: STATUS_COLORS[job.status] || '#94a3b8',
                    }}>
                      {job.status.replace('_', ' ')}
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
