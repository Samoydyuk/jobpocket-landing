import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CalendarCheck, Globe, Clock } from 'lucide-react';
import { bookingApi } from '../api/endpoints';
import { Tabs } from '../components/ui/Tabs';
import { formatDate, formatCurrency } from '../utils/formatters';
import type { BookingRequest, BookingService } from '../api/types';

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  PENDING: { bg: '#E6A23C18', color: '#E6A23C' },
  ACCEPTED: { bg: '#2EAA6518', color: '#2EAA65' },
  DECLINED: { bg: '#E0525218', color: '#E05252' },
  CANCELLED: { bg: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' },
};

export function BookingPage() {
  const [activeTab, setActiveTab] = useState('requests');

  const { data: requests = [] } = useQuery({
    queryKey: ['bookingRequests'],
    queryFn: async () => (await bookingApi.requests()).requests,
  });

  const { data: services = [] } = useQuery({
    queryKey: ['bookingServices'],
    queryFn: async () => (await bookingApi.services()).services,
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Booking</h1>
      </div>

      <Tabs
        tabs={[
          { value: 'requests', label: 'Requests', count: requests.length },
          { value: 'services', label: 'Services', count: services.length },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      <div style={{ marginTop: 16 }}>
        {activeTab === 'requests' && (
          <div style={{
            background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--stroke-hairline)', overflow: 'hidden',
          }}>
            {requests.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-tertiary)' }}>
                <CalendarCheck size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
                <div>No booking requests</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {requests.map((req: BookingRequest) => {
                  const status = STATUS_STYLES[req.status] || STATUS_STYLES.PENDING;
                  return (
                    <div key={req.id} style={{
                      display: 'flex', alignItems: 'center', gap: 16,
                      padding: '14px 20px',
                      borderBottom: '1px solid var(--stroke-hairline)',
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{req.clientName}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
                          {req.serviceType} · {req.preferredDate ? formatDate(req.preferredDate) : 'No date'}
                        </div>
                        {req.description && (
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{req.description}</div>
                        )}
                      </div>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                        background: status.bg, color: status.color, textTransform: 'capitalize',
                      }}>
                        {req.status.toLowerCase()}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'services' && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12,
          }}>
            {services.length === 0 ? (
              <div style={{
                padding: 40, textAlign: 'center', color: 'var(--text-tertiary)',
                gridColumn: '1 / -1',
                background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--stroke-hairline)',
              }}>
                <Globe size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
                <div>No services configured</div>
              </div>
            ) : (
              services.map((svc: BookingService) => (
                <div key={svc.id} style={{
                  background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--stroke-hairline)', padding: 20,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{svc.name}</div>
                    {!svc.isActive && (
                      <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}>
                        Inactive
                      </span>
                    )}
                  </div>
                  {svc.description && (
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>{svc.description}</div>
                  )}
                  <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 13 }}>
                    {svc.duration && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)' }}>
                        <Clock size={14} /> {svc.duration}m
                      </span>
                    )}
                    {svc.priceFrom != null && (
                      <span style={{ fontWeight: 600 }}>
                        {formatCurrency(svc.priceFrom)}
                        {svc.priceTo != null && svc.priceTo !== svc.priceFrom && ` - ${formatCurrency(svc.priceTo)}`}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
