import '@/app/globals.css';
import { Metadata } from 'next';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
    title: 'DompetKu - Login',
    description: 'Masuk ke akun DompetKu Anda',
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="id">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <Toaster 
                    position="top-center" 
                    richColors 
                    closeButton 
                    duration={3000}
                />
                <main className="main-container">
                    {children}
                </main>
            </body>
        </html>
    );
}
