'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { searchIcons, getIconsByCategory, FONT_AWESOME_ICONS, IconData } from '@/lib/font-awesome-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  maxDisplay?: number;
}

export const IconPicker: React.FC<IconPickerProps> = ({ 
  value, 
  onChange,
  maxDisplay = 50 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'income' | 'expense' | 'general'>('all');

  // Filter icons based on search and category
  const filteredIcons = useMemo(() => {
    let icons = searchQuery ? searchIcons(searchQuery) : FONT_AWESOME_ICONS;
    
    if (selectedCategory !== 'all') {
      icons = icons.filter(icon => icon.category === selectedCategory);
    }
    
    return icons.slice(0, maxDisplay);
  }, [searchQuery, selectedCategory, maxDisplay]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleIconSelect = useCallback((iconName: string) => {
    onChange(iconName);
  }, [onChange]);

  return (
    <div className="icon-picker">
      {/* Search Bar */}
      <div className="search-container">
        <div className="search-icon">
          <FontAwesomeIcon icon={faSearch} size="sm" />
        </div>
        <input
          type="text"
          className="search-input"
          placeholder="Cari icon... (contoh: makanan, transport)"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        <button
          type="button"
          className={`tab-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          Semua
        </button>
        <button
          type="button"
          className={`tab-btn ${selectedCategory === 'income' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('income')}
        >
          Pemasukan
        </button>
        <button
          type="button"
          className={`tab-btn ${selectedCategory === 'expense' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('expense')}
        >
          Pengeluaran
        </button>
        <button
          type="button"
          className={`tab-btn ${selectedCategory === 'general' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('general')}
        >
          Umum
        </button>
      </div>

      {/* Icons Grid */}
      <div className="icons-grid-container">
        {filteredIcons.length === 0 ? (
          <div className="empty-state">
            <p>Tidak ada icon ditemukan</p>
            <p className="hint">Coba kata kunci lain</p>
          </div>
        ) : (
          <div className="icons-grid">
            {filteredIcons.map((iconData) => (
              <button
                key={iconData.name}
                type="button"
                className={`icon-item ${value === iconData.name ? 'selected' : ''}`}
                onClick={() => handleIconSelect(iconData.name)}
                title={iconData.displayName}
              >
                {value === iconData.name && <span className="check-badge">✓</span>}
                <FontAwesomeIcon icon={iconData.icon} size="lg" />
                <span className="icon-label">{iconData.displayName}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .icon-picker {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .search-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: var(--space-3);
          color: var(--text-muted);
          pointer-events: none;
          z-index: 1;
        }

        .search-input {
          width: 100%;
          padding: var(--space-3) var(--space-4) var(--space-3) 2.5rem;
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-lg);
          background-color: var(--gray-50);
          font-size: 0.875rem;
          color: var(--text-primary);
          outline: none;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          border-color: var(--primary-500);
          background-color: white;
        }

        .search-input::placeholder {
          color: var(--text-muted);
        }

        .category-tabs {
          display: flex;
          gap: var(--space-2);
          padding: var(--space-1);
          background-color: var(--gray-100);
          border-radius: var(--radius-lg);
        }

        .tab-btn {
          flex: 1;
          padding: var(--space-2) var(--space-3);
          border: none;
          border-radius: var(--radius);
          background: transparent;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab-btn:hover {
          background-color: var(--gray-200);
        }

        .tab-btn.active {
          background-color: white;
          color: var(--primary-600);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .icons-grid-container {
          max-height: 400px;
          overflow-y: auto;
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-lg);
          padding: var(--space-3);
          background-color: white;
        }

        .icons-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
          gap: var(--space-2);
        }

        .icon-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--space-1);
          padding: var(--space-3) var(--space-2);
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-lg);
          background-color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          min-height: 70px;
        }

        .icon-item:hover {
          border-color: var(--primary-300);
          background-color: var(--primary-50);
          transform: translateY(-2px);
        }

        .icon-item.selected {
          border-color: var(--primary-500);
          background-color: var(--primary-50);
        }

        .icon-item :global(svg) {
          color: var(--primary-600);
        }

        .check-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 18px;
          height: 18px;
          border-radius: var(--radius-full);
          background-color: var(--primary-500);
          color: white;
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .icon-label {
          font-size: 0.65rem;
          color: var(--text-secondary);
          text-align: center;
          line-height: 1.2;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .empty-state {
          padding: var(--space-8) var(--space-4);
          text-align: center;
          color: var(--text-muted);
        }

        .empty-state p {
          margin: 0;
        }

        .hint {
          font-size: 0.75rem;
          margin-top: var(--space-1);
        }

        .icons-grid-container::-webkit-scrollbar {
          width: 8px;
        }

        .icons-grid-container::-webkit-scrollbar-track {
          background: var(--gray-100);
          border-radius: var(--radius);
        }

        .icons-grid-container::-webkit-scrollbar-thumb {
          background: var(--gray-300);
          border-radius: var(--radius);
        }

        .icons-grid-container::-webkit-scrollbar-thumb:hover {
          background: var(--gray-400);
        }
      `}</style>
    </div>
  );
};
