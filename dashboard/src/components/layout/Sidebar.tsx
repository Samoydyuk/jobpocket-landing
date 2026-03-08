import { NavLink } from 'react-router-dom';
import {
  LayoutGrid, Briefcase, Users, CalendarDays,
  FileText, CreditCard, Receipt, Clock,
  Repeat, UsersRound, Package, CalendarCheck,
  BarChart3, Layout, Settings, LogOut,
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useIsDesktop } from '../../hooks/useMediaQuery';

interface NavSection {
  label: string;
  items: { to: string; icon: React.ElementType; label: string }[];
}

const sections: NavSection[] = [
  {
    label: '',
    items: [
      { to: '/', icon: LayoutGrid, label: 'Dashboard' },
      { to: '/jobs', icon: Briefcase, label: 'Jobs' },
      { to: '/clients', icon: Users, label: 'Clients' },
      { to: '/calendar', icon: CalendarDays, label: 'Calendar' },
    ],
  },
  {
    label: 'Business',
    items: [
      { to: '/documents', icon: FileText, label: 'Documents' },
      { to: '/payments', icon: CreditCard, label: 'Payments' },
      { to: '/expenses', icon: Receipt, label: 'Expenses' },
      { to: '/time', icon: Clock, label: 'Time' },
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

export function Sidebar() {
  const isDesktop = useIsDesktop();
  const { user, logout } = useAuth();
  const collapsed = !isDesktop;

  return (
    <aside style={{
      width: collapsed ? 72 : 240,
      height: '100dvh',
      position: 'fixed',
      top: 0, left: 0,
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--stroke-hairline)',
      display: 'flex', flexDirection: 'column',
      padding: collapsed ? '12px 8px' : '12px',
      transition: 'width 0.2s',
      zIndex: 50,
      overflowX: 'hidden',
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '8px 0' : '8px',
        marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 10,
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'var(--accent-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 16, fontWeight: 700, flexShrink: 0,
        }}>
          J
        </div>
        {!collapsed && (
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
            JobPocket
          </span>
        )}
      </div>

      {/* Nav sections */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {sections.map((section, si) => (
          <div key={si}>
            {section.label && !collapsed && (
              <div style={{
                fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)',
                textTransform: 'uppercase', letterSpacing: 0.8,
                padding: '12px 10px 4px', marginTop: si > 0 ? 4 : 0,
              }}>
                {section.label}
              </div>
            )}
            {section.label && collapsed && si > 0 && (
              <div style={{ height: 1, background: 'var(--stroke-hairline)', margin: '6px 4px' }} />
            )}
            {section.items.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: collapsed ? '10px' : '9px 10px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 13, fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--badge-info-bg)' : 'transparent',
                  textDecoration: 'none',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  transition: 'background 0.15s, color 0.15s',
                })}
              >
                <Icon size={20} style={{ flexShrink: 0 }} />
                {!collapsed && label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User */}
      <div style={{
        borderTop: '1px solid var(--stroke-hairline)',
        paddingTop: 12, marginTop: 8,
        display: 'flex', alignItems: 'center', gap: 10,
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'var(--bg-tertiary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)',
          flexShrink: 0,
        }}>
          {user?.businessName?.[0]?.toUpperCase() || 'U'}
        </div>
        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {user?.businessName || 'User'}
            </div>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={logout}
            title="Logout"
            style={{ color: 'var(--text-tertiary)', padding: 4, borderRadius: 6, display: 'flex' }}
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </aside>
  );
}
