import '../globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="m-0 bg-[var(--background)]">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
