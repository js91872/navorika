import { ReactNode } from 'react';

export const metadata = {
  title: 'Protect PDF with Password | Unlock PDF & Set Permissions | Navorika',
  description: 'Free browser-based PDF security tool. Add password encryption, remove password protection locks, and restrict printing/copy privileges securely.',
  keywords: 'protect pdf, password protect pdf, unlock pdf, remove pdf password, encrypt pdf, decrypt pdf, restrict pdf printing',
};

export default function PDFSecurityLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
