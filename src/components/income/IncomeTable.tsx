'use client';

import React from 'react';
import { Calendar, FileText, Edit2, Trash2 } from 'lucide-react';
import { FontAwesomeIconDisplay } from '@/components/ui/FontAwesomeIconDisplay';
import { formatCurrency } from '@/utils/format';
import { Income } from '@/types/income';

interface IncomeTableProps {
  data: Income[];
  loading?: boolean;
  onEdit?: (transaction: Income) => void;
  onDelete?: (id: string) => void;
}

export const IncomeTable: React.FC<IncomeTableProps> = ({
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
      <div className="income-table-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Memuat data...</p>
        </div>
        <style jsx>{`
          .income-table-container {
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
            color: var(--text-muted);
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--gray-200);
            border-top-color: #4a90e2;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-bottom: var(--space-4);
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="income-table-container">
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>Belum ada transaksi</h3>
          <p>Transaksi pemasukan akan muncul di sini</p>
        </div>
        <style jsx>{`
          .income-table-container {
            background: white;
            border-radius: var(--radius-2xl);
            padding: var(--space-6);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          .empty-state {
            text-align: center;
            padding: var(--space-12);
            color: var(--text-muted);
          }
          .empty-icon {
            font-size: 4rem;
            margin-bottom: var(--space-4);
          }
          .empty-state h3 {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--text-primary);
            margin: 0 0 var(--space-2) 0;
          }
          .empty-state p {
            font-size: 0.875rem;
            margin: 0;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="income-table-container">
      <div className="table-wrapper">
        <table className="income-table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Nama</th>
              <th>Kategori</th>
              <th>Nominal</th>
              <th>Catatan</th>
              {(onEdit || onDelete) && <th>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((transaction) => (
              <tr key={transaction.id}>
                <td>
                  <div className="date-cell">
                    <Calendar size={14} />
                    <span>{formatDate(transaction.tanggal)}</span>
                  </div>
                </td>
                <td>
                  <div className="nama-cell">
                    {transaction.nama || transaction.category?.name || '-'}
                  </div>
                </td>
                <td>
                  <div className="category-cell">
                    <div className="category-icon">
                      <FontAwesomeIconDisplay
                        iconName={transaction.category?.icon || 'wallet'}
                        size="sm"
                      />
                    </div>
                    <span>{transaction.category?.name || 'Tidak ada kategori'}</span>
                  </div>
                </td>
                <td>
                  <span>{formatCurrency(transaction.nominal)}</span>
                </td>
                <td>
                  <div className="notes-cell">
                    {transaction.catatan ? (
                      <>
                        <FileText size={14} />
                        <span>{transaction.catatan}</span>
                      </>
                    ) : (
                      <span className="no-notes">-</span>
                    )}
                  </div>
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
        .income-table-container {
          background: white;
          border-radius: var(--radius-2xl);
          padding: var(--space-6);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .income-table {
          width: 100%;
          border-collapse: collapse;
        }

        .income-table thead th {
          background: var(--gray-50);
          padding: var(--space-4);
          text-align: left;
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.875rem;
        }

        tbody td {
          padding: var(--space-4);
          border-top: 1px solid var(--gray-100);
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        tbody tr:hover {
          background: var(--gray-50);
        }

        .nama-cell {
          font-weight: 600;
          color: var(--text-primary);
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .amount {
          font-weight: 600;
          color: var(--success);
        }

        .notes {
          color: var(--text-muted);
          max-width: 250px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .category-cell {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .category-icon {
          width: 32px;
          height: 32px;
          background: #10b98110;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4a90e2;
          flex-shrink: 0;
        }

        
        .notes-cell {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--text-secondary);
          max-width: 300px;
        }

        .notes-cell span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .no-notes {
          color: var(--text-muted);
        }

        .action-buttons {
          display: flex;
          gap: var(--space-2);
        }

        .action-btn {
          padding: var(--space-2);
          border: none;
          background: transparent;
          cursor: pointer;
          border-radius: var(--radius-md);
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .edit-btn {
          color: var(--primary-500);
        }

        .edit-btn:hover {
          background: var(--primary-50);
        }

        .delete-btn {
          color: #ef4444;
        }

        .delete-btn:hover {
          background: #fef2f2;
        }

        @media (max-width: 768px) {
          .income-table-container {
            padding: var(--space-4);
          }

          .table-wrapper {
            overflow-x: scroll;
            -webkit-overflow-scrolling: touch;
          }

          .income-table {
            min-width: 600px;
          }

          .income-table thead th,
          .income-table tbody td {
            padding: var(--space-3);
          }

         .notes-cell {
            max-width: 150px;
          }
        }
      `}</style>
    </div>
  );
};

export default IncomeTable;
