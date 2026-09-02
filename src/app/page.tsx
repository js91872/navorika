import Link from 'next/link';
import { 
  Shield, 
  Zap, 
  Lock, 
  Sparkles,
  ArrowRight,
  Users,
  FileText,
  Image as ImageIcon,
  Calculator,
  Heart,
  Code,
  Wrench,
  Globe,
  Rocket
} from 'lucide-react';
import { tools, categories } from '@/data/registry';
import { toolkits } from '@/data/taxonomy';
import SearchBar from '@/components/SearchBar';
import { toolsUnderReview } from '@/lib/seo/toolReview';
import RecentTools from '@/components/home/RecentTools';

export default function HomePage() {
  const totalTools = tools.filter((tool) => !toolsUnderReview.has(tool.slug)).length;
  const displayCount = `${totalTools}`;
  const categoryCount = categories.length;
  
  // Featured tools for the grid
  const featuredTools = [
    { slug: 'rotate-pdf', title: 'Rotate PDF', icon: '🔄', category: 'PDF Tools' },
    { slug: 'resize-image', title: 'Resize Image', icon: '🖼️', category: 'Image Tools' },
    { slug: 'bmi-calculator', title: 'BMI Calculator', icon: '⚖️', category: 'Health' },
    { slug: 'sip-calculator', title: 'SIP Calculator', icon: '📊', category: 'Finance' },
    { slug: 'merge-pdf', title: 'Merge PDF', icon: '📑', category: 'PDF Tools' },
    { slug: 'concrete-calculator', title: 'Concrete Calculator', icon: '🏗️', category: 'Construction' },
  ];

  const stats = [
    { value: displayCount, label: 'Free Tools', icon: <Sparkles className="h-6 w-6 text-amber-500" /> },
    { value: 'Most', label: 'Process Locally', icon: <Zap className="h-6 w-6 text-indigo-500" /> },
    { value: 'Clear', label: 'Data Sources', icon: <Shield className="h-6 w-6 text-emerald-500" /> },
    { value: '0', label: 'Signup Required', icon: <Lock className="h-6 w-6 text-purple-500" /> },
  ];

  const benefits = [
    {
      icon: <Shield className="h-8 w-8 text-emerald-500" />,
      title: 'Privacy-First',
      description: 'Most tools process data locally in your browser. Tools that require live external data clearly identify their data source.'
    },
    {
      icon: <Zap className="h-8 w-8 text-indigo-500" />,
      title: 'Instant Results',
      description: 'Browser-based tools respond quickly, while utilities that need current external data retrieve only what their feature requires.'
    },
    {
      icon: <Sparkles className="h-8 w-8 text-amber-500" />,
      title: 'Completely Free',
      description: `No hidden costs, no premium plans. All ${displayCount} tools are 100% free to use. No credit card, no strings attached.`
    },
    {
      icon: <Users className="h-8 w-8 text-rose-500" />,
      title: 'No Signup Required',
      description: 'Start using any tool instantly. No accounts, no emails, no passwords to remember. Just open and use.'
    },
  ];

  const faqs = [
    {
      q: 'Is Navorika really free?',
      a: `Yes! All ${displayCount} tools are completely free with no hidden costs, premium plans, or credit card required. Forever free.`
    },
    {
      q: 'How is my data protected?',
      a: 'Most tools process data locally in your browser. Tools that require live external data clearly identify their source and what is requested.'
    },
    {
      q: 'Do I need to create an account?',
      a: 'No. You can use any tool instantly without signup or registration. Just open and start using it. No emails, no passwords.'
    },
    {
      q: `What tools are available?`,
      a: `We offer ${displayCount} active tools across ${categoryCount} categories: ${categories.map((category) => category.name).join(', ')}.`
    },
    {
      q: 'Does it work on mobile?',
      a: 'Yes! All tools are fully responsive and work perfectly on mobile phones, tablets, and desktop computers. Any device, anywhere.'
    },
  ];

  const categoryIcons = {
    'pdf-tools': <FileText className="h-6 w-6" />,
    'image-tools': <ImageIcon className="h-6 w-6" />,
    'finance-calculators': <Calculator className="h-6 w-6" />,
    'health-calculators': <Heart className="h-6 w-6" />,
    'developer-tools': <Code className="h-6 w-6" />,
    'construction-calculators': <Wrench className="h-6 w-6" />,
    'everyday-calculators': <Globe className="h-6 w-6" />,
  };

  const categoryColors = {
    'pdf-tools': 'from-blue-600 to-indigo-600',
    'image-tools': 'from-violet-600 to-purple-600',
    'finance-calculators': 'from-emerald-600 to-teal-600',
    'health-calculators': 'from-rose-600 to-pink-600',
    'developer-tools': 'from-amber-600 to-orange-600',
    'construction-calculators': 'from-cyan-600 to-blue-600',
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden px-4 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              {displayCount} Tools · 100% Free · Private by Design
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6">
              {displayCount} Free Online Tools
              <br />
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Instant, Private & Free
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto leading-relaxed">
              {displayCount} tools including PDF editors, image converters, calculators,
              and developer utilities. <span className="font-semibold text-[var(--foreground)]">Most process data locally in your browser</span>;
              tools using live external data identify their source.
            </p>

            {/* Search Bar - Now Working! */}
            <div className="mt-8 max-w-xl mx-auto">
              <SearchBar placeholder={`Search ${displayCount} tools...`} />
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--muted-foreground)]">
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" />
                Private by Design
              </span>
              <span className="w-px h-4 bg-[var(--border)]" />
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-indigo-500" />
                Instant Processing
              </span>
              <span className="w-px h-4 bg-[var(--border)]" />
              <span className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-purple-500" />
                Clear Data Sources
              </span>
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center">
                  <div className="flex justify-center mb-2">{stat.icon}</div>
                  <div className="text-2xl font-black">{stat.value}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <RecentTools />

      {/* ===== WHY Navorika ===== */}
      <section className="max-w-6xl mx-auto px-4 py-16 border-t border-[var(--border)]">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold">Why Choose Navorika?</h2>
          <p className="text-[var(--muted-foreground)] mt-2">Built differently. Built better.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-indigo-500/40 transition-all text-center group">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {benefit.icon}
              </div>
              <h3 className="font-bold mb-2">{benefit.title}</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="bg-[var(--muted)]/30 border-y border-[var(--border)] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">Tools by Category</h2>
            <p className="text-[var(--muted-foreground)] mt-2">Explore {displayCount} tools across {categoryCount} categories</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group relative p-6 rounded-2xl bg-[var(--card)] border-2 border-[var(--border)] hover:border-indigo-500/50 transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${categoryColors[category.slug as keyof typeof categoryColors] || 'from-indigo-600 to-purple-600'} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-3">
                    {categoryIcons[category.slug as keyof typeof categoryIcons] || <Wrench className="h-6 w-6" />}
                  </div>
                  <h3 className="text-lg font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1 leading-relaxed">
                    {category.description}
                  </p>
                  <div className="mt-4 flex items-center text-sm text-indigo-500 opacity-0 group-hover:opacity-100 transition-all">
                    <span>Explore tools</span>
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WORKFLOW TOOLKITS ===== */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Start with a goal</p><h2 className="mt-2 text-3xl font-bold sm:text-4xl">Workflow toolkits</h2><p className="mt-2 max-w-2xl text-[var(--muted-foreground)]">Move between tools that support the same project, calculation, or publishing task.</p></div>
          <Link href="/toolkits" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600">View all toolkits <ArrowRight className="size-4" /></Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{toolkits.slice(0, 4).map((toolkit) => <Link key={toolkit.slug} href={`/toolkits/${toolkit.slug}`} className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-lg"><h3 className="font-bold group-hover:text-indigo-600">{toolkit.name}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{toolkit.description}</p></Link>)}</div>
      </section>

      {/* ===== POPULAR TOOLS ===== */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold">Featured Tools</h2>
          <p className="text-[var(--muted-foreground)] mt-2">Useful starting points across major categories</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {featuredTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-indigo-500/50 transition-all hover:shadow-lg hover:-translate-y-1 text-center"
            >
              <div className="text-3xl mb-2">{tool.icon}</div>
              <h3 className="text-sm font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {tool.title}
              </h3>
              <p className="text-xs text-[var(--muted-foreground)]">{tool.category}</p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:shadow-xl transition-all hover:scale-105"
          >
            View All Tools <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="bg-[var(--muted)]/30 border-y border-[var(--border)] py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">Frequently Asked Questions</h2>
            <p className="text-[var(--muted-foreground)] mt-2">Everything you need to know about Navorika</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-[var(--muted-foreground)] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 sm:p-12 text-center">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10" />
          
          <div className="relative z-10">
            <Rocket className="h-12 w-12 text-white/80 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Ready to experience the best free tools?
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-6">
              Join thousands of users who trust Navorika for their daily productivity needs.
            </p>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-900 font-semibold hover:shadow-xl transition-all hover:scale-105"
            >
              Start Using Tools <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
