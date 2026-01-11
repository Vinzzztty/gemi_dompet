'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
  loading?: boolean;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Hapus',
  message = 'Apakah Anda yakin ingin menghapus transaksi ini?',
  itemName,
  loading = false,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!loading) {
      onConfirm();
    }
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="dialog-header">
          <div className="dialog-icon">
            <AlertTriangle size={24} />
          </div>
          <h2>{title}</h2>
          <button
            onClick={onClose}
            className="close-btn"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="dialog-body">
          <p className="dialog-message">{message}</p>
          {itemName && (
            <div className="item-name">
              <strong>{itemName}</strong>
            </div>
          )}
          <p className="warning-text">
            Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        {/* Footer */}
        <div className="dialog-footer">
          <button
            onClick={onClose}
            className="btn btn-cancel"
            disabled={loading}
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            className="btn btn-delete"
            disabled={loading}
          >
            {loading ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: var(--space-4);
          animation: fadeIn 0.2s ease;
        }

        .dialog-content {
          background: white;
          border-radius: var(--radius-2xl);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
          max-width: 450px;
          width: 100%;
          animation: slideUp 0.3s ease;
        }

        .dialog-header {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-6);
          border-bottom: 1px solid var(--border-color);
          position: relative;
        }

        .dialog-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          color: #dc2626;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .dialog-header h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
          flex: 1;
        }

        .close-btn {
          position: absolute;
          top: var(--space-4);
          right: var(--space-4);
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: var(--space-2);
          border-radius: var(--radius-lg);
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover:not(:disabled) {
          background: var(--background-secondary);
          color: var(--text-primary);
        }

        .close-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .dialog-body {
          padding: var(--space-6);
        }

        .dialog-message {
          font-size: 0.938rem;
          color: var(--text-secondary);
          margin: 0 0 var(--space-4) 0;
          line-height: 1.6;
        }

        .item-name {
          background: var(--background-secondary);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-4);
          font-size: 0.875rem;
          color: var(--text-primary);
        }

        .warning-text {
          font-size: 0.813rem;
          color: #dc2626;
          margin: 0;
          font-weight: 500;
        }

        .dialog-footer {
          display: flex;
          gap: var(--space-3);
          padding: var(--space-6);
          border-top: 1px solid var(--border-color);
        }

        .btn {
          flex: 1;
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-lg);
          font-size: 0.938rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-cancel {
          background: var(--background-secondary);
          color: var(--text-primary);
        }

        .btn-cancel:hover:not(:disabled) {
          background: var(--border-color);
        }

        .btn-delete {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(220, 38, 38, 0.2);
        }

        .btn-delete:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .dialog-content {
            max-width: 100%;
          }

          .dialog-header h2 {
            font-size: 1.125rem;
          }
        }
      `}</style>
    </div>
  );
};
