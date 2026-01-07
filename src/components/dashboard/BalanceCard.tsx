'use client';

import React from 'react';
import { WalletIcon, TrendingUpIcon, TrendingDownIcon } from '@/components/icons';
import { formatCurrency } from '@/utils/format';
import { Summary } from '@/types';

interface BalanceCardProps {
    summary: Summary;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ summary }) => {
    return (
        <div className="balance-card card-gradient">
            <div className="balance-header">
                <div className="balance-icon-wrapper">
                    <WalletIcon size={20} />
                </div>
                <div className="balance-label">
                    <span className="balance-title">Saldo Saat Ini</span>
                    <span className="balance-period">Bulan ini</span>
                </div>
            </div>

            <div className="balance-amount">
                {formatCurrency(summary.balance)}
            </div>

            <div className="balance-breakdown">
                <div className="breakdown-card">
                    <div className="breakdown-header">
                        <TrendingUpIcon size={16} />
                        <span>Pemasukan</span>
                    </div>
                    <div className="breakdown-amount">
                        {formatCurrency(summary.income)}
                    </div>
                </div>
                <div className="breakdown-card">
                    <div className="breakdown-header">
                        <TrendingDownIcon size={16} />
                        <span>Pengeluaran</span>
                    </div>
                    <div className="breakdown-amount">
                        {formatCurrency(summary.expense)}
                    </div>
                </div>
            </div>

            <style jsx>{`
        .balance-card {
          background: linear-gradient(135deg, #4A90E2 0%, #3B7DD8 100%);
          border-radius: var(--radius-2xl);
          padding: var(--space-6);
          color: white;
          margin-bottom: var(--space-6);
        }

        .balance-header {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-4);
        }

        .balance-icon-wrapper {
          width: 40px;
          height: 40px;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .balance-label {
          display: flex;
          flex-direction: column;
        }

        .balance-title {
          font-size: 0.875rem;
          font-weight: 500;
          opacity: 0.9;
        }

        .balance-period {
          font-size: 0.75rem;
          opacity: 0.7;
        }

        .balance-amount {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: var(--space-6);
          letter-spacing: -0.02em;
        }

        .balance-breakdown {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }

        .breakdown-card {
          background-color: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: var(--radius-xl);
          padding: var(--space-4);
        }

        .breakdown-header {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: 0.75rem;
          opacity: 0.9;
          margin-bottom: var(--space-2);
        }

        .breakdown-amount {
          font-size: 1.25rem;
          font-weight: 600;
        }

        @media (max-width: 480px) {
          .balance-amount {
            font-size: 2rem;
          }

          .breakdown-amount {
            font-size: 1rem;
          }
        }
      `}</style>
        </div>
    );
};

export default BalanceCard;
