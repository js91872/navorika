import { notFound } from 'next/navigation';
import { createFinanceSuiteMetadata, getFinanceSuiteStaticParams, isFinanceSuiteSuboption } from '@/lib/seo/financeSuite';
export function generateStaticParams() { return getFinanceSuiteStaticParams('taxation-compliance-deck'); }
export async function generateMetadata({ params }: { params: Promise<{ suboption: string }> }) { return createFinanceSuiteMetadata('taxation-compliance-deck', (await params).suboption, true); }
export default async function Layout({ children, params }: LayoutProps<'/tools/taxation-compliance-deck/[suboption]'>) {
  if (!isFinanceSuiteSuboption('taxation-compliance-deck', (await params).suboption)) notFound();
  return children;
}
