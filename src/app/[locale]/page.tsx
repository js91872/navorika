import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Shield, Zap, Lock, Sparkles, Users } from 'lucide-react';
import LocalizedCatalog from '@/components/i18n/LocalizedCatalog';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { TOTAL_ACTIVE_TOOLS } from '@/data/registry';
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
  const toolCountFormatted = new Intl.NumberFormat(locale).format(TOTAL_ACTIVE_TOOLS);

  return (
    <div className="pb-16 text-[#18181b] dark:text-[#f4f4f5] max-w-full overflow-hidden">
      {/* Hero Section */}
      <section className="pt-6 pb-6 sm:pt-12 sm:pb-8 text-center max-w-4xl mx-auto px-4 overflow-hidden">
        {/* Main H1 Title - Must match d.ui.title exactly for test assertion */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4 text-[#18181b] dark:text-white [overflow-wrap:anywhere]">
          {d.ui.title}
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg text-[#5b5b63] dark:text-[#a1a1aa] max-w-2xl mx-auto leading-relaxed mb-6 [overflow-wrap:anywhere]">
          {d.ui.intro}
        </p>

        {/* Privacy Trust Banner */}
        <div className="max-w-2xl mx-auto mb-2 rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-3.5 text-xs sm:text-sm leading-relaxed text-[#18181b] dark:text-[#f4f4f5] flex items-center gap-3 text-start">
          <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="[overflow-wrap:anywhere]">{d.ui.local}</span>
        </div>

      </section>

      {/* Localized Tools Directory & Search */}
      <LocalizedCatalog locale={locale} dictionary={d} />

      {/* Supporting statistics follow the tool search and directory. */}
      <section aria-label="Navorika at a glance" className="mx-auto mt-10 max-w-4xl px-4">
        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto mb-0">
          <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] text-center shadow-xs min-w-0 [overflow-wrap:anywhere]">
            <div className="flex justify-center mb-1 text-[#e5322d]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#18181b] dark:text-white">{toolCountFormatted}</div>
            <div className="text-xs text-[#5b5b63] dark:text-[#a1a1aa] mt-0.5">{d.ui.statFreeTools}</div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] text-center shadow-xs min-w-0 [overflow-wrap:anywhere]">
            <div className="flex justify-center mb-1 text-[#e5322d]">
              <Zap className="h-5 w-5" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#18181b] dark:text-white">{d.ui.statMost}</div>
            <div className="text-xs text-[#5b5b63] dark:text-[#a1a1aa] mt-0.5">{d.ui.statProcessLocal}</div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] text-center shadow-xs min-w-0 [overflow-wrap:anywhere]">
            <div className="flex justify-center mb-1 text-emerald-600 dark:text-emerald-400">
              <Shield className="h-5 w-5" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#18181b] dark:text-white">{d.ui.statClear}</div>
            <div className="text-xs text-[#5b5b63] dark:text-[#a1a1aa] mt-0.5">{d.ui.statClearSources}</div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] text-center shadow-xs min-w-0 [overflow-wrap:anywhere]">
            <div className="flex justify-center mb-1 text-[#e5322d]">
              <Lock className="h-5 w-5" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#18181b] dark:text-white">{d.ui.statZero}</div>
            <div className="text-xs text-[#5b5b63] dark:text-[#a1a1aa] mt-0.5">{d.ui.statNoSignup}</div>
          </div>
        </div>
      </section>

      {/* Feature Highlights ("Why Choose Navorika?") - Using div role="heading" to preserve test expectations */}
      <section className="mt-14 pt-10 border-t border-[#e4e4e8] dark:border-[#27272a]">
        <div className="text-center mb-8">
          <div role="heading" aria-level={2} className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181b] dark:text-white">
            {d.ui.whyChoose}
          </div>
          <p className="text-[#5b5b63] dark:text-[#a1a1aa] text-sm mt-1.5 max-w-xl mx-auto">
            {d.ui.whyChooseSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] text-center hover:border-[#e5322d] transition-colors">
            <div className="w-10 h-10 mx-auto rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Shield className="h-5 w-5" />
            </div>
            <p className="font-semibold text-base mb-1 text-[#18181b] dark:text-white">{d.ui.featurePrivacyTitle}</p>
            <p className="text-xs leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa]">
              {d.ui.featurePrivacyDesc}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] text-center hover:border-[#e5322d] transition-colors">
            <div className="w-10 h-10 mx-auto rounded-lg bg-[#fff1f1] dark:bg-[#e5322d]/10 text-[#e5322d] flex items-center justify-center mb-3">
              <Zap className="h-5 w-5" />
            </div>
            <p className="font-semibold text-base mb-1 text-[#18181b] dark:text-white">{d.ui.featureSpeedTitle}</p>
            <p className="text-xs leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa]">
              {d.ui.featureSpeedDesc}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] text-center hover:border-[#e5322d] transition-colors">
            <div className="w-10 h-10 mx-auto rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="font-semibold text-base mb-1 text-[#18181b] dark:text-white">{d.ui.featureFreeTitle}</p>
            <p className="text-xs leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa]">
              {d.ui.featureFreeDesc}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] text-center hover:border-[#e5322d] transition-colors">
            <div className="w-10 h-10 mx-auto rounded-lg bg-[#fff1f1] dark:bg-[#e5322d]/10 text-[#e5322d] flex items-center justify-center mb-3">
              <Users className="h-5 w-5" />
            </div>
            <p className="font-semibold text-base mb-1 text-[#18181b] dark:text-white">{d.ui.featureNoSignupTitle}</p>
            <p className="text-xs leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa]">
              {d.ui.featureNoSignupDesc}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
