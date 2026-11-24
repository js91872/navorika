import PageHelp from '@/components/seo/PageHelp';
import { notFound } from 'next/navigation';
import { createFinanceSuiteMetadata, getFinanceSuiteStaticParams, isFinanceSuiteSuboption } from '@/lib/seo/financeSuite';
export function generateStaticParams() { return getFinanceSuiteStaticParams('loan-amortization-suite'); }
export async function generateMetadata({ params }: { params: Promise<{ suboption: string }> }) { return createFinanceSuiteMetadata('loan-amortization-suite', (await params).suboption); }
export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ suboption: string }> }) {
  const { suboption } = await params;
  if (!isFinanceSuiteSuboption('loan-amortization-suite', suboption)) notFound();
  return <>{children}<PageHelp path={`/tools/loan-amortization-suite/${suboption}`} /></>;
}
