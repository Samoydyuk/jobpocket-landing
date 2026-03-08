import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, MapPin, Calendar, User, FileText, Clock, Trash2, Send } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { CardSkeleton } from '../components/ui/Skeleton';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Header } from '../components/layout/Header';
import { jobsApi } from '../api/endpoints';
import { useIsMobile } from '../hooks/useMediaQuery';
import { useToast } from '../hooks/useToast';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

const STATUS_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ['SCHEDULED'],
  SCHEDULED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'PAUSED'],
  PAUSED: ['IN_PROGRESS', 'CANCELLED'],
  COMPLETED: ['INVOICED'],
  INVOICED: ['PAID'],
};

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showDelete, setShowDelete] = useState(false);

  const { data: job, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobsApi.get(id!),
    enabled: !!id,
  });

  const statusMut = useMutation({
    mutationFn: (status: string) => jobsApi.updateStatus(id!, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Status updated');
    },
    onError: () => toast.error('Failed to update status'),
  });

  const deleteMut = useMutation({
    mutationFn: () => jobsApi.delete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job deleted');
      navigate('/jobs');
    },
    onError: () => toast.error('Failed to delete job'),
  });

  const sendEstimateMut = useMutation({
    mutationFn: () => jobsApi.sendEstimate(id!),
    onSuccess: () => { toast.success('Estimate sent'); queryClient.invalidateQueries({ queryKey: ['job', id] }); },
    onError: () => toast.error('Failed to send estimate'),
  });

  const sendInvoiceMut = useMutation({
    mutationFn: () => jobsApi.sendInvoice(id!),
    onSuccess: () => { toast.success('Invoice sent'); queryClient.invalidateQueries({ queryKey: ['job', id] }); },
    onError: () => toast.error('Failed to send invoice'),
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

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {/* Status transitions */}
        {(STATUS_TRANSITIONS[job.status] || []).map(next => (
          <Button
            key={next}
            size="sm"
            variant={next === 'CANCELLED' ? 'destructive' : 'primary'}
            onClick={() => statusMut.mutate(next)}
            loading={statusMut.isPending}
            style={{ fontSize: 13, padding: '8px 16px' }}
          >
            {next.replace('_', ' ')}
          </Button>
        ))}

        {/* Send estimate/invoice */}
        {job.client?.email && ['DRAFT', 'SCHEDULED'].includes(job.status) && (
          <Button size="sm" variant="secondary" onClick={() => sendEstimateMut.mutate()} loading={sendEstimateMut.isPending} icon={<Send size={14} />} style={{ fontSize: 13, padding: '8px 16px' }}>
            Send Estimate
          </Button>
        )}
        {job.client?.email && job.status === 'INVOICED' && (
          <Button size="sm" variant="secondary" onClick={() => sendInvoiceMut.mutate()} loading={sendInvoiceMut.isPending} icon={<Send size={14} />} style={{ fontSize: 13, padding: '8px 16px' }}>
            Send Invoice
          </Button>
        )}

        <div style={{ flex: 1 }} />

        <Button size="sm" variant="ghost" onClick={() => setShowDelete(true)} style={{ color: 'var(--status-danger)', fontSize: 13, padding: '8px 16px' }} icon={<Trash2 size={14} />}>
          Delete
        </Button>
      </div>

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
                  onClick={() => navigate(`/clients/${job.clientId}`)}
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

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => deleteMut.mutate()}
        title="Delete Job"
        message="Are you sure you want to delete this job? This action cannot be undone."
        loading={deleteMut.isPending}
      />
    </>
  );
}
