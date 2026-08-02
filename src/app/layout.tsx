import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/header/navbar';
import Footer from '@/components/footer/Footer';

export const metadata = {
  title: 'NavorikaPro - Universal Client Suite',
  description: 'High-speed local client computing engines and calculators.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[var(--color-background)] text-[var(--color-foreground)] antialiased min-h-screen flex flex-col selection:bg-indigo-500/30">
        <ThemeProvider>
          <Navbar />
          <div className="w-full flex-1 flex flex-col">
            {children}
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
