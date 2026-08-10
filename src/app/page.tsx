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
              Private by design · Zero-latency
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mb-4">
              {displayCount} Free Online Tools, Calculators &amp; Utilities
            </h1>

            <p className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Private by Design. Fast. Free. No Signup.
            </p>

            <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed mb-8">
              <strong>Private by design.</strong> Your files and calculations stay on your device. 
              Navorika processes all {displayCount} tools locally in your browser without uploading your data. 
              No signup, no tracking, complete privacy.
            </p>

            <button className="flex items-center gap-3 max-w-lg mx-auto w-full p-3 rounded-full bg-[var(--card)] border border-[var(--border)] hover:border-indigo-400/50 transition-all text-left shadow-lg hover:shadow-indigo-500/10">
              <span className="pl-2 text-[var(--muted-foreground)]">🔍</span>
              <span className="flex-1 text-[var(--muted-foreground)]">Search {displayCount} tools...</span>
              <kbd className="px-2 py-1 rounded bg-[var(--muted)] text-[var(--muted-foreground)] text-xs font-mono">⌘K</kbd>
            </button>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-[var(--muted-foreground)]">
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" />
                Private by design
              </span>
              <span className="w-px h-4 bg-[var(--border)]"></span>
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-indigo-500" />
                100% client-side
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

        {/* PRIVATE BY DESIGN - CORE MESSAGE */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[var(--border)]">
          <div className="text-center max-w-3xl mx-auto">
            <Shield className="h-16 w-16 text-emerald-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Private by Design</h2>
            <p className="text-lg text-[var(--muted-foreground)] leading-relaxed mb-6">
              Your files and calculations stay on your device. Navorika processes all {displayCount} tools 
              locally in your browser without uploading your data. No servers, no storage, no tracking — 
              complete privacy, always.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle className="h-4 w-4" /> No file uploads
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle className="h-4 w-4" /> No signup required
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle className="h-4 w-4" /> Zero tracking
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle className="h-4 w-4" /> Client-side processing
              </span>
            </div>
          </div>
        </section>

        {/* FREE ONLINE TOOLS FOR EVERYDAY TASKS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[var(--border)]">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Free Online Tools for Everyday Tasks</h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              Whether you need to compress a PDF, resize an image, calculate your BMI, or generate a QR code, 
              Navorika has you covered. All tools are completely free, private, and work directly in your browser.
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

        {/* HOW IT WORKS - CLIENT-SIDE PROCESSING */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[var(--border)]">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How Client-Side Processing Works</h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              All tools run locally in your browser. Your data never leaves your device.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl mb-4">1</div>
              <h3 className="font-bold mb-2">Choose a Tool</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Browse our collection of {displayCount} free online tools</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl mb-4">2</div>
              <h3 className="font-bold mb-2">Process Locally</h3>
              <p className="text-sm text-[var(--muted-foreground)]">All processing happens in your browser — no uploads, no servers</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl mb-4">3</div>
              <h3 className="font-bold mb-2">Download Results</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Your data stays private and secure — always</p>
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
              <h3 className="font-bold mb-2">How is my data protected?</h3>
              <p className="text-sm text-[var(--muted-foreground)]">All processing happens locally in your browser. No files are uploaded to any server. Your data never leaves your device — <strong>private by design</strong>.</p>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <h3 className="font-bold mb-2">Do I need to create an account?</h3>
              <p className="text-sm text-[var(--muted-foreground)]">No, you can use any tool instantly without signup or registration. Just open the tool and start using it.</p>
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
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[var(--border)]">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 sm:p-12 text-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
            <div className="relative z-10">
              <Rocket className="h-12 w-12 text-white/80 mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to try our free tools?</h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-6">Explore all {displayCount} tools and find the perfect one for your needs. Private by design. No signup, no uploads, 100% free.</p>
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
