import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import { TileTakeoffCalculator } from '@/components/tools/SupplierTakeoffTools';
export default function Page(){return <ExpansionToolPage category="construction-calculators" eyebrow="Tile grid takeoff" title="Tile Calculator" description="Estimate a fixed-orientation tile grid, allowance-adjusted whole tiles, and boxes from actual package quantity."><TileTakeoffCalculator/></ExpansionToolPage>}
