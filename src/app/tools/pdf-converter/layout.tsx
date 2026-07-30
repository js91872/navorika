import { ReactNode } from 'react';

export const metadata = {
  title: 'Universal PDF Converter | JPG to PDF, PDF to PNG & Text | Navorika',
  description: 'Free browser-based PDF converter matrix. Convert JPG/PNG/WEBP to PDF, or extract images and plain text from your PDF files with complete local privacy.',
  keywords: 'jpg to pdf, png to pdf, webp to pdf, pdf to jpg, pdf to png, pdf to text, text to pdf, client side pdf converter',
};

export default function PDFConverterLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
