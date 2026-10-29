'use client';

import { useRef, useState } from 'react';
import { resultActionMessages, resultActionError, type ActionMessages } from '@/lib/i18n/actionMessages';
import { ClipboardCopy, Download, Printer } from 'lucide-react';

type ContentFactory = () => string | Promise<string>;

export type ResultAction =
  | { kind: 'copy'; label: string; getContent: ContentFactory }
  | { kind: 'download'; label: string; filename: string; mimeType: string; getContent: ContentFactory }
  | { kind: 'print'; label?: string };

export default function ResultActions({ actions, className = '', messages }: { actions: readonly ResultAction[]; className?: string; messages?: ActionMessages }) {
  const copy = messages ?? resultActionMessages.en;
  const [message, setMessage] = useState('');
  const [busyIndex, setBusyIndex] = useState<number | null>(null);
  const messageTimer = useRef<number | null>(null);

  const announce = (next: string) => {
    setMessage(next);
    if (messageTimer.current) window.clearTimeout(messageTimer.current);
    messageTimer.current = window.setTimeout(() => setMessage(''), 2500);
  };

  const run = async (action: ResultAction, index: number) => {
    setBusyIndex(index);
    try {
      if (action.kind === 'print') {
        window.print();
        announce(copy.printOpened);
      } else {
        const content = await action.getContent();
        if (!content) { announce(copy.noResult); return; }
        if (action.kind === 'copy') {
          await navigator.clipboard.writeText(content);
          announce(copy.copied);
        } else {
          const url = URL.createObjectURL(new Blob([content], { type: action.mimeType }));
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = action.filename;
          anchor.click();
          window.setTimeout(() => URL.revokeObjectURL(url), 0);
          announce(messages ? copy.downloadReady : `${action.label} ready.`);
        }
      }
    } catch (error) {
      announce(resultActionError(error, messages));
    } finally {
      setBusyIndex(null);
    }
  };

  if (!actions.length) return null;
  return <div className={className}>
    <div className="flex flex-wrap gap-2" aria-label={copy.group}>
      {actions.map((action, index) => {
        const Icon = action.kind === 'copy' ? ClipboardCopy : action.kind === 'download' ? Download : Printer;
        const label = action.kind === 'print' ? action.label ?? copy.print : action.label;
        return <button key={`${action.kind}-${label}`} type="button" disabled={busyIndex !== null} onClick={() => void run(action, index)} aria-label={label} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-bold text-[var(--foreground)] hover:border-indigo-500 disabled:opacity-50"><Icon className="size-4" aria-hidden="true" />{busyIndex === index ? copy.working : label}</button>;
      })}
    </div>
    <p className="sr-only" role="status" aria-live="polite">{message}</p>
    {message && <p className="mt-2 text-sm font-medium text-[var(--muted-foreground)]" aria-hidden="true">{message}</p>}
  </div>;
}
