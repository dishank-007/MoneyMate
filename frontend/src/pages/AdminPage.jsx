import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/api';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { KpiCard } from '../components/KpiCard';
import { Users, ShieldCheck, UserX, UserCheck, Trash2, ToggleLeft, ToggleRight, TrendingUp } from 'lucide-react';

export default function AdminPage() {
  const { formatCurrency } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggleUser, setToggleUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getDashboard();
      if (res.success) setDashboard(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleToggle = async () => {
    setActionLoading(true);
    try {
      await adminService.toggleUserStatus(toggleUser.id);
      setToggleUser(null);
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await adminService.deleteUser(deleteUser.id);
      setDeleteUser(null);
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const users = dashboard?.users || [];
  const activeUsers = users.filter(u => u.active !== false).length;
  const totalTransactions = dashboard?.totalTransactions || 0;

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <div className="page-wrapper">

          <div className="page-header">
            <div>
              <h1 className="page-title">Admin Portal</h1>
              <p className="page-subtitle">System management and user administration</p>
            </div>
            <div className="admin-badge">
              <ShieldCheck size={14} />
              <span>Administrator</span>
            </div>
          </div>

          {/* KPIs */}
          <div className="admin-kpi-grid">
            <KpiCard title="Total Users" value={users.length} icon={Users} color="blue" />
            <KpiCard title="Active Users" value={activeUsers} icon={UserCheck} color="primary" />
            <KpiCard title="Inactive Users" value={users.length - activeUsers} icon={UserX} color="red" />
            <KpiCard title="Total Transactions" value={totalTransactions} icon={TrendingUp} color="purple" />
          </div>

          {/* Platform Stats */}
          {dashboard && (
            <div className="admin-stats-row">
              {[
                { label: 'Total Income (All Users)', value: formatCurrency(dashboard.totalIncome) },
                { label: 'Total Expenses (All Users)', value: formatCurrency(dashboard.totalExpenses) },
                { label: 'Platform Net Savings', value: formatCurrency((dashboard.totalIncome || 0) - (dashboard.totalExpenses || 0)) },
              ].map(({ label, value }) => (
                <div key={label} className="card admin-stat-card">
                  <span className="admin-stat-label">{label}</span>
                  <span className="admin-stat-value">{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* User Management Table */}
          <div className="card admin-table-card">
            <div className="admin-table-header">
              <h3>User Management</h3>
              <span className="badge badge-info">{users.length} users</span>
            </div>
            {loading ? (
              <div style={{ padding: 20 }}>
                {[1,2,3].map(i => <div key={i} className="skeleton-row" style={{ marginBottom: 10 }} />)}
              </div>
            ) : users.length === 0 ? (
              <div className="empty-state">
                <Users size={36} color="#CBD5E1" />
                <p>No users found.</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Currency</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, idx) => (
                      <tr key={u.id} className="admin-table-row">
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{idx + 1}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div className="user-mini-avatar">{(u.fullName || u.name || 'U').charAt(0).toUpperCase()}</div>
                            <span style={{ fontWeight: 600 }}>{u.fullName || u.name || '—'}</span>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{u.email}</td>
                        <td>
                          <span className={`badge ${u.role === 'ADMIN' ? 'badge-purple' : 'badge-info'}`}>
                            {u.role || 'USER'}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{u.currency || 'INR'}</td>
                        <td>
                          <span className={`badge ${u.active !== false ? 'badge-success' : 'badge-danger'}`}>
                            {u.active !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="admin-action-btns">
                            <button
                              className={`btn-icon ${u.active !== false ? 'action-warn' : 'action-primary'}`}
                              title={u.active !== false ? 'Deactivate' : 'Activate'}
                              onClick={() => setToggleUser(u)}
                              disabled={u.role === 'ADMIN'}
                            >
                              {u.active !== false ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                            </button>
                            <button
                              className="btn-icon action-delete"
                              title="Delete User"
                              onClick={() => setDeleteUser(u)}
                              disabled={u.role === 'ADMIN'}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {toggleUser && (
        <ConfirmDialog
          title={toggleUser.active !== false ? 'Deactivate User' : 'Activate User'}
          message={`${toggleUser.active !== false ? 'Deactivate' : 'Activate'} account for "${toggleUser.name}" (${toggleUser.email})?`}
          onConfirm={handleToggle}
          onCancel={() => setToggleUser(null)}
          confirmText={toggleUser.active !== false ? 'Deactivate' : 'Activate'}
          danger={toggleUser.active !== false}
          loading={actionLoading}
        />
      )}

      {deleteUser && (
        <ConfirmDialog
          title="Delete User"
          message={`Permanently delete user "${deleteUser.name}" (${deleteUser.email}) and all their data? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteUser(null)}
          confirmText="Delete Permanently"
          danger
          loading={actionLoading}
        />
      )}

      <style>{`
        .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; gap: 16px; flex-wrap: wrap; }
        .page-title { font-size: 1.6rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; }
        .page-subtitle { font-size: 0.875rem; color: var(--text-secondary); margin-top: 4px; }
        .admin-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: var(--accent-purple-light); color: #5B21B6; font-size: 0.825rem; font-weight: 700; border-radius: 9999px; border: 1px solid #DDD6FE; }
        .admin-kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-bottom: 20px; }
        @media (max-width: 1100px) { .admin-kpi-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .admin-kpi-grid { grid-template-columns: 1fr; } }
        .admin-stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-bottom: 20px; }
        @media (max-width: 800px) { .admin-stats-row { grid-template-columns: 1fr; } }
        .admin-stat-card { padding: 18px 20px; display: flex; flex-direction: column; gap: 6px; }
        .admin-stat-label { font-size: 0.8rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
        .admin-stat-value { font-size: 1.3rem; font-weight: 800; color: var(--text-primary); }
        .admin-table-card { overflow: hidden; }
        .admin-table-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; border-bottom: 1px solid var(--border-color); }
        .admin-table-header h3 { font-size: 1rem; font-weight: 700; }
        .table-wrap { overflow-x: auto; }
        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table thead tr { background: var(--bg-subtle); }
        .admin-table th { padding: 11px 16px; font-size: 0.775rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; text-align: left; border-bottom: 1px solid var(--border-color); }
        .admin-table-row { border-bottom: 1px solid var(--border-color); transition: background 0.15s; }
        .admin-table-row:last-child { border-bottom: none; }
        .admin-table-row:hover { background: var(--bg-subtle); }
        .admin-table td { padding: 13px 16px; font-size: 0.9rem; vertical-align: middle; }
        .user-mini-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), #059669); display: flex; align-items: center; justify-content: center; font-size: 0.875rem; font-weight: 700; color: #fff; flex-shrink: 0; }
        .admin-action-btns { display: flex; align-items: center; justify-content: center; gap: 6px; }
        .action-warn { color: #B45309; background: var(--accent-gold-light); }
        .action-warn:hover { background: var(--accent-gold); color: #fff; }
        .action-primary { color: var(--primary); background: var(--primary-light); }
        .action-primary:hover { background: var(--primary); color: #fff; }
        .action-delete { color: var(--accent-red); background: var(--accent-red-light); }
        .action-delete:hover { background: var(--accent-red); color: #fff; }
        .btn-icon:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }
        .empty-state { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 60px; color: var(--text-muted); font-size: 0.9rem; }
        .skeleton-row { height: 52px; border-radius: var(--radius-sm); background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>
    </div>
  );
}
