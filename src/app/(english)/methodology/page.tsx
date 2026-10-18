'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Cpu,
  Server,
  Calculator,
  Globe,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Binary,
  Layers,
} from 'lucide-react';

export default function MethodologyPage() {
  const lastUpdated = 'September 27, 2026';

  const sections = [
    {
      icon: <Cpu className="h-6 w-6 text-indigo-500" />,
      title: '1. How Browser-Based Tools Handle Your Data',
      description: 'Most tools run in your browser so your files and inputs can stay on your device.',
      details: [
        'Most tools run in your browser: PDF tools, image converters, calculators, and many developer utilities use browser technology such as JavaScript, WebAssembly, and built-in browser APIs.',
        'Files usually stay on your device: when a tool is marked as browser-local, files and entered values are processed in your browser memory and are not uploaded to or stored on Navorika servers.',
        'Technical details: document tools may use libraries such as pdf-lib and pdf.js, image tools may use HTML Canvas, and security-related tools may use the browser’s Web Cryptography API.',
      ],
    },
    {
      icon: <Server className="h-6 w-6 text-indigo-500" />,
      title: '2. When a Tool Needs Our Server',
      description: 'A small number of specialized conversions need temporary server processing.',
      details: [
        'Some formats need server software: specialized conversions such as STEP CAD to 3D PDF and some CorelDRAW-related conversions cannot be completed entirely inside a normal web browser.',
        'Temporary processing: server-assisted conversions run in a temporary isolated workspace created for the request.',
        'Files are not kept as a library: input and output files are removed after the conversion finishes or fails. Navorika does not offer permanent document storage for these conversions.',
      ],
    },
    {
      icon: <Calculator className="h-6 w-6 text-indigo-500" />,
      title: '3. How Calculator Formulas Are Chosen',
      description: 'We use documented formulas, official rules, and recognized reference methods where they apply.',
      details: [
        'Money calculators: loan-payment tools use standard amortization formulas. Savings and investment tools use standard growth formulas. Tax calculators use the published rules and thresholds described on the relevant tool pages.',
        'Health and fitness calculators: tools use published equations such as Mifflin-St Jeor for BMR and established activity or heart-rate methods where appropriate. These are estimates, not medical diagnoses.',
        'Construction calculators: quantity tools use measurements such as length × width × depth, along with stated material assumptions. Where a tool refers to a building-code rule or structural limit, the relevant source or limitation should be shown on the page.',
      ],
    },
    {
      icon: <Globe className="h-6 w-6 text-indigo-500" />,
      title: '4. When a Tool Uses Live Data',
      description: 'Tools that need current information clearly identify the outside data source they use.',
      details: [
        'Currency converter: the tool uses published reference exchange-rate data and shows the date or time of the rate used when that information is available.',
        'Only the information needed for the request is sent to the data source; the calculation history is not intentionally included as part of the rate lookup.',
      ],
    },
    {
      icon: <CheckCircle2 className="h-6 w-6 text-indigo-500" />,
      title: '5. How We Test Calculators and Converters',
      description: 'Automated tests help catch wrong results, broken conversions, and unusual input problems.',
      details: [
        'Calculation tests: automated tests check common examples, zero values, limits, and invalid inputs so mistakes can be found before deployment.',
        'Rounding checks: calculator outputs are rounded in controlled ways so normal computer math does not show distracting values such as 0.30000000000000004.',
        'Security checks: tools that handle HTML or other active content are tested to reduce unsafe scripts, links, or other active behavior before rendering.',
      ],
    },
    {
      icon: <AlertCircle className="h-6 w-6 text-indigo-500" />,
      title: '6. Limits You Should Know About',
      description: 'Browser tools and automated estimates have practical limits that can affect results.',
      details: [
        'Very large files: huge PDFs or images can use more memory than a browser tab or mobile device can handle, which may cause a tool to slow down or fail.',
        'Very large images: browsers place limits on the image sizes they can process in memory. A tool may need to reduce or reject an image that exceeds those browser limits.',
        'Image metadata: converting or re-encoding an image can remove camera EXIF data, GPS information, or color profiles unless a tool specifically preserves them.',
        'CorelDRAW conversions: some tools prepare PDF, SVG, or EPS files that CorelDRAW can import rather than creating a native CDR file. Each affected tool explains the actual output.',
      ],
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-indigo-500" />,
      title: '7. How We Review and Update Tools',
      description: 'We review formulas, rules, dependencies, and reported problems as tools are maintained.',
      details: [
        'Rules that change: tax and retirement tools are reviewed when relevant published rules or annual thresholds change.',
        'Software maintenance: third-party libraries and browser dependencies are updated as needed for security fixes and compatibility.',
        'Report a problem: users can contact us when a result, formula, or tool behavior looks wrong so it can be reviewed.',
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Layers className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">How Navorika Calculators &amp; Tools Work</h1>
              <p className="text-[var(--muted-foreground)] mt-1">
                Last updated: {lastUpdated}
              </p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-sm leading-relaxed">
            <Binary className="h-5 w-5 inline mr-2 align-text-bottom" />
            <span>
              How we choose formulas, handle files and data, test results, and explain the limits of our tools.
            </span>
          </div>
        </div>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
              className="p-6 sm:p-8 rounded-2xl bg-[var(--card)] border border-[var(--border)]"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0 mt-1">
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{section.title}</h2>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1">{section.description}</p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-[var(--border)]">
                {section.details.map((detail, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-[var(--muted-foreground)] leading-relaxed">
                    <span className="text-indigo-500 font-bold mt-0.5">•</span>
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center text-sm text-[var(--muted-foreground)]">
          <p>
            Review our{' '}
            <Link href="/disclaimer" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              Legal Disclaimer
            </Link>{' '}
            for important limitations. To report a wrong result or tool problem, use the{' '}
            <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              contact page
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
