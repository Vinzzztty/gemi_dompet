'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useIncome } from '@/hooks/useIncome';
import { formatCurrency } from '@/utils/format';
import { IncomeTable, IncomeMonthFilter } from '@/components/income';
import { EditIncomeModal } from '@/components/income/EditIncomeModal';
import { DeleteConfirmDialog } from '@/components/ui/DeleteConfirmDialog';
import type { IncomeTransaction } from '@/types/income';

export default function IncomePage() {
  const router = useRouter();
  const { data: transactions, loading, remove, fetch } = useIncome();
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  
  // Edit/Delete state
  const [editTransaction, setEditTransaction] = useState<IncomeTransaction | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string>('');
  const [deleting, setDeleting] = useState(false);

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

      // Filter by year
      if (transactionYear !== selectedYear) return false;

      // Filter by month if selected
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

  // CRUD Handlers
  const handleEdit = (transaction: IncomeTransaction) => {
    setEditTransaction(transaction);
  };

  const handleDelete = (id: string) => {
    const transaction = transactions?.find(t => t.id === id);
    if (transaction) {
      setDeleteId(id);
      setDeleteName(transaction.nama || 'transaksi ini');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);
    const result = await remove(deleteId);
    setDeleting(false);

    if (result) {
      // Close dialog
      setDeleteId(null);
      setDeleteName('');
      
      // Show success toast
      toast.success('Pemasukan berhasil dihapus');
      
      // Refresh list
      fetch();
    }
  };

  const handleEditSuccess = () => {
    // Show success toast
    toast.success('Pemasukan berhasil diperbarui');
    
    // Refresh list
    fetch();
  };

  return (
    <div className="income-page">
      {/* Header */}
      <div className="page-header">
        <button onClick={handleBack} className="back-btn">
          <ArrowLeft size={20} />
          <span>Kembali</span>
        </button>
        <h1 className="page-title">Daftar Pemasukan</h1>
      </div>
      

      {/* Summary Card */}
      <div className="summary-card">
        <div className="summary-icon">💰</div>
        <div className="summary-content">
          <span className="summary-label">
            {selectedMonth ? 'Total Pemasukan Bulan Ini' : 'Total Pemasukan'}
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
      <IncomeTable 
        data={filteredTransactions} 
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Edit Modal */}
      <EditIncomeModal
        isOpen={!!editTransaction}
        onClose={() => setEditTransaction(null)}
        transaction={editTransaction}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        itemName={deleteName}
        loading={deleting}
      />

      <style jsx>{`
        .income-page {
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
          background: linear-gradient(135deg, #4a90e2 0%, #3b7dd8 100%);
          border-radius: var(--radius-2xl);
          padding: var(--space-6);
          color: white;
          margin-bottom: var(--space-6);
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
          .income-page {
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
