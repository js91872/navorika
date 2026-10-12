'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Mail } from 'lucide-react';

type NewsletterSignupProps = {
  compact?: boolean;
  id?: string;
};

export default function NewsletterSignup({ compact = false, id = 'newsletter-heading' }: NewsletterSignupProps) {
  const emailId = `${id}-email`;
  const consentId = `${id}-consent`;
  const honeypotId = `${id}-website`;
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          consent,
          website: new FormData(event.currentTarget).get('website'),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Signup failed. Please try again.');
      setIsSuccess(true);
      setStatus(result.message || 'You’re on the list. Thanks for subscribing.');
      setEmail('');
      setConsent(false);
    } catch (error) {
      setIsSuccess(false);
      setStatus(error instanceof Error ? error.message : 'Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={compact ? 'w-full' : 'mx-auto w-full max-w-3xl'} aria-labelledby={id}>
      <div className={compact ? 'rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5' : 'rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-cyan-500/10 p-6 sm:p-8'}>
        <div className={compact ? '' : 'text-center'}>
          <div className={`flex items-center gap-3 ${compact ? '' : 'justify-center'}`}>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Mail className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 id={id} className="text-lg font-bold sm:text-xl">Get useful Navorika updates</h2>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">Occasional notes about new free tools and useful updates. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>

        {isSuccess ? (
          <p className="mt-5 flex items-start gap-2 rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300" role="status" aria-live="polite">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{status}
          </p>
        ) : (
          <form className="mt-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor={emailId}>Email address</label>
              <input
                id={emailId}
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="min-h-12 min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 text-base text-[var(--foreground)] outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="submit"
                disabled={isSubmitting || !consent}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-55"
              >
                {isSubmitting ? 'Joining…' : 'Sign me up'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-3 flex items-start gap-2">
              <input
                id={consentId}
                name="consent"
                type="checkbox"
                required
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-indigo-600"
              />
              <label htmlFor={consentId} className="text-xs leading-5 text-[var(--muted-foreground)]">
                Email me occasional Navorika product and tool updates. I can unsubscribe at any time. See the{' '}
                <Link href="/privacy" className="font-medium text-indigo-600 underline underline-offset-2 dark:text-indigo-400">Privacy Policy</Link>.
              </label>
            </div>

            <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor={honeypotId}>Leave this field empty</label>
              <input id={honeypotId} name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>
            {status && <p className="mt-3 text-sm text-rose-600 dark:text-rose-400" role="alert">{status}</p>}
          </form>
        )}
      </div>
    </section>
  );
}
