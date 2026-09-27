'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield,
  Zap,
  Lock,
  CheckCircle,
  ArrowRight,
  Cpu,
  Layers,
  Calculator,
  FileText,
  ImageIcon,
  Code2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { tools } from '@/data/registry';
import { toolsUnderReview } from '@/lib/seo/toolReview';

export default function AboutPage() {
  const activeToolCount = tools.filter((tool) => !toolsUnderReview.has(tool.slug)).length;

  const toolCategories = [
    {
      icon: <Calculator className="h-6 w-6 text-emerald-500" />,
      title: 'Financial & Planning Calculators',
      description: 'Scenario planning tools for loan amortization, SIP returns, income tax estimates, mortgage affordability, and commercial SaaS/real-estate performance metrics.',
    },
    {
      icon: <Layers className="h-6 w-6 text-amber-500" />,
      title: 'Construction & Material Takeoffs',
      description: 'Field estimation utilities for concrete volume, roof pitch, stair stringers, joist deflection, and building material waste based on published standards.',
    },
    {
      icon: <FileText className="h-6 w-6 text-blue-500" />,
      title: 'Document & PDF Utilities',
      description: 'Browser-local document management including PDF merging, splitting, reordering, compression, visual signature stamping, and text extraction.',
    },
    {
      icon: <ImageIcon className="h-6 w-6 text-purple-500" />,
      title: 'Image & Media Tools',
      description: 'Sandboxed HTML-to-image conversion, client-side format re-encoding (JPG, PNG, WebP, SVG), dimension scaling, cropping, and pixel metadata inspection.',
    },
    {
      icon: <Code2 className="h-6 w-6 text-indigo-500" />,
      title: 'Developer & Network Aids',
      description: 'Data format converters (JSON, YAML, TOML), W3C WebCrypto hashing, Cron schedule generators, JWT inspection, and IPv4/IPv6 subnet calculators.',
    },
  ];

  const corePrinciples = [
    {
      icon: <Lock className="h-7 w-7 text-indigo-500" />,
      title: 'Browser-Local by Design',
      description: 'The vast majority of our tools process files and calculation parameters entirely within your local web browser. Your sensitive documents, images, and calculation inputs are not uploaded to or stored on Navorika servers.',
    },
    {
      icon: <Shield className="h-7 w-7 text-emerald-500" />,
      title: 'Transparent Execution',
      description: 'We explicitly identify how each tool operates. Tools that require external data (such as live currency exchange rates) or ephemeral server-assisted binaries (such as 3D CAD tessellation) clearly disclose their operating boundaries.',
    },
    {
      icon: <Zap className="h-7 w-7 text-amber-500" />,
      title: 'Zero Barrier to Utility',
      description: 'No accounts, no email capture, and no subscriptions. Tools are accessible immediately on desktop and mobile devices without software installation.',
    },
    {
      icon: <Cpu className="h-7 w-7 text-blue-500" />,
      title: 'Empirical Verification',
      description: 'Calculation logic is implemented using established mathematical formulas and building codes, backed by automated unit tests covering standard values, bounds, and precision edge cases.',
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
            About Navorika
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-6">
            Privacy-First Online Calculators &amp; Digital Utilities
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
            Navorika is an independent platform providing over {activeToolCount} focused online tools designed to run directly in your browser. We combine client-side performance, data privacy, and mathematical transparency.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
            >
              Explore Tools <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/methodology"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--border)] text-[var(--foreground)] hover:border-indigo-500/40 transition-colors"
            >
              Calculation Methodology
            </Link>
          </div>
        </section>

        {/* Philosophy */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Our Operating Philosophy</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {corePrinciples.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]"
              >
                <div className="mb-3">{principle.icon}</div>
                <h3 className="text-lg font-bold mb-2">{principle.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {principle.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tool Categories */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">What Kinds of Tools We Provide</h2>
          <div className="space-y-4">
            {toolCategories.map((cat) => (
              <div
                key={cat.title}
                className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex items-start gap-4"
              >
                <div className="p-2.5 rounded-xl bg-[var(--muted)]/50 shrink-0 mt-0.5">
                  {cat.icon}
                </div>
                <div>
                  <h3 className="font-bold text-base">{cat.title}</h3>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How Tools are Developed and Tested */}
        <section className="mb-16 p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)]">
          <h2 className="text-2xl font-bold mb-4">How Tools Are Developed &amp; Verified</h2>
          <div className="space-y-4 text-sm text-[var(--muted-foreground)] leading-relaxed">
            <p>
              Calculators and converters on Navorika are constructed using documented mathematical equations, statutory standards, and industry conventions. For example, our loan calculators utilize the universal amortization annuity formula, tax tools reflect published statutory tax slabs, and structural takeoffs apply standard empirical material densities and building code span criteria.
            </p>
            <p>
              Every tool engine is subject to automated unit test suites running in our continuous integration environment. These tests verify mathematical outputs across typical scenarios, boundary limits, zero-values, and unexpected user inputs.
            </p>
            <p>
              For a detailed breakdown of mathematical formulas, source citations, and testing protocols, please read our dedicated{' '}
              <Link href="/methodology" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                Calculation Methodology &amp; Standards
              </Link>{' '}
              document.
            </p>
          </div>
        </section>

        {/* Technical Limitations */}
        <section className="mb-16 p-6 sm:p-8 rounded-3xl border border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0" />
            <h2 className="text-xl font-bold">Important Technical Limitations</h2>
          </div>
          <div className="space-y-3 text-sm text-[var(--muted-foreground)] leading-relaxed">
            <p>
              While client-side execution provides superior privacy, it is constrained by the capabilities of your local web browser and hardware. Very large files may encounter browser memory ceilings, and mobile devices may experience slower execution times during CPU-intensive tasks.
            </p>
            <p>
              Calculations are planning aids and rule-of-thumb estimations. They do not substitute for professional legal, tax, medical, or certified engineering counsel. Please review our{' '}
              <Link href="/disclaimer" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                Legal &amp; Calculation Disclaimer
              </Link>{' '}
              for category-specific caveats.
            </p>
          </div>
        </section>

        {/* Quick Links */}
        <section className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center text-sm text-[var(--muted-foreground)] space-y-3">
          <p className="font-semibold text-[var(--foreground)]">Governance and Legal Documents</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
            <Link href="/methodology" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Methodology &amp; Standards
            </Link>
            <Link href="/disclaimer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Legal Disclaimer
            </Link>
            <Link href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Contact Us
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
