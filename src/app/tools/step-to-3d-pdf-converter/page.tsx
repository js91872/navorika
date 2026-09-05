import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import StepTo3dPdfTool from '@/components/tools/cad/StepTo3dPdfTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="CAD & 3D Engineering"
      title="STEP to 3D PDF Converter"
      description="Convert STEP and STP CAD files to 3D PDF online with interactive PRC geometry."
    >
      <StepTo3dPdfTool />
    </ExpansionToolPage>
  );
}
