import { createFinanceSuiteMetadata } from '@/lib/seo/financeSuite';
export async function generateMetadata({ params }: { params: Promise<{ suboption: string }> }) { return createFinanceSuiteMetadata('investment-return-profiler', (await params).suboption); }
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
