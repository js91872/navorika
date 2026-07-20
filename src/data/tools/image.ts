import { Tool } from "@/types/tool";

export const imageTools: Tool[] = [
  {
    slug: "image-compressor",
    title: "Image Compressor",
    shortDescription: "Reduce image file size while maintaining quality.",
    description: "Compress images with 3 levels: Low, Medium, and High.",
    category: "Image Tools",
    keywords: ["Image Compressor", "Compress Image", "Reduce Image Size"],
    featured: true,
    badge: "Popular",
    heroTitle: "Free Image Compressor",
    heroDescription: "Reduce image file size while maintaining quality.",
    formula: "",
    faq: [
      { question: "What compression levels are available?", answer: "We offer 3 levels: Low (best quality), Medium (balanced), and High (smallest size)." },
      { question: "What formats are supported?", answer: "We support JPG, PNG, WEBP, GIF, and BMP formats." }
    ],
    examples: [],
    relatedTools: ["image-resizer", "image-converter", "crop-image"]
  },
  {
    slug: "image-resizer",
    title: "Image Resizer",
    shortDescription: "Resize images to any dimensions with ease.",
    description: "Resize images to any dimensions. Choose from presets, pixels, or percentage.",
    category: "Image Tools",
    keywords: ["Image Resizer", "Resize Image", "Resize Photo", "Image Dimensions"],
    featured: true,
    badge: "Popular",
    heroTitle: "Free Image Resizer",
    heroDescription: "Resize images to any dimensions with ease.",
    formula: "",
    faq: [
      { question: "What resize options are available?", answer: "You can resize by pixels, percentage, or choose from presets." },
      { question: "Can I maintain aspect ratio?", answer: "Yes, toggle the maintain aspect ratio option." }
    ],
    examples: [],
    relatedTools: ["image-compressor", "image-converter", "crop-image"]
  },
  {
    slug: "image-converter",
    title: "Image Converter",
    shortDescription: "Convert images between JPG, PNG, WEBP, BMP, and GIF.",
    description: "Convert images between formats with adjustable quality.",
    category: "Image Tools",
    keywords: ["Image Converter", "Convert Image", "JPG to PNG", "PNG to WEBP", "Image Format"],
    featured: true,
    badge: "Popular",
    heroTitle: "Free Image Converter",
    heroDescription: "Convert images between JPG, PNG, WEBP, BMP, and GIF.",
    formula: "",
    faq: [
      { question: "What formats are supported?", answer: "We support JPG, PNG, WEBP, BMP, and GIF." },
      { question: "Can I control quality?", answer: "Yes, use the quality slider to balance file size and quality." },
      { question: "Is my data secure?", answer: "Yes, all processing happens in your browser." }
    ],
    examples: [],
    relatedTools: ["image-compressor", "image-resizer", "crop-image"]
  }
];
