'use client';

import React, { useState } from 'react';
import {
  Header,
  BalanceCard,
  SummaryCard,
  CategoryChart,
  TransactionHistory,
  FloatingActionButton,
  FloatingReportButton,
  AddTransactionModal
} from '@/components/dashboard';
import Toast from '@/components/dashboard/Toast';
import { mockSummary, mockTransactions, mockCategorySpending } from '@/data/mockData';

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  const handleAddTransaction = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveTransaction = (data: {
    type: 'income' | 'expense';
    amount: number;
    category: string;
    date: string;
    notes: string;
  }) => {
    console.log('New transaction:', data);
    // Here you would normally save to your backend/state
    setIsModalOpen(false);

    // Show success toast
    const typeLabel = data.type === 'income' ? 'Pemasukan' : 'Pengeluaran';
    setToastMessage(`${typeLabel} berhasil disimpan!`);
    setToastType('success');
    setShowToast(true);
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <Header />

      {/* Greeting */}
      <div className="greeting">
        <h2 className="greeting-title">Halo! 👋</h2>
        <p className="greeting-subtitle">Kelola keuanganmu dengan tenang</p>
      </div>

      {/* Balance Card */}
      <BalanceCard summary={mockSummary} />

      {/* Summary Cards */}
      <div className="summary-grid">
        <SummaryCard
          title="Pemasukan"
          amount={mockSummary.income}
          type="income"
          period="Bulan ini"
        />
        <SummaryCard
          title="Pengeluaran"
          amount={mockSummary.expense}
          type="expense"
          period="Bulan ini"
        />
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Category Chart */}
        <CategoryChart data={mockCategorySpending} />

        {/* Transaction History */}
        <TransactionHistory
          transactions={mockTransactions}
          totalIncome={mockSummary.income}
          totalExpense={mockSummary.expense}
        />
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={handleAddTransaction} />

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTransaction}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      <style jsx>{`
        .dashboard {
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .greeting {
          margin-bottom: var(--space-6);
        }

        .greeting-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 var(--space-1) 0;
        }

        .greeting-subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-4);
          margin-bottom: var(--space-6);
        }

        .content-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-6);
        }

        @media (max-width: 768px) {
          .content-grid {
            grid-template-columns: 1fr;
            gap: var(--space-4);
          }
        }

        @media (max-width: 640px) {
          .summary-grid {
            grid-template-columns: 1fr;
            gap: var(--space-3);
          }

          .greeting-title {
            font-size: 1.25rem;
          }
          
          .dashboard {
             padding-bottom: 80px; /* Space for FAB */
          }
        }
      `}</style>
    </div>
  );
}
