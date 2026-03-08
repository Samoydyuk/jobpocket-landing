import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Smartphone, RefreshCw } from 'lucide-react';
import QRCode from 'qrcode';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useAuth } from '../auth/AuthContext';
import { authApi } from '../api/endpoints';

type QrStatus = 'loading' | 'active' | 'expired' | 'confirmed';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // QR state
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [qrStatus, setQrStatus] = useState<QrStatus>('loading');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionCreatedRef = useRef(0);

  // Email state
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const createSession = useCallback(async () => {
    setQrStatus('loading');
    try {
      const { sessionId: sid } = await authApi.createQrSession();
      setSessionId(sid);
      sessionCreatedRef.current = Date.now();

      const dataUrl = await QRCode.toDataURL(`jp-qr:${sid}`, {
        width: 220,
        margin: 2,
        color: { dark: '#111318', light: '#ffffff' },
        errorCorrectionLevel: 'M',
      });
      setQrDataUrl(dataUrl);
      setQrStatus('active');
    } catch {
      setQrStatus('expired');
    }
  }, []);

  // Poll when active
  useEffect(() => {
    if (qrStatus !== 'active' || !sessionId) return;

    pollRef.current = setInterval(async () => {
      if (Date.now() - sessionCreatedRef.current > 5 * 60 * 1000) {
        setQrStatus('expired');
        if (pollRef.current) clearInterval(pollRef.current);
        return;
      }
      try {
        const res = await authApi.pollQrSession(sessionId);
        if (res.status === 'confirmed' && res.token && res.user) {
          setQrStatus('confirmed');
          if (pollRef.current) clearInterval(pollRef.current);
          login(res.token, res.user);
          navigate('/', { replace: true });
        } else if (res.status === 'expired') {
          setQrStatus('expired');
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch {
        // ignore polling errors
      }
    }, 2000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [qrStatus, sessionId, login, navigate]);

  // Create initial session
  useEffect(() => { createSession(); }, [createSession]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError('');
    setLoading(true);
    try {
      await authApi.sendEmailCode(email.trim().toLowerCase());
      navigate(`/verify?email=${encodeURIComponent(email.trim().toLowerCase())}`);
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
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
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

        {/* QR Code */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '20px 0', marginBottom: 8,
        }}>
          <div style={{
            width: 240, height: 240,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 16,
            border: '1px solid var(--stroke-hairline)',
            background: '#fff',
            overflow: 'hidden',
          }}>
            {qrStatus === 'loading' && (
              <div className="skeleton" style={{ width: 200, height: 200, borderRadius: 8 }} />
            )}
            {qrStatus === 'active' && qrDataUrl && (
              <img src={qrDataUrl} alt="QR Code" width={220} height={220} style={{ display: 'block' }} />
            )}
            {qrStatus === 'expired' && (
              <div style={{ textAlign: 'center', padding: 20 }}>
                <p style={{ fontSize: 14, color: 'var(--text-tertiary)', marginBottom: 12 }}>QR code expired</p>
                <Button variant="ghost" onClick={createSession} style={{ gap: 6, fontSize: 13 }}>
                  <RefreshCw size={14} /> Generate new
                </Button>
              </div>
            )}
            {qrStatus === 'confirmed' && (
              <div style={{ textAlign: 'center', padding: 20 }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>&#10003;</div>
                <p style={{ fontSize: 14, color: 'var(--status-success)', fontWeight: 600 }}>Logging you in...</p>
              </div>
            )}
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            marginTop: 14, color: 'var(--text-tertiary)', fontSize: 13,
          }}>
            <Smartphone size={15} />
            <span>Open app &rarr; Settings &rarr; <strong>Login to Web</strong></span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '12px 0 20px' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--stroke-hairline)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>or sign in with email</span>
          <div style={{ flex: 1, height: 1, background: 'var(--stroke-hairline)' }} />
        </div>

        {/* Email form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            type="email"
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={18} />}
            error={error}
          />
          <Button type="submit" loading={loading} fullWidth>
            Continue
          </Button>
        </form>

        <p style={{
          textAlign: 'center', fontSize: 13,
          color: 'var(--text-tertiary)', marginTop: 24,
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
