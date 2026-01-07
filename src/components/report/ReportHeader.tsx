'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from '@/components/icons';
import { getMonthName } from '@/utils/format';

interface ReportHeaderProps {
    currentMonth: number;
    currentYear: number;
    onPrevMonth: () => void;
    onNextMonth: () => void;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({
    currentMonth,
    currentYear,
    onPrevMonth,
    onNextMonth,
}) => {
    return (
        <header className="report-header">
            <div className="header-left">
                <Link href="/" className="back-btn">
                    <ChevronLeftIcon size={20} />
                </Link>
                <div className="header-info">
                    <h1 className="header-title">Laporan Bulanan</h1>
                    <p className="header-subtitle">Analisis keuangan detail</p>
                </div>
            </div>
            <div className="month-nav">
                <button className="btn btn-icon btn-ghost" onClick={onPrevMonth}>
                    <ChevronLeftIcon size={18} />
                </button>
                <div className="month-display">
                    <CalendarIcon size={16} />
                    <span>{getMonthName(currentMonth).slice(0, 3)} {currentYear}</span>
                </div>
                <button className="btn btn-icon btn-ghost" onClick={onNextMonth}>
                    <ChevronRightIcon size={18} />
                </button>
            </div>

            <style jsx>{`
        .report-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4) var(--space-6);
          background-color: var(--bg-card);
          border-radius: var(--radius-xl);
          margin-bottom: var(--space-6);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .back-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-lg);
          background-color: var(--gray-100);
          color: var(--text-primary);
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .back-btn:hover {
          background-color: var(--gray-200);
        }

        .header-info {
          display: flex;
          flex-direction: column;
        }

        .header-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .header-subtitle {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .month-nav {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          background-color: var(--gray-50);
          border-radius: var(--radius-full);
          padding: var(--space-1);
        }

        .month-display {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        @media (max-width: 640px) {
          .report-header {
            flex-direction: column;
            gap: var(--space-4);
          }
        }
      `}</style>
        </header>
    );
};

export default ReportHeader;
