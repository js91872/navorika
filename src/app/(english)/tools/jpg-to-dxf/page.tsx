import type {Metadata} from 'next';
import Link from 'next/link';
import Converter from './Converter';
import { languageAlternates } from '@/lib/i18n/config';

const url='https://navorika.com/tools/jpg-to-dxf';
export const metadata:Metadata={
  title:'JPG to DXF Converter – Free Online Image to CAD Tool',
  description:'Convert JPG to DXF online for free. Trace images into editable CAD vector paths for AutoCAD, CNC and laser cutting. Preview, adjust and download.',
  keywords:['jpg to dxf','jpg to dxf converter','convert jpg to dxf','jpeg to dxf converter','image to dxf','raster to dxf','jpg to autocad','jpg to dxf online free','image to cad converter'],
  alternates:{canonical:url,languages:languageAlternates('jpg-to-dxf')},
  openGraph:{title:'Free JPG to DXF Converter | Navorika',description:'Trace image outlines into editable DXF CAD polylines, right in your browser.',url}
};

const faqs=[
  ['Can you convert JPG to DXF for free?','Yes. Navorika traces a JPG, JPEG, PNG or WebP image locally in the browser and downloads a 2D DXF file at no cost.'],
  ['Does JPG to DXF create real vector lines?','Yes. The result contains DXF LWPOLYLINE geometry traced from thresholded image regions. It is not simply a JPG image attached to a DXF file.'],
  ['Will this make a photo into a precise engineering drawing?','No. Automatic outlines cannot recover real dimensions, tolerances or hidden geometry. Reconstruct and measure precise parts in CAD.'],
  ['Can I use the DXF for CNC or laser cutting?','The generated file can be opened in many CAD/CAM applications, but you must inspect dimensions, contour closure, overlaps and machine toolpaths before cutting.'],
  ['Can AutoCAD open the converted file?','DXF is a CAD exchange format supported by AutoCAD and many alternatives. Import the downloaded DXF and check units and dimensions.']
];

export default function Page(){
  return (
    <div className="pb-16 pt-8 text-[#18181b] dark:text-[#f4f4f5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="text-sm mb-4">
          <Link className="text-[#5b5b63] dark:text-[#a1a1aa] hover:text-[#e5322d] transition-colors" href="/tools">All tools</Link>
          <span className="text-[#5b5b63] dark:text-[#a1a1aa] mx-2">/</span>
          <span className="text-[#18181b] dark:text-white font-medium">Image conversion</span>
        </nav>
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-black text-[#18181b] dark:text-white tracking-tight">JPG to DXF Converter – Image to CAD</h1>
          <p className="mt-3 text-base text-[#5b5b63] dark:text-[#a1a1aa] leading-relaxed">Convert JPG to DXF in your browser. Turn logos, sketches, and symbols into editable 2D DXF outlines for AutoCAD, LibreCAD, CNC, and laser cutting. Preview traced paths and download for free without registration.</p>
        </div>

        <Converter/>

        <article className="mt-12 space-y-8 leading-relaxed">
          <section className="rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-6 shadow-xs">
            <h2 className="text-xl font-bold text-[#18181b] dark:text-white mb-3">How to convert JPG to DXF online</h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-[#5b5b63] dark:text-[#a1a1aa]">
              <li>Upload a clean JPG, JPEG, PNG, or WebP image.</li>
              <li>Adjust the tracing threshold until the preview follows your desired shapes.</li>
              <li>Remove small speckles or unwanted noise by adjusting minimum contour area.</li>
              <li>Set output width in millimetres and verify the calculated approximate height.</li>
              <li>Download the DXF file and inspect it in CAD before running CNC or laser cutters.</li>
            </ol>
          </section>

          <section className="rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-6 shadow-xs">
            <h2 className="text-xl font-bold text-[#18181b] dark:text-white mb-3">How does JPG to DXF conversion work?</h2>
            <div className="space-y-3 text-sm text-[#5b5b63] dark:text-[#a1a1aa]">
              <p>JPG stores pixels, while DXF stores vector objects such as 2D polylines. This converter first separates darker and lighter image regions using a threshold. It follows the boundaries of those regions, removes selected small contours, and exports closed polyline entities.</p>
              <p>For best results, use clean line art on a solid background, crop unnecessary borders, and check the traced vector preview. The point reduction setting balances smoothness and fine corner detail.</p>
            </div>
          </section>

          <section className="rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-6 shadow-xs">
            <h2 className="text-xl font-bold text-[#18181b] dark:text-white mb-3">CAD, CNC, and laser-cutting considerations</h2>
            <p className="text-sm text-[#5b5b63] dark:text-[#a1a1aa]">AutoCAD, LibreCAD, and most CAM software can import DXF files. Always check scaling, cutter kerf compensation, path closure, and tool directions before manufacturing. The converter sets millimetre units based on the width you specify; raster images do not contain physical scale.</p>
          </section>

          <section className="rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-6 shadow-xs">
            <h2 className="text-xl font-bold text-[#18181b] dark:text-white mb-3">Limitations</h2>
            <div className="space-y-3 text-sm text-[#5b5b63] dark:text-[#a1a1aa]">
              <p>This is a silhouette and outline tracer, not AI raster-to-vector reconstruction or technical drawing OCR. Thin lines trace as double-edged contours. Images are sampled at up to 640 pixels for smooth browser performance. For mission-critical engineering blueprints, draw or measure directly in CAD.</p>
              <p>For more tips and worked examples, read our <Link href="/guides/how-to-convert-jpg-to-dxf" className="font-semibold text-[#e5322d] hover:underline dark:text-[#ff6b68]">complete guide to converting JPG to DXF</Link>.</p>
            </div>
          </section>

          <section className="rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-6 shadow-xs">
            <h2 className="text-xl font-bold text-[#18181b] dark:text-white mb-4">Frequently asked questions</h2>
            <div className="space-y-4">
              {faqs.map(([q,a])=>(
                <div key={q} className="border-b border-[#e4e4e8] dark:border-[#27272a] pb-3 last:border-b-0 last:pb-0">
                  <h3 className="text-base font-semibold text-[#18181b] dark:text-white">{q}</h3>
                  <p className="mt-1 text-sm text-[#5b5b63] dark:text-[#a1a1aa]">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-6 shadow-xs">
            <h2 className="text-xl font-bold text-[#18181b] dark:text-white mb-3">Related tools and guides</h2>
            <div className="grid gap-3 sm:grid-cols-2 mt-4">
              <Link className="rounded-lg border border-[#e4e4e8] dark:border-[#27272a] p-3.5 font-medium text-sm text-[#18181b] dark:text-white hover:border-[#e5322d]/40 hover:text-[#e5322d] transition-all flex items-center justify-between" href="/tools">
                <span>Explore all image tools</span>
                <span>→</span>
              </Link>
              <Link className="rounded-lg border border-[#e4e4e8] dark:border-[#27272a] p-3.5 font-medium text-sm text-[#18181b] dark:text-white hover:border-[#e5322d]/40 hover:text-[#e5322d] transition-all flex items-center justify-between" href="/guides/how-to-convert-jpg-to-dxf">
                <span>JPG to DXF step-by-step guide</span>
                <span>→</span>
              </Link>
            </div>
          </section>
        </article>

        <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'WebApplication',name:'JPG to DXF Converter',applicationCategory:'DesignApplication',operatingSystem:'Any',url,isAccessibleForFree:true,offers:{'@type':'Offer',price:'0',priceCurrency:'USD'}})}}/>
      </div>
    </div>
  );
}
