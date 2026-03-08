import { NavLink } from 'react-router-dom';
import { LayoutGrid, Briefcase, Users, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useIsDesktop } from '../../hooks/useMediaQuery';

const navItems = [
  { to: '/', icon: LayoutGrid, label: 'Dashboard' },
  { to: '/jobs', icon: Briefcase, label: 'Jobs' },
  { to: '/clients', icon: Users, label: 'Clients' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const isDesktop = useIsDesktop();
  const { user, logout } = useAuth();
  const collapsed = !isDesktop;

  return (
    <aside style={{
      width: collapsed ? 72 : 260,
      height: '100dvh',
      position: 'fixed',
      top: 0,
      left: 0,
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--stroke-hairline)',
      display: 'flex',
      flexDirection: 'column',
      padding: collapsed ? '16px 8px' : '16px',
      transition: 'width 0.2s',
      zIndex: 50,
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '12px 0' : '12px 8px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'var(--accent-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 18, fontWeight: 700,
          flexShrink: 0,
        }}>
          J
        </div>
        {!collapsed && (
          <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
            JobPocket
          </span>
        )}
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: collapsed ? '12px' : '12px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: 15,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
              background: isActive ? 'var(--badge-info-bg)' : 'transparent',
              textDecoration: 'none',
              justifyContent: collapsed ? 'center' : 'flex-start',
              transition: 'background 0.15s, color 0.15s',
            })}
          >
            <Icon size={22} />
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div style={{
        borderTop: '1px solid var(--stroke-hairline)',
        paddingTop: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--bg-tertiary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)',
          flexShrink: 0,
        }}>
          {user?.businessName?.[0]?.toUpperCase() || 'U'}
        </div>
        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 14, fontWeight: 600, color: 'var(--text-primary)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {user?.businessName || 'User'}
            </div>
            <div style={{
              fontSize: 12, color: 'var(--text-tertiary)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {user?.email || ''}
            </div>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={logout}
            title="Logout"
            style={{ color: 'var(--text-tertiary)', padding: 6, borderRadius: 8 }}
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </aside>
  );
}
