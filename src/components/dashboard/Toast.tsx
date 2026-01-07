'use client';

import React, { useEffect, useState } from 'react';
import { CheckIcon } from '@/components/icons';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
    message,
    type = 'success',
    isVisible,
    onClose,
    duration = 3000,
}) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-icon">
                {type === 'success' && <CheckIcon size={20} />}
                {type === 'error' && <span>✕</span>}
                {type === 'info' && <span>ℹ</span>}
            </div>
            <span className="toast-message">{message}</span>
            <button className="toast-close" onClick={onClose}>
                ✕
            </button>

            <style jsx>{`
        .toast {
          position: fixed;
          bottom: calc(var(--space-6) + 70px);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          z-index: 200;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .toast-success {
          background-color: var(--success);
          color: white;
        }

        .toast-error {
          background-color: var(--danger);
          color: white;
        }

        .toast-info {
          background-color: var(--primary-500);
          color: white;
        }

        .toast-icon {
          width: 24px;
          height: 24px;
          border-radius: var(--radius-full);
          background-color: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
        }

        .toast-message {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .toast-close {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          padding: var(--space-1);
          font-size: 0.75rem;
          transition: all 0.2s ease;
        }

        .toast-close:hover {
          color: white;
        }
      `}</style>
        </div>
    );
};

export default Toast;
