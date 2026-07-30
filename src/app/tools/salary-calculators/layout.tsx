import { ReactNode } from 'react';

export const metadata = {
  title: 'In-Hand Salary Calculator | CTC Breakout & Payroll Suite | Navorika',
  description: 'Free online payroll tools. Calculate net monthly in-hand salary, annual CTC components, corporate performance bonus splits, and salary hike appraisals.',
  keywords: 'salary calculator, in hand salary calculator, ctc calculator, salary hike calculator, bonus calculator, overtime calculator, payroll utilities',
};

export default function SalaryLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
