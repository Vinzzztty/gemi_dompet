'use client';

import React from 'react';
import { PlusIcon } from '@/components/icons';

interface FloatingActionButtonProps {
    onClick?: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
    return (
        <button className="fab" onClick={onClick} aria-label="Add Transaction">
            <PlusIcon size={24} />

            <style jsx>{`
        .fab {
          position: fixed;
          bottom: var(--space-6);
          right: var(--space-6);
          width: 56px;
          height: 56px;
          border-radius: var(--radius-full);
          background-color: var(--primary-500);
          color: var(--text-white);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-lg);
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          z-index: 50;
        }

        .fab:hover {
          background-color: var(--primary-600);
          transform: scale(1.05);
          box-shadow: var(--shadow-xl);
        }

        .fab:active {
          transform: scale(0.95);
        }
      `}</style>
        </button>
    );
};

export default FloatingActionButton;
