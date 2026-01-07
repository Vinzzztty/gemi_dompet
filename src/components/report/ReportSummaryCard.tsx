'use client';

import React from 'react';
import { TrendingUpIcon, TrendingDownIcon, WalletIcon } from '@/components/icons';
import { formatCurrency } from '@/utils/format';

interface ReportSummaryCardProps {
    title: string;
    amount: number;
    type: 'balance' | 'income' | 'expense';
    subtitle?: string;
    changePercentage?: number;
    isIncrease?: boolean;
}

export const ReportSummaryCard: React.FC<ReportSummaryCardProps> = ({
    title,
    amount,
    type,
    subtitle,
    changePercentage,
    isIncrease,
}) => {
    const getIcon = () => {
        switch (type) {
            case 'balance':
                return <WalletIcon size={20} />;
            case 'income':
                return <TrendingUpIcon size={20} />;
            case 'expense':
                return <TrendingDownIcon size={20} />;
        }
    };

    const getAmountClass = () => {
        switch (type) {
            case 'income':
                return 'amount-income';
            case 'expense':
                return 'amount-expense';
            default:
                return 'amount-balance';
        }
    };

    return (
        <div className="report-summary-card card">
            <div className="card-header">
                <span className="card-title">{title}</span>
                <div className={`card-icon ${type}`}>
                    {getIcon()}
                </div>
            </div>
            <div className={`card-amount ${getAmountClass()}`}>
                {formatCurrency(amount)}
            </div>
            {subtitle && (
                <div className="card-subtitle">{subtitle}</div>
            )}
            {changePercentage !== undefined && (
                <div className={`card-change ${isIncrease ? 'increase' : 'decrease'}`}>
                    {isIncrease ? '↗' : '↘'} {changePercentage}% vs bulan lalu
                </div>
            )}

            <style jsx>{`
        .report-summary-card {
          background-color: var(--bg-card);
          border-radius: var(--radius-xl);
          padding: var(--space-5);
          box-shadow: var(--shadow);
          border: 1px solid var(--gray-100);
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: var(--space-3);
        }

        .card-title {
          font-size: 0.875rem;
          color: var(--primary-500);
          font-weight: 500;
        }

        .card-icon {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-icon.balance {
          background-color: var(--primary-100);
          color: var(--primary-600);
        }

        .card-icon.income {
          background-color: var(--success-light);
          color: var(--success);
        }

        .card-icon.expense {
          background-color: var(--primary-100);
          color: var(--primary-600);
        }

        .card-amount {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: var(--space-1);
        }

        .amount-balance {
          color: var(--primary-500);
        }

        .amount-income {
          color: var(--text-primary);
        }

        .amount-expense {
          color: var(--danger);
        }

        .card-subtitle {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .card-change {
          font-size: 0.75rem;
          margin-top: var(--space-2);
        }

        .card-change.increase {
          color: var(--success);
        }

        .card-change.decrease {
          color: var(--danger);
        }
      `}</style>
        </div>
    );
};

export default ReportSummaryCard;
