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
      title: 'Money & Planning Calculators',
      description: 'Calculators for loans, savings, investing, taxes, mortgages, budgets, business numbers, and property planning.',
    },
    {
      icon: <Layers className="h-6 w-6 text-amber-500" />,
      title: 'Construction & Home Project Calculators',
      description: 'Estimate concrete, bricks, flooring, roofing, stairs, materials, project costs, and other common construction quantities.',
    },
    {
      icon: <FileText className="h-6 w-6 text-blue-500" />,
      title: 'Document & PDF Utilities',
      description: 'Merge, split, reorder, compress, sign, convert, and extract text from PDF files using simple online tools.',
    },
    {
      icon: <ImageIcon className="h-6 w-6 text-purple-500" />,
      title: 'Image & Media Tools',
      description: 'Convert, resize, compress, crop, inspect, and prepare common image formats such as JPG, PNG, WebP, HEIC, and SVG.',
    },
    {
      icon: <Code2 className="h-6 w-6 text-indigo-500" />,
      title: 'Developer & Web Tools',
      description: 'Tools for JSON, YAML, Base64, JWT, cron schedules, code formatting, networking, timestamps, and common web-development tasks.',
    },
  ];

  const corePrinciples = [
    {
      icon: <Lock className="h-7 w-7 text-indigo-500" />,
      title: 'Your Files Usually Stay on Your Device',
      description: 'Most Navorika tools run directly in your browser, so the files and values you enter usually stay on your device instead of being uploaded to Navorika.',
    },
    {
      icon: <Shield className="h-7 w-7 text-emerald-500" />,
      title: 'Clear About How Each Tool Works',
      description: 'If a tool needs live data or server processing, the page explains that. We do not want a browser-based tool to look private when it actually needs a server.',
    },
    {
      icon: <Zap className="h-7 w-7 text-amber-500" />,
      title: 'No Account Required',
      description: 'Open a tool and use it. Navorika does not require an account, email address, subscription, or software installation.',
    },
    {
      icon: <Cpu className="h-7 w-7 text-blue-500" />,
      title: 'Calculations Are Checked',
      description: 'Calculator formulas are based on documented methods and are checked with automated tests using normal values, limits, and unusual inputs.',
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
            Free Online Calculators &amp; Tools
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
            Navorika is an independent website with over {activeToolCount} free calculators and online tools for files, images, money, health, construction, everyday tasks, and web development. Most tools run directly in your browser.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
            >
              Browse Free Tools <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/methodology"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--border)] text-[var(--foreground)] hover:border-indigo-500/40 transition-colors"
            >
              How Our Calculators Work
            </Link>
          </div>
        </section>

        {/* Philosophy */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">What You Can Expect</h2>
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
          <h2 className="text-2xl font-bold mb-6">What You Can Do on Navorika</h2>
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
          <h2 className="text-2xl font-bold mb-4">How We Build and Check Our Tools</h2>
          <div className="space-y-4 text-sm text-[var(--muted-foreground)] leading-relaxed">
            <p>
              We build calculators from documented formulas, official rules where relevant, and established industry methods. For example, loan tools use standard payment formulas, tax tools use published tax rules, and construction tools use common measurement and material calculations.
            </p>
            <p>
              We use automated tests to check calculator results for normal examples, zero values, limits, and unexpected inputs. We also review tools when formulas, rules, or software dependencies change.
            </p>
            <p>
              For more detail on formulas, sources, and testing, read{' '}
              <Link href="/methodology" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                How Our Calculators Work &amp; Standards
              </Link>{' '}
              document.
            </p>
          </div>
        </section>

        {/* Technical Limitations */}
        <section className="mb-16 p-6 sm:p-8 rounded-3xl border border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0" />
            <h2 className="text-xl font-bold">What to Know Before You Use a Result</h2>
          </div>
          <div className="space-y-3 text-sm text-[var(--muted-foreground)] leading-relaxed">
            <p>
              Browser-based tools still have limits. Very large PDFs, images, or other files can use a lot of memory, and some jobs may run more slowly on phones or older computers.
            </p>
            <p>
              Calculators are useful for estimates and planning, but important legal, tax, medical, safety, or structural decisions may need advice from a qualified professional. Please review our{' '}
              <Link href="/disclaimer" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                Legal &amp; Calculation Disclaimer
              </Link>{' '}
              for category-specific caveats.
            </p>
          </div>
        </section>

        {/* Quick Links */}
        <section className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center text-sm text-[var(--muted-foreground)] space-y-3">
          <p className="font-semibold text-[var(--foreground)]">Policies and Helpful Information</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
            <Link href="/methodology" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              How Calculators Work
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
