import { notFound } from 'next/navigation';
import { createFinanceSuiteMetadata, getFinanceSuiteStaticParams, isFinanceSuiteSuboption } from '@/lib/seo/financeSuite';
export function generateStaticParams() { return getFinanceSuiteStaticParams('loan-amortization-suite'); }
export async function generateMetadata({ params }: { params: Promise<{ suboption: string }> }) { return createFinanceSuiteMetadata('loan-amortization-suite', (await params).suboption); }
export default async function Layout({ children, params }: LayoutProps<'/tools/loan-amortization-suite/[suboption]'>) {
  if (!isFinanceSuiteSuboption('loan-amortization-suite', (await params).suboption)) notFound();
  return children;
}
