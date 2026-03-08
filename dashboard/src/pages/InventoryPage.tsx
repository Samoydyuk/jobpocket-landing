import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Package, Search, AlertTriangle } from 'lucide-react';
import { inventoryApi } from '../api/endpoints';
import { formatCurrency } from '../utils/formatters';
import type { PartStock } from '../api/types';

export function InventoryPage() {
  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const { data: parts = [], isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => (await inventoryApi.list()).parts,
  });

  const filtered = parts.filter((p: PartStock) => {
    if (lowStockOnly && p.quantity > p.reorderLevel) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.partNumber?.toLowerCase().includes(q);
    }
    return true;
  });

  const lowStockCount = parts.filter((p: PartStock) => p.quantity <= p.reorderLevel).length;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Inventory</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        <div style={{
          background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--stroke-hairline)', padding: '16px 20px',
        }}>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Total Items</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{parts.length}</div>
        </div>
        <div style={{
          background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)',
          border: lowStockCount > 0 ? '1px solid var(--status-warning)40' : '1px solid var(--stroke-hairline)',
          padding: '16px 20px',
        }}>
          <div style={{ fontSize: 12, color: lowStockCount > 0 ? 'var(--status-warning)' : 'var(--text-tertiary)' }}>Low Stock</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4, color: lowStockCount > 0 ? 'var(--status-warning)' : undefined }}>
            {lowStockCount}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search parts..."
            style={{
              padding: '8px 12px 8px 34px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--stroke-soft)', background: 'var(--bg-primary)',
              fontSize: 13, color: 'var(--text-primary)', outline: 'none', width: 220,
            }}
          />
        </div>
        <button
          onClick={() => setLowStockOnly(!lowStockOnly)}
          style={{
            padding: '8px 14px', borderRadius: 'var(--radius-md)', fontSize: 13,
            border: '1px solid var(--stroke-soft)',
            background: lowStockOnly ? 'var(--status-warning)18' : 'var(--bg-primary)',
            color: lowStockOnly ? 'var(--status-warning)' : 'var(--text-secondary)',
            fontWeight: lowStockOnly ? 600 : 400,
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <AlertTriangle size={14} />
          Low Stock Only
        </button>
      </div>

      <div style={{
        background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--stroke-hairline)', overflow: 'hidden',
      }}>
        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <Package size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
            <div>No items found</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--stroke-hairline)' }}>
                {['Name', 'Part #', 'Category', 'Qty', 'Cost', 'Location'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((part: PartStock) => {
                const isLow = part.quantity <= part.reorderLevel;
                return (
                  <tr key={part.id} style={{ borderBottom: '1px solid var(--stroke-hairline)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{part.name}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-tertiary)', fontFamily: 'monospace', fontSize: 12 }}>{part.partNumber || '—'}</td>
                    <td style={{ padding: '12px 16px', textTransform: 'capitalize' }}>{part.category?.toLowerCase().replace('_', ' ') || '—'}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: isLow ? 'var(--status-warning)' : undefined }}>
                      {part.quantity}
                      {isLow && <AlertTriangle size={12} style={{ marginLeft: 4, verticalAlign: 'middle' }} />}
                    </td>
                    <td style={{ padding: '12px 16px' }}>{formatCurrency(part.costPrice)}</td>
                    <td style={{ padding: '12px 16px', textTransform: 'capitalize' }}>{part.location?.toLowerCase() || '—'}</td>
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
