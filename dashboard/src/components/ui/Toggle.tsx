interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', gap: 10, cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.5 : 1,
    }}>
      <div
        onClick={() => !disabled && onChange(!checked)}
        style={{
          width: 44, height: 24, borderRadius: 12, position: 'relative',
          background: checked ? 'var(--accent-primary)' : 'var(--stroke-soft)',
          transition: 'background 0.2s', flexShrink: 0,
        }}
      >
        <div style={{
          width: 20, height: 20, borderRadius: '50%', background: '#fff',
          position: 'absolute', top: 2,
          left: checked ? 22 : 2,
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </div>
      {label && <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>{label}</span>}
    </label>
  );
}
