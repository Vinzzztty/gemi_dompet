import '@/app/globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'DompetKu - Kelola Keuanganmu',
    description: 'Aplikasi pengelolaan keuangan pribadi yang mudah dan praktis',
    keywords: ['keuangan', 'dompet', 'pengeluaran', 'pemasukan', 'budget'],
    authors: [{ name: 'DompetKu Team' }],
};

export default function DashboardLayout({
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
                <main className="main-container">
                    {children}
                </main>
            </body>
        </html>
    );
}
