import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import { SteelTakeoffCalculator } from '@/components/tools/SupplierTakeoffTools';
export default function Page(){return <ExpansionToolPage category="construction-calculators" eyebrow="Theoretical material mass" title="Steel Weight Calculator" description="Estimate theoretical mass for supported solid bars and a clearly defined ideal I-section."><SteelTakeoffCalculator/></ExpansionToolPage>}
