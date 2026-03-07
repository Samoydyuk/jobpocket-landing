import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../auth/AuthContext';
import { authApi } from '../api/endpoints';

export function VerifyPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get('email') || '';
  const { login } = useAuth();

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) navigate('/dashboard/login', { replace: true });
    inputs.current[0]?.focus();
  }, [email, navigate]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...code];
    next[index] = value.slice(-1);
    setCode(next);
    setError('');

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits filled
    if (next.every(d => d) && value) {
      handleVerify(next.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const digits = pasted.split('');
      setCode(digits);
      inputs.current[5]?.focus();
      handleVerify(pasted);
    }
  };

  const handleVerify = async (codeStr: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await authApi.verifyEmail(email, codeStr);
      if (res.isNewUser) {
        setError('Please sign up in the mobile app first');
        setLoading(false);
        return;
      }
      if (res.token && res.user) {
        login(res.token, res.user);
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Invalid code');
      setCode(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
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
      <Card variant="elevated" padding="comfort" style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Check your email</h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32 }}>
          We sent a 6-digit code to <strong>{email}</strong>
        </p>

        {/* OTP Inputs */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
          {code.map((digit, i) => (
            <input
              key={i}
              ref={el => { inputs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              style={{
                width: 48, height: 56,
                textAlign: 'center',
                fontSize: 22,
                fontWeight: 600,
                border: `2px solid ${error ? 'var(--status-danger)' : digit ? 'var(--accent-primary)' : 'var(--stroke-hairline)'}`,
                borderRadius: 'var(--radius-sm)',
                background: 'var(--surface-card)',
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'border-color 0.15s',
              }}
            />
          ))}
        </div>

        {error && (
          <p style={{ fontSize: 13, color: 'var(--status-danger)', marginBottom: 16 }}>{error}</p>
        )}

        {loading && (
          <p style={{ fontSize: 14, color: 'var(--text-tertiary)', marginBottom: 16 }}>Verifying...</p>
        )}

        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard/login')}
          style={{ marginTop: 8 }}
        >
          Use a different email
        </Button>
      </Card>
    </div>
  );
}
