import { NavLink } from 'react-router-dom';
import { LayoutGrid, Briefcase, CalendarDays, Menu } from 'lucide-react';
import { useState } from 'react';
import { MobileMenu } from './MobileMenu';

const navItems = [
  { to: '/', icon: LayoutGrid, label: 'Home' },
  { to: '/jobs', icon: Briefcase, label: 'Jobs' },
  { to: '/calendar', icon: CalendarDays, label: 'Calendar' },
];

export function BottomNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
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
            end={to === '/'}
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
        <button
          onClick={() => setMenuOpen(true)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            fontSize: 10,
            fontWeight: menuOpen ? 600 : 400,
            color: menuOpen ? 'var(--accent-primary)' : 'var(--text-tertiary)',
            background: menuOpen ? `var(--accent-primary)18` : 'transparent',
            transition: 'color 0.15s',
          }}
        >
          <Menu size={24} />
          More
        </button>
      </nav>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
