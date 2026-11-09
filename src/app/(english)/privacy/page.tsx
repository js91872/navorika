'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, ArrowLeft, Lock, Eye, Database, Cookie, Globe, UserRound, Clock, Mail, Server, FileText } from 'lucide-react';

function formatPointText(text: string) {
  if (text.includes('https://www.google.com/settings/ads') || text.includes('www.aboutads.info/choices/')) {
    const parts = text.split(/(https:\/\/www\.google\.com\/settings\/ads|www\.aboutads\.info\/choices\/)/g);
    return (
      <span className="break-words">
        {parts.map((part, i) => {
          if (part === 'https://www.google.com/settings/ads') {
            return (
              <a
                key={i}
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline break-all mx-0.5"
              >
                https://www.google.com/settings/ads
              </a>
            );
          }
          if (part === 'www.aboutads.info/choices/') {
            return (
              <a
                key={i}
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline break-all mx-0.5"
              >
                www.aboutads.info/choices/
              </a>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </span>
    );
  }
  return text;
}

export default function PrivacyPage() {
  const lastUpdated = 'November 9, 2026';

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
      content: 'We may use advertising services such as Google AdSense. Advertising cookies and personalization depend on whether ads are enabled, your consent choices, and applicable law:',
      list: [
        'Google AdSense: If ads are enabled, Google and other advertising vendors may use cookies or similar technologies subject to applicable consent requirements',
        'Personalized Advertising: If enabled and permitted by your choices and applicable law, ads may be tailored based on activity on this or other websites',
        'Opt-Out Choices: You may opt out of personalized advertising by visiting Google Ads Settings (https://www.google.com/settings/ads) or through third-party opt-out services such as www.aboutads.info/choices/',
        'Analytics: Analytics services, where enabled, may collect usage events and technical identifiers. Reports may be aggregated, but this does not mean every underlying event is anonymous',
        'Local Storage: Browser storage may remember interface preferences and tool settings. You can clear stored data through your browser controls',
      ],
    },
    {
      icon: <FileText className="h-6 w-6 text-indigo-500" />,
      title: 'Information We Collect',
      content: 'You can use most tools without creating an account. Depending on how you use Navorika, information may include:',
      list: [
        'Values or files you choose to process; browser-local tool inputs are not sent to our servers for processing',
        'Files sent to explicitly identified server-based conversion tools, solely to perform the requested operation',
        'Technical request information, such as IP address, browser type, approximate location derived from IP address, requested pages and diagnostic information, that hosting, security or analytics providers may process',
        'Information you voluntarily provide when contacting us, such as your email address and message',
        'Preferences stored in your browser and analytics or advertising identifiers where those services are enabled',
      ],
    },
    {
      icon: <Server className="h-6 w-6 text-indigo-500" />,
      title: 'Why We Process Information',
      content: 'We process information only for relevant website and service purposes, subject to applicable law:',
      list: [
        'To provide requested tools and deliver converted or calculated results',
        'To operate, protect, troubleshoot and improve the website',
        'To respond to support requests and other direct correspondence',
        'To understand website usage through analytics, where enabled',
        'To show advertising if introduced, subject to consent and other applicable requirements',
        'Where GDPR or UK GDPR applies, the relevant legal basis may be consent, legitimate interests, contractual necessity or a legal obligation, depending on the processing activity',
      ],
    },
    {
      icon: <Clock className="h-6 w-6 text-indigo-500" />,
      title: 'Storage and Retention',
      content: 'Retention depends on the kind of information and the tool involved. We do not promise a universal deletion time for every system or third-party provider.',
      list: [
        'Browser-local inputs are processed on your device; browser memory, downloads and browser storage remain subject to your device and browser settings',
        'Server-based conversions use isolated temporary workspaces intended to be cleared after processing. Technical failures or operational backups may require separate handling',
        'Contact messages may be retained for as long as reasonably necessary to respond and maintain relevant records',
        'Hosting, security and analytics providers may retain technical data according to their own settings and policies',
        'We review retention practices and remove information when it is no longer needed, subject to applicable legal and security obligations',
      ],
    },
    {
      icon: <Globe className="h-6 w-6 text-indigo-500" />,
      title: 'Third-Party Services and International Processing',
      content: 'Some services needed to run Navorika are provided by third parties. These providers may process technical data in countries outside your own, subject to applicable legal safeguards.',
      list: [
        'Hosting and infrastructure providers may receive network requests and technical logs to deliver and secure the site',
        'Google Analytics 4, where enabled, may process page views, device information and related analytics data under Google’s policies',
        'External data providers are used only where a tool explains that live information is required',
        'Google AdSense or other advertising providers may process information if advertising is enabled in the future',
        'We do not sell uploaded file contents. Third-party services have their own privacy notices and controls',
      ],
    },
    {
      icon: <UserRound className="h-6 w-6 text-indigo-500" />,
      title: 'Your Privacy Rights',
      content: 'Depending on where you live and the laws that apply, you may have rights regarding personal information we hold or process.',
      list: [
        'Request access to, correction of or deletion of eligible personal information',
        'Request restriction of processing, object to certain processing or request data portability where applicable',
        'Withdraw consent where processing relies on consent; withdrawal does not affect earlier lawful processing',
        'California and other US state residents may have additional rights to know, delete, correct or opt out of certain data uses',
        'Contact us through our contact page to make a privacy request. We may need to verify your request and will respond within applicable legal time limits',
        'You may also contact the relevant data protection authority if you believe your rights have been infringed',
      ],
    },
    {
      icon: <Lock className="h-6 w-6 text-indigo-500" />,
      title: 'Security',
      content: 'We use reasonable technical and organizational measures to protect the website and information processed through it. Browser-local processing reduces the need to transfer file contents to our servers. However, no online service, device or transmission method can guarantee absolute security.',
    },
    {
      icon: <Eye className="h-6 w-6 text-indigo-500" />,
      title: 'Children’s Privacy',
      content: 'Navorika is intended for a general audience and is not designed to collect personal information from children. If you believe a child has provided personal information to us, please contact us so we can review the request.',
    },
    {
      icon: <Mail className="h-6 w-6 text-indigo-500" />,
      title: 'Policy Changes and Contact',
      content: 'We may revise this policy as our tools, providers and legal obligations change. The date at the top indicates the latest revision. For privacy questions, requests or concerns, use the Navorika contact page. For privacy inquiries, use our contact page. This public policy does not display the website operator’s personal name, residential address or location.',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 pb-16">
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
              className="p-4 sm:p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] break-words overflow-hidden"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                  {section.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold mb-2">{section.title}</h2>
                  <p className="text-[var(--muted-foreground)] leading-relaxed break-words">
                    {section.content}
                  </p>
                  {section.list && (
                    <ul className="mt-3 space-y-2">
                      {section.list.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[var(--muted-foreground)] break-words">
                          <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                          <div className="min-w-0 break-words">{formatPointText(item)}</div>
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
            Questions about our privacy policy? Use the{' '}
            <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              contact page
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
