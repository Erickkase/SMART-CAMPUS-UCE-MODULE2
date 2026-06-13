import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SMART CAMPUS UCE - Student Welfare',
  description: 'Module 2 frontend for student welfare and support services.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
