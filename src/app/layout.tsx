import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeContext";
import Navbar from "@/components/header/Navbar";

export const metadata = {
  title: {
    default: "Navorika Pro | High-Performance Utility & Calculator Hub",
    template: "%s | Navorika Pro"
  },
  description: "Access an ultra-modern, zero-latency library of private client-side calculations and productivity layout tools.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="selection:bg-indigo-500 selection:text-white">
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
