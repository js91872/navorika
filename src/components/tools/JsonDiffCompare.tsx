'use client';

import { Copy } from 'lucide-react';
import { useMemo, useState } from 'react';
import { compareJson } from '@/lib/calculations/jsonDiff';

const examples = ['{"user":{"name":"Ana","roles":["editor"]},"active":true}', '{"user":{"name":"Ana","roles":["editor","admin"]},"verified":true}'];
const show = (value: unknown) => value === undefined ? '—' : JSON.stringify(value);

export default function JsonDiffCompare() {
  const [left, setLeft] = useState(examples[0]); const [right, setRight] = useState(examples[1]);
  const result = useMemo(() => {
    try { return { diff: compareJson(JSON.parse(left) as unknown, JSON.parse(right) as unknown), error: '' }; }
    catch (error) { return { diff: null, error: error instanceof SyntaxError ? `Invalid JSON: ${error.message}` : 'Unable to compare JSON.' }; }
  }, [left, right]);
  const summary = result.diff ? `Added: ${result.diff.added}\nRemoved: ${result.diff.removed}\nChanged: ${result.diff.changed}\nUnchanged: ${result.diff.unchanged}\n\n${result.diff.entries.map((item) => `${item.kind.toUpperCase()} ${item.path}: ${show(item.before)} → ${show(item.after)}`).join('\n')}` : '';
  return <div className="space-y-6"><section className="grid gap-5 lg:grid-cols-2">{[['Original JSON', left, setLeft], ['Compared JSON', right, setRight]].map(([label, value, setter]) => <label key={label as string} className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 text-lg font-bold">{label as string}<textarea aria-label={label as string} value={value as string} onChange={(event) => (setter as (value: string) => void)(event.target.value)} spellCheck={false} className="mt-4 min-h-72 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm font-normal" /></label>)}</section>
    {result.error ? <p role="alert" className="rounded-xl bg-red-500/10 p-4 text-red-600">{result.error}</p> : result.diff && <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold">Structural diff</h2><button type="button" onClick={() => void navigator.clipboard.writeText(summary)} className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-semibold"><Copy className="size-4" /> Copy summary</button></div><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{(['added','removed','changed','unchanged'] as const).map((key) => <div key={key} className="rounded-xl bg-[var(--background)] p-3"><p className="text-xs capitalize text-[var(--muted-foreground)]">{key}</p><p className="text-2xl font-black">{result.diff?.[key]}</p></div>)}</div><div className="mt-5 overflow-x-auto"><table className="min-w-full text-left text-sm"><thead><tr><th className="p-3">Change</th><th className="p-3">Path</th><th className="p-3">Before</th><th className="p-3">After</th></tr></thead><tbody>{result.diff.entries.map((item, index) => <tr key={`${item.path}-${index}`} className="border-t border-[var(--border)]"><td className="p-3 font-semibold capitalize">{item.kind}</td><td className="p-3 font-mono">{item.path}</td><td className="max-w-64 break-all p-3 font-mono">{show(item.before)}</td><td className="max-w-64 break-all p-3 font-mono">{show(item.after)}</td></tr>)}</tbody></table></div></section>}
  </div>;
}
