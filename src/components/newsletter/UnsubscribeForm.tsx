'use client';

import { useState } from 'react';
import { CheckCircle2, MailX } from 'lucide-react';

export default function UnsubscribeForm({ token }: { token: string }) {
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  async function handleUnsubscribe() {
    setIsSubmitting(true);
    setStatus('');
    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'We could not process your request.');
      setIsDone(true);
      setStatus(result.message);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'We could not process your request.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center">
      {isDone ? <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" aria-hidden="true" /> : <MailX className="mx-auto h-10 w-10 text-indigo-500" aria-hidden="true" />}
      <h2 className="mt-4 text-xl font-bold">{isDone ? 'You’re unsubscribed' : 'Stop Navorika email updates?'}</h2>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]" role={status ? (isDone ? 'status' : 'alert') : undefined} aria-live="polite">
        {status || 'Confirm below to stop receiving occasional Navorika product and tool updates.'}
      </p>
      {!isDone && token && (
        <button
          type="button"
          onClick={handleUnsubscribe}
          disabled={isSubmitting}
          className="mt-5 min-h-11 rounded-xl bg-indigo-600 px-5 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {isSubmitting ? 'Processing…' : 'Unsubscribe'}
        </button>
      )}
      {!token && <p className="mt-4 text-sm text-rose-600 dark:text-rose-400">This unsubscribe link is incomplete. Please use the link from your email.</p>}
    </div>
  );
}
