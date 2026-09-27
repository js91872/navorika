'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, ArrowLeft, Shield, AlertTriangle, Scale, HelpCircle } from 'lucide-react';

export default function TermsPage() {
  const lastUpdated = 'September 27, 2026';

  const sections = [
    {
      icon: <Scale className="h-6 w-6 text-indigo-500" />,
      title: '1. Agreement to Terms',
      content: 'By accessing or using Navorika (navorika.com), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.',
    },
    {
      icon: <FileText className="h-6 w-6 text-indigo-500" />,
      title: '2. Description of Service',
      content: 'Navorika provides free web-based utilities, calculators, document conversion tools, and developer aids. Most tools operate client-side directly within your browser, while specific specialized utilities (such as CAD and vector format converters) operate via ephemeral server-assisted processing. All services are provided free of charge for personal and commercial productivity.',
    },
    {
      icon: <Shield className="h-6 w-6 text-indigo-500" />,
      title: '3. Intellectual Property and User Files',
      content: 'You retain full ownership, copyright, and intellectual property rights to all files, text, images, and data that you process through Navorika tools. Navorika does not claim ownership or license rights over your processed files. For client-side tools, your files are never transmitted to our servers. For server-assisted tools, uploaded files are processed temporarily in isolated execution environments and deleted automatically upon completion.',
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-indigo-500" />,
      title: '4. Acceptable Use',
      content: 'You agree to use Navorika only for lawful purposes. You agree not to:',
      list: [
        'Attempt to reverse engineer, decompile, or bypass security sandboxes implemented on the platform',
        'Use automated bots, scrapers, or excessive programmatic queries that degrade site performance for other users',
        'Upload or process files containing malicious software, viruses, or harmful computer code',
        'Misrepresent calculation outputs as certified engineering, medical, or tax documents without independent professional verification',
      ],
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-amber-500" />,
      title: '5. Disclaimer of Warranties',
      content: 'Navorika and all tools, calculations, guides, and services are provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. While we strive for mathematical and technical precision, we do not guarantee that the service will be uninterrupted, error-free, or that calculation results will meet specific statutory or engineering requirements. Users are advised to review our dedicated Disclaimer and Methodology pages.',
    },
    {
      icon: <Scale className="h-6 w-6 text-indigo-500" />,
      title: '6. Limitation of Liability',
      content: 'In no event shall Navorika, its operators, or contributors be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of your access to or use of the tools, including but not limited to loss of data, calculation errors, construction cost variances, financial decisions, or business interruption.',
    },
    {
      icon: <HelpCircle className="h-6 w-6 text-indigo-500" />,
      title: '7. Modifications and Inquiries',
      content: 'We reserve the right to revise these Terms of Service at any time without prior notice. By continuing to use the platform after revisions are published, you agree to be bound by the updated terms.',
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
              <Scale className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Terms of Service</h1>
              <p className="text-[var(--muted-foreground)] mt-1">
                Last updated: {lastUpdated}
              </p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-sm">
            <CheckCircle className="h-5 w-5 inline mr-2" />
            <span>Navorika tools are free to use. Review these terms regarding intellectual property, acceptable use, and limitations.</span>
          </div>
        </div>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
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

        <div className="mt-12 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center">
          <p className="text-sm text-[var(--muted-foreground)]">
            Questions regarding our Terms of Service? Contact us at{' '}
            <a
              href="mailto:admin@navorika.com"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              admin@navorika.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
