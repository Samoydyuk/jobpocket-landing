import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
    }}>
      {icon && (
        <div style={{
          width: 64, height: 64, borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-tertiary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-tertiary)',
          marginBottom: 16,
        }}>
          {icon}
        </div>
      )}
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 320, marginBottom: action ? 24 : 0 }}>
        {description}
      </p>
      {action}
    </div>
  );
}
