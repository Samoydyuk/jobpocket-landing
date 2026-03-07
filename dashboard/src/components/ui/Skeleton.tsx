export function Skeleton({ width, height, radius }: { width?: number | string; height?: number | string; radius?: number }) {
  return (
    <div
      className="skeleton"
      style={{
        width: width || '100%',
        height: height || 20,
        borderRadius: radius ?? 'var(--radius-sm)',
      }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div style={{ background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', padding: 20 }}>
      <Skeleton height={14} width="40%" />
      <div style={{ marginTop: 12 }}><Skeleton height={28} width="60%" /></div>
      <div style={{ marginTop: 8 }}><Skeleton height={14} width="30%" /></div>
    </div>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-md)',
          padding: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <Skeleton width={40} height={40} radius={20} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Skeleton height={16} width="50%" />
            <Skeleton height={12} width="30%" />
          </div>
          <Skeleton height={20} width={60} />
        </div>
      ))}
    </div>
  );
}
