import './globals.css';
import ClientLayout from '@/components/ClientLayout';

export const metadata = {
  title: 'NavorikaPro - Universal Client Suite',
  description: 'High-speed local client computing engines and calculators.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[var(--background)] text-[var(--foreground)] antialiased min-h-screen flex flex-col transition-colors duration-300">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
