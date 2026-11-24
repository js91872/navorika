import Link from 'next/link';
import {
  Shield,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Lock,
  Eye,
  Database,
  Cookie,
  Scale,
  FileText,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  HeartPulse,
  Hammer,
  Wrench,
  ShieldAlert,
  Cpu,
  Server,
  Calculator,
  Globe,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Binary,
  Layers,
  Mail,
  Bug,
  BookOpen,
  Zap,
  ImageIcon,
  Code2,
} from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import { languageDirection } from '@/lib/i18n/config';
import type { TrustPageContent, GlossaryPageContent } from '@/lib/i18n/trustPages';

interface LocalizedTrustPageProps {
  locale: Locale;
  content: TrustPageContent;
  homeLabel: string;
}

function getIcon(name?: string) {
  switch (name) {
    case 'shield':
      return <Shield className="h-6 w-6 text-indigo-500" />;
    case 'lock':
      return <Lock className="h-6 w-6 text-indigo-500" />;
    case 'eye':
      return <Eye className="h-6 w-6 text-indigo-500" />;
    case 'database':
      return <Database className="h-6 w-6 text-indigo-500" />;
    case 'cookie':
      return <Cookie className="h-6 w-6 text-indigo-500" />;
    case 'scale':
      return <Scale className="h-6 w-6 text-indigo-500" />;
    case 'fileText':
      return <FileText className="h-6 w-6 text-indigo-500" />;
    case 'checkCircle':
      return <CheckCircle className="h-6 w-6 text-indigo-500" />;
    case 'alertTriangle':
      return <AlertTriangle className="h-6 w-6 text-amber-500" />;
    case 'helpCircle':
      return <HelpCircle className="h-6 w-6 text-indigo-500" />;
    case 'trendingUp':
      return <TrendingUp className="h-6 w-6 text-emerald-500" />;
    case 'heartPulse':
      return <HeartPulse className="h-6 w-6 text-rose-500" />;
    case 'hammer':
      return <Hammer className="h-6 w-6 text-amber-500" />;
    case 'wrench':
      return <Wrench className="h-6 w-6 text-indigo-500" />;
    case 'cpu':
      return <Cpu className="h-6 w-6 text-indigo-500" />;
    case 'server':
      return <Server className="h-6 w-6 text-indigo-500" />;
    case 'calculator':
      return <Calculator className="h-6 w-6 text-indigo-500" />;
    case 'globe':
      return <Globe className="h-6 w-6 text-indigo-500" />;
    case 'checkCircle2':
      return <CheckCircle2 className="h-6 w-6 text-indigo-500" />;
    case 'alertCircle':
      return <AlertCircle className="h-6 w-6 text-indigo-500" />;
    case 'refreshCw':
      return <RefreshCw className="h-6 w-6 text-indigo-500" />;
    case 'layers':
      return <Layers className="h-6 w-6 text-amber-500" />;
    case 'image':
      return <ImageIcon className="h-6 w-6 text-purple-500" />;
    case 'code':
      return <Code2 className="h-6 w-6 text-indigo-500" />;
    case 'zap':
      return <Zap className="h-6 w-6 text-amber-500" />;
    default:
      return <CheckCircle className="h-6 w-6 text-indigo-500" />;
  }
}

/** Render text with clickable links if URLs are present */
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
                dir="ltr"
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
                dir="ltr"
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
  return <span className="break-words">{text}</span>;
}

export function LocalizedTrustPage({ locale, content, homeLabel }: LocalizedTrustPageProps) {
  const isRtl = languageDirection(locale) === 'rtl';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 break-words overflow-hidden">
      {/* Back Link */}
      <div className="mb-8">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          <span>{homeLabel}</span>
        </Link>
      </div>

      {/* Header */}
      <div className="mb-10">
        {content.eyebrow && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
            {content.eyebrow}
          </div>
        )}
        <h1 className="text-3xl font-extrabold sm:text-4xl text-[var(--foreground)] tracking-tight">
          {content.heroTitle}
        </h1>
        {content.lastUpdated && (
          <p className="text-sm text-[var(--muted-foreground)] mt-2">
            {content.lastUpdatedLabel || 'Last updated'}: {content.lastUpdated}
          </p>
        )}
        <p className="mt-4 text-lg text-[var(--muted-foreground)] leading-relaxed">
          {content.heroDescription}
        </p>

        {/* Primary / Secondary Buttons (About page) */}
        {content.buttons && (
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
            >
              <span>{content.buttons.primaryText}</span>
              {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </Link>
            <Link
              href={`/${locale}/methodology`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--border)] text-[var(--foreground)] hover:border-indigo-500/40 transition-colors"
            >
              {content.buttons.secondaryText}
            </Link>
          </div>
        )}

        {/* Banner callout */}
        {content.banner && (
          <div
            className={`mt-6 p-4 rounded-2xl text-sm flex items-start gap-3 leading-relaxed border ${
              content.banner.variant === 'amber'
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-300'
                : content.banner.variant === 'emerald'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-700 dark:text-indigo-300'
            }`}
          >
            {content.banner.variant === 'amber' ? (
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            ) : content.banner.variant === 'emerald' ? (
              <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            )}
            <span>{content.banner.text}</span>
          </div>
        )}
      </div>

      {/* Contact Cards (Contact page) */}
      {content.contactCards && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-4">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-fit">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{content.contactCards.general.title}</h2>
              <p className="text-sm text-[var(--muted-foreground)] mt-1 leading-relaxed">
                {content.contactCards.general.description}
              </p>
            </div>
            <div>
              <a
                href={`mailto:${content.contactCards.general.email}?subject=Navorika%20Inquiry`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors text-sm"
              >
                <Mail className="h-4 w-4" />
                <span>{content.contactCards.general.buttonText}</span>
              </a>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{content.contactCards.privacy.title}</h2>
              <p className="text-sm text-[var(--muted-foreground)] mt-1 leading-relaxed">
                {content.contactCards.privacy.description}
              </p>
            </div>
            <div>
              <a
                href={`mailto:${content.contactCards.privacy.email}?subject=Privacy%20Inquiry`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border)] text-[var(--foreground)] font-medium hover:bg-[var(--muted)]/50 transition-colors text-sm"
              >
                <Shield className="h-4 w-4" />
                <span>{content.contactCards.privacy.buttonText}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Bug Reporting Guide (Contact page) */}
      {content.bugReport && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Bug className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold">{content.bugReport.title}</h2>
          </div>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
            {content.bugReport.intro}
          </p>
          <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
            {content.bugReport.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-indigo-500 font-bold">•</span>
                <span>
                  <strong>{item.label}:</strong> {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Operational Note (Contact page) */}
      {content.operationalNote && (
        <div className="p-6 rounded-2xl bg-[var(--muted)]/30 border border-[var(--border)] text-center text-xs text-[var(--muted-foreground)] mb-10">
          <p>
            {content.operationalNote.text}{' '}
            <Link
              href={`/${locale}${content.operationalNote.linkHref}`}
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              {content.operationalNote.linkText}
            </Link>
            .
          </p>
        </div>
      )}

      {/* Core Principles (About page) */}
      {content.corePrinciples && (
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-6">{content.corePrinciplesTitle || 'Core Principles'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {content.corePrinciples.map((principle, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]"
              >
                <div className="mb-3">{getIcon(principle.icon)}</div>
                <h3 className="text-lg font-bold mb-2">{principle.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tool Categories (About page) */}
      {content.toolCategories && (
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-6">{content.toolCategoriesTitle || 'Tool Categories'}</h2>
          <div className="space-y-4">
            {content.toolCategories.map((cat, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex items-start gap-4"
              >
                <div className="p-2.5 rounded-xl bg-[var(--muted)]/50 shrink-0 mt-0.5">
                  {getIcon(cat.icon)}
                </div>
                <div>
                  <h3 className="font-bold text-base">{cat.title}</h3>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* How We Build and Check (About page) */}
      {content.howWeBuildParagraphs && (
        <section className="mb-14 p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)]">
          <h2 className="text-2xl font-bold mb-4">{content.howWeBuildTitle || 'How We Build Tools'}</h2>
          <div className="space-y-4 text-sm text-[var(--muted-foreground)] leading-relaxed">
            {content.howWeBuildParagraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
            {content.howWeBuildLink && (
              <p>
                <Link
                  href={`/${locale}${content.howWeBuildLink.href}`}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  {content.howWeBuildLink.text}
                </Link>
              </p>
            )}
          </div>
        </section>
      )}

      {/* Limitations Alert (About page) */}
      {content.limitationsParagraphs && (
        <section className="mb-14 p-6 sm:p-8 rounded-3xl border border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0" />
            <h2 className="text-xl font-bold">{content.limitationsTitle || 'Technical Limitations'}</h2>
          </div>
          <div className="space-y-3 text-sm text-[var(--muted-foreground)] leading-relaxed">
            {content.limitationsParagraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
            {content.limitationsLink && (
              <p>
                <Link
                  href={`/${locale}${content.limitationsLink.href}`}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  {content.limitationsLink.text}
                </Link>
              </p>
            )}
          </div>
        </section>
      )}

      {/* Quick Links (About page) */}
      {content.quickLinks && (
        <section className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center text-sm text-[var(--muted-foreground)] space-y-3 mb-12">
          <p className="font-semibold text-[var(--foreground)]">{content.quickLinksTitle || 'Quick Links'}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
            {content.quickLinks.map((link, i) => (
              <Link
                key={i}
                href={`/${locale}${link.href}`}
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {link.text}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Standard Sections (Privacy, Terms, Disclaimer, Methodology) */}
      {content.sections && content.sections.length > 0 && (
        <div className="space-y-8">
          {content.sections.map((section, idx) => (
            <section
              key={idx}
              className="p-4 sm:p-7 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm break-words"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                    {getIcon(section.icon)}
                  </div>
                  <h2 className="text-xl font-bold text-[var(--foreground)]">{section.title}</h2>
                </div>
                {section.badge && (
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                      section.badgeColor || 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20'
                    } self-start sm:self-auto`}
                  >
                    {section.badge}
                  </span>
                )}
              </div>

              {section.content && (
                <p className="text-[var(--muted-foreground)] leading-relaxed mt-2 text-sm sm:text-base">
                  {section.content}
                </p>
              )}

              {section.points && section.points.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-2.5">
                  {section.points.map((pt, pIdx) => (
                    <div
                      key={pIdx}
                      className="flex items-start gap-2.5 text-sm text-[var(--muted-foreground)] leading-relaxed"
                    >
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <div>{formatPointText(pt)}</div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}

      {/* Footer Note Box */}
      {content.footerNote && (
        <div className="mt-12 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center text-sm text-[var(--muted-foreground)]">
          <p>
            {content.footerNote.text}{' '}
            {content.footerNote.linkHref && (
              <Link
                href={`/${locale}${content.footerNote.linkHref}`}
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                {content.footerNote.linkText}
              </Link>
            )}
            {content.footerNote.secondLinkHref && (
              <>
                {' '}
                <Link
                  href={`/${locale}${content.footerNote.secondLinkHref}`}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  {content.footerNote.secondLinkText}
                </Link>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

interface LocalizedGlossaryPageProps {
  locale: Locale;
  content: GlossaryPageContent;
  homeLabel: string;
}

export function LocalizedGlossaryPage({ locale, content, homeLabel }: LocalizedGlossaryPageProps) {
  const isRtl = languageDirection(locale) === 'rtl';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back Link */}
      <div className="mb-8">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          <span>{homeLabel}</span>
        </Link>
      </div>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <BookOpen className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold sm:text-4xl text-[var(--foreground)] tracking-tight">
              {content.heroTitle}
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              {content.heroDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Terms Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {content.terms.map((item, idx) => (
          <div key={idx} className="rounded-2xl border border-[var(--border)] p-5 bg-[var(--card)] hover:border-indigo-500/40 transition-all">
            <h2 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              <bdi>{item.term}</bdi>
            </h2>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              {item.definition}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
