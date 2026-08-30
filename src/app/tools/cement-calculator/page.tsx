import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import { CementTakeoffCalculator } from '@/components/tools/SupplierTakeoffTools';
export default function Page(){return <ExpansionToolPage category="construction-calculators" eyebrow="Nominal material takeoff" title="Cement Calculator" description="Estimate nominal cement, sand, and aggregate quantities from finished wet concrete volume and explicit planning assumptions."><CementTakeoffCalculator/></ExpansionToolPage>}
