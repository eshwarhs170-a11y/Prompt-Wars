import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, ArrowRight, Sun, Moon, ArrowLeft } from 'lucide-react';
import '../styles/theme.css';

export default function Login({ onLogin, theme, toggleTheme }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('https://prompt-wars-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (response.ok) {
        const data = await response.json();
        if (onLogin) onLogin(data.token, data.user);
        navigate('/dashboard');
      } else {
        alert('Invalid credentials. Use admin / admin');
      }
    } catch {
      // Local fallback
      const mockUser = { username: username || 'analyst', role: 'Security Architect', avatar: '🛡️' };
      if (onLogin) onLogin('mock-token', mockUser);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      background: 'var(--bg-base)'
    }}>
      {/* Top Controls: Back to Home & Theme Toggle */}
      <div style={{ 
        position: 'absolute', 
        top: '24px', 
        left: '24px', 
        right: '24px', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center' 
      }}>
        <button 
          onClick={() => navigate('/')}
          className="nav-operator-btn"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft size={15} />
          <span>Back to Home</span>
        </button>

        <button 
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title="Toggle Light / Dark Mode"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>

      {/* 3D Glassmorphism Login Container */}
      <div style={{
        width: '100%',
        maxWidth: '440px',
        padding: '40px 36px',
        background: 'var(--bg-panel)',
        borderRadius: '20px',
        border: '1px solid var(--border-strong)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px var(--accent-glow)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Brand Icon with 3D Pulse Ring */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 16px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.2), rgba(2, 132, 199, 0.4))',
            display: 'grid',
            placeItems: 'center',
            color: 'var(--accent)',
            border: '1px solid rgba(34, 211, 238, 0.35)',
            boxShadow: '0 0 30px var(--accent-glow)'
          }}>
            <ShieldCheck size={36} strokeWidth={2.4} />
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '6px' }}>
            BANKISM
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '12.5px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Sentinel AI Firewall &bull; SOC Gateway
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <User size={13} color="var(--accent)" />
              <span>Operator ID</span>
            </label>
            <input 
              type="text" 
              className="input mono"
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
              placeholder="admin"
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <Lock size={13} color="var(--accent)" />
              <span>Access Key</span>
            </label>
            <input 
              type="password" 
              className="input mono"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '8px', padding: '13px' }}
            disabled={loading}
          >
            {loading ? "Authenticating..." : (
              <>
                <span>Access Sentinel Console</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
          Competition Sandbox Credentials: <code style={{ color: 'var(--accent)', background: 'var(--accent-soft)', padding: '2px 6px', borderRadius: '4px' }}>admin</code> / <code style={{ color: 'var(--accent)', background: 'var(--accent-soft)', padding: '2px 6px', borderRadius: '4px' }}>admin</code>
        </div>
      </div>

      {/* Subtle Corporate Login Footer */}
      <footer style={{
        marginTop: '32px',
        color: 'var(--text-muted)',
        fontSize: '12px',
        textAlign: 'center',
        zIndex: 10
      }}>
        &copy; 2026 Bankism AI Security &bull; Blue-Team Sentinel Gateway &bull; Prompt-Wars x UVCE
      </footer>
    </div>
  );
}
