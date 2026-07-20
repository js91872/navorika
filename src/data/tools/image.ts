import { Tool } from "@/types/tool";

export const imageTools: Tool[] = [
  {
    slug: "image-compressor",
    title: "Image Compressor",
    shortDescription: "Reduce image file size while maintaining quality.",
    description: "Compress images with 3 levels: Low, Medium, and High. Support for JPG, PNG, WEBP, GIF, and BMP.",
    category: "Image Tools",
    keywords: ["Image Compressor", "Compress Image", "Reduce Image Size", "Image Optimizer", "Photo Compressor"],
    featured: true,
    badge: "Popular",
    heroTitle: "Free Image Compressor",
    heroDescription: "Reduce image file size while maintaining quality.",
    formula: "",
    faq: [
      { question: "What compression levels are available?", answer: "We offer 3 levels: Low (best quality), Medium (balanced), and High (smallest size)." },
      { question: "What formats are supported?", answer: "We support JPG, PNG, WEBP, GIF, and BMP formats." },
      { question: "Is my data secure?", answer: "Yes, all processing happens in your browser." }
    ],
    examples: [],
    relatedTools: ["image-resizer", "image-converter", "crop-image"]
  }
];
