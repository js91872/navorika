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

export type RegisteredTool = Tool & Required<Pick<Tool, 'heroTitle' | 'heroDescription'>>;

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const categories: Category[] = [
  {
    slug: 'pdf-tools',
    name: 'PDF Tools',
    description: 'Merge, split, compress, and convert documents locally.',
    icon: 'FileText',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    slug: 'image-tools',
    name: 'Image Tools',
    description: 'Resize, convert, compress, and edit photos instantly.',
    icon: 'Image',
    color: 'from-violet-500 to-purple-600'
  },
  {
    slug: 'finance-calculators',
    name: 'Finance Calculators',
    description: 'Calculate SIP, EMI, loans, GST, tax, PPF, FD, and more.',
    icon: 'Calculator',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    slug: 'health-calculators',
    name: 'Health Calculators',
    description: 'BMI, BMR, TDEE, body fat, fitness, and nutrition metrics.',
    icon: 'HeartPulse',
    color: 'from-rose-500 to-pink-600'
  },
  {
    slug: 'developer-tools',
    name: 'Developer Tools',
    description: 'JSON, base64, JWT, QR codes, and more.',
    icon: 'Code',
    color: 'from-amber-500 to-orange-600'
  },
  {
    slug: 'construction-calculators',
    name: 'Construction Calculators',
    description: 'Calculate concrete, cement, steel, sand, paint, and more.',
    icon: 'Wrench',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    slug: 'everyday-calculators',
    name: 'Everyday Calculators',
    description: 'Practical calculators for travel, time, conversions, planning, and everyday decisions.',
    icon: 'Globe',
    color: 'from-sky-500 to-cyan-600'
  }
];

export const tools: RegisteredTool[] = ([
  // ====== PDF TOOLS ======
  {
    slug: 'add-image-to-pdf',
    title: 'Add Image to PDF',
    description: 'Place one JPG, PNG, or WebP image on a selected page of a readable, unencrypted PDF locally.',
    category: 'pdf-tools',
    keywords: ['add-image-to-pdf', 'add', 'image', 'to', 'pdf']
  },
  {
    slug: 'add-page-numbers',
    title: 'Add Page Numbers',
    description: 'Add page numbers to PDF documents automatically. Customize position, format, and starting number.',
    category: 'pdf-tools',
    keywords: ['add-page-numbers', 'add', 'page', 'numbers', 'pdf']
  },
  {
    slug: 'add-watermark',
    title: 'Add Watermark',
    description: 'Add a centered diagonal text watermark to every PDF page locally in your browser.',
    category: 'pdf-tools',
    keywords: ['add-watermark', 'add', 'watermark', 'pdf']
  },
  {
    slug: 'compress-pdf',
    title: 'Compress PDF',
    description: 'Rasterize PDF pages as compressed JPEG images locally and compare the actual output size.',
    category: 'pdf-tools',
    keywords: ['compress-pdf', 'compress', 'pdf']
  },
  {
    slug: 'crop-pdf',
    title: 'Crop PDF',
    description: 'Set custom crop-box margins on every PDF page locally in your browser.',
    category: 'pdf-tools',
    keywords: ['crop-pdf', 'crop', 'pdf']
  },
  {
    slug: 'delete-pdf-pages',
    title: 'Delete PDF Pages',
    description: 'Delete unwanted pages from PDF documents online free. Remove specific pages instantly.',
    category: 'pdf-tools',
    keywords: ['delete-pdf-pages', 'delete', 'pdf', 'pages']
  },
  {
    slug: 'extract-pdf-pages',
    title: 'Extract PDF Pages',
    description: 'Extract specific pages from PDF documents online free. Save selected pages as separate PDF files.',
    category: 'pdf-tools',
    keywords: ['extract-pdf-pages', 'extract', 'pdf', 'pages']
  },
  {
    slug: 'extract-pdf-text',
    title: 'Extract PDF Text',
    description: 'Extract embedded text from readable, text-based PDFs locally and download it as a TXT file.',
    category: 'pdf-tools',
    keywords: ['extract-pdf-text', 'extract', 'pdf', 'text']
  },
  {
    slug: 'flatten-pdf',
    title: 'Flatten PDF',
    description: 'Flatten supported interactive PDF form fields into static page content.',
    category: 'pdf-tools',
    keywords: ['flatten-pdf', 'flatten', 'pdf']
  },
  {
    slug: 'interleave-pdf',
    title: 'Interleave PDF',
    description: 'Interleave pages from multiple PDF documents online free. Alternate pages from two PDFs into one document.',
    category: 'pdf-tools',
    keywords: ['interleave-pdf', 'interleave', 'pdf']
  },
  {
    slug: 'jpg-to-pdf',
    title: 'JPG to PDF',
    description: 'Combine one or more JPG images into an ordered PDF locally, with one image per page.',
    category: 'pdf-tools',
    keywords: ['jpg-to-pdf', 'jpg', 'to', 'pdf']
  },
  {
    slug: 'merge-pdf',
    title: 'Merge PDF',
    description: 'Merge PDF files online for free. Combine multiple PDF documents into one.',
    category: 'pdf-tools',
    keywords: ['merge-pdf', 'merge', 'pdf']
  },
  {
    slug: 'pdf-metadata-editor',
    title: 'PDF Metadata Editor',
    description: 'View and edit PDF metadata online free. Modify document properties, author, title, and subject.',
    category: 'pdf-tools',
    keywords: ['pdf-metadata-editor', 'pdf', 'metadata', 'editor']
  },
  {
    slug: 'pdf-to-image',
    title: 'PDF to Image',
    description: 'Render one selected page from a readable PDF as a previewed PNG or JPG image locally.',
    category: 'pdf-tools',
    keywords: ['pdf-to-image', 'pdf', 'to', 'image']
  },
  {
    slug: 'pdf-to-jpg',
    title: 'PDF to JPG',
    description: 'Render one selected page from a readable PDF as a JPG with adjustable resolution and quality.',
    category: 'pdf-tools',
    keywords: ['pdf-to-jpg', 'pdf', 'to', 'jpg']
  },
  {
    slug: 'protect-pdf',
    title: 'Protect PDF',
    description: 'Temporarily unavailable while genuine browser-based PDF encryption is being validated.',
    category: 'pdf-tools',
    keywords: ['protect-pdf', 'protect', 'pdf']
  },
  {
    slug: 'reorder-pdf',
    title: 'Reorder PDF',
    description: 'Reorder pages in a readable, unencrypted PDF and download the rebuilt document locally.',
    category: 'pdf-tools',
    keywords: ['reorder-pdf', 'reorder', 'pdf']
  },
  {
    slug: 'rotate-pdf',
    title: 'Rotate PDF',
    description: 'Rotate pages in PDF documents online free. Correct page orientation in your PDF files.',
    category: 'pdf-tools',
    keywords: ['rotate-pdf', 'rotate', 'pdf']
  },
  {
    slug: 'sign-pdf',
    title: 'Sign PDF',
    description: 'Draw and place a visible handwritten signature image on one PDF page locally.',
    category: 'pdf-tools',
    keywords: ['sign-pdf', 'sign', 'pdf']
  },
  {
    slug: 'split-pdf',
    title: 'Split PDF',
    description: 'Split PDF files online for free. Extract specific pages or split PDF into multiple documents.',
    category: 'pdf-tools',
    keywords: ['split-pdf', 'split', 'pdf']
  },
  {
    slug: 'unlock-pdf',
    title: 'Unlock PDF',
    description: 'Temporarily unavailable while genuine browser-based PDF decryption is being validated.',
    category: 'pdf-tools',
    keywords: ['unlock-pdf', 'unlock', 'pdf']
  },
  {
    slug: 'webp-to-pdf',
    title: 'WebP to PDF',
    description: 'Decode one or more WebP images locally and combine them into an ordered PDF.',
    category: 'pdf-tools',
    keywords: ['webp-to-pdf', 'webp', 'to', 'pdf']
  },

  // ====== IMAGE TOOLS ======
  {
    slug: 'batch-image-converter',
    title: 'Batch Image Converter',
    description: 'Convert multiple images at once online free. Batch convert JPG, PNG, WebP, and HEIC formats.',
    category: 'image-tools',
    keywords: ['batch-image-converter', 'batch', 'image', 'converter']
  },
  {
    slug: 'blur-face',
    title: 'Blur Face',
    description: 'Temporarily unavailable until validated on-device face detection is added.',
    category: 'image-tools',
    keywords: ['blur-face', 'blur', 'face', 'image']
  },
  {
    slug: 'change-image-resolution',
    title: 'Change Image Resolution',
    description: 'Resize an image to a standard HD, FHD, QHD, UHD, or square pixel preset.',
    category: 'image-tools',
    keywords: ['change-image-resolution', 'change', 'image', 'resolution']
  },
  {
    slug: 'image-color-picker',
    title: 'Image Color Picker',
    description: 'Pick a pixel from an image and copy its exact hexadecimal RGB color locally.',
    category: 'image-tools',
    keywords: [
      'image color picker',
      'color picker from image',
      'image color extractor',
      'hex color picker',
      'pick color from image',
      'image hex color picker'
    ]
  },
  {
    slug: 'compress-image',
    title: 'Compress Image',
    description: 'Re-encode JPEG and WebP with adjustable quality, or convert PNG to compressed WebP locally.',
    category: 'image-tools',
    keywords: ['compress-image', 'compress', 'image']
  },
  {
    slug: 'compress-jpg',
    title: 'Compress JPG',
    description: 'Re-encode JPEG images with adjustable lossy quality locally in your browser.',
    category: 'image-tools',
    keywords: ['compress-jpg', 'compress', 'jpg']
  },
  {
    slug: 'compress-png',
    title: 'Compress PNG',
    description: 'Losslessly re-encode a PNG locally and compare the actual output size.',
    category: 'image-tools',
    keywords: ['compress-png', 'compress', 'png']
  },
  {
    slug: 'compress-webp',
    title: 'Compress WebP',
    description: 'Re-encode WebP images with adjustable browser quality and local processing.',
    category: 'image-tools',
    keywords: ['compress-webp', 'compress', 'webp']
  },
  {
    slug: 'convert-jpg-to-png',
    title: 'Convert JPG to PNG',
    description: 'Decode a JPG and export the same pixels as a lossless PNG locally in your browser.',
    category: 'image-tools',
    keywords: ['convert-jpg-to-png', 'jpg', 'to', 'png']
  },
  {
    slug: 'convert-jpg-to-webp',
    title: 'Convert JPG to WebP',
    description: 'Re-encode a JPG as WebP locally with adjustable browser quality and an output preview.',
    category: 'image-tools',
    keywords: ['convert-jpg-to-webp', 'jpg', 'to', 'webp']
  },
  {
    slug: 'convert-png-to-jpg',
    title: 'Convert PNG to JPG',
    description: 'Convert a PNG to adjustable-quality JPG locally, replacing transparent areas with white.',
    category: 'image-tools',
    keywords: ['convert-png-to-jpg', 'png', 'to', 'jpg']
  },
  {
    slug: 'convert-png-to-webp',
    title: 'Convert PNG to WebP',
    description: 'Convert PNG images to WebP online free. Transform PNG files to modern WebP format.',
    category: 'image-tools',
    keywords: ['convert-png-to-webp', 'png', 'to', 'webp']
  },
  {
    slug: 'convert-webp-to-jpg',
    title: 'Convert WebP to JPG',
    description: 'Convert WebP images to JPG online free. Transform WebP files to JPG format.',
    category: 'image-tools',
    keywords: ['convert-webp-to-jpg', 'webp', 'to', 'jpg']
  },
  {
    slug: 'crop-image',
    title: 'Crop Image',
    description: 'Crop images online for free. Cut, trim, and crop photos to any dimensions.',
    category: 'image-tools',
    keywords: ['crop-image', 'crop', 'image']
  },
  {
    slug: 'heic-to-jpg',
    title: 'HEIC to JPG',
    description: 'Decode a HEIC or HEIF file locally and export its first image as an adjustable-quality JPG.',
    category: 'image-tools',
    keywords: ['heic-to-jpg', 'heic', 'to', 'jpg']
  },
  {
    slug: 'heic-to-png',
    title: 'HEIC to PNG',
    description: 'Decode a HEIC or HEIF file locally and export its first image as a PNG.',
    category: 'image-tools',
    keywords: ['heic-to-png', 'heic', 'to', 'png']
  },
  {
    slug: 'html-to-image',
    title: 'HTML to Image',
    description: 'Temporarily unavailable pending a safe, deterministic HTML rendering engine.',
    category: 'image-tools',
    keywords: ['html-to-image', 'html', 'to', 'image']
  },
  {
    slug: 'icon-sticker-maker',
    title: 'Icon Sticker Maker',
    description: 'Create custom icons and stickers from images online free. Design unique stickers and icons.',
    category: 'image-tools',
    keywords: ['icon-sticker-maker', 'icon', 'sticker', 'maker']
  },
  {
    slug: 'id-photo-maker',
    title: 'ID Photo Maker',
    description: 'Crop a photo into convenient ID-size pixel presets with zoom and position controls.',
    category: 'image-tools',
    keywords: ['id-photo-maker', 'id', 'photo', 'maker']
  },
  {
    slug: 'image-converter',
    title: 'Image Converter',
    description: 'Convert JPG, PNG, and WebP images locally with previews and format-aware quality controls.',
    category: 'image-tools',
    keywords: ['image-converter', 'image', 'converter']
  },
  {
    slug: 'image-dpi-converter',
    title: 'Image DPI Converter',
    description: 'Temporarily unavailable pending verified JPEG and PNG density-metadata writers.',
    category: 'image-tools',
    keywords: ['image-dpi-converter', 'image', 'dpi', 'converter']
  },
  {
    slug: 'image-metadata-viewer',
    title: 'Image Metadata Viewer',
    description: 'View file properties and decoded pixel dimensions locally; EXIF is not parsed.',
    category: 'image-tools',
    keywords: ['image-metadata-viewer', 'image', 'metadata', 'viewer']
  },
  {
    slug: 'image-to-pdf',
    title: 'Image to PDF',
    description: 'Combine JPG, PNG, and WebP images into one ordered PDF locally, with one image per page.',
    category: 'image-tools',
    keywords: ['image-to-pdf', 'image', 'to', 'pdf']
  },
  {
    slug: 'meme-generator',
    title: 'Meme Generator',
    description: 'Create custom memes from images instantly online free. Add text, captions, and effects.',
    category: 'image-tools',
    keywords: ['meme-generator', 'meme', 'generator']
  },
  {
    slug: 'photo-collage-maker',
    title: 'Photo Collage Maker',
    description: 'Create a local PNG grid collage from up to 12 JPG, PNG, or WebP images.',
    category: 'image-tools',
    keywords: ['photo-collage-maker', 'photo', 'collage', 'maker']
  },
  {
    slug: 'photo-editor',
    title: 'Photo Editor',
    description: 'Edit photos online with professional tools. Crop, resize, adjust colors, and apply filters.',
    category: 'image-tools',
    keywords: ['photo-editor', 'photo', 'editor']
  },
  {
    slug: 'png-to-svg',
    title: 'PNG to SVG',
    description: 'Temporarily unavailable pending a genuine raster-to-vector tracing engine.',
    category: 'image-tools',
    keywords: ['png-to-svg', 'png', 'to', 'svg']
  },
  {
    slug: 'resize-image',
    title: 'Resize Image',
    description: 'Resize images online for free. Change image dimensions, scale photos, and optimize for web.',
    category: 'image-tools',
    keywords: ['resize-image', 'resize', 'image']
  },
  {
    slug: 'rotate-image',
    title: 'Rotate Image',
    description: 'Rotate images online for free. Flip, mirror, and straighten your images easily.',
    category: 'image-tools',
    keywords: ['rotate-image', 'rotate', 'image']
  },
  {
    slug: 'social-media-resizer',
    title: 'Social Media Resizer',
    description: 'Fit or crop images into built-in social-media pixel presets with local PNG export.',
    category: 'image-tools',
    keywords: ['social-media-resizer', 'social', 'media', 'resizer']
  },
  {
    slug: 'svg-to-png',
    title: 'SVG to PNG',
    description: 'Rasterize a browser-compatible SVG at its intrinsic dimensions and export PNG.',
    category: 'image-tools',
    keywords: ['svg-to-png', 'svg', 'to', 'png']
  },
  {
    slug: 'upscale-image',
    title: 'Upscale Image',
    description: 'Enlarge images by 2×, 3×, or 4× using high-quality browser interpolation.',
    category: 'image-tools',
    keywords: ['upscale-image', 'upscale', 'image']
  },
  {
    slug: 'watermark-image',
    title: 'Watermark Image',
    description: 'Add customizable text, color, opacity, and position to an image with local PNG export.',
    category: 'image-tools',
    keywords: ['watermark-image', 'watermark', 'image']
  },
  {
    slug: 'webp-to-png',
    title: 'WebP to PNG',
    description: 'Decode a still WebP image and export its pixels as a lossless PNG locally.',
    category: 'image-tools',
    keywords: ['webp-to-png', 'webp', 'to', 'png']
  },

  // ====== FINANCE CALCULATORS ======
  {
    slug: 'cashflow-budget-architect',
    title: 'Cashflow Budget Architect',
    description: 'Plan and manage your cash flow with comprehensive budgeting tools. Track income and expenses.',
    category: 'finance-calculators',
    keywords: ['cashflow-budget-architect', 'cashflow', 'budget', 'architect']
  },
  {
    slug: 'currency-converter',
    title: 'Currency Converter',
    description: 'Convert major currencies using dated ECB reference exchange rates.',
    category: 'finance-calculators',
    keywords: ['currency-converter', 'currency', 'converter']
  },
  {
    slug: 'fd-calculator',
    title: 'Fixed Deposit Calculator',
    description: 'Calculate fixed deposit maturity and interest online free. Plan your FD investments.',
    category: 'finance-calculators',
    keywords: ['fd-calculator', 'fd', 'fixed deposit', 'calculator']
  },
  {
    slug: 'gst-calculator',
    title: 'GST Calculator',
    description: 'Calculate GST amount and inclusive/exclusive prices online free. Check GST rates and calculations.',
    category: 'finance-calculators',
    keywords: ['gst-calculator', 'gst', 'calculator']
  },
  {
    slug: 'investment-return-profiler',
    title: 'Investment Return Profiler',
    description: 'Calculate investment returns and analyze portfolio performance. Track ROI and CAGR.',
    category: 'finance-calculators',
    keywords: ['investment-return-profiler', 'investment', 'return', 'profiler']
  },
  {
    slug: 'loan-amortization-suite',
    title: 'Loan Amortization Suite',
    description: 'Calculate loan amortization schedules and payments. Plan EMI and repayment.',
    category: 'finance-calculators',
    keywords: ['loan-amortization-suite', 'loan', 'amortization', 'suite']
  },
  {
    slug: 'loan-emi-calculator',
    title: 'Loan EMI Calculator',
    description: 'Calculate loan EMI, interest, and repayment schedule online free. Plan your loan payments.',
    category: 'finance-calculators',
    keywords: ['loan-emi-calculator', 'loan', 'emi', 'calculator']
  },
  {
    slug: 'ppf-calculator',
    title: 'PPF Calculator',
    description: 'Calculate PPF maturity and returns online free. Plan your Public Provident Fund investments.',
    category: 'finance-calculators',
    keywords: ['ppf-calculator', 'ppf', 'calculator']
  },
  {
    slug: 'retirement-calculator',
    title: 'Retirement Calculator',
    description: 'Plan your retirement corpus with inflation-adjusted projections online free. Calculate how much you need to save for retirement.',
    category: 'finance-calculators',
    keywords: ['retirement-calculator', 'retirement', 'calculator']
  },
  {
    slug: 'savings-retirement-hub',
    title: 'Savings Retirement Hub',
    description: 'Plan your savings and retirement online free. Calculate how much you need to save for retirement.',
    category: 'finance-calculators',
    keywords: ['savings-retirement-hub', 'savings', 'retirement', 'hub']
  },
  {
    slug: 'sip-calculator',
    title: 'SIP Calculator',
    description: 'Calculate Systematic Investment Plan (SIP) returns online free. Plan your mutual fund investments with accurate projections.',
    category: 'finance-calculators',
    keywords: ['sip-calculator', 'sip', 'calculator']
  },
  {
    slug: 'tax-calculator',
    title: 'India Income Tax Calculator',
    description: 'Estimate AY 2026–27 income tax under India’s new regime with rebate, marginal relief, and cess.',
    category: 'finance-calculators',
    keywords: ['tax-calculator', 'tax', 'calculator']
  },
  {
    slug: 'taxation-compliance-deck',
    title: 'Taxation Compliance Deck',
    description: 'Calculate tax liability and compliance requirements online free. Plan your tax strategy.',
    category: 'finance-calculators',
    keywords: ['taxation-compliance-deck', 'taxation', 'compliance', 'deck']
  },
  {
    slug: 'wealth-inflation-matrix',
    title: 'Wealth Inflation Matrix',
    description: 'Calculate how inflation erodes your money\'s value over time online free. Understand the impact of inflation on your savings.',
    category: 'finance-calculators',
    keywords: ['wealth-inflation-matrix', 'wealth', 'inflation', 'matrix']
  },

  // ====== HEALTH CALCULATORS ======
  {
    slug: 'bmi-calculator',
    title: 'BMI Calculator',
    description: 'Calculate your Body Mass Index (BMI) online free. Assess your weight status and health risks.',
    category: 'health-calculators',
    keywords: ['bmi-calculator', 'bmi', 'calculator']
  },
  {
    slug: 'bmr-calculator',
    title: 'BMR Calculator',
    description: 'Calculate your Basal Metabolic Rate (BMR) online free. Understand your daily calorie needs at rest.',
    category: 'health-calculators',
    keywords: ['bmr-calculator', 'bmr', 'calculator']
  },
  {
    slug: 'body-fat-calculator',
    title: 'Body Fat Calculator',
    description: 'Calculate your body fat percentage online free. Assess your body composition and fitness level.',
    category: 'health-calculators',
    keywords: ['body-fat-calculator', 'body', 'fat', 'calculator']
  },
  {
    slug: 'calorie-calculator',
    title: 'Calorie Calculator',
    description: 'Calculate your daily calorie needs online free. Plan your diet and nutrition goals.',
    category: 'health-calculators',
    keywords: ['calorie-calculator', 'calorie', 'calculator']
  },
  {
    slug: 'calories-burned-calculator',
    title: 'Calories Burned Calculator',
    description: 'Calculate calories burned during exercise online free. Track your workout calorie expenditure.',
    category: 'health-calculators',
    keywords: ['calories-burned-calculator', 'calories', 'burned', 'calculator']
  },
  {
    slug: 'healthy-weight-calculator',
    title: 'Healthy Weight Calculator',
    description: 'Calculate your healthy weight range online free. Find your ideal weight based on height and age.',
    category: 'health-calculators',
    keywords: ['healthy-weight-calculator', 'healthy', 'weight', 'calculator']
  },
  {
    slug: 'heart-rate-calculator',
    title: 'Heart Rate Calculator',
    description: 'Convert a manual pulse count to BPM and estimate maximum heart rate, reserve, and exercise zones by age.',
    category: 'health-calculators',
    keywords: ['heart rate calculator', 'pulse to bpm', 'beats per minute', 'maximum heart rate', 'exercise zones']
  },
  {
    slug: 'ideal-weight-calculator',
    title: 'Ideal Weight Calculator',
    description: 'Calculate your ideal weight online free. Find your healthy weight range based on height.',
    category: 'health-calculators',
    keywords: ['ideal-weight-calculator', 'ideal', 'weight', 'calculator']
  },
  {
    slug: 'lean-body-mass-calculator',
    title: 'Lean Body Mass Calculator',
    description: 'Calculate your lean body mass online free. Understand your muscle and fat composition.',
    category: 'health-calculators',
    keywords: ['lean-body-mass-calculator', 'lean', 'body', 'mass', 'calculator']
  },
  {
    slug: 'running-calories-calculator',
    title: 'Running Calories Calculator',
    description: 'Calculate calories burned while running online free. Track your running calorie expenditure.',
    category: 'health-calculators',
    keywords: ['running-calories-calculator', 'running', 'calories', 'calculator']
  },
  {
    slug: 'tdee-calculator',
    title: 'TDEE Calculator',
    description: 'Calculate your Total Daily Energy Expenditure (TDEE) online free. Understand your daily calorie needs.',
    category: 'health-calculators',
    keywords: ['tdee-calculator', 'tdee', 'calculator']
  },
  {
    slug: 'waist-to-height-ratio-calculator',
    title: 'Waist to Height Ratio Calculator',
    description: 'Calculate your waist-to-height ratio online free. Assess your health risk with WHtR measurement.',
    category: 'health-calculators',
    keywords: ['waist-to-height-ratio-calculator', 'waist', 'height', 'ratio', 'calculator']
  },
  {
    slug: 'waist-to-hip-ratio-calculator',
    title: 'Waist to Hip Ratio Calculator',
    description: 'Calculate your waist-to-hip ratio online free. Assess body fat distribution and health risks.',
    category: 'health-calculators',
    keywords: ['waist-to-hip-ratio-calculator', 'waist', 'hip', 'ratio', 'calculator']
  },
  {
    slug: 'walking-calories-calculator',
    title: 'Walking Calories Calculator',
    description: 'Calculate calories burned while walking online free. Track your walking exercise calorie expenditure.',
    category: 'health-calculators',
    keywords: ['walking-calories-calculator', 'walking', 'calories', 'calculator']
  },

  // ====== DEVELOPER TOOLS ======
  {
    slug: 'uuid-generator',
    title: 'UUID Generator',
    description: 'Generate UUID v4 and UUID v7 identifiers online. Create single or bulk UUIDs with formatting, casing, copy, TXT and CSV export.',
    category: 'developer-tools',
    keywords: [
      'uuid generator',
      'guid generator',
      'uuid v4 generator',
      'uuid v7 generator',
      'bulk uuid generator',
      'online uuid generator'
    ]
  },
  {
    slug: 'base64-encoder',
    title: 'Base64 Encoder & Decoder',
    description: 'Encode UTF-8 text to Base64 or decode Base64 back to UTF-8 text locally.',
    category: 'developer-tools',
    keywords: [
      'base64 encoder',
      'base64 decoder',
      'base64 encode',
      'base64 decode',
      'base64 encoder decoder',
      'encode text to base64'
    ]
  },
  {
    slug: 'bioluminescent-reader',
    title: 'Bioluminescent Reader',
    description: 'Temporarily unavailable pending a defined scientific schema and validated analysis model.',
    category: 'developer-tools',
    keywords: ['bioluminescent-reader', 'bioluminescent', 'reader']
  },
  {
    slug: 'code-minifier-beautifier',
    title: 'Code Minifier Beautifier',
    description: 'Format and minify JavaScript, CSS, and HTML locally with parser-backed processing engines.',
    category: 'developer-tools',
    keywords: ['code-minifier-beautifier', 'code', 'minifier', 'beautifier']
  },
  {
    slug: 'developer-utilities',
    title: 'Developer Utilities',
    description: 'Compatibility redirect to the Developer Tools category.',
    category: 'developer-tools',
    keywords: ['developer-utilities', 'developer', 'utilities']
  },
  {
    slug: 'developer-utils',
    title: 'Developer Utilities Hub',
    description: 'A browser-based suite for regex testing, Unix timestamp conversion, and CSS gradient building.',
    category: 'developer-tools',
    keywords: ['developer-utils', 'developer', 'utils']
  },
  {
    slug: 'regex-tester',
    title: 'Regex Tester',
    description: 'Test JavaScript regular expressions, flags, and matches locally in your browser.',
    category: 'developer-tools',
    keywords: ['regex tester', 'regular expression tester', 'javascript regex']
  },
  {
    slug: 'unix-timestamp-converter',
    title: 'Unix Timestamp Converter',
    description: 'Convert Unix seconds or milliseconds to a local date and time in your browser.',
    category: 'developer-tools',
    keywords: ['unix timestamp converter', 'epoch converter', 'timestamp to date']
  },
  {
    slug: 'css-gradient-generator',
    title: 'CSS Gradient Generator',
    description: 'Build a two-color linear gradient and copy the generated CSS declaration.',
    category: 'developer-tools',
    keywords: ['css gradient generator', 'linear gradient generator', 'gradient css']
  },
  {
    slug: 'jwt-decoder',
    title: 'JWT Decoder',
    description: 'Decode JWT header and payload JSON locally without verifying the token signature.',
    category: 'developer-tools',
    keywords: [
      'jwt decoder',
      'decode jwt',
      'jwt token decoder',
      'jwt decoder online',
      'decode jwt token',
      'jwt payload decoder'
    ]
  },
  {
    slug: 'markup-formatter',
    title: 'Markup Formatter',
    description: 'Format and validate SQL, XML, and YAML locally with grammar-aware processing engines.',
    category: 'developer-tools',
    keywords: ['markup-formatter', 'markup', 'formatter']
  },
  {
    slug: 'qr-code-generator',
    title: 'QR Code Generator',
    description: 'Generate colored QR codes or decode a QR code from an uploaded image locally.',
    category: 'developer-tools',
    keywords: [
      'qr code generator',
      'qr code generator online',
      'free qr code generator',
      'create qr code',
      'qr code maker',
      'qr code decoder'
    ]
  },
  {
    slug: 'json-formatter',
    title: 'JSON Formatter',
    description: 'View, edit, and format JSON data online free. Parse and validate JSON with powerful editing tools.',
    category: 'developer-tools',
    keywords: [
      'json formatter',
      'json formatter online',
      'json beautifier',
      'json validator',
      'json minifier',
      'format json',
      'pretty print json'
    ]
  },
  {
    slug: 'web-crypto-studio',
    title: 'Web Crypto Studio',
    description: 'Generate SHA-256 hashes, cryptographic random passwords, and UUID v4 identifiers locally.',
    category: 'developer-tools',
    keywords: ['web-crypto-studio', 'web', 'crypto', 'studio']
  },
  {
    slug: 'webmaster-seo-builder',
    title: 'Webmaster SEO Tools',
    description: 'Explore browser-based SEO utilities for campaign URLs, page metadata, and crawler directives.',
    category: 'developer-tools',
    keywords: ['webmaster SEO tools', 'SEO utilities', 'webmaster tools']
  },
  {
    slug: 'utm-builder',
    title: 'UTM Builder',
    description: 'Add campaign source, medium, and name parameters to a valid URL.',
    category: 'developer-tools',
    keywords: ['utm builder', 'utm link generator', 'campaign url builder']
  },
  {
    slug: 'meta-tag-generator',
    title: 'Meta Tag Generator',
    description: 'Generate basic HTML, Open Graph, and Twitter card metadata locally.',
    category: 'developer-tools',
    keywords: ['meta tag generator', 'open graph generator', 'twitter card generator']
  },
  {
    slug: 'robots-txt-generator',
    title: 'Robots.txt Generator',
    description: 'Generate a simple robots.txt block for one user-agent and disallow path.',
    category: 'developer-tools',
    keywords: ['robots txt generator', 'robots.txt builder', 'crawler directive generator']
  },

  {
    slug: 'cidr-subnet-wildcard-calculator',
    title: 'CIDR, Subnet & Wildcard Mask Calculator',
    description: 'Convert IPv4 CIDR notation into subnet masks, Cisco wildcard masks, network and broadcast addresses, host ranges and address counts.',
    category: 'developer-tools',
    keywords: [
      'cidr calculator',
      'subnet calculator',
      'wildcard mask calculator',
      'cisco wildcard mask',
      'ipv4 subnet calculator'
    ],
    heroTitle: 'CIDR, Subnet & Wildcard Mask Calculator',
    heroDescription: 'Calculate subnet masks, wildcard masks, IPv4 ranges and usable hosts instantly.'
  },
  {
    slug: 'csv-to-json-converter', title: 'CSV to JSON Converter',
    description: 'Convert properly quoted CSV into formatted JSON with delimiter controls, header handling, type inference, preview and download.',
    category: 'developer-tools', keywords: ['csv to json converter', 'convert csv to json', 'csv parser', 'csv json download'],
    heroTitle: 'CSV to JSON Converter', heroDescription: 'Parse CSV safely and turn rows into clean, downloadable JSON.'
  },
  { slug:'ip-range-calculator',title:'IP Range Calculator',description:'Calculate IPv4 range size, boundaries, smallest containing CIDR and an exact CIDR block decomposition.',category:'developer-tools',keywords:['ip range calculator','ipv4 range to cidr','address range size'],heroTitle:'IP Range Calculator',heroDescription:'Analyze an IPv4 start and end range and copy exact CIDR blocks.' },
  { slug:'vlsm-subnet-calculator',title:'VLSM Subnet Calculator',description:'Allocate non-overlapping variable-length IPv4 subnets largest-first from usable-host requirements.',category:'developer-tools',keywords:['vlsm calculator','variable length subnet calculator','subnet allocation'],heroTitle:'VLSM Subnet Calculator',heroDescription:'Plan largest-first IPv4 subnet allocations inside a parent CIDR.' },
  { slug:'mac-address-generator',title:'MAC Address Generator',description:'Generate random unicast MAC addresses using Web Crypto with local-bit, case and separator controls.',category:'developer-tools',keywords:['mac address generator','random mac generator','locally administered mac'],heroTitle:'MAC Address Generator',heroDescription:'Generate formatted random unicast MAC addresses for testing.' },
  { slug:'cron-next-run-calculator',title:'Cron Next Run Calculator',description:'Validate standard five-field cron expressions and calculate upcoming runs in common IANA time zones.',category:'developer-tools',keywords:['cron next run calculator','cron schedule preview','next cron time'],heroTitle:'Cron Next Run Calculator',heroDescription:'Preview the next five or ten standard cron run times.' },
  { slug:'http-status-code-lookup',title:'HTTP Status Code Lookup',description:'Search common standardized HTTP status codes by number, phrase, class, meaning, use and caveat.',category:'developer-tools',keywords:['http status code lookup','http response codes','status code meaning'],heroTitle:'HTTP Status Code Lookup',heroDescription:'Search a curated reference of common standardized HTTP codes.' },
  {
    slug: 'json-diff-compare', title: 'JSON Diff & Compare Tool',
    description: 'Structurally compare two JSON documents and find added, removed, changed and unchanged values at nested paths.',
    category: 'developer-tools', keywords: ['json diff', 'json compare', 'compare json online', 'nested json difference'],
    heroTitle: 'JSON Diff & Compare Tool', heroDescription: 'Compare nested JSON structures with readable paths and change summaries.'
  },
  {
    slug: 'url-encoder-decoder', title: 'URL Encoder & Decoder',
    description: 'Encode and decode URLs or URL components locally with copy, swap, clear and malformed-input handling.',
    category: 'developer-tools', keywords: ['url encoder', 'url decoder', 'percent encoding', 'encodeURIComponent tool'],
    heroTitle: 'URL Encoder & Decoder', heroDescription: 'Encode or decode URLs and individual URL components safely.'
  },
  {
    slug: 'html-entity-encoder-decoder', title: 'HTML Entity Encoder & Decoder',
    description: 'Encode reserved HTML characters and decode named or numeric HTML entities safely as plain text.',
    category: 'developer-tools', keywords: ['html entity encoder', 'html entity decoder', 'escape html', 'decode numeric entities'],
    heroTitle: 'HTML Entity Encoder & Decoder', heroDescription: 'Escape HTML characters or decode entities without rendering markup.'
  },
  {
    slug: 'json-schema-validator', title: 'JSON Schema Validator',
    description: 'Validate JSON data against a documented browser-based JSON Schema subset with readable error paths.',
    category: 'developer-tools', keywords: ['json schema validator', 'validate json schema', 'json validation errors', 'json schema checker'],
    heroTitle: 'JSON Schema Validator', heroDescription: 'Check JSON data against common schema keywords and readable paths.'
  },
  {
    slug: 'json-to-csv-flattener',
    title: 'JSON to CSV Converter & Nested JSON Flattener',
    description: 'Convert nested JSON into CSV, flatten object keys into columns, preview the result and download CSV locally in your browser.',
    category: 'developer-tools',
    keywords: [
      'json to csv',
      'json to csv converter',
      'flatten json',
      'nested json to csv',
      'json csv converter'
    ],
    heroTitle: 'JSON to CSV & Nested JSON Flattener',
    heroDescription: 'Flatten nested JSON into clean CSV columns and download the result locally.'
  },
  {
    slug: 'aws-glacier-retrieval-calculator',
    title: 'AWS S3 Glacier Retrieval Cost Calculator',
    description: 'Estimate S3 Glacier Flexible Retrieval and Deep Archive restore costs using current regional retrieval, request and temporary-storage rates.',
    category: 'developer-tools',
    keywords: [
      'aws glacier cost calculator',
      'glacier retrieval cost calculator',
      'deep archive retrieval cost',
      's3 glacier calculator',
      'aws restore cost'
    ],
    heroTitle: 'AWS S3 Glacier Retrieval Cost Calculator',
    heroDescription: 'Estimate archive retrieval, request and temporary restored-copy costs using your current AWS regional rates.'
  },

  // ====== CONSTRUCTION CALCULATORS ======
  {slug:'roof-pitch-calculator',title:'Roof Pitch Calculator',description:'Convert rise and run into X:12 pitch, angle, slope percentage, rafter multiplier and optional rafter length.',category:'construction-calculators',keywords:['roof pitch calculator','roof angle calculator','rafter multiplier'],heroTitle:'Roof Pitch Calculator',heroDescription:'Convert roof rise and run into useful slope and rafter geometry.'},
  {slug:'stair-stringer-calculator',title:'Stair & Stringer Calculator',description:'Calculate risers, actual riser height, treads, total run, stringer length and stair angle.',category:'construction-calculators',keywords:['stair calculator','stringer length calculator','riser tread calculator'],heroTitle:'Stair & Stringer Calculator',heroDescription:'Plan consistent stair risers, treads, run and stringer geometry.'},
  {slug:'deck-board-calculator',title:'Deck Board Calculator',description:'Estimate deck board rows, pieces, linear feet and waste using actual width, gap, length and orientation.',category:'construction-calculators',keywords:['deck board calculator','decking quantity calculator','deck board spacing'],heroTitle:'Deck Board Calculator',heroDescription:'Estimate deck boards with actual width, gaps, stock length and waste.'},
  {slug:'fence-calculator',title:'Fence Calculator',description:'Estimate fence panels, sections, line posts, corner and gate posts, rails and waste.',category:'construction-calculators',keywords:['fence calculator','fence panel calculator','fence post spacing calculator'],heroTitle:'Fence Calculator',heroDescription:'Plan fence sections, panels, posts, gates and rails.'},
  {slug:'post-hole-concrete-calculator',title:'Post Hole Concrete Calculator',description:'Calculate concrete volume after round or rectangular post displacement and estimate bags from entered yield.',category:'construction-calculators',keywords:['post hole concrete calculator','fence post concrete bags','concrete displacement'],heroTitle:'Post Hole Concrete Calculator',heroDescription:'Estimate net post-hole concrete volume and bag quantity.'},
  {slug:'drywall-calculator',title:'Drywall Calculator',description:'Estimate drywall sheets, waste, screws, tape and compound from wall, ceiling and opening areas.',category:'construction-calculators',keywords:['drywall calculator','sheetrock sheet calculator','drywall material estimate'],heroTitle:'Drywall Calculator',heroDescription:'Estimate sheets and planning allowances for drywall materials.'},
  {slug:'paver-calculator',title:'Paver Calculator',description:'Calculate rectangular paver count, waste-adjusted quantity and optional pallets from project area.',category:'construction-calculators',keywords:['paver calculator','patio paver quantity','pavers per square foot'],heroTitle:'Paver Calculator',heroDescription:'Convert project and paver dimensions into quantities and pallets.'},
  {slug:'polymeric-sand-calculator',title:'Polymeric Sand Calculator',description:'Estimate paver joint volume, polymeric sand weight and bags with editable density and waste.',category:'construction-calculators',keywords:['polymeric sand calculator','paver joint sand calculator','polymeric sand bags'],heroTitle:'Polymeric Sand Calculator',heroDescription:'Estimate sand volume, weight and bags for paver joints.'},
  {slug:'mulch-calculator',title:'Mulch Calculator',description:'Calculate mulch volume in cubic feet, cubic yards and liters plus bags from bed area and depth.',category:'construction-calculators',keywords:['mulch calculator','cubic yards of mulch','mulch bag calculator'],heroTitle:'Mulch Calculator',heroDescription:'Estimate mulch volume and bags for landscape beds.'},
  {slug:'topsoil-calculator',title:'Topsoil Calculator',description:'Calculate topsoil cubic feet, yards, meters and optional tonnage from area, depth and editable density.',category:'construction-calculators',keywords:['topsoil calculator','yards of topsoil','soil tonnage calculator'],heroTitle:'Topsoil Calculator',heroDescription:'Estimate topsoil volume and density-based weight.'},
  {
    slug: 'air-compressor-cfm-calculator',
    title: 'Air Compressor CFM & Tank Runtime Calculator',
    description: 'Compare compressor SCFM with air tool demand, duty cycle and tank capacity to estimate whether your compressor can keep up.',
    category: 'construction-calculators',
    keywords: [
      'air compressor cfm calculator',
      'compressor size calculator',
      'air tool cfm calculator',
      'compressor tank runtime calculator',
      'compressor duty cycle calculator',
      'what size air compressor do i need'
    ],
    heroTitle: 'Air Compressor CFM & Tank Runtime Calculator',
    heroDescription: 'Compare compressor output with air tool demand and estimate whether your compressor can keep up.'
  },
  {
    slug: 'ladder-safe-reach-calculator',
    title: 'Ladder Safe Reach & 4:1 Calculator',
    description: 'Estimate extension ladder base distance, setup angle, vertical height and approximate working reach using 4:1 geometry.',
    category: 'construction-calculators',
    keywords: [
      'ladder height calculator',
      'ladder reach calculator',
      'ladder 4 to 1 calculator',
      'ladder angle calculator',
      'ladder distance from wall',
      'extension ladder calculator'
    ],
    heroTitle: 'Ladder Safe Reach & 4:1 Calculator',
    heroDescription: 'Estimate ladder base distance, angle, vertical height and approximate reach.'
  },
  {
    slug: 'saw-kerf-calculator',
    title: 'Saw Kerf & Board Width Calculator',
    description: 'Calculate how many equal-width pieces can be cut from a board after accounting for saw kerf, cut loss and remaining offcut.',
    category: 'construction-calculators',
    keywords: [
      'saw kerf calculator',
      'kerf calculator',
      'board width calculator',
      'wood cutting calculator',
      'saw blade kerf calculator',
      'rip cut calculator'
    ],
    heroTitle: 'Saw Kerf & Board Width Calculator',
    heroDescription: 'Calculate board yield, saw kerf loss, number of pieces and remaining offcut.'
  },
  {
    slug: 'osha-portable-toilet-calculator',
    title: 'OSHA Portable Toilet Calculator',
    description: 'Calculate construction-jobsite toilet fixture minimums from workforce size using OSHA 29 CFR 1926.51(c)(1), Table D-1.',
    category: 'construction-calculators',
    keywords: [
      'osha portable toilet calculator',
      'osha toilet requirements construction',
      'portable toilets per worker',
      'construction toilet ratio',
      'osha porta potty requirements'
    ],
    heroTitle: 'OSHA Portable Toilet Calculator',
    heroDescription: 'Calculate OSHA construction-jobsite sanitation fixture minimums from workforce size.'
  },
  {
    slug: 'egress-window-code-checker',
    title: 'Egress Window Code Checker',
    description: 'Check net clear window opening width, height, area and sill height against commonly referenced IRC emergency escape and rescue opening dimensions.',
    category: 'construction-calculators',
    keywords: [
      'egress window calculator',
      'egress window code checker',
      'egress window requirements',
      'basement egress window calculator',
      'egress window size calculator',
      'legal bedroom egress window'
    ],
    heroTitle: 'Egress Window Code Checker',
    heroDescription: 'Check window clear opening dimensions against commonly referenced IRC egress criteria.'
  },
  {
    slug: 'dumpster-weight-calculator',
    title: 'Dumpster Weight Calculator – Estimate Tonnage & Overage Fees',
    description: 'Estimate dumpster debris weight, included tonnage, excess weight and potential overage fees for concrete, drywall, shingles, lumber and mixed construction debris.',
    category: 'construction-calculators',
    keywords: ['dumpster weight calculator', 'dumpster tonnage calculator', 'dumpster overage calculator', 'construction debris weight calculator', 'dumpster weight allowance'],
    heroTitle: 'Dumpster Weight & Overage Fee Calculator',
    heroDescription: 'Estimate debris tonnage, compare it with the included weight allowance, and calculate potential dumpster overage fees.'
  },
  {
    slug: 'asphalt-calculator',
    title: 'Asphalt Calculator',
    description: 'Calculate asphalt quantity for driveways, roads, and parking lots.',
    category: 'construction-calculators',
    keywords: ['asphalt', 'driveway', 'paving', 'road', 'parking lot', 'tons'],
    heroTitle: 'Asphalt Calculator',
    heroDescription: 'Calculate asphalt volume and weight for paving projects.'
  },
  {
    slug: 'brick-calculator',
    title: 'Brick Calculator',
    description: 'Calculate number of bricks required for your construction project.',
    category: 'construction-calculators',
    keywords: ['brick', 'construction', 'wall', 'building', 'mortar'],
    heroTitle: 'Brick Calculator',
    heroDescription: 'Calculate how many bricks you need for your wall or building project.'
  },
  {
    slug: 'cement-calculator',
    title: 'Cement Calculator',
    description: 'Calculate cement bags required for your construction project.',
    category: 'construction-calculators',
    keywords: ['cement', 'bags', 'concrete mix', 'construction material'],
    heroTitle: 'Cement Calculator',
    heroDescription: 'Calculate the exact number of cement bags needed for your concrete work.'
  },
  {
    slug: 'concrete-calculator',
    title: 'Concrete Calculator',
    description: 'Calculate concrete volume and mix ratio for slabs, footings, and columns.',
    category: 'construction-calculators',
    keywords: ['concrete', 'volume', 'slab', 'footing', 'column', 'mix'],
    heroTitle: 'Concrete Calculator',
    heroDescription: 'Calculate concrete volume and materials for your construction project.'
  },
  {
    slug: 'construction-cost-calculator',
    title: 'Construction Cost Calculator',
    description: 'Calculate building costs per square foot for residential construction.',
    category: 'construction-calculators',
    keywords: ['construction', 'cost', 'building', 'house', 'per square foot'],
    heroTitle: 'Construction Cost Calculator',
    heroDescription: 'Plan your building budget with accurate cost estimation.'
  },
  {
    slug: 'excavation-calculator',
    title: 'Excavation Calculator',
    description: 'Calculate soil excavation volume for foundations and basements.',
    category: 'construction-calculators',
    keywords: ['excavation', 'soil', 'foundation', 'basement', 'truck loads'],
    heroTitle: 'Excavation Calculator',
    heroDescription: 'Estimate excavation volume, weight, and truck loads for your project.'
  },
  {
    slug: 'flooring-calculator',
    title: 'Flooring Calculator',
    description: 'Calculate flooring materials including hardwood, laminate, and vinyl.',
    category: 'construction-calculators',
    keywords: ['flooring', 'hardwood', 'laminate', 'vinyl', 'carpet', 'installation'],
    heroTitle: 'Flooring Calculator',
    heroDescription: 'Calculate material and labor costs for different flooring types.'
  },
  {
    slug: 'gravel-calculator',
    title: 'Gravel Calculator',
    description: 'Calculate gravel volume for driveways, pathways, and drainage.',
    category: 'construction-calculators',
    keywords: ['gravel', 'driveway', 'pathway', 'drainage', 'stones', 'aggregate'],
    heroTitle: 'Gravel Calculator',
    heroDescription: 'Estimate gravel volume and weight for landscaping and construction.'
  },
  {
    slug: 'house-construction-cost-calculator',
    title: 'House Construction Cost Calculator',
    description: 'Calculate building costs per square foot for residential construction.',
    category: 'construction-calculators',
    keywords: ['house cost', 'home building', 'residential construction', 'cost per sqft'],
    heroTitle: 'House Construction Cost Calculator',
    heroDescription: 'Plan your home building budget with accurate per-square-foot cost estimation.'
  },
  {
    slug: 'land-area-converter',
    title: 'Land Area Converter',
    description: 'Convert between different land measurement units and area formats.',
    category: 'construction-calculators',
    keywords: ['land', 'area', 'converter', 'acre', 'hectare', 'square feet', 'square meters'],
    heroTitle: 'Land Area Converter',
    heroDescription: 'Quickly convert between different land measurement units with ease.'
  },
  {
    slug: 'paint-calculator',
    title: 'Paint Calculator',
    description: 'Calculate paint quantity needed for walls, ceilings, and surfaces.',
    category: 'construction-calculators',
    keywords: ['paint', 'painting', 'walls', 'ceiling', 'coverage', 'liters'],
    heroTitle: 'Paint Calculator',
    heroDescription: 'Calculate exactly how much paint you need for your room with wastage included.'
  },
  {
    slug: 'rebar-calculator',
    title: 'Rebar Calculator',
    description: 'Calculate rebar weight and quantity for concrete reinforcement.',
    category: 'construction-calculators',
    keywords: ['rebar', 'steel', 'reinforcement', 'concrete', 'weight'],
    heroTitle: 'Rebar Calculator',
    heroDescription: 'Calculate rebar weight and quantity for your concrete reinforcement.'
  },
  {
    slug: 'roof-area-calculator',
    title: 'Roof Area Calculator',
    description: 'Calculate roof area, slope, and materials needed for roofing.',
    category: 'construction-calculators',
    keywords: ['roof', 'roofing', 'shingles', 'pitch', 'slope', 'area'],
    heroTitle: 'Roof Area Calculator',
    heroDescription: 'Calculate roof area including pitch and overhang for accurate material estimation.'
  },
  {
    slug: 'sand-calculator',
    title: 'Sand Calculator',
    description: 'Calculate sand volume and weight for construction projects.',
    category: 'construction-calculators',
    keywords: ['sand', 'volume', 'weight', 'construction', 'building'],
    heroTitle: 'Sand Calculator',
    heroDescription: 'Estimate sand volume and weight for your construction project.'
  },
  {
    slug: 'solar-panel-calculator',
    title: 'Solar Panel Calculator',
    description: 'Calculate solar panel requirements for your energy needs.',
    category: 'construction-calculators',
    keywords: ['solar', 'panels', 'energy', 'electricity', 'renewable', 'solar system'],
    heroTitle: 'Solar Panel Calculator',
    heroDescription: 'Calculate how many solar panels you need for your home or business.'
  },
  {
    slug: 'steel-weight-calculator',
    title: 'Steel Weight Calculator',
    description: 'Calculate weight of steel bars, beams, and structural steel.',
    category: 'construction-calculators',
    keywords: ['steel', 'weight', 'bars', 'beams', 'structural steel'],
    heroTitle: 'Steel Weight Calculator',
    heroDescription: 'Calculate steel weight for bars, beams, and structural steel.'
  },
  {
    slug: 'tile-calculator',
    title: 'Tile Calculator',
    description: 'Calculate number of tiles required for floors and walls.',
    category: 'construction-calculators',
    keywords: ['tiles', 'flooring', 'wall tiles', 'ceramic', 'porcelain', 'grout'],
    heroTitle: 'Tile Calculator',
    heroDescription: 'Estimate the exact number of tiles needed for your floor or wall project.'
  },
  {
    slug: 'voltage-drop-calculator',
    title: 'Voltage Drop Calculator',
    description: 'Calculate voltage drop in electrical circuits and wiring.',
    category: 'construction-calculators',
    keywords: ['voltage drop', 'electrical', 'circuit', 'wiring', 'copper', 'aluminum'],
    heroTitle: 'Voltage Drop Calculator',
    heroDescription: 'Calculate voltage drop in electrical circuits to ensure proper system design.'
  },
  {
    slug: 'water-tank-calculator',
    title: 'Water Tank Calculator',
    description: 'Calculate water tank capacity and dimensions for storage.',
    category: 'construction-calculators',
    keywords: ['water tank', 'storage', 'capacity', 'liters', 'gallons', 'dimensions'],
    heroTitle: 'Water Tank Calculator',
    heroDescription: 'Calculate water tank capacity and dimensions for your storage needs.'
  },
  {
    slug: 'wire-size-calculator',
    title: 'Wire Size Calculator',
    description: 'Calculate appropriate wire gauge for electrical systems.',
    category: 'construction-calculators',
    keywords: ['wire', 'gauge', 'electrical', 'AWG', 'circuit', 'ampacity'],
    heroTitle: 'Wire Size Calculator',
    heroDescription: 'Find the correct wire gauge size for your electrical project based on load and distance.'
  },
  {
    slug: 'aspect-ratio-padding-calculator',
    title: 'Aspect Ratio Padding Calculator',
    description: 'Calculate CSS aspect ratios, responsive padding percentages, and copy-ready aspect-ratio code.',
    category: 'developer-tools',
    keywords: ['aspect ratio calculator', 'aspect ratio padding', 'css aspect ratio', 'padding percentage calculator', 'responsive aspect ratio'],
    heroTitle: 'Aspect Ratio Padding Calculator',
    heroDescription: 'Calculate responsive CSS padding percentages and modern aspect-ratio values from any width and height.'
  },

  {
    slug: 'cron-expression-humanizer',
    title: 'Cron Expression Humanizer',
    description: 'Validate cron expressions, translate schedules into plain English, and preview upcoming run times.',
    category: 'developer-tools',
    keywords: ['cron expression humanizer', 'cron calculator', 'cron parser', 'cron schedule', 'cron expression generator'],
    heroTitle: 'Cron Expression Humanizer',
    heroDescription: 'Understand standard cron expressions in plain English and preview the next scheduled run times.'
  },
  {
    slug: 'css-clamp-font-generator',
    title: 'CSS clamp() Font Size Generator',
    description: 'Generate responsive fluid typography with CSS clamp() from minimum and maximum font sizes and viewport widths.',
    category: 'developer-tools',
    keywords: ['css clamp generator', 'clamp calculator', 'fluid typography calculator', 'responsive font size', 'css clamp font size'],
    heroTitle: 'CSS clamp() Font Size Generator',
    heroDescription: 'Generate copy-ready CSS clamp() values for fluid responsive typography.'
  },
  {
    slug: 'fuel-cost-split-calculator',
    title: 'Fuel Cost & Passenger Split Calculator',
    description: 'Calculate trip fuel consumption, fuel cost, total travel expenses, and an equal cost per passenger.',
    category: 'everyday-calculators',
    keywords: ['fuel cost calculator', 'trip cost calculator', 'fuel split calculator', 'petrol cost calculator', 'gas cost per person', 'road trip cost'],
    heroTitle: 'Fuel Cost & Passenger Split Calculator',
    heroDescription: 'Estimate fuel needed, total journey cost, and how much each passenger should pay.'
  },
  {
    slug: 'barbell-plate-calculator',
    title: 'Barbell Plate Calculator',
    description: 'Calculate which weight plates to load on each side of a barbell for any target weight.',
    category: 'everyday-calculators',
    keywords: ['barbell plate calculator', 'plate calculator', 'weight plates per side', 'barbell loading calculator', 'gym plate calculator'],
    heroTitle: 'Barbell Plate Calculator',
    heroDescription: 'Find the exact weight plates to load on each side of your barbell in kilograms or pounds.'
  },
  {
    slug: 'aquarium-volume-calculator',
    title: 'Aquarium Volume Calculator',
    description: 'Calculate fish tank capacity and estimated actual water volume in litres, gallons, and cubic feet.',
    category: 'everyday-calculators',
    keywords: ['aquarium volume calculator', 'fish tank volume', 'aquarium gallons calculator', 'tank litres calculator', 'fish tank capacity'],
    heroTitle: 'Aquarium Volume Calculator',
    heroDescription: 'Calculate aquarium capacity and estimated actual water volume from your tank dimensions.'
  },
  {
    slug: 'wallpaper-calculator',
    title: 'Wallpaper Calculator',
    description: 'Estimate how many wallpaper rolls you need from room dimensions, roll size, openings, and waste allowance.',
    category: 'construction-calculators',
    keywords: ['wallpaper calculator', 'wallpaper rolls calculator', 'wall coverage calculator', 'wallpaper estimate'],
    heroTitle: 'Wallpaper Calculator',
    heroDescription: 'Calculate how many wallpaper rolls you need for your room or wall project.'
  },
  {
    slug: 'electricity-cost-calculator',
    title: 'Electricity Cost Calculator',
    description: 'Estimate appliance energy consumption and electricity running cost from watts, usage time, and tariff.',
    category: 'everyday-calculators',
    keywords: ['electricity cost calculator', 'appliance electricity cost', 'kwh calculator', 'energy cost calculator'],
    heroTitle: 'Electricity Cost Calculator',
    heroDescription: 'Calculate appliance electricity consumption and estimated running cost.'
  },
  {
    slug: 'unit-price-calculator',
    title: 'Unit Price Calculator',
    description: 'Compare products by unit price and find which package offers better value.',
    category: 'everyday-calculators',
    keywords: ['unit price calculator', 'price per unit calculator', 'compare package prices', 'best value calculator'],
    heroTitle: 'Unit Price Calculator',
    heroDescription: 'Compare two products by price per unit and instantly identify the better value.'
  },
  {
    slug: 'board-foot-calculator',
    title: 'Board Foot Calculator',
    description: 'Calculate lumber board feet from thickness, width, length, quantity, and optional price per board foot.',
    category: 'construction-calculators',
    keywords: ['board foot calculator', 'board feet calculator', 'lumber calculator', 'calculate board feet', 'lumber cost calculator'],
    heroTitle: 'Board Foot Calculator',
    heroDescription: 'Calculate board feet and estimated lumber cost from board dimensions and quantity.'
  },
  {
    slug: 'tire-size-calculator',
    title: 'Tire Size Calculator',
    description: 'Compare tire sizes, diameter, circumference, sidewall height, revolutions, clearance and speedometer difference.',
    category: 'everyday-calculators',
    keywords: ['tire size calculator', 'tyre size calculator', 'tire comparison calculator', 'speedometer error calculator', 'tire diameter calculator'],
    heroTitle: 'Tire Size Calculator',
    heroDescription: 'Compare original and replacement tire dimensions and calculate speedometer and clearance differences.'
  },
  {
    slug: 'dimensional-weight-calculator',
    title: 'Dimensional Weight Calculator',
    description: 'Calculate dimensional or volumetric shipping weight and compare it with actual package weight.',
    category: 'everyday-calculators',
    keywords: ['dimensional weight calculator', 'dim weight calculator', 'volumetric weight calculator', 'shipping weight calculator', 'package dimensional weight'],
    heroTitle: 'Dimensional Weight Calculator',
    heroDescription: 'Calculate dimensional shipping weight and identify the estimated billable package weight.'
  },
  {
    slug: 'construction-estimate-builder',
    title: 'Construction Estimate Builder',
    description: 'Build a detailed construction estimate with materials, labor, equipment, subcontractors, overhead, contingency, markup, tax, and downloadable PDF/JPG output.',
    category: 'construction-calculators',
    keywords: [
      'construction estimate template',
      'construction estimate builder',
      'construction estimator',
      'construction cost estimate',
      'free construction estimate template',
      'construction estimate generator'
    ],
    heroTitle: 'Construction Estimate Builder',
    heroDescription: 'Create a detailed construction estimate with line items, overhead, contingency, markup, tax, and downloadable output.'
  },
  {
    slug: 'contractor-estimate-generator',
    title: 'Contractor Estimate Generator',
    description: 'Create a professional contractor estimate with customer details, itemized costs, markup, tax, notes, and downloadable PDF/JPG output.',
    category: 'construction-calculators',
    keywords: [
      'contractor estimate template',
      'general contractor estimate template',
      'contractor estimate generator',
      'free contractor estimate',
      'construction quote template',
      'contractor quote generator'
    ],
    heroTitle: 'Contractor Estimate Generator',
    heroDescription: 'Generate a professional contractor estimate with customer details, line items, totals, terms, and downloadable output.'
  }
] satisfies Tool[]).map((tool) => ({
  ...tool,
  heroTitle: tool.heroTitle?.trim() || tool.title,
  heroDescription: tool.heroDescription?.trim() || tool.description,
}));
