import { ReactNode } from 'react';

export const metadata = {
  title: 'Income Tax Calculator | Old vs New Regime, GST & Gratuity | Navorika',
  description: 'Free online tax calculators. Instantly calculate Indian Income Tax (Old vs New Regime), GST, VAT, HRA Exemptions, Gratuity, and Capital Gains.',
  keywords: 'income tax calculator, old vs new tax regime, gst calculator, vat calculator, capital gains calculator, tds calculator, hra calculator, section 80c calculator, gratuity calculator, leave encashment',
};

export default function TaxLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
