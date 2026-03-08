import { NavLink } from 'react-router-dom';
import {
  Users, FileText, CreditCard, Receipt, Clock,
  Repeat, UsersRound, Package, CalendarCheck,
  BarChart3, Layout, Settings, LogOut, X,
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';

interface MenuSection {
  label: string;
  items: { to: string; icon: React.ElementType; label: string }[];
}

const sections: MenuSection[] = [
  {
    label: 'Core',
    items: [
      { to: '/clients', icon: Users, label: 'Clients' },
    ],
  },
  {
    label: 'Business',
    items: [
      { to: '/documents', icon: FileText, label: 'Documents' },
      { to: '/payments', icon: CreditCard, label: 'Payments' },
      { to: '/expenses', icon: Receipt, label: 'Expenses' },
      { to: '/time', icon: Clock, label: 'Time Tracking' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/recurring', icon: Repeat, label: 'Recurring' },
      { to: '/team', icon: UsersRound, label: 'Team' },
      { to: '/inventory', icon: Package, label: 'Inventory' },
      { to: '/booking', icon: CalendarCheck, label: 'Booking' },
    ],
  },
  {
    label: 'Settings',
    items: [
      { to: '/reports', icon: BarChart3, label: 'Reports' },
      { to: '/templates', icon: Layout, label: 'Templates' },
      { to: '/settings', icon: Settings, label: 'Settings' },
    ],
  },
];

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { user, logout } = useAuth();

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'var(--bg-primary)',
      display: 'flex', flexDirection: 'column',
      animation: 'slideUp 0.2s ease-out',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid var(--stroke-hairline)',
      }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
          Menu
        </span>
        <button onClick={onClose} style={{ padding: 4, color: 'var(--text-tertiary)', display: 'flex' }}>
          <X size={24} />
        </button>
      </div>

      {/* Sections */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
        {sections.map((section) => (
          <div key={section.label}>
            <div style={{
              fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)',
              textTransform: 'uppercase', letterSpacing: 0.8,
              padding: '16px 8px 6px',
            }}>
              {section.label}
            </div>
            {section.items.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 8px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 15, fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)',
                  background: isActive ? 'var(--badge-info-bg)' : 'transparent',
                  textDecoration: 'none',
                })}
              >
                <Icon size={22} />
                {label}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {/* User footer */}
      <div style={{
        borderTop: '1px solid var(--stroke-hairline)',
        padding: '12px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--bg-tertiary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)',
        }}>
          {user?.businessName?.[0]?.toUpperCase() || 'U'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 14, fontWeight: 600, color: 'var(--text-primary)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {user?.businessName || 'User'}
          </div>
        </div>
        <button
          onClick={logout}
          style={{ color: 'var(--text-tertiary)', padding: 8, borderRadius: 8, display: 'flex', gap: 6, alignItems: 'center', fontSize: 13 }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}
