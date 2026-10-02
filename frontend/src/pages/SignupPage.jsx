import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';

export default function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', currency: 'INR' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await register({
        fullName: form.name.trim(),
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        currency: form.currency || 'INR'
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
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
          <h2>Start Your Financial Journey Today.</h2>
          <p>Join thousands who trust MoneyMate to manage their finances smarter, set goals, and build better habits.</p>
        </div>
        <div className="auth-stats">
          {[
            { val: '10K+', label: 'Active Users' },
            { val: '₹50Cr+', label: 'Tracked' },
            { val: '99.9%', label: 'Uptime' },
          ].map(({ val, label }) => (
            <div className="auth-stat" key={label}>
              <span className="stat-val">{val}</span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Create account</h2>
            <p>Set up your MoneyMate profile in seconds</p>
          </div>

          {error && <div className="auth-error"><span>{error}</span></div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <div className="input-icon-wrap">
                <User size={16} className="input-icon" />
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  className="input-field input-with-icon"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Email Address</label>
              <div className="input-icon-wrap">
                <Mail size={16} className="input-icon" />
                <input
                  id="signup-email"
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
                  id="signup-password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  className="input-field input-with-icon input-with-end-icon"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
                <button type="button" className="input-end-btn" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Preferred Currency</label>
              <select
                id="signup-currency"
                name="currency"
                className="input-field"
                value={form.currency}
                onChange={handleChange}
              >
                <option value="INR">🇮🇳 INR – Indian Rupee (₹)</option>
                <option value="USD">🇺🇸 USD – US Dollar ($)</option>
                <option value="EUR">🇪🇺 EUR – Euro (€)</option>
                <option value="GBP">🇬🇧 GBP – British Pound (£)</option>
              </select>
            </div>

            <button id="signup-submit" type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : null}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>

      <style>{`
        .auth-page { display: flex; min-height: 100vh; background: var(--bg-main); }
        .auth-left {
          flex: 1;
          background: linear-gradient(145deg, #0F172A 0%, #1E293B 60%, #065F46 100%);
          display: flex; flex-direction: column; justify-content: center;
          padding: 60px 56px; color: #fff; position: relative; overflow: hidden;
        }
        .auth-left::before {
          content: ''; position: absolute;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%);
          top: -100px; right: -100px; pointer-events: none;
        }
        .auth-brand { display: flex; align-items: center; gap: 14px; margin-bottom: 60px; position: relative; z-index: 1; }
        .auth-brand-icon {
          width: 48px; height: 48px;
          background: linear-gradient(135deg, var(--primary), #059669);
          border-radius: 14px; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 20px rgba(16,185,129,0.4);
        }
        .auth-brand h1 { font-size: 1.5rem; font-weight: 800; color: #fff; letter-spacing: -0.02em; line-height: 1.1; }
        .auth-brand span { font-size: 0.65rem; font-weight: 700; color: var(--primary); letter-spacing: 0.12em; }
        .auth-hero { margin-bottom: 40px; position: relative; z-index: 1; }
        .auth-hero h2 { font-size: 2.2rem; font-weight: 800; color: #fff; line-height: 1.2; margin-bottom: 16px; letter-spacing: -0.03em; }
        .auth-hero p { font-size: 1rem; color: #94A3B8; line-height: 1.6; max-width: 380px; }
        .auth-stats { display: flex; gap: 32px; position: relative; z-index: 1; }
        .auth-stat { display: flex; flex-direction: column; gap: 2px; }
        .stat-val { font-size: 1.6rem; font-weight: 800; color: var(--primary); letter-spacing: -0.02em; }
        .stat-label { font-size: 0.8rem; color: #94A3B8; font-weight: 500; }
        .auth-right { width: 480px; display: flex; align-items: center; justify-content: center; padding: 40px 32px; }
        .auth-card { width: 100%; max-width: 400px; }
        .auth-card-header { margin-bottom: 28px; }
        .auth-card-header h2 { font-size: 1.75rem; font-weight: 800; color: var(--text-primary); margin-bottom: 6px; letter-spacing: -0.02em; }
        .auth-card-header p { font-size: 0.9rem; color: var(--text-secondary); }
        .auth-error { background: #FEF2F2; border: 1px solid #FEE2E2; border-radius: var(--radius-md); padding: 12px 16px; margin-bottom: 20px; font-size: 0.875rem; color: #B91C1C; font-weight: 500; }
        .auth-form { margin-bottom: 20px; }
        .input-icon-wrap { position: relative; }
        .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; }
        .input-with-icon { padding-left: 40px; }
        .input-with-end-icon { padding-right: 40px; }
        .input-end-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); display: flex; align-items: center; background: none; transition: color 0.2s; }
        .input-end-btn:hover { color: var(--text-primary); }
        .auth-submit-btn { width: 100%; padding: 13px; font-size: 1rem; font-weight: 700; margin-top: 8px; letter-spacing: 0.01em; border-radius: var(--radius-md); }
        .auth-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none !important; }
        .btn-spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.4); border-top: 2px solid #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .auth-switch { text-align: center; font-size: 0.875rem; color: var(--text-secondary); }
        .auth-switch a { color: var(--primary); font-weight: 700; text-decoration: none; }
        .auth-switch a:hover { text-decoration: underline; }
        @media (max-width: 900px) { .auth-left { display: none; } .auth-right { width: 100%; } }
      `}</style>
    </div>
  );
}
