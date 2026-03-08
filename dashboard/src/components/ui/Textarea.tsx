interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, style, ...props }: TextareaProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <textarea
        {...props}
        style={{
          width: '100%', padding: '10px 12px', fontSize: 14,
          borderRadius: 'var(--radius-md)',
          border: `1px solid ${error ? 'var(--status-danger)' : 'var(--stroke-soft)'}`,
          background: 'var(--bg-secondary)', color: 'var(--text-primary)',
          resize: 'vertical', minHeight: 80, outline: 'none',
          fontFamily: 'inherit', lineHeight: 1.5,
          ...style,
        }}
      />
      {error && <span style={{ fontSize: 12, color: 'var(--status-danger)' }}>{error}</span>}
    </div>
  );
}
