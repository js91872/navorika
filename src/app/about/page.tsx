'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield, Zap, Globe, Lock, Rocket, Sparkles,
  CheckCircle, ArrowRight, Heart, Cpu, Target, Eye,
  Users, Award, Briefcase, Clock, Server, Database
} from 'lucide-react';

export default function AboutPage() {
  // Stats - SEO friendly numbers
  const stats = [
    { icon: <Cpu className="h-6 w-6" />, value: '200+', label: 'Free Online Tools' },
    { icon: <Shield className="h-6 w-6" />, value: '100%', label: 'Client-Side Processing' },
    { icon: <Zap className="h-6 w-6" />, value: '0ms', label: 'Server Latency' },
    { icon: <Lock className="h-6 w-6" />, value: '0', label: 'Data Uploads' },
  ];

  // SEO-focused content
  const values = [
    {
      icon: <Lock className="h-8 w-8" />,
      title: '100% Privacy-First Design',
      description: 'Your data never leaves your device. All 200+ tools process everything locally in your browser. No uploads, no storage, no tracking.',
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Zero-Latency Execution',
      description: 'No server delays. Every tool responds instantly because it runs right where you are. Perfect for quick calculations and conversions.',
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      title: 'Built for the Modern Web',
      description: 'Designed for 2030 and beyond. Fast, responsive, and works on every device. No downloads, no plugins, no signup required.',
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Free Forever',
      description: 'No hidden costs, no premium plans. All 200+ tools are completely free to use. We believe essential tools should be accessible to everyone.',
    },
  ];

  // SEO-friendly reasons
  const reasons = [
    {
      icon: <CheckCircle className="h-6 w-6 text-emerald-500" />,
      title: 'No Data Uploads – Your Files Stay Private',
      description: 'Everything runs locally in your browser. We never see, store, or process your files on any server.',
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-emerald-500" />,
      title: 'No Signup or Registration Required',
      description: 'Start using any tool instantly. No accounts, no emails, no passwords to remember.',
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-emerald-500" />,
      title: '200+ Tools Across 6 Categories',
      description: 'Calculators, PDF editors, image converters, developer utilities, health tools, and more.',
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-emerald-500" />,
      title: '100% Client-Side JavaScript',
      description: 'All code runs in your browser. No external API calls, no background uploads, no tracking scripts.',
    },
  ];

  return (
    <>
      {/* SEO Metadata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'NavorikaPro – 200+ Free Online Tools & Calculators',
            description: 'NavorikaPro is a free platform with 200+ online tools, calculators, PDF editors, and utilities. 100% client-side, no data uploads, no signup required.',
            url: 'https://navorika.vercel.app/about',
            mainEntity: {
              '@type': 'Organization',
              name: 'NavorikaPro',
              description: 'Free online tools platform with 200+ calculators, PDF editors, image converters, and developer utilities.',
              url: 'https://navorika.vercel.app',
              foundingDate: '2024',
              numberOfEmployees: '5-10',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                description: 'All tools are completely free to use.',
              },
            },
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://navorika.vercel.app/tools?q={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />

      <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 pb-16">
        {/* ====== HERO ====== */}
        <section className="relative overflow-hidden px-4 py-16 md:py-24">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6"
            >
              <Eye className="h-4 w-4" />
              About NavorikaPro
            </motion.div>

            {/* SEO-friendly H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05] mb-6"
            >
              NavorikaPro – 200+ Free Online Tools
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Built for Privacy &amp; Speed
              </span>
            </motion.h1>

            {/* SEO-friendly description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed"
            >
              NavorikaPro is a free, client-side platform with 200+ online tools,
              calculators, PDF editors, image converters, and developer utilities.
              100% private. Zero data uploads. No signup required.
            </motion.p>

            {/* SEO-friendly CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:shadow-xl transition-all hover:scale-105"
              >
                Explore 200+ Free Tools <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/guides"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-indigo-500/40 transition-all"
              >
                Read Our Guides
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ====== STATS ====== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" aria-label="Platform statistics">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center"
              >
                <div className="text-3xl mb-2 text-indigo-600 dark:text-indigo-400">
                  {stat.icon}
                </div>
                <div className="text-3xl font-black">{stat.value}</div>
                <div className="text-sm text-[var(--muted-foreground)]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ====== WHAT IS NavorikaPro? ====== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold">What is NavorikaPro?</h2>
            <p className="text-[var(--muted-foreground)] mt-2">The world's most advanced client-side tool platform</p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]"
            >
              <p className="text-[var(--muted-foreground)] leading-relaxed text-lg">
                <strong>NavorikaPro</strong> is a free online platform offering <strong>200+ tools</strong> including calculators, 
                PDF editors, image converters, developer utilities, and health calculators. 
                All tools run <strong>100% client-side</strong> – your data never leaves your device.
              </p>
              <ul className="mt-4 space-y-2 text-[var(--muted-foreground)]">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>200+ Tools</strong> – Calculators, PDF tools, image editors, and more</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>100% Client-Side</strong> – Everything runs in your browser</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>No Data Uploads</strong> – Your files never leave your device</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>No Signup Required</strong> – Start using tools instantly</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* ====== OUR VALUES ====== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold">Our Values</h2>
            <p className="text-[var(--muted-foreground)] mt-2">The principles that guide everything we build</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-indigo-500/40 transition-all text-center group"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {value.icon}
                </div>
                <h3 className="font-bold mb-2">{value.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ====== WHY CHOOSE US ====== */}
        <section className="bg-[var(--muted)]/30 border-y border-[var(--border)] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold">Why Choose NavorikaPro?</h2>
              <p className="text-[var(--muted-foreground)] mt-2">Built differently. Built better.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reasons.map((reason, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]"
                >
                  <div className="mt-1">{reason.icon}</div>
                  <div>
                    <h3 className="font-bold">{reason.title}</h3>
                    <p className="text-sm text-[var(--muted-foreground)]">{reason.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ====== MISSION ====== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 sm:p-12 text-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10" />

            <div className="relative z-10">
              <Target className="h-12 w-12 text-white/80 mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Our Mission</h2>
              <p className="text-white/80 max-w-2xl mx-auto text-lg leading-relaxed">
                To build the world's most advanced client-side computing platform —
                where privacy is absolute, performance is instant, and tools are always
                within reach. Free for everyone. Forever.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-900 font-semibold hover:shadow-xl transition-all hover:scale-105"
                >
                  Explore Tools <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/guides"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 text-white font-semibold hover:bg-white/30 transition-all"
                >
                  Read Guides <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ====== CTA ====== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="p-8 sm:p-12 rounded-3xl bg-[var(--card)] border border-[var(--border)] text-center">
            <Sparkles className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Ready to experience the future?</h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto mb-6">
              Join thousands of users who trust NavorikaPro for their daily productivity.
              All 200+ tools are completely free to use.
            </p>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:shadow-xl transition-all hover:scale-105"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
