import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { budgetService } from '../services/api';
import { X, Calendar, PieChart, Clock } from 'lucide-react';

export const BudgetModal = ({ isOpen = true, onClose, onSave, onSuccess, budget = null }) => {
  const { currencySymbol } = useAuth();

  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('MONTHLY');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Investment', 'Other'
  ];

  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

    if (budget) {
      setCategory(budget.category || 'Food');
      setAmount(budget.amount || '');
      setDuration(budget.duration || 'MONTHLY');
      setStartDate(budget.startDate || firstDay);
      setEndDate(budget.endDate || lastDay);
    } else {
      setCategory('Food');
      setAmount('');
      setDuration('MONTHLY');
      setStartDate(firstDay);
      setEndDate(lastDay);
    }
    setError('');
  }, [budget, isOpen]);

  if (isOpen === false) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid budget amount');
      return;
    }
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be after end date');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const payload = {
        category,
        amount: Number(amount),
        duration,
        startDate,
        endDate
      };

      if (onSave) {
        await onSave(payload);
      } else {
        if (budget && budget.id) {
          await budgetService.update(budget.id, payload);
        } else {
          await budgetService.create(payload);
        }
      }

      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{budget ? 'Edit Budget' : 'Create New Budget'}</h3>
          <button className="btn-icon" onClick={onClose}><X size={20} color="#64748B" /></button>
        </div>

        {error && <div className="modal-alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <p className="modal-subtext">
            Set a monthly or yearly budget limit for a spending category to keep your finances on track.
          </p>

          {/* Category */}
          <div className="input-group">
            <label className="input-label">Category *</label>
            <div className="input-with-icon">
              <PieChart size={18} className="input-left-icon" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field icon-prefixed"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            {/* Amount */}
            <div className="input-group">
              <label className="input-label">Budget Amount ({currencySymbol}) *</label>
              <div className="input-with-icon">
                <span className="input-prefix">{currencySymbol}</span>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="e.g. 5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field prefixed"
                  required
                />
              </div>
            </div>

            {/* Duration */}
            <div className="input-group">
              <label className="input-label">Duration</label>
              <div className="input-with-icon">
                <Clock size={18} className="input-left-icon" />
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="input-field icon-prefixed"
                >
                  <option value="MONTHLY">Monthly</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-row">
            {/* Start Date */}
            <div className="input-group">
              <label className="input-label">Start Date *</label>
              <div className="input-with-icon">
                <Calendar size={18} className="input-left-icon" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input-field icon-prefixed"
                  required
                />
              </div>
            </div>

            {/* End Date */}
            <div className="input-group">
              <label className="input-label">End Date *</label>
              <div className="input-with-icon">
                <Calendar size={18} className="input-left-icon" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input-field icon-prefixed"
                  required
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : budget ? 'Update Budget' : 'Create Budget'}
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
          .modal-subtext {
            font-size: 0.85rem;
            color: var(--text-muted);
            margin-bottom: 18px;
            line-height: 1.4;
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
          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
          @media (max-width: 500px) {
            .form-row {
              grid-template-columns: 1fr;
            }
          }
          .input-with-icon {
            position: relative;
            display: flex;
            align-items: center;
          }
          .input-left-icon {
            position: absolute;
            left: 14px;
            color: var(--text-muted);
            pointer-events: none;
          }
          .input-prefix {
            position: absolute;
            left: 14px;
            font-weight: 700;
            color: var(--text-secondary);
            pointer-events: none;
          }
          .input-field.prefixed {
            padding-left: 36px;
          }
          .input-field.icon-prefixed {
            padding-left: 42px;
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
