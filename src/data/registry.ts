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
  // ... Keep previous PDF tools intact ...

  // IMAGE CONVERSION MATRIX (SEO OPTIMIZED ROUTES)
  {
    slug: "image-to-pdf",
    title: "Image to PDF Converter",
    heading: "Convert Graphics to PDF Layouts",
    description: "Convert JPG, PNG, WEBP, or SVG images into structured PDF document containers instantly.",
    category: "image-tools",
    keywords: ["image to pdf", "convert photo to pdf", "jpg to pdf converter"],
    heroTitle: "Convert Images to PDF with Absolute Privacy",
    heroDescription: "Encapsulate your images inside clean document borders right inside your local machine thread.",
    formulaExplanation: "Decodes the raw graphics buffer array values and wraps them inside an alternate /XObject PDF format.",
    examples: [], faq: [], icon: "ImageIcon"
  },
  {
    slug: "pdf-to-image",
    title: "PDF to Image Converter",
    heading: "Extract PDF Pages as High-Res Images",
    description: "Rasterize vector document sheets into crisp, shareable high-quality JPG or PNG images locally.",
    category: "image-tools",
    keywords: ["pdf to image", "pdf to jpg converter", "extract pages as png"],
    heroTitle: "Convert PDF Pages into Crisp Images Natively",
    heroDescription: "Transform documents into visual grids completely inside your browser thread without data collection.",
    formulaExplanation: "Leverages Mozilla PDF.js graphics context viewport matrix rasterization.",
    examples: [], faq: [], icon: "ImageIcon"
  },
  {
    slug: "convert-jpg-to-png",
    title: "JPG to PNG Converter",
    heading: "Convert JPG Images to PNG Natively",
    description: "Convert standard JPG files into transparent-ready high-fidelity PNG assets instantly.",
    category: "image-tools",
    keywords: ["jpg to png", "convert jpg to png online", "free image converter"],
    heroTitle: "Convert JPG to High-Fidelity PNG Graphics",
    heroDescription: "Flawless browser-based image format transmutations operating at full processing speeds.",
    formulaExplanation: "Draws source pixels to an uncompressed canvas element and exports via image/png mime-type.",
    examples: [], faq: [], icon: "ImageIcon"
  },
  {
    slug: "convert-png-to-jpg",
    title: "PNG to JPG Converter",
    heading: "Compress PNG Graphics into JPG",
    description: "Convert bulk PNG images into highly compressed, lightweight web-ready JPG files locally.",
    category: "image-tools",
    keywords: ["png to jpg", "convert png to jpg free", "remove image alpha transparency"],
    heroTitle: "Convert PNG to Compressed JPG Photos",
    heroDescription: "Strip alpha transparency layers instantly to minimize file transmission weights.",
    formulaExplanation: "Flattens transparent alpha layers onto a solid background and serializes standard JPEG structures.",
    examples: [], faq: [], icon: "ImageIcon"
  },
  {
    slug: "convert-webp-to-jpg",
    title: "WEBP to JPG Converter",
    heading: "Convert WEBP to Standard JPEG",
    description: "Transform next-gen WEBP graphical sheets into standard universally compatible JPG files.",
    category: "image-tools",
    keywords: ["webp to jpg", "convert webp to jpeg", "offline image tool"],
    heroTitle: "Convert Next-Gen WEBP back to JPG Format",
    heroDescription: "Ensure immediate platform compatibility by returning modern formats to standard configurations.",
    formulaExplanation: "Decodes webp frame segments directly inside the local engine renderer thread loop.",
    examples: [], faq: [], icon: "ImageIcon"
  },
  {
    slug: "convert-jpg-to-webp",
    title: "JPG to WEBP Optimizer",
    heading: "Convert JPG Images to WEBP",
    description: "Modernize legacy JPEG photography arrays into cutting-edge, ultra-compressed web-scale WEBP frames.",
    category: "image-tools",
    keywords: ["jpg to webp", "compress images for web", "seo image speed optimization"],
    heroTitle: "Convert JPG to Optimized Web-Scale WEBP Assets",
    heroDescription: "Drastically reduce page loads by compressing traditional images into efficient file formats.",
    formulaExplanation: "Passes array frames through the webp encoder matrix inside the local browser application.",
    examples: [], faq: [], icon: "ImageIcon"
  },
  {
    slug: "convert-png-to-webp",
    title: "PNG to WEBP Optimizer",
    heading: "Convert Transparent PNG to WEBP",
    description: "Compress heavy lossless PNG structures into advanced alpha-supported lightweight WEBP layouts.",
    category: "image-tools",
    keywords: ["png to webp", "convert png to webp with transparency", "lossless image reduction"],
    heroTitle: "Modernize Transparent PNG Files to Advanced WEBP",
    heroDescription: "Maintain essential alpha layer transparencies while losing up to 70% of the raw file footprint.",
    formulaExplanation: "Encodes alpha channel bits directly into next-gen bitstream structures completely offline.",
    examples: [], faq: [], icon: "ImageIcon"
  },
  {
    slug: "webp-to-png",
    title: "WEBP to PNG Converter",
    heading: "Extract WEBP Frames to PNG Layouts",
    description: "Safely unpack WEBP images into editable, uncompressed transparent PNG graphic containers.",
    category: "image-tools",
    keywords: ["webp to png", "extract transparent webp", "image editing preparation"],
    heroTitle: "Convert WEBP Back to Lossless PNG Graphics",
    heroDescription: "Prepare compressed network assets for high-fidelity offline design edits effortlessly.",
    formulaExplanation: "Decodes alpha bit channels into standard transparent canvas configurations.",
    examples: [], faq: [], icon: "ImageIcon"
  },
  {
    slug: "webp-to-pdf",
    title: "WEBP to PDF Document Tool",
    heading: "Convert WEBP Images to PDF Sheet",
    description: "Compile webp graphic banners straight into standardized portable PDF documents.",
    category: "image-tools",
    keywords: ["webp to pdf", "save webp as pdf document", "local asset layout tool"],
    heroTitle: "Convert WEBP Graphics to Standard PDF Documents",
    heroDescription: "Encapsulate modern web-format items into clean document templates with absolute privacy.",
    formulaExplanation: "Builds a canvas byte-stream mapping layer and packages it inside document wrappers.",
    examples: [], faq: [], icon: "ImageIcon"
  },
  {
    slug: "heic-to-jpg",
    title: "HEIC to JPG Mobile Converter",
    heading: "Convert iPhone HEIC Photos to JPG",
    description: "Unshackle iOS mobile images by converting high-efficiency HEIC photos into standard JPEGs instantly.",
    category: "image-tools",
    keywords: ["heic to jpg", "convert apple photos to jpeg", "heic converter windows free"],
    heroTitle: "Convert iOS HEIC Photos to Universal JPG Formats",
    heroDescription: "Fix device cross-compatibility limitations by processing HEIC images locally inside your browser.",
    formulaExplanation: "Uses client-side WASM compilation logic to process HEIF blocks into common canvas formats.",
    examples: [], faq: [], icon: "ImageIcon"
  },
  {
    slug: "heic-to-png",
    title: "HEIC to PNG Mobile Converter",
    heading: "Convert Apple HEIC Photos to PNG",
    description: "Convert high-efficiency mobile camera HEIC objects into high-resolution lossless PNG files.",
    category: "image-tools",
    keywords: ["heic to png", "convert iphone heic to transparent png", "lossless mobile migration"],
    heroTitle: "Convert Apple HEIC Files to Lossless PNG Formats",
    heroDescription: "Easily prepare mobile content streams for design frameworks using full browser processing threads.",
    formulaExplanation: "Parses binary camera object matrices directly inside the device memory sandbox environment.",
    examples: [], faq: [], icon: "ImageIcon"
  },
  {
    slug: "svg-to-png",
    title: "SVG to PNG Rasterizer",
    heading: "Convert Vector SVG to Raster PNG",
    description: "Rasterize mathematical vector SVG code graphics into fixed resolution transparent PNG shapes.",
    category: "image-tools",
    keywords: ["svg to png", "rasterize vector file", "svg converter online free"],
    heroTitle: "Rasterize Vector SVG Code Into Crisp PNG Grids",
    heroDescription: "Bake scalable mathematical curves into standard image blocks perfectly sized for production networks.",
    formulaExplanation: "Draws source markup strings to an XML-backed image block before rasterizing to canvas boundaries.",
    examples: [], faq: [], icon: "ImageIcon"
  },
  {
    slug: "png-to-svg",
    title: "PNG to SVG Vectorizer",
    heading: "Trace Raster PNG Images to Vector SVG",
    description: "Vectorize fixed grid pixels into high-fidelity scalable path strings (/SVG mathematical shapes) instantly.",
    category: "image-tools",
    keywords: ["png to svg", "vectorize pixel art", "convert image to vector curves"],
    heroTitle: "Trace Pixels into Scalable Mathematical SVG Contours",
    heroDescription: "Turn standard, blocky raster grids into resolution-independent infinite vector layouts.",
    formulaExplanation: "Scans edge pixel contrast gradients and constructs continuous bezier node string tracks.",
    examples: [], faq: [], icon: "ImageIcon"
  }
];
