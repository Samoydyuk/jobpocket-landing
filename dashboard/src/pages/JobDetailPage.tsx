import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, MapPin, Calendar, User, FileText, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { CardSkeleton } from '../components/ui/Skeleton';
import { Header } from '../components/layout/Header';
import { jobsApi } from '../api/endpoints';
import { useIsMobile } from '../hooks/useMediaQuery';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { data: job, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobsApi.get(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <>
        <Header title="Job" />
        <CardSkeleton />
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Header title="Job" />
        <EmptyState title="Job not found" description="This job may have been deleted" />
      </>
    );
  }

  return (
    <>
      <Header
        title={job.type || 'Job'}
        subtitle={job.estimateNumber ? `#${job.estimateNumber}` : undefined}
        action={
          <Button variant="ghost" onClick={() => navigate(-1)} style={{ gap: 6 }}>
            <ArrowLeft size={18} /> Back
          </Button>
        }
      />

      {/* Status + Amount Header */}
      <Card variant="bordered" padding="comfort" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Badge status={job.status} />
            {job.paymentStatus !== 'UNPAID' && job.paymentStatus !== 'PAID' && (
              <Badge status={job.paymentStatus} />
            )}
            {job.paymentStatus === 'PAID' && <Badge status="PAID" />}
          </div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{formatCurrency(job.total)}</div>
        </div>
      </Card>

      {/* Info Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: 12,
        marginBottom: 16,
      }}>
        {/* Client */}
        {job.client && (
          <Card variant="bordered" padding="standard">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <User size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Client</div>
                <div
                  style={{ fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'var(--accent-primary)' }}
                  onClick={() => navigate(`/dashboard/clients/${job.clientId}`)}
                >
                  {job.client.name}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Schedule */}
        {job.scheduledAt && (
          <Card variant="bordered" padding="standard">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Calendar size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Scheduled</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {formatDate(job.scheduledAt)}
                  <span style={{ fontWeight: 400, color: 'var(--text-secondary)', marginLeft: 6 }}>
                    {formatTime(job.scheduledAt)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Address */}
        {job.address && (
          <Card variant="bordered" padding="standard">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <MapPin size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Address</div>
                <div style={{ fontSize: 14 }}>{job.address}</div>
              </div>
            </div>
          </Card>
        )}

        {/* Assigned To */}
        {job.assignedTo && (
          <Card variant="bordered" padding="standard">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Clock size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Assigned to</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{job.assignedTo.name}</div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Line Items */}
      {job.lineItems?.length > 0 && (
        <Card variant="bordered" padding="comfort" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText size={16} />
            Line Items
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* Header */}
            {!isMobile && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 60px 90px 90px',
                gap: 8,
                padding: '8px 0',
                fontSize: 11,
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                borderBottom: '1px solid var(--stroke-hairline)',
              }}>
                <span>Description</span>
                <span style={{ textAlign: 'center' }}>Qty</span>
                <span style={{ textAlign: 'right' }}>Price</span>
                <span style={{ textAlign: 'right' }}>Total</span>
              </div>
            )}

            {job.lineItems.map((item, i) => (
              isMobile ? (
                <div key={item.id || i} style={{
                  padding: '12px 0',
                  borderBottom: i < job.lineItems.length - 1 ? '1px solid var(--stroke-hairline)' : 'none',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{item.description}</span>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{formatCurrency(item.total)}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                    {item.quantity} × {formatCurrency(item.unitPrice)}
                  </div>
                </div>
              ) : (
                <div key={item.id || i} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 60px 90px 90px',
                  gap: 8,
                  padding: '10px 0',
                  fontSize: 14,
                  borderBottom: i < job.lineItems.length - 1 ? '1px solid var(--stroke-hairline)' : 'none',
                }}>
                  <span>{item.description}</span>
                  <span style={{ textAlign: 'center' }}>{item.quantity}</span>
                  <span style={{ textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</span>
                  <span style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(item.total)}</span>
                </div>
              )
            ))}
          </div>

          {/* Totals */}
          <div style={{
            borderTop: '2px solid var(--stroke-hairline)',
            marginTop: 8,
            paddingTop: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            alignItems: 'flex-end',
          }}>
            <div style={{ display: 'flex', gap: 24, fontSize: 13, color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: 500, minWidth: 80, textAlign: 'right' }}>{formatCurrency(job.subtotal)}</span>
            </div>
            {job.tax > 0 && (
              <div style={{ display: 'flex', gap: 24, fontSize: 13, color: 'var(--text-secondary)' }}>
                <span>Tax ({job.taxRate}%)</span>
                <span style={{ fontWeight: 500, minWidth: 80, textAlign: 'right' }}>{formatCurrency(job.tax)}</span>
              </div>
            )}
            <div style={{ display: 'flex', gap: 24, fontSize: 16, fontWeight: 700 }}>
              <span>Total</span>
              <span style={{ minWidth: 80, textAlign: 'right' }}>{formatCurrency(job.total)}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Notes */}
      {job.notes && (
        <Card variant="bordered" padding="comfort">
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Notes</div>
          <div style={{
            fontSize: 14,
            color: 'var(--text-secondary)',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.6,
          }}>
            {job.notes}
          </div>
        </Card>
      )}
    </>
  );
}
