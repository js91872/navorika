import type {Metadata} from 'next';
import Link from 'next/link';
import Converter from './Converter';
const url='https://navorika.com/tools/jpg-to-dxf';
export const metadata:Metadata={
 title:'JPG to DXF Converter – Free Online Image to CAD Tool',
 description:'Convert JPG to DXF online for free. Trace images into editable CAD vector paths for AutoCAD, CNC and laser cutting. Preview, adjust and download.',
 keywords:['jpg to dxf','jpg to dxf converter','convert jpg to dxf','jpeg to dxf converter','image to dxf','raster to dxf','jpg to autocad','jpg to dxf online free','image to cad converter'],
 alternates:{canonical:url},
 openGraph:{title:'Free JPG to DXF Converter | Navorika',description:'Trace image outlines into editable DXF CAD polylines, right in your browser.',url}
};
const faqs=[
 ['Can you convert JPG to DXF for free?','Yes. Navorika traces a JPG, JPEG, PNG or WebP image locally in the browser and downloads a 2D DXF file at no cost.'],
 ['Does JPG to DXF create real vector lines?','Yes. The result contains DXF LWPOLYLINE geometry traced from thresholded image regions. It is not simply a JPG image attached to a DXF file.'],
 ['Will this make a photo into a precise engineering drawing?','No. Automatic outlines cannot recover real dimensions, tolerances or hidden geometry. Reconstruct and measure precise parts in CAD.'],
 ['Can I use the DXF for CNC or laser cutting?','The generated file can be opened in many CAD/CAM applications, but you must inspect dimensions, contour closure, overlaps and machine toolpaths before cutting.'],
 ['Can AutoCAD open the converted file?','DXF is a CAD exchange format supported by AutoCAD and many alternatives. Import the downloaded DXF and check units and dimensions.']
];
export default function Page(){return <main className="mx-auto max-w-5xl px-4 py-10 text-slate-900 sm:px-6">
  <nav className="text-sm"><Link className="text-blue-700 underline" href="/tools">All tools</Link> / Image conversion</nav>
  <h1 className="mt-6 text-4xl font-extrabold">JPG to DXF Converter – Convert Image to CAD Online Free</h1>
  <p className="mt-5 text-lg leading-8">Convert JPG to DXF online in your browser. Turn a logo, sketch, symbol or high-contrast image into editable 2D DXF outlines for AutoCAD, LibreCAD, CNC and laser-cutting workflows. Preview the traced paths, tune the threshold and download without registration.</p>
  <Converter/>
  <article className="mt-12 space-y-7 leading-8">
    <section><h2 className="text-2xl font-bold">How to convert JPG to DXF online</h2>
      <ol className="list-decimal pl-6"><li>Upload a clean JPG or JPEG image, or try PNG or WebP.</li><li>Adjust the black-and-white threshold until the preview follows the desired shapes.</li><li>Remove tiny unwanted contours by increasing minimum contour area.</li><li>Set output width in millimetres; check the displayed approximate height.</li><li>Download the DXF file and inspect it in CAD before using any CNC or cutting equipment.</li></ol>
    </section>
    <section><h2 className="text-2xl font-bold">How does JPG to DXF conversion work?</h2>
      <p>JPG stores pixels, while DXF can store vector objects such as 2D polylines. This converter first separates darker and lighter image regions using a threshold. It follows the boundaries of those regions, removes selected small contours and exports closed polyline entities. These are editable geometry, but tracing does not magically recover the geometry of the original CAD drawing.</p>
      <p>For an excellent result, use dark line art against a white background, crop unnecessary space, avoid noisy photographs and carefully check the traced vector preview. The reduction setting can reduce excess points, but can also remove fine detail.</p>
    </section>
    <section><h2 className="text-2xl font-bold">JPG to DXF for AutoCAD, CNC and laser cutting</h2>
      <p>AutoCAD and other CAD programs commonly open DXF. CNC engraving and laser workflows may use DXF outlines, but a valid DXF is not automatically ready to machine. Check units, intended size, line overlap, cutter compensation, kerf, closed paths and tool direction in the destination software. The tool sets millimetre units and asks you for the output width; it cannot measure an object from a JPG.</p>
    </section>
    <section><h2 className="text-2xl font-bold">Free image-to-DXF converter: limitations</h2>
      <p>This is a basic two-tone silhouette and outline tracer, not full-colour AI vectorization or OCR for scanned technical drawings. Thin lines can turn into double-edged contours. Intersecting lines and complex photos may produce unwanted paths. A source image is sampled at a maximum dimension of 640 pixels for responsive browser performance; very small details may be lost. When you require dimensionally accurate engineering drawings, recreate and verify the geometry in CAD or use specialized raster-to-CAD software.</p>
      <p>Want instructions and troubleshooting examples? Read our <Link href="/guides/how-to-convert-jpg-to-dxf" className="font-semibold text-blue-700 underline">complete guide to converting JPG to DXF</Link>.</p>
    </section>
    <section><h2 className="text-2xl font-bold">Frequently asked questions</h2>{faqs.map(([q,a])=><div className="mt-4" key={q}><h3 className="text-xl font-semibold">{q}</h3><p>{a}</p></div>)}</section>
    <section><h2 className="text-2xl font-bold">Related tools and guides</h2><div className="grid gap-3 sm:grid-cols-2">
      <Link className="rounded-xl border p-4 font-semibold text-blue-700" href="/tools">Explore image converters →</Link>
      <Link className="rounded-xl border p-4 font-semibold text-blue-700" href="/guides/how-to-convert-jpg-to-dxf">JPG to DXF step-by-step guide →</Link>
    </div></section>
  </article>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'WebApplication',name:'JPG to DXF Converter',applicationCategory:'DesignApplication',operatingSystem:'Any',url,isAccessibleForFree:true,offers:{'@type':'Offer',price:'0',priceCurrency:'USD'}})}}/>
 </main>}
