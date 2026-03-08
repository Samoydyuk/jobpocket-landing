import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, Search } from 'lucide-react';
import { documentsApi } from '../api/endpoints';
import { Tabs } from '../components/ui/Tabs';
import { formatCurrency, formatDate } from '../utils/formatters';
import type { Document } from '../api/types';

function getDocStatus(doc: Document): string {
  if (doc.paidAt) return 'paid';
  if (doc.viewedAt) return 'viewed';
  if (doc.sentAt) return 'sent';
  return 'draft';
}

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  draft: { bg: 'var(--bg-tertiary)', color: 'var(--text-secondary)' },
  sent: { bg: '#2F6FED18', color: '#2F6FED' },
  viewed: { bg: '#E6A23C18', color: '#E6A23C' },
  paid: { bg: '#2EAA6518', color: '#2EAA65' },
};

const filterTabs = [
  { key: 'all', label: 'All' },
  { key: 'ESTIMATE', label: 'Estimates' },
  { key: 'INVOICE', label: 'Invoices' },
];

export function DocumentsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => (await documentsApi.list()).documents,
  });

  const filtered = documents.filter((doc: Document) => {
    if (activeTab !== 'all' && doc.type !== activeTab) return false;
    if (search) {
      const q = search.toLowerCase();
      return doc.documentNumber?.toLowerCase().includes(q) || doc.clientName?.toLowerCase().includes(q);
    }
    return true;
  });

  const totals = {
    estimates: documents.filter((d: Document) => d.type === 'ESTIMATE').length,
    invoices: documents.filter((d: Document) => d.type === 'INVOICE').length,
    outstanding: documents
      .filter((d: Document) => d.type === 'INVOICE' && !d.paidAt)
      .reduce((sum: number, d: Document) => sum + (d.total || 0), 0),
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Documents</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Estimates', value: totals.estimates },
          { label: 'Invoices', value: totals.invoices },
          { label: 'Outstanding', value: formatCurrency(totals.outstanding) },
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

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <Tabs
          tabs={filterTabs.map((t) => ({ value: t.key, label: t.label, count: t.key === 'all' ? documents.length : documents.filter((d: Document) => d.type === t.key).length }))}
          active={activeTab}
          onChange={setActiveTab}
        />
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            style={{
              padding: '8px 12px 8px 34px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--stroke-soft)', background: 'var(--bg-primary)',
              fontSize: 13, color: 'var(--text-primary)', outline: 'none', width: 220,
            }}
          />
        </div>
      </div>

      <div style={{
        background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--stroke-hairline)', overflow: 'hidden',
      }}>
        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <FileText size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
            <div>No documents found</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--stroke-hairline)' }}>
                {['Number', 'Type', 'Client', 'Amount', 'Status', 'Date'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc: Document) => {
                const status = getDocStatus(doc);
                const statusStyle = STATUS_STYLES[status];
                return (
                  <tr key={doc.id} style={{ borderBottom: '1px solid var(--stroke-hairline)', cursor: 'pointer' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{doc.documentNumber || '—'}</td>
                    <td style={{ padding: '12px 16px', textTransform: 'capitalize' }}>{doc.type.toLowerCase()}</td>
                    <td style={{ padding: '12px 16px' }}>{doc.clientName || '—'}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{formatCurrency(doc.total || 0)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        display: 'inline-block', fontSize: 11, fontWeight: 600,
                        padding: '2px 8px', borderRadius: 4,
                        background: statusStyle.bg, color: statusStyle.color,
                        textTransform: 'capitalize',
                      }}>
                        {status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-tertiary)' }}>
                      {formatDate(doc.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
