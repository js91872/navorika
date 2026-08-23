'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  Copy,
  KeyRound,
  ShieldCheck,
  Trash2,
} from 'lucide-react';

function decodeBase64UrlUtf8(value: string) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);

  const binary = atob(padded);
  const bytes = Uint8Array.from(
    binary,
    (character) => character.charCodeAt(0)
  );

  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

function formatTimestamp(value: unknown) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null;
  }

  const date = new Date(value * 1000);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleString();
}

export default function JwtDecoderPage() {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState<Record<string, unknown> | null>(null);
  const [payload, setPayload] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const decodeJwt = (value: string) => {
    setToken(value);
    setError('');

    if (!value.trim()) {
      setHeader(null);
      setPayload(null);
      return;
    }

    try {
      const parts = value.trim().split('.');

      if (parts.length !== 3) {
        throw new Error(
          'Invalid JWT format. A compact JWT must contain three dot-separated segments.'
        );
      }

      const decodedHeader = JSON.parse(
        decodeBase64UrlUtf8(parts[0])
      ) as Record<string, unknown>;

      const decodedPayload = JSON.parse(
        decodeBase64UrlUtf8(parts[1])
      ) as Record<string, unknown>;

      setHeader(decodedHeader);
      setPayload(decodedPayload);
    } catch (err) {
      setHeader(null);
      setPayload(null);

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to decode this JWT.'
      );
    }
  };

  const copyText = async (text: string, key: string) => {
    if (!text) return;

    await navigator.clipboard.writeText(text);
    setCopied(key);

    window.setTimeout(() => {
      setCopied(null);
    }, 1500);
  };

  const clear = () => {
    setToken('');
    setHeader(null);
    setPayload(null);
    setError('');
  };

  const headerText = header
    ? JSON.stringify(header, null, 2)
    : '{}';

  const payloadText = payload
    ? JSON.stringify(payload, null, 2)
    : '{}';

  const timestampClaims = payload
    ? ([
        ['exp', 'Expires', payload.exp],
        ['iat', 'Issued at', payload.iat],
        ['nbf', 'Not before', payload.nbf],
      ] as const)
        .map(([claim, label, value]) => ({
          claim,
          label,
          value,
          formatted: formatTimestamp(value),
        }))
        .filter((item) => item.formatted)
    : [];

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      <Link
        href="/categories/developer-tools"
        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Developer Tools
      </Link>

      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="h-4 w-4" />
          Browser-only JWT decoding
        </div>

        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
          JWT Decoder
        </h1>

        <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-400">
          Decode JWT header and payload data online. Inspect claims such as
          algorithm, issuer, audience, subject, expiry and issued-at timestamps
          locally in your browser.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 md:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-blue-600" />
            <h2 className="font-black text-slate-900 dark:text-white">
              Decode JWT Token
            </h2>
          </div>

          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </button>
        </div>

        <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
          Paste JWT token
        </label>

        <textarea
          value={token}
          onChange={(event) => decodeJwt(event.target.value)}
          className="min-h-[180px] w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm outline-none transition focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950"
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          spellCheck={false}
        />

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-semibold text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section>
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
                  Header
                </p>
                <p className="text-xs text-slate-500">
                  Algorithm and token metadata
                </p>
              </div>

              <button
                type="button"
                aria-label="Copy decoded JWT header"
                onClick={() => void copyText(headerText, 'header')}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800"
              >
                {copied === 'header' ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>

            <pre className="min-h-[180px] overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-emerald-700 dark:border-slate-800 dark:bg-slate-950 dark:text-emerald-400">
              {headerText}
            </pre>
          </section>

          <section>
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                  Payload
                </p>
                <p className="text-xs text-slate-500">
                  Claims and application data
                </p>
              </div>

              <button
                type="button"
                aria-label="Copy decoded JWT payload"
                onClick={() => void copyText(payloadText, 'payload')}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800"
              >
                {copied === 'payload' ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>

            <pre className="min-h-[180px] overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-blue-700 dark:border-slate-800 dark:bg-slate-950 dark:text-blue-400">
              {payloadText}
            </pre>
          </section>
        </div>

        {timestampClaims.length > 0 && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
            <h3 className="font-black text-slate-900 dark:text-white">
              Timestamp claims
            </h3>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {timestampClaims.map((item) => (
                <div
                  key={item.claim}
                  className="rounded-xl bg-white p-4 dark:bg-slate-900"
                >
                  <p className="text-xs font-bold uppercase text-slate-500">
                    {item.claim} · {item.label}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {item.formatted}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-6 text-slate-700 dark:text-slate-300">
          <strong>Important:</strong> decoding a JWT does not verify its
          signature or prove that its claims are trustworthy. Signature,
          issuer, audience, expiry and application-specific validation must be
          performed by the consuming application.
        </div>
      </div>
    </main>
  );
}
