'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, Lock, Rocket, CheckCircle, Grid } from 'lucide-react';
import { categories, tools } from '@/data/registry';
import { getToolIcon } from '@/lib/toolIcons';

// Category content for all categories
const categoryContent: Record<string, any> = {
  'health-calculators': {
    heroTitle: 'Free Online Health Calculators',
    heroDescription: 'Navorika provides browser-based health calculators for BMI, BMR, TDEE, body fat, heart rate, and more. All calculations happen locally in your browser — no data uploads, no signup, completely private.',
    intro: 'Monitor your health and fitness with Navorika\'s comprehensive suite of 15 health calculators. From Body Mass Index (BMI) and Basal Metabolic Rate (BMR) to Total Daily Energy Expenditure (TDEE) and body fat percentage, our calculators use evidence-based formulas validated by health professionals.',
    benefits: [
      'Calculate BMI and body composition',
      'Determine BMR and daily calorie needs',
      'Calculate TDEE and activity levels',
      'Measure body fat percentage',
      'Track heart rate zones',
      'Monitor fitness and health metrics'
    ],
    howItWorks: 'All health calculators run locally in your browser using evidence-based medical formulas. Your data never leaves your device. Simply enter your metrics and get instant results.',
    popularTools: ['bmi-calculator', 'bmr-calculator', 'tdee-calculator', 'body-fat-calculator'],
    faqs: [
      { question: 'Is my health data secure?', answer: 'Yes, all calculations happen locally in your browser. Your health data never leaves your device.' },
      { question: 'Do I need to create an account?', answer: 'No, you can use all health calculators without any signup or registration.' },
      { question: 'Are these medical diagnoses?', answer: 'No, these calculators are for educational purposes only. Consult a healthcare professional for medical advice.' }
    ],
    disclaimer: 'These calculators provide estimates for informational purposes only. Always consult a qualified healthcare professional for personalized medical advice.'
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

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <Link href="/categories" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-8">
          <ArrowRight className="h-4 w-4 rotate-180" /> Back to Categories
        </Link>

        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-[var(--foreground)]">
            {content?.heroTitle || category.name}
          </h1>
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

        {/* TOOLS SECTION */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Grid className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold">All {category.name}</h2>
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium">
              {categoryTools.length} tools
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryTools.map((tool) => {
              const icon = getToolIcon(tool.slug);
              
              return (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="group relative p-6 bg-[var(--card)] border-2 border-[var(--border)] rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
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
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500/0 via-indigo-500/30 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        {content?.howItWorks && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
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
              {content.benefits.map((benefit: string, index: number) => (
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
              {content.faqs.map((item: { question: string; answer: string }, idx: number) => (
                <div key={idx} className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
                  <h3 className="font-semibold text-[var(--foreground)] mb-2">{item.question}</h3>
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        {content?.disclaimer && (
          <div className="mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-sm text-amber-600 dark:text-amber-400">{content.disclaimer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
