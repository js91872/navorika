import type { Metadata } from 'next';
import Link from 'next/link';
import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import ObjToSkpConverter from '@/components/tools/cad/ObjToSkpConverter';

const url = 'https://navorika.com/tools/obj-to-skp-converter';
export const metadata: Metadata = {
  title: 'OBJ to SKP Converter Online | SketchUp 3D Model Files',
  description: 'Convert OBJ mesh geometry and simple MTL texture materials into SketchUp SKP files. Check units, geometry, UVs and limitations before using a model.',
  alternates: { canonical: url },
  robots: { index: false, follow: true },
};

export default function Page() {
  const questions = [
    ['Does OBJ to SKP create an actual SketchUp file?', 'Yes. The conversion service writes SKP model geometry rather than changing the file extension. Check the result in SketchUp before relying on it.'],
    ['Does the converter preserve textures?', 'Basic MTL diffuse PNG/JPEG textures and explicit OBJ UV mapping are supported. Advanced shaders, PBR materials, transparency maps and some texture options are not.'],
    ['How should I choose OBJ units?', 'OBJ has no defined scale. Choose metres, centimetres, millimetres or inches before converting. Verify the model dimensions after opening the SKP file.'],
    ['Can I convert architectural meshes?', 'Small, simple OBJ meshes are the intended use. Complex, concave or malformed meshes may require cleanup in a 3D editor first.'],
    ['Are my 3D models private?', 'Files are uploaded to a temporary isolated server workspace, not converted in the browser. The temporary files are deleted when the conversion request finishes.'],
  ];
  return (
    <ExpansionToolPage category="developer-tools" eyebrow="3D modelling and CAD files"
      title="OBJ to SKP Converter — SketchUp Models"
      description="Convert Wavefront OBJ geometry and basic MTL textures into a genuine SketchUp SKP file. No account required when the conversion service is enabled.">
      <ObjToSkpConverter />
      <article className="mx-auto mt-10 max-w-3xl space-y-7 text-sm leading-7 text-[var(--muted-foreground)]">
        <section><h2 className="mb-2 text-xl font-bold text-[var(--foreground)]">How to convert OBJ to SKP</h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>Choose your .obj geometry file.</li>
            <li>Add any .mtl file and PNG or JPEG textures referenced by your OBJ and material definitions.</li>
            <li>Select Convert, download the resulting .skp file and open it in SketchUp desktop.</li>
            <li>Inspect dimensions, face orientation, textures and editing behaviour before using it in a project.</li>
          </ol>
        </section>
        <section><h2 className="mb-2 text-xl font-bold text-[var(--foreground)]">OBJ versus SKP: what changes?</h2>
          <p>Wavefront OBJ represents mesh geometry as vertices, polygon faces and optional texture coordinates. SketchUp SKP is a project file that contains editable surfaces and materials. Converted mesh faces remain faces rather than becoming parametric solid CAD features. When models contain many tiny triangles, editing in SketchUp can be more difficult than working with a simpler model.</p>
        </section>
        <section><h2 className="mb-2 text-xl font-bold text-[var(--foreground)]">Materials, units and known limits</h2>
          <p>OBJ files do not specify physical measurement units. Choose the source coordinate units (metres, centimetres, millimetres or inches) to set the conversion scale. Supported materials include simple MTL colours and PNG/JPEG diffuse textures with UV coordinates. Some textured polygons are triangulated and complex concave polygons can change appearance. The request is limited to a 20 MB OBJ, up to 12 companion files and 30 MB combined.</p>
        </section>
        <section><h2 className="mb-2 text-xl font-bold text-[var(--foreground)]">Frequently asked questions</h2>
          <div className="space-y-4">{questions.map(([question, answer]) => <div key={question}>
            <h3 className="font-semibold text-[var(--foreground)]">{question}</h3><p>{answer}</p>
          </div>)}</div>
        </section>
        <section><h2 className="mb-2 text-xl font-bold text-[var(--foreground)]">Related 3D tools</h2>
          <p>Need another output format? Explore <Link className="underline" href="/tools/step-to-3d-pdf-converter">STEP to interactive 3D PDF</Link> or visit <Link className="underline" href="/tools">Navorika tools</Link>.</p>
        </section>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context':'https://schema.org','@type':'WebApplication',name:'OBJ to SKP Converter',
        url,applicationCategory:'DesignApplication',operatingSystem:'Any',
        description:'Convert OBJ mesh geometry and basic MTL materials to SKP.'
      }).replace(/</g, '\\u003c') }} />
    </ExpansionToolPage>
  );
}
