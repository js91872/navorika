import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import { SandTakeoffCalculator } from '@/components/tools/SupplierTakeoffTools';
export default function Page(){return <ExpansionToolPage category="construction-calculators" eyebrow="Bulk material takeoff" title="Sand Calculator" description="Estimate measured and allowance-adjusted sand volume, mass, bags, and payload-based truck loads."><SandTakeoffCalculator/></ExpansionToolPage>}
