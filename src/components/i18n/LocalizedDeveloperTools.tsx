'use client';

import { useMemo, useState } from 'react';
import { Code2 } from 'lucide-react';
import ResultActions from '@/components/ui/ResultActions';
import { resultActionMessages } from '@/lib/i18n/actionMessages';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';
import { fieldClass, buttonClass } from './ToolControls';

export type DeveloperToolSlug =
  | 'regex-tester'
  | 'unix-timestamp-converter'
  | 'utm-builder'
  | 'meta-tag-generator'
  | 'robots-txt-generator';

export default function LocalizedDeveloperTools({
  slug,
  d,
  locale,
}: {
  slug: DeveloperToolSlug;
  d: Dictionary;
  locale: Locale;
}) {
  const ui = d.ui;
  const calcUi = d.calculatorUi;

  // Regex Tester state
  const [pattern, setPattern] = useState('[A-Z]\\w+');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState('Hello World, this is a Regex Test.');

  // Unix Timestamp state (fixed default for deterministic SSR/hydration)
  const [timestamp, setTimestamp] = useState('1700000000');

  // UTM Builder state
  const [utmUrl, setUtmUrl] = useState('https://navorika.com');
  const [utmSource, setUtmSource] = useState('google');
  const [utmMedium, setUtmMedium] = useState('cpc');
  const [utmCampaign, setUtmCampaign] = useState('summer_sale');

  // Meta Tag Generator state
  const [metaTitle, setMetaTitle] = useState('Navorika - Free Tools');
  const [metaDescription, setMetaDescription] = useState('Privacy-first online utilities.');
  const [metaImage, setMetaImage] = useState('https://navorika.com/og-image.png');

  // Robots.txt Generator state
  const [robotsAgent, setRobotsAgent] = useState('*');
  const [robotsDisallow, setRobotsDisallow] = useState('/private/');
  const [robotsSitemap, setRobotsSitemap] = useState('https://navorika.com/sitemap.xml');

  // Regex evaluation
  const regexResult = useMemo(() => {
    try {
      const matches = testText.match(new RegExp(pattern, flags));
      return { matches: matches ? Array.from(matches) : [], error: '' };
    } catch {
      return { matches: [], error: d.developer.regex.invalidRegex };
    }
  }, [flags, pattern, testText, d.developer.regex.invalidRegex]);

  // Timestamp evaluation
  const timestampResult = useMemo(() => {
    const trimmed = timestamp.trim();
    if (!/^-?\d+$/.test(trimmed)) return null;
    const num = Number(trimmed);
    if (!Number.isFinite(num)) return null;
    const isMs = trimmed.replace('-', '').length > 10;
    const date = new Date(isMs ? num : num * 1000);
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
  }, [timestamp]);

  // UTM evaluation
  const utmResult = useMemo(() => {
    try {
      const parsed = new URL(utmUrl.trim());
      if (utmSource.trim()) parsed.searchParams.set('utm_source', utmSource.trim());
      if (utmMedium.trim()) parsed.searchParams.set('utm_medium', utmMedium.trim());
      if (utmCampaign.trim()) parsed.searchParams.set('utm_campaign', utmCampaign.trim());
      return { url: parsed.toString(), error: '' };
    } catch {
      return { url: '', error: d.developer.utm.invalidUrl };
    }
  }, [utmUrl, utmSource, utmMedium, utmCampaign, d.developer.utm.invalidUrl]);

  // Meta Tag evaluation
  const metaResult = useMemo(() => {
    const t = metaTitle.trim();
    const desc = metaDescription.trim();
    const img = metaImage.trim();
    return `<title>${t}</title>\n<meta name="description" content="${desc}">\n\n<meta property="og:type" content="website">\n<meta property="og:title" content="${t}">\n<meta property="og:description" content="${desc}">\n<meta property="og:image" content="${img}">\n\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${t}">\n<meta name="twitter:description" content="${desc}">\n<meta name="twitter:image" content="${img}">`;
  }, [metaTitle, metaDescription, metaImage]);

  // Robots.txt evaluation
  const robotsResult = useMemo(() => {
    const agent = robotsAgent.trim() || '*';
    const disallow = robotsDisallow.trim() || '/';
    const sitemap = robotsSitemap.trim();
    return `User-agent: ${agent}\nDisallow: ${disallow}${sitemap ? `\n\nSitemap: ${sitemap}` : ''}`;
  }, [robotsAgent, robotsDisallow, robotsSitemap]);

  const handleReset = () => {
    if (slug === 'regex-tester') {
      setPattern('[A-Z]\\w+');
      setFlags('g');
      setTestText('Hello World, this is a Regex Test.');
    } else if (slug === 'unix-timestamp-converter') {
      setTimestamp('1700000000');
    } else if (slug === 'utm-builder') {
      setUtmUrl('https://navorika.com');
      setUtmSource('google');
      setUtmMedium('cpc');
      setUtmCampaign('summer_sale');
    } else if (slug === 'meta-tag-generator') {
      setMetaTitle('Navorika - Free Tools');
      setMetaDescription('Privacy-first online utilities.');
      setMetaImage('https://navorika.com/og-image.png');
    } else if (slug === 'robots-txt-generator') {
      setRobotsAgent('*');
      setRobotsDisallow('/private/');
      setRobotsSitemap('https://navorika.com/sitemap.xml');
    }
  };

  const toolTitle = d.tools[slug].title;

  let activeSummary = '';
  if (slug === 'regex-tester') {
    activeSummary = `${toolTitle}\n${regexResult.error || (regexResult.matches.length ? regexResult.matches.map((m, idx) => `[${idx}] ${m}`).join('\n') : d.developer.regex.noMatches)}`;
  } else if (slug === 'unix-timestamp-converter') {
    activeSummary = `${toolTitle}\n${timestampResult || d.developer.timestamp.invalid}`;
  } else if (slug === 'utm-builder') {
    activeSummary = `${toolTitle}\n${utmResult.url || utmResult.error}`;
  } else if (slug === 'meta-tag-generator') {
    activeSummary = `${toolTitle}\n${metaResult}`;
  } else if (slug === 'robots-txt-generator') {
    activeSummary = `${toolTitle}\n${robotsResult}`;
  }

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,.8fr)]">
      <section className="min-w-0 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7">
        <div className="flex items-center gap-3">
          <Code2 aria-hidden="true" className="size-6 text-indigo-600" />
          <h2 className="text-xl font-bold">{calcUi.inputs}</h2>
        </div>

        {slug === 'regex-tester' && (
          <div className="mt-6 grid min-w-0 gap-4 sm:grid-cols-2">
            <label className="min-w-0 text-sm font-semibold">
              {d.developer.regex.patternLabel}
              <input
                type="text"
                dir="ltr"
                className={fieldClass}
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
              />
            </label>
            <label className="min-w-0 text-sm font-semibold">
              {d.developer.regex.flagsLabel}
              <input
                type="text"
                dir="ltr"
                className={fieldClass}
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
              />
            </label>
            <label className="min-w-0 text-sm font-semibold sm:col-span-2">
              {d.developer.regex.textLabel}
              <textarea
                dir="ltr"
                className={`${fieldClass} min-h-32`}
                rows={4}
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
              />
            </label>
          </div>
        )}

        {slug === 'unix-timestamp-converter' && (
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-semibold">
              {d.developer.timestamp.inputLabel}
              <input
                type="text"
                dir="ltr"
                className={fieldClass}
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
              />
            </label>
            <button
              type="button"
              className={buttonClass}
              onClick={() => setTimestamp(Math.floor(Date.now() / 1000).toString())}
            >
              {d.developer.timestamp.useCurrent}
            </button>
          </div>
        )}

        {slug === 'utm-builder' && (
          <div className="mt-6 grid min-w-0 gap-4 sm:grid-cols-2">
            <label className="min-w-0 text-sm font-semibold sm:col-span-2">
              {d.developer.utm.targetUrl}
              <input
                type="text"
                dir="ltr"
                className={fieldClass}
                value={utmUrl}
                onChange={(e) => setUtmUrl(e.target.value)}
              />
            </label>
            <label className="min-w-0 text-sm font-semibold">
              {d.developer.utm.campaignSource}
              <input
                type="text"
                dir="ltr"
                className={fieldClass}
                value={utmSource}
                onChange={(e) => setUtmSource(e.target.value)}
              />
            </label>
            <label className="min-w-0 text-sm font-semibold">
              {d.developer.utm.campaignMedium}
              <input
                type="text"
                dir="ltr"
                className={fieldClass}
                value={utmMedium}
                onChange={(e) => setUtmMedium(e.target.value)}
              />
            </label>
            <label className="min-w-0 text-sm font-semibold sm:col-span-2">
              {d.developer.utm.campaignName}
              <input
                type="text"
                dir="ltr"
                className={fieldClass}
                value={utmCampaign}
                onChange={(e) => setUtmCampaign(e.target.value)}
              />
            </label>
          </div>
        )}

        {slug === 'meta-tag-generator' && (
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-semibold">
              {d.developer.meta.pageTitle}
              <input
                type="text"
                className={fieldClass}
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
              />
            </label>
            <label className="block text-sm font-semibold">
              {d.developer.meta.pageDescription}
              <textarea
                className={`${fieldClass} min-h-24`}
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
              />
            </label>
            <label className="block text-sm font-semibold">
              {d.developer.meta.ogImage}
              <input
                type="text"
                dir="ltr"
                className={fieldClass}
                value={metaImage}
                onChange={(e) => setMetaImage(e.target.value)}
              />
            </label>
          </div>
        )}

        {slug === 'robots-txt-generator' && (
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-semibold">
              {d.developer.robots.userAgent}
              <input
                type="text"
                dir="ltr"
                className={fieldClass}
                value={robotsAgent}
                onChange={(e) => setRobotsAgent(e.target.value)}
              />
            </label>
            <label className="block text-sm font-semibold">
              {d.developer.robots.disallowPath}
              <input
                type="text"
                dir="ltr"
                className={fieldClass}
                value={robotsDisallow}
                onChange={(e) => setRobotsDisallow(e.target.value)}
              />
            </label>
            <label className="block text-sm font-semibold">
              {d.developer.robots.sitemapUrl}
              <input
                type="text"
                dir="ltr"
                className={fieldClass}
                value={robotsSitemap}
                onChange={(e) => setRobotsSitemap(e.target.value)}
              />
            </label>
          </div>
        )}

        <button type="button" className={`${buttonClass} mt-6`} onClick={handleReset}>
          {ui.reset}
        </button>
      </section>

      <aside className="min-w-0 rounded-3xl border border-indigo-500/20 bg-indigo-500/5 p-5 sm:p-7">
        <h2 className="text-xl font-bold">{calcUi.results}</h2>

        <div aria-live="polite" aria-atomic="true">
          {slug === 'regex-tester' && (
            <div className="mt-5">
              <h3 className="text-sm font-bold text-[var(--muted-foreground)]">
                {d.developer.regex.resultsLabel}
              </h3>
              {regexResult.error ? (
                <p role="alert" className="mt-3 text-sm font-semibold text-rose-500">
                  {regexResult.error}
                </p>
              ) : regexResult.matches.length ? (
                <dl className="mt-3 grid gap-2">
                  {regexResult.matches.map((match, index) => (
                    <div
                      key={`${match}-${index}`}
                      className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 font-mono text-sm break-all"
                    >
                      <dt className="sr-only">Match {index}</dt>
                      <dd>
                        <bdi dir="ltr">[{index}] {match}</bdi>
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                  {d.developer.regex.noMatches}
                </p>
              )}
            </div>
          )}

          {slug === 'unix-timestamp-converter' && (
            <div className="mt-5">
              <h3 className="text-sm font-bold text-[var(--muted-foreground)]">
                {d.developer.timestamp.resultLabel}
              </h3>
              {timestampResult ? (
                <div className="mt-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
                  <dd suppressHydrationWarning className="text-xl font-black break-words">
                    <bdi dir="ltr" suppressHydrationWarning>{timestampResult}</bdi>
                  </dd>
                </div>
              ) : (
                <p role="alert" className="mt-3 text-sm font-semibold text-rose-500">
                  {d.developer.timestamp.invalid}
                </p>
              )}
            </div>
          )}

          {slug === 'utm-builder' && (
            <div className="mt-5">
              <h3 className="text-sm font-bold text-[var(--muted-foreground)]">
                {d.developer.utm.outputLabel}
              </h3>
              {utmResult.error ? (
                <p role="alert" className="mt-3 text-sm font-semibold text-rose-500">
                  {utmResult.error}
                </p>
              ) : (
                <div className="mt-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
                  <dd className="font-mono text-sm break-all">
                    <bdi dir="ltr">{utmResult.url}</bdi>
                  </dd>
                </div>
              )}
            </div>
          )}

          {slug === 'meta-tag-generator' && (
            <div className="mt-5">
              <h3 className="text-sm font-bold text-[var(--muted-foreground)]">
                {d.developer.meta.outputLabel}
              </h3>
              <pre
                dir="ltr"
                className="mt-3 max-h-96 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 font-mono text-xs leading-relaxed whitespace-pre"
              >
                {metaResult}
              </pre>
            </div>
          )}

          {slug === 'robots-txt-generator' && (
            <div className="mt-5">
              <h3 className="text-sm font-bold text-[var(--muted-foreground)]">
                {d.developer.robots.outputLabel}
              </h3>
              <pre
                dir="ltr"
                className="mt-3 max-h-96 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 font-mono text-xs leading-relaxed whitespace-pre"
              >
                {robotsResult}
              </pre>
            </div>
          )}
        </div>

        {activeSummary && (
          <ResultActions
            key={activeSummary}
            className="mt-5"
            messages={resultActionMessages[locale]}
            actions={[
              { kind: 'copy', label: ui.copy, getContent: () => activeSummary },
              { kind: 'print' },
            ]}
          />
        )}
      </aside>
    </div>
  );
}
