import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import GambrelRoofCalculator from '@/components/tools/GambrelRoofCalculator';
import GambrelRoofGuide from '@/components/tools/GambrelRoofGuide';

export default function Page() {
  return (
    <ExpansionToolPage
      category="construction-calculators"
      eyebrow="Gambrel roof geometry and material planning"
      title="12 Foot Gambrel Roof Truss Calculator"
      description="Calculate rafter lengths, roof height, slope angles, break point, truss quantity, and roofing area with a live gambrel diagram."
    >
      <GambrelRoofCalculator />
      <GambrelRoofGuide />
    </ExpansionToolPage>
  );
}
