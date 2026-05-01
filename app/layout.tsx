import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Thailand Tourism — Discover 77 Provinces',
  description: 'AI-powered personalized Thailand tourism recommendations with interactive 3D map',
  keywords: 'Thailand tourism, travel, provinces, AI recommendations',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" style={{ background: '#0a0a0f' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ minHeight: '100vh', background: '#0a0a0f' }}>{children}</body>
    </html>
  );
}
