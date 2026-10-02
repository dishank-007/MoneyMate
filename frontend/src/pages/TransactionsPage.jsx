import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionService } from '../services/api';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { TransactionModal } from '../components/TransactionModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import {
  Plus, Search, Filter, Edit2, Trash2,
  ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight
} from 'lucide-react';

const CATEGORIES = [
  'All', 'Food', 'Transport', 'Shopping', 'Entertainment', 'Health',
  'Education', 'Utilities', 'Housing', 'Salary', 'Freelance', 'Investment', 'Other'
];

export default function TransactionsPage() {
  const { formatCurrency } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Filters
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, size: 10, sort: 'date,desc' };
      if (search) params.search = search;
      if (typeFilter !== 'ALL') params.type = typeFilter;
      if (categoryFilter !== 'All') params.category = categoryFilter;

      const res = await transactionService.getAll(params);
      if (res.success) {
        const data = res.data;
        if (data?.content) {
          setTransactions(data.content);
          setTotalPages(data.totalPages || 1);
          setTotalElements(data.totalElements || data.content.length);
        } else {
          setTransactions(Array.isArray(data) ? data : []);
          setTotalPages(1);
          setTotalElements(Array.isArray(data) ? data.length : 0);
        }
      }
    } catch (err) {
      console.error('Load transactions error:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, typeFilter, categoryFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDelete = async () => {
    try {
      await transactionService.delete(deleteItem.id);
      setDeleteItem(null);
      loadData();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleSearchChange = (e) => { setSearch(e.target.value); setPage(0); };
  const handleTypeChange = (t) => { setTypeFilter(t); setPage(0); };
  const handleCategoryChange = (c) => { setCategoryFilter(c); setPage(0); };

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <div className="page-wrapper">

          {/* Header */}
          <div className="page-header">
            <div>
              <h1 className="page-title">Transactions</h1>
              <p className="page-subtitle">{totalElements} transactions found</p>
            </div>
            <button id="add-transaction-btn" className="btn btn-primary btn-sm" onClick={() => { setEditItem(null); setShowModal(true); }}>
              <Plus size={15} /> Add Transaction
            </button>
          </div>

          {/* Filters */}
          <div className="card filters-card">
            <div className="search-wrap">
              <Search size={16} className="search-icon" />
              <input
                id="txn-search"
                type="text"
                className="input-field search-input"
                placeholder="Search by description or category..."
                value={search}
                onChange={handleSearchChange}
              />
            </div>
            <div className="filter-row">
              <div className="filter-group">
                <Filter size={14} style={{ color: 'var(--text-muted)' }} />
                <span className="filter-label">Type:</span>
                {['ALL', 'INCOME', 'EXPENSE'].map(t => (
                  <button
                    key={t}
                    className={`filter-chip ${typeFilter === t ? 'active' : ''}`}
                    onClick={() => handleTypeChange(t)}
                  >
                    {t === 'ALL' ? 'All' : t === 'INCOME' ? '↑ Income' : '↓ Expense'}
                  </button>
                ))}
              </div>
              <div className="filter-group category-filter">
                <span className="filter-label">Category:</span>
                <select
                  id="txn-category-filter"
                  className="input-field filter-select"
                  value={categoryFilter}
                  onChange={e => handleCategoryChange(e.target.value)}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="card txn-table-card">
            {loading ? (
              <div className="table-loading">
                {[...Array(5)].map((_, i) => <div key={i} className="skeleton-row" />)}
              </div>
            ) : transactions.length === 0 ? (
              <div className="empty-state">
                <ArrowDownRight size={36} color="#CBD5E1" />
                <p>No transactions found. Add your first transaction!</p>
              </div>
            ) : (
              <>
                <div className="table-wrap">
                  <table className="txn-table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th style={{ textAlign: 'right' }}>Amount</th>
                        <th style={{ textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map(txn => (
                        <tr key={txn.id} className="txn-table-row">
                          <td>
                            <div className={`type-badge ${txn.type === 'INCOME' ? 'income' : 'expense'}`}>
                              {txn.type === 'INCOME'
                                ? <ArrowUpRight size={13} />
                                : <ArrowDownRight size={13} />
                              }
                              {txn.type === 'INCOME' ? 'Income' : 'Expense'}
                            </div>
                          </td>
                          <td>
                            <span className="txn-desc-cell">{txn.description || '—'}</span>
                          </td>
                          <td>
                            <span className="badge badge-info">{txn.category}</span>
                          </td>
                          <td className="txn-date-cell">{formatDate(txn.date || txn.transactionDate)}</td>
                          <td style={{ textAlign: 'right' }}>
                            <span className={`txn-amt ${txn.type === 'INCOME' ? 'income' : 'expense'}`}>
                              {txn.type === 'INCOME' ? '+' : '-'}{formatCurrency(txn.amount)}
                            </span>
                          </td>
                          <td>
                            <div className="action-btns">
                              <button
                                className="btn-icon action-edit"
                                title="Edit"
                                onClick={() => { setEditItem(txn); setShowModal(true); }}
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                className="btn-icon action-delete"
                                title="Delete"
                                onClick={() => setDeleteItem(txn)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="btn btn-secondary btn-icon"
                      disabled={page === 0}
                      onClick={() => setPage(p => p - 1)}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="page-info">Page {page + 1} of {totalPages}</span>
                    <button
                      className="btn btn-secondary btn-icon"
                      disabled={page >= totalPages - 1}
                      onClick={() => setPage(p => p + 1)}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <TransactionModal
          transaction={editItem}
          onClose={() => { setShowModal(false); setEditItem(null); }}
          onSuccess={() => { setShowModal(false); setEditItem(null); loadData(); }}
        />
      )}

      {deleteItem && (
        <ConfirmDialog
          title="Delete Transaction"
          message={`Are you sure you want to delete "${deleteItem.description || deleteItem.category}"? This action cannot be undone.`}
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
        .filters-card { padding: 18px 20px; margin-bottom: 18px; display: flex; flex-direction: column; gap: 14px; }
        .search-wrap { position: relative; }
        .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        .search-input { padding-left: 40px; margin-bottom: 0; }
        .filter-row { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
        .filter-group { display: flex; align-items: center; gap: 8px; }
        .filter-label { font-size: 0.8rem; font-weight: 600; color: var(--text-muted); }
        .filter-chip { padding: 5px 14px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); background: var(--bg-subtle); border: 1px solid var(--border-color); cursor: pointer; transition: var(--transition); }
        .filter-chip:hover { background: var(--primary-light); color: var(--primary-dark); border-color: var(--primary); }
        .filter-chip.active { background: var(--primary); color: #fff; border-color: var(--primary); }
        .filter-select { padding: 6px 12px; font-size: 0.8rem; margin: 0; }
        .txn-table-card { overflow: hidden; }
        .table-wrap { overflow-x: auto; }
        .txn-table { width: 100%; border-collapse: collapse; }
        .txn-table thead tr { background: var(--bg-subtle); border-bottom: 1px solid var(--border-color); }
        .txn-table th { padding: 12px 16px; font-size: 0.775rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; text-align: left; white-space: nowrap; }
        .txn-table-row { border-bottom: 1px solid var(--border-color); transition: background 0.15s; }
        .txn-table-row:last-child { border-bottom: none; }
        .txn-table-row:hover { background: var(--bg-subtle); }
        .txn-table td { padding: 13px 16px; font-size: 0.9rem; color: var(--text-primary); vertical-align: middle; }
        .type-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 9999px; font-size: 0.775rem; font-weight: 700; }
        .type-badge.income { background: var(--primary-light); color: var(--primary-dark); }
        .type-badge.expense { background: var(--accent-red-light); color: #B91C1C; }
        .txn-desc-cell { font-weight: 600; color: var(--text-primary); }
        .txn-date-cell { color: var(--text-muted); font-size: 0.85rem; white-space: nowrap; }
        .txn-amt { font-weight: 700; }
        .txn-amt.income { color: var(--primary); }
        .txn-amt.expense { color: var(--accent-red); }
        .action-btns { display: flex; align-items: center; justify-content: center; gap: 6px; }
        .action-edit { color: var(--accent-blue); background: var(--accent-blue-light); }
        .action-edit:hover { background: var(--accent-blue); color: #fff; }
        .action-delete { color: var(--accent-red); background: var(--accent-red-light); }
        .action-delete:hover { background: var(--accent-red); color: #fff; }
        .pagination { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 16px; border-top: 1px solid var(--border-color); }
        .page-info { font-size: 0.875rem; font-weight: 600; color: var(--text-secondary); }
        .empty-state { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 60px; color: var(--text-muted); font-size: 0.9rem; }
        .table-loading { padding: 16px; display: flex; flex-direction: column; gap: 10px; }
        .skeleton-row { height: 52px; border-radius: var(--radius-sm); background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
