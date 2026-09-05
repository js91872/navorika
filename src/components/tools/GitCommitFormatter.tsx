'use client';

import { useMemo, useState } from 'react';
import {
  Check,
  Copy,
  RotateCcw,
  GitCommit,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import {
  formatCommitMessage,
  COMMIT_TYPES,
  type CommitType,
} from '@/lib/calculations/gitCommit';

export default function GitCommitFormatter() {
  const [type, setType] = useState<CommitType>('feat');
  const [scope, setScope] = useState('');
  const [description, setDescription] = useState('add user profile page');
  const [breaking, setBreaking] = useState(false);
  const [body, setBody] = useState('');
  const [footer, setFooter] = useState('');
  const [copied, setCopied] = useState(false);

  const { message, header, headerLength, isHeaderOver50, isHeaderOver72, warnings, isValid } = useMemo(() => {
    return formatCommitMessage({
      type,
      scope,
      description,
      breaking,
      body,
      footer,
    });
  }, [type, scope, description, breaking, body, footer]);

  const copyMessage = async () => {
    if (!message) return;
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setType('feat');
    setScope('');
    setDescription('add user profile page');
    setBreaking(false);
    setBody('');
    setFooter('');
  };

  const commonScopes = ['auth', 'ui', 'api', 'db', 'docs', 'deps', 'router', 'config'];

  const inputClass =
    'mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      {/* Form Controls */}
      <section className="min-w-0 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-3">
            <GitCommit className="size-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-bold">Commit Details</h2>
          </div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted-foreground)] hover:text-indigo-600"
          >
            <RotateCcw className="size-3.5" /> Reset
          </button>
        </div>

        <div className="mt-5 space-y-5">
          {/* Commit Type Chips */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Change Type
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {COMMIT_TYPES.map((t) => {
                const isSelected = type === t.type;
                return (
                  <button
                    key={t.type}
                    type="button"
                    onClick={() => setType(t.type)}
                    className={`rounded-xl border p-2 text-left transition ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-900 dark:border-indigo-500/60 dark:bg-indigo-500/20 dark:text-indigo-200'
                        : 'border-[var(--border)] bg-[var(--background)] hover:border-indigo-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold">{t.type}</span>
                      {isSelected && <Check className="size-3 text-indigo-600 dark:text-indigo-400" />}
                    </div>
                    <p className="mt-0.5 truncate text-[11px] text-[var(--muted-foreground)]">
                      {t.title}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scope Input & Quick Tags */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold">Scope (optional)</label>
              <span className="text-xs text-[var(--muted-foreground)]">e.g. auth, checkout, parser</span>
            </div>
            <input
              type="text"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder="e.g. auth"
              className={inputClass}
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {commonScopes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setScope(s)}
                  className="rounded-full border border-[var(--border)] bg-[var(--background)] px-2.5 py-0.5 text-[11px] font-mono text-[var(--muted-foreground)] hover:border-indigo-400 hover:text-indigo-600"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Description Input */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold">Description (imperative, lowercase)</label>
              <span
                className={`font-mono text-xs ${
                  isHeaderOver72
                    ? 'font-bold text-red-500'
                    : isHeaderOver50
                    ? 'text-amber-500'
                    : 'text-[var(--muted-foreground)]'
                }`}
              >
                {headerLength} / 50-72 chars
              </span>
            </div>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. add user profile page"
              className={inputClass}
            />
          </div>

          {/* Breaking Change Toggle */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
            <label className="flex cursor-pointer items-center justify-between">
              <div>
                <span className="text-sm font-bold text-[var(--foreground)]">
                  Breaking Change (!)
                </span>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Appends ! to the type/scope and adds a BREAKING CHANGE footer note
                </p>
              </div>
              <input
                type="checkbox"
                checked={breaking}
                onChange={(e) => setBreaking(e.target.checked)}
                className="size-4 rounded accent-indigo-600"
              />
            </label>
          </div>

          {/* Optional Extended Body */}
          <div>
            <label className="text-sm font-semibold">Extended Body (optional)</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              placeholder="Provide additional context on motivation and comparison with previous behavior..."
              className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs leading-relaxed outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Optional Footer */}
          <div>
            <label className="text-sm font-semibold">Footer / Issue References (optional)</label>
            <input
              type="text"
              value={footer}
              onChange={(e) => setFooter(e.target.value)}
              placeholder="Closes #123, Refs #456"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Formatted Output Box */}
      <aside className="min-w-0 rounded-3xl border border-indigo-500/20 bg-indigo-500/5 p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Conventional Commit</h2>
            <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
              Deterministic format • Ready for git commit -m
            </p>
          </div>
          <button
            type="button"
            onClick={copyMessage}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700"
          >
            {copied ? (
              <>
                <Check className="size-3.5" /> Copied Message
              </>
            ) : (
              <>
                <Copy className="size-3.5" /> Copy Message
              </>
            )}
          </button>
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="mt-4 space-y-1 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200">
            {warnings.map((w, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <AlertCircle className="size-3.5 shrink-0 text-amber-600" />
                <span>{w}</span>
              </div>
            ))}
          </div>
        )}

        {/* Output Pre */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--border)] bg-slate-950 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2 text-xs font-mono text-slate-400">
            <span>commit message</span>
            <span>{headerLength} characters</span>
          </div>
          <pre className="max-h-[380px] overflow-auto p-4 font-mono text-xs leading-relaxed text-emerald-400">
            <code>{message}</code>
          </pre>
        </div>

        {/* Git CLI quick command preview */}
        <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            Terminal Usage
          </p>
          <div className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-3 font-mono text-xs text-slate-200">
            <code>git commit -m &quot;{header}&quot;</code>
          </div>
        </div>

        {/* Convention Guidelines */}
        <div className="mt-5 rounded-2xl border border-indigo-500/20 bg-[var(--card)] p-4 text-xs leading-relaxed text-[var(--muted-foreground)]">
          <strong className="text-[var(--foreground)]">Conventional Commits Quick Guide:</strong>
          <ul className="mt-1.5 list-inside list-disc space-y-1 pl-1">
            <li><strong>feat:</strong> introduces a new feature to the codebase.</li>
            <li><strong>fix:</strong> patches a bug in your codebase.</li>
            <li><strong>refactor:</strong> modifies code structure without changing features or fixes.</li>
            <li><strong>! / BREAKING CHANGE:</strong> signals API breaking changes requiring major version bumps.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
