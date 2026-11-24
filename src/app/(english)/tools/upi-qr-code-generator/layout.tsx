import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Free UPI QR Code Generator – Printable PNG & PDF Poster',
  description: 'Create a UPI payment QR code with optional amount, business logo, name, and five poster colors. Download PNG or PDF privately in your browser.',
  alternates: { canonical: 'https://navorika.com/tools/upi-qr-code-generator' },
};
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
