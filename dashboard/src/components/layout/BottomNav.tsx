import { NavLink } from 'react-router-dom';
import { LayoutGrid, Briefcase, Users, Settings } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutGrid, label: 'Home' },
  { to: '/dashboard/jobs', icon: Briefcase, label: 'Jobs' },
  { to: '/dashboard/clients', icon: Users, label: 'Clients' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export function BottomNav() {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 72,
      background: 'var(--surface-nav)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--stroke-hairline)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '0 8px',
      zIndex: 50,
    }}>
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/dashboard'}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            fontSize: 10,
            fontWeight: isActive ? 600 : 400,
            color: isActive ? 'var(--accent-primary)' : 'var(--text-tertiary)',
            background: isActive ? `var(--accent-primary)18` : 'transparent',
            textDecoration: 'none',
            transition: 'color 0.15s',
          })}
        >
          <Icon size={24} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
