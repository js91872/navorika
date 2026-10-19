'use client';
import { useState } from 'react';
import type { Dictionary } from '@/lib/i18n/dictionaries';

export const fieldClass = 'mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-[var(--foreground)]';
export const buttonClass = 'rounded-xl border border-[var(--border)] px-4 py-3 font-semibold hover:bg-[var(--muted)] disabled:opacity-50';

export function CopyResult({ text, d }: { text: string; d: Dictionary }) {
  const [status, setStatus] = useState('');
  return <div className="mt-4 flex flex-wrap items-center gap-3">
    <button type="button" className={buttonClass} disabled={!text} onClick={async () => {
      try { await navigator.clipboard.writeText(text); setStatus(d.ui.copied); }
      catch { setStatus(d.ui.copyError); }
    }}>{d.ui.copy}</button>
    <span role="status">{status}</span>
  </div>;
}

