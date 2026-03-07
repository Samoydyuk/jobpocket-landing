import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { authApi } from '../api/endpoints';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError('');
    setLoading(true);
    try {
      await authApi.sendEmailCode(email.trim().toLowerCase());
      navigate(`/dashboard/verify?email=${encodeURIComponent(email.trim().toLowerCase())}`);
    } catch (err: any) {
      setError(err.message || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100dvh',
      padding: 20,
      background: 'var(--bg-primary)',
    }}>
      <Card variant="elevated" padding="comfort" style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'var(--accent-primary)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 24, fontWeight: 700,
            marginBottom: 16,
          }}>
            J
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Welcome back</h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
            Sign in to your JobPocket dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            type="email"
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={18} />}
            error={error}
            autoFocus
          />
          <Button type="submit" loading={loading} fullWidth>
            Continue
          </Button>
        </form>

        <p style={{
          textAlign: 'center',
          fontSize: 13,
          color: 'var(--text-tertiary)',
          marginTop: 24,
        }}>
          Don't have an account?{' '}
          <a href="https://apps.apple.com/app/id6757860497" target="_blank" rel="noopener" style={{ color: 'var(--accent-primary)' }}>
            Download the app
          </a>
        </p>
      </Card>
    </div>
  );
}
