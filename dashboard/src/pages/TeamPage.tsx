import { useQuery } from '@tanstack/react-query';
import { UsersRound, Mail, Phone } from 'lucide-react';
import { teamsApi } from '../api/endpoints';
import { getInitials, nameColor } from '../utils/formatters';
import type { TeamMember } from '../api/types';

const ROLE_STYLES: Record<string, { bg: string; color: string }> = {
  OWNER: { bg: '#8B5CF618', color: '#8B5CF6' },
  WORKER: { bg: 'var(--bg-tertiary)', color: 'var(--text-secondary)' },
};

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  ACTIVE: { bg: '#2EAA6518', color: '#2EAA65' },
  INVITED: { bg: '#E6A23C18', color: '#E6A23C' },
  INACTIVE: { bg: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' },
};

export function TeamPage() {
  const { data: members = [], isLoading } = useQuery({
    queryKey: ['team'],
    queryFn: async () => (await teamsApi.list()).members,
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Team</h1>
      </div>

      <div style={{
        background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--stroke-hairline)', overflow: 'hidden',
      }}>
        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading...</div>
        ) : members.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <UsersRound size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
            <div>No team members</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {members.map((m: TeamMember) => {
              const name = m.name || m.email || 'Unknown';
              const role = ROLE_STYLES[m.role] || ROLE_STYLES.WORKER;
              const status = STATUS_STYLES[m.status] || STATUS_STYLES.ACTIVE;
              return (
                <div key={m.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 20px',
                  borderBottom: '1px solid var(--stroke-hairline)',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: nameColor(name),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 14, fontWeight: 600, flexShrink: 0,
                  }}>
                    {getInitials(name)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)', display: 'flex', gap: 12, marginTop: 2 }}>
                      {m.email && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={12} /> {m.email}</span>}
                      {m.phone && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={12} /> {m.phone}</span>}
                    </div>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                    background: role.bg, color: role.color, textTransform: 'capitalize',
                  }}>
                    {m.role.toLowerCase()}
                  </span>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                    background: status.bg, color: status.color, textTransform: 'capitalize',
                  }}>
                    {m.status.toLowerCase()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
