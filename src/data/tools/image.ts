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
    keywords: ["Image Converter", "Convert Image", "JPG to PNG", "PNG to WEBP"],
    featured: true,
    badge: "Popular",
    heroTitle: "Free Image Converter",
    heroDescription: "Convert images between JPG, PNG, WEBP, BMP, and GIF.",
    formula: "",
    faq: [
      { question: "What formats are supported?", answer: "We support JPG, PNG, WEBP, BMP, and GIF." },
      { question: "Can I control quality?", answer: "Yes, use the quality slider to balance file size and quality." }
    ],
    examples: [],
    relatedTools: ["image-compressor", "image-resizer", "crop-image"]
  },
  {
    slug: "crop-image",
    title: "Crop Image",
    shortDescription: "Crop your images to any dimensions or aspect ratio.",
    description: "Crop images with visual controls. Choose from preset aspect ratios or create custom crops.",
    category: "Image Tools",
    keywords: ["Crop Image", "Image Cropper", "Crop Photo", "Aspect Ratio"],
    featured: true,
    badge: "Popular",
    heroTitle: "Free Image Cropper",
    heroDescription: "Crop your images to any dimensions or aspect ratio.",
    formula: "",
    faq: [
      { question: "What aspect ratios are available?", answer: "We offer Square, 4:3, 3:2, 16:9, 9:16, and custom ratios." },
      { question: "Can I free-crop?", answer: "Yes, choose the 'Free' option for custom cropping." }
    ],
    examples: [],
    relatedTools: ["image-compressor", "image-resizer", "image-converter"]
  },
  {
    slug: "background-remover",
    title: "Background Remover",
    shortDescription: "Remove image backgrounds automatically with AI.",
    description: "Remove image backgrounds automatically using AI technology.",
    category: "Image Tools",
    keywords: ["Background Remover", "Remove Background", "AI Background Remover", "Transparent Background"],
    featured: true,
    badge: "Popular",
    heroTitle: "Free Background Remover",
    heroDescription: "Remove image backgrounds automatically with AI.",
    formula: "",
    faq: [
      { question: "How does it work?", answer: "Our AI automatically detects the subject and removes the background." },
      { question: "What formats are supported?", answer: "We support JPG, PNG, WEBP, GIF, and BMP." },
      { question: "Is my data secure?", answer: "Yes, all processing happens in your browser." }
    ],
    examples: [],
    relatedTools: ["image-compressor", "image-resizer", "image-converter"]
  },
  {
    slug: "passport-photo",
    title: "Passport Size Photo Maker",
    shortDescription: "Create passport photos that meet official requirements.",
    description: "Create passport photos that meet official requirements for any country. Auto-sizing and background options.",
    category: "Image Tools",
    keywords: ["Passport Photo", "Passport Size Photo", "Photo Maker", "ID Photo", "Visa Photo"],
    featured: true,
    badge: "New",
    heroTitle: "Free Passport Size Photo Maker",
    heroDescription: "Create passport photos that meet official requirements.",
    formula: "",
    faq: [
      { question: "What countries are supported?", answer: "We support 15+ countries including US, UK, India, Canada, Australia, and more." },
      { question: "What are the requirements?", answer: "Each country has specific size, background, and head size requirements." },
      { question: "Is my data secure?", answer: "Yes, all processing happens in your browser." }
    ],
    examples: [],
    relatedTools: ["background-remover", "image-resizer", "crop-image"]
  }
];
