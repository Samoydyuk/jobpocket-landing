import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Search, Briefcase, MapPin } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { ListSkeleton } from '../components/ui/Skeleton';
import { Header } from '../components/layout/Header';
import { jobsApi } from '../api/endpoints';
import { useDebounce } from '../hooks/useDebounce';
import { useIsMobile } from '../hooks/useMediaQuery';

const STATUS_TABS = [
  { key: '', label: 'All' },
  { key: 'upcoming', label: 'Active' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'INVOICED', label: 'Invoiced' },
  { key: 'PAID', label: 'Paid' },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
}

export function JobsPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [offset, setOffset] = useState(0);
  const debouncedSearch = useDebounce(search);
  const limit = 20;

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', status, debouncedSearch, offset],
    queryFn: () => jobsApi.list({ status: status || undefined, search: debouncedSearch || undefined, limit, offset }),
    staleTime: 15_000,
  });

  return (
    <>
      <Header title="Jobs" subtitle={data ? `${data.total} total` : undefined} />

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{
          display: 'flex',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-sm)',
          padding: 3,
          gap: 2,
          overflow: 'auto',
          flexShrink: 0,
        }}>
          {STATUS_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setStatus(tab.key); setOffset(0); }}
              style={{
                padding: '8px 14px',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: status === tab.key ? 600 : 400,
                color: status === tab.key ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                background: status === tab.key ? 'var(--surface-card)' : 'transparent',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <Input
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setOffset(0); }}
            icon={<Search size={18} />}
            style={{ padding: '10px 14px', paddingLeft: 40 }}
          />
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <ListSkeleton rows={6} />
      ) : data?.jobs?.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {data.jobs.map(job => (
            <Card
              key={job.id}
              variant="bordered"
              padding="standard"
              onClick={() => navigate(`/jobs/${job.id}`)}
              style={{ cursor: 'pointer', transition: 'background 0.15s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-tertiary)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-card)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 15, fontWeight: 600 }}>{job.type || 'Job'}</span>
                    <Badge status={job.status} />
                    {job.paymentStatus !== 'UNPAID' && job.paymentStatus !== 'PAID' && (
                      <Badge status={job.paymentStatus} />
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                    {job.client?.name && <span>{job.client.name}</span>}
                    {job.address && (
                      <>
                        <span style={{ color: 'var(--text-tertiary)' }}>·</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={12} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: isMobile ? 140 : 300 }}>{job.address}</span>
                        </span>
                      </>
                    )}
                    {job.scheduledAt && (
                      <>
                        <span style={{ color: 'var(--text-tertiary)' }}>·</span>
                        <span>{new Date(job.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                      </>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{formatCurrency(job.total)}</div>
                  {job.estimateNumber && (
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>#{job.estimateNumber}</div>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {/* Pagination */}
          {data.hasMore && (
            <Button
              variant="secondary"
              onClick={() => setOffset(o => o + limit)}
              style={{ alignSelf: 'center', marginTop: 8 }}
            >
              Load more
            </Button>
          )}
        </div>
      ) : (
        <EmptyState
          icon={<Briefcase size={28} />}
          title="No jobs found"
          description={search ? 'Try a different search term' : 'Create your first job in the mobile app'}
        />
      )}
    </>
  );
}
