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
  { slug: "merge-pdf", title: "Merge PDF", heading: "Merge PDF Documents Instantly", description: "Combine multiple PDF files into a single organized document seamlessly.", category: "pdf-tools", keywords: ["merge pdf"], heroTitle: "Combine PDF Files with Zero Server Uploads", heroDescription: "An ultra-secure, client-side utility engineered to join multiple PDF assets instantly.", formulaExplanation: "Utilizes local browser byte-stream manipulation.", examples: [], faq: [], icon: "FileText" },
  { slug: "split-pdf", title: "Split PDF", heading: "Split PDF Files by Page", description: "Extract pages or split a large PDF into smaller standalone documents securely.", category: "pdf-tools", keywords: ["split pdf"], heroTitle: "Extract Pages Instantly", heroDescription: "Isolate critical pages natively in your browser tab.", formulaExplanation: "Parses the PDF document catalogs and extracts specified pages.", examples: [], faq: [], icon: "FileText" },
  { slug: "rotate-pdf", title: "Rotate PDF", heading: "Rotate PDF Pages Permanently", description: "Change the orientation of individual or all pages in a PDF file layout securely.", category: "pdf-tools", keywords: ["rotate pdf"], heroTitle: "Rotate PDF Pages with Absolute Privacy", heroDescription: "Fix upside-down or landscape page layouts instantly.", formulaExplanation: "Modifies the /Rotate attribute natively.", examples: [], faq: [], icon: "FileText" },
  { slug: "delete-pdf-pages", title: "Delete PDF Pages", heading: "Remove Pages From PDF File", description: "Select and permanently delete specific pages from a PDF file locally.", category: "pdf-tools", keywords: ["delete pdf pages"], heroTitle: "Delete PDF Pages with Complete Privacy", heroDescription: "Strip out unnecessary pages instantly.", formulaExplanation: "Clones all indices except the targeted items.", examples: [], faq: [], icon: "FileText" },
  { slug: "add-page-numbers", title: "Add Page Numbers", heading: "Add Page Numbers to PDFs", description: "Automatically stamp sequential page numbers onto your PDF documents locally.", category: "pdf-tools", keywords: ["add page numbers"], heroTitle: "Paginate Documents Locally", heroDescription: "Dynamically stamp professional page numbers.", formulaExplanation: "Uses embedded standard fonts to draw exact string coordinates.", examples: [], faq: [], icon: "FileText" },
  { slug: "add-watermark", title: "Add Watermark", heading: "Stamp Watermarks on PDF", description: "Overlay custom text watermarks securely across your document pages.", category: "pdf-tools", keywords: ["add watermark to pdf"], heroTitle: "Watermark Documents with Zero Server Uploads", heroDescription: "Protect sensitive intellectual property by embedding semi-transparent stamps directly in your browser.", formulaExplanation: "Leverages canvas-style drawing mechanics to embed text.", examples: [], faq: [], icon: "FileText" },
  { slug: "jpg-to-pdf", title: "JPG to PDF", heading: "Convert Images to PDF Layouts", description: "Convert JPG, PNG, or WEBP image frames into structured PDF document containers instantly.", category: "pdf-tools", keywords: ["jpg to pdf"], heroTitle: "Convert Images to PDF with Absolute Privacy", heroDescription: "Encapsulate your images inside clean document borders right inside your local machine.", formulaExplanation: "Decodes the raw graphics buffer layout array values.", examples: [], faq: [], icon: "FileText" },
  { slug: "compress-pdf", title: "Compress PDF", heading: "Optimize and Shrink PDF Files", description: "Select custom quality levels to safely downsize and pack PDF binary weights inside the local browser viewport application.", category: "pdf-tools", keywords: ["compress pdf"], heroTitle: "Compress PDF Files with Precision Quality Multipliers", heroDescription: "Fine-tune asset weight reduction profiles locally to meet strict messaging limits without remote server latency.", formulaExplanation: "Leverages internal object stream indexing mechanics.", examples: [], faq: [], icon: "FileText" },
  { slug: "pdf-to-jpg", title: "PDF to JPG", heading: "Convert PDF Pages to Images", description: "Extract every page of a PDF document into standard high-quality JPG images locally.", category: "pdf-tools", keywords: ["pdf to jpg"], heroTitle: "Convert PDF Pages to High-Quality JPG Images", heroDescription: "Rasterize vector document pages into crisp, shareable image grids completely inside your browser thread.", formulaExplanation: "Utilizes Mozilla's PDF.js architecture inside the client layout viewport.", examples: [], faq: [], icon: "FileText" },
  
  // UNLOCK PDF REGISTRY ENTRY
  {
    slug: "unlock-pdf",
    title: "Unlock PDF",
    heading: "Remove PDF Password Security",
    description: "Decrypt and remove password restrictions from your PDF files securely in your browser.",
    category: "pdf-tools",
    keywords: ["unlock pdf", "remove pdf password", "pdf password remover", "decrypt pdf"],
    heroTitle: "Unlock Password-Protected PDF Files Locally",
    heroDescription: "Strip security locks from your owner-authorized documents without uploading passwords to external servers.",
    formulaExplanation: "Parses encrypted PDF cross-reference dictionaries using the user-provided password and serializes an unencrypted binary object stream stream.",
    examples: [{ title: "Bank Statements", description: "Remove recurring password prompts from monthly digital account statements for personal archiving." }],
    faq: [{ question: "Is it safe to type my password here?", answer: "Yes, 100%. Decryption runs entirely inside your browser's local memory space. Neither your file nor your password is ever sent over the internet." }],
    icon: "FileText"
  },

  // PROTECT PDF REGISTRY ENTRY
  {
    slug: "protect-pdf",
    title: "Protect PDF",
    heading: "Encrypt PDF with Password",
    description: "Encrypt and secure your sensitive PDF documents with custom passwords natively.",
    category: "pdf-tools",
    keywords: ["protect pdf", "encrypt pdf", "add password to pdf", "secure pdf file"],
    heroTitle: "Encrypt PDF Files with Client-Side Security",
    heroDescription: "Lock sensitive documents using strong AES encryption directly on your device before sharing.",
    formulaExplanation: "Applies standard PDF encryption dictionaries with user and owner key specifications onto the PDF object graph during binary compilation.",
    examples: [{ title: "Financial Documents", description: "Password-protect tax forms and contract drafts prior to email transmission." }],
    faq: [{ question: "What encryption strength is used?", answer: "Standard 128-bit PDF encryption is applied to lock viewing access behind your designated passphrase." }],
    icon: "FileText"
  }
];
