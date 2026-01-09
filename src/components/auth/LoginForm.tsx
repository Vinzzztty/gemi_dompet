'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface LoginFormProps {
    onLoginSuccess?: () => void;
    redirectTo?: string;
}

export default function LoginForm({ 
    onLoginSuccess, 
    redirectTo = '/' 
}: LoginFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle error responses
                toast.error(data.message || 'Login gagal');
                return;
            }

            // Success - save token to localStorage
            if (data.data?.token) {
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));
            }

            toast.success(`Selamat datang, ${data.data.user.fullName}!`);
            
            // Call success callback if provided
            if (onLoginSuccess) {
                onLoginSuccess();
            }
            
            // Redirect after short delay
            setTimeout(() => {
                router.push(redirectTo);
            }, 1000);
            
        } catch (error) {
            console.error('Login error:', error);
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
                    Selamat Datang Kembali
                </h1>
                <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
                    Masuk ke akun Gemi Dompet Anda
                </p>
            </div>

            <form onSubmit={handleSubmit}>
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

                <div style={{ marginBottom: 'var(--space-6)' }}>
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
                            placeholder="Masukkan password"
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
                    {isLoading ? 'Masuk...' : 'Masuk'}
                </button>

                <div style={{ 
                    marginTop: 'var(--space-5)', 
                    textAlign: 'center' 
                }}>
                    <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
                        Belum punya akun?{' '}
                        <a 
                            href="/register" 
                            style={{ 
                                color: 'var(--primary-600)',
                                fontWeight: '500',
                                textDecoration: 'none'
                            }}
                        >
                            Daftar sekarang
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
}
