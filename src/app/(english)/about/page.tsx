'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield,
  Zap,
  Lock,
  ArrowRight,
  Cpu,
  Layers,
  Calculator,
  FileText,
  ImageIcon,
  Code2,
  AlertCircle,
} from 'lucide-react';
import { tools } from '@/data/registry';
import { toolsUnderReview } from '@/lib/seo/toolReview';

export default function AboutPage() {
  const activeToolCount = tools.filter((tool) => !toolsUnderReview.has(tool.slug)).length;

  const toolCategories = [
    {
      icon: <Calculator className="h-5 w-5 text-[#e5322d]" />,
      title: 'Money & Planning Calculators',
      description: 'Calculators for loans, savings, investing, taxes, mortgages, budgets, business numbers, and property planning.',
    },
    {
      icon: <Layers className="h-5 w-5 text-[#e5322d]" />,
      title: 'Construction & Home Project Calculators',
      description: 'Estimate concrete, bricks, flooring, roofing, stairs, materials, project costs, and other common construction quantities.',
    },
    {
      icon: <FileText className="h-5 w-5 text-[#e5322d]" />,
      title: 'Document & PDF Utilities',
      description: 'Merge, split, reorder, compress, sign, convert, and extract text from PDF files using simple online tools.',
    },
    {
      icon: <ImageIcon className="h-5 w-5 text-[#e5322d]" />,
      title: 'Image & Media Tools',
      description: 'Convert, resize, compress, crop, inspect, and prepare common image formats such as JPG, PNG, WebP, HEIC, and SVG.',
    },
    {
      icon: <Code2 className="h-5 w-5 text-[#e5322d]" />,
      title: 'Developer & Web Tools',
      description: 'Tools for JSON, YAML, Base64, JWT, cron schedules, code formatting, networking, timestamps, and common web-development tasks.',
    },
  ];

  const corePrinciples = [
    {
      icon: <Lock className="h-6 w-6 text-[#e5322d]" />,
      title: 'Your Files Usually Stay on Your Device',
      description: 'Most Navorika tools run directly in your browser, so the files and values you enter stay on your device instead of being uploaded to our servers.',
    },
    {
      icon: <Shield className="h-6 w-6 text-[#e5322d]" />,
      title: 'Clear About How Each Tool Works',
      description: 'If a tool needs live data or server processing, the page explains that clearly. We never make vague privacy claims when a tool requires a server.',
    },
    {
      icon: <Zap className="h-6 w-6 text-[#e5322d]" />,
      title: 'No Account Required',
      description: 'Open a tool and use it immediately. Navorika does not require an account, email sign-up, subscription, or software installation.',
    },
    {
      icon: <Cpu className="h-6 w-6 text-[#e5322d]" />,
      title: 'Calculations Are Verified',
      description: 'Calculator formulas are based on standard, documented methods and verified with automated tests covering normal values, edge cases, and boundary limits.',
    },
  ];

  return (
    <main className="min-h-screen bg-[#f7f7f8] dark:bg-[#121214] text-[#18181b] dark:text-[#f4f4f5] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff1f1] dark:bg-[#e5322d]/10 border border-[#fecaca] dark:border-[#e5322d]/20 text-[#e5322d] text-xs font-semibold mb-4">
            About Navorika
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#18181b] dark:text-white tracking-tight leading-tight mb-4">
            Free Online Calculators &amp; Tools
          </h1>
          <p className="text-base sm:text-lg text-[#5b5b63] dark:text-[#a1a1aa] max-w-2xl mx-auto leading-relaxed">
            Navorika is an independent utility website providing over {activeToolCount} free calculators and tools for PDF, images, money, health, construction, everyday tasks, and web development. Most tools run directly in your browser.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#e5322d] hover:bg-[#c71f1e] text-white font-semibold text-sm transition-colors shadow-xs"
            >
              Browse Free Tools <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/methodology"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] text-[#18181b] dark:text-white hover:border-[#e5322d]/40 font-semibold text-sm transition-colors shadow-xs"
            >
              How Our Calculators Work
            </Link>
          </div>
        </section>

        {/* Philosophy */}
        <section className="mb-14">
          <h2 className="text-xl sm:text-2xl font-bold text-[#18181b] dark:text-white mb-5">What You Can Expect</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {corePrinciples.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-5 rounded-xl bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] shadow-xs break-words"
              >
                <div className="mb-3">{principle.icon}</div>
                <h3 className="text-base font-bold text-[#18181b] dark:text-white mb-1.5">{principle.title}</h3>
                <p className="text-sm text-[#5b5b63] dark:text-[#a1a1aa] leading-relaxed">
                  {principle.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tool Categories */}
        <section className="mb-14">
          <h2 className="text-xl sm:text-2xl font-bold text-[#18181b] dark:text-white mb-5">What You Can Do on Navorika</h2>
          <div className="space-y-3">
            {toolCategories.map((cat) => (
              <div
                key={cat.title}
                className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] shadow-xs flex items-start gap-3.5"
              >
                <div className="grid size-10 place-items-center rounded-lg bg-[#fff1f1] dark:bg-[#e5322d]/10 shrink-0 mt-0.5">
                  {cat.icon}
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#18181b] dark:text-white">{cat.title}</h3>
                  <p className="text-xs sm:text-sm text-[#5b5b63] dark:text-[#a1a1aa] mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How Tools are Developed and Tested */}
        <section className="mb-14 p-6 sm:p-7 rounded-xl bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] shadow-xs">
          <h2 className="text-xl font-bold text-[#18181b] dark:text-white mb-3">How We Build and Check Our Tools</h2>
          <div className="space-y-3 text-sm text-[#5b5b63] dark:text-[#a1a1aa] leading-relaxed">
            <p>
              We build calculators from documented formulas, official regulations where applicable, and standard industry methods. For example, loan tools use standard compound amortization formulas, tax tools use published statutory rates, and construction tools use recognized material and measurement formulas.
            </p>
            <p>
              Automated tests verify calculator results against normal scenarios, zero-value conditions, boundary limits, and unexpected inputs. We review and update tools whenever underlying formulas or standards change.
            </p>
            <p>
              For complete details on formulas, sources, and testing, see our{' '}
              <Link href="/methodology" className="text-[#e5322d] hover:text-[#c71f1e] dark:text-[#ff6b68] font-semibold hover:underline">
                Methodology &amp; Standards
              </Link>{' '}
              guide.
            </p>
          </div>
        </section>

        {/* Technical Limitations */}
        <section className="mb-14 p-6 sm:p-7 rounded-xl border border-amber-500/25 bg-amber-500/5 dark:bg-amber-500/10 shadow-xs">
          <div className="flex items-center gap-3 mb-2.5">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <h2 className="text-lg font-bold text-[#18181b] dark:text-white">What to Know Before You Use a Result</h2>
          </div>
          <div className="space-y-2.5 text-sm text-[#5b5b63] dark:text-[#a1a1aa] leading-relaxed">
            <p>
              Browser-based tools operate within standard browser memory limits. Very large PDF files or high-resolution images can require substantial RAM and may process slower on mobile devices.
            </p>
            <p>
              Calculators provide practical estimates for everyday planning. For formal legal, tax, medical, structural, or financial commitments, always consult a qualified professional. Read our{' '}
              <Link href="/disclaimer" className="text-[#e5322d] hover:text-[#c71f1e] dark:text-[#ff6b68] font-semibold hover:underline">
                Disclaimer
              </Link>{' '}
              for full terms.
            </p>
          </div>
        </section>

        {/* Quick Links */}
        <section className="p-6 rounded-xl bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] shadow-xs text-center text-sm text-[#5b5b63] dark:text-[#a1a1aa] space-y-2.5">
          <p className="font-semibold text-xs text-[#18181b] dark:text-white uppercase tracking-wider">Policies and Helpful Information</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
            <Link href="/methodology" className="text-[#5b5b63] dark:text-[#a1a1aa] hover:text-[#e5322d] dark:hover:text-[#ff6b68] transition-colors">
              How Calculators Work
            </Link>
            <Link href="/disclaimer" className="text-[#5b5b63] dark:text-[#a1a1aa] hover:text-[#e5322d] dark:hover:text-[#ff6b68] transition-colors">
              Legal Disclaimer
            </Link>
            <Link href="/privacy" className="text-[#5b5b63] dark:text-[#a1a1aa] hover:text-[#e5322d] dark:hover:text-[#ff6b68] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[#5b5b63] dark:text-[#a1a1aa] hover:text-[#e5322d] dark:hover:text-[#ff6b68] transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-[#5b5b63] dark:text-[#a1a1aa] hover:text-[#e5322d] dark:hover:text-[#ff6b68] transition-colors">
              Contact Us
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
