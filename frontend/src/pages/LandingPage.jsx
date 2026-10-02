import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Wallet, TrendingUp, Target, PieChart, ShieldCheck,
  ArrowRight, CheckCircle2, ChevronRight, Sparkles,
  BarChart3, Layers, Lock, DollarSign, Smartphone,
  Users, HelpCircle, Mail, ExternalLink, Menu, X
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: TrendingUp,
      title: 'Expense Tracking',
      desc: 'Seamlessly track daily expenses and income. Filter by category, payment type, and date with instant real-time feedback.',
      color: '#10B981',
      bg: '#D1FAE5'
    },
    {
      icon: PieChart,
      title: 'Budget Management',
      desc: 'Establish category-wise monthly spending caps. Visual progress indicators alert you before you exceed your budget limits.',
      color: '#3B82F6',
      bg: '#DBEAFE'
    },
    {
      icon: Target,
      title: 'Savings Goals',
      desc: 'Define targets for vacations, emergency funds, or new gadgets. Deposit savings incrementally and celebrate every milestone.',
      color: '#8B5CF6',
      bg: '#EDE9FE'
    },
    {
      icon: BarChart3,
      title: 'Financial Reports',
      desc: 'Understand spending behavior through category breakdowns, daily trends, and comprehensive monthly summaries.',
      color: '#F59E0B',
      bg: '#FEF3C7'
    },
    {
      icon: Layers,
      title: 'Smart Dashboard',
      desc: 'A unified command center for your net balance, monthly cash flows, active savings goals, and recent activity.',
      color: '#06B6D4',
      bg: '#CFFAFE'
    },
    {
      icon: ShieldCheck,
      title: 'Secure Account',
      desc: 'Built with industry-standard BCrypt password hashing, stateless JWT authentication, and strict user-data isolation.',
      color: '#10B981',
      bg: '#D1FAE5'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Create Account',
      desc: 'Sign up in seconds with your email and choose your preferred currency (₹, $, €, £).'
    },
    {
      step: '02',
      title: 'Track Transactions',
      desc: 'Record daily expenses, salary credits, and freelance payouts with rich tags and notes.'
    },
    {
      step: '03',
      title: 'Set Budgets',
      desc: 'Define healthy monthly spending boundaries for Food, Shopping, Utilities, and more.'
    },
    {
      step: '04',
      title: 'Create Goals',
      desc: 'Set custom targets with target dates and add savings whenever you have surplus cash.'
    },
    {
      step: '05',
      title: 'Understand Finances',
      desc: 'Review interactive charts and monthly analytics to achieve complete financial peace of mind.'
    }
  ];

  const benefits = [
    'Gain complete clarity on where every single rupee or dollar goes',
    'Boost monthly savings rate by curbing unbudgeted impulse purchases',
    'Experience a clean, distraction-free modern UI with responsive design',
    'Rest easy knowing your financial records are private, isolated, and encrypted',
    'Set up in under 60 seconds with no complex banking integrations required'
  ];

  return (
    <div className="landing-root">
      {/* Navigation */}
      <header className="landing-nav-wrap">
        <div className="landing-nav-inner">
          <Link to="/" className="brand-logo">
            <div className="logo-icon-box">
              <Wallet size={22} color="#FFFFFF" />
            </div>
            <span className="brand-name">
              Money<span className="brand-highlight">Mate</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="desktop-nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#preview" className="nav-link">Preview</a>
            <a href="#benefits" className="nav-link">Benefits</a>
            <a href="#contact" className="nav-link">Contact</a>
          </nav>

          {/* Desktop CTA */}
          <div className="desktop-nav-actions">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-sm">
                Dashboard <ArrowRight size={15} />
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary btn-sm">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="mobile-nav-menu">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="mobile-link">Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="mobile-link">How It Works</a>
            <a href="#preview" onClick={() => setMobileMenuOpen(false)} className="mobile-link">Preview</a>
            <a href="#benefits" onClick={() => setMobileMenuOpen(false)} className="mobile-link">Benefits</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="mobile-link">Contact</a>
            <div className="mobile-nav-btns">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-primary w-full">
                  Go to Dashboard <ArrowRight size={15} />
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn btn-secondary w-full">Login</Link>
                  <Link to="/signup" className="btn btn-primary w-full">Get Started</Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-badge">
            <Sparkles size={15} className="hero-badge-icon" />
            <span>Smart Personal Finance Simplified</span>
          </div>
          <h1 className="hero-headline">
            Master Your Money.<br />
            <span className="gradient-text">Simplify Your Life.</span>
          </h1>
          <p className="hero-subtext">
            MoneyMate is the modern personal finance assistant designed to track daily expenses,
            enforce smart budgets, and achieve life goals without spreadsheets or complexity.
          </p>

          <div className="hero-cta-group">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn btn-primary btn-lg">
                  Get Started Free <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Login to Account
                </Link>
              </>
            )}
          </div>

          <div className="hero-metrics">
            <div className="metric-item">
              <strong>100%</strong>
              <span>Private & Secure</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <strong>4 Currencies</strong>
              <span>INR, USD, EUR, GBP</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <strong>Real-Time</strong>
              <span>Live Visual Analytics</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Product Preview Mockup */}
      <section id="preview" className="preview-section">
        <div className="section-container">
          <div className="preview-mockup-wrapper">
            <div className="mockup-header-bar">
              <div className="mockup-dots">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
              </div>
              <div className="mockup-address-bar">
                <Lock size={12} /> https://moneymate.app/dashboard
              </div>
              <div style={{ width: 44 }} />
            </div>

            <div className="mockup-dashboard-body">
              {/* Top Greeting */}
              <div className="mockup-banner">
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Welcome back, Alex! 👋</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Here is your financial pulse for this month.</p>
                </div>
                <span className="badge badge-success" style={{ alignSelf: 'center' }}>Healthy +18.4%</span>
              </div>

              {/* Mockup KPIs */}
              <div className="mockup-kpi-grid">
                <div className="mockup-kpi">
                  <span className="kpi-label">Total Balance</span>
                  <span className="kpi-val" style={{ color: 'var(--primary)' }}>₹ 1,48,250.00</span>
                  <span className="kpi-sub">Net Worth</span>
                </div>
                <div className="mockup-kpi">
                  <span className="kpi-label">Monthly Income</span>
                  <span className="kpi-val">₹ 85,000.00</span>
                  <span className="kpi-sub text-green">↑ On Track</span>
                </div>
                <div className="mockup-kpi">
                  <span className="kpi-label">Monthly Expenses</span>
                  <span className="kpi-val" style={{ color: 'var(--accent-red)' }}>₹ 32,400.00</span>
                  <span className="kpi-sub">38% of Income</span>
                </div>
                <div className="mockup-kpi">
                  <span className="kpi-label">Active Goals</span>
                  <span className="kpi-val" style={{ color: 'var(--accent-purple)' }}>3 In Progress</span>
                  <span className="kpi-sub">65% Achieved</span>
                </div>
              </div>

              {/* Mockup Cards */}
              <div className="mockup-row">
                <div className="mockup-card flex-2">
                  <div className="card-top">
                    <h4>Monthly Cash Flow</h4>
                    <span className="badge badge-info">Jan - Jun</span>
                  </div>
                  <div className="mockup-bars">
                    {[
                      { m: 'Jan', inc: 70, exp: 40 },
                      { m: 'Feb', inc: 75, exp: 35 },
                      { m: 'Mar', inc: 80, exp: 45 },
                      { m: 'Apr', inc: 82, exp: 38 },
                      { m: 'May', inc: 85, exp: 42 },
                      { m: 'Jun', inc: 90, exp: 36 }
                    ].map(b => (
                      <div key={b.m} className="bar-group">
                        <div className="bars-pair">
                          <div className="bar bar-income" style={{ height: `${b.inc}%` }} title={`Income: ${b.inc}%`} />
                          <div className="bar bar-expense" style={{ height: `${b.exp}%` }} title={`Expense: ${b.exp}%`} />
                        </div>
                        <span className="bar-label">{b.m}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mockup-card flex-1">
                  <div className="card-top">
                    <h4>Active Budgets</h4>
                    <span className="badge badge-success">3 Healthy</span>
                  </div>
                  <div className="mockup-budget-list">
                    <div className="mockup-b-item">
                      <div className="b-head">
                        <span>🍔 Food & Dining</span>
                        <strong>₹ 8,400 / 12,000</strong>
                      </div>
                      <div className="progress-bar"><div className="fill" style={{ width: '70%', background: '#10B981' }} /></div>
                    </div>
                    <div className="mockup-b-item">
                      <div className="b-head">
                        <span>🚗 Transport</span>
                        <strong>₹ 3,200 / 5,000</strong>
                      </div>
                      <div className="progress-bar"><div className="fill" style={{ width: '64%', background: '#3B82F6' }} /></div>
                    </div>
                    <div className="mockup-b-item">
                      <div className="b-head">
                        <span>🛍️ Shopping</span>
                        <strong>₹ 7,800 / 10,000</strong>
                      </div>
                      <div className="progress-bar"><div className="fill" style={{ width: '78%', background: '#F59E0B' }} /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-features">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Powerful Capabilities</span>
            <h2 className="section-title">Everything you need to master your wealth</h2>
            <p className="section-sub">
              Engineered for simplicity and depth. All your financial components work seamlessly together.
            </p>
          </div>

          <div className="features-grid">
            {features.map((f, i) => {
              const IconComp = f.icon;
              return (
                <div key={i} className="card feature-card">
                  <div className="feature-icon-box" style={{ background: f.bg }}>
                    <IconComp size={24} color={f.color} />
                  </div>
                  <h3 className="feature-title">{f.title}</h3>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section-how">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Step-by-Step Flow</span>
            <h2 className="section-title">How MoneyMate Works</h2>
            <p className="section-sub">
              From day one to long-term financial independence in five simple steps.
            </p>
          </div>

          <div className="steps-container">
            {steps.map((st, i) => (
              <div key={st.step} className="step-card">
                <div className="step-num">{st.step}</div>
                <h4 className="step-title">{st.title}</h4>
                <p className="step-desc">{st.desc}</p>
                {i < steps.length - 1 && <div className="step-connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="section-benefits">
        <div className="section-container">
          <div className="benefits-wrap">
            <div className="benefits-left">
              <span className="section-tag">Why Choose MoneyMate</span>
              <h2 className="section-title">Designed for real clarity, not cluttered confusion</h2>
              <p className="section-sub">
                Most personal finance apps sell your data, overwhelm you with upsells, or require complicated integrations.
                MoneyMate puts you in the driver seat with pure, distraction-free control.
              </p>

              <div className="benefits-list">
                {benefits.map((b, i) => (
                  <div key={i} className="benefit-row">
                    <CheckCircle2 size={20} color="var(--primary)" className="benefit-icon" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="benefits-right">
              <div className="card stat-highlight-card">
                <div className="stat-pill">Confidence & Control</div>
                <h3>Take charge of your finances today</h3>
                <p>
                  Join thousands of conscious budgeters who use MoneyMate every day to achieve financial peace of mind.
                </p>
                <Link to="/signup" className="btn btn-primary w-full" style={{ justifyContent: 'center' }}>
                  Create Free Account <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-contact">
        <div className="section-container">
          <div className="contact-card card">
            <div className="contact-content">
              <div className="contact-badge">
                <Mail size={16} /> Support & Inquiries
              </div>
              <h2 className="contact-title">Have questions or feedback?</h2>
              <p className="contact-sub">
                We're continuously improving MoneyMate. Reach out directly or start managing your finances right now.
              </p>
              <div className="contact-actions">
                <Link to="/signup" className="btn btn-primary btn-lg">
                  Get Started Free <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Existing User Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="section-container footer-inner">
          <div className="footer-brand">
            <div className="brand-logo">
              <div className="logo-icon-box">
                <Wallet size={18} color="#FFFFFF" />
              </div>
              <span className="brand-name">
                Money<span className="brand-highlight">Mate</span>
              </span>
            </div>
            <p className="footer-tagline">
              Modern full-stack personal finance management designed for simplicity, security, and financial freedom.
            </p>
          </div>

          <div className="footer-col">
            <h5 className="footer-title">Navigation</h5>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#preview">Product Preview</a>
            <a href="#benefits">Benefits</a>
          </div>

          <div className="footer-col">
            <h5 className="footer-title">Platform</h5>
            <Link to="/login">Account Login</Link>
            <Link to="/signup">New Registration</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>

          <div className="footer-col">
            <h5 className="footer-title">Security & Tech</h5>
            <span>Spring Boot 3 + JWT</span>
            <span>React + Vite</span>
            <span>MySQL Relational DB</span>
            <span>BCrypt Encrypted</span>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="section-container footer-bottom-inner">
            <p>© {new Date().getFullYear()} MoneyMate. All rights reserved.</p>
            <p className="footer-note">Built with care for smart personal finance.</p>
          </div>
        </div>
      </footer>

      {/* Landing Page Scoped Styles */}
      <style>{`
        .landing-root {
          min-height: 100vh;
          background-color: var(--bg-main);
          color: var(--text-primary);
          overflow-x: hidden;
        }
        .landing-nav-wrap {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color);
        }
        .landing-nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
          font-size: 1.3rem;
          color: var(--text-primary);
        }
        .logo-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
        }
        .brand-highlight {
          color: var(--primary);
        }
        .desktop-nav-links {
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .nav-link {
          font-size: 0.925rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: var(--transition);
        }
        .nav-link:hover {
          color: var(--primary);
        }
        .desktop-nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .mobile-menu-btn {
          display: none;
          color: var(--text-primary);
          padding: 6px;
        }
        .mobile-nav-menu {
          display: flex;
          flex-direction: column;
          padding: 16px 24px 24px;
          background: #FFFFFF;
          border-bottom: 1px solid var(--border-color);
          gap: 14px;
        }
        .mobile-link {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .mobile-nav-btns {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 10px;
        }

        /* Hero */
        .hero-section {
          padding: 80px 24px 60px;
          text-align: center;
        }
        .hero-container {
          max-width: 860px;
          margin: 0 auto;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 9999px;
          background: var(--primary-light);
          color: var(--primary-dark);
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 24px;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        .hero-badge-icon {
          color: var(--primary);
        }
        .hero-headline {
          font-size: 3.5rem;
          font-weight: 900;
          line-height: 1.15;
          letter-spacing: -0.03em;
          margin-bottom: 20px;
        }
        .gradient-text {
          background: linear-gradient(135deg, var(--primary) 0%, #059669 50%, var(--accent-blue) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtext {
          font-size: 1.15rem;
          color: var(--text-secondary);
          max-width: 680px;
          margin: 0 auto 36px;
          line-height: 1.6;
        }
        .hero-cta-group {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 48px;
        }
        .btn-lg {
          padding: 14px 28px;
          font-size: 1rem;
          border-radius: var(--radius-md);
        }
        .hero-metrics {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 32px;
          flex-wrap: wrap;
          padding: 20px 32px;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(8px);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
          display: inline-flex;
        }
        .metric-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .metric-item strong {
          font-size: 1.25rem;
          color: var(--text-primary);
        }
        .metric-item span {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .metric-divider {
          width: 1px;
          height: 28px;
          background: var(--border-color);
        }

        /* Preview */
        .preview-section {
          padding: 20px 24px 80px;
        }
        .section-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .preview-mockup-wrapper {
          background: #FFFFFF;
          border-radius: var(--radius-xl);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(226, 232, 240, 0.8);
          overflow: hidden;
          border: 1px solid var(--border-color);
        }
        .mockup-header-bar {
          background: #F8FAFC;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
        }
        .mockup-dots {
          display: flex;
          gap: 8px;
        }
        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        .dot.red { background: #EF4444; }
        .dot.yellow { background: #F59E0B; }
        .dot.green { background: #10B981; }
        .mockup-address-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #FFFFFF;
          padding: 4px 16px;
          border-radius: 9999px;
          font-size: 0.8rem;
          color: var(--text-muted);
          border: 1px solid var(--border-color);
        }
        .mockup-dashboard-body {
          padding: 32px;
          background: var(--bg-main);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .mockup-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #FFFFFF;
          padding: 20px 24px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
        }
        .mockup-kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }
        .mockup-kpi {
          background: #FFFFFF;
          padding: 20px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .kpi-label { font-size: 0.8rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; }
        .kpi-val { font-size: 1.4rem; font-weight: 800; color: var(--text-primary); }
        .kpi-sub { font-size: 0.775rem; color: var(--text-secondary); font-weight: 600; }
        .text-green { color: var(--primary) !important; }
        .mockup-row {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        .flex-2 { flex: 2; min-width: 300px; }
        .flex-1 { flex: 1; min-width: 260px; }
        .mockup-card {
          background: #FFFFFF;
          padding: 24px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
        }
        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .mockup-bars {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          height: 160px;
          padding-top: 10px;
        }
        .bar-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          flex: 1;
        }
        .bars-pair {
          display: flex;
          align-items: flex-end;
          gap: 6px;
          height: 130px;
        }
        .bar {
          width: 14px;
          border-radius: 4px 4px 0 0;
          transition: height 0.3s;
        }
        .bar-income { background: var(--primary); }
        .bar-expense { background: #F87171; }
        .bar-label { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }
        .mockup-budget-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .mockup-b-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .b-head {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .progress-bar {
          height: 8px;
          background: #F1F5F9;
          border-radius: 9999px;
          overflow: hidden;
        }
        .progress-bar .fill {
          height: 100%;
          border-radius: 9999px;
        }

        /* Features */
        .section-features, .section-how, .section-benefits, .section-contact {
          padding: 80px 24px;
        }
        .section-header {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 56px;
        }
        .section-tag {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          display: inline-block;
          margin-bottom: 8px;
        }
        .section-title {
          font-size: 2.3rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
        }
        .section-sub {
          font-size: 1.05rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
        }
        .feature-card {
          padding: 32px;
          border-radius: var(--radius-xl);
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          gap: 14px;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-neu);
          transition: var(--transition);
        }
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-neu-hover);
        }
        .feature-icon-box {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .feature-title {
          font-size: 1.25rem;
          font-weight: 800;
        }
        .feature-desc {
          font-size: 0.925rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* How It Works */
        .section-how {
          background: #F8FAFC;
        }
        .steps-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          position: relative;
        }
        .step-card {
          background: #FFFFFF;
          padding: 28px 22px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
          position: relative;
          box-shadow: var(--shadow-sm);
        }
        .step-num {
          font-size: 1.8rem;
          font-weight: 900;
          color: var(--primary);
          margin-bottom: 12px;
          opacity: 0.9;
        }
        .step-title {
          font-size: 1.05rem;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .step-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* Benefits */
        .benefits-wrap {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 48px;
          align-items: center;
        }
        .benefits-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 28px;
        }
        .benefit-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .benefit-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }
        .stat-highlight-card {
          padding: 40px;
          background: linear-gradient(135deg, #FFFFFF 0%, var(--primary-light) 100%);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-neu);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .stat-pill {
          display: inline-block;
          font-size: 0.775rem;
          font-weight: 700;
          color: var(--primary-dark);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .stat-highlight-card h3 {
          font-size: 1.6rem;
          font-weight: 800;
        }
        .stat-highlight-card p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* Contact / CTA */
        .contact-card {
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
          color: #FFFFFF;
          padding: 60px 40px;
          border-radius: var(--radius-xl);
          text-align: center;
        }
        .contact-content {
          max-width: 640px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
        }
        .contact-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--primary);
        }
        .contact-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #FFFFFF;
        }
        .contact-sub {
          font-size: 1rem;
          color: #94A3B8;
          line-height: 1.6;
        }
        .contact-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 12px;
        }

        /* Footer */
        .landing-footer {
          background: #FFFFFF;
          border-top: 1px solid var(--border-color);
          padding-top: 60px;
        }
        .footer-inner {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
          padding-bottom: 48px;
        }
        .footer-tagline {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-top: 14px;
          max-width: 320px;
          line-height: 1.6;
        }
        .footer-col {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }
        .footer-col a, .footer-col span {
          font-size: 0.875rem;
          color: var(--text-secondary);
          transition: var(--transition);
        }
        .footer-col a:hover {
          color: var(--primary);
        }
        .footer-bottom {
          border-top: 1px solid var(--border-color);
          padding: 20px 0;
          background: #F8FAFC;
        }
        .footer-bottom-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.825rem;
          color: var(--text-muted);
          flex-wrap: wrap;
          gap: 12px;
        }

        /* Responsive Breakpoints */
        @media (max-width: 900px) {
          .desktop-nav-links, .desktop-nav-actions { display: none; }
          .mobile-menu-btn { display: block; }
          .hero-headline { font-size: 2.6rem; }
          .benefits-wrap { grid-template-columns: 1fr; }
          .footer-inner { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .hero-headline { font-size: 2.1rem; }
          .footer-inner { grid-template-columns: 1fr; }
          .mockup-dashboard-body { padding: 16px; }
        }
      `}</style>
    </div>
  );
}
