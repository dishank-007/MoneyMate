import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, Mail, Lock, Eye, EyeOff, TrendingUp, Shield, Zap } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-icon"><Wallet size={28} color="#fff" /></div>
          <div>
            <h1>MoneyMate</h1>
            <span>FINANCE MANAGER</span>
          </div>
        </div>
        <div className="auth-hero">
          <h2>Master Your Money.<br/>Simplify Your Life.</h2>
          <p>Track expenses, set budgets, achieve goals — all in one beautifully designed app.</p>
        </div>
        <div className="auth-features">
          {[
            { icon: TrendingUp, label: 'Real-time analytics & insights' },
            { icon: Shield, label: 'Secure JWT-based authentication' },
            { icon: Zap, label: 'Smart budget alerts & notifications' },
          ].map(({ icon: Icon, label }) => (
            <div className="auth-feature-item" key={label}>
              <div className="auth-feature-icon"><Icon size={16} color="var(--primary)" /></div>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Welcome back</h2>
            <p>Sign in to your MoneyMate account</p>
          </div>

          {error && (
            <div className="auth-error">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <div className="input-icon-wrap">
                <Mail size={16} className="input-icon" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  className="input-field input-with-icon"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="input-icon-wrap">
                <Lock size={16} className="input-icon" />
                <input
                  id="login-password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  className="input-field input-with-icon input-with-end-icon"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
                <button type="button" className="input-end-btn" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button id="login-submit" type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>

      <style>{`
        .auth-page {
          display: flex;
          min-height: 100vh;
          background: var(--bg-main);
        }
        .auth-left {
          flex: 1;
          background: linear-gradient(145deg, #0F172A 0%, #1E293B 60%, #065F46 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 56px;
          color: #fff;
          position: relative;
          overflow: hidden;
        }
        .auth-left::before {
          content: '';
          position: absolute;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%);
          top: -100px; right: -100px;
          pointer-events: none;
        }
        .auth-left::after {
          content: '';
          position: absolute;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%);
          bottom: -50px; left: 50px;
          pointer-events: none;
        }
        .auth-brand {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 60px;
          position: relative;
          z-index: 1;
        }
        .auth-brand-icon {
          width: 48px; height: 48px;
          background: linear-gradient(135deg, var(--primary), #059669);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 20px rgba(16,185,129,0.4);
        }
        .auth-brand h1 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        .auth-brand span {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--primary);
          letter-spacing: 0.12em;
        }
        .auth-hero {
          margin-bottom: 40px;
          position: relative;
          z-index: 1;
        }
        .auth-hero h2 {
          font-size: 2.5rem;
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 16px;
          letter-spacing: -0.03em;
        }
        .auth-hero p {
          font-size: 1rem;
          color: #94A3B8;
          line-height: 1.6;
          max-width: 380px;
        }
        .auth-features {
          display: flex;
          flex-direction: column;
          gap: 14px;
          position: relative;
          z-index: 1;
        }
        .auth-feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.9rem;
          color: #CBD5E1;
          font-weight: 500;
        }
        .auth-feature-icon {
          width: 30px; height: 30px;
          background: rgba(16,185,129,0.15);
          border: 1px solid rgba(16,185,129,0.3);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .auth-right {
          width: 480px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 32px;
        }
        .auth-card {
          width: 100%;
          max-width: 400px;
        }
        .auth-card-header {
          margin-bottom: 28px;
        }
        .auth-card-header h2 {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 6px;
          letter-spacing: -0.02em;
        }
        .auth-card-header p {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .auth-error {
          background: #FEF2F2;
          border: 1px solid #FEE2E2;
          border-radius: var(--radius-md);
          padding: 12px 16px;
          margin-bottom: 20px;
          font-size: 0.875rem;
          color: #B91C1C;
          font-weight: 500;
        }
        .auth-form { margin-bottom: 20px; }
        .input-icon-wrap { position: relative; }
        .input-icon {
          position: absolute;
          left: 14px; top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }
        .input-with-icon { padding-left: 40px; }
        .input-with-end-icon { padding-right: 40px; }
        .input-end-btn {
          position: absolute;
          right: 12px; top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          display: flex; align-items: center;
          background: none;
          transition: color 0.2s;
        }
        .input-end-btn:hover { color: var(--text-primary); }
        .auth-submit-btn {
          width: 100%;
          padding: 13px;
          font-size: 1rem;
          font-weight: 700;
          margin-top: 8px;
          letter-spacing: 0.01em;
          border-radius: var(--radius-md);
        }
        .auth-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none !important; }
        .btn-spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top: 2px solid #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .auth-switch {
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        .auth-switch a {
          color: var(--primary);
          font-weight: 700;
          text-decoration: none;
        }
        .auth-switch a:hover { text-decoration: underline; }
        @media (max-width: 900px) {
          .auth-left { display: none; }
          .auth-right { width: 100%; }
        }
      `}</style>
    </div>
  );
}
