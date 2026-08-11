'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, Lock, Rocket, CheckCircle, Grid } from 'lucide-react';
import { categories, tools } from '@/data/registry';
import { getToolIcon } from '@/lib/toolIcons';

// Category-specific comprehensive content
const categoryContent: Record<string, { 
  heroTitle: string;
  heroDescription: string;
  intro: string;
  benefits: string[];
  howItWorks: string;
  popularTools: string[];
  faqs: Array<{ question: string; answer: string }>;
  disclaimer?: string;
  methodology?: string;
}> = {
  'pdf-tools': {
    heroTitle: 'Free Online PDF Tools',
    heroDescription: 'Navorika provides browser-based PDF tools for merging, splitting, compressing, converting, securing, and editing PDF files. All processing happens locally in your browser — no uploads, no signup, completely private.',
    intro: 'Whether you need to merge multiple PDFs, compress a large file for email, or convert PDFs to images, Navorika offers a complete suite of free PDF tools. Our tools use pdf-lib and pdf.js to process your documents entirely in your browser, ensuring your files never leave your device.',
    benefits: [
      'Merge multiple PDFs into one document',
      'Split PDFs into separate files',
      'Compress PDFs for email and sharing',
      'Convert PDFs to images and back',
      'Add watermarks and page numbers',
      'Protect PDFs with passwords',
      'Extract text from PDFs'
    ],
    howItWorks: 'All PDF tools run locally in your browser using pdf-lib and pdf.js. Your documents never leave your device. Simply upload your PDF, select your action, and download the result — all processing happens instantly on your machine.',
    popularTools: ['compress-pdf', 'merge-pdf', 'split-pdf', 'pdf-to-image', 'protect-pdf'],
    faqs: [
      { question: 'Are my PDF documents secure?', answer: 'Yes, all processing happens locally in your browser. Your documents never leave your device. This is the most secure way to process PDFs online.' },
      { question: 'Do I need to create an account?', answer: 'No, you can use all PDF tools without any signup or registration.' },
      { question: 'What file formats are supported?', answer: 'We support all standard PDF formats and can convert to/from JPG, PNG, WebP, and other formats.' },
      { question: 'Is there a file size limit?', answer: 'Files are processed locally, so limits depend on your browser and device capabilities.' },
      { question: 'Are the tools really free?', answer: 'Yes, all PDF tools are completely free with no hidden costs or premium plans.' }
    ]
  },
  'image-tools': {
    heroTitle: 'Free Online Image Tools',
    heroDescription: 'Navorika provides browser-based image tools for resizing, compressing, converting, editing, and optimizing your images. All processing happens locally in your browser — no uploads, no signup, completely private.',
    intro: 'With 33 powerful image tools, Navorika is your complete solution for image processing online. From resizing photos for social media to converting between formats and extracting colors, all tools run locally in your browser. Your images never leave your device.',
    benefits: [
      'Resize images to any dimensions',
      'Compress images for web optimization',
      'Convert between JPG, PNG, WebP, and more',
      'Crop and rotate images',
      'Extract colors and metadata',
      'Create icons and stickers',
      'Remove backgrounds and blur faces'
    ],
    howItWorks: 'All image tools run locally in your browser using Canvas API and WebAssembly. Your images never leave your device. Simply upload your image, make your adjustments, and download the result — all processing happens instantly.',
    popularTools: ['resize-image', 'compress-image', 'image-converter', 'crop-image', 'png-to-svg'],
    faqs: [
      { question: 'Are my images secure?', answer: 'Yes, all processing happens locally in your browser. Your images never leave your device.' },
      { question: 'Do I need to create an account?', answer: 'No, you can use all image tools without any signup or registration.' },
      { question: 'What image formats are supported?', answer: 'We support JPG, PNG, WebP, SVG, HEIC, and more.' },
      { question: 'What is the maximum image size?', answer: 'Processing is local, so limits depend on your browser and device capabilities.' }
    ]
  },
  'finance-calculators': {
    heroTitle: 'Free Online Finance Calculators',
    heroDescription: 'Navorika provides browser-based finance calculators for SIP, EMI, loans, GST, taxes, FD, PPF, and more. All calculations happen locally in your browser — no data uploads, no signup, completely private.',
    intro: 'Plan your financial future with Navorika\'s comprehensive suite of 14 finance calculators. Whether you\'re calculating SIP returns, planning loan EMIs, or computing taxes, our calculators use standard financial formulas to provide accurate results. All calculations are private by design.',
    benefits: [
      'Calculate SIP returns and projections',
      'Plan loan EMIs and amortization',
      'Compute GST and tax calculations',
      'Plan FD and PPF investments',
      'Calculate retirement savings',
      'Track investment returns',
      'Calculate inflation impact'
    ],
    howItWorks: 'All finance calculators run locally in your browser using standard financial formulas. Your data never leaves your device. Simply enter your numbers, and get instant results — all calculations happen on your machine.',
    popularTools: ['sip-calculator', 'loan-emi-calculator', 'gst-calculator', 'fd-calculator', 'tax-calculator'],
    faqs: [
      { question: 'Is my financial data secure?', answer: 'Yes, all calculations happen locally in your browser. Your data never leaves your device.' },
      { question: 'Do I need to create an account?', answer: 'No, you can use all finance calculators without any signup or registration.' },
      { question: 'Are the calculations accurate?', answer: 'Yes, we use standard financial formulas used by professionals and financial institutions.' },
      { question: 'Is this financial advice?', answer: 'No, these calculators are for educational and planning purposes. Consult a financial advisor for professional advice.' }
    ],
    disclaimer: 'These calculators provide estimates for informational purposes only. Always consult a qualified financial advisor for personalized financial advice.'
  },
  'health-calculators': {
    heroTitle: 'Free Online Health Calculators',
    heroDescription: 'Navorika provides browser-based health calculators for BMI, BMR, TDEE, body fat, heart rate, and more. All calculations happen locally in your browser — no data uploads, no signup, completely private.',
    intro: 'Monitor your health and fitness with Navorika\'s suite of 15 health calculators. From BMI and BMR to TDEE and body fat percentage, our calculators use evidence-based formulas to provide accurate health metrics. All calculations are private by design.',
    benefits: [
      'Calculate BMI and body composition',
      'Determine BMR and daily calorie needs',
      'Calculate TDEE and activity levels',
      'Measure body fat percentage',
      'Track heart rate zones',
      'Monitor fitness and health metrics',
      'Calculate ideal weight'
    ],
    howItWorks: 'All health calculators run locally in your browser using evidence-based medical formulas. Your data never leaves your device. Simply enter your metrics, and get instant results — all calculations happen on your machine.',
    popularTools: ['bmi-calculator', 'bmr-calculator', 'tdee-calculator', 'body-fat-calculator', 'heart-rate-calculator'],
    faqs: [
      { question: 'Is my health data secure?', answer: 'Yes, all calculations happen locally in your browser. Your health data never leaves your device.' },
      { question: 'Do I need to create an account?', answer: 'No, you can use all health calculators without any signup or registration.' },
      { question: 'Are these medical diagnoses?', answer: 'No, these calculators are for educational and informational purposes only. Consult a healthcare professional for medical advice.' },
      { question: 'Are the calculations accurate?', answer: 'We use standard formulas validated by health professionals and institutions.' }
    ],
    disclaimer: 'These calculators provide estimates for informational purposes only. Always consult a qualified healthcare professional for personalized medical advice.'
  },
  'developer-tools': {
    heroTitle: 'Free Online Developer Tools',
    heroDescription: 'Navorika provides browser-based developer tools for JSON, base64, JWT, QR codes, code minification, and more. All processing happens locally in your browser — no uploads, no signup, completely private.',
    intro: 'Accelerate your development workflow with Navorika\'s suite of developer tools. From JSON formatting and JWT decoding to QR code generation and code minification, all tools run locally in your browser. Your code never leaves your device.',
    benefits: [
      'Encode and decode Base64',
      'View and format JSON data',
      'Decode JWT tokens',
      'Generate QR codes',
      'Minify HTML, CSS, and JavaScript',
      'Encrypt and hash data'
    ],
    howItWorks: 'All developer tools run locally in your browser using native JavaScript APIs. Your data never leaves your device. Simply paste your code, process it, and get instant results — all processing happens on your machine.',
    popularTools: ['base64-encoder', 'jwt-base64-deck', 'universal-json-studio', 'qr-code-studio', 'code-minifier-beautifier'],
    faqs: [
      { question: 'Is my code secure?', answer: 'Yes, all processing happens locally in your browser. Your code never leaves your device.' },
      { question: 'Do I need to create an account?', answer: 'No, you can use all developer tools without any signup or registration.' },
      { question: 'What languages are supported?', answer: 'We support HTML, CSS, JavaScript, JSON, and more.' },
      { question: 'Are these tools free?', answer: 'Yes, all developer tools are completely free with no hidden costs.' }
    ]
  },
  'construction-calculators': {
    heroTitle: 'Free Online Construction Calculators',
    heroDescription: 'Navorika provides browser-based construction calculators for concrete, cement, bricks, steel, rebar, sand, and more. All calculations happen locally in your browser — no data uploads, no signup, completely private.',
    intro: 'Plan your construction projects with confidence using Navorika\'s suite of construction calculators. From concrete volume and cement bags to brick counts and steel weight, our calculators use standard construction formulas to provide accurate estimates.',
    benefits: [
      'Calculate concrete volume and mix',
      'Estimate cement bags needed',
      'Calculate bricks and materials',
      'Determine steel and rebar weight',
      'Plan construction costs',
      'Estimate sand and aggregate'
    ],
    howItWorks: 'All construction calculators run locally in your browser using standard construction formulas. Your data never leaves your device. Simply enter your dimensions and specifications, and get instant results — all calculations happen on your machine.',
    popularTools: ['concrete-calculator', 'cement-calculator', 'brick-calculator', 'steel-weight-calculator', 'sand-calculator'],
    faqs: [
      { question: 'Are the calculations accurate?', answer: 'Yes, we use standard construction formulas and industry standards.' },
      { question: 'Do I need to create an account?', answer: 'No, you can use all construction calculators without any signup or registration.' },
      { question: 'Is my data secure?', answer: 'Yes, all calculations happen locally in your browser. Your data never leaves your device.' },
      { question: 'Are these tools free?', answer: 'Yes, all construction calculators are completely free with no hidden costs.' }
    ]
  }
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const category = categories.find(c => c.slug === slug);
  const categoryTools = tools.filter(t => t.category === slug);
  const content = categoryContent[slug];

  if (!category) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold">Category Not Found</h1>
          <p className="text-[var(--muted-foreground)] mt-2">The category you're looking for doesn't exist.</p>
          <Link href="/categories" className="inline-block mt-4 text-indigo-600 hover:underline">← Back to Categories</Link>
        </div>
      </div>
    );
  }

  // Get popular tools
  const popularTools = content?.popularTools 
    ? categoryTools.filter(t => content.popularTools?.includes(t.slug))
    : categoryTools.slice(0, 6);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <Link href="/categories" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-8">
          <ArrowRight className="h-4 w-4 rotate-180" /> Back to Categories
        </Link>

        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-[var(--foreground)]">{content?.heroTitle || category.name}</h1>
          <p className="text-lg text-[var(--muted-foreground)] mt-4 max-w-3xl leading-relaxed">
            {content?.heroDescription || category.description}
          </p>
          <p className="text-sm text-[var(--muted-foreground)] mt-2">{categoryTools.length} tools</p>
        </div>

        {/* Trust Badges */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium border border-emerald-500/20">
            <ShieldCheck className="h-4 w-4" /> Private by Design
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium border border-blue-500/20">
            <Zap className="h-4 w-4" /> Local Processing
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium border border-purple-500/20">
            <Lock className="h-4 w-4" /> No Uploads
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-medium border border-amber-500/20">
            <Rocket className="h-4 w-4" /> 100% Free
          </span>
        </div>

        {/* Introduction */}
        {content?.intro && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">About {category.name}</h2>
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
              <p className="text-[var(--muted-foreground)] leading-relaxed">{content.intro}</p>
            </div>
          </div>
        )}

        {/* TOOL SECTION - WITH DISTINCTIVE STYLING */}
        <div className="mb-8">
          {/* Section header with icon and divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Grid className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold">Available Tools</h2>
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium">
              {categoryTools.length} tools
            </span>
          </div>

          {/* Popular Tools - with distinct purple gradient border */}
          {popularTools.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-indigo-500 rounded-full"></span>
                Popular Tools
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularTools.map((tool) => {
                  const icon = getToolIcon(tool.slug);
                  return (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      className="group relative p-4 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-2 border-indigo-500/20 rounded-xl hover:border-indigo-500/60 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-purple-500/0 group-hover:translate-x-full transition-transform duration-700"></div>
                      <div className="flex items-center gap-3 relative z-10">
                        <span className="text-2xl">{icon || '🔧'}</span>
                        <div>
                          <h3 className="font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {tool.title}
                          </h3>
                          <p className="text-xs text-[var(--muted-foreground)] line-clamp-1">{tool.description}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-[var(--muted-foreground)] group-hover:text-indigo-500 group-hover:translate-x-1 transition-all ml-auto flex-shrink-0" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* All Tools - with distinct card styling */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-indigo-500 rounded-full"></span>
              All Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryTools.map((tool) => {
                const icon = getToolIcon(tool.slug);
                
                return (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="group relative p-6 bg-[var(--card)] border-2 border-[var(--border)] rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 overflow-hidden"
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors duration-300">
                          <span className="text-2xl group-hover:scale-110 transition-transform duration-300 block">
                            {icon || '🔧'}
                          </span>
                        </div>
                        <h3 className="text-lg font-black text-[var(--foreground)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {tool.title}
                        </h3>
                      </div>
                      <div className="p-1.5 rounded-full bg-[var(--muted)] group-hover:bg-indigo-500/10 transition-colors duration-300">
                        <ArrowRight className="h-4 w-4 text-[var(--muted-foreground)] group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                    <p className="text-sm text-[var(--muted-foreground)] leading-relaxed relative z-10">
                      {tool.description}
                    </p>
                    {/* Bottom indicator */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500/0 via-indigo-500/30 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* How It Works */}
        {content?.howItWorks && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">How Navorika {category.name} Work</h2>
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
              <p className="text-[var(--muted-foreground)] leading-relaxed">{content.howItWorks}</p>
            </div>
          </div>
        )}

        {/* Benefits */}
        {content?.benefits && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Key Benefits</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--foreground)] leading-relaxed">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        {content?.faqs && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {content.faqs.map((item, idx) => (
                <div key={idx} className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
                  <h3 className="font-semibold text-[var(--foreground)] mb-2">{item.question}</h3>
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer (for finance/health) */}
        {content?.disclaimer && (
          <div className="mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-sm text-amber-600 dark:text-amber-400">{content.disclaimer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
