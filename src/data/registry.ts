// src/data/registry.ts

export interface Tool {
  slug: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
  heroTitle?: string;
  heroDescription?: string;
  formulaExplanation?: string;
  faq?: Array<{ question: string; answer: string }>;
}

export const tools: Tool[] = [
  // ====== PDF TOOLS ======
  {
    slug: 'add-image-to-pdf',
    title: 'Add Image to PDF',
    description: 'Add images to PDF documents instantly. Insert JPG, PNG, WebP, and other images into any PDF file online.',
    category: 'pdf-tools',
    keywords: ['pdf', 'add image', 'insert image', 'jpg to pdf', 'png to pdf'],
    heroTitle: 'Add Image to PDF Online',
    heroDescription: 'Insert images into your PDF documents easily and quickly. Free online tool with no uploads required.',
    formulaExplanation: 'Upload your PDF, select the image you want to add, and download the updated PDF instantly.',
    faq: [
      {
        question: 'How do I add an image to a PDF?',
        answer: 'Upload your PDF, select the image you want to add (JPG, PNG, WebP, etc.), and download your updated PDF instantly.'
      },
      {
        question: 'What image formats are supported?',
        answer: 'We support JPG, PNG, WebP, BMP, GIF, and SVG image formats for adding to PDFs.'
      },
      {
        question: 'Can I add multiple images to a PDF?',
        answer: 'Yes, you can add multiple images to your PDF by repeating the process or selecting multiple images at once.'
      },
      {
        question: 'Is my data safe when using this tool?',
        answer: 'Yes, all processing happens locally in your browser. No files are uploaded to our servers.'
      },
      {
        question: 'Do I need to create an account?',
        answer: 'No, you can use this tool without any signup or registration.'
      },
      {
        question: 'Can I add images to scanned PDFs?',
        answer: 'Yes, you can add images to any PDF document, including scanned files.'
      }
    ]
  },
  
  {
    slug: 'add-page-numbers',
    title: 'Add Page Numbers to PDF',
    description: 'Add page numbers to PDF documents automatically. Customize position, format, and starting number.',
    category: 'pdf-tools',
    keywords: ['pdf', 'page numbers', 'numbering', 'footer', 'header'],
    heroTitle: 'Add Page Numbers to PDF Online',
    heroDescription: 'Add page numbers to your PDF documents in seconds. Free online tool with no uploads required.',
    formulaExplanation: 'Upload your PDF, choose the position and format for page numbers, and download your numbered PDF.',
    faq: [
      {
        question: 'Can I remove existing page numbers before adding new ones?',
        answer: 'Yes, you can choose to remove existing page numbers and add new ones in your preferred format.'
      },
      {
        question: 'What page number formats are available?',
        answer: 'We support numeric (1, 2, 3), roman numerals (i, ii, iii), and alphanumeric (A, B, C) formats.'
      },
      {
        question: 'Can I add page numbers to specific pages only?',
        answer: 'Currently, we support adding page numbers to all pages. For specific pages, you can split and merge PDFs separately.'
      },
      {
        question: 'Is my document secure?',
        answer: 'Yes, all processing is local. Your files never leave your browser.'
      }
    ]
  },
  
  {
    slug: 'add-watermark',
    title: 'Add Watermark to PDF',
    description: 'Add text or image watermarks to PDF files online free. Protect your documents with custom watermarks.',
    category: 'pdf-tools',
    keywords: ['pdf', 'watermark', 'protect', 'copyright', 'branding'],
    heroTitle: 'Add Watermark to PDF Online',
    heroDescription: 'Protect your PDF documents with custom watermarks. Free online tool with no uploads required.',
    formulaExplanation: 'Upload your PDF, enter your watermark text or upload an image, and download your watermarked PDF.',
    faq: [
      {
        question: 'Can I add both text and image watermarks?',
        answer: 'Yes, you can add either text or image watermarks to your PDF documents.'
      },
      {
        question: 'Will the watermark be visible on all pages?',
        answer: 'Yes, the watermark will be applied to all pages of your PDF document.'
      },
      {
        question: 'Can I customize the watermark position and size?',
        answer: 'Yes, you can adjust the position, size, opacity, and rotation of the watermark.'
      },
      {
        question: 'Is my document secure?',
        answer: 'Yes, all processing is local. Your files never leave your device.'
      }
    ]
  },
  
  {
    slug: 'compress-pdf',
    title: 'Compress PDF',
    description: 'Compress PDF files online without losing quality. Reduce PDF file size for email, web, and sharing.',
    category: 'pdf-tools',
    keywords: ['pdf', 'compress', 'reduce size', 'optimize', 'shrink'],
    heroTitle: 'Compress PDF Online',
    heroDescription: 'Reduce the file size of your PDF documents quickly and efficiently. Free online tool with no uploads required.',
    formulaExplanation: 'Upload your PDF, select compression level, and download your compressed PDF instantly.',
    faq: [
      {
        question: 'How much can I reduce PDF size?',
        answer: 'Compression varies by file. Typical reductions are 30-70% depending on the content and image quality.'
      },
      {
        question: 'Does compression affect quality?',
        answer: 'We balance compression with quality. For most documents, the quality difference is minimal while file size is significantly reduced.'
      },
      {
        question: 'Is this tool free?',
        answer: 'Yes, this tool is completely free to use with no limits on number of compressions.'
      },
      {
        question: 'Is my data safe?',
        answer: 'Yes, all processing happens locally in your browser. No files are uploaded to our servers.'
      }
    ]
  },
  
  {
    slug: 'merge-pdf',
    title: 'Merge PDF',
    description: 'Merge multiple PDF files into one document. Combine PDF files easily online without uploading.',
    category: 'pdf-tools',
    keywords: ['pdf', 'merge', 'combine', 'join', 'concatenate'],
    heroTitle: 'Merge PDF Files Online',
    heroDescription: 'Combine multiple PDF files into a single document. Free online tool with no uploads required.',
    formulaExplanation: 'Upload multiple PDF files, arrange them in your preferred order, and download your merged PDF.',
    faq: [
      {
        question: 'How many PDFs can I merge?',
        answer: 'You can merge as many PDFs as needed, up to reasonable file size limits for your browser.'
      },
      {
        question: 'Will the merged PDF maintain quality?',
        answer: 'Yes, we maintain original quality when merging PDF files.'
      },
      {
        question: 'Can I reorder the PDFs before merging?',
        answer: 'Yes, you can drag and drop to reorder files before merging.'
      },
      {
        question: 'Is my data safe?',
        answer: 'Yes, all processing happens locally in your browser. No files are uploaded to our servers.'
      }
    ]
  },
  
  {
    slug: 'split-pdf',
    title: 'Split PDF',
    description: 'Split PDF files into multiple documents. Extract specific pages or split PDF into separate files online.',
    category: 'pdf-tools',
    keywords: ['pdf', 'split', 'extract', 'separate', 'divide'],
    heroTitle: 'Split PDF Online',
    heroDescription: 'Split your PDF files into multiple documents or extract specific pages. Free online tool with no uploads required.',
    formulaExplanation: 'Upload your PDF, choose page ranges to extract, and download your split PDF files.',
    faq: [
      {
        question: 'Can I split PDF by page ranges?',
        answer: 'Yes, you can choose specific page ranges to extract into separate PDF files.'
      },
      {
        question: 'Can I remove pages from a PDF?',
        answer: 'Yes, you can extract the pages you want, effectively removing unwanted pages from the original.'
      },
      {
        question: 'Is my data safe?',
        answer: 'Yes, all processing happens locally in your browser. No files are uploaded to our servers.'
      }
    ]
  },
  
  // ====== IMAGE TOOLS ======
  {
    slug: 'resize-image',
    title: 'Resize Image',
    description: 'Resize images online with precision. Scale images to exact dimensions without losing quality.',
    category: 'image-tools',
    keywords: ['image', 'resize', 'scale', 'dimensions', 'pixels'],
    heroTitle: 'Resize Image Online',
    heroDescription: 'Change the dimensions of your images quickly and easily. Free online tool with no uploads required.',
    formulaExplanation: 'Upload your image, enter desired dimensions, and download your resized image instantly.',
    faq: [
      {
        question: 'What image formats are supported?',
        answer: 'We support JPG, PNG, WebP, GIF, and BMP formats.'
      },
      {
        question: 'Does resizing affect image quality?',
        answer: 'We use high-quality resizing algorithms to maintain image quality as much as possible.'
      },
      {
        question: 'Can I maintain aspect ratio?',
        answer: 'Yes, you can choose to maintain aspect ratio or set custom dimensions.'
      },
      {
        question: 'Is my data safe?',
        answer: 'Yes, all processing happens locally in your browser. No files are uploaded to our servers.'
      }
    ]
  },
  
  {
    slug: 'compress-image',
    title: 'Compress Image',
    description: 'Compress images online while maintaining quality. Reduce file size for faster loading and sharing.',
    category: 'image-tools',
    keywords: ['image', 'compress', 'reduce size', 'optimize', 'shrink'],
    heroTitle: 'Compress Image Online',
    heroDescription: 'Reduce the file size of your images without sacrificing quality. Free online tool with no uploads required.',
    formulaExplanation: 'Upload your image, choose compression level, and download your compressed image instantly.',
    faq: [
      {
        question: 'How much can I compress an image?',
        answer: 'Compression depends on the image content and format. Typical reductions are 30-80%.'
      },
      {
        question: 'Will compression affect image quality?',
        answer: 'We balance compression with quality. Higher compression may have some quality reduction.'
      },
      {
        question: 'What formats are supported?',
        answer: 'We support JPG, PNG, WebP, and other common image formats.'
      },
      {
        question: 'Is my data safe?',
        answer: 'Yes, all processing happens locally in your browser. No files are uploaded to our servers.'
      }
    ]
  },
  
  {
    slug: 'crop-image',
    title: 'Crop Image',
    description: 'Crop images online with precision. Cut, trim, and resize images to exact dimensions easily.',
    category: 'image-tools',
    keywords: ['image', 'crop', 'trim', 'cut', 'resize'],
    heroTitle: 'Crop Image Online',
    heroDescription: 'Crop your images to the perfect dimensions. Free online tool with no uploads required.',
    formulaExplanation: 'Upload your image, drag to select the crop area, and download your cropped image instantly.',
    faq: [
      {
        question: 'Can I crop to specific aspect ratios?',
        answer: 'Yes, we offer preset aspect ratios including square, 4:3, 16:9, and custom options.'
      },
      {
        question: 'What formats are supported?',
        answer: 'We support JPG, PNG, WebP, GIF, and BMP formats.'
      },
      {
        question: 'Is my data safe?',
        answer: 'Yes, all processing happens locally in your browser. No files are uploaded to our servers.'
      }
    ]
  },
  
  {
    slug: 'image-converter',
    title: 'Image Converter',
    description: 'Convert images between JPG, PNG, WebP, and more. Transform your images to any format online.',
    category: 'image-tools',
    keywords: ['image', 'converter', 'jpg', 'png', 'webp', 'format'],
    heroTitle: 'Image Converter Online',
    heroDescription: 'Convert your images to any format quickly and easily. Free online tool with no uploads required.',
    formulaExplanation: 'Upload your image, select the output format, and download your converted image instantly.',
    faq: [
      {
        question: 'What formats can I convert to?',
        answer: 'You can convert to JPG, PNG, WebP, GIF, and other common formats.'
      },
      {
        question: 'Does conversion affect quality?',
        answer: 'Quality depends on the source format and output format. Some conversions are lossy while others are lossless.'
      },
      {
        question: 'Is my data safe?',
        answer: 'Yes, all processing happens locally in your browser. No files are uploaded to our servers.'
      }
    ]
  },
  
  // ====== FINANCE TOOLS ======
  {
    slug: 'sip-calculator',
    title: 'SIP Calculator',
    description: 'Calculate Systematic Investment Plan (SIP) returns. Plan your mutual fund investments with accurate projections.',
    category: 'finance-calculators',
    keywords: ['sip', 'mutual fund', 'investment', 'returns', 'compounding'],
    heroTitle: 'SIP Calculator Online',
    heroDescription: 'Calculate your Systematic Investment Plan returns with accurate projections. Free online tool.',
    formulaExplanation: 'SIP returns are calculated using compound interest formula: M = P × [((1 + r)^n - 1) / r] × (1 + r)',
    faq: [
      {
        question: 'What is SIP?',
        answer: 'SIP (Systematic Investment Plan) is a method of investing in mutual funds where you invest a fixed amount regularly (monthly, quarterly, etc.).'
      },
      {
        question: 'How is SIP return calculated?',
        answer: 'SIP returns are calculated using compound interest formula, assuming regular monthly investments at the given rate of return.'
      },
      {
        question: 'Is this a financial advice tool?',
        answer: 'This is an educational calculator. Please consult a financial advisor for investment advice.'
      }
    ]
  },
  
  {
    slug: 'loan-emi-calculator',
    title: 'EMI Calculator',
    description: 'Calculate monthly EMI for home, car, and personal loans. Plan your loan repayments accurately.',
    category: 'finance-calculators',
    keywords: ['emi', 'loan', 'home loan', 'car loan', 'personal loan', 'interest'],
    heroTitle: 'EMI Calculator Online',
    heroDescription: 'Calculate your monthly EMI for any loan. Free online tool with accurate calculations.',
    formulaExplanation: 'EMI = P × r × (1+r)^n / ((1+r)^n - 1) where P is loan amount, r is monthly interest rate, and n is number of months.',
    faq: [
      {
        question: 'What is EMI?',
        answer: 'EMI (Equated Monthly Installment) is the fixed monthly payment you make towards repaying a loan.'
      },
      {
        question: 'How is EMI calculated?',
        answer: 'EMI is calculated using the formula: P × r × (1+r)^n / ((1+r)^n - 1).'
      },
      {
        question: 'Can I see the complete repayment schedule?',
        answer: 'Yes, we provide a complete amortization schedule showing each payment.'
      }
    ]
  },
  
  // ====== HEALTH TOOLS ======
  {
    slug: 'bmi-calculator',
    title: 'BMI Calculator',
    description: 'Calculate your Body Mass Index (BMI) instantly. Get health category assessment and weight management recommendations.',
    category: 'health-calculators',
    keywords: ['bmi', 'body mass index', 'weight', 'health', 'fitness'],
    heroTitle: 'BMI Calculator Online',
    heroDescription: 'Calculate your Body Mass Index instantly and get personalized health recommendations. Free online tool.',
    formulaExplanation: 'BMI = Weight (kg) / Height (m)²',
    faq: [
      {
        question: 'What is BMI?',
        answer: 'BMI (Body Mass Index) is a measure of body fat based on height and weight. It\'s used to screen for weight categories.'
      },
      {
        question: 'How is BMI calculated?',
        answer: 'BMI is calculated by dividing weight in kilograms by height in meters squared (kg/m²).'
      },
      {
        question: 'Is BMI accurate for athletes?',
        answer: 'BMI may not be accurate for athletes or people with high muscle mass. It\'s a general screening tool.'
      }
    ]
  },
  
  {
    slug: 'bmr-calculator',
    title: 'BMR Calculator',
    description: 'Calculate your Basal Metabolic Rate (BMR) daily calorie needs. Understand your body\'s energy requirements at rest.',
    category: 'health-calculators',
    keywords: ['bmr', 'basal metabolic rate', 'calories', 'metabolism', 'weight loss'],
    heroTitle: 'BMR Calculator Online',
    heroDescription: 'Calculate your Basal Metabolic Rate and understand your daily calorie needs. Free online tool.',
    formulaExplanation: 'BMR is calculated using the Mifflin-St Jeor equation based on gender, age, weight, and height.',
    faq: [
      {
        question: 'What is BMR?',
        answer: 'BMR (Basal Metabolic Rate) is the number of calories your body needs to maintain basic life functions at rest.'
      },
      {
        question: 'How is BMR calculated?',
        answer: 'We use the Mifflin-St Jeor equation, which considers gender, age, weight, and height for accurate BMR calculation.'
      },
      {
        question: 'Why is BMR important?',
        answer: 'Understanding your BMR is essential for weight management, nutrition planning, and setting calorie goals.'
      }
    ]
  },
  
  // ====== CONSTRUCTION TOOLS ======
  {
    slug: 'construction-cost-calculator',
    title: 'Construction Cost Calculator',
    description: 'Calculate total construction costs including materials, labor, overhead, and contingency. Get accurate building estimates.',
    category: 'construction-calculators',
    keywords: ['construction', 'cost', 'building', 'estimate', 'budget', 'project'],
    heroTitle: 'Construction Cost Calculator Online',
    heroDescription: 'Get accurate construction cost estimates with detailed breakdown. Free online tool for contractors and homeowners.',
    formulaExplanation: 'Total Cost = Base Cost + Labor + Materials + Overhead + Contingency',
    faq: [
      {
        question: 'What factors affect construction costs?',
        answer: 'Construction costs depend on area, location, material quality, labor rates, and project complexity.'
      },
      {
        question: 'How accurate is this calculator?',
        answer: 'This calculator provides estimates based on industry standards. Actual costs may vary by location and market conditions.'
      },
      {
        question: 'What is contingency in construction costs?',
        answer: 'Contingency is a buffer added to cover unexpected costs or changes during construction. Typically 5-15% of the total cost.'
      }
    ]
  },
  
  {
    slug: 'concrete-calculator',
    title: 'Concrete Calculator',
    description: 'Calculate concrete volume needed for slabs, footings, and columns. Estimate materials for your construction project.',
    category: 'construction-calculators',
    keywords: ['concrete', 'volume', 'slab', 'footing', 'column', 'construction'],
    heroTitle: 'Concrete Calculator Online',
    heroDescription: 'Calculate the exact concrete volume needed for your construction project. Free online tool.',
    formulaExplanation: 'Concrete Volume = Length × Width × Depth',
    faq: [
      {
        question: 'How much concrete do I need?',
        answer: 'The amount depends on your project dimensions. Use our calculator to get the exact volume needed.'
      },
      {
        question: 'What is the standard concrete mix ratio?',
        answer: 'The standard mix ratio is 1:2:3 (cement:sand:aggregate) for general construction purposes.'
      },
      {
        question: 'Should I order extra concrete?',
        answer: 'Yes, we recommend ordering 5-10% extra to account for spillage, uneven surfaces, and waste.'
      }
    ]
  },
  
  {
    slug: 'cement-calculator',
    title: 'Cement Calculator',
    description: 'Estimate cement bags required for your construction project. Calculate exact cement needs with proper mix ratios.',
    category: 'construction-calculators',
    keywords: ['cement', 'bags', 'concrete', 'construction', 'material estimate'],
    heroTitle: 'Cement Calculator Online',
    heroDescription: 'Calculate the exact number of cement bags needed for your concrete work. Free online tool.',
    formulaExplanation: 'Cement Bags = Volume × Mix Ratio × Density Factor',
    faq: [
      {
        question: 'How many cement bags per cubic meter?',
        answer: 'Typically, 7-8 bags of 50kg cement are needed per cubic meter of concrete mix.'
      },
      {
        question: 'What mix ratio should I use?',
        answer: 'Common mix ratios are 1:2:3 (general), 1:1.5:3 (strong), and 1:3:6 (foundation).'
      },
      {
        question: 'Should I add extra bags for wastage?',
        answer: 'Yes, consider adding 5-10% extra for wastage, spillage, and uneven surfaces.'
      }
    ]
  },
  
  {
    slug: 'sand-calculator',
    title: 'Sand Calculator',
    description: 'Estimate sand volume required for construction projects. Calculate sand needs for concrete, mortar, and backfilling.',
    category: 'construction-calculators',
    keywords: ['sand', 'volume', 'construction', 'material estimate', 'concrete'],
    heroTitle: 'Sand Calculator Online',
    heroDescription: 'Calculate the exact sand volume and weight needed for your construction project. Free online tool.',
    formulaExplanation: 'Sand Volume = Area × Thickness × Wastage Factor',
    faq: [
      {
        question: 'How much sand do I need?',
        answer: 'The amount depends on your project type and size. This calculator helps you determine the exact volume needed.'
      },
      {
        question: 'What is the density of sand?',
        answer: 'The density of dry sand is typically 1400-1600 kg/m³, while wet sand is 1600-1800 kg/m³.'
      },
      {
        question: 'Should I order extra sand?',
        answer: 'Yes, we recommend ordering 5-10% extra to account for wastage and compaction.'
      }
    ]
  },
  
  {
    slug: 'steel-weight-calculator',
    title: 'Steel Weight Calculator',
    description: 'Calculate weight of steel bars, beams, and structural steel. Estimate steel materials for construction projects.',
    category: 'construction-calculators',
    keywords: ['steel', 'weight', 'structural steel', 'rebar', 'beam', 'construction'],
    heroTitle: 'Steel Weight Calculator Online',
    heroDescription: 'Calculate the exact weight of steel for your construction project. Free online tool for contractors.',
    formulaExplanation: 'Steel Weight = Volume × Density (7850 kg/m³)',
    faq: [
      {
        question: 'What is the density of steel?',
        answer: 'The density of mild steel is approximately 7850 kg/m³ or 490 lb/ft³.'
      },
      {
        question: 'How is steel weight calculated?',
        answer: 'Steel weight is calculated by multiplying volume by density. For bars, it\'s cross-sectional area × length × density.'
      },
      {
        question: 'What steel shapes are supported?',
        answer: 'We support round, square, rectangular, and I-beam shapes for weight calculation.'
      }
    ]
  },
  
  {
    slug: 'rebar-calculator',
    title: 'Rebar Calculator',
    description: 'Calculate rebar quantity and weight for reinforced concrete. Plan your reinforcement materials accurately.',
    category: 'construction-calculators',
    keywords: ['rebar', 'reinforcement', 'concrete', 'steel bar', 'construction'],
    heroTitle: 'Rebar Calculator Online',
    heroDescription: 'Calculate exact rebar quantities for your concrete reinforcement needs. Free online tool.',
    formulaExplanation: 'Rebar Length = Perimeter × Number of Bars + Lap Splice',
    faq: [
      {
        question: 'How much rebar do I need?',
        answer: 'The amount depends on your concrete structure. This calculator helps you determine the exact quantity needed.'
      },
      {
        question: 'What is standard rebar spacing?',
        answer: 'Standard rebar spacing is typically 150-200mm for slabs and 100-150mm for structural elements.'
      },
      {
        question: 'Should I add extra rebar for wastage?',
        answer: 'Yes, consider adding 5-10% extra for lapping, wastage, and extras.'
      }
    ]
  }
];

export const categories: Category[] = [
  {
    slug: 'pdf-tools',
    name: 'PDF Tools',
    description: 'Merge, split, compress, and convert documents locally.',
    icon: 'FileText',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    slug: 'image-tools',
    name: 'Image Tools',
    description: 'Resize, convert, compress, and edit photos instantly.',
    icon: 'Image',
    color: 'from-violet-500 to-purple-600',
  },
  {
    slug: 'finance-calculators',
    name: 'Finance Calculators',
    description: 'Calculate SIP, EMI, loans, GST, tax, PPF, FD, and more.',
    icon: 'Calculator',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    slug: 'health-calculators',
    name: 'Health Calculators',
    description: 'BMI, BMR, TDEE, body fat, fitness, and nutrition metrics.',
    icon: 'HeartPulse',
    color: 'from-rose-500 to-pink-600',
  },
  {
    slug: 'developer-tools',
    name: 'Developer Tools',
    description: 'JSON, base64, JWT, QR codes, and more.',
    icon: 'Code',
    color: 'from-amber-500 to-orange-600',
  },
  {
    slug: 'construction-calculators',
    name: 'Construction Calculators',
    description: 'Material estimation, cost planning, and project management tools.',
    icon: 'Wrench',
    color: 'from-cyan-500 to-blue-600',
  }
];