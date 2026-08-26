import type { Metadata, Viewport } from 'next';
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
  manifest: '/site.webmanifest',
  applicationName: 'Tap Tap Dzikr',
  appleWebApp: {
    capable: true,
    title: 'Tap Tap Dzikr',
    statusBarStyle: 'default',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
      { url: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
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
