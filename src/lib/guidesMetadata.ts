type GuideCategory = 'Finance' | 'Health' | 'PDF' | 'Image' | 'Developer' | 'Construction' | 'Everyday';

interface GuideDefinition {
  slug: string;
  title: string;
  description: string;
  category: GuideCategory;
  publishedDate: string;
  readTime: string;
  author: string;
}

export interface GuideMetadata extends GuideDefinition {
  datePublished: string;
  dateModified: string;
  keywords: string[];
  featuredImage: {
    src: string;
    width: 1200;
    height: 630;
    alt: string;
    caption: string;
  };
}

const categoryImages: Record<GuideCategory, { src: string; caption: string }> = {
  Finance: { src: '/images/guides/finance-guides.webp', caption: 'Planning, calculation, and long-term financial decision-making.' },
  Health: { src: '/images/guides/health-guides.webp', caption: 'Health measurements are screening and planning aids, not medical diagnoses.' },
  PDF: { src: '/images/guides/pdf-guides.webp', caption: 'Organize and process documents with privacy-conscious browser tools.' },
  Image: { src: '/images/guides/image-guides.webp', caption: 'Choose image dimensions, formats, and compression for the intended output.' },
  Developer: { src: '/images/guides/developer-guides.webp', caption: 'Understand web data and technical workflows before applying automation.' },
  Construction: { src: '/images/guides/developer-guides.webp', caption: 'Measure carefully, state assumptions, and verify planning quantities against site conditions and supplier specifications.' },
  Everyday: { src: '/images/guides/finance-guides.webp', caption: 'Make everyday cost and shipping estimates from transparent inputs and unit conversions.' },
};

const guideDefinitions: GuideDefinition[] = [
  {
    slug: 'how-to-calculate-sip-returns',
    title: 'How to Calculate SIP Returns: A Complete Guide',
    description: 'Learn how to calculate SIP returns with step-by-step examples. Understand CAGR, XIRR, and future value of your mutual fund investments.',
    category: 'Finance',
    publishedDate: 'August 2026',
    readTime: '8 min read',
    author: 'Navorika Team'
  },
  {
    slug: 'how-to-calculate-emi',
    title: 'EMI Calculation Guide: Formula, Examples & Tips',
    description: 'Understand how EMI is calculated for home, car, and personal loans. Learn the formula and factors that affect your monthly payments.',
    category: 'Finance',
    publishedDate: 'August 2026',
    readTime: '6 min read',
    author: 'Navorika Team'
  },
  {
    slug: 'bmi-calculator-guide',
    title: 'BMI Calculator Guide: Understanding Your Body Mass Index',
    description: 'Learn how to interpret your BMI results, understand health categories, and use BMI for weight management.',
    category: 'Health',
    publishedDate: 'August 2026',
    readTime: '7 min read',
    author: 'Navorika Team'
  },
  {
    slug: 'bmr-tdee-guide',
    title: 'BMR & TDEE Guide: Calculate Your Daily Calorie Needs',
    description: 'Understand your Basal Metabolic Rate and Total Daily Energy Expenditure. Learn how to use these metrics for weight management.',
    category: 'Health',
    publishedDate: 'August 2026',
    readTime: '8 min read',
    author: 'Navorika Team'
  },
  {
    slug: 'pdf-compression-guide',
    title: 'PDF Compression Guide: Reduce File Size Without Losing Quality',
    description: 'Learn how to compress PDF files effectively. Understand compression methods, quality trade-offs, and best practices.',
    category: 'PDF',
    publishedDate: 'August 2026',
    readTime: '6 min read',
    author: 'Navorika Team'
  },
  {
    slug: 'how-to-merge-pdf-files',
    title: 'How to Merge PDF Files: Complete Guide',
    description: 'Learn different methods to merge PDF files. Combine multiple documents into one PDF easily and efficiently.',
    category: 'PDF',
    publishedDate: 'August 2026',
    readTime: '5 min read',
    author: 'Navorika Team'
  },
  {
    slug: 'image-compression-guide',
    title: 'Image Compression Guide: Optimize Images for Web',
    description: 'Learn how to compress images for faster loading times. Understand lossy vs lossless compression and best practices.',
    category: 'Image',
    publishedDate: 'August 2026',
    readTime: '7 min read',
    author: 'Navorika Team'
  },
  {
    slug: 'how-to-resize-images',
    title: 'How to Resize Images: Complete Guide for Web & Print',
    description: 'Learn how to resize images for different use cases. Understand resolution, aspect ratio, and quality considerations.',
    category: 'Image',
    publishedDate: 'August 2026',
    readTime: '6 min read',
    author: 'Navorika Team'
  },
  {
    slug: 'gst-calculation-guide',
    title: 'GST Calculation Guide: How to Calculate GST in India',
    description: 'Learn how to calculate GST for your business. Understand GST rates, types, and how to compute tax on goods and services.',
    category: 'Finance',
    publishedDate: 'August 2026',
    readTime: '9 min read',
    author: 'Navorika Team'
  },
  {
    slug: 'pdf-security-guide',
    title: 'PDF Security Guide: How to Protect Your Documents',
    description: 'Learn how to secure your PDF files with passwords, encryption, and permissions. Keep your documents safe from unauthorized access.',
    category: 'PDF',
    publishedDate: 'August 2026',
    readTime: '7 min read',
    author: 'Navorika Team'
  },
  {
    slug: 'heart-rate-zones-guide',
    title: 'Heart Rate Zones Guide: Train Smarter, Not Harder',
    description: 'Understand your heart rate zones for optimal training. Learn how to calculate and use target heart rate for fitness.',
    category: 'Health',
    publishedDate: 'August 2026',
    readTime: '8 min read',
    author: 'Navorika Team'
  },
  {
    slug: 'ppf-vs-fd-comparison',
    title: 'PPF vs FD: Which Investment is Right for You?',
    description: 'Compare Public Provident Fund and Fixed Deposit investments. Understand returns, tax benefits, and which is better for your goals.',
    category: 'Finance',
    publishedDate: 'August 2026',
    readTime: '7 min read',
    author: 'Navorika Team'
  },
  {
    slug: 'base64-encoding-guide',
    title: 'Base64 Encoding Guide: What It Is and How to Use It',
    description: 'Learn what Base64 encoding is and how to use it. Understand when to use Base64 and how it works in practice.',
    category: 'Developer',
    publishedDate: 'August 2026',
    readTime: '6 min read',
    author: 'Navorika Team'
  },
  {
    slug: 'qr-code-guide',
    title: 'QR Code Guide: Everything You Need to Know',
    description: 'Learn how QR codes work, how to create them, and best practices for using QR codes in marketing and business.',
    category: 'Developer',
    publishedDate: 'August 2026',
    readTime: '7 min read',
    author: 'Navorika Team'
  },
  {
    slug: 'calorie-deficit-guide',
    title: 'Calorie Deficit Guide: How to Lose Weight Safely',
    description: 'Learn how to create a calorie deficit for weight loss. Understand your calorie needs and how to achieve sustainable results.',
    category: 'Health',
    publishedDate: 'August 2026',
    readTime: '8 min read',
    author: 'Navorika Team'
  },
  {
    slug: 'jwt-decoding-guide',
    title: 'JWT Decoding Guide: Understanding JSON Web Tokens',
    description: 'Learn how JSON Web Tokens work and how to decode them. Understand JWT structure and security best practices.',
    category: 'Developer',
    publishedDate: 'August 2026',
    readTime: '6 min read',
    author: 'Navorika Team'
  },
  {
    slug: 'tax-planning-guide-2026',
    title: 'Tax Planning Guide 2026: Tips for Maximizing Savings',
    description: 'Learn how to plan your taxes effectively in 2026. Understand deductions, exemptions, and strategies to minimize tax liability.',
    category: 'Finance',
    publishedDate: 'August 2026',
    readTime: '10 min read',
    author: 'Navorika Team'
  },
  {
    slug: 'macronutrients-guide',
    title: 'Macronutrients Guide: Understand Protein, Carbs & Fats',
    description: 'Learn about macronutrients and how to balance them for optimal health and fitness. Understand protein, carbohydrate, and fat requirements.',
    category: 'Health',
    publishedDate: 'August 2026',
    readTime: '7 min read',
    author: 'Navorika Team'
  },
  {
    slug: 'json-formatting-guide',
    title: 'JSON Formatting Guide: Working with JSON Data',
    description: 'Learn how to format, validate, and work with JSON data effectively. Understand JSON structure and common use cases.',
    category: 'Developer',
    publishedDate: 'August 2026',
    readTime: '6 min read',
    author: 'Navorika Team'
  },
  {
    slug: 'image-formats-guide',
    title: 'Image Formats Guide: JPG, PNG, WebP, SVG & More',
    description: 'Compare different image formats and learn when to use each. Understand quality, file size, and format-specific features.',
    category: 'Image',
    publishedDate: 'August 2026',
    readTime: '7 min read',
    author: 'Navorika Team'
  },
  {
    slug: 'seo-tools-guide',
    title: 'SEO Tools Guide: Essential Tools for Better Rankings',
    description: 'Discover essential SEO tools for improving your website rankings. Learn how to use tools for keyword research, analysis, and optimization.',
    category: 'Developer',
    publishedDate: 'August 2026',
    readTime: '8 min read',
    author: 'Navorika Team'
  },
  {
    slug: 'house-construction-cost-guide',
    title: 'How to Estimate House Construction Cost',
    description: 'Estimate house construction cost from built-up area, custom rates, project scope, quality, contingency, and local quotations.',
    category: 'Construction', publishedDate: 'August 2026', readTime: '12 min read', author: 'Navorika Team'
  },
  {
    slug: 'water-tank-size-capacity-guide',
    title: 'Water Tank Size & Capacity Calculation Guide',
    description: 'Calculate rectangular and cylindrical tank capacity in litres, gallons, and cubic metres, with usable-volume planning examples.',
    category: 'Construction', publishedDate: 'August 2026', readTime: '13 min read', author: 'Navorika Team'
  },
  {
    slug: 'how-to-calculate-roof-area',
    title: 'How to Calculate Roof Area: Pitch, Measurements & Examples',
    description: 'Calculate simple pitched roof surface area from footprint, pitch multiplier, overhangs, and a project-specific waste allowance.',
    category: 'Construction', publishedDate: 'August 2026', readTime: '11 min read', author: 'Navorika Team'
  },
  {
    slug: 'flooring-calculation-guide',
    title: 'How to Calculate Flooring: Area, Packs & Waste',
    description: 'Plan flooring for one or more rooms using measured area, pack coverage, layout cuts, and an appropriate waste allowance.',
    category: 'Construction', publishedDate: 'August 2026', readTime: '10 min read', author: 'Navorika Team'
  },
  {
    slug: 'asphalt-calculation-guide',
    title: 'How to Calculate Asphalt Volume & Tonnage',
    description: 'Estimate asphalt volume and tonnage from area, compacted thickness, mix density, unit conversions, and planning allowances.',
    category: 'Construction', publishedDate: 'August 2026', readTime: '10 min read', author: 'Navorika Team'
  },
  {
    slug: 'gravel-calculation-guide',
    title: 'How to Calculate Gravel: Volume, Yards & Tonnes',
    description: 'Estimate gravel from area and depth, convert cubic feet to yards, and account for density, compaction, and waste.',
    category: 'Construction', publishedDate: 'August 2026', readTime: '10 min read', author: 'Navorika Team'
  },
  {
    slug: 'electricity-cost-calculation-guide',
    title: 'How to Calculate Electricity Cost from Watts & kWh',
    description: 'Calculate appliance electricity cost from watts, runtime, kilowatt-hours, and your own tariff for daily, monthly, and annual estimates.',
    category: 'Everyday', publishedDate: 'August 2026', readTime: '10 min read', author: 'Navorika Team'
  },
  {
    slug: 'brick-calculation-guide',
    title: 'How to Calculate Bricks for a Wall',
    description: 'Estimate brick quantities from wall dimensions, openings, actual brick size, mortar joints, wall thickness, and breakage allowance.',
    category: 'Construction', publishedDate: 'August 2026', readTime: '11 min read', author: 'Navorika Team'
  },
  {
    slug: 'dimensional-weight-guide',
    title: 'Dimensional Weight Guide: Calculate Billable Weight',
    description: 'Understand dimensional or volumetric weight, divisor differences, actual weight, and how carriers determine billable weight.',
    category: 'Everyday', publishedDate: 'August 2026', readTime: '9 min read', author: 'Navorika Team'
  },
  {
    slug: 'construction-estimate-quote-guide',
    title: 'Construction Estimate & Quote Guide',
    description: 'Build clear construction estimates and quotes with scope, quantities, line items, labour, overhead, markup, assumptions, and exclusions.',
    category: 'Construction', publishedDate: 'August 2026', readTime: '13 min read', author: 'Navorika Team'
  },
  {
    slug: 'word-to-cdr-formatting-guide', title: 'How to Convert Word to CDR Without Losing Formatting',
    description: 'Prepare DOC or DOCX for CorelDRAW through PDF while managing page size, tables, images, Unicode fonts, and text-to-curves decisions.',
    category: 'Developer', publishedDate: 'August 2026', readTime: '12 min read', author: 'Navorika Team'
  },
  {
    slug: 'pdf-to-cdr-editing-guide', title: 'How to Convert PDF to CDR for Editing in CorelDRAW',
    description: 'Understand native vectors, scanned pages, fonts, multipage import, embedded images, and saving a PDF workflow as CDR.',
    category: 'Developer', publishedDate: 'August 2026', readTime: '11 min read', author: 'Navorika Team'
  },
  {
    slug: 'raster-image-to-cdr-guide', title: 'How to Convert PNG or JPG to CDR',
    description: 'Choose between embedding raster artwork and tracing it into vectors for logos, signatures, line drawings, and photographs.',
    category: 'Developer', publishedDate: 'August 2026', readTime: '10 min read', author: 'Navorika Team'
  },
  {
    slug: 'svg-vs-cdr-guide', title: 'SVG vs CDR: Which Vector Format Should You Use?',
    description: 'Compare open SVG interchange with proprietary CorelDRAW CDR projects for editing, web delivery, collaboration, and printing.',
    category: 'Developer', publishedDate: 'August 2026', readTime: '9 min read', author: 'Navorika Team'
  },
  {
    slug: 'open-cdr-without-coreldraw', title: 'How to Open a CDR File Without CorelDRAW',
    description: 'Use capability-aware open-source viewing and export workflows while understanding which CDR features may not render exactly.',
    category: 'Developer', publishedDate: 'August 2026', readTime: '10 min read', author: 'Navorika Team'
  },
  {
    slug: 'newer-cdr-older-coreldraw', title: 'How to Open a Newer CDR File in an Older CorelDRAW Version',
    description: 'Check CDR container/version clues and use safe resaving or PDF/SVG interchange when an older CorelDRAW release cannot open the file.',
    category: 'Developer', publishedDate: 'August 2026', readTime: '10 min read', author: 'Navorika Team'
  },
  {
    slug: 'best-coreldraw-print-format', title: 'Best File Format for CorelDRAW Printing: CDR vs PDF vs EPS vs SVG',
    description: 'Choose a production format for commercial printing, signage, cutting, proofs, and handoff based on fonts, color, transparency, and editability.',
    category: 'Developer', publishedDate: 'August 2026', readTime: '11 min read', author: 'Navorika Team'
  },
  {
    slug: 'preserve-fonts-coreldraw-conversion', title: 'How to Preserve Fonts When Converting Word or PDF to CorelDRAW',
    description: 'Manage embedded, missing, custom, Punjabi, Hindi, Arabic, and other Unicode fonts and understand when converting text to curves is appropriate.',
    category: 'Developer', publishedDate: 'August 2026', readTime: '12 min read', author: 'Navorika Team'
  }
];

export const guidesMetadata: GuideMetadata[] = guideDefinitions.map((guide) => {
  const image = categoryImages[guide.category];
  const subject = guide.title.split(':')[0].replace(/[?]/g, '').trim();
  return {
    ...guide,
    datePublished: guideDefinitions.indexOf(guide) >= 21 ? '2026-08-29' : '2026-08-01',
    dateModified: new Set(['how-to-calculate-emi', 'heart-rate-zones-guide', 'base64-encoding-guide', 'jwt-decoding-guide', 'json-formatting-guide']).has(guide.slug) || guideDefinitions.indexOf(guide) >= 21 ? '2026-08-29' : '2026-08-19',
    keywords: [subject, `${subject} guide`, `${subject} explained`, guide.category.toLowerCase() + ' guide'],
    featuredImage: {
      src: image.src,
      width: 1200,
      height: 630,
      alt: `Editorial illustration for ${guide.title}`,
      caption: image.caption,
    },
  };
});

export function getGuideMetadata(slug: string): GuideMetadata | undefined {
  return guidesMetadata.find(g => g.slug === slug);
}
