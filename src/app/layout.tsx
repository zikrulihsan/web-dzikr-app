import type { Metadata } from 'next';
import { Amiri } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import '@/styles/globals.css';
import ThemeProvider from '@/components/ThemeProvider';
// Add FontAwesome CSS
import '@fortawesome/fontawesome-free/css/all.min.css';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import UmamiAnalytics from '@/components/UmamiAnalytics';

// Elegant Quranic naskh script for Arabic, exposed as a CSS variable
const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://dzikir-harian.netlify.app'),
  title: 'Tap Tap Dzikr — Jeda kecil untuk hati',
  description: 'Ganti kebiasaan tap tap medsos dengan tap tap dzikr.',
  openGraph: {
    title: 'Tap Tap Dzikr — Jeda kecil untuk hati',
    description: 'Ganti kebiasaan tap tap medsos dengan tap tap dzikr.',
    type: 'website',
    locale: 'id_ID',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Tap Tap Dzikr — Tap layar. Ingat Allah.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tap Tap Dzikr — Jeda kecil untuk hati',
    description: 'Ganti kebiasaan tap tap medsos dengan tap tap dzikr.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${amiri.variable} ${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <GoogleAnalytics />
        <UmamiAnalytics />
        <ThemeProvider>
          <main className="app-main">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
