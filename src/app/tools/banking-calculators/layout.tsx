import { ReactNode } from 'react';

export const metadata = {
  title: 'Banking Calculators | SWIFT Finder & IBAN Validator | Navorika',
  description: 'Free online banking tools. Calculate savings interest, evaluate bank charges, and securely validate SWIFT/BIC and IBAN codes.',
};

export default function BankingLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
