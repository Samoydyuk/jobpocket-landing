import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './theme/ThemeContext';
import { AuthProvider } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { AppShell } from './components/layout/AppShell';
import { LoginPage } from './pages/LoginPage';
import { VerifyPage } from './pages/VerifyPage';
import { DashboardPage } from './pages/DashboardPage';
import { JobsPage } from './pages/JobsPage';
import { JobDetailPage } from './pages/JobDetailPage';
import { ClientsPage } from './pages/ClientsPage';
import { ClientDetailPage } from './pages/ClientDetailPage';
import { SettingsPage } from './pages/SettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public */}
              <Route path="/dashboard/login" element={<LoginPage />} />
              <Route path="/dashboard/verify" element={<VerifyPage />} />

              {/* Protected — inside AppShell */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppShell />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/dashboard/jobs" element={<JobsPage />} />
                  <Route path="/dashboard/jobs/:id" element={<JobDetailPage />} />
                  <Route path="/dashboard/clients" element={<ClientsPage />} />
                  <Route path="/dashboard/clients/:id" element={<ClientDetailPage />} />
                  <Route path="/dashboard/settings" element={<SettingsPage />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
