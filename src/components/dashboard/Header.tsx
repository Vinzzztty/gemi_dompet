'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { LogoIcon, ChartIcon, MenuIcon, XIcon, BellIcon, UserIcon } from '@/components/icons';
import { formatFullDate } from '@/utils/format';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';

export const Header: React.FC = () => {
  const today = new Date();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="header">
      <div className="header-left">
        <LogoIcon size={40} />
        <div className="header-info">
          <h1 className="header-title">DompetKu</h1>
          <p className="header-date">{formatFullDate(today)}</p>
        </div>
      </div>
      
      <div className="header-right">
        {/* Desktop Elements */}
        <div className="desktop-elements">
          <Link href="/laporan" className="btn btn-primary header-btn">
            <ChartIcon size={18} />
            <span>Laporan</span>
          </Link>
          <NotificationDropdown />
          <ProfileDropdown />
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="btn btn-icon btn-ghost mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="mobile-menu" ref={menuRef}>
          <div className="mobile-menu-items">
            <Link href="/laporan" className="mobile-menu-item" onClick={() => setIsMobileMenuOpen(false)}>
              <ChartIcon size={20} />
              <span>Laporan</span>
            </Link>
            <Link href="#" className="mobile-menu-item" onClick={() => setIsMobileMenuOpen(false)}>
              <BellIcon size={20} />
              <span>Notifikasi</span>
            </Link>
            <Link href="#" className="mobile-menu-item" onClick={() => setIsMobileMenuOpen(false)}>
              <UserIcon size={20} />
              <span>Profil</span>
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4) var(--space-6);
          background-color: var(--bg-card);
          border-radius: var(--radius-xl);
          margin-bottom: var(--space-6);
          position: relative;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .header-info {
          display: flex;
          flex-direction: column;
        }

        .header-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .header-date {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .desktop-elements {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .header-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .mobile-menu-btn {
          display: none;
        }

        .mobile-menu {
          display: none;
        }

        .mobile-menu-item {
          display: none;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 640px) {
          .header {
            padding: var(--space-3) var(--space-4);
          }

          .header-date {
            display: none;
          }

          .desktop-elements {
            display: none !important;
          }

          .header-left {
            gap: var(--space-2);
          }

          .header-title {
            font-size: 1rem;
          }

          .mobile-menu-btn {
            display: flex;
          }

          .mobile-menu {
            display: flex;
            position: absolute;
            top: calc(100% + var(--space-3));
            right: var(--space-2);
            min-width: 240px;
            background-color: var(--bg-card);
            border-radius: var(--radius-xl);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
            z-index: 100;
            border: 1px solid var(--gray-100);
            animation: slideIn 0.25s ease-out;
          }

          .mobile-menu-items {
            display: flex;
            flex-direction: column;
            width: 100%;
            padding: var(--space-3);
            gap: var(--space-1);
          }

          .mobile-menu-item {
            display: flex;
            align-items: center;
            gap: var(--space-3);
            padding: var(--space-3) var(--space-4);
            color: var(--text-primary);
            text-decoration: none;
            border-radius: var(--radius-lg);
            transition: all 0.2s ease;
            font-weight: 500;
            font-size: 0.9375rem;
          }

          .mobile-menu-item:active {
            background-color: var(--gray-100);
            transform: scale(0.98);
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-8px) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
