import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Receipt, Search } from 'lucide-react';
import { expensesApi } from '../api/endpoints';
import { Tabs } from '../components/ui/Tabs';
import { formatCurrency, formatDate } from '../utils/formatters';
import type { Expense, ExpenseSummary } from '../api/types';

const CATEGORY_LABELS: Record<string, string> = {
  MATERIALS: 'Materials', LABOR: 'Labor', FUEL: 'Fuel', TOOLS: 'Tools',
  OFFICE: 'Office', INSURANCE: 'Insurance', MARKETING: 'Marketing',
  VEHICLE: 'Vehicle', UTILITIES: 'Utilities', LICENSE: 'License', OTHER: 'Other',
};

const categoryTabs = [
  { key: 'all', label: 'All' },
  { key: 'MATERIALS', label: 'Materials' },
  { key: 'FUEL', label: 'Fuel' },
  { key: 'TOOLS', label: 'Tools' },
  { key: 'LABOR', label: 'Labor' },
];

export function ExpensesPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => (await expensesApi.list()).expenses,
  });

  const { data: summary } = useQuery({
    queryKey: ['expenses', 'summary'],
    queryFn: () => expensesApi.summary(),
  });

  const filtered = expenses.filter((e: Expense) => {
    if (activeTab !== 'all' && e.category !== activeTab) return false;
    if (search) {
      const q = search.toLowerCase();
      return e.vendor?.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q);
    }
    return true;
  });

  const totalExpenses = expenses.reduce((s: number, e: Expense) => s + e.amount, 0);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Expenses</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Expenses', value: formatCurrency(summary?.totalExpenses ?? totalExpenses) },
          { label: 'Categories', value: summary?.byCategory?.length ?? 0 },
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
          tabs={categoryTabs.map((t) => ({
            value: t.key, label: t.label,
            count: t.key === 'all' ? expenses.length : expenses.filter((e: Expense) => e.category === t.key).length,
          }))}
          active={activeTab}
          onChange={setActiveTab}
        />
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search expenses..."
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
            <Receipt size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
            <div>No expenses found</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--stroke-hairline)' }}>
                {['Description', 'Category', 'Vendor', 'Amount', 'Date'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((exp: Expense) => (
                <tr key={exp.id} style={{ borderBottom: '1px solid var(--stroke-hairline)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{exp.description || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                      background: 'var(--bg-tertiary)', color: 'var(--text-secondary)',
                    }}>
                      {CATEGORY_LABELS[exp.category] || exp.category}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>{exp.vendor || '—'}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{formatCurrency(exp.amount)}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-tertiary)' }}>{formatDate(exp.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
