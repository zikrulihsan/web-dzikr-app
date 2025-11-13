import type { Metadata } from 'next';
import '@/styles/globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import AuthProvider from '@/components/AuthProvider';
// Add FontAwesome CSS
import '@fortawesome/fontawesome-free/css/all.min.css';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import UmamiAnalytics from '@/components/UmamiAnalytics';

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
    <html lang="en">
      <body>
        <GoogleAnalytics />
        <UmamiAnalytics />
        <AuthProvider>
          <ThemeProvider>
            <main className="min-h-screen">
              {children}
            </main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
