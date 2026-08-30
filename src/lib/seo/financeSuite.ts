import type { Metadata } from 'next';
import type { SubToolSEO } from '@/data/financeMeta';
import { budgetSubTools, investmentSubTools, loanSubTools, savingsSubTools, taxSubTools, wealthSubTools } from '@/data/financeMeta';

export const financeSuites: Record<string, Record<string, SubToolSEO>> = {
  'cashflow-budget-architect': budgetSubTools,
  'investment-return-profiler': investmentSubTools,
  'loan-amortization-suite': loanSubTools,
  'savings-retirement-hub': savingsSubTools,
  'taxation-compliance-deck': taxSubTools,
  'wealth-inflation-matrix': wealthSubTools,
};

export function createFinanceSuiteMetadata(suite: string, suboption: string, noIndex = false): Metadata {
  const tool = financeSuites[suite]?.[suboption];
  if (!tool) return { title: 'Finance Tool Not Found', robots: { index: false, follow: false } };
  const url = `https://navorika.com/tools/${suite}/${suboption}`;
  return {
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title: tool.title, description: tool.description, siteName: 'Navorika' },
    robots: noIndex ? { index: false, follow: true } : undefined,
  };
}

export function getFinanceSuiteUrls() {
  return Object.entries(financeSuites).flatMap(([suite, tools]) =>
    Object.keys(tools).map((suboption) => `/tools/${suite}/${suboption}`)
  );
}

export function getFinanceSuiteStaticParams(suite: string) {
  return Object.keys(financeSuites[suite] ?? {}).map((suboption) => ({ suboption }));
}

export function isFinanceSuiteSuboption(suite: string, suboption: string) {
  return Object.hasOwn(financeSuites[suite] ?? {}, suboption);
}
