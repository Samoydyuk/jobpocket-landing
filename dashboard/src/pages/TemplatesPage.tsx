import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout, Star, Copy, Trash2 } from 'lucide-react';
import { templatesApi } from '../api/endpoints';
import { useToast } from '../hooks/useToast';
import type { InvoiceTemplate } from '../api/types';

export function TemplatesPage() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => (await templatesApi.list()).templates,
  });

  const duplicateMut = useMutation({
    mutationFn: (id: string) => templatesApi.duplicate(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['templates'] }); toast.success('Template duplicated'); },
    onError: () => toast.error('Failed to duplicate'),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => templatesApi.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['templates'] }); toast.success('Template deleted'); },
    onError: () => toast.error('Failed to delete'),
  });

  const setDefaultMut = useMutation({
    mutationFn: (id: string) => templatesApi.setDefault(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['templates'] }); toast.success('Default template updated'); },
    onError: () => toast.error('Failed to set default'),
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Templates</h1>
      </div>

      {isLoading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading...</div>
      ) : templates.length === 0 ? (
        <div style={{
          padding: 60, textAlign: 'center', color: 'var(--text-tertiary)',
          background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--stroke-hairline)',
        }}>
          <Layout size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>No templates yet</div>
          <div style={{ fontSize: 13 }}>Create a template to customize your estimates and invoices</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {templates.map((tpl: InvoiceTemplate) => (
            <div key={tpl.id} style={{
              background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)',
              border: tpl.isDefault ? '2px solid var(--accent-primary)' : '1px solid var(--stroke-hairline)',
              padding: 20, position: 'relative',
            }}>
              {tpl.isDefault && (
                <div style={{
                  position: 'absolute', top: 12, right: 12,
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontSize: 11, fontWeight: 600, color: 'var(--accent-primary)',
                }}>
                  <Star size={12} fill="var(--accent-primary)" /> Default
                </div>
              )}

              {/* Preview placeholder */}
              <div style={{
                height: 140, borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)', marginBottom: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, color: 'var(--text-tertiary)', fontWeight: 300,
                textTransform: 'capitalize',
              }}>
                {tpl.layout || 'classic'}
              </div>

              <div style={{ fontSize: 15, fontWeight: 600 }}>{tpl.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2, textTransform: 'capitalize' }}>
                {tpl.layout || 'classic'} layout
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                {!tpl.isDefault && (
                  <button
                    onClick={() => setDefaultMut.mutate(tpl.id)}
                    style={{
                      padding: '6px 12px', borderRadius: 'var(--radius-md)',
                      fontSize: 12, fontWeight: 600, border: '1px solid var(--stroke-soft)',
                      color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4,
                    }}
                  >
                    <Star size={12} /> Set Default
                  </button>
                )}
                <button
                  onClick={() => duplicateMut.mutate(tpl.id)}
                  style={{
                    padding: '6px 12px', borderRadius: 'var(--radius-md)',
                    fontSize: 12, fontWeight: 600, border: '1px solid var(--stroke-soft)',
                    color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4,
                  }}
                >
                  <Copy size={12} /> Duplicate
                </button>
                {!tpl.isDefault && (
                  <button
                    onClick={() => { if (confirm('Delete this template?')) deleteMut.mutate(tpl.id); }}
                    style={{
                      padding: '6px 12px', borderRadius: 'var(--radius-md)',
                      fontSize: 12, fontWeight: 600, border: '1px solid var(--stroke-soft)',
                      color: 'var(--status-danger)', display: 'flex', alignItems: 'center', gap: 4,
                    }}
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
