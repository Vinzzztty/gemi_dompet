'use client';

import React, { useState, useEffect } from 'react';
import {
  WalletIcon,
  UtensilsIcon,
  CarIcon,
  ShoppingBagIcon,
  FilmIcon,
  CalendarIcon,
  TrendingUpIcon,
  CoinIcon
} from '@/components/icons';
import { CategoryType } from '@/types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (transaction: TransactionFormData) => void;
}

interface TransactionFormData {
  type: 'income' | 'expense';
  amount: number;
  category: CategoryType;
  date: string;
  notes: string;
}

// Categories for expense (Pengeluaran)
const expenseCategories = [
  { id: 'makan_minum' as CategoryType, name: 'Makan & Minum', icon: UtensilsIcon },
  { id: 'transport' as CategoryType, name: 'Transport', icon: CarIcon },
  { id: 'belanja' as CategoryType, name: 'Belanja', icon: ShoppingBagIcon },
  { id: 'hiburan' as CategoryType, name: 'Hiburan', icon: FilmIcon },
  { id: 'lainnya' as CategoryType, name: 'Lainnya', icon: WalletIcon },
];

// Categories for income (Pemasukan)
const incomeCategories = [
  { id: 'gaji' as CategoryType, name: 'Gaji', icon: WalletIcon },
  { id: 'investasi' as CategoryType, name: 'Investasi', icon: TrendingUpIcon },
  { id: 'lainnya' as CategoryType, name: 'Lainnya', icon: CoinIcon },
];

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<CategoryType>('makan_minum');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');

  // Get the current categories based on transaction type
  const currentCategories = type === 'expense' ? expenseCategories : incomeCategories;

  // Reset category when type changes
  useEffect(() => {
    if (type === 'expense') {
      setCategory('makan_minum');
    } else {
      setCategory('gaji');
    }
  }, [type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave && amount) {
      onSave({
        type,
        amount: parseFloat(amount.replace(/\D/g, '')),
        category,
        date,
        notes,
      });
    }
    handleClose();
  };

  const handleClose = () => {
    setType('expense');
    setAmount('');
    setCategory('makan_minum');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    onClose();
  };

  const formatAmount = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    return new Intl.NumberFormat('id-ID').format(parseInt(numbers));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(formatAmount(e.target.value));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="header-left">
            <div className="header-icon">
              <WalletIcon size={20} />
            </div>
            <div className="header-text">
              <h2 className="modal-title">Catat Transaksi</h2>
              <p className="modal-subtitle">Tambahkan transaksi baru dengan mudah</p>
            </div>
          </div>
          <button className="close-btn" onClick={handleClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Type Toggle */}
          <div className="type-toggle">
            <button
              type="button"
              className={`toggle-btn ${type === 'expense' ? 'active' : ''}`}
              onClick={() => setType('expense')}
            >
              <span className="toggle-emoji">💸</span>
              Pengeluaran
            </button>
            <button
              type="button"
              className={`toggle-btn ${type === 'income' ? 'active' : ''}`}
              onClick={() => setType('income')}
            >
              <span className="toggle-emoji">💰</span>
              Pemasukan
            </button>
          </div>

          {/* Nominal Input */}
          <div className="form-group">
            <label className="form-label">
              <WalletIcon size={16} />
              Nominal
            </label>
            <div className="amount-input-wrapper">
              <span className="currency-prefix">Rp</span>
              <input
                type="text"
                className="amount-input"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0"
              />
            </div>
          </div>

          {/* Category Selection */}
          <div className="form-group">
            <label className="form-label">Kategori</label>
            <div className="category-grid">
              {currentCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`category-btn ${category === cat.id ? 'active' : ''}`}
                    onClick={() => setCategory(cat.id)}
                  >
                    {category === cat.id && <span className="check-mark">✓</span>}
                    <div className="category-icon">
                      <Icon size={24} />
                    </div>
                    <span className="category-name">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Input */}
          <div className="form-group">
            <label className="form-label">
              <CalendarIcon size={16} />
              Tanggal
            </label>
            <div className="date-input-wrapper">
              <input
                type="date"
                className="date-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {/* Notes Input */}
          <div className="form-group">
            <label className="form-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Catatan <span className="optional">(opsional)</span>
            </label>
            <textarea
              className="notes-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Makan siang di warung..."
              rows={2}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn">
            Simpan
          </button>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: var(--space-4);
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-container {
          background-color: var(--bg-card);
          border-radius: var(--radius-2xl);
          width: 100%;
          max-width: 400px;
          max-height: 90vh;
          overflow-y: auto;
          padding: var(--space-6);
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: var(--space-6);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .header-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-lg);
          background-color: var(--primary-100);
          color: var(--primary-600);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-text {
          display: flex;
          flex-direction: column;
        }

        .modal-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .modal-subtitle {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: var(--space-1);
          border-radius: var(--radius);
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background-color: var(--gray-100);
          color: var(--text-primary);
        }

        .type-toggle {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-2);
          background-color: var(--gray-100);
          padding: var(--space-1);
          border-radius: var(--radius-full);
          margin-bottom: var(--space-5);
        }

        .toggle-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          padding: var(--space-3);
          border: none;
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          background-color: transparent;
          color: var(--text-secondary);
        }

        .toggle-btn.active {
          background-color: var(--primary-500);
          color: white;
          box-shadow: var(--shadow);
        }

        .toggle-emoji {
          font-size: 1rem;
        }

        .form-group {
          margin-bottom: var(--space-5);
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: var(--space-2);
        }

        .optional {
          font-weight: 400;
          color: var(--text-muted);
        }

        .amount-input-wrapper {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-4);
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-lg);
          background-color: var(--gray-50);
          transition: all 0.2s ease;
        }

        .amount-input-wrapper:focus-within {
          border-color: var(--primary-500);
          background-color: white;
        }

        .currency-prefix {
          font-size: 1rem;
          font-weight: 500;
          color: var(--primary-500);
        }

        .amount-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          outline: none;
        }

        .amount-input::placeholder {
          color: var(--text-muted);
          font-weight: 400;
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-2);
        }

        .category-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-4);
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-xl);
          background-color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .category-btn:hover {
          border-color: var(--primary-300);
        }

        .category-btn.active {
          border-color: var(--primary-500);
          background-color: var(--primary-50);
        }

        .check-mark {
          position: absolute;
          top: var(--space-2);
          right: var(--space-2);
          width: 16px;
          height: 16px;
          border-radius: var(--radius-full);
          background-color: var(--primary-500);
          color: white;
          font-size: 0.625rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .category-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-lg);
          background-color: var(--primary-100);
          color: var(--primary-600);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .category-btn.active .category-icon {
          background-color: var(--primary-200);
        }

        .category-name {
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-align: center;
        }

        .date-input-wrapper {
          position: relative;
        }

        .date-input {
          width: 100%;
          padding: var(--space-4);
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-lg);
          background-color: var(--gray-50);
          font-size: 0.9375rem;
          color: var(--text-primary);
          outline: none;
          transition: all 0.2s ease;
        }

        .date-input:focus {
          border-color: var(--primary-500);
          background-color: white;
        }

        .notes-input {
          width: 100%;
          padding: var(--space-4);
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-lg);
          background-color: var(--gray-50);
          font-size: 0.9375rem;
          color: var(--text-primary);
          outline: none;
          resize: none;
          font-family: inherit;
          transition: all 0.2s ease;
        }

        .notes-input:focus {
          border-color: var(--primary-500);
          background-color: white;
        }

        .notes-input::placeholder {
          color: var(--text-muted);
        }

        .submit-btn {
          width: 100%;
          padding: var(--space-4);
          border: none;
          border-radius: var(--radius-xl);
          background-color: var(--primary-500);
          color: white;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .submit-btn:hover {
          background-color: var(--primary-600);
        }

        .submit-btn:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
};

export default AddTransactionModal;
