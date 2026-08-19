import { createFinanceSuiteMetadata } from '@/lib/seo/financeSuite';
export async function generateMetadata({ params }: { params: Promise<{ suboption: string }> }) { return createFinanceSuiteMetadata('loan-amortization-suite', (await params).suboption); }
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
