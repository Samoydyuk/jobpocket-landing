import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Search, Users, Phone, Mail } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { ListSkeleton } from '../components/ui/Skeleton';
import { Header } from '../components/layout/Header';
import { clientsApi } from '../api/endpoints';
import { useDebounce } from '../hooks/useDebounce';
import { useIsMobile } from '../hooks/useMediaQuery';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

const COLORS = ['#2F6FED', '#2EAA65', '#E6A23C', '#E05252', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

function nameColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

export function ClientsPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useQuery({
    queryKey: ['clients', debouncedSearch],
    queryFn: () => clientsApi.list({ search: debouncedSearch || undefined }),
    staleTime: 15_000,
  });

  return (
    <>
      <Header title="Clients" subtitle={data ? `${data.total} total` : undefined} />

      <div style={{ marginBottom: 20 }}>
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search size={18} />}
          style={{ padding: '10px 14px', paddingLeft: 40 }}
        />
      </div>

      {isLoading ? (
        <ListSkeleton rows={8} />
      ) : data?.clients?.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {data.clients.map(client => (
            <Card
              key={client.id}
              variant="bordered"
              padding="standard"
              onClick={() => navigate(`/dashboard/clients/${client.id}`)}
              style={{ cursor: 'pointer', transition: 'background 0.15s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-tertiary)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-card)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {/* Avatar */}
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: nameColor(client.name),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 15,
                  flexShrink: 0,
                }}>
                  {getInitials(client.name)}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>{client.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                    {client.phone && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Phone size={12} />
                        <span>{client.phone}</span>
                      </span>
                    )}
                    {client.email && (
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        maxWidth: isMobile ? 160 : 280,
                      }}>
                        <Mail size={12} />
                        <span>{client.email}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {(client.totalRevenue ?? 0) > 0 && (
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{formatCurrency(client.totalRevenue!)}</div>
                  )}
                  {(client.jobCount ?? 0) > 0 && (
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                      {client.jobCount} job{client.jobCount !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Users size={28} />}
          title="No clients found"
          description={search ? 'Try a different search term' : 'Add your first client in the mobile app'}
        />
      )}
    </>
  );
}
