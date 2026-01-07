'use client';

import React from 'react';
import { ChartIcon } from '@/components/icons';
import { formatNumber } from '@/utils/format';

interface MonthlyComparisonData {
    currentMonth: {
        income: number;
        expense: number;
    };
    previousMonth: {
        income: number;
        expense: number;
    };
}

interface MonthComparisonChartProps {
    data: MonthlyComparisonData;
}

export const MonthComparisonChart: React.FC<MonthComparisonChartProps> = ({ data }) => {
    // Calculate max value for scaling
    const maxValue = Math.max(
        data.currentMonth.income,
        data.currentMonth.expense,
        data.previousMonth.income,
        data.previousMonth.expense
    );

    // Scale to percentage of max (with headroom)
    const scale = (value: number) => (value / (maxValue * 1.2)) * 100;

    // Y-axis labels
    const yLabels = ['12.0jt', '9.0jt', '6.0jt', '3.0jt', '0'];

    return (
        <div className="comparison-chart card">
            <div className="chart-header">
                <div className="chart-icon">
                    <ChartIcon size={18} />
                </div>
                <h3 className="chart-title">Perbandingan Bulan</h3>
            </div>

            <div className="chart-container">
                <div className="y-axis">
                    {yLabels.map((label, index) => (
                        <span key={index} className="y-label">{label}</span>
                    ))}
                </div>

                <div className="bars-container">
                    <div className="bar-group">
                        <div className="bars">
                            <div
                                className="bar current"
                                style={{ height: `${scale(data.currentMonth.income)}%` }}
                            />
                            <div
                                className="bar previous"
                                style={{ height: `${scale(data.previousMonth.income)}%` }}
                            />
                        </div>
                        <span className="bar-label">Pemasukan</span>
                    </div>

                    <div className="bar-group">
                        <div className="bars">
                            <div
                                className="bar current"
                                style={{ height: `${scale(data.currentMonth.expense)}%` }}
                            />
                            <div
                                className="bar previous"
                                style={{ height: `${scale(data.previousMonth.expense)}%` }}
                            />
                        </div>
                        <span className="bar-label">Pengeluaran</span>
                    </div>
                </div>
            </div>

            <div className="chart-legend">
                <div className="legend-item">
                    <span className="legend-dot current" />
                    <span>Bulan Ini</span>
                </div>
                <div className="legend-item">
                    <span className="legend-dot previous" />
                    <span>Bulan Lalu</span>
                </div>
            </div>

            <style jsx>{`
        .comparison-chart {
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
          gap: var(--space-4);
          height: 200px;
          margin-bottom: var(--space-4);
        }

        .y-axis {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding-bottom: 24px;
        }

        .y-label {
          font-size: 0.625rem;
          color: var(--text-muted);
        }

        .bars-container {
          flex: 1;
          display: flex;
          justify-content: space-around;
          align-items: flex-end;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--gray-200);
        }

        .bar-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
        }

        .bars {
          display: flex;
          gap: var(--space-2);
          align-items: flex-end;
          height: 160px;
        }

        .bar {
          width: 32px;
          border-radius: var(--radius) var(--radius) 0 0;
          transition: height 0.5s ease;
        }

        .bar.current {
          background: linear-gradient(180deg, #4A90E2 0%, #3B7DD8 100%);
        }

        .bar.previous {
          background-color: var(--gray-200);
        }

        .bar-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          position: absolute;
          bottom: 0;
          transform: translateY(100%);
        }

        .bar-group {
          position: relative;
        }

        .bar-label {
          position: absolute;
          bottom: -20px;
          white-space: nowrap;
        }

        .chart-legend {
          display: flex;
          justify-content: center;
          gap: var(--space-6);
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

        .legend-dot.current {
          background-color: var(--primary-500);
        }

        .legend-dot.previous {
          background-color: var(--gray-300);
        }
      `}</style>
        </div>
    );
};

export default MonthComparisonChart;
