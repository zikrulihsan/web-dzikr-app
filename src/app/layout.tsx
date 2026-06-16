import type { Metadata } from 'next';
import { Amiri } from 'next/font/google';
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
  title: 'Dzikr App',
  description: 'A mobile-first app for tracking your daily dzikr',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={amiri.variable}>
      <body>
        <GoogleAnalytics />
        <UmamiAnalytics />
        <ThemeProvider>
          <main className="min-h-screen">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
