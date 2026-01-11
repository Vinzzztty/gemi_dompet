'use client';

import React from 'react';
import Lottie from 'lottie-react';
import { FileText, Edit2, Trash2 } from 'lucide-react';
import { FontAwesomeIconDisplay } from '@/components/ui/FontAwesomeIconDisplay';
import { formatCurrency } from '@/utils/format';
import { ExpenseTransaction } from '@/types/expense';
import searchingAnimation from '../../../public/animations/Searching.json';

interface ExpenseTableProps {
  data: ExpenseTransaction[];
  loading?: boolean;
  onEdit?: (transaction: ExpenseTransaction) => void;
  onDelete?: (id: string) => void;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({
  data,
  loading = false,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="expense-table-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Memuat data...</p>
        </div>
        <style jsx>{`
          .expense-table-container {
            background: white;
            border-radius: var(--radius-2xl);
            padding: var(--space-6);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          .loading-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: var(--space-12);
            color: var(--text-secondary);
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--border-color);
            border-top-color: #dc2626;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-bottom: var(--space-4);
          }
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="expense-table-container">
        <div className="empty-state">
          <div className="empty-icon"><Lottie 
                        animationData={searchingAnimation} 
                        loop={true}
                        style={{ width: 200, height: 200 }}
                      /></div>
          <h3>Belum Ada Pengeluaran</h3>
          <p>Transaksi pengeluaran akan muncul di sini</p>
        </div>
        <style jsx>{`
          .expense-table-container {
            background: white;
            border-radius: var(--radius-2xl);
            padding: var(--space-6);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: var(--space-12);
            text-align: center;
          }
          .empty-icon {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: var(--space-2);
          }
          .empty-state h3 {
            font-size: 1.125rem;
            font-weight: 600;
            color: var(--text-primary);
            margin: 0 0 var(--space-2) 0;
          }
          .empty-state p {
            font-size: 0.875rem;
            color: var(--text-secondary);
            margin: 0;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="expense-table-container">
      <div className="table-wrapper">
        <table className="expense-table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Kategori</th>
              <th>Nama</th>
              <th>Catatan</th>
              <th className="text-right">Nominal</th>
              {(onEdit || onDelete) && <th className="text-center">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((transaction) => (
              <tr key={transaction.id}>
                <td>
                  <div className="date-cell">
                    <span>{formatDate(transaction.tanggal)}</span>
                  </div>
                </td>
                <td>
                  <div className="category-cell">
                    {transaction.category?.icon && (
                      <div className="category-icon">
                        <FontAwesomeIconDisplay iconName={transaction.category.icon} />
                      </div>
                    )}
                    <span>{transaction.category?.name || 'Tanpa Kategori'}</span>
                  </div>
                </td>
                <td>
                  <span className="transaction-name">{transaction.nama}</span>
                </td>
                <td>
                  {transaction.catatan ? (
                    <div className="notes-cell">
                      <FileText size={14} />
                      <span>{transaction.catatan}</span>
                    </div>
                  ) : (
                    <span className="no-notes">-</span>
                  )}
                </td>
                <td className="text-right">
                  <span className="amount expense">{formatCurrency(transaction.nominal)}</span>
                </td>
                {(onEdit || onDelete) && (
                  <td>
                    <div className="action-buttons">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(transaction)}
                          className="action-btn edit-btn"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(transaction.id)}
                          className="action-btn delete-btn"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .expense-table-container {
          background: white;
          border-radius: var(--radius-2xl);
          padding: var(--space-6);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          animation: fadeIn 0.3s ease;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .expense-table {
          width: 100%;
          border-collapse: collapse;
        }

        .expense-table thead {
          border-bottom: 2px solid var(--border-color);
        }

        .expense-table th {
          padding: var(--space-3) var(--space-4);
          text-align: left;
          font-size: 0.813rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .expense-table th.text-right,
        .expense-table td.text-right {
          text-align: right;
        }

        .expense-table th.text-center {
          text-align: center;
        }

        .expense-table tbody tr {
          border-bottom: 1px solid var(--border-color);
          transition: background-color 0.2s;
        }

        .expense-table tbody tr:hover {
          background-color: var(--background-secondary);
        }

        .expense-table tbody tr:last-child {
          border-bottom: none;
        }

        .expense-table td {
          padding: var(--space-4);
          font-size: 0.875rem;
          color: var(--text-primary);
        }

        .date-cell {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--text-secondary);
        }

        .category-cell {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .category-icon {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #dc2626;
          flex-shrink: 0;
        }

        .transaction-name {
          font-weight: 500;
          color: var(--text-primary);
        }

        .notes-cell {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--text-secondary);
          font-size: 0.813rem;
        }

        .notes-cell span {
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .no-notes {
          color: var(--text-tertiary);
        }

        .amount {
          font-weight: 600;
          font-size: 0.938rem;
        }

        .amount.expense {
          color: #dc2626;
        }

        .action-buttons {
          display: flex;
          gap: var(--space-2);
          justify-content: center;
        }

        .action-btn {
          padding: var(--space-2);
          border: none;
          border-radius: var(--radius-lg);
          background: transparent;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn:hover {
          background: var(--background-secondary);
        }

        .edit-btn {
          color: var(--primary-500);
        }

        .edit-btn:hover {
          background: rgba(59, 130, 246, 0.1);
        }

        .delete-btn {
          color: #dc2626;
        }

        .delete-btn:hover {
          background: rgba(220, 38, 38, 0.1);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .expense-table-container {
            padding: var(--space-4);
          }

          .expense-table th,
          .expense-table td {
            padding: var(--space-3);
            font-size: 0.813rem;
          }

          .category-icon {
            width: 28px;
            height: 28px;
          }

          .notes-cell span {
            max-width: 100px;
          }
        }
      `}</style>
    </div>
  );
};
