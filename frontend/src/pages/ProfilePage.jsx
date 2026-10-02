import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { User, Lock, Wallet, Save, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile, currencySymbol } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: user?.fullName || user?.name || '',
    currency: user?.currency || 'INR',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  // Password form
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState(null);

  const handleProfileChange = (e) => setProfileForm({ ...profileForm, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);
    try {
      await updateProfile({
        fullName: profileForm.name.trim(),
        name: profileForm.name.trim(),
        currency: profileForm.currency,
      });
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message || 'Update failed' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePassChange = (e) => setPassForm({ ...passForm, [e.target.name]: e.target.value });

  const handlePassSubmit = async (e) => {
    e.preventDefault();
    setPassMsg(null);
    if (passForm.newPassword.length < 6) {
      setPassMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (passForm.newPassword !== passForm.confirmPassword) {
      setPassMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    setPassLoading(true);
    try {
      await userService.changePassword({
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
      });
      setPassMsg({ type: 'success', text: 'Password changed successfully!' });
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPassMsg({ type: 'error', text: err.response?.data?.message || err.message || 'Password change failed' });
    } finally {
      setPassLoading(false);
    }
  };

  const toggleShowPass = (field) => setShowPass(p => ({ ...p, [field]: !p[field] }));

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <div className="page-wrapper">

          <div className="page-header">
            <div>
              <h1 className="page-title">Profile Settings</h1>
              <p className="page-subtitle">Manage your account information and preferences</p>
            </div>
          </div>

          <div className="profile-layout">
            {/* Sidebar Card */}
            <div className="profile-sidebar-card card">
              <div className="profile-avatar">
                <div className="avatar-circle">
                  {(user?.fullName || user?.name || 'U').charAt(0).toUpperCase()}
                </div>
                <h3 className="profile-name">{user?.fullName || user?.name || 'User'}</h3>
                <p className="profile-email">{user?.email}</p>
                {user?.role === 'ADMIN' && (
                  <span className="badge badge-purple" style={{ marginTop: 8 }}>Admin</span>
                )}
              </div>

              <div className="profile-nav">
                {[
                  { key: 'profile', label: 'Profile Info', icon: User },
                  { key: 'password', label: 'Change Password', icon: Lock },
                  { key: 'preferences', label: 'Preferences', icon: Wallet },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    className={`profile-nav-btn ${activeTab === key ? 'active' : ''}`}
                    onClick={() => setActiveTab(key)}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="profile-main">
              {activeTab === 'profile' && (
                <div className="card profile-form-card">
                  <h2 className="form-section-title">
                    <User size={18} /> Personal Information
                  </h2>
                  {profileMsg && (
                    <div className={`form-message ${profileMsg.type}`}>
                      {profileMsg.type === 'success' && <CheckCircle size={15} />}
                      {profileMsg.text}
                    </div>
                  )}
                  <form onSubmit={handleProfileSubmit}>
                    <div className="input-group">
                      <label className="input-label">Full Name</label>
                      <input
                        id="profile-name"
                        name="name"
                        type="text"
                        className="input-field"
                        value={profileForm.name}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Email Address</label>
                      <input
                        type="email"
                        className="input-field"
                        value={user?.email || ''}
                        disabled
                        style={{ opacity: 0.6, cursor: 'not-allowed' }}
                      />
                      <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: 4 }}>Email cannot be changed</span>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Currency</label>
                      <select
                        id="profile-currency"
                        name="currency"
                        className="input-field"
                        value={profileForm.currency}
                        onChange={handleProfileChange}
                      >
                        <option value="INR">🇮🇳 INR – Indian Rupee (₹)</option>
                        <option value="USD">🇺🇸 USD – US Dollar ($)</option>
                        <option value="EUR">🇪🇺 EUR – Euro (€)</option>
                        <option value="GBP">🇬🇧 GBP – British Pound (£)</option>
                      </select>
                    </div>
                    <button id="save-profile-btn" type="submit" className="btn btn-primary" disabled={profileLoading}>
                      {profileLoading ? <span className="btn-spinner" /> : <Save size={15} />}
                      {profileLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'password' && (
                <div className="card profile-form-card">
                  <h2 className="form-section-title">
                    <Lock size={18} /> Change Password
                  </h2>
                  {passMsg && (
                    <div className={`form-message ${passMsg.type}`}>
                      {passMsg.type === 'success' && <CheckCircle size={15} />}
                      {passMsg.text}
                    </div>
                  )}
                  <form onSubmit={handlePassSubmit}>
                    {[
                      { name: 'currentPassword', label: 'Current Password', key: 'current' },
                      { name: 'newPassword', label: 'New Password', key: 'new' },
                      { name: 'confirmPassword', label: 'Confirm New Password', key: 'confirm' },
                    ].map(({ name, label, key }) => (
                      <div className="input-group" key={name}>
                        <label className="input-label">{label}</label>
                        <div className="input-icon-wrap">
                          <input
                            id={`pass-${key}`}
                            name={name}
                            type={showPass[key] ? 'text' : 'password'}
                            className="input-field input-with-end-icon"
                            value={passForm[name]}
                            onChange={handlePassChange}
                            required
                            placeholder="••••••••"
                          />
                          <button type="button" className="input-end-btn" onClick={() => toggleShowPass(key)}>
                            {showPass[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    ))}
                    <button id="change-pass-btn" type="submit" className="btn btn-primary" disabled={passLoading}>
                      {passLoading ? <span className="btn-spinner" /> : <Lock size={15} />}
                      {passLoading ? 'Changing...' : 'Change Password'}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="card profile-form-card">
                  <h2 className="form-section-title">
                    <Wallet size={18} /> Account Preferences
                  </h2>
                  <div className="pref-row">
                    <div>
                      <span className="pref-label">Member Since</span>
                      <span className="pref-value">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                          : 'N/A'
                        }
                      </span>
                    </div>
                  </div>
                  <div className="pref-row">
                    <div>
                      <span className="pref-label">Currency</span>
                      <span className="pref-value">{user?.currency || 'INR'} ({currencySymbol})</span>
                    </div>
                  </div>
                  <div className="pref-row">
                    <div>
                      <span className="pref-label">Account Role</span>
                      <span className="pref-value">{user?.role || 'USER'}</span>
                    </div>
                  </div>
                  <div className="pref-row">
                    <div>
                      <span className="pref-label">Account Status</span>
                      <span className="badge badge-success">Active</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .page-header { margin-bottom: 24px; }
        .page-title { font-size: 1.6rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; }
        .page-subtitle { font-size: 0.875rem; color: var(--text-secondary); margin-top: 4px; }
        .profile-layout { display: grid; grid-template-columns: 260px 1fr; gap: 20px; align-items: start; }
        @media (max-width: 800px) { .profile-layout { grid-template-columns: 1fr; } }
        .profile-sidebar-card { padding: 28px 20px; display: flex; flex-direction: column; gap: 24px; }
        .profile-avatar { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .avatar-circle {
          width: 72px; height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary) 0%, #059669 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem; font-weight: 800; color: #fff;
          box-shadow: 0 6px 18px rgba(16,185,129,0.35);
        }
        .profile-name { font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-top: 4px; }
        .profile-email { font-size: 0.8rem; color: var(--text-muted); }
        .profile-nav { display: flex; flex-direction: column; gap: 4px; }
        .profile-nav-btn {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 14px; border-radius: var(--radius-md);
          font-size: 0.9rem; font-weight: 600; color: var(--text-secondary);
          transition: var(--transition); text-align: left; cursor: pointer;
          background: none;
        }
        .profile-nav-btn:hover { background: var(--bg-subtle); color: var(--text-primary); }
        .profile-nav-btn.active { background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.1)); color: var(--primary-dark); }
        .profile-main {}
        .profile-form-card { padding: 28px; }
        .form-section-title { display: flex; align-items: center; gap: 10px; font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 24px; padding-bottom: 14px; border-bottom: 1px solid var(--border-color); }
        .form-message { display: flex; align-items: center; gap: 8px; padding: 12px 16px; border-radius: var(--radius-md); font-size: 0.875rem; font-weight: 500; margin-bottom: 18px; }
        .form-message.success { background: var(--primary-light); color: var(--primary-dark); border: 1px solid #A7F3D0; }
        .form-message.error { background: var(--accent-red-light); color: #B91C1C; border: 1px solid #FECACA; }
        .btn-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4); border-top: 2px solid #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .input-icon-wrap { position: relative; }
        .input-end-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); display: flex; align-items: center; background: none; transition: color 0.2s; }
        .input-end-btn:hover { color: var(--text-primary); }
        .input-with-end-icon { padding-right: 40px; }
        .pref-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--border-color); }
        .pref-row:last-child { border-bottom: none; }
        .pref-label { display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); }
        .pref-value { display: block; font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-top: 2px; }
      `}</style>
    </div>
  );
}
