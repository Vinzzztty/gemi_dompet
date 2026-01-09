'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        
        if (!token) {
            // No token found, redirect to login
            router.push('/login');
        }
    }, [router]);

    // Check token on mount
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    // Don't render children if not authenticated
    if (!token) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                color: 'var(--text-secondary)'
            }}>
                <p>Redirecting to login...</p>
            </div>
        );
    }

    return <>{children}</>;
}
