'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { UserIcon, ChevronRightIcon } from '@/components/icons';

export const ProfileDropdown: React.FC = () => {
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

    const menuItems = [
        { icon: '👤', label: 'Profil Saya', href: '#' },
        { icon: '⚙️', label: 'Pengaturan', href: '#' },
        { icon: '📊', label: 'Statistik', href: '/laporan' },
        { icon: '🎯', label: 'Target Keuangan', href: '#' },
        { icon: '❓', label: 'Bantuan', href: '#' },
    ];

    return (
        <div className="profile-wrapper" ref={dropdownRef}>
            <button
                className="btn btn-icon btn-secondary profile-btn"
                onClick={() => setIsOpen(!isOpen)}
            >
                <UserIcon size={20} />
            </button>

            {isOpen && (
                <div className="profile-dropdown">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            <UserIcon size={24} />
                        </div>
                        <div className="profile-info">
                            <h3>User</h3>
                            <p>user@example.com</p>
                        </div>
                    </div>

                    <div className="menu-list">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className="menu-item"
                                onClick={() => setIsOpen(false)}
                            >
                                <span className="menu-icon">{item.icon}</span>
                                <span className="menu-label">{item.label}</span>
                                <ChevronRightIcon size={16} />
                            </Link>
                        ))}
                    </div>

                    <button className="logout-btn">
                        <span>🚪</span>
                        Keluar
                    </button>
                </div>
            )}

            <style jsx>{`
        .profile-wrapper {
          position: relative;
        }

        .profile-dropdown {
          position: absolute;
          top: calc(100% + var(--space-2));
          right: 0;
          width: 260px;
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

        .profile-header {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4);
          background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
          color: white;
        }

        .profile-avatar {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-full);
          background-color: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-info h3 {
          font-size: 0.9375rem;
          font-weight: 600;
          margin: 0;
        }

        .profile-info p {
          font-size: 0.75rem;
          opacity: 0.8;
          margin: 0;
        }

        .menu-list {
          padding: var(--space-2) 0;
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          padding: var(--space-3);
          background: none;
          border: none;
          border-top: 1px solid var(--gray-100);
          color: var(--danger);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .logout-btn:hover {
          background-color: var(--danger-light);
        }
      `}</style>

            <style jsx global>{`
        .menu-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          text-decoration: none;
          color: var(--text-primary);
          transition: all 0.2s ease;
        }

        .menu-item:hover {
          background-color: var(--gray-50);
        }

        .menu-icon {
          font-size: 1rem;
        }

        .menu-label {
          flex: 1;
          font-size: 0.875rem;
        }

        .menu-item svg {
          color: var(--text-muted);
        }
      `}</style>
        </div>
    );
};

export default ProfileDropdown;
