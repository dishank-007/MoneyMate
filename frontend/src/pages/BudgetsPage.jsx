import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { budgetService } from '../services/api';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { BudgetModal } from '../components/BudgetModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { KpiCard } from '../components/KpiCard';
import { Plus, Edit2, Trash2, PieChart, AlertTriangle, CheckCircle } from 'lucide-react';

export default function BudgetsPage() {
  const { formatCurrency } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await budgetService.getAll();
      if (res.success) setBudgets(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDelete = async () => {
    try {
      await budgetService.delete(deleteItem.id);
      setDeleteItem(null);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const totalBudget = budgets.reduce((s, b) => s + (b.amount || 0), 0);
  const totalSpent = budgets.reduce((s, b) => s + (b.spentAmount ?? b.spent ?? 0), 0);
  const overBudgetCount = budgets.filter(b => (b.spentAmount ?? b.spent ?? 0) > (b.amount || 0)).length;
  const healthyCount = budgets.filter(b => (b.spentAmount ?? b.spent ?? 0) <= (b.amount || 0) * 0.8).length;

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <div className="page-wrapper">

          <div className="page-header">
            <div>
              <h1 className="page-title">Budgets</h1>
              <p className="page-subtitle">Manage your monthly spending limits</p>
            </div>
            <button id="add-budget-btn" className="btn btn-primary btn-sm" onClick={() => { setEditItem(null); setShowModal(true); }}>
              <Plus size={15} /> New Budget
            </button>
          </div>

          {/* Summary KPIs */}
          <div className="budget-kpi-row">
            <KpiCard title="Total Budget" value={formatCurrency(totalBudget)} icon={PieChart} color="primary" subtitle="This month" />
            <KpiCard title="Total Spent" value={formatCurrency(totalSpent)} icon={PieChart} color="red"
              progress={totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0}
              subtitle={`${totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}% of budget`}
            />
            <KpiCard title="Over Budget" value={overBudgetCount} icon={AlertTriangle} color="red" subtitle="Categories exceeded" />
            <KpiCard title="On Track" value={healthyCount} icon={CheckCircle} color="primary" subtitle="Healthy categories" />
          </div>

          {/* Budget Cards Grid */}
          {loading ? (
            <div className="budget-grid">
              {[1,2,3,4].map(i => <div key={i} className="skeleton-card" style={{ height: 180 }} />)}
            </div>
          ) : budgets.length === 0 ? (
            <div className="card empty-state-card">
              <PieChart size={40} color="#CBD5E1" />
              <h3>No budgets yet</h3>
              <p>Set spending limits for different categories to keep your finances in check.</p>
              <button className="btn btn-primary" onClick={() => { setEditItem(null); setShowModal(true); }}>
                <Plus size={15} /> Create Your First Budget
              </button>
            </div>
          ) : (
            <div className="budget-grid">
              {budgets.map(budget => {
                const spent = budget.spentAmount ?? budget.spent ?? 0;
                const amount = budget.amount || 0;
                const pct = amount > 0 ? Math.min(100, (spent / amount) * 100) : 0;
                const isOver = spent > amount;
                const isWarning = !isOver && pct >= 80;
                const remaining = amount - spent;

                let barColor = 'var(--primary)';
                if (isOver) barColor = 'var(--accent-red)';
                else if (isWarning) barColor = 'var(--accent-gold)';

                return (
                  <div key={budget.id} className={`card budget-card ${isOver ? 'over' : isWarning ? 'warning' : ''}`}>
                    <div className="budget-card-header">
                      <div className="budget-cat-icon" style={{ background: isOver ? 'var(--accent-red-light)' : 'var(--primary-light)' }}>
                        <PieChart size={18} color={isOver ? 'var(--accent-red)' : 'var(--primary)'} />
                      </div>
                      <div className="budget-card-actions">
                        {isOver && (
                          <span className="badge badge-danger">Over Budget</span>
                        )}
                        {isWarning && !isOver && (
                          <span className="badge badge-warning">Near Limit</span>
                        )}
                        <button className="btn-icon action-edit" onClick={() => { setEditItem(budget); setShowModal(true); }}>
                          <Edit2 size={13} />
                        </button>
                        <button className="btn-icon action-delete" onClick={() => setDeleteItem(budget)}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <h4 className="budget-category">{budget.category}</h4>
                    <div className="budget-amounts">
                      <span className="budget-spent">{formatCurrency(spent)}</span>
                      <span className="budget-divider">of</span>
                      <span className="budget-limit">{formatCurrency(amount)}</span>
                    </div>

                    <div className="budget-progress-track">
                      <div className="budget-progress-bar" style={{ width: `${pct}%`, background: barColor }} />
                    </div>

                    <div className="budget-footer">
                      <span className="budget-pct" style={{ color: isOver ? 'var(--accent-red)' : isWarning ? '#B45309' : 'var(--text-muted)' }}>
                        {Math.round(pct)}% used
                      </span>
                      <span className={`budget-remaining ${isOver ? 'over' : ''}`}>
                        {isOver ? `${formatCurrency(Math.abs(remaining))} over` : `${formatCurrency(remaining)} left`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <BudgetModal
          budget={editItem}
          onClose={() => { setShowModal(false); setEditItem(null); }}
          onSuccess={() => { setShowModal(false); setEditItem(null); loadData(); }}
        />
      )}

      {deleteItem && (
        <ConfirmDialog
          title="Delete Budget"
          message={`Delete the "${deleteItem.category}" budget? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteItem(null)}
          confirmText="Delete"
          danger
        />
      )}

      <style>{`
        .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; gap: 16px; flex-wrap: wrap; }
        .page-title { font-size: 1.6rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; }
        .page-subtitle { font-size: 0.875rem; color: var(--text-secondary); margin-top: 4px; }
        .btn-sm { padding: 8px 16px; font-size: 0.875rem; }
        .budget-kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-bottom: 24px; }
        @media (max-width: 1100px) { .budget-kpi-row { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .budget-kpi-row { grid-template-columns: 1fr; } }
        .budget-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; }
        .budget-card { padding: 20px; transition: var(--transition); position: relative; }
        .budget-card.over { border-color: #FECACA !important; }
        .budget-card.warning { border-color: #FDE68A !important; }
        .budget-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .budget-cat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .budget-card-actions { display: flex; align-items: center; gap: 6px; }
        .budget-category { font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 6px; }
        .budget-amounts { display: flex; align-items: baseline; gap: 6px; margin-bottom: 14px; }
        .budget-spent { font-size: 1.3rem; font-weight: 800; color: var(--text-primary); }
        .budget-divider { font-size: 0.85rem; color: var(--text-muted); }
        .budget-limit { font-size: 0.95rem; font-weight: 600; color: var(--text-secondary); }
        .budget-progress-track { height: 8px; background: #F1F5F9; border-radius: 9999px; overflow: hidden; margin-bottom: 10px; }
        .budget-progress-bar { height: 100%; border-radius: 9999px; transition: width 0.6s ease; }
        .budget-footer { display: flex; align-items: center; justify-content: space-between; }
        .budget-pct { font-size: 0.8rem; font-weight: 600; }
        .budget-remaining { font-size: 0.8rem; font-weight: 600; color: var(--primary); }
        .budget-remaining.over { color: var(--accent-red); }
        .action-edit { color: var(--accent-blue); background: var(--accent-blue-light); }
        .action-edit:hover { background: var(--accent-blue); color: #fff; }
        .action-delete { color: var(--accent-red); background: var(--accent-red-light); }
        .action-delete:hover { background: var(--accent-red); color: #fff; }
        .empty-state-card { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 60px 40px; text-align: center; }
        .empty-state-card h3 { font-size: 1.1rem; font-weight: 700; color: var(--text-primary); }
        .empty-state-card p { font-size: 0.9rem; color: var(--text-secondary); max-width: 340px; line-height: 1.6; }
        .skeleton-card { border-radius: var(--radius-lg); background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>
    </div>
  );
}
