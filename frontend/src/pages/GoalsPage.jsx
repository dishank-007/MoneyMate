import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { goalService } from '../services/api';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { GoalModal } from '../components/GoalModal';
import { AddSavingsModal } from '../components/AddSavingsModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Plus, Target, Edit2, Trash2, PiggyBank, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function GoalsPage() {
  const { formatCurrency } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [savingsGoal, setSavingsGoal] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await goalService.getAll();
      if (res.success) setGoals(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDelete = async () => {
    try {
      await goalService.delete(deleteItem.id);
      setDeleteItem(null);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSavingsSuccess = (goal) => {
    const pct = goal.targetAmount > 0 ? ((goal.currentAmount || 0) / goal.targetAmount) * 100 : 0;
    if (pct >= 100) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
    }
    setSavingsGoal(null);
    loadData();
  };

  const completedGoals = goals.filter(g => (g.currentAmount || 0) >= g.targetAmount).length;
  const totalSaved = goals.reduce((s, g) => s + (g.currentAmount || 0), 0);
  const totalTarget = goals.reduce((s, g) => s + (g.targetAmount || 0), 0);

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <div className="page-wrapper">

          <div className="page-header">
            <div>
              <h1 className="page-title">Financial Goals</h1>
              <p className="page-subtitle">{goals.length} goals · {completedGoals} completed</p>
            </div>
            <button id="add-goal-btn" className="btn btn-primary btn-sm" onClick={() => { setEditItem(null); setShowModal(true); }}>
              <Plus size={15} /> New Goal
            </button>
          </div>

          {/* Summary Bar */}
          {goals.length > 0 && (
            <div className="card goals-summary">
              <div className="goals-summary-stat">
                <span className="gs-label">Total Saved</span>
                <span className="gs-value primary">{formatCurrency(totalSaved)}</span>
              </div>
              <div className="gs-divider" />
              <div className="goals-summary-stat">
                <span className="gs-label">Total Target</span>
                <span className="gs-value">{formatCurrency(totalTarget)}</span>
              </div>
              <div className="gs-divider" />
              <div className="goals-summary-stat">
                <span className="gs-label">Overall Progress</span>
                <span className="gs-value">{totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}%</span>
              </div>
              <div className="gs-divider" />
              <div className="goals-summary-stat">
                <span className="gs-label">Completed</span>
                <span className="gs-value primary">{completedGoals} / {goals.length}</span>
              </div>
            </div>
          )}

          {loading ? (
            <div className="goals-grid">
              {[1,2,3].map(i => <div key={i} className="skeleton-card" style={{ height: 240 }} />)}
            </div>
          ) : goals.length === 0 ? (
            <div className="card empty-state-card">
              <Target size={44} color="#CBD5E1" />
              <h3>No goals yet</h3>
              <p>Define your financial goals and track your savings progress towards them.</p>
              <button className="btn btn-primary" onClick={() => { setEditItem(null); setShowModal(true); }}>
                <Plus size={15} /> Create Your First Goal
              </button>
            </div>
          ) : (
            <div className="goals-grid">
              {goals.map(goal => {
                const current = goal.currentAmount || 0;
                const target = goal.targetAmount || 0;
                const pct = target > 0 ? Math.min(100, (current / target) * 100) : 0;
                const isComplete = current >= target;
                const remaining = target - current;
                const deadline = goal.targetDate ? new Date(goal.targetDate) : null;
                const daysLeft = deadline ? Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24)) : null;

                return (
                  <div key={goal.id} className={`card goal-card ${isComplete ? 'complete' : ''}`}>
                    {isComplete && (
                      <div className="goal-complete-badge">
                        <CheckCircle2 size={14} /> Goal Achieved!
                      </div>
                    )}

                    <div className="goal-card-header">
                      <div className="goal-icon-box" style={{ background: isComplete ? 'var(--primary-light)' : 'var(--accent-purple-light)' }}>
                        {isComplete
                          ? <CheckCircle2 size={20} color="var(--primary)" />
                          : <Target size={20} color="var(--accent-purple)" />
                        }
                      </div>
                      <div className="goal-actions">
                        <button className="btn-icon action-savings" title="Add Savings" onClick={() => setSavingsGoal(goal)}>
                          <PiggyBank size={13} />
                        </button>
                        <button className="btn-icon action-edit" onClick={() => { setEditItem(goal); setShowModal(true); }}>
                          <Edit2 size={13} />
                        </button>
                        <button className="btn-icon action-delete" onClick={() => setDeleteItem(goal)}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <h4 className="goal-name">{goal.name}</h4>
                    {goal.description && <p className="goal-desc">{goal.description}</p>}

                    <div className="goal-amounts">
                      <div>
                        <span className="goal-current">{formatCurrency(current)}</span>
                        <span className="goal-of">saved</span>
                      </div>
                      <span className="goal-target">of {formatCurrency(target)}</span>
                    </div>

                    <div className="goal-progress-track">
                      <div
                        className="goal-progress-bar"
                        style={{
                          width: `${pct}%`,
                          background: isComplete
                            ? 'linear-gradient(90deg, var(--primary), #059669)'
                            : 'linear-gradient(90deg, var(--accent-purple), #7C3AED)'
                        }}
                      />
                    </div>

                    <div className="goal-footer">
                      <span className="goal-pct">{Math.round(pct)}% complete</span>
                      {!isComplete && (
                        <span className="goal-remaining">{formatCurrency(remaining)} remaining</span>
                      )}
                    </div>

                    {deadline && !isComplete && (
                      <div className={`goal-deadline ${daysLeft < 0 ? 'overdue' : daysLeft < 30 ? 'soon' : ''}`}>
                        {daysLeft < 0
                          ? `${Math.abs(daysLeft)} days overdue`
                          : daysLeft === 0
                          ? 'Due today!'
                          : `${daysLeft} days left`
                        }
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <GoalModal
          goal={editItem}
          onClose={() => { setShowModal(false); setEditItem(null); }}
          onSuccess={() => { setShowModal(false); setEditItem(null); loadData(); }}
        />
      )}

      {savingsGoal && (
        <AddSavingsModal
          goal={savingsGoal}
          onClose={() => setSavingsGoal(null)}
          onSuccess={handleSavingsSuccess}
        />
      )}

      {deleteItem && (
        <ConfirmDialog
          title="Delete Goal"
          message={`Delete the goal "${deleteItem.name}"? All progress will be lost.`}
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
        .goals-summary { display: flex; align-items: center; padding: 20px 24px; margin-bottom: 24px; gap: 0; flex-wrap: wrap; }
        .goals-summary-stat { display: flex; flex-direction: column; gap: 4px; padding: 0 24px; }
        .goals-summary-stat:first-child { padding-left: 0; }
        .gs-label { font-size: 0.775rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
        .gs-value { font-size: 1.2rem; font-weight: 800; color: var(--text-primary); }
        .gs-value.primary { color: var(--primary); }
        .gs-divider { width: 1px; height: 40px; background: var(--border-color); margin: 0 8px; }
        .goals-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 18px; }
        .goal-card { padding: 20px; position: relative; transition: var(--transition); }
        .goal-card.complete { border-color: var(--primary) !important; }
        .goal-complete-badge { display: inline-flex; align-items: center; gap: 5px; background: var(--primary-light); color: var(--primary-dark); font-size: 0.75rem; font-weight: 700; padding: 3px 10px; border-radius: 9999px; margin-bottom: 12px; }
        .goal-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .goal-icon-box { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .goal-actions { display: flex; align-items: center; gap: 6px; }
        .action-savings { color: var(--primary); background: var(--primary-light); }
        .action-savings:hover { background: var(--primary); color: #fff; }
        .action-edit { color: var(--accent-blue); background: var(--accent-blue-light); }
        .action-edit:hover { background: var(--accent-blue); color: #fff; }
        .action-delete { color: var(--accent-red); background: var(--accent-red-light); }
        .action-delete:hover { background: var(--accent-red); color: #fff; }
        .goal-name { font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
        .goal-desc { font-size: 0.83rem; color: var(--text-muted); margin-bottom: 14px; line-height: 1.5; }
        .goal-amounts { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px; }
        .goal-current { font-size: 1.4rem; font-weight: 800; color: var(--text-primary); }
        .goal-of { font-size: 0.8rem; color: var(--text-muted); margin-left: 4px; }
        .goal-target { font-size: 0.9rem; font-weight: 600; color: var(--text-secondary); }
        .goal-progress-track { height: 8px; background: #F1F5F9; border-radius: 9999px; overflow: hidden; margin-bottom: 10px; }
        .goal-progress-bar { height: 100%; border-radius: 9999px; transition: width 0.6s ease; }
        .goal-footer { display: flex; align-items: center; justify-content: space-between; }
        .goal-pct { font-size: 0.8rem; font-weight: 600; color: var(--text-muted); }
        .goal-remaining { font-size: 0.8rem; font-weight: 600; color: var(--accent-purple); }
        .goal-deadline { display: inline-block; margin-top: 10px; font-size: 0.775rem; font-weight: 600; padding: 3px 10px; border-radius: 9999px; background: var(--accent-blue-light); color: #1D4ED8; }
        .goal-deadline.soon { background: var(--accent-gold-light); color: #B45309; }
        .goal-deadline.overdue { background: var(--accent-red-light); color: #B91C1C; }
        .empty-state-card { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 60px 40px; text-align: center; }
        .empty-state-card h3 { font-size: 1.1rem; font-weight: 700; color: var(--text-primary); }
        .empty-state-card p { font-size: 0.9rem; color: var(--text-secondary); max-width: 340px; line-height: 1.6; }
        .skeleton-card { border-radius: var(--radius-lg); background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>
    </div>
  );
}
