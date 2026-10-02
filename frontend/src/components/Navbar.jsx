import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/api';
import { 
  Bell, 
  Search, 
  User, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  X, 
  CheckCheck,
  TrendingUp,
  AlertTriangle,
  Info
} from 'lucide-react';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout, formatCurrency } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getAll();
      if (res.success && res.data) {
        setNotifications(res.data);
      }
      const countRes = await notificationService.getUnreadCount();
      if (countRes.success && countRes.data) {
        setUnreadCount(countRes.data.unreadCount || 0);
      }
    } catch (err) {
      console.warn('Failed to load notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/transactions?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="navbar-container">
      <div className="navbar-left">
        <button 
          className="btn-icon mobile-menu-btn" 
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
        >
          <Menu size={22} color="#475569" />
        </button>

        <form onSubmit={handleSearchSubmit} className="search-bar-form">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search expenses, budgets or goals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="navbar-search-input"
          />
        </form>
      </div>

      <div className="navbar-right">
        {/* Month Indicator / Badge */}
        <div className="date-pill">
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>

        {/* Notifications Dropdown */}
        <div className="dropdown-wrapper" ref={notifRef}>
          <button 
            className="btn-icon notif-bell-btn" 
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <Bell size={20} color="#475569" />
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="dropdown-menu notifications-menu">
              <div className="menu-header">
                <div>
                  <h4 style={{ fontSize: '0.95rem' }}>Notifications</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {unreadCount} unread
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllRead} 
                    className="mark-all-read-btn"
                  >
                    <CheckCheck size={14} /> Mark all read
                  </button>
                )}
              </div>

              <div className="notification-list">
                {notifications.length === 0 ? (
                  <div className="empty-state-small">
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`notification-item ${!notif.isRead ? 'unread' : ''}`}
                      onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                    >
                      <div className={`notif-icon-circle ${notif.type.toLowerCase()}`}>
                        {notif.type === 'ALERT' ? (
                          <AlertTriangle size={15} color="#EF4444" />
                        ) : notif.type === 'WARNING' ? (
                          <AlertTriangle size={15} color="#F59E0B" />
                        ) : notif.type === 'SUCCESS' ? (
                          <TrendingUp size={15} color="#10B981" />
                        ) : (
                          <Info size={15} color="#3B82F6" />
                        )}
                      </div>
                      <div className="notif-text">
                        <h5>{notif.title}</h5>
                        <p>{notif.message}</p>
                        <span className="notif-time">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="dropdown-wrapper" ref={profileRef}>
          <button 
            className="user-profile-trigger" 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <img 
              src={user?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"} 
              alt={user?.fullName || "User"} 
              className="user-avatar-img"
            />
            <div className="user-details-nav">
              <span className="user-name-nav">{user?.fullName || 'User'}</span>
              <span className="user-role-nav">{user?.role || 'USER'}</span>
            </div>
          </button>

          {showProfileMenu && (
            <div className="dropdown-menu profile-menu">
              <div className="profile-menu-header">
                <strong>{user?.fullName}</strong>
                <span>{user?.email}</span>
                {user?.role === 'ADMIN' && (
                  <span className="badge badge-purple" style={{ marginTop: '6px' }}>Admin</span>
                )}
              </div>
              <div className="profile-menu-items">
                <Link 
                  to="/profile" 
                  className="profile-menu-link" 
                  onClick={() => setShowProfileMenu(false)}
                >
                  <User size={16} /> My Profile
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link 
                    to="/admin" 
                    className="profile-menu-link" 
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <ShieldCheck size={16} color="#8B5CF6" /> Admin Portal
                  </Link>
                )}
                <button 
                  onClick={() => { setShowProfileMenu(false); logout(); navigate('/login'); }} 
                  className="profile-menu-link logout-btn"
                >
                  <LogOut size={16} color="#EF4444" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .navbar-container {
          height: 72px;
          background: #FFFFFF;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          position: sticky;
          top: 0;
          z-index: 99;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .navbar-left {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
          max-width: 500px;
        }
        .mobile-menu-btn {
          display: none;
          background: #F1F5F9;
        }
        @media (max-width: 992px) {
          .mobile-menu-btn {
            display: inline-flex;
          }
          .navbar-container {
            padding: 0 16px;
          }
        }
        .search-bar-form {
          position: relative;
          width: 100%;
        }
        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }
        .navbar-search-input {
          width: 100%;
          padding: 10px 14px 10px 42px;
          background: #F8FAFC;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          color: var(--text-primary);
          outline: none;
          transition: var(--transition);
        }
        .navbar-search-input:focus {
          border-color: var(--primary);
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
        }
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .date-pill {
          background: #F8FAFC;
          border: 1px solid var(--border-color);
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 0.825rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        @media (max-width: 600px) {
          .date-pill {
            display: none;
          }
        }
        .dropdown-wrapper {
          position: relative;
        }
        .notif-bell-btn {
          background: #F8FAFC;
          border: 1px solid var(--border-color);
          position: relative;
        }
        .notif-bell-btn:hover {
          background: #F1F5F9;
        }
        .notif-badge {
          position: absolute;
          top: -3px;
          right: -3px;
          background: var(--accent-red);
          color: #FFF;
          font-size: 0.65rem;
          font-weight: 700;
          height: 18px;
          min-width: 18px;
          padding: 0 4px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #FFF;
        }
        .user-profile-trigger {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 8px;
          border-radius: var(--radius-md);
          transition: var(--transition);
        }
        .user-profile-trigger:hover {
          background: #F8FAFC;
        }
        .user-avatar-img {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--primary-light);
        }
        .user-details-nav {
          display: flex;
          flex-direction: column;
          text-align: left;
        }
        .user-name-nav {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
        }
        .user-role-nav {
          font-size: 0.725rem;
          color: var(--text-muted);
        }
        @media (max-width: 640px) {
          .user-details-nav {
            display: none;
          }
        }
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          background: #FFFFFF;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
          box-shadow: 0 14px 35px -5px rgba(0, 0, 0, 0.15);
          width: 320px;
          z-index: 200;
          overflow: hidden;
          animation: scaleUp 0.15s ease-out;
        }
        .profile-menu {
          width: 230px;
        }
        .menu-header {
          padding: 14px 18px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #F8FAFC;
        }
        .mark-all-read-btn {
          font-size: 0.75rem;
          color: var(--primary);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .mark-all-read-btn:hover {
          text-decoration: underline;
        }
        .notification-list {
          max-height: 360px;
          overflow-y: auto;
        }
        .notification-item {
          padding: 12px 16px;
          display: flex;
          gap: 12px;
          border-bottom: 1px solid #F1F5F9;
          cursor: pointer;
          transition: var(--transition);
        }
        .notification-item:hover {
          background: #F8FAFC;
        }
        .notification-item.unread {
          background: #F0FDF4;
        }
        .notif-icon-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .notif-icon-circle.alert { background: var(--accent-red-light); }
        .notif-icon-circle.warning { background: var(--accent-gold-light); }
        .notif-icon-circle.success { background: var(--primary-light); }
        .notif-icon-circle.info { background: var(--accent-blue-light); }
        .notif-text h5 {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 2px;
        }
        .notif-text p {
          font-size: 0.775rem;
          color: var(--text-secondary);
          line-height: 1.35;
        }
        .notif-time {
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-top: 4px;
          display: block;
        }
        .empty-state-small {
          padding: 30px;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.875rem;
        }
        .profile-menu-header {
          padding: 16px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          font-size: 0.85rem;
        }
        .profile-menu-header span {
          color: var(--text-muted);
          font-size: 0.75rem;
        }
        .profile-menu-items {
          padding: 8px;
        }
        .profile-menu-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
          width: 100%;
          text-align: left;
          transition: var(--transition);
        }
        .profile-menu-link:hover {
          background: #F1F5F9;
          color: var(--text-primary);
        }
        .profile-menu-link.logout-btn:hover {
          background: #FEE2E2;
          color: #DC2626;
        }
      `}</style>
    </header>
  );
};
