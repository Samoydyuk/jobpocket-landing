import { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  destructive?: boolean;
}

interface DropdownMenuProps {
  items: MenuItem[];
}

export function DropdownMenu({ items }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: 6, borderRadius: 8, color: 'var(--text-tertiary)',
          display: 'flex', alignItems: 'center',
        }}
      >
        <MoreVertical size={18} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '100%', marginTop: 4,
          background: 'var(--surface-card)', borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-elevated)', border: '1px solid var(--stroke-hairline)',
          minWidth: 160, zIndex: 100, overflow: 'hidden',
        }}>
          {items.map((item, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); item.onClick(); setOpen(false); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 14px', fontSize: 13, border: 'none', cursor: 'pointer',
                background: 'transparent',
                color: item.destructive ? 'var(--status-danger)' : 'var(--text-primary)',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => { (e.currentTarget).style.background = 'var(--bg-tertiary)'; }}
              onMouseLeave={(e) => { (e.currentTarget).style.background = 'transparent'; }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
