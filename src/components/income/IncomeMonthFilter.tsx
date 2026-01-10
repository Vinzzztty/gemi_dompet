'use client';

import React from 'react';
import { Filter } from 'lucide-react';

interface IncomeMonthFilterProps {
  selectedMonth: number | null;
  selectedYear: number;
  onMonthChange: (month: number | null) => void;
  onYearChange: (year: number) => void;
}

export const IncomeMonthFilter: React.FC<IncomeMonthFilterProps> = ({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
}) => {
  const months = [
    { value: null, label: 'Semua Bulan' },
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="filter-container">
      <div className="filter-header">
        <Filter size={18} />
        <span>Filter</span>
      </div>
      <div className="filter-controls">
        <select
          value={selectedMonth ?? ''}
          onChange={(e) => onMonthChange(e.target.value ? parseInt(e.target.value) : null)}
          className="filter-select"
        >
          {months.map((month) => (
            <option key={month.value ?? 'all'} value={month.value ?? ''}>
              {month.label}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(parseInt(e.target.value))}
          className="filter-select"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <style jsx>{`
        .filter-container {
          background: white;
          border-radius: var(--radius-2xl);
          padding: var(--space-5);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: var(--space-6);
        }

        .filter-header {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-4);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .filter-controls {
          display: flex;
          gap: var(--space-3);
        }

        .filter-select {
          flex: 1;
          padding: var(--space-3);
          border: 1px solid var(--gray-300);
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          color: var(--text-primary);
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-select:hover {
          border-color: var(--primary-400);
        }

        .filter-select:focus {
          outline: none;
          border-color: var(--primary-500);
          box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
        }

        @media (max-width: 480px) {
          .filter-controls {
            flex-direction: column;
          }

          .filter-select {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default IncomeMonthFilter;
