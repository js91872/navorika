import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import WebsiteWorthCalculator from '@/components/tools/WebsiteWorthCalculator';

export default function Page() {
  return <ExpansionToolPage category="everyday-calculators" eyebrow="Website Analysis & Valuation" title="Website Worth Calculator" description="Enter a URL to review observable website signals, then estimate a transparent website value range using traffic, revenue, or profit assumptions." slug="website-worth-calculator"><WebsiteWorthCalculator /></ExpansionToolPage>;
}
