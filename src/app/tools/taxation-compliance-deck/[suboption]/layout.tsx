import { createFinanceSuiteMetadata } from '@/lib/seo/financeSuite';
export async function generateMetadata({ params }: { params: Promise<{ suboption: string }> }) { return createFinanceSuiteMetadata('taxation-compliance-deck', (await params).suboption, true); }
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
