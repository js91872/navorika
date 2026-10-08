type GuideCategory = 'Finance' | 'Health' | 'PDF' | 'Image' | 'Developer' | 'Construction' | 'Everyday' | 'Video';

interface GuideDefinition {
  slug: string;
  title: string;
  description: string;
  category: GuideCategory;
  publishedDate: string;
  readTime: string;
  author: string;
  keywords?: string[];
  featuredImage?: { src: string; alt: string; caption: string };
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
  Video: { src: '/images/guides/image-guides.webp', caption: 'Choose practical video tools, formats and workflows for everyday Mac editing and sharing.' },
};

const guideDefinitions: GuideDefinition[] = [
  {
    slug: 'how-to-show-battery-percentage-on-mac',
    title: 'How to Show Battery Percentage on MacBook Air & Pro (2026)',
    description: 'Learn how to show battery percentage on MacBook Air or Pro in macOS Tahoe, Sequoia, Sonoma, and older versions. Easy steps and fixes if it is missing.',
    category: 'Everyday',
    publishedDate: 'October 2026',
    readTime: '10 min read',
    author: 'Navorika Team',
    keywords: ['how to show battery percentage on mac', 'how to show battery percentage on mac air', 'how do i show battery percentage on macbook', 'show battery percentage macbook pro', 'macos tahoe battery percentage', 'macos sequoia show battery percentage', 'macos sonoma battery percentage', 'macbook air battery percentage not showing'],
  },

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
    title: 'GST Calculation Guide: Formulas, RCM, and Invoicing Compliance',
    description: 'Learn how to calculate GST for your business. Understand CGST, SGST, IGST, reverse charge, inclusive pricing, and Rule 46 invoicing standards.',
    category: 'Finance',
    publishedDate: 'August 2026',
    readTime: '10 min read',
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
    title: 'PPF vs FD Comparison: Compounding, Taxes, and Wealth Tables',
    description: 'Compare Public Provident Fund and Fixed Deposit investments. Understand EEE vs TTT tax treatment, compounding, and 15-year wealth accumulation.',
    category: 'Finance',
    publishedDate: 'August 2026',
    readTime: '11 min read',
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
    title: 'Calorie Deficit Guide: Safe Rates, Metabolism, and Lean Mass',
    description: 'Learn how to create a sustainable calorie deficit for fat loss. Understand adaptive thermogenesis, lean tissue preservation, and tracking caveats.',
    category: 'Health',
    publishedDate: 'August 2026',
    readTime: '10 min read',
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
    title: 'India Tax Planning Guide 2026: Slabs, Regimes, and Rebates',
    description: 'Learn how to plan your taxes effectively for FY 2026–27. Compare New vs Old Regimes, standard deduction, Section 87A rebate, and advance tax schedules.',
    category: 'Finance',
    publishedDate: 'August 2026',
    readTime: '12 min read',
    author: 'Navorika Team'
  },
  {
    slug: 'macronutrients-guide',
    title: 'Macronutrients Guide: 4:4:9 Density, Protein per kg, and Planning',
    description: 'Learn about macronutrients and how to balance them for health and performance. Understand 4:4:9 density, protein per kg, dietary fats, and carbs.',
    category: 'Health',
    publishedDate: 'August 2026',
    readTime: '10 min read',
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
    slug: 'open-cdr-without-coreldraw',
    title: 'How to Open a CDR File Without CorelDRAW: Free Online & Desktop Options',
    description: 'Need to open a CDR file without CorelDRAW? Compare an online CDR viewer, LibreOffice, Inkscape and PDF/SVG conversion options for Windows, Mac and Linux.',
    category: 'Developer', publishedDate: 'August 2026', readTime: '10 min read', author: 'Navorika Team',
    keywords: ['open cdr file without coreldraw', 'open cdr file', 'cdr viewer', 'cdr viewer online', 'cdr opener', 'open coreldraw file online', 'view cdr file online', 'coreldraw viewer']
  },
  {
    slug: 'newer-cdr-older-coreldraw',
    title: 'How to Open a Newer CDR File in an Older CorelDRAW Version',
    description: 'Cannot open a newer CDR file in an older CorelDRAW version? Learn how to check the CDR version, ask for a lower-version save, or use PDF/SVG as a safe workaround.',
    category: 'Developer', publishedDate: 'August 2026', readTime: '10 min read', author: 'Navorika Team',
    keywords: ['open newer cdr in older coreldraw', 'cdr version', 'cdr version converter', 'coreldraw older version', 'convert cdr to lower version', 'cdr file version']
  },
  {
    slug: 'best-coreldraw-print-format',
    title: 'Best File Format for CorelDRAW Printing: CDR vs PDF vs EPS vs SVG',
    description: 'Which file format should you send for printing from CorelDRAW? Compare CDR, PDF, EPS and SVG for print shops, signage, cut files, fonts, color and editability.',
    category: 'Developer', publishedDate: 'August 2026', readTime: '11 min read', author: 'Navorika Team',
    keywords: ['best file format for coreldraw printing', 'coreldraw print file format', 'cdr file for printing', 'cdr vs pdf for printing', 'pdf vs eps for printing', 'svg vs cdr', 'what is cdr file for printing']
  },
  {
    slug: 'preserve-fonts-coreldraw-conversion', title: 'How to Preserve Fonts When Converting Word or PDF to CorelDRAW',
    description: 'Manage embedded, missing, custom, Punjabi, Hindi, Arabic, and other Unicode fonts and understand when converting text to curves is appropriate.',
    category: 'Developer', publishedDate: 'August 2026', readTime: '12 min read', author: 'Navorika Team'
  },
  {
    slug: 'psd-to-html-conversion-guide',
    title: 'PSD to HTML Conversion Guide: Modern Workflow, Slicing & Service Comparison',
    description: 'Learn modern PSD to HTML conversion: artboard preflight, SVG and WebP slicing, semantic HTML5, CSS Flexbox, and evaluating automated tools vs conversion services.',
    category: 'Developer',
    publishedDate: 'September 2026',
    readTime: '12 min read',
    author: 'Navorika Team',
    keywords: [
      'psd to html conversion',
      'psd to html conversion services',
      'psd to html service',
      'psd to html',
      'psd to html converter',
      'convert psd to html',
      'developer guide',
    ],
  },
  {
    slug: 'psd-to-html-email',
    title: 'PSD to HTML Email Conversion: Responsive Tables, Inline CSS & Client Compatibility',
    description: 'Master PSD to HTML email conversion using nested table architectures, inline CSS, 600px container standards, and Outlook conditional tags.',
    category: 'Developer',
    publishedDate: 'September 2026',
    readTime: '11 min read',
    author: 'Navorika Team',
    keywords: [
      'psd to html email',
      'psd to email template',
      'responsive html email',
      'convert psd to email html',
      'psd to html',
      'html email coding',
      'developer guide',
    ],
  },
  {
    slug: 'psd-to-responsive-html',
    title: 'PSD to Responsive HTML: Translating Desktop Artboards into Mobile-Friendly CSS',
    description: 'Convert desktop Photoshop mockups into fluid, responsive HTML5 and CSS with modern breakpoints, Flexbox, Grid, clamp typography, and asset optimization.',
    category: 'Developer',
    publishedDate: 'September 2026',
    readTime: '11 min read',
    author: 'Navorika Team',
    keywords: [
      'psd to responsive html',
      'responsive html',
      'psd to html',
      'convert psd to responsive css',
      'photoshop to responsive html',
      'responsive web design from psd',
      'developer guide',
    ],
  },
  {
    slug: 'step-to-3d-pdf-conversion-guide',
    title: 'STEP to 3D PDF Conversion Guide: CAD Sharing, PRC Geometry & Viewer Setup',
    description: 'Learn how to convert STEP/STP CAD models into interactive 3D PDFs. Understand ISO 10303, PRC geometry, what survives conversion, and Acrobat viewer settings.',
    category: 'Developer',
    publishedDate: 'September 2026',
    readTime: '11 min read',
    author: 'Navorika Team',
    keywords: [
      'step to 3d pdf',
      'convert step to 3d pdf',
      'step to 3d pdf converter',
      'stp to 3d pdf',
      'convert stp to 3d pdf',
      '3d pdf cad sharing',
      'prc 3d pdf',
      'open cascade brep tessellation',
      'developer guide',
    ],
  },
  {
    slug: 'rgb-vs-cmyk-for-printing',
    title: 'RGB vs CMYK for Printing: Color Modes, Gamuts & Preflight Guide',
    description: 'Learn why RGB and CMYK behave differently, how out-of-gamut shifts happen, how to check image color modes, and how to prepare print-ready artwork.',
    category: 'Image',
    publishedDate: 'September 2026',
    readTime: '10 min read',
    author: 'Navorika Team',
    keywords: [
      'rgb vs cmyk for printing',
      'check if image is rgb or cmyk',
      'check cmyk image',
      'image color mode for printing',
      'rgb or cmyk for print',
      'print color preflight',
      'icc color profiles',
      'image guide',
    ],
  },
  {
    slug: 'print-bleed-trim-safe-area-guide',
    title: 'Print Bleed, Trim & Safe Area Guide: Dimensions, Margins & Setup',
    description: 'Master print layout geometry: bleed, trim line, safe area, and total document size. Includes worked examples for business cards, flyers, and posters.',
    category: 'Image',
    publishedDate: 'September 2026',
    readTime: '11 min read',
    author: 'Navorika Team',
    keywords: [
      'print bleed',
      'bleed size',
      'print bleed size',
      'trim size',
      'safe area printing',
      'bleed trim safe area',
      'how much bleed do I need',
      'print document setup',
      'pdf geometry boxes',
      'image guide',
    ],
  },
  {
    slug: 'eps-vs-cdr-guide',
    title: 'EPS vs CDR: Vector Formats, Print Workflows & Software Compatibility',
    description: 'Compare EPS and CDR vector formats: PostScript language, CorelDRAW native features, transparency limitations, fonts, and print prepress workflows.',
    category: 'Developer',
    publishedDate: 'September 2026',
    readTime: '10 min read',
    author: 'Navorika Team',
    keywords: [
      'eps vs cdr',
      'cdr vs eps',
      'eps or cdr',
      'eps to coreldraw',
      'coreldraw eps format',
      'vector format comparison',
      'print prepress interchange',
      'developer guide',
    ],
  },

  {
    slug: 'video-editing-software-for-mac',
    title: 'Best Video Editing Software for Mac in 2026: Free, Easy & Everyday Options',
    description: 'Compare video editing software for Mac, MacBook Air and MacBook Pro for everyday editing, YouTube, social clips, family videos and simple work projects.',
    category: 'Video',
    publishedDate: 'October 2026',
    readTime: '16 min read',
    author: 'Navorika Team',
    keywords: [
      'video editing software for mac',
      'video editing tools for mac',
      'video editor for mac',
      'mac video editor',
      'mac editing software',
      'video editing software for macbook air',
      'video editing software for macbook pro',
      'best video editing software for mac',
      'good video editing software for mac',
      'video editing program on mac',
      'macos video editor',
      'video editing software mac',
    ],
  },
  {
    slug: 'free-video-editing-software-for-mac',
    title: 'Best Free Video Editing Software for Mac in 2026: No-Nonsense Guide',
    description: 'Find genuinely useful free video editing software for Mac, including beginner-friendly options, no-watermark choices and free editors for MacBook Air and Pro.',
    category: 'Video',
    publishedDate: 'October 2026',
    readTime: '14 min read',
    author: 'Navorika Team',
    keywords: [
      'free video editor mac',
      'video editing software for mac free',
      'best free video editor mac',
      'good free video editing software for mac',
      'free video editing tools for mac',
      'free video editing software for mac',
      'free video editor for macbook',
      'free video editor mac no watermark',
      'free video editing software for mac no watermark',
    ],
  },
  {
    slug: 'professional-video-editing-software-for-mac',
    title: 'Best Video Editing Software for Mac for Serious Everyday Creators',
    description: 'Compare higher-end Mac video editors for people who edit often, run a YouTube channel or need more control without assuming a film-studio workflow.',
    category: 'Video',
    publishedDate: 'October 2026',
    readTime: '13 min read',
    author: 'Navorika Team',
    keywords: [
      'professional video editing software for mac',
      'professional video editing software mac',
      'best video editing software for mac',
      'final cut pro vs davinci resolve',
      'final cut pro vs premiere pro',
      'video editor for youtube mac',
      'mac video editing software for creators',
    ],
  },
  {
    slug: 'easy-video-editing-software-for-mac',
    title: 'Easy Video Editing Software for Mac: Best Beginner Options in 2026',
    description: 'Find easy video editing software for Mac for beginners who want to trim clips, add music, make YouTube videos and export without a steep learning curve.',
    category: 'Video',
    publishedDate: 'October 2026',
    readTime: '12 min read',
    author: 'Navorika Team',
    keywords: [
      'easy video editing software for mac',
      'easiest video editing software for mac',
      'best video editing software for mac beginners',
      'user friendly video editing software for mac',
      'simple video editor mac',
      'easy video editor mac',
      'video editing for beginners mac',
    ],
  },
  {
    slug: 'how-to-save-a-screenshot-as-a-pdf',
    title: 'How to Save a Screenshot as a PDF on Any Device',
    description: 'Learn how to save a screenshot as a PDF on iPhone, Android, Mac, Windows, and Chromebook, including steps for combining multiple screenshots.',
    category: 'PDF',
    publishedDate: 'October 2026',
    readTime: '14 min read',
    author: 'Navorika Team',
    keywords: ['how to save a screenshot as a pdf', 'save a screenshot as a PDF', 'how to save a screenshot as a PDF on iPhone', 'how to save a screenshot as a PDF on Mac', 'how to save a screenshot as a PDF on Chromebook', 'convert screenshot to PDF', 'save screenshots as PDF'],
    featuredImage: { src: '/images/guides/screenshot-to-pdf-feature.webp', alt: 'A phone and laptop screenshot being turned into a PDF document', caption: 'Save or combine screenshots as a PDF on your phone or computer.' },
  },
  {
    slug: 'how-to-clear-ram-on-mac',
    title: "How to Clear RAM on a Mac: Safe Ways to Free Up Memory",
    description: "Learn how to check RAM usage on a Mac, reduce memory pressure, quit high-usage apps, manage login items, and know when a restart can help.",
    category: 'Everyday',
    publishedDate: 'October 2026',
    readTime: '14 min read',
    author: 'Navorika Team',
    keywords: ['how to clear ram on mac', 'how to clear ram memory on mac', 'how to clear the ram on a mac', 'how to clear ram on a mac', 'how to clean up ram on mac', 'how to free up ram on mac', 'check ram usage on mac', 'reduce memory usage on mac', 'mac memory pressure', 'activity monitor memory usage'],
    featuredImage: { src: '/images/guides/how-to-clear-ram-on-mac.webp', alt: 'A Mac laptop with a memory-pressure graph and a RAM chip illustration', caption: 'Use Activity Monitor to understand memory pressure and find apps using RAM.' },
  },
];

const newBatchSlugs = new Set([
  'step-to-3d-pdf-conversion-guide',
  'rgb-vs-cmyk-for-printing',
  'print-bleed-trim-safe-area-guide',
  'eps-vs-cdr-guide',
]);

const octoberMacVideoSlugs = new Set([
  'video-editing-software-for-mac',
  'free-video-editing-software-for-mac',
  'professional-video-editing-software-for-mac',
  'easy-video-editing-software-for-mac',
]);

const newOctoberGuideDates = new Set(['how-to-save-a-screenshot-as-a-pdf', 'how-to-clear-ram-on-mac', 'how-to-show-battery-percentage-on-mac']);

const recentUpdateSlugs = new Set([
  'how-to-calculate-emi',
  'heart-rate-zones-guide',
  'base64-encoding-guide',
  'jwt-decoding-guide',
  'json-formatting-guide',
  'pdf-to-cdr-editing-guide',
]);

export const guidesMetadata: GuideMetadata[] = guideDefinitions.map((guide) => {
  const image = categoryImages[guide.category];
  const subject = guide.title.split(':')[0].replace(/[?]/g, '').trim();
  const isNewBatch = newBatchSlugs.has(guide.slug);
  return {
    ...guide,
    datePublished: newOctoberGuideDates.has(guide.slug) ? '2026-10-08' : octoberMacVideoSlugs.has(guide.slug) ? '2026-10-05' : isNewBatch ? '2026-09-27' : guideDefinitions.indexOf(guide) >= 21 ? '2026-08-29' : '2026-08-01',
    dateModified: newOctoberGuideDates.has(guide.slug) ? '2026-10-08' : octoberMacVideoSlugs.has(guide.slug) ? '2026-10-05' : isNewBatch || guide.slug === 'pdf-to-cdr-editing-guide' ? '2026-09-27' : recentUpdateSlugs.has(guide.slug) || guideDefinitions.indexOf(guide) >= 21 ? '2026-08-29' : '2026-08-19',
    keywords: guide.keywords ?? [subject, `${subject} guide`, `${subject} explained`, guide.category.toLowerCase() + ' guide'],
    featuredImage: {
      src: guide.featuredImage?.src ?? image.src,
      width: 1200,
      height: 630,
      alt: guide.featuredImage?.alt ?? `Editorial illustration for ${guide.title}`,
      caption: guide.featuredImage?.caption ?? image.caption,
    },
  };
});

export function getGuideMetadata(slug: string): GuideMetadata | undefined {
  return guidesMetadata.find(g => g.slug === slug);
}
