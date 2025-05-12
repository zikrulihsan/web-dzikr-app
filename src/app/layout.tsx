import type { Metadata } from 'next';
import '@/styles/globals.css';
import ThemeProvider from '@/components/ThemeProvider';
// Add FontAwesome CSS
import '@fortawesome/fontawesome-free/css/all.min.css';

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
        <ThemeProvider>
          <main className="min-h-screen">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
