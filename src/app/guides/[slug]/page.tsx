'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, CheckCircle, ArrowRight } from 'lucide-react';
import { guidesMetadata, getGuideMetadata } from '@/lib/guidesMetadata';
import { getGuideTools } from '@/lib/guideTools';
import { tools } from '@/data/registry';
import { getToolIcon } from '@/lib/toolIcons';

// Rich content for each guide
const guideContent: Record<string, { 
  intro: string;
  sections: Array<{ title: string; content: string }>;
  summary: string;
}> = {
  'how-to-calculate-emi': {
    intro: 'Equated Monthly Installment (EMI) is the fixed amount you pay each month to repay a loan. Understanding how EMI is calculated helps you make informed borrowing decisions and plan your finances effectively.',
    sections: [
      {
        title: 'What is EMI?',
        content: 'EMI stands for Equated Monthly Installment. It is the monthly payment you make to repay a loan, which includes both principal and interest components. The EMI remains constant throughout the loan tenure.'
      },
      {
        title: 'The EMI Formula',
        content: 'EMI is calculated using the formula: EMI = P × r × (1+r)^n / ((1+r)^n - 1), where P is the principal loan amount, r is the monthly interest rate, and n is the number of monthly installments.'
      },
      {
        title: 'Factors Affecting EMI',
        content: 'Three key factors affect your EMI: the loan amount (higher loan = higher EMI), the interest rate (higher rate = higher EMI), and the loan tenure (longer tenure = lower EMI but more total interest paid).'
      },
      {
        title: 'How to Reduce Your EMI',
        content: 'To reduce your EMI, you can: increase your down payment to reduce the loan amount, negotiate for a lower interest rate, or extend the loan tenure (though this increases total interest paid).'
      }
    ],
    summary: 'Understanding EMI helps you plan your finances better. Use our EMI calculator to find the right loan amount and tenure for your needs.'
  },
  'bmi-calculator-guide': {
    intro: 'Body Mass Index (BMI) is a simple measure of body fat based on height and weight. It is widely used to screen for weight categories that may lead to health problems.',
    sections: [
      {
        title: 'What is BMI?',
        content: 'BMI (Body Mass Index) is a measure that uses your height and weight to determine if you are at a healthy weight. It is calculated by dividing weight in kilograms by height in meters squared.'
      },
      {
        title: 'BMI Categories',
        content: 'BMI categories include: Underweight (below 18.5), Normal weight (18.5-24.9), Overweight (25-29.9), and Obese (30 and above). These categories help assess health risks associated with weight.'
      },
      {
        title: 'Limitations of BMI',
        content: 'BMI does not directly measure body fat and may not be accurate for athletes, older adults, or people with high muscle mass. It is a screening tool, not a diagnostic tool.'
      },
      {
        title: 'How to Improve Your BMI',
        content: 'To achieve a healthy BMI, focus on balanced nutrition, regular physical activity, and sustainable lifestyle changes. Consult healthcare professionals for personalized guidance.'
      }
    ],
    summary: 'BMI is a useful screening tool for weight categories. Use our BMI calculator to check your BMI and get personalized health recommendations.'
  }
};

// Default content for guides without specific content
const getDefaultContent = (title: string) => ({
  intro: `This comprehensive guide covers everything you need to know about ${title.toLowerCase()}. Whether you're a beginner or looking to deepen your understanding, this guide provides valuable insights and practical tips.`,
  sections: [
    {
      title: 'Understanding the Basics',
      content: `This guide explores the fundamental concepts of ${title.toLowerCase()}, helping you build a strong foundation for further learning and application.`
    },
    {
      title: 'Key Concepts',
      content: `Learn the essential concepts and principles that form the core of ${title.toLowerCase()}. Understanding these concepts is crucial for effective application.`
    },
    {
      title: 'Practical Applications',
      content: `Discover how to apply ${title.toLowerCase()} in real-world scenarios. This section provides practical examples and use cases to help you implement what you learn.`
    },
    {
      title: 'Tips for Success',
      content: `Get actionable tips and best practices for ${title.toLowerCase()}. These insights will help you avoid common pitfalls and achieve better results.`
    }
  ],
  summary: `Master ${title.toLowerCase()} with our comprehensive guide. Use the related tools below to apply what you've learned.`
});

export default function GuidePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const guide = getGuideMetadata(slug);
  const toolSlugs = getGuideTools(slug);
  const content = guideContent[slug] || getDefaultContent(guide?.title || 'this topic');

  if (!guide) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold">Guide Not Found</h1>
          <p className="text-[var(--muted-foreground)] mt-2">The guide you're looking for doesn't exist.</p>
          <Link href="/guides" className="inline-block mt-4 text-indigo-600 hover:underline">← Back to Guides</Link>
        </div>
      </div>
    );
  }

  const relatedTools = toolSlugs
    .map(slug => tools.find(t => t.slug === slug))
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/guides" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Guides
        </Link>

        {/* Header */}
        <div className="mb-8">
          <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full">
            {guide.category}
          </span>
          <h1 className="text-4xl font-black mt-4">{guide.title}</h1>
          <p className="text-lg text-[var(--muted-foreground)] mt-4">{guide.description}</p>
          <div className="flex items-center gap-6 mt-4 text-sm text-[var(--muted-foreground)]">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {guide.publishedDate}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {guide.readTime}
            </span>
            <span className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {guide.author}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none mb-12">
          <p className="text-lg text-[var(--muted-foreground)] leading-relaxed">
            {content.intro}
          </p>

          {content.sections.map((section, index) => (
            <div key={index}>
              <h2>{section.title}</h2>
              <p>{section.content}</p>
            </div>
          ))}

          <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mt-8">
            <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">Summary</h3>
            <p className="text-[var(--muted-foreground)]">{content.summary}</p>
          </div>
        </div>

        {/* Related Tools Section */}
        {relatedTools.length > 0 && (
          <div className="border-t border-[var(--border)] pt-12">
            <h2 className="text-2xl font-bold mb-6">Related Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedTools.map((tool) => {
                const icon = getToolIcon(tool!.slug);
                return (
                  <Link
                    key={tool!.slug}
                    href={`/tools/${tool!.slug}`}
                    className="group p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl hover:border-indigo-500/40 transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{icon || '🔧'}</span>
                      <div>
                        <h3 className="font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {tool!.title}
                        </h3>
                        <p className="text-xs text-[var(--muted-foreground)] line-clamp-1">{tool!.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-[var(--muted-foreground)] group-hover:text-indigo-500 group-hover:translate-x-1 transition-all ml-auto flex-shrink-0" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
