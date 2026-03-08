import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({ label, error, options, placeholder, style, ...props }: SelectProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <select
          {...props}
          style={{
            width: '100%', padding: '10px 36px 10px 12px',
            fontSize: 14, borderRadius: 'var(--radius-md)',
            border: `1px solid ${error ? 'var(--status-danger)' : 'var(--stroke-soft)'}`,
            background: 'var(--bg-secondary)', color: 'var(--text-primary)',
            appearance: 'none', cursor: 'pointer', outline: 'none',
            ...style,
          }}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown
          size={16}
          style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            pointerEvents: 'none', color: 'var(--text-tertiary)',
          }}
        />
      </div>
      {error && <span style={{ fontSize: 12, color: 'var(--status-danger)' }}>{error}</span>}
    </div>
  );
}
