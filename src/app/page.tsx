'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  Sparkles,
  Search,
  FileText,
  Image,
  Calculator,
  HeartPulse,
  Code,
  Wrench,
  CheckCircle,
  Lock,
  Rocket,
  Users,
  Clock,
  ShieldCheck,
  Globe,
  Laptop
} from 'lucide-react';
import { tools, categories } from '@/data/registry';

const categoryIcons: Record<string, any> = {
  'pdf-tools': FileText,
  'image-tools': Image,
  'finance-calculators': Calculator,
  'health-calculators': HeartPulse,
  'developer-tools': Code,
  'construction-calculators': Wrench,
};

const categoryColors: Record<string, string> = {
  'pdf-tools': 'from-blue-500 to-indigo-600',
  'image-tools': 'from-violet-500 to-purple-600',
  'finance-calculators': 'from-emerald-500 to-teal-600',
  'health-calculators': 'from-rose-500 to-pink-600',
  'developer-tools': 'from-amber-500 to-orange-600',
  'construction-calculators': 'from-cyan-500 to-blue-600',
};

export default function Home() {
  const totalTools = tools.length;
  const displayCount = totalTools >= 100 ? '100+' : `${totalTools}+`;

  return (
    <main className="flex-1 pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="bg-[var(--background)] text-[var(--foreground)]">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden px-4 pt-24 pb-16 md:pt-32 md:pb-24">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-purple-500/5 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400"></span>
              </span>
              Zero-latency · Local processing
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mb-4">
              {displayCount} Free Online Calculators, PDF Tools, Image Tools &amp; Productivity Utilities
            </h1>

            <p className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Fast. Free. No Signup.
            </p>

            <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed mb-8">
              Navorika is a free, client-side suite of {displayCount} online tools including calculators, PDF editors, image converters, and developer utilities. Everything runs locally in your browser — no uploads, no signup, no tracking.
            </p>

            <button className="flex items-center gap-3 max-w-lg mx-auto w-full p-3 rounded-full bg-[var(--card)] border border-[var(--border)] hover:border-indigo-400/50 transition-all text-left shadow-lg hover:shadow-indigo-500/10">
              <span className="pl-2 text-[var(--muted-foreground)]">🔍</span>
              <span className="flex-1 text-[var(--muted-foreground)]">Search {displayCount} tools...</span>
              <kbd className="px-2 py-1 rounded bg-[var(--muted)] text-[var(--muted-foreground)] text-xs font-mono">⌘K</kbd>
            </button>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-[var(--muted-foreground)]">
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-indigo-500" />
                100% client-side
              </span>
              <span className="w-px h-4 bg-[var(--border)]"></span>
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" />
                No data uploaded
              </span>
              <span className="w-px h-4 bg-[var(--border)]"></span>
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                {displayCount} tools
              </span>
              <span className="w-px h-4 bg-[var(--border)]"></span>
              <span className="flex items-center gap-2">🔒 No signup required</span>
            </div>
          </div>
        </section>

        {/* FREE ONLINE TOOLS FOR EVERYDAY TASKS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[var(--border)]">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Free Online Tools for Everyday Tasks</h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              Whether you need to compress a PDF, resize an image, calculate your BMI, or generate a QR code, Navorika has you covered. All tools are completely free, private, and work directly in your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="font-bold text-lg mb-2">PDF Tools</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Merge, split, compress, and convert PDF documents without uploading files.</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <div className="text-4xl mb-4">🖼️</div>
              <h3 className="font-bold text-lg mb-2">Image Tools</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Resize, compress, crop, and convert images in formats like JPG, PNG, and WebP.</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="font-bold text-lg mb-2">Finance Calculators</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Calculate SIP returns, EMI, GST, taxes, and plan your investments.</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="font-bold text-lg mb-2">Health Calculators</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Check your BMI, BMR, TDEE, body fat, and other health metrics.</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="font-bold text-lg mb-2">Developer Tools</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Encode Base64, decode JWT, format JSON, generate QR codes, and more.</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="font-bold text-lg mb-2">Construction Tools</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Calculate concrete, cement, bricks, steel weight, and construction costs.</p>
            </div>
          </div>
        </section>

        {/* WHY USE NAVORIKA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[var(--border)]">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Use Navorika?</h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              Thousands of users trust Navorika for their daily productivity needs.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center hover:border-indigo-500/40 transition-all">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-bold mb-1">100% Free</h3>
              <p className="text-sm text-[var(--muted-foreground)]">No hidden costs, no premium plans</p>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center hover:border-indigo-500/40 transition-all">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="font-bold mb-1">No Signup</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Start using any tool instantly</p>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center hover:border-indigo-500/40 transition-all">
              <div className="text-3xl mb-3">🌐</div>
              <h3 className="font-bold mb-1">Browser-Based</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Works on any device, no downloads</p>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center hover:border-indigo-500/40 transition-all">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-bold mb-1">Privacy Focused</h3>
              <p className="text-sm text-[var(--muted-foreground)]">No file uploads, no tracking</p>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center hover:border-indigo-500/40 transition-all">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-bold mb-1">Fast</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Instant processing in your browser</p>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center hover:border-indigo-500/40 transition-all">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="font-bold mb-1">{displayCount} Tools</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Wide range of utilities</p>
            </div>
          </div>
        </section>

        {/* CATEGORIES SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[var(--border)]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">Tool Categories</h2>
              <p className="text-[var(--muted-foreground)] text-sm mt-1">Explore our comprehensive collection of free online tools</p>
            </div>
            <Link className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1" href="/categories">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const Icon = categoryIcons[category.slug];
              const colorClass = categoryColors[category.slug] || 'from-indigo-500 to-purple-600';
              const categoryTools = tools.filter(t => t.category === category.slug);
              
              return (
                <motion.div
                  key={category.slug}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Link
                    href={`/categories/${category.slug}`}
                    className="block h-full p-6 rounded-2xl bg-[var(--card)] border-2 border-[var(--border)] hover:border-indigo-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-indigo-500/20 group"
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {Icon && <Icon className="h-7 w-7 text-white" />}
                    </div>
                    <h3 className="text-xl font-bold text-[var(--foreground)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)] mt-1.5 leading-relaxed line-clamp-2">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-[var(--border)] text-xs text-[var(--muted-foreground)]">
                      <span className="font-medium flex items-center gap-1.5">{categoryTools.length} tools</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* PRIVATE BROWSER-BASED PROCESSING */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[var(--border)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Private Browser-Based Processing</h2>
              <p className="text-[var(--muted-foreground)] mb-4 leading-relaxed">
                Unlike most online tools that upload your files to servers, Navorika processes everything directly in your browser. 
                Your files never leave your device, ensuring complete privacy and security.
              </p>
              <p className="text-[var(--muted-foreground)] mb-4 leading-relaxed">
                This client-side architecture means:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--muted-foreground)]">No files are uploaded to any server</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--muted-foreground)]">Zero latency — instant processing</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--muted-foreground)]">No signup or registration required</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--muted-foreground)]">Works offline after initial load</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--muted-foreground)]">No tracking scripts or analytics</span>
                </li>
              </ul>
            </div>
            <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)]">
              <div className="text-center">
                <ShieldCheck className="h-20 w-20 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Your Data Stays Private</h3>
                <p className="text-[var(--muted-foreground)]">
                  Everything runs locally in your browser. No uploads, no servers, no tracking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[var(--border)]">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              Everything you need to know about Navorika
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <h3 className="font-bold mb-2">Is Navorika really free?</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Yes, all {displayCount} tools are completely free to use with no hidden costs or premium plans. No credit card required.</p>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <h3 className="font-bold mb-2">Do I need to create an account?</h3>
              <p className="text-sm text-[var(--muted-foreground)]">No, you can use any tool instantly without signup or registration. Just open the tool and start using it.</p>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <h3 className="font-bold mb-2">Is my data safe?</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Yes, all processing happens locally in your browser. No files are uploaded to our servers. Your data never leaves your device.</p>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <h3 className="font-bold mb-2">What file formats are supported?</h3>
              <p className="text-sm text-[var(--muted-foreground)]">We support JPG, PNG, WebP, PDF, SVG, HEIC, and many more formats across our tools.</p>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <h3 className="font-bold mb-2">Which tools are available?</h3>
              <p className="text-sm text-[var(--muted-foreground)]">We offer {displayCount} tools across 6 categories: PDF Tools, Image Tools, Finance Calculators, Health Calculators, Developer Tools, and Construction Calculators.</p>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <h3 className="font-bold mb-2">Do you offer mobile support?</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Yes, all tools are fully responsive and work on mobile, tablet, and desktop devices.</p>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <h3 className="font-bold mb-2">How is Navorika different from other tool sites?</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Unlike other sites, Navorika processes everything client-side. No file uploads, no server processing, and complete privacy. All tools are 100% free with no hidden limitations.</p>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[var(--border)]">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 sm:p-12 text-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
            <div className="relative z-10">
              <Rocket className="h-12 w-12 text-white/80 mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to try our free tools?</h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-6">Explore all {displayCount} tools and find the perfect one for your needs. No signup, no uploads, 100% free.</p>
              <Link className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-900 font-semibold hover:shadow-xl transition-all hover:scale-105" href="/tools">
                Browse all tools <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
