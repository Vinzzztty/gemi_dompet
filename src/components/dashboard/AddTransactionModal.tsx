'use client';

import React, { useState, useEffect } from 'react';
import {
  WalletIcon,
  CalendarIcon,
} from '@/components/icons';
import { CategoryType } from '@/types';
import { useCategory } from '@/hooks/useCategory';
import { useIncome } from '@/hooks/useIncome';
import { useExpense } from '@/hooks/useExpense';
import { toast } from 'sonner';
import type { Category } from '@/types/income';
import { IconPicker } from '@/components/ui/IconPicker';
import { FontAwesomeIconDisplay } from '@/components/ui/FontAwesomeIconDisplay';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (transaction: TransactionFormData) => void;
}

interface TransactionFormData {
  type: 'income' | 'expense' | 'transaction';
  amount: number;
  category: CategoryType;
  date: string;
  name: string;
  notes: string;
}

// Default icon for categories
const DefaultCategoryIcon = WalletIcon;

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [type, setType] = useState<'income' | 'expense' | 'transaction'>('expense');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [name, setName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  // Category creation/edit fields
  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryType, setCategoryType] = useState<'income' | 'expense'>('income');
  const [selectedIcon, setSelectedIcon] = useState<string>('wallet');
  
  // Category management state
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

  // Use category hook to manage categories
  const { 
    categories, 
    loading: loadingCategories, 
    fetchIncomeCategories, 
    fetchExpenseCategories,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  } = useCategory();

  // Use income and expense hooks for transaction creation
  const { create: createIncome, loading: savingIncome } = useIncome();
  const { create: createExpense, loading: savingExpense } = useExpense();
  
  const savingTransaction = savingIncome || savingExpense;

  // Fetch all categories when category tab is active
  useEffect(() => {
    if (type === 'transaction') {
      fetchCategories(); // Fetch all categories
    } else if (type === 'expense') {
      fetchExpenseCategories();
    } else if (type === 'income') {
      fetchIncomeCategories();
    }
    // Reset selected category when switching types
    setCategory('');
  }, [type, fetchExpenseCategories, fetchIncomeCategories, fetchCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Handle category edit
    if (type === 'transaction' && editingCategoryId) {
      if (!categoryName.trim()) {
        toast.error('Nama kategori harus diisi');
        return;
      }
      
      const result = await updateCategory(editingCategoryId, {
        name: categoryName,
        type: categoryType === 'income' ? 'INCOME' : 'EXPENSE',
        icon: selectedIcon
      });
      
      if (result) {
        toast.success('Kategori berhasil diupdate!');
        handleCancelCategoryForm();
      } else {
        toast.error('Gagal mengupdate kategori');
      }
      return;
    }
    
    // Handle category creation
    if (type === 'transaction' && (isCreatingNew || !editingCategoryId)) {
      if (!categoryName.trim()) {
        toast.error('Nama kategori harus diisi');
        return;
      }
      
      const result = await createCategory({
        name: categoryName,
        type: categoryType === 'income' ? 'INCOME' : 'EXPENSE',
        icon: selectedIcon
      });
      
      if (result) {
        toast.success('Kategori berhasil ditambahkan!');
        handleCancelCategoryForm();
      } else {
        toast.error('Gagal menambahkan kategori');
      }
      return;
    }
    
    // Handle income/expense transaction creation
    if (type === 'income' || type === 'expense') {
      // Validation
      if (!amount || parseFloat(amount.replace(/\D/g, '')) <= 0) {
        toast.error('Nominal harus diisi dan lebih besar dari 0');
        return;
      }

      if (!category) {
        toast.error('Kategori harus dipilih');
        return;
      }

      if (!date) {
        toast.error('Tanggal harus diisi');
        return;
      }

      // Prepare transaction data
      const transactionData = {
        nama: name.trim() || (type === 'income' ? 'Pemasukan' : 'Pengeluaran'), // Add nama field
        nominal: parseFloat(amount.replace(/\D/g, '')),
        categoryId: category,
        tanggal: date,
        catatan: notes.trim() || undefined,
      };

      // Create transaction based on type
      let result;
      if (type === 'income') {
        result = await createIncome(transactionData);
      } else {
        result = await createExpense(transactionData);
      }

      if (result) {
        toast.success(`${type === 'income' ? 'Pemasukan' : 'Pengeluaran'} berhasil ditambahkan!`);
        handleClose();
        // Call onSave callback if provided (for parent refresh)
        if (onSave) {
          onSave({
            type,
            amount: transactionData.nominal,
            category: category as CategoryType,
            date,
            name,
            notes,
          });
        }
      } else {
        toast.error(`Gagal menambahkan ${type === 'income' ? 'pemasukan' : 'pengeluaran'}`);
      }
      return;
    }
  };

  const handleClose = () => {
    setType('expense');
    setAmount('');
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
    setName('');
    setNotes('');
    setCategoryName('');
    setCategoryType('income');
    setSelectedIcon('wallet');
    setIsCreatingNew(false);
    setEditingCategoryId(null);
    setDeletingCategoryId(null);
    onClose();
  };

  // Category management handlers
  const handleEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setCategoryName(category.name);
    setCategoryType(category.type === 'INCOME' ? 'income' : 'expense');
    setSelectedIcon(category.icon || 'wallet');
    setIsCreatingNew(false);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const success = await deleteCategory(categoryId);
    if (success) {
      toast.success('Kategori berhasil dihapus!');
      setDeletingCategoryId(null);
    } else {
      // Error message already set in hook
      toast.error(loadingCategories ? 'Gagal menghapus kategori' : 'Gagal menghapus kategori');
    }
  };

  const handleCancelCategoryForm = () => {
    setIsCreatingNew(false);
    setEditingCategoryId(null);
    setCategoryName('');
    setCategoryType('income');
    setSelectedIcon('wallet');
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
    <>
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
            <button
              type="button"
              className={`toggle-btn ${type === 'transaction' ? 'active' : ''}`}
              onClick={() => setType('transaction')}
            >
              <span className="toggle-emoji">💳</span>
              Kategori
            </button>
          </div>

          {/* Conditional rendering based on tab */}
          {type === 'transaction' ? (
            <>
              {!isCreatingNew && !editingCategoryId ? (
                // CATEGORY LIST VIEW
                <>
                  <div className="category-header">
                    <h3 className="section-title">Daftar Kategori</h3>
                    <button
                      type="button"
                      className="add-category-btn"
                      onClick={() => setIsCreatingNew(true)}
                    >
                      <span>➕</span> Tambah Kategori
                    </button>
                  </div>

                  {loadingCategories ? (
                    <div className="loading-state">Memuat kategori...</div>
                  ) : categories.length === 0 ? (
                    <div className="empty-state">
                      <p>Belum ada kategori</p>
                      <p className="hint">Klik "Tambah Kategori" untuk membuat kategori baru</p>
                    </div>
                  ) : (
                    <div className="category-list">
                      {/* Income Categories */}
                      {categories.filter(cat => cat.type === 'INCOME').length > 0 && (
                        <div className="category-group">
                          <h4 className="group-title">💰 Pemasukan</h4>
                          <div className="category-items">
                            {categories
                              .filter(cat => cat.type === 'INCOME')
                              .map(cat => (
                                <div key={cat.id} className="category-item">
                                  <div className="category-info">
                                    <FontAwesomeIconDisplay iconName={cat.icon || 'wallet'} size="lg" />
                                    <span className="category-item-name">{cat.name}</span>
                                  </div>
                                  <div className="category-actions">
                                    <button
                                      type="button"
                                      className="edit-btn"
                                      onClick={() => handleEditCategory(cat)}
                                      title="Edit"
                                    >
                                      ✏️
                                    </button>
                                    <button
                                      type="button"
                                      className="delete-btn"
                                      onClick={() => setDeletingCategoryId(cat.id)}
                                      title="Hapus"
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Expense Categories */}
                      {categories.filter(cat => cat.type === 'EXPENSE').length > 0 && (
                        <div className="category-group">
                          <h4 className="group-title">💸 Pengeluaran</h4>
                          <div className="category-items">
                            {categories
                              .filter(cat => cat.type === 'EXPENSE')
                              .map(cat => (
                                <div key={cat.id} className="category-item">
                                  <div className="category-info">
                                    <FontAwesomeIconDisplay iconName={cat.icon || 'wallet'} size="lg" />
                                    <span className="category-item-name">{cat.name}</span>
                                  </div>
                                  <div className="category-actions">
                                    <button
                                      type="button"
                                      className="edit-btn"
                                      onClick={() => handleEditCategory(cat)}
                                      title="Edit"
                                    >
                                      ✏️
                                    </button>
                                    <button
                                      type="button"
                                      className="delete-btn"
                                      onClick={() => setDeletingCategoryId(cat.id)}
                                      title="Hapus"
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                // CREATE/EDIT FORM
                <>
                  <div className="form-header">
                    <h3 className="form-title">
                      {editingCategoryId ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                    </h3>
                    <button
                      type="button"
                      className="cancel-btn-sm"
                      onClick={handleCancelCategoryForm}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 7h16M4 12h16M4 17h10" />
                      </svg>
                      Nama Kategori
                    </label>
                    <input
                      type="text"
                      className="text-input"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      placeholder="Contoh: Makanan & Minuman"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tipe Kategori</label>
                    <div className="category-type-toggle">
                      <button
                        type="button"
                        className={`type-btn ${categoryType === 'income' ? 'active' : ''}`}
                        onClick={() => setCategoryType('income')}
                      >
                        <span className="type-emoji">💰</span>
                        Pemasukan
                      </button>
                      <button
                        type="button"
                        className={`type-btn ${categoryType === 'expense' ? 'active' : ''}`}
                        onClick={() => setCategoryType('expense')}
                      >
                        <span className="type-emoji">💸</span>
                        Pengeluaran
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Icon Kategori</label>
                    <IconPicker 
                      value={selectedIcon}
                      onChange={setSelectedIcon}
                      maxDisplay={60}
                    />
                  </div>
                </>
              )}
            </>
          ) : (
            <>
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
                {loadingCategories ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                  </div>
                ) : categories.length === 0 ? (
                  <div className="empty-category-state">
                    <p>Belum ada kategori</p>
                    <button
                      type="button"
                      className="create-category-link"
                      onClick={() => setType('transaction')}
                    >
                      Buat kategori baru →
                    </button>
                  </div>
                ) : (
                  <div className="category-grid">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        className={`category-btn ${category === cat.id ? 'active' : ''}`}
                        onClick={() => setCategory(cat.id)}
                      >
                        {category === cat.id && <span className="check-mark">✓</span>}
                        <div className="category-icon">
                          <FontAwesomeIconDisplay iconName={cat.icon || 'wallet'} size="lg" />
                        </div>
                        <span className="category-name">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                )}
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

              {/* Transaction Name Input */}
              <div className="form-group">
                <label className="form-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  Nama Transaksi
                </label>
                <input
                  type="text"
                  className="text-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Beli bahan makanan"
                />
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
            </>
          )}

          {/* Submit Button */}
          {(type !== 'transaction' || isCreatingNew || editingCategoryId) && (
            <button 
              type="submit" 
              className="submit-btn"
              disabled={savingTransaction || loadingCategories}
            >
              {savingTransaction 
                ? 'Menyimpan...' 
                : type === 'transaction'
                  ? editingCategoryId
                    ? 'Update Kategori'
                    : 'Simpan Kategori'
                  : 'Simpan'}
            </button>
          )}
        </form>
      </div>

      {/* Delete Confirmation Dialog */}
      {deletingCategoryId && (
        <div className="delete-modal-overlay" onClick={() => setDeletingCategoryId(null)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Konfirmasi Hapus</h3>
            <p>Apakah Anda yakin ingin menghapus kategori ini?</p>
            <div className="delete-modal-actions">
              <button
                type="button"
                className="cancel-delete-btn"
                onClick={() => setDeletingCategoryId(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="confirm-delete-btn"
                onClick={() => handleDeleteCategory(deletingCategoryId)}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
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
          max-width: 800px;
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
          grid-template-columns: 1fr 1fr 1fr;
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

        .category-type-toggle {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-3);
          margin-top: var(--space-2);
        }

        .type-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          padding: var(--space-4);
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-xl);
          background-color: white;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--text-secondary);
        }

        .type-btn:hover {
          border-color: var(--primary-300);
        }

        .type-btn.active {
          border-color: var(--primary-500);
          background-color: var(--primary-50);
          color: var(--primary-600);
        }

        .type-emoji {
          font-size: 1.125rem;
        }

        .icon-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: var(--space-2);
        }

        .icon-btn {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-3);
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-lg);
          background-color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          aspect-ratio: 1;
        }

        .icon-btn:hover {
          border-color: var(--primary-300);
          background-color: var(--gray-50);
        }

        .icon-btn.active {
          border-color: var(--primary-500);
          background-color: var(--primary-50);
        }

        .check-mark-icon {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 16px;
          height: 16px;
          border-radius: var(--radius-full);
          background-color: var(--primary-500);
          color: white;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-600);
        }

        .icon-btn.active .icon-wrapper {
          color: var(--primary-600);
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

        .empty-category-state {
          text-align: center;
          padding: var(--space-6);
          background: var(--gray-50);
          border-radius: var(--radius-lg);
          border: 1px dashed var(--gray-300);
        }

        .empty-category-state p {
          margin: 0 0 var(--space-3) 0;
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        .create-category-link {
          background: transparent;
          border: none;
          color: var(--primary-500);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .create-category-link:hover {
          color: var(--primary-600);
          text-decoration: underline;
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

        .text-input {
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

        .text-input:focus {
          border-color: var(--primary-500);
          background-color: white;
        }

        .text-input::placeholder {
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
        
        /* Category Management Styles */
        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-4);
          padding-bottom: var(--space-3);
          border-bottom: 1px solid var(--gray-200);
        }

        .section-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .add-category-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          background: var(--primary-500);
          color: white;
          border: none;
          border-radius: var(--radius);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .add-category-btn:hover {
          background: var(--primary-600);
        }

        .category-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          max-height: 400px;
          overflow-y: auto;
        }

        .category-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .group-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin: 0;
          padding: var(--space-2) 0;
        }

        .category-items {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .category-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-3);
          background: var(--gray-50);
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-lg);
          transition: all 0.2s ease;
        }

        .category-item:hover {
          background: white;
          border-color: var(--primary-300);
        }

        .category-info {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .category-item-name {
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .category-actions {
          display: flex;
          gap: var(--space-2);
        }

        .edit-btn, .delete-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border: 1px solid var(--gray-300);
          border-radius: var(--radius);
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 1rem;
        }

        .edit-btn:hover {
          background: var(--primary-50);
          border-color: var(--primary-500);
        }

        .delete-btn:hover {
          background: #fee;
          border-color: #f00;
        }

        .loading-state, .empty-state {
          text-align: center;
          padding: var(--space-8);
          color: var(--text-muted);
        }

        .empty-state p {
          margin: 0;
        }

        .empty-state .hint {
          font-size: 0.75rem;
          margin-top: var(--space-2);
        }

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-4);
          padding-bottom: var(--space-3);
          border-bottom: 1px solid var(--gray-200);
        }

        .form-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .cancel-btn-sm {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid var(--gray-300);
          border-radius: var(--radius);
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 1.25rem;
          color: var(--text-secondary);
        }

        .cancel-btn-sm:hover {
          background: var(--gray-100);
        }

        .delete-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }

        .delete-modal {
          background: white;
          padding: var(--space-6);
          border-radius: var(--radius-xl);
          max-width: 400px;
          width: 90%;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .delete-modal h3 {
          margin: 0 0 var(--space-3) 0;
          font-size: 1.25rem;
          color: var(--text-primary);
        }

        .delete-modal p {
          margin: 0 0 var(--space-4) 0;
          color: var(--text-secondary);
        }

        .delete-modal-actions {
          display: flex;
          gap: var(--space-2);
          justify-content: flex-end;
        }

        .cancel-delete-btn, .confirm-delete-btn {
          padding: var(--space-2) var(--space-4);
          border-radius: var(--radius);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cancel-delete-btn {
          background: transparent;
          border: 1px solid var(--gray-300);
          color: var(--text-primary);
        }

        .cancel-delete-btn:hover {
          background: var(--gray-100);
        }

        .confirm-delete-btn {
          background: #dc2626;
          border: 1px solid #dc2626;
          color: white;
        }

        .confirm-delete-btn:hover {
          background: #b91c1c;
        }
      `}</style>
    </>
  );
};

export default AddTransactionModal;
