"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  WalletIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from "@/components/icons";
import { formatCurrency } from "@/utils/format";
import { Summary } from "@/types";

interface BalanceCardProps {
  summary: Summary;
  onIncomeClick?: () => void;
  onExpenseClick?: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ 
  summary,
  onIncomeClick,
  onExpenseClick 
}) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

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
        {isBalanceVisible ? formatCurrency(summary.balance) : "Rp •••••••"}
        <button
          onClick={toggleBalanceVisibility}
          className="eye-toggle-btn"
          aria-label={
            isBalanceVisible ? "Sembunyikan saldo" : "Tampilkan saldo"
          }
        >
          {isBalanceVisible ? <Eye size={35} /> : <EyeOff size={35} />}
        </button>
      </div>

      <div className="balance-breakdown">
        <div 
          className={`breakdown-card ${onIncomeClick ? 'clickable' : ''}`}
          onClick={onIncomeClick}
        >
          <div className="breakdown-header">
            <TrendingUpIcon size={16} />
            <span>Pemasukan</span>
          </div>
          <div className="breakdown-amount">
            {formatCurrency(summary.income)}
          </div>
        </div>
        <div 
          className={`breakdown-card ${onExpenseClick ? 'clickable' : ''}`}
          onClick={onExpenseClick}
        >
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
          background: linear-gradient(135deg, #4a90e2 0%, #3b7dd8 100%);
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
          transition: all 0.3s ease;
        }

        .breakdown-card.clickable {
          cursor: pointer;
        }

        .breakdown-card.clickable:hover {
          background-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

        .eye-toggle-btn {
          background: none;
          border: none;
          cursor: pointer;
          margin-left: var(--space-3);
          vertical-align: middle;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default BalanceCard;
