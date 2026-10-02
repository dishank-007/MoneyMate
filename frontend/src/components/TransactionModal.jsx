import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionService } from '../services/api';
import { X, Calendar, DollarSign, Tag, FileText, CreditCard } from 'lucide-react';

export const TransactionModal = ({ isOpen = true, onClose, onSave, onSuccess, transaction = null }) => {
  const { currencySymbol } = useAuth();

  const [type, setType] = useState('EXPENSE');
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (transaction) {
      setType(transaction.type || 'EXPENSE');
      setCategory(transaction.category || 'Food');
      setAmount(transaction.amount || '');
      setTransactionDate(transaction.transactionDate || transaction.date || new Date().toISOString().split('T')[0]);
      setDescription(transaction.description || '');
      setPaymentMethod(transaction.paymentMethod || 'UPI');
    } else {
      setType('EXPENSE');
      setCategory('Food');
      setAmount('');
      setTransactionDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setPaymentMethod('UPI');
    }
    setError('');
  }, [transaction, isOpen]);

  if (isOpen === false) return null;

  const expenseCategories = [
    'Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Investment', 'Other'
  ];

  const incomeCategories = [
    'Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other'
  ];

  const availableCategories = type === 'EXPENSE' ? expenseCategories : incomeCategories;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }
    if (!category) {
      setError('Please select a category');
      return;
    }
    if (!transactionDate) {
      setError('Please select a valid date');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const payload = {
        type,
        category,
        amount: Number(amount),
        transactionDate,
        description: description.trim(),
        paymentMethod
      };

      if (onSave) {
        await onSave(payload);
      } else {
        if (transaction && transaction.id) {
          await transactionService.update(transaction.id, payload);
        } else {
          await transactionService.create(payload);
        }
      }

      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{transaction ? 'Edit Transaction' : 'Add New Transaction'}</h3>
          <button className="btn-icon" onClick={onClose}><X size={20} color="#64748B" /></button>
        </div>

        {error && <div className="modal-alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Type Toggle */}
          <div className="type-toggle-group">
            <button
              type="button"
              className={`type-btn ${type === 'EXPENSE' ? 'active-expense' : ''}`}
              onClick={() => { setType('EXPENSE'); setCategory('Food'); }}
            >
              Expense
            </button>
            <button
              type="button"
              className={`type-btn ${type === 'INCOME' ? 'active-income' : ''}`}
              onClick={() => { setType('INCOME'); setCategory('Salary'); }}
            >
              Income
            </button>
          </div>

          <div className="form-row">
            {/* Amount */}
            <div className="input-group">
              <label className="input-label">Amount ({currencySymbol}) *</label>
              <div className="input-with-icon">
                <span className="input-prefix">{currencySymbol}</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field prefixed"
                  required
                />
              </div>
            </div>

            {/* Date */}
            <div className="input-group">
              <label className="input-label">Date *</label>
              <div className="input-with-icon">
                <Calendar size={18} className="input-left-icon" />
                <input
                  type="date"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                  className="input-field icon-prefixed"
                  required
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="input-group">
            <label className="input-label">Category *</label>
            <div className="input-with-icon">
              <Tag size={18} className="input-left-icon" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field icon-prefixed"
                required
              >
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Payment Method */}
          <div className="input-group">
            <label className="input-label">Payment Method</label>
            <div className="input-with-icon">
              <CreditCard size={18} className="input-left-icon" />
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="input-field icon-prefixed"
              >
                <option value="UPI">UPI / GPay / PhonePe</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="input-group">
            <label className="input-label">Description</label>
            <div className="input-with-icon">
              <FileText size={18} className="input-left-icon" />
              <input
                type="text"
                placeholder="e.g. Dinner with friends, Netflix, Grocery"
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
            <button 
              type="submit" 
              className={`btn ${type === 'EXPENSE' ? 'btn-expense' : 'btn-primary'}`} 
              disabled={loading}
            >
              {loading ? 'Saving...' : transaction ? 'Update Transaction' : type === 'EXPENSE' ? 'Save Expense' : 'Save Income'}
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
          .modal-header h3 {
            font-size: 1.15rem;
            color: var(--text-primary);
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
          .type-toggle-group {
            display: flex;
            background: #F1F5F9;
            padding: 4px;
            border-radius: var(--radius-md);
            margin-bottom: 20px;
          }
          .type-btn {
            flex: 1;
            padding: 10px;
            font-size: 0.9rem;
            font-weight: 700;
            border-radius: var(--radius-sm);
            color: var(--text-secondary);
            transition: var(--transition);
          }
          .type-btn.active-expense {
            background: #FFFFFF;
            color: var(--accent-red);
            box-shadow: 0 2px 6px rgba(0,0,0,0.08);
          }
          .type-btn.active-income {
            background: #FFFFFF;
            color: var(--primary);
            box-shadow: 0 2px 6px rgba(0,0,0,0.08);
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
          .btn-expense {
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
            color: #FFFFFF;
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
