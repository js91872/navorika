import { ReactNode } from 'react';

export const metadata = {
  title: 'Retirement Calculator | Pension, Annuity & FIRE Planner Suite | Navorika',
  description: 'Free online retirement tools. Calculate your required retirement corpus, retirement withdrawal rates, pension annuity streams, and FIRE targets.',
  keywords: 'retirement calculator, pension calculator, fire calculator, retirement corpus calculator, annuity calculator, retirement withdrawal calculator',
};

export default function RetirementLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
