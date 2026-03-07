import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Phone, Mail, MapPin, Briefcase } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { CardSkeleton, ListSkeleton } from '../components/ui/Skeleton';
import { Header } from '../components/layout/Header';
import { clientsApi } from '../api/endpoints';

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

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['client', id],
    queryFn: () => clientsApi.get(id!),
    enabled: !!id,
  });

  const client = data?.client;
  const jobs = data?.jobs;

  if (isLoading) {
    return (
      <>
        <Header title="Client" />
        <CardSkeleton />
        <div style={{ marginTop: 20 }}><ListSkeleton rows={3} /></div>
      </>
    );
  }

  if (!client) {
    return (
      <>
        <Header title="Client" />
        <EmptyState title="Client not found" description="This client may have been deleted" />
      </>
    );
  }

  return (
    <>
      <Header
        title={client.name}
        action={
          <Button variant="ghost" onClick={() => navigate(-1)} style={{ gap: 6 }}>
            <ArrowLeft size={18} /> Back
          </Button>
        }
      />

      {/* Contact Card */}
      <Card variant="bordered" padding="comfort" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: nameColor(client.name),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 20,
            flexShrink: 0,
          }}>
            {getInitials(client.name)}
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{client.name}</div>
            {(client.jobCount ?? 0) > 0 && (
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
                {client.jobCount} job{client.jobCount !== 1 ? 's' : ''}
                {(client.totalRevenue ?? 0) > 0 && ` · ${formatCurrency(client.totalRevenue!)}`}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {client.phone && (
            <a href={`tel:${client.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)', fontSize: 14, textDecoration: 'none' }}>
              <Phone size={16} style={{ color: 'var(--accent-primary)' }} />
              {client.phone}
            </a>
          )}
          {client.email && (
            <a href={`mailto:${client.email}`} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)', fontSize: 14, textDecoration: 'none' }}>
              <Mail size={16} style={{ color: 'var(--accent-primary)' }} />
              {client.email}
            </a>
          )}
          {client.address && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)', fontSize: 14 }}>
              <MapPin size={16} style={{ color: 'var(--accent-primary)' }} />
              {client.address}
            </div>
          )}
          {client.notes && (
            <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4, padding: '10px 12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
              {client.notes}
            </div>
          )}
        </div>
      </Card>

      {/* Jobs History */}
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Jobs History</div>
      {jobs?.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {jobs.map(job => (
            <Card
              key={job.id}
              variant="bordered"
              padding="standard"
              onClick={() => navigate(`/dashboard/jobs/${job.id}`)}
              style={{ cursor: 'pointer', transition: 'background 0.15s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-tertiary)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-card)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{job.type || 'Job'}</span>
                    <Badge status={job.status} />
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
                    {job.scheduledAt ? new Date(job.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date'}
                  </div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{formatCurrency(job.total)}</div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Briefcase size={24} />}
          title="No jobs yet"
          description="Jobs for this client will appear here"
        />
      )}
    </>
  );
}
