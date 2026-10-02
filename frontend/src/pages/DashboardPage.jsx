import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardService, transactionService } from '../services/api';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { KpiCard } from '../components/KpiCard';
import { TransactionModal } from '../components/TransactionModal';
import {
  TrendingUp, TrendingDown, Wallet, Target,
  Plus, ArrowUpRight, ArrowDownRight, RefreshCw
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const PIE_COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899'];

export default function DashboardPage() {
  const { user, formatCurrency } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [summary, setSummary] = useState(null);
  const [recentTxns, setRecentTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryRes, txnRes] = await Promise.all([
        dashboardService.getSummary(),
        transactionService.getAll({ page: 0, size: 5, sort: 'date,desc' }),
      ]);
      if (summaryRes.success) setSummary(summaryRes.data);
      if (txnRes.success) setRecentTxns(txnRes.data?.content || txnRes.data || []);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const monthlyData = summary?.monthlyTrends || summary?.monthlyOverview || [];
  const categoryBreakdown = summary?.categoryExpenses || summary?.categoryBreakdown || [];

  const kpis = [
    {
      title: 'Total Balance',
      value: formatCurrency(summary?.totalBalance),
      subtitle: 'Net worth this month',
      icon: Wallet,
      color: 'primary',
      trend: summary?.balanceTrend ? `${summary.balanceTrend > 0 ? '+' : ''}${summary.balanceTrend}%` : null,
      trendType: (summary?.balanceTrend || 0) >= 0 ? 'positive' : 'negative',
    },
    {
      title: 'Total Income',
      value: formatCurrency(summary?.totalIncome),
      subtitle: 'This month',
      icon: TrendingUp,
      color: 'primary',
      trend: '↑ Income',
      trendType: 'positive',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(summary?.totalExpenses),
      subtitle: 'This month',
      icon: TrendingDown,
      color: 'red',
      trend: '↓ Spending',
      trendType: 'negative',
    },
    {
      title: 'Active Goals',
      value: summary?.activeGoals ?? summary?.activeGoalsCount ?? '–',
      subtitle: 'In progress',
      icon: Target,
      color: 'purple',
    },
  ];

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <div className="page-wrapper">

          {/* Header */}
          <div className="page-header">
            <div>
              <h1 className="page-title">
                Good {getGreeting()}, {(user?.fullName || user?.name || 'there').split(' ')[0]} 👋
              </h1>
              <p className="page-subtitle">Here's your financial overview for today.</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary btn-sm" onClick={loadData} title="Refresh">
                <RefreshCw size={15} />
                <span>Refresh</span>
              </button>
              <button id="dashboard-add-txn" className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
                <Plus size={15} />
                <span>Add Transaction</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[1,2,3,4].map(i => <div key={i} className="skeleton-card" />)}
            </div>
          ) : (
            <>
              {/* KPI Grid */}
              <div className="kpi-grid">
                {kpis.map((k) => (
                  <KpiCard key={k.title} {...k} />
                ))}
              </div>

              {/* Charts Row */}
              <div className="charts-row">
                {/* Area Chart */}
                <div className="card chart-card">
                  <div className="chart-header">
                    <h3>Income vs Expenses</h3>
                    <span className="chart-badge">Last 6 months</span>
                  </div>
                  {monthlyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={60}
                          tickFormatter={(v) => `${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`}
                        />
                        <Tooltip
                          contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                          formatter={(v, name) => [formatCurrency(v), name === 'income' ? 'Income' : 'Expenses']}
                        />
                        <Area type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2.5} fill="url(#incomeGrad)" />
                        <Area type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2.5} fill="url(#expenseGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyChart label="No monthly data available" />
                  )}
                </div>

                {/* Pie Chart */}
                <div className="card chart-card chart-card-sm">
                  <div className="chart-header">
                    <h3>Spending by Category</h3>
                    <span className="chart-badge">This month</span>
                  </div>
                  {categoryBreakdown.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={categoryBreakdown}
                          dataKey="amount"
                          nameKey="category"
                          cx="50%" cy="50%"
                          innerRadius={55} outerRadius={85}
                          paddingAngle={3}
                        >
                          {categoryBreakdown.map((_, idx) => (
                            <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12 }}
                          formatter={(v) => [formatCurrency(v)]}
                        />
                        <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 12, color: '#475569' }}>{v}</span>} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyChart label="No expense data" />
                  )}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="card">
                <div className="section-header">
                  <h3>Recent Transactions</h3>
                  <a href="/transactions" className="section-link">View all →</a>
                </div>
                {recentTxns.length === 0 ? (
                  <div className="empty-state">
                    <Wallet size={36} color="#CBD5E1" />
                    <p>No transactions yet. Add your first one!</p>
                  </div>
                ) : (
                  <div className="txn-list">
                    {recentTxns.map((txn) => (
                      <div key={txn.id} className="txn-row">
                        <div className="txn-icon-wrap" style={{
                          background: txn.type === 'INCOME' ? 'var(--primary-light)' : 'var(--accent-red-light)'
                        }}>
                          {txn.type === 'INCOME'
                            ? <ArrowUpRight size={16} color="var(--primary)" />
                            : <ArrowDownRight size={16} color="var(--accent-red)" />
                          }
                        </div>
                        <div className="txn-info">
                          <span className="txn-desc">{txn.description || txn.category}</span>
                          <span className="txn-meta">{txn.category} · {formatDate(txn.date || txn.transactionDate)}</span>
                        </div>
                        <span className={`txn-amount ${txn.type === 'INCOME' ? 'income' : 'expense'}`}>
                          {txn.type === 'INCOME' ? '+' : '-'}{formatCurrency(txn.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {showAddModal && (
        <TransactionModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => { setShowAddModal(false); loadData(); }}
        />
      )}

      <style>{`
        .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; gap: 16px; flex-wrap: wrap; }
        .page-title { font-size: 1.6rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; }
        .page-subtitle { font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px; }
        .btn-sm { padding: 8px 16px; font-size: 0.875rem; }
        .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-bottom: 24px; }
        @media (max-width: 1100px) { .kpi-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .kpi-grid { grid-template-columns: 1fr; } }
        .charts-row { display: grid; grid-template-columns: 1fr 340px; gap: 18px; margin-bottom: 24px; }
        @media (max-width: 1000px) { .charts-row { grid-template-columns: 1fr; } }
        .chart-card { padding: 22px; }
        .chart-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
        .chart-header h3 { font-size: 1rem; font-weight: 700; color: var(--text-primary); }
        .chart-badge { font-size: 0.75rem; font-weight: 600; color: var(--text-muted); background: var(--bg-subtle); padding: 3px 10px; border-radius: 9999px; border: 1px solid var(--border-color); }
        .section-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 22px 0; margin-bottom: 4px; }
        .section-header h3 { font-size: 1rem; font-weight: 700; }
        .section-link { font-size: 0.85rem; font-weight: 600; color: var(--primary); }
        .section-link:hover { text-decoration: underline; }
        .txn-list { padding: 8px 0; }
        .txn-row { display: flex; align-items: center; gap: 14px; padding: 12px 22px; transition: background 0.15s; border-bottom: 1px solid var(--border-color); }
        .txn-row:last-child { border-bottom: none; }
        .txn-row:hover { background: var(--bg-subtle); }
        .txn-icon-wrap { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .txn-info { flex: 1; min-width: 0; }
        .txn-desc { display: block; font-size: 0.9rem; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .txn-meta { display: block; font-size: 0.775rem; color: var(--text-muted); margin-top: 2px; }
        .txn-amount { font-size: 0.95rem; font-weight: 700; white-space: nowrap; }
        .txn-amount.income { color: var(--primary); }
        .txn-amount.expense { color: var(--accent-red); }
        .empty-state { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 40px; color: var(--text-muted); font-size: 0.9rem; }
        .loading-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
        .skeleton-card { height: 120px; border-radius: var(--radius-lg); background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .empty-chart { display: flex; align-items: center; justify-content: center; height: 220px; color: var(--text-muted); font-size: 0.875rem; }
      `}</style>
    </div>
  );
}

function EmptyChart({ label }) {
  return <div className="empty-chart">{label}</div>;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
