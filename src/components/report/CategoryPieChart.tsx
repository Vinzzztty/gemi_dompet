'use client';

import React from 'react';
import { CoinIcon } from '@/components/icons';
import { CategorySpending } from '@/types';

interface CategoryPieChartProps {
    data: CategorySpending[];
}

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => {
    // Calculate total for percentages
    const total = data.reduce((sum, item) => sum + item.amount, 0);

    // Calculate cumulative percentages for the donut chart segments
    let cumulativePercent = 0;
    const segments = data.map((item) => {
        const percent = (item.amount / total) * 100;
        const startPercent = cumulativePercent;
        cumulativePercent += percent;
        return {
            ...item,
            percent,
            startPercent,
            endPercent: cumulativePercent,
        };
    });

    // Generate conic gradient
    const gradientStops = segments.map((seg) =>
        `${seg.color} ${seg.startPercent}% ${seg.endPercent}%`
    ).join(', ');

    return (
        <div className="pie-chart-card card">
            <div className="chart-header">
                <div className="chart-icon">
                    <CoinIcon size={18} />
                </div>
                <h3 className="chart-title">Pengeluaran per Kategori</h3>
            </div>

            <div className="chart-container">
                <div
                    className="donut-chart"
                    style={{
                        background: `conic-gradient(${gradientStops})`
                    }}
                >
                    <div className="donut-hole" />
                </div>
            </div>

            <div className="chart-legend">
                {data.map((item) => (
                    <div key={item.category} className="legend-item">
                        <span
                            className="legend-dot"
                            style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                    </div>
                ))}
            </div>

            <style jsx>{`
        .pie-chart-card {
          background-color: var(--bg-card);
          border-radius: var(--radius-xl);
          padding: var(--space-5);
          box-shadow: var(--shadow);
        }

        .chart-header {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-5);
        }

        .chart-icon {
          width: 32px;
          height: 32px;
          border-radius: var(--radius);
          background-color: var(--primary-100);
          color: var(--primary-600);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chart-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .chart-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: var(--space-4);
        }

        .donut-chart {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .donut-hole {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background-color: var(--bg-card);
        }

        .chart-legend {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: var(--space-4);
          margin-top: var(--space-4);
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: var(--radius-full);
        }
      `}</style>
        </div>
    );
};

export default CategoryPieChart;
