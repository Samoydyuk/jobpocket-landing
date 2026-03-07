import { Sun, Moon, Monitor, LogOut } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Header } from '../components/layout/Header';
import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../theme/ThemeContext';

const THEME_OPTIONS = [
  { key: 'light' as const, label: 'Light', icon: Sun },
  { key: 'dark' as const, label: 'Dark', icon: Moon },
  { key: 'auto' as const, label: 'System', icon: Monitor },
];

export function SettingsPage() {
  const { user, logout } = useAuth();
  const { mode, setMode } = useTheme();

  return (
    <>
      <Header title="Settings" />

      {/* Profile */}
      <Card variant="bordered" padding="comfort" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
          Business Profile
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 2 }}>Business Name</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{user?.businessName || '—'}</div>
          </div>
          {user?.email && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 2 }}>Email</div>
              <div style={{ fontSize: 15 }}>{user.email}</div>
            </div>
          )}
          {user?.phone && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 2 }}>Phone</div>
              <div style={{ fontSize: 15 }}>{user.phone}</div>
            </div>
          )}
          {user?.businessType && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 2 }}>Business Type</div>
              <div style={{ fontSize: 15 }}>{user.businessType}</div>
            </div>
          )}
          {user?.plan && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 2 }}>Plan</div>
              <div style={{
                display: 'inline-flex',
                padding: '4px 10px',
                borderRadius: 'var(--radius-pill)',
                fontSize: 12,
                fontWeight: 600,
                background: user.plan === 'BUSINESS' ? 'var(--badge-info-bg)' : user.plan === 'PRO' ? 'var(--badge-success-bg)' : 'var(--bg-tertiary)',
                color: user.plan === 'BUSINESS' ? 'var(--status-info)' : user.plan === 'PRO' ? 'var(--status-success)' : 'var(--text-secondary)',
              }}>
                {user.plan}
              </div>
            </div>
          )}
          {user?.currency && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 2 }}>Currency</div>
              <div style={{ fontSize: 15 }}>{user.currency}</div>
            </div>
          )}
          {user?.timezone && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 2 }}>Timezone</div>
              <div style={{ fontSize: 15 }}>{user.timezone}</div>
            </div>
          )}
        </div>
      </Card>

      {/* Theme */}
      <Card variant="bordered" padding="comfort" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
          Appearance
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {THEME_OPTIONS.map(opt => {
            const Icon = opt.icon;
            const active = mode === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => setMode(opt.key)}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  padding: '14px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: `2px solid ${active ? 'var(--accent-primary)' : 'var(--stroke-hairline)'}`,
                  background: active ? 'var(--badge-info-bg)' : 'transparent',
                  color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  transition: 'all 0.15s',
                  cursor: 'pointer',
                }}
              >
                <Icon size={20} />
                <span style={{ fontSize: 12, fontWeight: active ? 600 : 400 }}>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Logout */}
      <Button
        variant="destructive"
        onClick={logout}
        fullWidth
        style={{ marginTop: 8 }}
      >
        <LogOut size={18} />
        Sign Out
      </Button>
    </>
  );
}
