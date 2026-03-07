import type { ReactNode } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function Header({ title, subtitle, action }: HeaderProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 24,
      flexWrap: 'wrap',
      gap: 12,
    }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>{title}</h1>
        {subtitle && (
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
