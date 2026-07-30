import { ReactNode } from 'react';

export const metadata = {
  title: 'Edit PDF | Rotate, Reorder & Add Text to PDF | Navorika',
  description: 'Free online PDF editor. Securely rotate pages, reorder layouts, add text, and inject images into your PDF files directly in your browser.',
  keywords: 'edit pdf, rotate pdf, reorder pdf pages, add text to pdf, add image to pdf, pdf modifier, online pdf tools',
};

export default function PDFEditorLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
