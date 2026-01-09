'use client';

import { useState, useEffect, useRef } from 'react';
import { getCurrentUser, logout } from '@/lib/auth-client';
import { toast } from 'sonner';

export function ProfileDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [user, setUser] = useState<{ fullName: string; email: string } | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Get user data from localStorage
        const userData = getCurrentUser();
        setUser(userData);
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleLogoutClick = () => {
        setShowLogoutDialog(true);
    };

    const handleConfirmLogout = () => {
        setShowLogoutDialog(false);
        setIsOpen(false);
        toast.success('Logout berhasil. Sampai jumpa!');
        setTimeout(() => {
            logout();
        }, 1000);
    };

    const handleCancelLogout = () => {
        setShowLogoutDialog(false);
    };

    // Get initials for avatar
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div style={{ position: 'relative' }} ref={dropdownRef}>
            {/* Profile Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-500)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary-600)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary-500)';
                    e.currentTarget.style.transform = 'scale(1)';
                }}
            >
                {user ? getInitials(user.fullName) : 'U'}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 10px)',
                        right: '0',
                        width: '320px',
                        backgroundColor: 'white',
                        borderRadius: 'var(--radius-xl)',
                        boxShadow: 'var(--shadow-xl)',
                        zIndex: 1000,
                        overflow: 'hidden',
                        animation: 'fadeIn 0.2s ease',
                    }}
                >
                    {/* User Info Header */}
                    <div
                        style={{
                            background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%)',
                            padding: 'var(--space-6)',
                            color: 'white',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                            <div
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.25rem',
                                    fontWeight: '700',
                                }}
                            >
                                {user ? getInitials(user.fullName) : 'U'}
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600' }}>
                                    {user?.fullName || 'User'}
                                </h3>
                                <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>
                                    {user?.email || 'user@example.com'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div style={{ padding: 'var(--space-2)' }}>
                        <MenuItem
                            icon="👤"
                            label="Profil Saya"
                            onClick={() => {
                                toast.info('Fitur Profil coming soon!');
                                setIsOpen(false);
                            }}
                        />
                        <MenuItem
                            icon="⚙️"
                            label="Pengaturan"
                            onClick={() => {
                                toast.info('Fitur Pengaturan coming soon!');
                                setIsOpen(false);
                            }}
                        />
                        <MenuItem
                            icon="📊"
                            label="Statistik"
                            onClick={() => {
                                toast.info('Fitur Statistik coming soon!');
                                setIsOpen(false);
                            }}
                        />
                        <MenuItem
                            icon="🎯"
                            label="Target Keuangan"
                            onClick={() => {
                                toast.info('Fitur Target Keuangan coming soon!');
                                setIsOpen(false);
                            }}
                        />
                        <MenuItem
                            icon="❓"
                            label="Bantuan"
                            onClick={() => {
                                toast.info('Fitur Bantuan coming soon!');
                                setIsOpen(false);
                            }}
                        />
                    </div>

                    {/* Divider */}
                    <div
                        style={{
                            height: '1px',
                            backgroundColor: 'var(--gray-200)',
                            margin: '0 var(--space-4)',
                        }}
                    />

                    {/* Logout Button */}
                    <div style={{ padding: 'var(--space-4)' }}>
                        <button
                            onClick={handleLogoutClick}
                            style={{
                                width: '100%',
                                padding: 'var(--space-3)',
                                backgroundColor: 'transparent',
                                border: '1px solid var(--danger)',
                                borderRadius: 'var(--radius-lg)',
                                color: 'var(--danger)',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 'var(--space-2)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--danger)';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = 'var(--danger)';
                            }}
                        >
                            🚪 Keluar
                        </button>
                    </div>
                </div>
            )}

            {/* Logout Confirmation Dialog */}
            {showLogoutDialog && (
                <>
                    {/* Overlay */}
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            zIndex: 9999,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            animation: 'fadeIn 0.2s ease',
                        }}
                        onClick={handleCancelLogout}
                    >
                        {/* Dialog */}
                        <div
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 'var(--radius-xl)',
                                padding: 'var(--space-6)',
                                maxWidth: '400px',
                                width: '90%',
                                boxShadow: 'var(--shadow-xl)',
                                animation: 'slideUp 0.3s ease',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Dialog Header */}
                            <div style={{ textAlign: 'center', marginBottom: 'var(--space-5)' }}>
                                <div
                                    style={{
                                        fontSize: '3rem',
                                        marginBottom: 'var(--space-3)',
                                    }}
                                >
                                    ⚠️
                                </div>
                                <h3
                                    style={{
                                        margin: 0,
                                        fontSize: '1.25rem',
                                        fontWeight: '600',
                                        color: 'var(--text-primary)',
                                        marginBottom: 'var(--space-2)',
                                    }}
                                >
                                    Konfirmasi Logout
                                </h3>
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: '0.875rem',
                                        color: 'var(--text-secondary)',
                                    }}
                                >
                                    Apakah Anda yakin ingin keluar?
                                </p>
                            </div>

                            {/* Dialog Actions */}
                            <div
                                style={{
                                    display: 'flex',
                                    gap: 'var(--space-3)',
                                }}
                            >
                                <button
                                    onClick={handleCancelLogout}
                                    style={{
                                        flex: 1,
                                        padding: 'var(--space-3)',
                                        backgroundColor: 'transparent',
                                        border: '1px solid var(--gray-300)',
                                        borderRadius: 'var(--radius-lg)',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 'var(--gray-100)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleConfirmLogout}
                                    style={{
                                        flex: 1,
                                        padding: 'var(--space-3)',
                                        backgroundColor: 'var(--danger)',
                                        border: 'none',
                                        borderRadius: 'var(--radius-lg)',
                                        color: 'white',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#dc2626';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'var(--danger)';
                                    }}
                                >
                                    Ya, Keluar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Add keyframe animations */}
                    <style>
                        {`
                            @keyframes slideUp {
                                from {
                                    opacity: 0;
                                    transform: translateY(20px);
                                }
                                to {
                                    opacity: 1;
                                    transform: translateY(0);
                                }
                            }
                        `}
                    </style>
                </>
            )}
        </div>
    );
}

// Menu Item Component
function MenuItem({
    icon,
    label,
    onClick,
}: {
    icon: string;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            style={{
                width: '100%',
                padding: 'var(--space-3)',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                fontSize: '0.875rem',
                color: 'var(--text-primary)',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--gray-100)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
            }}
        >
            <span style={{ fontSize: '1.25rem' }}>{icon}</span>
            <span style={{ flex: 1, textAlign: 'left', fontWeight: '500' }}>{label}</span>
            <span style={{ color: 'var(--gray-400)' }}>›</span>
        </button>
    );
}

export default ProfileDropdown;
