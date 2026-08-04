'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Calculator, BookOpen, Sparkles, FileText, Image, HeartPulse, Code, PiggyBank } from 'lucide-react';
import { categories, tools } from '@/data/registry';

const iconMap: Record<string, any> = {
  'finance-calculators': { icon: Calculator, color: 'emerald' },
  'health-calculators': { icon: HeartPulse, color: 'rose' },
  'pdf-tools': { icon: FileText, color: 'blue' },
  'image-tools': { icon: Image, color: 'purple' },
  'developer-tools': { icon: Code, color: 'amber' },
  'retirement-calculators': { icon: PiggyBank, color: 'indigo' },
};

// Category-specific guides
const categoryGuides: Record<string, Array<{ title: string; slug: string }>> = {
  'finance-calculators': [
    { title: 'How to Calculate SIP Returns', slug: 'how-to-calculate-sip-returns' },
    { title: 'Understanding EMI Calculations', slug: 'understanding-emi-calculations' },
    { title: 'GST Compliance Guide', slug: 'gst-compliance-guide' },
    { title: 'PPF vs FD: Where to Invest', slug: 'ppf-vs-fd-where-to-invest' },
    { title: 'Income Tax Planning Tips', slug: 'income-tax-planning-tips' },
  ],
  'health-calculators': [
    { title: 'Understanding BMI and Body Composition', slug: 'understanding-bmi-and-body-composition' },
    { title: 'BMR and TDEE Explained', slug: 'bmr-and-tdee-explained' },
    { title: 'Heart Rate Zones for Fitness', slug: 'heart-rate-zones-for-fitness' },
    { title: 'Calorie Deficit for Weight Loss', slug: 'calorie-deficit-for-weight-loss' },
    { title: 'Macronutrient Ratios Explained', slug: 'macronutrient-ratios-explained' },
  ],
  'pdf-tools': [
    { title: 'PDF Compression Guide', slug: 'pdf-compression-guide' },
    { title: 'Merge and Split PDFs', slug: 'merge-and-split-pdfs' },
    { title: 'PDF Security Best Practices', slug: 'pdf-security-best-practices' },
  ],
  'image-tools': [
    { title: 'Image Compression Tips', slug: 'image-compression-tips' },
    { title: 'Image Format Comparison', slug: 'image-format-comparison' },
  ],
  'developer-tools': [
    { title: 'JSON Studio Tips', slug: 'json-studio-tips' },
    { title: 'Base64 Encoder Guide', slug: 'base64-encoder-guide' },
    { title: 'QR Code Generator Guide', slug: 'qr-code-generator-guide' },
    { title: 'JWT Base64 Deck Guide', slug: 'jwt-base64-deck-guide' },
    { title: 'SEO Tools Guide', slug: 'seo-tools-guide' },
  ],
};

// Category-specific FAQs
const categoryFAQs: Record<string, Array<{ q: string; a: string }>> = {
  'finance-calculators': [
    { q: 'What is the best way to save for retirement?', a: 'The best way is to start early, invest regularly, and diversify across PPF, NPS, and mutual funds.' },
    { q: 'How much should I invest in PPF?', a: 'The maximum is ₹1.5 lakh per year, which is tax-deductible under Section 80C.' },
    { q: 'What is the difference between FD and RD?', a: 'FD is a lump sum deposit, while RD is a recurring monthly deposit.' },
  ],
  'health-calculators': [
    { q: 'What is a healthy BMI range?', a: 'A healthy BMI is between 18.5 and 24.9.' },
    { q: 'How much water should I drink daily?', a: 'About 2.7-3.7 liters per day, depending on activity level.' },
    { q: 'What is the difference between BMR and TDEE?', a: 'BMR is calories burned at rest. TDEE includes all daily activities.' },
  ],
  'pdf-tools': [
    { q: 'How do I reduce PDF file size?', a: 'Use our PDF Compressor tool to optimize images and remove unnecessary metadata.' },
    { q: 'Can I merge multiple PDFs?', a: 'Yes, use our Merge PDF tool to combine multiple PDFs into one document.' },
    { q: 'How do I protect a PDF with a password?', a: 'Use our Protect PDF tool to add password protection to your files.' },
  ],
  'image-tools': [
    { q: 'What is the best image format for web?', a: 'WebP offers the best balance of quality and file size for web use.' },
    { q: 'How do I compress an image without losing quality?', a: 'Use our Compress Image tool with optimized settings.' },
    { q: 'What is the difference between JPG and PNG?', a: 'JPG is best for photos, PNG is best for graphics with transparency.' },
  ],
  'developer-tools': [
    { q: 'What is Base64 encoding used for?', a: 'Base64 is used for embedding images in HTML, email attachments, and API authentication.' },
    { q: 'How do I generate a QR code?', a: 'Use our QR Code Studio to generate and customize QR codes.' },
    { q: 'What is JWT and how does it work?', a: 'JWT is a compact token format used for authentication and authorization.' },
  ],
};

export default function CategoryHubPage() {
  const params = useParams();
  const categorySlug = params?.category as string;
  
  const category = categories.find(c => c.slug === categorySlug);
  const categoryTools = tools.filter(t => t.category === categorySlug);
  const iconData = iconMap[categorySlug] || { icon: FileText, color: 'gray' };
  const Icon = iconData.icon;
  const color = iconData.color;
  
  const guides = categoryGuides[categorySlug] || [];
  const faqs = categoryFAQs[categorySlug] || [];

  if (!category) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold">Hub Not Found</h1>
          <p className="text-[var(--muted-foreground)] mt-2">The category hub you're looking for doesn't exist.</p>
          <Link href="/categories" className="inline-block mt-4 text-indigo-600 hover:underline">← Back to Categories</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black tracking-tight mb-4">
            {category.name} Hub
            <span className="text-[var(--muted-foreground)] text-2xl font-normal ml-3">
              — Calculators, Guides & Resources
            </span>
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg max-w-2xl">
            Everything you need for {category.name.toLowerCase()}: calculators, guides, and expert insights.
            All tools are 100% free and client-side.
          </p>
        </div>

        {/* Tools */}
        <section className="mb-12">
          <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 text-${color}-600`}>
            <Icon className="h-6 w-6" />
            {category.name} Calculators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className={`p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-${color}-500/40 transition-all group`}
              >
                <h3 className={`font-semibold group-hover:text-${color}-600 dark:group-hover:text-${color}-400 transition-colors`}>
                  {tool.title}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] mt-1">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Guides */}
        {guides.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-indigo-500" />
              Guides & Tutorials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {guides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-indigo-500/40 transition-all group"
                >
                  <h3 className="font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {guide.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FAQs */}
        {faqs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-amber-500" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                  <h4 className="font-semibold text-sm">{item.q}</h4>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
