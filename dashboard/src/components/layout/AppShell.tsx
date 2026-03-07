import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { useIsMobile, useIsDesktop } from '../../hooks/useMediaQuery';

export function AppShell() {
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();

  const sidebarWidth = isMobile ? 0 : isDesktop ? 260 : 72;

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100dvh' }}>
      {/* Sidebar (hidden on mobile) */}
      {!isMobile && <Sidebar />}

      {/* Main content */}
      <main style={{
        flex: 1,
        marginLeft: sidebarWidth,
        padding: isMobile ? '20px 16px 92px' : '28px 32px',
        maxWidth: '100%',
        minHeight: '100dvh',
        transition: 'margin-left 0.2s',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>

      {/* Bottom nav (mobile only) */}
      {isMobile && <BottomNav />}
    </div>
  );
}
