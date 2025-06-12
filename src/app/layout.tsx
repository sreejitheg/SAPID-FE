import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SAPID - AI-Powered Assistant',
  description: 'AI-powered document analysis, chat functionality, and task automation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}