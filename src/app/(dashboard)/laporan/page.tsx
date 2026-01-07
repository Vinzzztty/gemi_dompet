'use client';

import React, { useState } from 'react';
import {
    ReportHeader,
    ReportSummaryCard,
    MonthComparisonChart,
    CategoryPieChart,
    CategoryDetailList,
} from '@/components/report';
import {
    mockMonthlyComparison,
    mockCategoryDetails,
    mockPieChartData,
    mockReportSummary,
} from '@/data/reportData';
import { getMonthName } from '@/utils/format';

export default function ReportPage() {
    const [currentMonth, setCurrentMonth] = useState(0); // January
    const [currentYear, setCurrentYear] = useState(2026);

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const getPreviousMonthName = () => {
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        return getMonthName(prevMonth);
    };

    return (
        <div className="report-page">
            {/* Header */}
            <ReportHeader
                currentMonth={currentMonth}
                currentYear={currentYear}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
            />

            {/* Summary Cards */}
            <div className="summary-grid">
                <ReportSummaryCard
                    title="Saldo Bulan Ini"
                    amount={mockReportSummary.balance}
                    type="balance"
                    subtitle="8 transaksi"
                />
                <ReportSummaryCard
                    title="Total Pemasukan"
                    amount={mockReportSummary.income}
                    type="income"
                    changePercentage={5.0}
                    isIncrease={true}
                />
                <ReportSummaryCard
                    title="Total Pengeluaran"
                    amount={mockReportSummary.expense}
                    type="expense"
                    changePercentage={30.5}
                    isIncrease={true}
                />
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
                <MonthComparisonChart data={mockMonthlyComparison} />
                <CategoryPieChart data={mockPieChartData} />
            </div>

            {/* Category Details */}
            <CategoryDetailList
                data={mockCategoryDetails}
                previousMonthName={getPreviousMonthName()}
            />

            <style jsx>{`
        .report-page {
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

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-4);
          margin-bottom: var(--space-6);
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-6);
          margin-bottom: var(--space-6);
        }

        @media (max-width: 1024px) {
          .summary-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .summary-grid > :first-child {
            grid-column: span 2;
          }
        }

        @media (max-width: 768px) {
          .summary-grid {
            grid-template-columns: 1fr;
          }

          .summary-grid > :first-child {
            grid-column: span 1;
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
}
