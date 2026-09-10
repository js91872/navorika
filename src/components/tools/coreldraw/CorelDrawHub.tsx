import Link from 'next/link';
import { ArrowRight, BookOpen, ShieldCheck, CheckCircle2, AlertTriangle, Layers, FileCode } from 'lucide-react';
import { tools } from '@/data/registry';
import { getToolIcon } from '@/lib/toolIcons';

const sections = [
  {
    title: 'Convert to CorelDRAW',
    description: 'Prepare genuine PDF, SVG, or EPS interchange files that CorelDRAW can import without broken hacks or fake CDR downloads.',
    slugs: [
      'pdf-to-cdr-converter',
      'word-to-cdr-converter',
      'png-to-cdr-converter',
      'jpg-to-cdr-converter',
      'svg-to-cdr-converter',
      'ai-to-cdr-converter',
      'eps-to-cdr-converter',
    ],
  },
  {
    title: 'Convert from CorelDRAW',
    description: 'Read supported CDR files through capability-detected server filters and export genuine open vector, document, or raster formats.',
    slugs: [
      'cdr-to-pdf-converter',
      'cdr-to-svg-converter',
      'cdr-to-png-converter',
      'cdr-to-jpg-converter',
      'cdr-to-eps-converter',
    ],
  },
  {
    title: 'CDR Utilities & Preflight',
    description: 'Inspect containers, preview artwork, verify versions, and preflight print readiness before production handoff.',
    slugs: [
      'cdr-viewer',
      'cdr-version-converter',
      'cdr-print-readiness-checker',
    ],
  },
];

const educationalGuides = [
  {
    title: 'What is a CDR file?',
    content:
      'A CDR file is the proprietary master project format created by CorelDRAW, a vector graphics editor developed by Corel Corporation (Alludo). Unlike open formats such as SVG, CDR is a complex container that stores bezier vector paths, text objects, paragraph frames, layers, transparency lenses, spot color palettes, color management profiles, and multi-page layouts. Across history, CDR files transitioned from legacy RIFF binary chunk architectures (CorelDRAW 3 through X3/X4) to modern PK-ZIP compressed XML archives (CorelDRAW X4 through 2024).',
  },
  {
    title: 'How to open a CDR file',
    content:
      'The most accurate way to open and edit a CDR file is using native CorelDRAW software on Windows or macOS. For users without a CorelDRAW license, open-source graphic suites like Inkscape and LibreOffice Draw incorporate the libcdr reverse-engineering library, which can open and render many CDR files. However, proprietary CorelDRAW effects (such as contour blends, perspective meshes, and specialized drop shadows) may be converted to basic paths or omitted when opened in non-native tools.',
  },
  {
    title: 'How to view CDR without CorelDRAW',
    content:
      'To view a CDR file without installing CorelDRAW, use our capability-verified CDR Viewer or CDR to PDF Converter. These tools pass supported files through an isolated, sandboxed LibreOffice/libcdr rendering pipeline to generate high-fidelity PDF, SVG, or PNG previews. For rapid local inspection without uploading your file, use the CDR Version Checker to inspect the container header directly inside your browser.',
  },
  {
    title: 'How to convert CDR to PDF, SVG, PNG, JPG, or EPS',
    content:
      'Converting from CorelDRAW requires matching the output format to your end use. Choose PDF when you need to preserve multiple pages, vector scalability, and printable typography. Choose SVG for web graphics, laser cutting, and plotters that require pure first-page vector paths. Choose PNG with 72 to 600 DPI for crisp raster presentations and proofing. Choose JPG for lightweight, opaque web images. Choose EPS when sending single-page vector graphics to legacy print RIP systems.',
  },
  {
    title: 'How to prepare PDF, JPG, PNG, SVG, EPS, AI, and Word files for CorelDRAW',
    content:
      'When moving artwork into CorelDRAW, the cleanest workflow is to provide an interchange format that CorelDRAW imports natively. PDF is the premier choice for multi-page documents, vector illustrations, and Word exports. SVG provides clean, resolution-independent vector paths for logos and icons. High-resolution PNG and JPG images can be embedded directly or vectorized into SVG paths using our client-side tracer. Once imported via File → Import in CorelDRAW, verify all typography and layers, then save natively as CDR.',
  },
  {
    title: 'CDR compatibility and versions',
    content:
      'CorelDRAW files are notoriously version-dependent: an older version of CorelDRAW cannot natively open a CDR saved by a newer release. Legacy files (v3 through X3) rely on RIFF container headers (FourCC codes CDR3 to CDRF), whereas modern versions (X4 through 2024) use ZIP packages enclosing root.dat and XML definitions. There is no valid binary trick to downgrade a newer CDR without native CorelDRAW. When collaborating across versions, always request that the author use File → Save As and pick your target CorelDRAW version, or supply an interchange PDF.',
  },
  {
    title: 'Raster vs vector when working with CorelDRAW',
    content:
      'Vector graphics represent artwork as mathematical paths (points, lines, curves, and coordinates) that scale infinitely without pixelation—essential for signs, logos, vinyl cutting, and CNC machining. Raster images (PNG, JPG) are fixed pixel grids that lose sharpness when enlarged. When converting bitmaps for CorelDRAW, decide whether your artwork needs raster preservation (ideal for photographs and textures) or vector tracing (best for high-contrast logos, stamps, and line art).',
  },
  {
    title: 'Best interchange formats for CorelDRAW',
    content:
      'The industry standard interchange format for CorelDRAW is ISO 32000 PDF. PDF accurately preserves vector geometry, embedded fonts, CMYK/spot colors, and multi-page structures. For single-canvas vector icons and cutting jobs, W3C SVG 2 is optimal. For legacy prepress setups, Encapsulated PostScript (EPS) offers rock-solid PostScript compatibility. Avoiding obscure file formats ensures seamless collaboration between CorelDRAW, Adobe Illustrator, Affinity Designer, and commercial printers.',
  },
  {
    title: 'Why Navorika does not create fake .cdr files',
    content:
      'Many low-quality online converters simply rename an exported PDF or SVG to have a .cdr file extension. This deceptive practice produces invalid, corrupted files that crash CorelDRAW upon import. Because no verified open-source native CDR writing engine exists, Navorika maintains strict technical honesty: our converters produce genuine, validated PDF, SVG, and EPS interchange files specifically optimized for CorelDRAW import. Once imported, you can use CorelDRAW’s native File → Save As to write an authentic, uncorrupted CDR master file.',
  },
];

export default function CorelDrawHub() {
  return (
    <div className="mx-auto max-w-6xl space-y-16">
      {/* Honesty Banner */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 leading-7 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 size-6 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          <div>
            <h2 className="text-base font-bold">Technically honest vector and document interchange</h2>
            <p className="mt-1 text-sm leading-6">
              Navorika never renames foreign files to <code className="rounded bg-amber-200/60 px-1 py-0.5 text-xs font-semibold dark:bg-amber-900/60">.cdr</code> or pretends to generate proprietary native CorelDRAW binaries without a verified engine.
              Our converters prepare genuine, standards-compliant PDF, SVG, and EPS files configured specifically for CorelDRAW import.
              Open the downloaded file in CorelDRAW, verify your fonts and layout, and use <span className="font-semibold">File → Save As → CDR</span> to create your final native project master.
            </p>
          </div>
        </div>
      </div>

      {/* Tool Sections Directory */}
      <div className="space-y-12">
        {sections.map((section) => (
          <section key={section.title} aria-labelledby={`section-${section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
              <h2 id={`section-${section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="text-2xl font-black text-[var(--foreground)]">
                {section.title}
              </h2>
              <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 sm:mt-0">
                {section.slugs.length} tools available
              </span>
            </div>
            <p className="mt-2 max-w-3xl leading-7 text-[var(--muted-foreground)]">{section.description}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.slugs.flatMap((slug) => {
                const tool = tools.find((item) => item.slug === slug);
                return tool ? [
                  <Link
                    key={slug}
                    href={`/tools/${slug}`}
                    className="group flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-lg"
                  >
                    <div className="flex gap-3">
                      <span className="text-2xl" aria-hidden="true">
                        {getToolIcon(slug)}
                      </span>
                      <div>
                        <h3 className="font-bold text-[var(--foreground)] group-hover:text-indigo-600">
                          {tool.title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      Open tool <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>,
                ] : [];
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Comprehensive Educational Guide Section */}
      <section className="border-t border-[var(--border)] pt-12" aria-labelledby="coreldraw-knowledge-base-heading">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <BookOpen className="size-5" />
          </span>
          <div>
            <h2 id="coreldraw-knowledge-base-heading" className="text-2xl font-black text-[var(--foreground)]">
              CorelDRAW & CDR Technical Knowledge Base
            </h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              Authoritative engineering reference on file architectures, version compatibility, vector conversions, and prepress standards.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {educationalGuides.map((guide, idx) => (
            <div
              key={guide.title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition hover:border-indigo-500/30"
            >
              <div className="flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-full bg-indigo-500/10 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {idx + 1}
                </span>
                <h3 className="font-bold text-[var(--foreground)]">{guide.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                {guide.content}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Guides & Workflows Bar */}
      <section className="rounded-2xl border border-indigo-500/20 bg-indigo-50/40 p-6 dark:bg-indigo-950/20">
        <h3 className="text-lg font-bold text-[var(--foreground)]">Deep-Dive CorelDRAW Guides</h3>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Explore our complete series of practical tutorials covering font preservation, prepress readiness, and open-source file viewing.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/guides/open-cdr-without-coreldraw" className="rounded-lg border border-indigo-200 bg-[var(--card)] px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:border-indigo-400 dark:border-indigo-800 dark:text-indigo-300">
            Open CDR Without CorelDRAW →
          </Link>
          <Link href="/guides/newer-cdr-older-coreldraw" className="rounded-lg border border-indigo-200 bg-[var(--card)] px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:border-indigo-400 dark:border-indigo-800 dark:text-indigo-300">
            Open Newer CDR in Older Versions →
          </Link>
          <Link href="/guides/pdf-to-cdr-editing-guide" className="rounded-lg border border-indigo-200 bg-[var(--card)] px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:border-indigo-400 dark:border-indigo-800 dark:text-indigo-300">
            Convert PDF to CDR for Editing →
          </Link>
          <Link href="/guides/word-to-cdr-formatting-guide" className="rounded-lg border border-indigo-200 bg-[var(--card)] px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:border-indigo-400 dark:border-indigo-800 dark:text-indigo-300">
            Word to CDR Without Formatting Loss →
          </Link>
          <Link href="/guides/preserve-fonts-coreldraw-conversion" className="rounded-lg border border-indigo-200 bg-[var(--card)] px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:border-indigo-400 dark:border-indigo-800 dark:text-indigo-300">
            Preserve Fonts in CorelDRAW →
          </Link>
          <Link href="/guides/raster-image-to-cdr-guide" className="rounded-lg border border-indigo-200 bg-[var(--card)] px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:border-indigo-400 dark:border-indigo-800 dark:text-indigo-300">
            Convert PNG or JPG to CDR →
          </Link>
          <Link href="/guides/svg-vs-cdr-guide" className="rounded-lg border border-indigo-200 bg-[var(--card)] px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:border-indigo-400 dark:border-indigo-800 dark:text-indigo-300">
            SVG vs CDR Vector Comparison →
          </Link>
          <Link href="/guides/best-coreldraw-print-format" className="rounded-lg border border-indigo-200 bg-[var(--card)] px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:border-indigo-400 dark:border-indigo-800 dark:text-indigo-300">
            Best Print Formats for CorelDRAW →
          </Link>
        </div>
      </section>
    </div>
  );
}
