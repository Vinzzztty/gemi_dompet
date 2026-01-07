'use client';

import React from 'react';
import {
    ShoppingBagIcon,
    CarIcon,
    UtensilsIcon,
    FilmIcon
} from '@/components/icons';
import { formatNumber } from '@/utils/format';
import { CategoryType } from '@/types';

interface CategoryDetail {
    category: string;
    name: string;
    amount: number;
    percentage: number;
    previousAmount: number;
    changePercentage: number;
    isIncrease: boolean;
    color: string;
}

interface CategoryDetailListProps {
    data: CategoryDetail[];
    previousMonthName: string;
}

const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ReactNode> = {
        belanja: <ShoppingBagIcon size={20} />,
        transport: <CarIcon size={20} />,
        makan_minum: <UtensilsIcon size={20} />,
        hiburan: <FilmIcon size={20} />,
    };
    return iconMap[category] || <ShoppingBagIcon size={20} />;
};

export const CategoryDetailList: React.FC<CategoryDetailListProps> = ({
    data,
    previousMonthName
}) => {
    const maxAmount = Math.max(...data.map(item => item.amount));

    return (
        <div className="category-detail-card card">
            <div className="card-header">
                <h3 className="card-title">Detail per Kategori</h3>
                <span className="card-subtitle">vs {previousMonthName}</span>
            </div>

            <div className="category-list">
                {data.map((item, index) => (
                    <div key={item.category} className="category-item">
                        <div className="item-left">
                            <div className="item-icon" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                                {getCategoryIcon(item.category)}
                            </div>
                            <div className="item-info">
                                <span className="item-name">{item.name}</span>
                                <span className="item-percentage">{item.percentage}% dari total</span>
                            </div>
                        </div>

                        <div className="item-center">
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{
                                        width: `${(item.amount / maxAmount) * 100}%`,
                                        backgroundColor: item.color,
                                        animationDelay: `${index * 0.1}s`
                                    }}
                                />
                            </div>
                        </div>

                        <div className="item-right">
                            <span className="item-amount">Rp {formatNumber(item.amount)}</span>
                            <span className={`item-change ${item.isIncrease ? 'increase' : 'decrease'}`}>
                                {item.isIncrease ? '↗' : '↘'} {item.changePercentage}%
                                <span className="change-detail">(Bulan lalu: Rp {formatNumber(item.previousAmount)})</span>
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
        .category-detail-card {
          background-color: var(--bg-card);
          border-radius: var(--radius-xl);
          padding: var(--space-5);
          box-shadow: var(--shadow);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-5);
        }

        .card-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .card-subtitle {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .category-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .category-item {
          display: grid;
          grid-template-columns: 1fr 1.5fr 1fr;
          gap: var(--space-4);
          align-items: center;
          padding: var(--space-4);
          background-color: var(--gray-50);
          border-radius: var(--radius-lg);
        }

        .item-left {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .item-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .item-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .item-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .item-percentage {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .item-center {
          display: flex;
          align-items: center;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background-color: var(--gray-200);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: var(--radius-full);
          animation: growWidth 0.6s ease-out forwards;
          transform-origin: left;
        }

        @keyframes growWidth {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        .item-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }

        .item-amount {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .item-change {
          font-size: 0.625rem;
          display: flex;
          align-items: center;
          gap: var(--space-1);
        }

        .item-change.increase {
          color: var(--danger);
        }

        .item-change.decrease {
          color: var(--success);
        }

        .change-detail {
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .category-item {
            grid-template-columns: 1fr;
            gap: var(--space-3);
          }

          .item-right {
            align-items: flex-start;
          }
        }
      `}</style>
        </div>
    );
};

export default CategoryDetailList;
