import type { ToolPageContent } from '@/lib/seo/toolPage';

export const cadToolPages: Record<string, ToolPageContent> = {
  'step-to-3d-pdf-converter': {
    slug: 'step-to-3d-pdf-converter',
    name: 'STEP to 3D PDF Converter – Free Online CAD Converter',
    category: 'Developer Tools',
    applicationCategory: 'DesignApplication',
    description:
      'Convert 3D STEP and STP CAD files into PDF documents with embedded interactive 3D PRC content. Free online tool powered by Open CASCADE and Asymptote.',
    longTailKeywords: [
      'step to 3d pdf',
      'step file to 3d pdf',
      'stp to 3d pdf',
      'convert step to 3d pdf online',
      'step to interactive pdf',
      'step 3d pdf converter',
      'convert stp file to 3d pdf free',
    ],
    intro: [
      'Transform 3D engineering models from standardized STEP and STP formats into shareable PDF documents containing embedded interactive 3D geometry.',
      'Unlike static 2D screenshots or raster prints, a 3D PDF allows recipients to orbit, pan, zoom, and inspect mechanical assemblies without requiring specialized CAD software or proprietary licenses.',
      'Your uploaded CAD models are processed securely in an isolated temporary workspace and deleted automatically when conversion completes.',
    ],
    formula: [
      {
        title: 'Open CASCADE B-Rep Import',
        body: 'The native converter parses the ISO 10303-21 text stream using Open CASCADE Technology (OCCT 7.6), extracting solids, topological faces, edges, and transformation locations.',
      },
      {
        title: 'Deflection-Based Incremental Tessellation',
        body: 'Exact boundary representation (B-Rep) surfaces are discretized into a high-density triangle mesh using controlled linear and angular deflection parameters.',
      },
      {
        title: 'Asymptote PRC 3D Embedding',
        body: 'The tessellated mesh is compiled into a Product Representation Compact (PRC) 3D stream and embedded into a PDF 1.4 container with 3D and RichMedia annotations.',
      },
    ],
    steps: [
      'Select or drop a 3D CAD model with a .step or .stp file extension (up to 25 MB).',
      'The server validates the ISO 10303-21 header and transfers root entities in an isolated sandbox.',
      'Open CASCADE tessellates the B-Rep topology into triangle geometry and computes the model center and bounding diagonal.',
      'Asymptote compiles the geometry into an interactive 3D PRC object with dynamic camera perspective.',
      'Download your genuine 3D PDF and open it in Adobe Acrobat Reader desktop for full interactive inspection.',
    ],
    interpretation: [
      'The output document is a standard PDF containing genuine /Subtype/3D and RichMedia annotation streams.',
      'For full interactive 3D viewing (orbit, pan, zoom, model lighting), open the PDF in Adobe Acrobat Reader desktop or another compatible 3D PDF viewer.',
      'Web browser PDF viewers (such as Google Chrome, Mozilla Firefox, Microsoft Edge, and Apple Safari) use standard 2D rendering engines that do not execute Adobe PRC JavaScript engines, and will display a preview or static frame.',
    ],
    limitations: [
      'Tessellation Conversion: V1 converts exact mathematical CAD B-Rep surfaces into triangle polygon meshes; original parametric feature trees are not editable in the PDF.',
      'Metadata Scope: Product and Manufacturing Information (PMI), Geometric Dimensioning and Tolerancing (GD&T), and custom material shaders are omitted in V1.',
      'Viewer Environment: Interactive 3D manipulation requires a PDF viewer with PRC support, notably Adobe Acrobat Reader desktop on Windows or macOS.',
      'File Size: Uploads are bounded at 25 MB to maintain responsive server processing.',
    ],
    faqs: [
      {
        question: 'What is the difference between STEP and STP files?',
        answer:
          'STEP and STP are identical formats representing ISO 10303-21 Product Data Representation and Exchange. ".step" is standard on Unix/Linux while ".stp" arose from legacy 3-letter Windows file extension conventions.',
      },
      {
        question: 'Why does the 3D model not rotate inside my web browser?',
        answer:
          'Built-in browser PDF viewers (such as PDF.js in Firefox or Chromium PDF in Chrome and Edge) only render standard 2D vector and raster PDF elements. To interact with 3D PRC models, download the PDF and open it in Adobe Acrobat Reader desktop.',
      },
      {
        question: 'Does Navorika store my uploaded CAD drawings?',
        answer:
          'No. All conversions take place in isolated temporary directories created with mkdtemp. The uploaded STEP file and generated artifacts are deleted immediately after the conversion job concludes.',
      },
      {
        question: 'Can I convert multi-solid STEP assemblies?',
        answer:
          'Yes. The Open CASCADE transfer reader traverses all topological solids and meshed faces present in the STEP root structure, merging the tessellated triangles into the 3D scene.',
      },
      {
        question: 'Is any software installation required?',
        answer:
          'No installation is required to generate the 3D PDF. However, recipients will need Adobe Acrobat Reader desktop (free) to rotate and inspect the 3D model interactively.',
      },
    ],
    relatedTools: [
      { slug: 'pdf-to-cdr-converter', name: 'PDF to CDR Converter' },
      { slug: 'compress-pdf', name: 'Compress PDF' },
      { slug: 'merge-pdf', name: 'Merge PDF' },
    ],
    relatedGuides: [],
  },
};
