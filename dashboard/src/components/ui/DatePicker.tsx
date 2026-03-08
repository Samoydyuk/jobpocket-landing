interface DatePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'date' | 'datetime-local' | 'time';
  error?: string;
  style?: React.CSSProperties;
}

export function DatePicker({ label, value, onChange, type = 'datetime-local', error, style }: DatePickerProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%', padding: '10px 12px', fontSize: 14,
          borderRadius: 'var(--radius-md)',
          border: `1px solid ${error ? 'var(--status-danger)' : 'var(--stroke-soft)'}`,
          background: 'var(--bg-secondary)', color: 'var(--text-primary)',
          outline: 'none', fontFamily: 'inherit',
        }}
      />
      {error && <span style={{ fontSize: 12, color: 'var(--status-danger)' }}>{error}</span>}
    </div>
  );
}
