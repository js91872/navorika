'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Copy, ShieldCheck } from 'lucide-react';

type DeveloperKind = 'regex' | 'timestamp' | 'gradient';
type WebmasterKind = 'utm' | 'meta' | 'robots';

const developerCopy: Record<DeveloperKind, { title: string; description: string }> = {
  regex: { title: 'Regex Tester', description: 'Test JavaScript regular expressions and flags against sample text in your browser.' },
  timestamp: { title: 'Unix Timestamp Converter', description: 'Convert Unix seconds or milliseconds to a date in your browser’s local time zone.' },
  gradient: { title: 'CSS Gradient Generator', description: 'Build a two-color linear gradient and copy the generated CSS declaration.' },
};

const webmasterCopy: Record<WebmasterKind, { title: string; description: string }> = {
  utm: { title: 'UTM Builder', description: 'Add source, medium, and campaign parameters to a valid campaign URL.' },
  meta: { title: 'Meta Tag Generator', description: 'Generate basic title, description, Open Graph, and Twitter card markup.' },
  robots: { title: 'Robots.txt Generator', description: 'Generate a simple robots.txt block for one user-agent and disallow path.' },
};

function ToolShell({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      <Link href="/categories/developer-tools" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-600"><ArrowLeft className="h-4 w-4" /> Back to Developer Tools</Link>
      <header className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400"><ShieldCheck className="h-4 w-4" /> Local browser processing</div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white">{title}</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">{description}</p>
      </header>
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">{children}</div>
    </main>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };
  return <button type="button" onClick={copy} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? 'Copied' : 'Copy'}</button>;
}

export function FocusedDeveloperTool({ kind }: { kind: DeveloperKind }) {
  const copy = developerCopy[kind];
  const [pattern, setPattern] = useState('[A-Z]\\w+');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState('Hello World, this is a Regex Test.');
  const [timestamp, setTimestamp] = useState(() => Math.floor(Date.now() / 1000).toString());
  const [color1, setColor1] = useState('#6366f1');
  const [color2, setColor2] = useState('#a855f7');
  const [angle, setAngle] = useState(135);

  const regexResult = useMemo(() => {
    try {
      const matches = testText.match(new RegExp(pattern, flags));
      return { matches: matches ? Array.from(matches) : [], error: '' };
    } catch (error) {
      return { matches: [], error: error instanceof Error ? error.message : 'Invalid regular expression.' };
    }
  }, [flags, pattern, testText]);
  const timestampResult = useMemo(() => {
    if (!/^-?\d+$/.test(timestamp.trim())) return 'Invalid timestamp';
    const numeric = Number(timestamp);
    const date = new Date(timestamp.replace('-', '').length > 10 ? numeric : numeric * 1000);
    return Number.isNaN(date.getTime()) ? 'Invalid timestamp' : date.toLocaleString();
  }, [timestamp]);
  const gradient = `background: linear-gradient(${angle}deg, ${color1}, ${color2});`;

  return <ToolShell title={copy.title} description={copy.description}>
    {kind === 'regex' && <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-4">
        <div className="grid grid-cols-[1fr_6rem] gap-3"><label className="text-sm font-bold">Regular expression<input value={pattern} onChange={(event) => setPattern(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-sm dark:border-slate-800 dark:bg-slate-950" /></label><label className="text-sm font-bold">Flags<input value={flags} onChange={(event) => setFlags(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-sm dark:border-slate-800 dark:bg-slate-950" /></label></div>
        <label className="block text-sm font-bold">Test text<textarea value={testText} onChange={(event) => setTestText(event.target.value)} className="mt-2 min-h-56 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-sm dark:border-slate-800 dark:bg-slate-950" /></label>
      </div>
      <section aria-live="polite"><h2 className="text-sm font-bold uppercase text-emerald-600">Match results</h2>{regexResult.error ? <p className="mt-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-bold text-red-600">{regexResult.error}</p> : <div className="mt-2 min-h-56 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm dark:border-slate-800 dark:bg-slate-950">{regexResult.matches.length ? regexResult.matches.map((match, index) => <div key={`${match}-${index}`} className="rounded border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 break-all">[{index}] {match}</div>) : <span className="text-slate-500">No matches found.</span>}</div>}</section>
    </div>}
    {kind === 'timestamp' && <div className="grid items-center gap-8 md:grid-cols-2"><label className="text-sm font-bold">Unix timestamp (seconds or milliseconds)<input type="number" value={timestamp} onChange={(event) => setTimestamp(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-lg dark:border-slate-800 dark:bg-slate-950" /><button type="button" onClick={() => setTimestamp(Math.floor(Date.now() / 1000).toString())} className="mt-3 rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold dark:border-slate-700">Use current time</button></label><section className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-950" aria-live="polite"><h2 className="text-xs font-bold uppercase text-slate-500">Local date and time</h2><p className="mt-3 text-2xl font-black">{timestampResult}</p></section></div>}
    {kind === 'gradient' && <div className="grid gap-8 md:grid-cols-2"><div className="space-y-6"><div className="grid grid-cols-2 gap-4"><label className="text-sm font-bold">First color<input type="color" value={color1} onChange={(event) => setColor1(event.target.value)} className="mt-2 h-12 w-full" /></label><label className="text-sm font-bold">Second color<input type="color" value={color2} onChange={(event) => setColor2(event.target.value)} className="mt-2 h-12 w-full" /></label></div><label className="block text-sm font-bold">Angle: {angle}°<input type="range" min="0" max="360" value={angle} onChange={(event) => setAngle(Number(event.target.value))} className="mt-2 w-full accent-emerald-600" /></label><textarea readOnly value={gradient} className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm dark:border-slate-800 dark:bg-slate-950" /><CopyButton value={gradient} /></div><div className="min-h-72 rounded-2xl border border-slate-200 shadow-inner dark:border-slate-800" style={{ background: `linear-gradient(${angle}deg, ${color1}, ${color2})` }} /></div>}
  </ToolShell>;
}

export function FocusedWebmasterTool({ kind }: { kind: WebmasterKind }) {
  const copy = webmasterCopy[kind];
  const [utm, setUtm] = useState({ url: 'https://navorika.com', source: 'google', medium: 'cpc', campaign: 'summer_sale' });
  const [meta, setMeta] = useState({ title: 'Navorika - Free Tools', description: 'Privacy-first online utilities.', image: 'https://navorika.com/og-image.png' });
  const [robots, setRobots] = useState({ agent: '*', disallow: '/private/', sitemap: 'https://navorika.com/sitemap.xml' });
  const output = useMemo(() => {
    if (kind === 'utm') {
      try { const url = new URL(utm.url); if (utm.source) url.searchParams.set('utm_source', utm.source); if (utm.medium) url.searchParams.set('utm_medium', utm.medium); if (utm.campaign) url.searchParams.set('utm_campaign', utm.campaign); return url.toString(); } catch { return 'Please enter a valid starting URL (for example, https://example.com).'; }
    }
    if (kind === 'meta') return `<title>${meta.title}</title>\n<meta name="description" content="${meta.description}">\n\n<meta property="og:type" content="website">\n<meta property="og:title" content="${meta.title}">\n<meta property="og:description" content="${meta.description}">\n<meta property="og:image" content="${meta.image}">\n\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${meta.title}">\n<meta name="twitter:description" content="${meta.description}">\n<meta name="twitter:image" content="${meta.image}">`;
    return `User-agent: ${robots.agent || '*'}\nDisallow: ${robots.disallow}\n\nSitemap: ${robots.sitemap}`;
  }, [kind, meta, robots, utm]);

  return <ToolShell title={copy.title} description={copy.description}><div className="grid gap-8 md:grid-cols-2"><div className="space-y-4">
    {kind === 'utm' && <>{(['url', 'source', 'medium', 'campaign'] as const).map((field) => <label key={field} className="block text-sm font-bold capitalize">{field === 'url' ? 'Target URL' : `Campaign ${field}`}<input value={utm[field]} onChange={(event) => setUtm({ ...utm, [field]: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-950" /></label>)}</>}
    {kind === 'meta' && <><label className="block text-sm font-bold">Page title<input value={meta.title} onChange={(event) => setMeta({ ...meta, title: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-950" /></label><label className="block text-sm font-bold">Page description<textarea value={meta.description} onChange={(event) => setMeta({ ...meta, description: event.target.value })} className="mt-2 min-h-24 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-950" /></label><label className="block text-sm font-bold">Open Graph image URL<input value={meta.image} onChange={(event) => setMeta({ ...meta, image: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-950" /></label></>}
    {kind === 'robots' && <><label className="block text-sm font-bold">User-agent<input value={robots.agent} onChange={(event) => setRobots({ ...robots, agent: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-950" /></label><label className="block text-sm font-bold">Disallow path<input value={robots.disallow} onChange={(event) => setRobots({ ...robots, disallow: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-950" /></label><label className="block text-sm font-bold">Sitemap URL<input value={robots.sitemap} onChange={(event) => setRobots({ ...robots, sitemap: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-950" /></label></>}
  </div><section><h2 className="text-sm font-bold uppercase text-emerald-600">Generated output</h2><textarea readOnly value={output} className="mt-2 min-h-80 w-full rounded-xl border border-slate-200 bg-slate-50 p-5 font-mono text-sm dark:border-slate-800 dark:bg-slate-950" /><div className="mt-3"><CopyButton value={output} /></div></section></div></ToolShell>;
}
