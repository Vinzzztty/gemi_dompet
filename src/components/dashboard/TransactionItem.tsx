'use client';

import React from 'react';
import { Transaction, CategoryType } from '@/types';
import { categories } from '@/data/mockData';
import { formatDate, formatNumber } from '@/utils/format';
import {
  CarIcon,
  ShoppingBagIcon,
  UtensilsIcon,
  FilmIcon,
  WalletIcon,
  TrendingUpIcon,
  CheckIcon
} from '@/components/icons';

interface TransactionItemProps {
  transaction: Transaction;
}

// Icon mapping for categories
const getCategoryIcon = (category: CategoryType) => {
  const iconMap: Record<CategoryType, React.ReactNode> = {
    transport: <CarIcon size={20} />,
    belanja: <ShoppingBagIcon size={20} />,
    makan_minum: <UtensilsIcon size={20} />,
    hiburan: <FilmIcon size={20} />,
    gaji: <WalletIcon size={20} />,
    investasi: <TrendingUpIcon size={20} />,
    lainnya: <CheckIcon size={20} />,
  };
  return iconMap[category] || <CheckIcon size={20} />;
};

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const isExpense = transaction.type === 'expense';
  
  // Handle both old format (CategoryType) and new format (Category object)
  const category = typeof transaction.category === 'string' 
    ? categories[transaction.category]
    : transaction.category;
    
  const amountDisplay = isExpense
    ? `-Rp ${formatNumber(transaction.amount)}`
    : `+Rp ${formatNumber(transaction.amount)}`;

  return (
    <div className="transaction-item">
      <div className={`transaction-icon ${transaction.type}`}>
        {typeof transaction.category === 'string' 
          ? getCategoryIcon(transaction.category)
          : <CheckIcon size={20} />
        }
      </div>
      <div className="transaction-details">
        <span className="transaction-description">{transaction.description}</span>
        <span className="transaction-meta">
          {formatDate(transaction.date)} • <span className="category-badge">{category?.name}</span>
        </span>
      </div>
      <div className={`transaction-amount ${transaction.type}`}>
        {amountDisplay}
      </div>

      <style jsx>{`
        .transaction-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3);
          border-bottom: 1px solid var(--gray-100);
          border-radius: var(--radius-lg);
          transition: all 0.2s ease;
          cursor: pointer;
          overflow: hidden;
        }

        .transaction-item:hover {
          background-color: var(--gray-50);
        }

        .transaction-item:last-child {
          border-bottom: none;
        }

        .transaction-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .transaction-item:hover .transaction-icon {
          transform: scale(1.1);
        }

        .transaction-icon.expense {
          background-color: var(--danger-light);
          color: var(--danger);
        }

        .transaction-icon.income {
          background-color: var(--success-light);
          color: var(--success);
        }

        .transaction-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
          min-width: 0;
          overflow: hidden;
        }

        .transaction-description {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .transaction-meta {
          font-size: 0.75rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .category-badge {
          color: var(--primary-500);
        }

        .transaction-amount {
          font-size: 0.875rem;
          font-weight: 600;
          white-space: nowrap;
          flex-shrink: 0;
          text-align: right;
        }

        .transaction-amount.expense {
          color: var(--danger);
        }

        .transaction-amount.income {
          color: var(--success);
        }
      `}</style>
    </div>
  );
};

export default TransactionItem;
