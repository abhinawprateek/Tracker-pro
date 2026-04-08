import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '../context/StoreContext';

export const metadata: Metadata = {
  title: 'Productivity Tracker',
  description: 'Gamified productivity and study tracker',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
