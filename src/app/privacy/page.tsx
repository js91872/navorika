'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, ArrowLeft, Lock, Eye, Database, Cookie } from 'lucide-react';

export default function PrivacyPage() {
  const lastUpdated = 'August 24, 2026';

  const sections = [
    {
      icon: <Shield className="h-6 w-6 text-indigo-500" />,
      title: 'Privacy First by Design',
      content: 'Most Navorika tools process files and inputs locally in your browser. Tools that require live external data identify their source. Information you deliberately submit through the contact form is sent to Navorika.',
    },
    {
      icon: <Lock className="h-6 w-6 text-indigo-500" />,
      title: 'Tool Inputs and Files',
      content: 'Local-processing tools do not send the selected file or entered calculation values to Navorika. Exceptions are stated by the relevant feature, including:',
      list: [
        'The currency converter requests the selected currency pair from its named rate provider',
        'The contact form sends the email address and message you choose to submit',
        'Site analytics may receive standard page and device information',
      ],
    },
    {
      icon: <Eye className="h-6 w-6 text-indigo-500" />,
      title: 'What Happens to Your Data',
      content: 'For tools labeled as local processing, the primary operation happens in your browser:',
      list: [
        'Files are processed locally in your browser using WebAssembly and JavaScript',
        'Selected files are handled by browser APIs and tool libraries',
        'Generated downloads are created on your device',
        'Live-data and contact features are separate and clearly described',
      ],
    },
    {
      icon: <Database className="h-6 w-6 text-indigo-500" />,
      title: 'Local Processing Explained',
      content: 'Navorika uses browser technologies for most tool operations:',
      list: [
        'PDF processing: Uses pdf-lib and pdf.js running entirely in your browser',
        'Image processing: Uses Canvas API and WebAssembly',
        'Calculations: Most formulas execute in JavaScript on your device',
        'External data: Live-rate tools contact the source identified in the tool',
      ],
    },
    {
      icon: <Cookie className="h-6 w-6 text-indigo-500" />,
      title: 'Analytics and Local Storage',
      content: 'The site uses analytics to understand site usage and local storage for preferences:',
      list: [
        'No third-party advertising',
        'Google Analytics is loaded on site pages',
        'Theme preference may be stored locally in your browser',
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Privacy Policy</h1>
              <p className="text-[var(--muted-foreground)] mt-1">
                Last updated: {lastUpdated}
              </p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm">
            <CheckCircle className="h-5 w-5 inline mr-2" />
            <span className="font-medium">Most tools process data locally. Live-data tools identify their external source.</span>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  {section.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">{section.title}</h2>
                  <p className="text-[var(--muted-foreground)] leading-relaxed">
                    {section.content}
                  </p>
                  {section.list && (
                    <ul className="mt-3 space-y-2">
                      {section.list.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[var(--muted-foreground)]">
                          <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center">
          <p className="text-sm text-[var(--muted-foreground)]">
            Questions about our privacy policy? Contact us at{' '}
            <a
              href="mailto:privacy@navorika.com"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              privacy@navorika.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
