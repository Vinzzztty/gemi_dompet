'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCategory } from '@/hooks/useCategory';
import { useExpense } from '@/hooks/useExpense';
import type { ExpenseTransaction, CreateExpenseRequest } from '@/types/expense';
import { CategoryType } from '@/types';

interface EditExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: ExpenseTransaction | null;
  onSuccess?: () => void;
}

export const EditExpenseModal: React.FC<EditExpenseModalProps> = ({
  isOpen,
  onClose,
  transaction,
  onSuccess,
}) => {
  const { categories, loading: loadingCategories, fetchCategories } = useCategory();
  const { update, loading } = useExpense();

  const [formData, setFormData] = useState({
    nama: '',
    nominal: '',
    categoryId: '',
    tanggal: '',
    catatan: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load categories and populate form
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (transaction) {
        setFormData({
          nama: transaction.nama || '',
          nominal: transaction.nominal.toString(),
          categoryId: transaction.categoryId,
          tanggal: transaction.tanggal.split('T')[0], // Format YYYY-MM-DD
          catatan: transaction.catatan || '',
        });
      }
    }
  }, [isOpen, transaction, fetchCategories]);

  // Filter expense categories
  const expenseCategories = categories.filter((cat) => cat.type === 'EXPENSE');

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama transaksi harus diisi';
    }

    if (!formData.nominal || Number(formData.nominal) <= 0) {
      newErrors.nominal = 'Nominal harus lebih besar dari 0';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Kategori harus dipilih';
    }

    if (!formData.tanggal) {
      newErrors.tanggal = 'Tanggal harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('=== Edit Expense Submit ===');
    console.log('Transaction:', transaction);
    console.log('Form Data:', formData);

    if (!validate() || !transaction) {
      console.log('Validation failed or no transaction');
      return;
    }

    const updatePayload = {
      nama: formData.nama.trim(),
      nominal: Number(formData.nominal),
      categoryId: formData.categoryId,
      tanggal: new Date(formData.tanggal).toISOString(),
      catatan: formData.catatan.trim() || undefined,
    };

    console.log('Update Payload:', updatePayload);

    const result = await update(transaction.id, updatePayload);

    console.log('Update Result:', result);

    // Check if update was successful (result will be the updated transaction object or null)
    if (!result) {
      console.error('Update failed - no result returned');
      // Show error toast
      return;
    }

    console.log('Update successful, closing modal');
    // Success: close modal and trigger parent refresh
    onSuccess?.();
    onClose();
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({ nama: '', nominal: '', categoryId: '', tanggal: '', catatan: '' });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen || !transaction) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>Edit Pengeluaran</h2>
          <button onClick={handleClose} className="close-btn" disabled={loading}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-body">
          {/* Nama */}
          <div className="form-group">
            <label htmlFor="nama">Nama Transaksi *</label>
            <input
              id="nama"
              type="text"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className={errors.nama ? 'error' : ''}
              placeholder="Contoh: Belanja Bulanan"
              disabled={loading}
            />
            {errors.nama && <span className="error-text">{errors.nama}</span>}
          </div>

          {/* Nominal */}
          <div className="form-group">
            <label htmlFor="nominal">Nominal *</label>
            <input
              id="nominal"
              type="number"
              value={formData.nominal}
              onChange={(e) => setFormData({ ...formData, nominal: e.target.value })}
              className={errors.nominal ? 'error' : ''}
              placeholder="0"
              disabled={loading}
            />
            {errors.nominal && <span className="error-text">{errors.nominal}</span>}
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">Kategori *</label>
            <select
              id="category"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className={errors.categoryId ? 'error' : ''}
              disabled={loading || loadingCategories}
            >
              <option value="">Pilih Kategori</option>
              {expenseCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <span className="error-text">{errors.categoryId}</span>}
          </div>

          {/* Tanggal */}
          <div className="form-group">
            <label htmlFor="tanggal">Tanggal *</label>
            <input
              id="tanggal"
              type="date"
              value={formData.tanggal}
              onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
              className={errors.tanggal ? 'error' : ''}
              disabled={loading}
            />
            {errors.tanggal && <span className="error-text">{errors.tanggal}</span>}
          </div>

          {/* Catatan */}
          <div className="form-group">
            <label htmlFor="catatan">Catatan (Opsional)</label>
            <textarea
              id="catatan"
              value={formData.catatan}
              onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
              placeholder="Tambahkan catatan..."
              rows={3}
              disabled={loading}
            />
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-cancel"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
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

        .modal-content {
          background: white;
          border-radius: var(--radius-2xl);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.3s ease;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-6);
          border-bottom: 1px solid var(--border-color);
        }

        .modal-header h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: var(--space-2);
          border-radius: var(--radius-lg);
          transition: all 0.2s;
        }

        .close-btn:hover:not(:disabled) {
          background: var(--background-secondary);
        }

        .close-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .modal-body {
          padding: var(--space-6);
          overflow-y: auto;
        }

        .form-group {
          margin-bottom: var(--space-5);
        }

        .form-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: var(--space-2);
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: var(--space-3);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          font-size: 0.938rem;
          transition: all 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }

        .form-group input.error,
        .form-group select.error {
          border-color: #dc2626;
        }

        .form-group input:disabled,
        .form-group select:disabled,
        .form-group textarea:disabled {
          background: var(--background-secondary);
          cursor: not-allowed;
        }

        .error-text {
          display: block;
          font-size: 0.813rem;
          color: #dc2626;
          margin-top: var(--space-2);
        }

        .modal-footer {
          display: flex;
          gap: var(--space-3);
          margin-top: var(--space-6);
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

        .btn-primary {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(220, 38, 38, 0.2);
        }

        .btn-primary:hover:not(:disabled) {
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
      `}</style>
    </div>
  );
};
