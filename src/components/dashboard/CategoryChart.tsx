'use client';

import React from 'react';
import { CategorySpending } from '@/types';
import { formatNumber } from '@/utils/format';

interface CategoryChartProps {
  data: CategorySpending[];
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  // Find max value for scaling
  const maxAmount = Math.max(...data.map(item => item.amount));

  // Calculate scale markers
  const scaleMarkers = [0, 150000, 300000, 450000, 600000];

  return (
    <div className="category-chart card">
      <h3 className="chart-title">Pengeluaran per Kategori</h3>

      <div className="chart-container">
        {data.map((item, index) => (
          <div key={item.category} className="chart-row">
            <div className="chart-label">{item.name}</div>
            <div className="chart-bar-container">
              <div
                className="chart-bar"
                style={{
                  width: `${(item.amount / (maxAmount * 1.2)) * 100}%`,
                  animationDelay: `${index * 0.1}s`
                }}
              />
            </div>
          </div>
        ))}

        <div className="chart-scale">
          {scaleMarkers.map((value) => (
            <span key={value} className="scale-marker">
              {value === 0 ? '0' : `${value / 1000}rb`}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        .category-chart {
          background-color: var(--bg-card);
          border-radius: var(--radius-xl);
          padding: var(--space-5);
          box-shadow: var(--shadow);
        }

        .chart-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 var(--space-5) 0;
        }

        .chart-container {
          position: relative;
        }

        .chart-row {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-4);
          padding: var(--space-2);
          margin-left: calc(-1 * var(--space-2));
          margin-right: calc(-1 * var(--space-2));
          border-radius: var(--radius-lg);
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .chart-row:hover {
          background-color: var(--gray-50);
        }

        .chart-row:last-of-type {
          margin-bottom: var(--space-6);
        }

        .chart-label {
          width: 80px;
          font-size: 0.75rem;
          color: var(--text-secondary);
          flex-shrink: 0;
          text-align: right;
          transition: all 0.2s ease;
        }

        .chart-row:hover .chart-label {
          color: var(--text-primary);
          font-weight: 500;
        }

        .chart-bar-container {
          flex: 1;
          height: 24px;
          background-color: var(--gray-100);
          border-radius: var(--radius);
          overflow: hidden;
        }

        .chart-bar {
          height: 100%;
          background: linear-gradient(90deg, #4A90E2 0%, #3B7DD8 100%);
          border-radius: var(--radius);
          animation: growBar 0.6s ease-out forwards;
          transform-origin: left;
          transition: all 0.2s ease;
        }

        .chart-row:hover .chart-bar {
          filter: brightness(1.1);
          box-shadow: 0 0 12px rgba(74, 144, 226, 0.4);
        }

        @keyframes growBar {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        .chart-scale {
          display: flex;
          justify-content: space-between;
          padding-left: calc(80px + var(--space-3));
        }

        .scale-marker {
          font-size: 0.625rem;
          color: var(--text-muted);
        }

        @media (max-width: 480px) {
          .chart-label {
            width: 60px;
            font-size: 0.7rem;
          }
          
          .chart-scale {
            padding-left: calc(60px + var(--space-3));
          }
        }
      `}</style>
    </div>
  );
};

export default CategoryChart;
