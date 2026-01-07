'use client';

import React, { useState } from 'react';
import { Transaction, TransactionFilter } from '@/types';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, FolderIcon, CoinIcon, TrendingDownIcon } from '@/components/icons';
import { formatNumber, getMonthName } from '@/utils/format';
import TransactionItem from './TransactionItem';
import FilterDropdown from './FilterDropdown';

interface TransactionHistoryProps {
  transactions: Transaction[];
  totalIncome: number;
  totalExpense: number;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  totalIncome,
  totalExpense
}) => {
  const [filter, setFilter] = useState<TransactionFilter>('all');
  const [currentMonth, setCurrentMonth] = useState(0); // January 2026
  const [currentYear, setCurrentYear] = useState(2026);

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="transaction-history card">
      <div className="history-header">
        <div className="history-title-section">
          <h3 className="history-title">Riwayat Transaksi</h3>
          <span className="transaction-count">{filteredTransactions.length} transaksi</span>
        </div>
        <div className="month-nav">
          <button className="btn btn-icon btn-ghost" onClick={handlePrevMonth}>
            <ChevronLeftIcon size={18} />
          </button>
          <div className="month-display">
            <CalendarIcon size={16} />
            <span>{getMonthName(currentMonth)} {currentYear}</span>
          </div>
          <button className="btn btn-icon btn-ghost" onClick={handleNextMonth}>
            <ChevronRightIcon size={18} />
          </button>
        </div>
      </div>

      <div className="filter-tabs">
        <button
          className={`tab ${filter === 'all' ? 'tab-active' : ''}`}
          onClick={() => setFilter('all')}
        >
          <FolderIcon size={16} />
          Semua
        </button>
        <button
          className={`tab ${filter === 'income' ? 'tab-active' : ''}`}
          onClick={() => setFilter('income')}
        >
          <CoinIcon size={16} />
          Pemasukan
        </button>
        <button
          className={`tab ${filter === 'expense' ? 'tab-active' : ''}`}
          onClick={() => setFilter('expense')}
        >
          <TrendingDownIcon size={16} />
          Pengeluaran
        </button>
        <FilterDropdown />
      </div>

      <div className="summary-boxes">
        <div className="summary-box income">
          <span className="summary-box-label">Pemasukan</span>
          <span className="summary-box-amount">+Rp {formatNumber(totalIncome)}</span>
        </div>
        <div className="summary-box expense">
          <span className="summary-box-label">Pengeluaran</span>
          <span className="summary-box-amount">-Rp {formatNumber(totalExpense)}</span>
        </div>
      </div>

      <div className="transaction-list">
        {filteredTransactions.map(transaction => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>

      <style jsx>{`
        .transaction-history {
          background-color: var(--bg-card);
          border-radius: var(--radius-xl);
          padding: var(--space-5);
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .history-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: var(--space-4);
          flex-wrap: wrap;
          gap: var(--space-3);
        }

        .history-title-section {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .history-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .transaction-count {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .month-nav {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          background-color: var(--gray-50);
          border-radius: var(--radius-full);
          padding: var(--space-1);
        }

        .month-display {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .filter-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
          margin-bottom: var(--space-4);
          overflow-x: auto;
        }

        .filter-btn {
          margin-left: auto;
        }

        .summary-boxes {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-3);
          margin-bottom: var(--space-4);
        }

        .summary-box {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
          padding: var(--space-3);
          border-radius: var(--radius-lg);
          border: 1px solid var(--gray-200);
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .summary-box:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .summary-box.income {
          border-color: var(--success-light);
          background-color: rgba(16, 185, 129, 0.05);
        }

        .summary-box.income:hover {
          background-color: rgba(16, 185, 129, 0.1);
        }

        .summary-box.expense {
          border-color: var(--danger-light);
          background-color: rgba(239, 68, 68, 0.05);
        }

        .summary-box.expense:hover {
          background-color: rgba(239, 68, 68, 0.1);
        }

        .summary-box-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .summary-box-amount {
          font-size: 0.875rem;
          font-weight: 600;
        }

        .summary-box.income .summary-box-amount {
          color: var(--success);
        }

        .summary-box.expense .summary-box-amount {
          color: var(--danger);
        }

        .transaction-list {
          max-height: 400px;
          overflow-y: auto;
          overflow-x: hidden;
        }

        @media (max-width: 480px) {
          .filter-tabs {
            gap: var(--space-1);
          }

          .filter-btn {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default TransactionHistory;
