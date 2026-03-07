import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: { background: 'var(--accent-primary)', color: 'var(--text-on-accent)', border: 'none' },
  secondary: { background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--stroke-hairline)' },
  ghost: { background: 'transparent', color: 'var(--accent-primary)', border: 'none' },
  destructive: { background: 'var(--status-danger)', color: '#fff', border: 'none' },
};

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { padding: '10px 16px', fontSize: 14 },
  md: { padding: '14px 20px', fontSize: 16 },
  lg: { padding: '18px 24px', fontSize: 18 },
};

export function Button({ variant = 'primary', size = 'md', loading, icon, fullWidth, children, disabled, style, ...props }: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderRadius: 'var(--radius-md)',
        fontWeight: 600,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'transform 0.15s, opacity 0.15s',
        width: fullWidth ? '100%' : undefined,
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)';
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
      }}
      {...props}
    >
      {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : icon}
      {children}
    </button>
  );
}
