interface Tab {
  value: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (value: string) => void;
  style?: React.CSSProperties;
}

export function Tabs({ tabs, active, onChange, style }: TabsProps) {
  return (
    <div style={{
      display: 'flex', gap: 4, overflowX: 'auto',
      padding: '4px', background: 'var(--bg-tertiary)',
      borderRadius: 'var(--radius-md)',
      ...style,
    }}>
      {tabs.map(tab => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          style={{
            padding: '8px 14px', fontSize: 13, fontWeight: 500,
            border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
            borderRadius: 'calc(var(--radius-md) - 2px)',
            background: active === tab.value ? 'var(--surface-card)' : 'transparent',
            color: active === tab.value ? 'var(--text-primary)' : 'var(--text-tertiary)',
            boxShadow: active === tab.value ? 'var(--shadow-card)' : 'none',
            transition: 'all 0.15s',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '1px 6px',
              borderRadius: 'var(--radius-pill)',
              background: active === tab.value ? 'var(--accent-primary)' : 'var(--bg-secondary)',
              color: active === tab.value ? '#fff' : 'var(--text-tertiary)',
            }}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
