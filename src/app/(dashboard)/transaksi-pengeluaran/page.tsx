'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
// import { useExpense } from '@/hooks/useExpense';
import { formatCurrency } from '@/utils/format';
import { IncomeTable, IncomeMonthFilter } from '@/components/income';

export default function TransaksiPengeluaranPage() {
  const router = useRouter();
  const { data: transactions, loading, totalExpense, fetch } = useExpense();
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    fetch();
  }, [fetch]);

  // Filter transactions based on selected month and year
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    
    return transactions.filter((transaction) => {
      const date = new Date(transaction.tanggal);
      const transactionYear = date.getFullYear();
      const transactionMonth = date.getMonth() + 1;

      if (transactionYear !== selectedYear) return false;
      if (selectedMonth !== null && transactionMonth !== selectedMonth) return false;

      return true;
    });
  }, [transactions, selectedMonth, selectedYear]);

  // Calculate total for filtered transactions
  const filteredTotal = useMemo(() => {
    return filteredTransactions.reduce((sum, t) => sum + Number(t.nominal), 0);
  }, [filteredTransactions]);

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="expense-page">
      {/* Header */}
      <div className="page-header">
        <button onClick={handleBack} className="back-btn">
          <ArrowLeft size={20} />
          <span>Kembali</span>
        </button>
        <h1 className="page-title">Transaksi Pengeluaran</h1>
      </div>

      {/* Summary Card */}
      <div className="summary-card">
        <div className="summary-icon">💸</div>
        <div className="summary-content">
          <span className="summary-label">
            {selectedMonth ? 'Total Pengeluaran Bulan Ini' : 'Total Pengeluaran'}
          </span>
          <span className="summary-amount">{formatCurrency(filteredTotal)}</span>
          <span className="summary-count">
            {filteredTransactions.length} transaksi
          </span>
        </div>
      </div>

      {/* Month Filter */}
      <IncomeMonthFilter
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={setSelectedMonth}
        onYearChange={setSelectedYear}
      />

      {/* Transactions Table */}
      <IncomeTable data={filteredTransactions} loading={loading} />

      <style jsx>{`
        .expense-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: var(--space-6);
        }

        .page-header {
          margin-bottom: var(--space-6);
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          padding: var(--space-2) 0;
          margin-bottom: var(--space-4);
          transition: color 0.2s;
        }

        .back-btn:hover {
          color: var(--primary-500);
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .summary-card {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          border-radius: var(--radius-2xl);
          padding: var(--space-6);
          margin-bottom: var(--space-6);
          display: flex;
          align-items: center;
          gap: var(--space-4);
          color: white;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
        }

        .summary-icon {
          font-size: 3rem;
          line-height: 1;
        }

        .summary-content {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .summary-label {
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .summary-amount {
          font-size: 2rem;
          font-weight: 700;
        }

        .summary-count {
          font-size: 0.875rem;
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .expense-page {
            padding: var(--space-4);
          }

          .page-title {
            font-size: 1.5rem;
          }

          .summary-amount {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
