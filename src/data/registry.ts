import { ToolMeta, CategoryMeta } from "@/types";

export const categories: CategoryMeta[] = [
  { slug: "pdf-tools", name: "PDF Tools", description: "Secure, client-side document optimization.", icon: "FileText", color: "from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400" },
  { slug: "image-tools", name: "Image Tools", description: "Universal Image Format Converter", icon: "Image", color: "from-purple-600 to-fuchsia-600 dark:from-purple-400 dark:to-fuchsia-400" },
  { slug: "finance-calculators", name: "Finance Calculators", description: "High-precision investment and tax tools.", icon: "Calculator", color: "from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400" },
  { slug: "health-calculators", name: "Health Calculators", description: "Privacy-first fitness and BMI trackers.", icon: "HeartPulse", color: "from-rose-500 to-pink-500 dark:from-rose-400 dark:to-pink-400" },
  { slug: "developer-tools", name: "Developer Tools", description: "JSON formatters and code validators offline.", icon: "Code", color: "from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400" },
  { slug: "construction-calculators", name: "Construction Calculators", description: "Civil material estimators and layout math.", icon: "Hammer", color: "from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400" }
];

export const tools: ToolMeta[] = [
  // ==========================================
  // THE COMPLETE PDF TOOLS SUITE
  // ==========================================
  { slug: "merge-pdf", title: "Merge PDF", heading: "Merge PDF Documents Instantly", description: "Combine multiple PDF files into a single organized document seamlessly.", category: "pdf-tools", keywords: ["merge pdf"], heroTitle: "Combine PDF Files with Zero Server Uploads", heroDescription: "An ultra-secure, client-side utility engineered to join multiple PDF assets instantly.", formulaExplanation: "Utilizes local browser byte-stream manipulation.", examples: [], faq: [], icon: "FileText" },
  { slug: "split-pdf", title: "Split PDF", heading: "Split PDF Files by Page", description: "Extract pages or split a large PDF into smaller standalone documents securely.", category: "pdf-tools", keywords: ["split pdf"], heroTitle: "Extract Pages Instantly", heroDescription: "Isolate critical pages natively in your browser tab.", formulaExplanation: "Parses the PDF document catalogs and extracts specified pages.", examples: [], faq: [], icon: "FileText" },
  { slug: "rotate-pdf", title: "Rotate PDF", heading: "Rotate PDF Pages Permanently", description: "Change the orientation of individual or all pages in a PDF file layout securely.", category: "pdf-tools", keywords: ["rotate pdf"], heroTitle: "Rotate PDF Pages with Absolute Privacy", heroDescription: "Fix upside-down or landscape page layouts instantly.", formulaExplanation: "Modifies the /Rotate attribute natively.", examples: [], faq: [], icon: "FileText" },
  { slug: "delete-pdf-pages", title: "Delete PDF Pages", heading: "Remove Pages From PDF File", description: "Select and permanently delete specific pages from a PDF file locally.", category: "pdf-tools", keywords: ["delete pdf pages"], heroTitle: "Delete PDF Pages with Complete Privacy", heroDescription: "Strip out unnecessary pages instantly.", formulaExplanation: "Clones all indices except the targeted items.", examples: [], faq: [], icon: "FileText" },
  { slug: "add-page-numbers", title: "Add Page Numbers", heading: "Add Page Numbers to PDFs", description: "Automatically stamp sequential page numbers onto your PDF documents locally.", category: "pdf-tools", keywords: ["add page numbers"], heroTitle: "Paginate Documents Locally", heroDescription: "Dynamically stamp professional page numbers.", formulaExplanation: "Uses embedded standard fonts to draw exact string coordinates.", examples: [], faq: [], icon: "FileText" },
  { slug: "add-watermark", title: "Add Watermark", heading: "Stamp Watermarks on PDF", description: "Overlay custom text watermarks securely across your document pages.", category: "pdf-tools", keywords: ["add watermark to pdf"], heroTitle: "Watermark Documents with Zero Server Uploads", heroDescription: "Protect sensitive intellectual property by embedding semi-transparent stamps directly in your browser.", formulaExplanation: "Leverages canvas-style drawing mechanics to embed text.", examples: [], faq: [], icon: "FileText" },
  { slug: "jpg-to-pdf", title: "JPG to PDF", heading: "Convert Images to PDF Layouts", description: "Convert JPG, PNG, or WEBP image frames into structured PDF document containers instantly.", category: "pdf-tools", keywords: ["jpg to pdf"], heroTitle: "Convert Images to PDF with Absolute Privacy", heroDescription: "Encapsulate your images inside clean document borders right inside your local machine.", formulaExplanation: "Decodes the raw graphics buffer layout array values.", examples: [], faq: [], icon: "FileText" },
  { slug: "compress-pdf", title: "Compress PDF", heading: "Optimize and Shrink PDF Files", description: "Select custom quality levels to safely downsize and pack PDF binary weights inside the local browser viewport application.", category: "pdf-tools", keywords: ["compress pdf"], heroTitle: "Compress PDF Files with Precision Quality Multipliers", heroDescription: "Fine-tune asset weight reduction profiles locally to meet strict messaging limits without remote server latency.", formulaExplanation: "Leverages internal object stream indexing mechanics.", examples: [], faq: [], icon: "FileText" },
  { slug: "pdf-to-jpg", title: "PDF to JPG", heading: "Convert PDF Pages to Images", description: "Extract every page of a PDF document into standard high-quality JPG images locally.", category: "pdf-tools", keywords: ["pdf to jpg"], heroTitle: "Convert PDF Pages to High-Quality JPG Images", heroDescription: "Rasterize vector document pages into crisp, shareable image grids completely inside your browser thread.", formulaExplanation: "Utilizes Mozilla's PDF.js architecture inside the client layout viewport.", examples: [], faq: [], icon: "FileText" },
  { slug: "unlock-pdf", title: "Unlock PDF", heading: "Remove PDF Password Security", description: "Decrypt and remove password restrictions from your PDF files securely in your browser.", category: "pdf-tools", keywords: ["unlock pdf"], heroTitle: "Unlock Password-Protected PDF Files Locally", heroDescription: "Strip security locks from your authorized documents.", formulaExplanation: "Parses cross-reference tables.", examples: [], faq: [], icon: "FileText" },
  { slug: "protect-pdf", title: "Protect PDF", heading: "Encrypt PDF with Password", description: "Encrypt and secure your sensitive PDF documents with custom passwords natively.", category: "pdf-tools", keywords: ["protect pdf"], heroTitle: "Encrypt PDF Files with Client-Side Security", heroDescription: "Lock sensitive documents using strong encryption directly on your device before sharing.", formulaExplanation: "Applies security object specifications onto the byte compilation graph.", examples: [], faq: [], icon: "FileText" },
  { slug: "reorder-pdf", title: "Reorder PDF Pages", heading: "Reorder PDF Pages Visually", description: "Drag and drop document pages to instantly change their structural sequence locally.", category: "pdf-tools", keywords: ["reorder pdf"], heroTitle: "Rearrange PDF Pages with Absolute Privacy", heroDescription: "Visually reorder your document layout structure directly in your browser without uploading files.", formulaExplanation: "Utilizes native HTML5 drag-and-drop state mapping.", examples: [], faq: [], icon: "FileText" },
  { slug: "extract-pdf-pages", title: "Extract PDF Pages", heading: "Extract Specific PDF Pages", description: "Visually select the exact pages you want to pull out of a document to create a new file.", category: "pdf-tools", keywords: ["extract pdf"], heroTitle: "Extract Exact PDF Pages Locally", heroDescription: "Build a new pristine document by cherry-picking essential layouts.", formulaExplanation: "Clones the selected array indexes from the origin source.", examples: [], faq: [], icon: "FileText" },
  { slug: "interleave-pdf", title: "Interleave PDFs", heading: "Merge & Interleave PDF Files", description: "Dynamically alternate pages between two separate PDF documents automatically.", category: "pdf-tools", keywords: ["interleave pdf"], heroTitle: "Interleave Scanned Document Pages Instantly", heroDescription: "Perfect for rebuilding documents where odd and even pages were run through the scanner separately.", formulaExplanation: "Iterates through the structural limits of two origin files simultaneously.", examples: [], faq: [], icon: "FileText" },
  { slug: "sign-pdf", title: "Sign PDF", heading: "Digitally Sign PDF Documents", description: "Draw your electronic signature and stamp it securely onto any page layout locally.", category: "pdf-tools", keywords: ["sign pdf"], heroTitle: "Sign Documents with Zero Server Uploads", heroDescription: "Draw your signature directly in the browser.", formulaExplanation: "Captures HTML5 Canvas vector strokes.", examples: [], faq: [], icon: "FileText" },
  { slug: "add-image-to-pdf", title: "Add Image to PDF", heading: "Insert Images into PDF", description: "Upload and embed custom PNG or JPG images onto any PDF page coordinate.", category: "pdf-tools", keywords: ["add image to pdf"], heroTitle: "Embed Graphics into PDFs Natively", heroDescription: "Stamp corporate logos, photos, or diagrams over your PDF files securely.", formulaExplanation: "Parses local graphics files into byte streams.", examples: [], faq: [], icon: "FileText" },
  { slug: "pdf-metadata-editor", title: "Edit PDF Metadata", heading: "Modify PDF Header Dictionaries", description: "Read, edit, and overwrite the hidden metadata tags of your PDF documents locally.", category: "pdf-tools", keywords: ["edit pdf metadata"], heroTitle: "Edit PDF Metadata with Total Privacy", heroDescription: "Modify document properties like Title, Author, Subject, and Keywords natively in your browser.", formulaExplanation: "Parses the document information dictionary.", examples: [], faq: [], icon: "FileText" },
  { slug: "flatten-pdf", title: "Flatten PDF Forms", heading: "Lock Fillable PDF Forms", description: "Convert interactive form fields and checkboxes into un-editable flat graphics.", category: "pdf-tools", keywords: ["flatten pdf"], heroTitle: "Flatten PDF Forms Instantly", heroDescription: "Lock your interactive forms.", formulaExplanation: "Iterates through all AcroForm fields.", examples: [], faq: [], icon: "FileText" },
  { slug: "crop-pdf", title: "Crop PDF Margins", heading: "Adjust PDF Bounding Boxes", description: "Trim white margins and adjust the structural dimensions of your PDF pages.", category: "pdf-tools", keywords: ["crop pdf"], heroTitle: "Crop PDF Pages Locally", heroDescription: "Adjust the visual bounding boxes of your document.", formulaExplanation: "Modifies the /CropBox and /MediaBox array coordinates.", examples: [], faq: [], icon: "FileText" },
  { slug: "extract-pdf-text", title: "Pristine Text Extractor", heading: "Extract Raw Text from PDF", description: "Read embedded font stream arrays and export raw textual layouts directly into a downloadable .txt file.", category: "pdf-tools", keywords: ["extract text from pdf"], heroTitle: "Extract Pristine Text Layouts Locally", heroDescription: "Strip raw unformatted text out of complex document structures.", formulaExplanation: "Parses the internal textContent arrays via Mozilla PDF.js.", examples: [], faq: [], icon: "FileText" },
  { slug: "bioluminescent-reader", title: "Bioluminescent Reader", heading: "High-Contrast PDF Dark Mode", description: "Read documents in a zero-eye-strain environment using hardware-accelerated color matrix inversion.", category: "pdf-tools", keywords: ["pdf dark mode"], heroTitle: "Bioluminescent Dark Mode Reader", heroDescription: "An immersive, completely private local reading environment.", formulaExplanation: "Rasterizes document layers onto an HTML5 canvas and applies a WebGL-accelerated CSS filter matrix.", examples: [], faq: [], icon: "FileText" },

  // ==========================================
  // UNIFIED OMNI IMAGE CONVERTER DOCK
  // ==========================================
  {
    slug: "image-converter",
    title: "Omni Image Converter Engine",
    heading: "Universal Matrix Image Converter",
    description: "Convert seamlessly between JPG, PNG, WEBP, HEIC, SVG, and PDF configurations via a multi-directional options layout.",
    category: "image-tools",
    keywords: ["image converter", "jpg to png", "png to webp", "webp to pdf", "heic to jpg", "svg to png", "png to svg"],
    heroTitle: "Universal Multi-Directional Image Converter",
    heroDescription: "Transform formats natively in your browser thread with absolute grid privacy.",
    formulaExplanation: "Leverages internal canvas bit layouts, FileReader byte allocations, and rendering matrices completely client-side.",
    examples: [], faq: [], icon: "Image"
  },

  // ==========================================
  // HIGH-PRECISION FINANCE CALCULATORS SUITE
  // ==========================================
  {
    slug: "sip-calculator",
    title: "High-Precision SIP Calculator",
    heading: "Calculate Mutual Fund SIP Returns",
    description: "Estimate the future valuation performance of your systematic investment plans with accurate compound breakdowns.",
    category: "finance-calculators",
    keywords: ["sip calculator", "mutual fund returns estimator", "investment compound interest"],
    heroTitle: "Systematic Investment Plan (SIP) Valuation Engine",
    heroDescription: "Forecast compound portfolio capital gains securely inside your device memory sandboxes.",
    formulaExplanation: "Computes projected assets using the math equation: M = P * [((1 + i)^n - 1) / i] * (1 + i)",
    examples: [], faq: [], icon: "Calculator"
  },

  // ==========================================
  // DEVELOPER TOOLS SUITE
  // ==========================================
  { slug: "base64-encoder", title: "Base64 Encoder / Decoder", heading: "Process Base64 Strings", description: "Encode raw text into Base64 format or decode binary strings instantly.", category: "developer-tools", keywords: ["base64 encoder"], heroTitle: "Base64 Text Conversion Engine", heroDescription: "Natively decode or encode code blocks with 100% offline security.", formulaExplanation: "Utilizes the browser's native btoa() and atob() encoding mechanisms.", examples: [], faq: [], icon: "Code" }
];
