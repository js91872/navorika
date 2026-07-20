import { Tool } from "@/types/tool";

export const pdfTools: Tool[] = [
  {
    slug: "merge-pdf",
    title: "Merge PDF",
    shortDescription: "Combine multiple PDF files into a single document.",
    description: "Merge multiple PDF files into one document. Free, fast, and easy to use.",
    category: "PDF Tools",
    keywords: ["Merge PDF", "Combine PDF", "PDF Merger", "Join PDF"],
    featured: true,
    badge: "Popular",
    heroTitle: "Free PDF Merger",
    heroDescription: "Combine multiple PDF files into a single document instantly.",
    formula: "",
    faq: [
      { question: "How do I merge PDF files?", answer: "Upload your PDF files, arrange them in the desired order, and click merge." },
      { question: "Is my data secure?", answer: "Yes, all processing happens in your browser." }
    ],
    examples: [],
    relatedTools: ["split-pdf", "compress-pdf", "pdf-to-word"]
  },
  {
    slug: "split-pdf",
    title: "Split PDF",
    shortDescription: "Split a PDF into multiple documents by page ranges.",
    description: "Split a PDF file into multiple documents based on page ranges.",
    category: "PDF Tools",
    keywords: ["Split PDF", "PDF Splitter", "Extract PDF Pages"],
    featured: true,
    badge: "Popular",
    heroTitle: "Free PDF Splitter",
    heroDescription: "Split a PDF file into multiple documents by page ranges.",
    formula: "",
    faq: [
      { question: "How do I split a PDF?", answer: "Upload your PDF, specify page ranges, and click split." },
      { question: "Can I split by page ranges?", answer: "Yes, you can specify custom page ranges like 1-3, 4-6." }
    ],
    examples: [],
    relatedTools: ["merge-pdf", "compress-pdf", "pdf-to-word"]
  },
  {
    slug: "compress-pdf",
    title: "Compress PDF",
    shortDescription: "Reduce PDF file size with smart compression options.",
    description: "Compress PDF files with multiple compression levels: Maximum, High, Medium, and Low.",
    category: "PDF Tools",
    keywords: ["Compress PDF", "PDF Compressor", "Reduce PDF Size", "PDF Optimizer"],
    featured: true,
    badge: "Popular",
    heroTitle: "Free PDF Compressor",
    heroDescription: "Reduce PDF file size with smart compression options.",
    formula: "",
    faq: [
      { question: "What compression levels are available?", answer: "We offer 4 levels: Maximum, High, Medium, and Low." },
      { question: "Which compression level should I choose?", answer: "Medium is recommended for general use." }
    ],
    examples: [],
    relatedTools: ["merge-pdf", "split-pdf", "pdf-to-word"]
  },
  {
    slug: "pdf-to-word",
    title: "PDF to Word",
    shortDescription: "Convert PDF files to editable Word documents.",
    description: "Convert PDF files to editable Word documents for easy editing and formatting.",
    category: "PDF Tools",
    keywords: ["PDF to Word", "PDF Converter", "PDF to DOCX", "Convert PDF"],
    featured: true,
    badge: "Popular",
    heroTitle: "Free PDF to Word Converter",
    heroDescription: "Convert PDF files to editable Word documents instantly.",
    formula: "",
    faq: [
      { question: "Is the conversion accurate?", answer: "We preserve formatting, fonts, and layout as much as possible." },
      { question: "Can I convert scanned PDFs?", answer: "Scanned PDFs require OCR, which is available in our Pro version." }
    ],
    examples: [],
    relatedTools: ["word-to-pdf", "merge-pdf", "compress-pdf"]
  },
  {
    slug: "word-to-pdf",
    title: "Word to PDF",
    shortDescription: "Convert Word documents to PDF files.",
    description: "Convert Word documents (DOC/DOCX) to PDF files with preserved formatting.",
    category: "PDF Tools",
    keywords: ["Word to PDF", "DOCX to PDF", "Convert Word", "Word to PDF Converter"],
    featured: true,
    badge: "Popular",
    heroTitle: "Free Word to PDF Converter",
    heroDescription: "Convert Word documents to PDF files instantly.",
    formula: "",
    faq: [
      { question: "What formats are supported?", answer: "We support .doc and .docx files." },
      { question: "Is formatting preserved?", answer: "Yes, we preserve fonts, images, tables, and layout." }
    ],
    examples: [],
    relatedTools: ["pdf-to-word", "merge-pdf", "compress-pdf"]
  },
  {
    slug: "jpg-to-pdf",
    title: "JPG to PDF",
    shortDescription: "Convert JPG images to PDF files.",
    description: "Convert JPG images to PDF files. Combine multiple images into a single PDF.",
    category: "PDF Tools",
    keywords: ["JPG to PDF", "Image to PDF", "JPEG to PDF", "Photo to PDF"],
    featured: true,
    badge: "Popular",
    heroTitle: "Free JPG to PDF Converter",
    heroDescription: "Convert JPG images to PDF files instantly.",
    formula: "",
    faq: [
      { question: "What image formats are supported?", answer: "We support JPG, PNG, GIF, BMP, and WEBP." },
      { question: "Can I combine multiple images?", answer: "Yes, you can upload multiple images to create a single PDF." }
    ],
    examples: [],
    relatedTools: ["pdf-to-word", "merge-pdf", "compress-pdf"]
  },
  {
    slug: "pdf-to-jpg",
    title: "PDF to JPG",
    shortDescription: "Convert PDF pages to JPG images.",
    description: "Convert PDF pages to high-quality JPG images. Each page becomes a separate image.",
    category: "PDF Tools",
    keywords: ["PDF to JPG", "PDF to Image", "Convert PDF to JPG", "PDF to JPEG"],
    featured: true,
    badge: "Popular",
    heroTitle: "Free PDF to JPG Converter",
    heroDescription: "Convert PDF pages to JPG images instantly.",
    formula: "",
    faq: [
      { question: "How are pages converted?", answer: "Each page of your PDF becomes a separate JPG image." },
      { question: "What quality are the images?", answer: "Images are generated at high quality for clarity." }
    ],
    examples: [],
    relatedTools: ["jpg-to-pdf", "pdf-to-word", "merge-pdf"]
  }
];
