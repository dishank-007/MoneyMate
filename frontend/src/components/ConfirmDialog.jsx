import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', isDanger = true }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content confirm-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon-wrap" style={{ background: isDanger ? '#FEE2E2' : '#FEF3C7' }}>
          <AlertTriangle size={28} color={isDanger ? '#EF4444' : '#F59E0B'} />
        </div>

        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-message">{message}</p>

        <div className="confirm-actions">
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button 
            onClick={() => { onConfirm(); onClose(); }} 
            className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`}
          >
            {confirmText}
          </button>
        </div>

        <style>{`
          .confirm-modal-box {
            max-width: 420px;
            padding: 30px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .confirm-icon-wrap {
            width: 58px;
            height: 58px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
          }
          .confirm-title {
            font-size: 1.2rem;
            color: var(--text-primary);
            margin-bottom: 8px;
          }
          .confirm-message {
            font-size: 0.9rem;
            color: var(--text-secondary);
            margin-bottom: 24px;
            line-height: 1.45;
          }
          .confirm-actions {
            display: flex;
            gap: 12px;
            width: 100%;
            justify-content: center;
          }
          .confirm-actions button {
            flex: 1;
          }
        `}</style>
      </div>
    </div>
  );
};
