import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { useToastStore } from '../../hooks/useToast';

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div style={{
      position: 'fixed', top: 16, right: 16, zIndex: 2000,
      display: 'flex', flexDirection: 'column', gap: 8,
      pointerEvents: 'none',
    }}>
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: { id: string; type: 'success' | 'error'; message: string }; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const isError = toast.type === 'error';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '12px 16px', borderRadius: 'var(--radius-md)',
      background: 'var(--surface-card)', boxShadow: 'var(--shadow-elevated)',
      border: `1px solid ${isError ? 'var(--status-danger)' : 'var(--status-success)'}20`,
      pointerEvents: 'auto', minWidth: 280, maxWidth: 400,
      animation: 'slideIn 0.2s ease-out',
    }}>
      {isError
        ? <XCircle size={18} style={{ color: 'var(--status-danger)', flexShrink: 0 }} />
        : <CheckCircle size={18} style={{ color: 'var(--status-success)', flexShrink: 0 }} />
      }
      <span style={{ fontSize: 13, color: 'var(--text-primary)', flex: 1 }}>{toast.message}</span>
      <button
        onClick={onDismiss}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: 2, color: 'var(--text-tertiary)', display: 'flex',
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
