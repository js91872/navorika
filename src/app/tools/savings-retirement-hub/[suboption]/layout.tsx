import { notFound } from 'next/navigation';
import { createFinanceSuiteMetadata, getFinanceSuiteStaticParams, isFinanceSuiteSuboption } from '@/lib/seo/financeSuite';
export function generateStaticParams() { return getFinanceSuiteStaticParams('savings-retirement-hub'); }
export async function generateMetadata({ params }: { params: Promise<{ suboption: string }> }) { return createFinanceSuiteMetadata('savings-retirement-hub', (await params).suboption); }
export default async function Layout({ children, params }: LayoutProps<'/tools/savings-retirement-hub/[suboption]'>) {
  if (!isFinanceSuiteSuboption('savings-retirement-hub', (await params).suboption)) notFound();
  return children;
}
