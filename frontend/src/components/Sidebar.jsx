import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  ReceiptText, 
  PieChart, 
  Target, 
  BarChart3, 
  User, 
  ShieldCheck, 
  LogOut,
  X,
  Wallet
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/transactions', label: 'Expenses', icon: ReceiptText },
    { to: '/budgets', label: 'Budgets', icon: PieChart },
    { to: '/goals', label: 'Financial Goals', icon: Target },
    { to: '/reports', label: 'Reports', icon: BarChart3 },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  if (isAdmin) {
    navLinks.push({ to: '/admin', label: 'Admin Portal', icon: ShieldCheck });
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand-header">
          <div className="brand-logo-wrap">
            <div className="brand-icon-box">
              <Wallet size={22} color="#FFFFFF" />
            </div>
            <div className="brand-text">
              <h2>MoneyMate</h2>
              <span className="brand-sub">FINANCE MANAGER</span>
            </div>
          </div>
          <button className="sidebar-close-btn" onClick={onClose}>
            <X size={20} color="#64748B" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="sidebar-nav">
          <span className="nav-group-title">MAIN MENU</span>
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => onClose && onClose()}
              >
                <Icon size={20} className="sidebar-link-icon" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-sidebar-btn">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        <style>{`
          .sidebar-container {
            width: 250px;
            background: #FFFFFF;
            border-right: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            position: sticky;
            top: 0;
            height: 100vh;
            z-index: 100;
            transition: var(--transition);
          }
          .sidebar-brand-header {
            height: 72px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 24px;
            border-bottom: 1px solid var(--border-color);
          }
          .brand-logo-wrap {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .brand-icon-box {
            width: 38px;
            height: 38px;
            border-radius: 10px;
            background: linear-gradient(135deg, var(--primary) 0%, #059669 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(16, 185, 129, 0.35);
          }
          .brand-text h2 {
            font-size: 1.15rem;
            font-weight: 800;
            color: var(--text-primary);
            letter-spacing: -0.02em;
            line-height: 1.1;
          }
          .brand-sub {
            font-size: 0.625rem;
            font-weight: 700;
            color: var(--primary);
            letter-spacing: 0.1em;
          }
          .sidebar-close-btn {
            display: none;
            background: none;
            cursor: pointer;
          }
          .sidebar-nav {
            padding: 24px 16px;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 6px;
            overflow-y: auto;
          }
          .nav-group-title {
            font-size: 0.7rem;
            font-weight: 700;
            color: var(--text-muted);
            letter-spacing: 0.08em;
            padding: 0 12px 10px 12px;
          }
          .sidebar-link {
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 12px 16px;
            border-radius: var(--radius-md);
            font-size: 0.925rem;
            font-weight: 600;
            color: var(--text-secondary);
            transition: var(--transition);
            text-decoration: none;
          }
          .sidebar-link:hover {
            background: #F8FAFC;
            color: var(--text-primary);
          }
          .sidebar-link.active {
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.12) 100%);
            color: var(--primary-dark);
            border-left: 4px solid var(--primary);
          }
          .sidebar-link.active .sidebar-link-icon {
            color: var(--primary);
          }
          .sidebar-link-icon {
            color: #64748B;
            transition: var(--transition);
          }
          .sidebar-footer {
            padding: 16px;
            border-top: 1px solid var(--border-color);
          }
          .logout-sidebar-btn {
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
            padding: 12px 16px;
            border-radius: var(--radius-md);
            font-size: 0.9rem;
            font-weight: 600;
            color: #EF4444;
            background: #FEF2F2;
            transition: var(--transition);
            cursor: pointer;
            border: 1px solid #FEE2E2;
          }
          .logout-sidebar-btn:hover {
            background: #FEE2E2;
            color: #DC2626;
            transform: translateY(-1px);
          }
          .sidebar-backdrop {
            display: none;
          }

          @media (max-width: 992px) {
            .sidebar-container {
              position: fixed;
              left: -260px;
              top: 0;
              bottom: 0;
              height: 100%;
              box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            }
            .sidebar-container.open {
              left: 0;
            }
            .sidebar-close-btn {
              display: block;
            }
            .sidebar-backdrop {
              display: block;
              position: fixed;
              inset: 0;
              background: rgba(15, 23, 42, 0.4);
              backdrop-filter: blur(4px);
              z-index: 99;
            }
          }
        `}</style>
      </aside>
    </>
  );
};
