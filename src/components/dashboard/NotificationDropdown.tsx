'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BellIcon } from '@/components/icons';

interface NotificationDropdownProps {
    onClose?: () => void;
}

const notifications = [
    {
        id: '1',
        title: 'Pengeluaran tinggi',
        message: 'Pengeluaran bulan ini 30% lebih tinggi dari bulan lalu',
        time: '2 jam lalu',
        isRead: false,
        type: 'warning',
    },
    {
        id: '2',
        title: 'Target tercapai',
        message: 'Selamat! Anda berhasil mencapai target tabungan bulan ini',
        time: '1 hari lalu',
        isRead: true,
        type: 'success',
    },
    {
        id: '3',
        title: 'Reminder',
        message: 'Jangan lupa catat pengeluaran hari ini',
        time: '2 hari lalu',
        isRead: true,
        type: 'info',
    },
];

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="notification-wrapper" ref={dropdownRef}>
            <button
                className="btn btn-icon btn-secondary notification-btn"
                onClick={() => setIsOpen(!isOpen)}
            >
                <BellIcon size={20} />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="dropdown-header">
                        <h3>Notifikasi</h3>
                        <button className="mark-read-btn">Tandai semua dibaca</button>
                    </div>
                    <div className="notification-list">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                            >
                                <div className={`notification-dot ${notification.type}`} />
                                <div className="notification-content">
                                    <h4>{notification.title}</h4>
                                    <p>{notification.message}</p>
                                    <span className="notification-time">{notification.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="view-all-btn">Lihat semua notifikasi</button>
                </div>
            )}

            <style jsx>{`
        .notification-wrapper {
          position: relative;
        }

        .notification-btn {
          position: relative;
        }

        .notification-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 18px;
          height: 18px;
          border-radius: var(--radius-full);
          background-color: var(--danger);
          color: white;
          font-size: 0.625rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-dropdown {
          position: absolute;
          top: calc(100% + var(--space-2));
          right: 0;
          width: 320px;
          background-color: var(--bg-card);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          z-index: 100;
          animation: slideDown 0.2s ease;
          overflow: hidden;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4);
          border-bottom: 1px solid var(--gray-100);
        }

        .dropdown-header h3 {
          font-size: 0.9375rem;
          font-weight: 600;
          margin: 0;
        }

        .mark-read-btn {
          background: none;
          border: none;
          color: var(--primary-500);
          font-size: 0.75rem;
          cursor: pointer;
          padding: 0;
        }

        .mark-read-btn:hover {
          text-decoration: underline;
        }

        .notification-list {
          max-height: 300px;
          overflow-y: auto;
        }

        .notification-item {
          display: flex;
          gap: var(--space-3);
          padding: var(--space-4);
          border-bottom: 1px solid var(--gray-100);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .notification-item:hover {
          background-color: var(--gray-50);
        }

        .notification-item.unread {
          background-color: var(--primary-50);
        }

        .notification-item:last-child {
          border-bottom: none;
        }

        .notification-dot {
          width: 8px;
          height: 8px;
          border-radius: var(--radius-full);
          flex-shrink: 0;
          margin-top: 6px;
        }

        .notification-dot.warning {
          background-color: var(--warning);
        }

        .notification-dot.success {
          background-color: var(--success);
        }

        .notification-dot.info {
          background-color: var(--primary-500);
        }

        .notification-content {
          flex: 1;
          min-width: 0;
        }

        .notification-content h4 {
          font-size: 0.8125rem;
          font-weight: 600;
          margin: 0 0 var(--space-1) 0;
          color: var(--text-primary);
        }

        .notification-content p {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin: 0 0 var(--space-1) 0;
          line-height: 1.4;
        }

        .notification-time {
          font-size: 0.6875rem;
          color: var(--text-muted);
        }

        .view-all-btn {
          width: 100%;
          padding: var(--space-3);
          background: none;
          border: none;
          border-top: 1px solid var(--gray-100);
          color: var(--primary-500);
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-all-btn:hover {
          background-color: var(--gray-50);
        }
      `}</style>
        </div>
    );
};

export default NotificationDropdown;
