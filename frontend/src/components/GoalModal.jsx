import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Calendar, Target, FileText } from 'lucide-react';

import { goalService } from '../services/api';

export const GoalModal = ({ isOpen = true, onClose, onSave, onSuccess, goal = null }) => {
  const { currencySymbol } = useAuth();

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [savedAmount, setSavedAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (goal) {
      setTitle(goal.title || goal.name || '');
      setTargetAmount(goal.targetAmount || '');
      setSavedAmount(goal.savedAmount ?? goal.currentAmount ?? '0');
      setDeadline(goal.deadline || goal.targetDate || '');
      setDescription(goal.description || '');
    } else {
      setTitle('');
      setTargetAmount('');
      setSavedAmount('0');
      setDeadline('');
      setDescription('');
    }
    setError('');
  }, [goal, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a goal title');
      return;
    }
    if (!targetAmount || Number(targetAmount) <= 0) {
      setError('Please enter a target amount greater than 0');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const payload = {
        title: title.trim(),
        name: title.trim(),
        targetAmount: Number(targetAmount),
        savedAmount: Number(savedAmount) || 0,
        currentAmount: Number(savedAmount) || 0,
        deadline: deadline || null,
        targetDate: deadline || null,
        description: description.trim()
      };

      if (onSave) {
        await onSave(payload);
      } else if (goal?.id) {
        const res = await goalService.update(goal.id, payload);
        if (onSuccess) onSuccess(res.data);
      } else {
        const res = await goalService.create(payload);
        if (onSuccess) onSuccess(res.data);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{goal ? 'Edit Financial Goal' : 'Add New Goal'}</h3>
          <button className="btn-icon" onClick={onClose}><X size={20} color="#64748B" /></button>
        </div>

        {error && <div className="modal-alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <p className="modal-subtext">
            Enter the details of your financial goal to track progress and turn your dreams into reality.
          </p>

          {/* Title */}
          <div className="input-group">
            <label className="input-label">Goal Title *</label>
            <div className="input-with-icon">
              <Target size={18} className="input-left-icon" />
              <input
                type="text"
                placeholder="e.g. Buy a Laptop, Europe Trip, Emergency Fund"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field icon-prefixed"
                required
              />
            </div>
          </div>

          <div className="form-row">
            {/* Target Amount */}
            <div className="input-group">
              <label className="input-label">Target Amount ({currencySymbol}) *</label>
              <div className="input-with-icon">
                <span className="input-prefix">{currencySymbol}</span>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="80000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="input-field prefixed"
                  required
                />
              </div>
            </div>

            {/* Current Saved */}
            <div className="input-group">
              <label className="input-label">Already Saved ({currencySymbol})</label>
              <div className="input-with-icon">
                <span className="input-prefix">{currencySymbol}</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0"
                  value={savedAmount}
                  onChange={(e) => setSavedAmount(e.target.value)}
                  className="input-field prefixed"
                />
              </div>
            </div>
          </div>

          {/* Deadline */}
          <div className="input-group">
            <label className="input-label">Target Deadline</label>
            <div className="input-with-icon">
              <Calendar size={18} className="input-left-icon" />
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="input-field icon-prefixed"
              />
            </div>
          </div>

          {/* Description */}
          <div className="input-group">
            <label className="input-label">Description</label>
            <div className="input-with-icon">
              <FileText size={18} className="input-left-icon" />
              <input
                type="text"
                placeholder="e.g. Save money to buy a new laptop for studies."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field icon-prefixed"
                maxLength={255}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : goal ? 'Update Goal' : 'Save Goal'}
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
