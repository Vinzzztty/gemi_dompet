'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface RegisterFormProps {
    onRegisterSuccess?: () => void;
    redirectTo?: string;
}

export default function RegisterForm({ 
    onRegisterSuccess, 
    redirectTo = '/login' 
}: RegisterFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation
        if (formData.password !== formData.confirmPassword) {
            toast.error('Password tidak cocok');
            return;
        }

        if (formData.password.length < 8) {
            toast.error('Password minimal 8 karakter');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    fullName: formData.name,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle error responses
                toast.error(data.message || 'Registrasi gagal');
                return;
            }

            // Success
            toast.success('Registrasi berhasil! Silakan login.');
            
            // Call success callback if provided
            if (onRegisterSuccess) {
                onRegisterSuccess();
            }
            
            // Redirect after short delay
            setTimeout(() => {
                router.push(redirectTo);
            }, 1000);
            
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="card animate-fade-in" style={{ 
            width: '100%', 
            maxWidth: '400px',
            margin: '0 auto'
        }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                <h1 style={{ 
                    fontSize: '1.875rem', 
                    fontWeight: '700',
                    marginBottom: 'var(--space-2)',
                    color: 'var(--text-primary)'
                }}>
                    Buat Akun Baru
                </h1>
                <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
                    Daftar untuk mulai kelola keuangan Anda
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Name Field */}
                <div style={{ marginBottom: 'var(--space-5)' }}>
                    <label 
                        htmlFor="name" 
                        style={{ 
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            marginBottom: 'var(--space-2)',
                            color: 'var(--text-primary)'
                        }}
                    >
                        Nama Lengkap
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        placeholder="Masukkan nama lengkap"
                        style={{
                            width: '100%',
                            padding: 'var(--space-3)',
                            border: '1px solid var(--gray-300)',
                            borderRadius: 'var(--radius-lg)',
                            fontSize: '0.875rem',
                            transition: 'all 0.2s ease',
                            outline: 'none',
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--primary-500)';
                            e.target.style.boxShadow = '0 0 0 3px rgba(74, 144, 226, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'var(--gray-300)';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>

                {/* Email Field */}
                <div style={{ marginBottom: 'var(--space-5)' }}>
                    <label 
                        htmlFor="email" 
                        style={{ 
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            marginBottom: 'var(--space-2)',
                            color: 'var(--text-primary)'
                        }}
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        placeholder="nama@email.com"
                        style={{
                            width: '100%',
                            padding: 'var(--space-3)',
                            border: '1px solid var(--gray-300)',
                            borderRadius: 'var(--radius-lg)',
                            fontSize: '0.875rem',
                            transition: 'all 0.2s ease',
                            outline: 'none',
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--primary-500)';
                            e.target.style.boxShadow = '0 0 0 3px rgba(74, 144, 226, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'var(--gray-300)';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>

                {/* Password Field */}
                <div style={{ marginBottom: 'var(--space-5)' }}>
                    <label 
                        htmlFor="password" 
                        style={{ 
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            marginBottom: 'var(--space-2)',
                            color: 'var(--text-primary)'
                        }}
                    >
                        Password
                    </label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                            placeholder="Minimal 8 karakter"
                            style={{
                                width: '100%',
                                padding: 'var(--space-3)',
                                paddingRight: '3rem',
                                border: '1px solid var(--gray-300)',
                                borderRadius: 'var(--radius-lg)',
                                fontSize: '0.875rem',
                                transition: 'all 0.2s ease',
                                outline: 'none',
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'var(--primary-500)';
                                e.target.style.boxShadow = '0 0 0 3px rgba(74, 144, 226, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'var(--gray-300)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                            style={{
                                position: 'absolute',
                                right: 'var(--space-3)',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--text-secondary)',
                                padding: 'var(--space-1)',
                            }}
                        >
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                </div>

                {/* Confirm Password Field */}
                <div style={{ marginBottom: 'var(--space-6)' }}>
                    <label 
                        htmlFor="confirmPassword" 
                        style={{ 
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            marginBottom: 'var(--space-2)',
                            color: 'var(--text-primary)'
                        }}
                    >
                        Konfirmasi Password
                    </label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                            placeholder="Masukkan password lagi"
                            style={{
                                width: '100%',
                                padding: 'var(--space-3)',
                                paddingRight: '3rem',
                                border: '1px solid var(--gray-300)',
                                borderRadius: 'var(--radius-lg)',
                                fontSize: '0.875rem',
                                transition: 'all 0.2s ease',
                                outline: 'none',
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'var(--primary-500)';
                                e.target.style.boxShadow = '0 0 0 3px rgba(74, 144, 226, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'var(--gray-300)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            disabled={isLoading}
                            style={{
                                position: 'absolute',
                                right: 'var(--space-3)',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--text-secondary)',
                                padding: 'var(--space-1)',
                            }}
                        >
                            {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isLoading}
                    style={{ 
                        width: '100%',
                        padding: 'var(--space-3)',
                        fontSize: '1rem',
                        fontWeight: '600',
                        opacity: isLoading ? 0.7 : 1,
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                    }}
                >
                    {isLoading ? 'Mendaftar...' : 'Daftar'}
                </button>

                <div style={{ 
                    marginTop: 'var(--space-5)', 
                    textAlign: 'center' 
                }}>
                    <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
                        Sudah punya akun?{' '}
                        <a 
                            href="/login" 
                            style={{ 
                                color: 'var(--primary-600)',
                                fontWeight: '500',
                                textDecoration: 'none'
                            }}
                        >
                            Masuk sekarang
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
}
