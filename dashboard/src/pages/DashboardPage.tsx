import { useQuery } from '@tanstack/react-query';
import { DollarSign, Briefcase, AlertTriangle, TrendingUp, Clock, MapPin } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { CardSkeleton } from '../components/ui/Skeleton';
import { Header } from '../components/layout/Header';
import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import { statsApi } from '../api/endpoints';
import { useIsMobile } from '../hooks/useMediaQuery';
import type { Job, DashboardStats } from '../api/types';

function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function KpiCard({ icon: Icon, iconColor, label, value, sub }: {
  icon: typeof DollarSign; iconColor: string; label: string; value: string; sub?: string;
}) {
  return (
    <Card padding="comfort">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 'var(--radius-sm)',
          background: `${iconColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={20} color={iconColor} />
        </div>
        <span style={{ fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
      {sub && <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>{sub}</div>}
    </Card>
  );
}

function ScheduleCard({ job }: { job: Job }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 16px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--surface-card)',
        border: '1px solid var(--stroke-hairline)',
        cursor: 'pointer',
        transition: 'background 0.15s',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 48 }}>
        <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
          {job.scheduledAt ? formatTime(job.scheduledAt) : '--:--'}
        </span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 15, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {job.type || 'Job'}
          </span>
          <Badge status={job.status} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
          {job.client?.name && <span>{job.client.name}</span>}
          {job.address && (
            <>
              <span style={{ color: 'var(--text-tertiary)' }}>·</span>
              <MapPin size={12} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.address}</span>
            </>
          )}
        </div>
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, whiteSpace: 'nowrap' }}>
        {formatCurrency(job.total)}
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const isMobile = useIsMobile();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: statsApi.dashboard,
    staleTime: 30_000,
  });

  const { data: todayData, isLoading: todayLoading } = useQuery({
    queryKey: ['today-jobs'],
    queryFn: statsApi.today,
    staleTime: 30_000,
  });

  const { data: reports } = useQuery({
    queryKey: ['reports', 'month'],
    queryFn: () => statsApi.reports('month'),
    staleTime: 60_000,
  });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <>
      <Header
        title={`${greeting()}, ${user?.businessName?.split(' ')[0] || 'there'}`}
        subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      />

      {/* KPI Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: 'var(--space-md)',
        marginBottom: 24,
      }}>
        {statsLoading ? (
          <>
            <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
          </>
        ) : stats ? (
          <>
            <KpiCard icon={DollarSign} iconColor="var(--status-success)" label="Monthly Revenue" value={formatCurrency(stats.monthlyPaid)} sub={`${formatCurrency(stats.monthlyPending)} pending`} />
            <KpiCard icon={Briefcase} iconColor="var(--accent-primary)" label="Open Jobs" value={String(stats.openJobs)} sub={`${stats.completedJobsTotal} completed total`} />
            <KpiCard icon={AlertTriangle} iconColor="var(--status-warning)" label="Unpaid" value={formatCurrency(stats.unpaidAmount)} sub={`${stats.unpaidCount} invoice${stats.unpaidCount !== 1 ? 's' : ''}`} />
            <KpiCard icon={TrendingUp} iconColor="var(--status-info)" label="Paid Rate" value={`${stats.paidRate}%`} sub={`${stats.paidCount} of ${stats.invoicedCount} invoiced`} />
          </>
        ) : null}
      </div>

      {/* Chart + Schedule */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: 'var(--space-md)',
      }}>
        {/* Revenue Chart */}
        <Card padding="comfort">
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Revenue This Month</div>
          {reports?.chartData ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={reports.chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
                <Tooltip
                  contentStyle={{ background: 'var(--surface-card)', border: '1px solid var(--stroke-hairline)', borderRadius: 12, fontSize: 13 }}
                  labelStyle={{ color: 'var(--text-secondary)' }}
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--accent-primary)" fill="url(#colorRevenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="skeleton" style={{ height: 220, borderRadius: 'var(--radius-sm)' }} />
          )}
        </Card>

        {/* Today's Schedule */}
        <Card padding="comfort">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={18} color="var(--text-tertiary)" />
              <span style={{ fontSize: 16, fontWeight: 600 }}>Today's Schedule</span>
            </div>
            <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
              {todayData?.jobs?.length || 0} job{(todayData?.jobs?.length || 0) !== 1 ? 's' : ''}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 320, overflowY: 'auto' }}>
            {todayLoading ? (
              <>{[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 72, borderRadius: 'var(--radius-md)' }} />)}</>
            ) : todayData?.jobs?.length ? (
              todayData.jobs.map(job => <ScheduleCard key={job.id} job={job} />)
            ) : (
              <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-tertiary)', fontSize: 14 }}>
                No jobs scheduled for today
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Overdue Alert */}
      {stats && stats.overdueCount > 0 && (
        <Card variant="bordered" padding="standard" style={{
          marginTop: 16,
          borderColor: 'var(--status-danger)',
          background: 'var(--badge-danger-bg)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <AlertTriangle size={20} color="var(--status-danger)" />
            <div>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--status-danger)' }}>
                {stats.overdueCount} overdue invoice{stats.overdueCount > 1 ? 's' : ''}
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginLeft: 8 }}>
                {formatCurrency(stats.overdueAmount)} unpaid for 30+ days
              </span>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
