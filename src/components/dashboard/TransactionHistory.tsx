'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import TransactionItem from './TransactionItem';
import FilterDropdown from './FilterDropdown';
import { Transaction } from '@/types';
import { useIncome } from '@/hooks/useIncome';

interface TransactionHistoryProps {
  transactions: Transaction[];
  totalIncome?: number;
  totalExpense?: number;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  totalIncome = 0,
  totalExpense = 0
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'income' | 'expense'>('all');
  
  // Fetch real income data from backend
  const { data: incomeData, loading: incomeLoading, fetch: fetchIncome } = useIncome();

  useEffect(() => {
    // Fetch income data when component mounts or when switching to income tab
    if (activeTab === 'income') {
      fetchIncome();
    }
  }, [activeTab, fetchIncome]);

  // Filter transactions based on active tab and limit to 10 latest
  const filteredTransactions = useMemo(() => {
    let filtered: any[] = [];

    if (activeTab === 'income') {
      // Use real backend data for income
      if (incomeData && incomeData.length > 0) {
        // Transform income data to Transaction format
        filtered = incomeData.map((income) => {
          // Ensure date is in proper format
          const transactionDate = income.tanggal || new Date().toISOString();
          
          return {
            id: income.id,
            type: 'income' as const,
            amount: income.nominal,
            description: income.nama || income.category?.name || 'Pemasukan',
            category: {
              id: income.categoryId || '',
              name: income.category?.name || 'Pemasukan',
              icon: income.category?.icon || 'wallet',
            },
            date: transactionDate,
            notes: income.catatan || '',
            icon: income.category?.icon || 'wallet',
          };
        });
      }
    } else if (activeTab === 'expense') {
      filtered = transactions.filter(t => t.type === 'expense');
    } else {
      // For 'all', combine mock transactions (will be updated later with real expense data)
      filtered = transactions;
    }

    // Sort by date (newest first) and limit to 10
    return filtered
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        // Handle invalid dates
        if (isNaN(dateA.getTime())) return 1;
        if (isNaN(dateB.getTime())) return -1;
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 10);
  }, [transactions, activeTab, incomeData]);

  const handleViewAll = () => {
    if (activeTab === 'income') {
      router.push('/transaksi-pemasukan');
    } else if (activeTab === 'expense') {
      router.push('/transaksi-pengeluaran');
    }
  };

    return (
      <div className="transaction-history card">
        <div className="history-header">
          <h3 className="history-title">Riwayat Transaksi</h3>
          <FilterDropdown />
        </div>

        <div className="transaction-tabs">
          <button
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Semua
          </button>
          <button
            className={`tab ${activeTab === 'income' ? 'active' : ''}`}
            onClick={() => setActiveTab('income')}
          >
            Pemasukan
          </button>
          <button
            className={`tab ${activeTab === 'expense' ? 'active' : ''}`}
            onClick={() => setActiveTab('expense')}
          >
            Pengeluaran
          </button>
        </div>

      <div className="transaction-list">
        {incomeLoading && activeTab === 'income' ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <span>Memuat data...</span>
          </div>
        ) : (
          <>
            {filteredTransactions.map(transaction => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
            
            {filteredTransactions.length === 0 && (
              <div className="empty-state">
                <p>Belum ada transaksi</p>
              </div>
            )}
          </>
        )}
      </div>

        {/* View All Button - only show for income/expense tabs */}
        {(activeTab === 'income' || activeTab === 'expense') && filteredTransactions.length > 0 && (
          <div className="view-all-container">
            <button onClick={handleViewAll} className="view-all-btn">
              <span>Lihat Semua Transaksi</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        <style jsx>{`
          .transaction-history {
            background-color: var(--bg-card);
            border-radius: var(--radius-xl);
            padding: var(--space-5);
            box-shadow: var(--shadow);
          }

          .history-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--space-5);
          }

          .history-title {
            font-size: 1rem;
            font-weight: 600;
            color: var(--text-primary);
            margin: 0;
          }

          .transaction-tabs {
          display: flex;
          gap: var(--space-2);
          margin-bottom: var(--space-5);
          background: var(--gray-100);
          padding: var(--space-1);
          border-radius: var(--radius-xl);
          width: fit-content;
        }

        .tab {
          padding: var(--space-2) var(--space-5);
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border-radius: var(--radius-lg);
        }

        .tab:hover {
          color: var(--text-primary);
        }

        .tab.active {
          background: white;
          color: var(--primary-600);
          font-weight: 600;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .transaction-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          max-height: 400px;
          overflow-y: auto;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-8);
          gap: var(--space-3);
          color: var(--text-muted);
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--gray-200);
          border-top-color: var(--primary-500);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .empty-state {
          text-align: center;
          padding: var(--space-8);
          color: var(--text-muted);
        }

        .view-all-container {
          margin-top: var(--space-5);
          padding-top: var(--space-4);
          border-top: 1px solid var(--gray-200);
        }

        .view-all-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          width: 100%;
          padding: var(--space-3);
          background: var(--primary-50);
          color: var(--primary-600);
          border: none;
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-all-btn:hover {
          background: var(--primary-100);
          color: var(--primary-700);
        }

        @media (max-width: 480px) {
          .transaction-tabs {
            gap: var(--space-1);
            width: 100%;
          }
          
          .tab {
            flex: 1;
            text-align: center;
            padding: var(--space-2) var(--space-3);
            font-size: 0.8125rem;
          }
        }
        `}</style>
      </div>
    );
  };

  export default TransactionHistory;
