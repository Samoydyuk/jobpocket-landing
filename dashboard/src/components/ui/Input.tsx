import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export function Input({ label, error, icon, style, ...props }: InputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-tertiary)', display: 'flex',
          }}>
            {icon}
          </div>
        )}
        <input
          style={{
            width: '100%',
            padding: '14px 16px',
            paddingLeft: icon ? 44 : 16,
            fontSize: 16,
            background: 'var(--surface-card)',
            border: `1px solid ${error ? 'var(--status-danger)' : 'var(--stroke-hairline)'}`,
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            outline: 'none',
            transition: 'border-color 0.15s',
            ...style,
          }}
          onFocus={(e) => {
            if (!error) e.currentTarget.style.borderColor = 'var(--accent-primary)';
          }}
          onBlur={(e) => {
            if (!error) e.currentTarget.style.borderColor = 'var(--stroke-hairline)';
          }}
          {...props}
        />
      </div>
      {error && <span style={{ fontSize: 13, color: 'var(--status-danger)' }}>{error}</span>}
    </div>
  );
}
