import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Navorika Pro | High-Performance Offline Tool Suite',
  description: 'Ultra-fast, 100% secure client-side utility matrices running entirely in your browser tab.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 min-h-screen flex flex-col antialiased transition-colors duration-300">
        {/* Global Navigation Header */}
        <Navbar />
        
        {/* Main Application Rendering Context */}
        <div className="flex-1 flex flex-col relative w-full">
          {children}
        </div>
      </body>
    </html>
  );
}
