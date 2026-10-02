import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { X, PlusCircle, CheckCircle2 } from 'lucide-react';

import { goalService } from '../services/api';

export const AddSavingsModal = ({ isOpen = true, onClose, onSave, onSuccess, goal }) => {
  const { currencySymbol, formatCurrency } = useAuth();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !goal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      setError('');
      let updatedGoal = null;
      if (onSave) {
        await onSave(goal.id, Number(amount));
      } else {
        const res = await goalService.addSavings(goal.id, Number(amount));
        updatedGoal = res.data;
      }
      
      // Trigger confetti celebration!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      if (onSuccess) {
        onSuccess(updatedGoal || { ...goal, currentAmount: (goal.currentAmount || goal.savedAmount || 0) + Number(amount), savedAmount: (goal.savedAmount || goal.currentAmount || 0) + Number(amount) });
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to add savings');
    } finally {
      setLoading(false);
    }
  };

  const currentSaved = Number(goal.savedAmount ?? goal.currentAmount) || 0;
  const targetVal = Number(goal.targetAmount) || 1;
  const newTotal = currentSaved + (Number(amount) || 0);
  const newProgress = Math.min(100, (newTotal / targetVal) * 100);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Savings to Goal</h3>
          <button className="btn-icon" onClick={onClose}><X size={20} color="#64748B" /></button>
        </div>

        {error && <div className="modal-alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="goal-quick-summary">
            <h4>{goal.title}</h4>
            <div className="goal-meta-row">
              <span>Target: <strong>{formatCurrency(goal.targetAmount)}</strong></span>
              <span>Currently Saved: <strong>{formatCurrency(goal.savedAmount)}</strong></span>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Deposit Amount ({currencySymbol}) *</label>
            <div className="input-with-icon">
              <span className="input-prefix">{currencySymbol}</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="e.g. 5000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field prefixed"
                required
                autoFocus
              />
            </div>
          </div>

          {amount > 0 && (
            <div className="savings-preview-box">
              <div className="preview-row">
                <span>New Saved Balance:</span>
                <strong>{formatCurrency(newTotal)}</strong>
              </div>
              <div className="preview-row">
                <span>New Progress:</span>
                <strong>{Math.round(newProgress)}%</strong>
              </div>
              {newTotal >= goal.targetAmount && (
                <div className="goal-achieved-badge">
                  <CheckCircle2 size={16} /> Reaches 100% Target!
                </div>
              )}
            </div>
          )}

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <PlusCircle size={18} />
              {loading ? 'Adding...' : 'Deposit Savings'}
            </button>
          </div>
        </form>

        <style>{`
          .modal-header {
            padding: 20px 24px;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .modal-form {
            padding: 24px;
          }
          .modal-alert-error {
            margin: 16px 24px 0 24px;
            padding: 10px 14px;
            background: #FEE2E2;
            color: #B91C1C;
            font-size: 0.85rem;
            border-radius: var(--radius-sm);
            border: 1px solid #FECACA;
          }
          .goal-quick-summary {
            background: #F8FAFC;
            border: 1px solid var(--border-color);
            padding: 14px 18px;
            border-radius: var(--radius-md);
            margin-bottom: 20px;
          }
          .goal-quick-summary h4 {
            font-size: 1rem;
            color: var(--text-primary);
            margin-bottom: 6px;
          }
          .goal-meta-row {
            display: flex;
            justify-content: space-between;
            font-size: 0.85rem;
            color: var(--text-secondary);
            flex-wrap: wrap;
            gap: 8px;
          }
          .savings-preview-box {
            background: #F0FDF4;
            border: 1px solid #BBF7D0;
            padding: 12px 16px;
            border-radius: var(--radius-md);
            margin-top: 14px;
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
          .preview-row {
            display: flex;
            justify-content: space-between;
            font-size: 0.85rem;
            color: #166534;
          }
          .goal-achieved-badge {
            margin-top: 6px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 0.825rem;
            font-weight: 700;
            color: #15803D;
          }
          .modal-footer {
            margin-top: 24px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 12px;
          }
        `}</style>
      </div>
    </div>
  );
};
