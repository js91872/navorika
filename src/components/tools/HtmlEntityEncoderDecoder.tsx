'use client';

import { ArrowDownUp, Copy, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

const encode = (value: string, numeric: boolean) => [...value].map((character) => {
  if (numeric && (character.codePointAt(0) ?? 0) > 127) return `&#${character.codePointAt(0)};`;
  return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string,string>)[character] ?? character;
}).join('');
const decode = (value: string) => { const element = document.createElement('textarea'); element.innerHTML = value; return element.value; };

export default function HtmlEntityEncoderDecoder() {
  const [input, setInput] = useState('<p title="Tea & biscuits">Café</p>'); const [mode, setMode] = useState<'encode'|'decode'>('encode'); const [numeric, setNumeric] = useState(false);
  const output = useMemo(() => mode === 'encode' ? encode(input, numeric) : decode(input), [input, mode, numeric]);
  return <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7"><div className="flex flex-wrap gap-4"><label className="text-sm font-semibold">Operation<select value={mode} onChange={(event) => setMode(event.target.value as 'encode'|'decode')} className="ml-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2"><option value="encode">Encode</option><option value="decode">Decode</option></select></label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={numeric} onChange={(event) => setNumeric(event.target.checked)} disabled={mode === 'decode'} /> Encode non-ASCII as numeric entities</label></div><div className="mt-5 grid gap-5 lg:grid-cols-2"><label className="font-bold">Input<textarea value={input} onChange={(event) => setInput(event.target.value)} className="mt-2 min-h-64 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm font-normal" /></label><label className="font-bold">Plain-text output (never rendered as HTML)<textarea value={output} readOnly className="mt-2 min-h-64 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm font-normal" /></label></div><div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => { setInput(output); setMode(mode === 'encode' ? 'decode' : 'encode'); }} className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold"><ArrowDownUp className="size-4" /> Swap</button><button type="button" onClick={() => void navigator.clipboard.writeText(output)} className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold"><Copy className="size-4" /> Copy</button><button type="button" onClick={() => setInput('')} className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold"><Trash2 className="size-4" /> Clear</button></div></section>;
}
