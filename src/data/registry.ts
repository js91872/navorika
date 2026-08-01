import { ToolMeta, CategoryMeta } from "@/types";

export const categories: CategoryMeta[] = [
  { slug: "pdf-tools", name: "PDF Tools", description: "Secure, client-side document optimization.", icon: "FileText", color: "from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400" },
  { slug: "image-tools", name: "Image Tools", description: "Browser-based image compression and conversion.", icon: "ImageIcon", color: "from-purple-600 to-fuchsia-600 dark:from-purple-400 dark:to-fuchsia-400" },
  { slug: "finance-calculators", name: "Finance Calculators", description: "High-precision investment and tax tools.", icon: "Calculator", color: "from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400" },
  { slug: "health-calculators", name: "Health Calculators", description: "Privacy-first fitness and BMI trackers.", icon: "HeartPulse", color: "from-rose-500 to-pink-500 dark:from-rose-400 dark:to-pink-400" },
  { slug: "developer-tools", name: "Developer Tools", description: "JSON formatters and code validators offline.", icon: "Code", color: "from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400" },
  { slug: "construction-calculators", name: "Construction Calculators", description: "Civil material estimators and layout math.", icon: "Hammer", color: "from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400" }
];

export const tools: ToolMeta[] = [
  { slug: "merge-pdf", title: "Merge PDF", heading: "Merge PDF Documents Instantly", description: "Combine multiple PDF files into a single organized document seamlessly.", category: "pdf-tools", keywords: ["merge pdf", "combine pdf files"], heroTitle: "Combine PDF Files with Zero Server Uploads", heroDescription: "An ultra-secure, client-side utility engineered to join multiple PDF assets instantly.", formulaExplanation: "Utilizes local browser byte-stream manipulation.", examples: [], faq: [], icon: "FileText" },
  { slug: "split-pdf", title: "Split PDF", heading: "Split PDF Files by Page", description: "Extract pages or split a large PDF into smaller standalone documents securely.", category: "pdf-tools", keywords: ["split pdf"], heroTitle: "Extract Pages Instantly", heroDescription: "Isolate critical pages natively in your browser tab.", formulaExplanation: "Parses the PDF document catalogs and extracts specified pages.", examples: [], faq: [], icon: "FileText" },
  { slug: "rotate-pdf", title: "Rotate PDF", heading: "Rotate PDF Pages Permanently", description: "Change the orientation of individual or all pages in a PDF file layout securely.", category: "pdf-tools", keywords: ["rotate pdf"], heroTitle: "Rotate PDF Pages with Absolute Privacy", heroDescription: "Fix upside-down or landscape page layouts instantly.", formulaExplanation: "Modifies the /Rotate attribute natively.", examples: [], faq: [], icon: "FileText" },
  { slug: "delete-pdf-pages", title: "Delete PDF Pages", heading: "Remove Pages From PDF File", description: "Select and permanently delete specific pages from a PDF file locally.", category: "pdf-tools", keywords: ["delete pdf pages"], heroTitle: "Delete PDF Pages with Complete Privacy", heroDescription: "Strip out unnecessary pages instantly.", formulaExplanation: "Clones all indices except the targeted items.", examples: [], faq: [], icon: "FileText" },
  { slug: "add-page-numbers", title: "Add Page Numbers", heading: "Add Page Numbers to PDFs", description: "Automatically stamp sequential page numbers onto your PDF documents locally.", category: "pdf-tools", keywords: ["add page numbers"], heroTitle: "Paginate Documents Locally", heroDescription: "Dynamically stamp professional page numbers.", formulaExplanation: "Uses embedded standard fonts to draw exact string coordinates.", examples: [], faq: [], icon: "FileText" },
  { slug: "add-watermark", title: "Add Watermark", heading: "Stamp Watermarks on PDF", description: "Overlay custom text watermarks securely across your document pages.", category: "pdf-tools", keywords: ["add watermark to pdf"], heroTitle: "Watermark Documents with Zero Server Uploads", heroDescription: "Protect sensitive intellectual property by embedding semi-transparent stamps directly in your browser.", formulaExplanation: "Leverages canvas-style drawing mechanics to embed text.", examples: [], faq: [], icon: "FileText" },
  { slug: "jpg-to-pdf", title: "JPG to PDF", heading: "Convert Images to PDF Layouts", description: "Convert JPG, PNG, or WEBP image frames into structured PDF document containers instantly.", category: "pdf-tools", keywords: ["jpg to pdf"], heroTitle: "Convert Images to PDF with Absolute Privacy", heroDescription: "Encapsulate your images inside clean document borders right inside your local machine.", formulaExplanation: "Decodes the raw graphics buffer layout array values.", examples: [], faq: [], icon: "FileText" },
  
  // UPDATED COMPRESS METADATA BLOCK
  {
    slug: "compress-pdf",
    title: "Compress PDF",
    heading: "Optimize and Shrink PDF Files",
    description: "Select custom quality levels to safely downsize and pack PDF binary weights inside the local browser viewport application.",
    category: "pdf-tools",
    keywords: ["compress pdf", "shrink pdf size", "pdf reduction tool", "optimize pdf online free"],
    heroTitle: "Compress PDF Files with Precision Quality Multipliers",
    heroDescription: "Fine-tune asset weight reduction profiles locally to meet strict messaging limits without remote server latency.",
    formulaExplanation: "Leverages internal object stream indexing mechanics (`useObjectStreams`) alongside automated page tree compaction matrices to compress file structures natively.",
    examples: [{ title: "Legal Delivery", description: "Downscale highly pixel-dense document pages into crisp, message-compliant attachment binaries." }],
    faq: [{ question: "What is the difference between the balance profiles?", answer: "Best Quality removes unreferenced structural meta nodes. Optimum scales standard assets cleanly. Low Quality applies maximum array layout packing parameters to hit ultra-small file metrics." }],
    icon: "FileText"
  }
];
