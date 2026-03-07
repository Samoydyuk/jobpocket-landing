import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

type Variant = 'default' | 'elevated' | 'bordered';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  padding?: 'compact' | 'standard' | 'comfort';
  children: ReactNode;
}

const paddings = { compact: 12, standard: 16, comfort: 20 };

const variantStyles: Record<Variant, CSSProperties> = {
  default: { boxShadow: 'var(--shadow-card)' },
  elevated: { boxShadow: 'var(--shadow-elevated)', border: '1px solid var(--stroke-soft)' },
  bordered: { border: '1px solid var(--stroke-hairline)', boxShadow: 'none' },
};

export function Card({ variant = 'default', padding = 'standard', children, style, ...props }: CardProps) {
  return (
    <div
      style={{
        background: 'var(--surface-card)',
        borderRadius: 'var(--radius-md)',
        padding: paddings[padding],
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
