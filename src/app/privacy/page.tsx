'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, ArrowLeft, Lock, Eye, Database, Cookie } from 'lucide-react';

export default function PrivacyPage() {
  const lastUpdated = 'September 27, 2026';

  const sections = [
    {
      icon: <Shield className="h-6 w-6 text-indigo-500" />,
      title: 'How Navorika Handles Your Data',
      content: 'Most Navorika tools process files and calculator inputs directly in your browser. When a tool needs live external data or temporary server processing, the page explains that.',
    },
    {
      icon: <Lock className="h-6 w-6 text-indigo-500" />,
      title: 'Tool Inputs and Files',
      content: 'For tools designated as browser-local processing, your files and inputs are never uploaded to Navorika servers. Where server processing or external data is required, it is explicitly disclosed:',
      list: [
        'Browser-local tools process the file or values on your device',
        'Some specialized converters, such as STEP to 3D PDF or certain CorelDRAW-related tools, use temporary server processing. Files are handled in isolated temporary folders and removed after the request finishes',
        'Tools that need current information, such as currency rates, may request data from an external provider identified on the page',
        'Direct correspondence sent via email is processed solely to respond to your inquiry',
      ],
    },
    {
      icon: <Eye className="h-6 w-6 text-indigo-500" />,
      title: 'What Happens When You Use a Tool',
      content: 'For tools marked as browser-local:',
      list: [
        'Files are processed in your browser using normal web technologies',
        'Temporary data stays in browser memory and is cleared when the page or tab is closed or reset',
        'Downloaded results are saved to your device',
        'We do not maintain account databases, user tracking profiles, or persistent server logs of your file contents',
      ],
    },
    {
      icon: <Database className="h-6 w-6 text-indigo-500" />,
      title: 'How Browser-Based Processing Works',
      content: 'Different tools use different browser technologies depending on the job:',
      list: [
        'PDF tools may use browser-based PDF libraries such as pdf-lib and pdf.js',
        'Image tools may use Canvas, ImageData, or WebAssembly in your browser',
        'Calculators run their formulas directly in your browser',
        'Security-related tools may use the browser’s built-in Web Crypto API',
      ],
    },
    {
      icon: <Cookie className="h-6 w-6 text-indigo-500" />,
      title: 'Advertising and Cookies',
      content: 'Navorika partners with third-party advertising networks to support our free tools:',
      list: [
        'Google AdSense: Third-party vendors, including Google, use cookies to serve ads based on a user’s prior visits to this website or other websites on the Internet',
        'Personalized Advertising: Google’s use of advertising cookies enables it and its partners to serve ads to users based on their visits to our site and/or other sites across the web',
        'Opt-Out Choices: You may opt out of personalized advertising by visiting Google Ads Settings (https://www.google.com/settings/ads) or through third-party opt-out services such as www.aboutads.info/choices/',
        'Analytics: Aggregated, anonymized traffic analytics help us understand site usage and improve tool performance without identifying individual users',
        'Local Storage: Browser localStorage is used strictly to remember your preferences (such as light or dark display mode) and does not contain personal identifying information',
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
            <span className="font-medium">Most tools run in your browser. Tools that need a server or outside data say so on the page.</span>
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
