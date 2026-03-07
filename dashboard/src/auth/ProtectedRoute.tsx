import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', background: 'var(--bg-primary)' }}>
        <div className="skeleton" style={{ width: 48, height: 48, borderRadius: '50%' }} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/dashboard/login" replace />;
  }

  return <Outlet />;
}
