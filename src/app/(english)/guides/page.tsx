import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { guidesMetadata } from '@/lib/guidesMetadata';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How-To Guides for Calculators & Online Tools',
  description: 'Step-by-step guides for calculators, PDF files, images, construction and home projects, money, health, and common digital tasks.',
  alternates: { canonical: 'https://navorika.com/guides' },
  openGraph: { type: 'website', url: 'https://navorika.com/guides', title: 'Navorika How-To Guides', description: 'Step-by-step guides, examples, FAQs, and related tools for everyday calculations and digital tasks.', siteName: 'Navorika' },
};

const standaloneGuides = [
  {
    slug: 'how-does-a-3d-printer-work',
    category: 'Developer',
    title: 'How Does a 3D Printer Work? Step-by-Step Beginner’s Guide',
    description: 'Learn how a 3D printer turns a digital model into a physical object, from slicing and filament printing to resin, materials and troubleshooting.',
    image: '/images/guides/feature.webp',
    imageAlt: '3D printer creating a model, illustrating the 3D printing process',
    publishedDate: 'October 2026',
    readTime: '16 min read',
    author: 'Navorika Team',
  },
  {
    slug: 'how-to-convert-jpg-to-dxf',
    category: 'Developer',
    title: 'How to Convert JPG to DXF for Free: A Practical AutoCAD and CNC Guide',
    description: 'Learn how to convert JPG to DXF for free, trace raster images into vector CAD outlines, check scale in AutoCAD and prepare clean paths for CNC or laser cutting.',
    image: '/images/guides/developer-guides.webp',
    imageAlt: 'JPG to DXF conversion workflow illustration for AutoCAD and CNC machines',
    publishedDate: 'October 2026',
    readTime: '12 min read',
    author: 'Navorika Team',
  },
  {
    slug: 'can-chatgpt-make-videos',
    category: 'Video',
    title: 'Can ChatGPT Make Videos? How to Create AI Videos Step by Step',
    description: 'Can ChatGPT make videos from text or images? See what works, follow a complete example, compare workflows, and use our free AI video prompt generator.',
    image: '/guides/can-chatgpt-make-videos/opengraph-image',
    imageAlt: 'AI video storyboard and creative production workspace illustration',
    publishedDate: 'October 2026',
    readTime: '14 min read',
    author: 'Navorika Team',
  },
  {
    slug: 'how-to-clean-phone-speaker',
    category: 'Everyday',
    title: 'How to Clean a Phone Speaker Safely: Dust, Water and Muffled Sound',
    description: 'Step-by-step phone speaker cleaning guide for iPhone and Android. Learn what to do about dust, water, muffled audio and when to seek repair.',
    image: '/images/guides/developer-guides.webp',
    imageAlt: 'Phone speaker cleaning and audio troubleshooting illustration',
    publishedDate: 'October 2026',
    readTime: '10 min read',
    author: 'Navorika Team',
  },
  {
    slug: 'shopify-profit-margin-calculator',
    category: 'Finance',
    title: 'How to Calculate Shopify Profit Margin: Fees, Ads, Pricing & Returns',
    description: 'Find out how much profit you keep after Shopify transaction fees, payment processing, shipping, ad spend, and returns with practical seller examples.',
    image: '/images/guides/finance-guides.webp',
    imageAlt: 'Shopify profit margin and business cost breakdown illustration',
    publishedDate: 'October 2026',
    readTime: '15 min read',
    author: 'Navorika Team',
  },
];

export default function GuidesPage() {
  const allGuidesForSchema = [
    ...standaloneGuides.map((g) => ({ title: g.title, slug: g.slug })),
    ...guidesMetadata.map((g) => ({ title: g.title, slug: g.slug })),
  ];
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Navorika Guides & Articles',
    itemListElement: allGuidesForSchema.map((guide, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: guide.title,
      url: `https://navorika.com/guides/${guide.slug}`,
    })),
  };
  return (
    <div className="min-h-screen bg-[#f7f7f8] dark:bg-[#121214] text-[#18181b] dark:text-[#f4f4f5] pt-24 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList).replaceAll('<', '\\u003c') }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fff1f1] dark:bg-[#e5322d]/10 text-[#e5322d] border border-[#fecaca] dark:border-[#e5322d]/20 mb-3">
            Practical Tutorials
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#18181b] dark:text-white tracking-tight">Guides & Articles</h1>
          <p className="text-[#5b5b63] dark:text-[#a1a1aa] text-base sm:text-lg mt-2 max-w-2xl">
            Step-by-step instructions, worked examples, and practical tips for everyday calculations and digital tasks.
          </p>
        </div>

        <section className="mb-10 rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-6 shadow-xs">
          <h2 className="text-xl font-bold text-[#18181b] dark:text-white">What these guides cover</h2>
          <div className="mt-3 grid gap-4 text-sm leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa] md:grid-cols-2">
            <p>These articles explain common tasks in plain English: using specialized calculators, managing PDF and image files, estimating construction materials, understanding financial metrics, and solving everyday computer tasks.</p>
            <p>Every guide includes step-by-step steps, practical examples, formulas, common limitations, and direct links to the relevant free tools.</p>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {standaloneGuides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group flex flex-col overflow-hidden bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] rounded-xl shadow-xs hover:shadow-md hover:border-[#e5322d]/40 transition-all duration-200"
            >
              <Image src={guide.image} width={1200} height={630} alt={guide.imageAlt} className="aspect-[1200/630] w-full object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" />
              <div className="p-5 flex flex-col flex-1">
                <div className="mb-2.5">
                  <span className="text-xs font-semibold text-[#5b5b63] dark:text-[#a1a1aa] bg-[#f0f0f2] dark:bg-[#202023] px-2.5 py-0.5 rounded-md">
                    {guide.category}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-[#18181b] dark:text-white group-hover:text-[#e5322d] dark:group-hover:text-[#ff6b68] transition-colors line-clamp-2">
                  {guide.title}
                </h2>
                <p className="text-sm text-[#5b5b63] dark:text-[#a1a1aa] mt-2 line-clamp-2 leading-relaxed flex-1">
                  {guide.description}
                </p>
                <div className="flex items-center gap-4 mt-4 text-xs text-[#5b5b63] dark:text-[#a1a1aa]">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {guide.publishedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {guide.readTime}
                  </span>
                </div>
                <div className="mt-4 pt-3.5 border-t border-[#e4e4e8] dark:border-[#27272a] flex items-center justify-between text-xs text-[#5b5b63] dark:text-[#a1a1aa]">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {guide.author}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#e5322d]">Read guide <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
                </div>
              </div>
            </Link>
          ))}
          {guidesMetadata.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group flex flex-col overflow-hidden bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] rounded-xl shadow-xs hover:shadow-md hover:border-[#e5322d]/40 transition-all duration-200"
            >
              <Image src={guide.featuredImage.src} width={1200} height={630} alt="" className="aspect-[1200/630] w-full object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" />
              <div className="p-5 flex flex-col flex-1">
                <div className="mb-2.5">
                  <span className="text-xs font-semibold text-[#5b5b63] dark:text-[#a1a1aa] bg-[#f0f0f2] dark:bg-[#202023] px-2.5 py-0.5 rounded-md">
                    {guide.category}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-[#18181b] dark:text-white group-hover:text-[#e5322d] dark:group-hover:text-[#ff6b68] transition-colors line-clamp-2">
                  {guide.title}
                </h2>
                <p className="text-sm text-[#5b5b63] dark:text-[#a1a1aa] mt-2 line-clamp-2 leading-relaxed flex-1">
                  {guide.description}
                </p>
                <div className="flex items-center gap-4 mt-4 text-xs text-[#5b5b63] dark:text-[#a1a1aa]">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {guide.publishedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {guide.readTime}
                  </span>
                </div>
                <div className="mt-4 pt-3.5 border-t border-[#e4e4e8] dark:border-[#27272a] flex items-center justify-between text-xs text-[#5b5b63] dark:text-[#a1a1aa]">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {guide.author}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#e5322d]">Read guide <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
