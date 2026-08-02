import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import Header from '@/components/Header';

export const metadata = {
  title: 'NavorikaPro - High Speed Utility Portal',
  description: '100% Client-side privacy focused tools.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 dark:bg-[#0A0A0B] transition-colors duration-500 m-0 p-0 antialiased">
        <ThemeProvider>
          <Header />
          <div className="pt-[80px] min-h-screen flex flex-col">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
