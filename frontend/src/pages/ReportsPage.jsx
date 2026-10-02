import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/api';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { KpiCard } from '../components/KpiCard';
import { TrendingUp, TrendingDown, Wallet, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';

const PIE_COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899', '#F97316'];

export default function ReportsPage() {
  const { formatCurrency } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const loadReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reportService.getReport(year, month);
      if (res.success) setReport(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => { loadReport(); }, [loadReport]);

  const handlePrev = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const handleNext = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const monthName = new Date(year, month - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const categoryData = report?.categoryExpenses || report?.categoryBreakdown || [];
  const dailyData = report?.dailyExpenses || [];
  const topExpenses = report?.topExpenses || [];

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <div className="page-wrapper">

          {/* Header with Month Nav */}
          <div className="page-header">
            <div>
              <h1 className="page-title">Reports</h1>
              <p className="page-subtitle">Monthly financial breakdown & insights</p>
            </div>
            <div className="month-nav">
              <button className="btn btn-secondary btn-icon" onClick={handlePrev}>
                <ChevronLeft size={16} />
              </button>
              <span className="month-label">{monthName}</span>
              <button className="btn btn-secondary btn-icon" onClick={handleNext} disabled={year === now.getFullYear() && month === now.getMonth() + 1}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="reports-loading">
              {[1, 2, 3, 4].map(i => <div key={i} className="skeleton-card" style={{ height: 120 }} />)}
            </div>
          ) : !report ? (
            <div className="card empty-state-card">
              <BarChart3 size={40} color="#CBD5E1" />
              <h3>No data for {monthName}</h3>
              <p>Start adding transactions to see your monthly report here.</p>
            </div>
          ) : (
            <>
              {/* KPI Summary */}
              <div className="report-kpi-grid">
                <KpiCard title="Total Income" value={formatCurrency(report.totalIncome)} icon={TrendingUp} color="primary" />
                <KpiCard title="Total Expenses" value={formatCurrency(report.totalExpenses)} icon={TrendingDown} color="red" />
                <KpiCard title="Net Savings" value={formatCurrency(report.netSavings)}
                  icon={Wallet}
                  color={(report.netSavings || 0) >= 0 ? 'primary' : 'red'}
                  trendType={(report.netSavings || 0) >= 0 ? 'positive' : 'negative'}
                />
                <KpiCard title="Savings Rate"
                  value={`${report.totalIncome > 0 ? Math.round((report.netSavings / report.totalIncome) * 100) : 0}%`}
                  icon={BarChart3} color="blue"
                  subtitle="of income saved"
                />
              </div>

              <div className="report-charts-row">
                {/* Category Pie */}
                <div className="card report-chart-card">
                  <h3 className="chart-title">Expenses by Category</h3>
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          dataKey="amount"
                          nameKey="category"
                          cx="50%" cy="50%"
                          innerRadius={60} outerRadius={100}
                          paddingAngle={3}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {categoryData.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => [formatCurrency(v)]} />
                        <Legend iconType="circle" iconSize={8} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : <EmptyChart label="No expense data" />}
                </div>

                {/* Top Expenses */}
                <div className="card report-chart-card">
                  <h3 className="chart-title">Top Transactions</h3>
                  {topExpenses.length === 0 ? (
                    <EmptyChart label="No data" />
                  ) : (
                    <div className="top-expense-list">
                      {topExpenses.map((txn, i) => (
                        <div key={i} className="top-expense-row">
                          <div className="top-expense-rank">#{i + 1}</div>
                          <div className="top-expense-info">
                            <span className="top-expense-desc">{txn.description || txn.category}</span>
                            <span className="top-expense-cat">{txn.category} · {formatDate(txn.date || txn.transactionDate)}</span>
                          </div>
                          <span className="top-expense-amt">{formatCurrency(txn.amount)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Daily Trend */}
              <div className="card report-chart-wide">
                <h3 className="chart-title">Daily Spending Trend</h3>
                {dailyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={dailyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false}
                        tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                      />
                      <Tooltip
                        contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12 }}
                        formatter={v => [formatCurrency(v), 'Expenses']}
                      />
                      <Bar dataKey="amount" fill="#10B981" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <EmptyChart label="No daily data available" />}
              </div>

              {/* Category Bar Chart */}
              {categoryData.length > 0 && (
                <div className="card report-chart-wide">
                  <h3 className="chart-title">Category Comparison</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false}
                        tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                      />
                      <YAxis type="category" dataKey="category" tick={{ fontSize: 12, fill: '#475569', fontWeight: 600 }} axisLine={false} tickLine={false} width={80} />
                      <Tooltip formatter={v => [formatCurrency(v)]} />
                      <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
                        {categoryData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; gap: 16px; flex-wrap: wrap; }
        .page-title { font-size: 1.6rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; }
        .page-subtitle { font-size: 0.875rem; color: var(--text-secondary); margin-top: 4px; }
        .month-nav { display: flex; align-items: center; gap: 12px; }
        .month-label { font-size: 0.95rem; font-weight: 700; color: var(--text-primary); min-width: 160px; text-align: center; }
        .report-kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-bottom: 24px; }
        @media (max-width: 1100px) { .report-kpi-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .report-kpi-grid { grid-template-columns: 1fr; } }
        .report-charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 18px; }
        @media (max-width: 900px) { .report-charts-row { grid-template-columns: 1fr; } }
        .report-chart-card { padding: 22px; }
        .report-chart-wide { padding: 22px; margin-bottom: 18px; }
        .chart-title { font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 18px; }
        .top-expense-list { display: flex; flex-direction: column; gap: 2px; }
        .top-expense-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border-color); }
        .top-expense-row:last-child { border-bottom: none; }
        .top-expense-rank { width: 24px; height: 24px; border-radius: 50%; background: var(--bg-subtle); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); flex-shrink: 0; }
        .top-expense-info { flex: 1; min-width: 0; }
        .top-expense-desc { display: block; font-size: 0.9rem; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .top-expense-cat { display: block; font-size: 0.775rem; color: var(--text-muted); margin-top: 2px; }
        .top-expense-amt { font-size: 0.95rem; font-weight: 700; color: var(--accent-red); white-space: nowrap; }
        .empty-chart { display: flex; align-items: center; justify-content: center; height: 200px; color: var(--text-muted); font-size: 0.875rem; }
        .empty-state-card { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 60px 40px; text-align: center; }
        .empty-state-card h3 { font-size: 1.1rem; font-weight: 700; }
        .empty-state-card p { font-size: 0.9rem; color: var(--text-secondary); max-width: 340px; line-height: 1.6; }
        .reports-loading { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-bottom: 24px; }
        .skeleton-card { border-radius: var(--radius-lg); background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>
    </div>
  );
}

function EmptyChart({ label }) {
  return <div className="empty-chart">{label}</div>;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
