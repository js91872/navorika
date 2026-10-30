import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Shield, Zap, Lock, Sparkles, Users } from 'lucide-react';
import LocalizedCatalog from '@/components/i18n/LocalizedCatalog';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { isLocale, languageAlternates } from '@/lib/i18n/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = await getDictionary(locale);
  return {
    title: d.ui.title,
    description: d.ui.intro,
    alternates: { canonical: `https://navorika.com/${locale}`, languages: languageAlternates() },
    openGraph: {
      title: d.ui.title,
      description: d.ui.intro,
      url: `https://navorika.com/${locale}`,
      siteName: 'Navorika',
      type: 'website',
    },
  };
}

export default async function LanguageHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = await getDictionary(locale);

  return (
    <div className="relative">
      {/* Background Decorative Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 end-0 w-[500px] h-[300px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-4 pb-8 sm:pt-8 sm:pb-12 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span>{d.ui.freePill}</span>
          </div>

          {/* Main H1 Title - Must match d.ui.title exactly for test assertion */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mb-5 [overflow-wrap:anywhere]">
            {d.ui.title}
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed mb-6 [overflow-wrap:anywhere]">
            {d.ui.intro}
          </p>

          {/* Privacy Trust Banner */}
          <div className="max-w-2xl mx-auto mb-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-xs sm:text-sm leading-relaxed text-[var(--foreground)] flex items-center gap-3 text-start">
            <Shield className="h-5 w-5 text-emerald-500 shrink-0" />
            <span>{d.ui.local}</span>
          </div>

          {/* 4 Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center shadow-sm">
              <div className="flex justify-center mb-1.5 text-amber-500">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="text-xl sm:text-2xl font-black">319</div>
              <div className="text-xs text-[var(--muted-foreground)]">{d.ui.statFreeTools}</div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center shadow-sm">
              <div className="flex justify-center mb-1.5 text-indigo-500">
                <Zap className="h-5 w-5" />
              </div>
              <div className="text-xl sm:text-2xl font-black">{d.ui.statMost}</div>
              <div className="text-xs text-[var(--muted-foreground)]">{d.ui.statProcessLocal}</div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center shadow-sm">
              <div className="flex justify-center mb-1.5 text-emerald-500">
                <Shield className="h-5 w-5" />
              </div>
              <div className="text-xl sm:text-2xl font-black">{d.ui.statClear}</div>
              <div className="text-xs text-[var(--muted-foreground)]">{d.ui.statClearSources}</div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center shadow-sm">
              <div className="flex justify-center mb-1.5 text-purple-500">
                <Lock className="h-5 w-5" />
              </div>
              <div className="text-xl sm:text-2xl font-black">{d.ui.statZero}</div>
              <div className="text-xs text-[var(--muted-foreground)]">{d.ui.statNoSignup}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Localized Tools Directory & Search */}
      <LocalizedCatalog locale={locale} dictionary={d} />

      {/* Feature Highlights ("Why Choose Navorika?") */}
      <section className="mt-16 sm:mt-24 pt-12 border-t border-[var(--border)]">
        <div className="text-center mb-10">
          <div role="heading" aria-level={2} className="text-2xl sm:text-3xl font-bold">
            {d.ui.whyChoose}
          </div>
          <p className="text-[var(--muted-foreground)] text-sm mt-2 max-w-xl mx-auto">
            {d.ui.whyChooseSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center transition hover:border-indigo-500/40">
            <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
              <Shield className="h-6 w-6" />
            </div>
            <p className="font-bold text-base mb-1.5">{d.ui.featurePrivacyTitle}</p>
            <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">
              {d.ui.featurePrivacyDesc}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center transition hover:border-indigo-500/40">
            <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-3">
              <Zap className="h-6 w-6" />
            </div>
            <p className="font-bold text-base mb-1.5">{d.ui.featureSpeedTitle}</p>
            <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">
              {d.ui.featureSpeedDesc}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center transition hover:border-indigo-500/40">
            <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3">
              <Sparkles className="h-6 w-6" />
            </div>
            <p className="font-bold text-base mb-1.5">{d.ui.featureFreeTitle}</p>
            <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">
              {d.ui.featureFreeDesc}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center transition hover:border-indigo-500/40">
            <div className="w-12 h-12 mx-auto rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-3">
              <Users className="h-6 w-6" />
            </div>
            <p className="font-bold text-base mb-1.5">{d.ui.featureNoSignupTitle}</p>
            <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">
              {d.ui.featureNoSignupDesc}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
