import Link from 'next/link';
import PremiumTools from '@/components/home/PremiumTools';
import SearchBox from '@/components/home/SearchBox';

export default function HomePage() {
  const categories = [
    { 
      name: 'Finance', 
      count: '12+ Tools', 
      desc: 'Mortgages, investments, loans & ROI calculations', 
      href: '/categories/finance',
      color: 'from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-600',
      iconBg: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20',
      svg: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      name: 'PDF Tools', 
      count: '15+ Utilities', 
      desc: 'Merge, split, compress, convert & sign documents', 
      href: '/categories/pdf-tools',
      color: 'from-rose-500/10 to-red-500/10 border-rose-500/20 text-rose-600',
      iconBg: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20',
      svg: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      name: 'Image Tools', 
      count: '10+ Editors', 
      desc: 'Resize, compress, convert & watermark assets', 
      href: '/categories/image-tools',
      color: 'from-indigo-500/10 to-blue-500/10 border-indigo-500/20 text-indigo-600',
      iconBg: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20',
      svg: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M620h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      name: 'Health', 
      count: '8+ Calculators', 
      desc: 'BMI, body fat, calorie goals & fitness metrics', 
      href: '/categories/health',
      color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-600',
      iconBg: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20',
      svg: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    { 
      name: 'Productivity', 
      count: '10+ Helpers', 
      desc: 'Timers, converters, generators & workflow aids', 
      href: '/categories/productivity',
      color: 'from-violet-500/10 to-purple-500/10 border-violet-500/20 text-violet-600',
      iconBg: 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-100 dark:border-violet-500/20',
      svg: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      name: 'Developer Tools', 
      count: '14+ Utilities', 
      desc: 'JSON formatters, hash encoders & syntax checkers', 
      href: '/categories/developer-tools',
      color: 'from-cyan-500/10 to-sky-500/10 border-cyan-500/20 text-cyan-600',
      iconBg: 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-100 dark:border-cyan-500/20',
      svg: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-36 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white via-slate-50 to-slate-100/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950/50 transition-colors">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_50%)] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-8 tracking-wide shadow-sm transition-colors">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Trusted by 10,000+ active daily users
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.1] mb-6 transition-colors">
            Smart Utilities for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600">Peak Productivity</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 font-normal leading-relaxed transition-colors">
            Access 40+ premium calculators, converters, and specialized utilities designed to simplify complex tasks instantly with zero latency.
          </p>

          {/* Interactive Search Component */}
          <div className="max-w-xl mx-auto mb-12">
            <SearchBox />
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-200 dark:border-slate-800 text-left transition-colors">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <div className="text-2xl font-black text-slate-900 dark:text-white">40+</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Calculators & Tools</div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <div className="text-2xl font-black text-slate-900 dark:text-white">15+</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">PDF Utilities</div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <div className="text-2xl font-black text-slate-900 dark:text-white">100%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Client-Side Private</div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <div className="text-2xl font-black text-slate-900 dark:text-white">10K+</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Active Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase Section */}
      <section id="categories" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest block mb-2 transition-colors">Specialized Collections</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">Explore Our Categories</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mt-4 md:mt-0 transition-colors">
            Find the precise tool for your workflow across 6 meticulously organized, professional categories.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <Link key={idx} href={cat.href} className="group relative p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 dark:hover:shadow-none flex flex-col justify-between overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${cat.color} rounded-bl-full pointer-events-none opacity-60 group-hover:scale-110 transition-transform`}></div>
              <div>
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-6 shadow-sm transition-colors ${cat.iconBg}`}>
                  {cat.svg}
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{cat.name}</h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors">{cat.count}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 transition-colors">{cat.desc}</p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                <span>Browse utilities</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PremiumTools />
        </div>
      </section>

      {/* Feature Trust Section */}
      <section className="py-24 border-t border-slate-200 dark:border-slate-800 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full transition-colors">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest block mb-2 transition-colors">Why Choose Navorika</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 transition-colors">Engineered for Excellence</h2>
          <p className="text-slate-600 dark:text-slate-400 text-base transition-colors">We combine uncompromising speed with absolute data privacy.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 transition-colors">Lightning Fast</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">Instant calculations and transformations running entirely in your browser with zero latency delays.</p>
          </div>
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 transition-colors">100% Private & Secure</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">Your files and calculations never leave your device. Complete local execution ensures absolute confidentiality.</p>
          </div>
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-900/30 border border-violet-100 dark:border-violet-500/30 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-6 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 transition-colors">Always Free</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">No subscriptions, no hidden walls, and no mandatory registration. Access everything instantly.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-r from-indigo-900 via-violet-900 to-indigo-950 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)] pointer-events-none"></div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4 relative z-10">Ready to Boost Your Productivity?</h2>
            <p className="text-indigo-100 text-base max-w-xl mx-auto mb-8 relative z-10">
              Join thousands of professionals who rely on Navorika daily for fast calculations and document conversions.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
              <Link href="#tools" className="px-8 py-4 bg-white text-indigo-900 font-semibold rounded-xl shadow-lg hover:bg-indigo-50 transition-all">
                Explore All Tools
              </Link>
              <Link href="#categories" className="px-8 py-4 bg-indigo-800 hover:bg-indigo-700 text-white border border-indigo-700 font-semibold rounded-xl transition-all">
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
