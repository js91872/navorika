'use client';

import { useMemo, useState } from 'react';
import {
  Check,
  Copy,
  Download,
  FileCode,
  RotateCcw,
  Sparkles,
  Layers,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  generateGitignore,
  GITIGNORE_TEMPLATES,
  GITIGNORE_TEMPLATE_ORDER,
} from '@/lib/calculations/gitignore';

export default function GitignoreGenerator() {
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([
    'node',
    'macos',
    'vscode',
  ]);
  const [customRules, setCustomRules] = useState<string[]>([]);
  const [newRule, setNewRule] = useState('');
  const [copied, setCopied] = useState(false);

  const toggleTemplate = (id: string) => {
    setSelectedTemplates((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const addCustomRule = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newRule.trim();
    if (trimmed && !customRules.includes(trimmed)) {
      setCustomRules((prev) => [...prev, trimmed]);
      setNewRule('');
    }
  };

  const removeCustomRule = (rule: string) => {
    setCustomRules((prev) => prev.filter((r) => r !== rule));
  };

  const selectAll = () => {
    setSelectedTemplates([...GITIGNORE_TEMPLATE_ORDER]);
  };

  const clearAll = () => {
    setSelectedTemplates([]);
    setCustomRules([]);
  };

  const applyPreset = (preset: string[]) => {
    setSelectedTemplates(preset);
  };

  const { content, ruleCount, templateCount } = useMemo(() => {
    const baseResult = generateGitignore(selectedTemplates);
    if (customRules.length === 0) {
      return baseResult;
    }

    const customSection = `# --- Custom Project Rules ---\n${customRules.join('\n')}\n`;
    const finalContent = `${baseResult.content}\n${customSection}`;
    return {
      content: finalContent,
      ruleCount: baseResult.ruleCount + customRules.length,
      templateCount: baseResult.templateCount,
    };
  }, [selectedTemplates, customRules]);

  const copyToClipboard = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadGitignore = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '.gitignore';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const categories = [
    { label: 'Languages', key: 'language' },
    { label: 'Frameworks', key: 'framework' },
    { label: 'Operating Systems', key: 'os' },
    { label: 'Editors & IDEs', key: 'editor' },
  ] as const;

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      {/* Configuration & Selection Panel */}
      <section className="min-w-0 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-5">
          <div className="flex items-center gap-3">
            <Layers className="size-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-bold">Select Stacks & Environments</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={selectAll}
              className="rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs font-semibold hover:bg-[var(--muted)]"
            >
              Select all
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs font-semibold hover:bg-[var(--muted)]"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            Quick Stacks
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => applyPreset(['node', 'nextjs', 'macos', 'vscode'])}
              className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-500/20 dark:text-indigo-400"
            >
              <Sparkles className="size-3" /> Node + Next.js
            </button>
            <button
              type="button"
              onClick={() => applyPreset(['python', 'linux', 'vscode'])}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-semibold text-[var(--muted-foreground)] transition hover:bg-[var(--muted)]"
            >
              Python Stack
            </button>
            <button
              type="button"
              onClick={() => applyPreset(['go', 'linux', 'vscode'])}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-semibold text-[var(--muted-foreground)] transition hover:bg-[var(--muted)]"
            >
              Go Backend
            </button>
            <button
              type="button"
              onClick={() => applyPreset(['rust', 'macos', 'vscode'])}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-semibold text-[var(--muted-foreground)] transition hover:bg-[var(--muted)]"
            >
              Rust Systems
            </button>
            <button
              type="button"
              onClick={() => applyPreset(['java', 'windows', 'jetbrains'])}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-semibold text-[var(--muted-foreground)] transition hover:bg-[var(--muted)]"
            >
              Java + IntelliJ
            </button>
          </div>
        </div>

        {/* Template Checkboxes grouped by category */}
        <div className="mt-6 space-y-6">
          {categories.map(({ label, key }) => {
            const templates = GITIGNORE_TEMPLATE_ORDER.map(
              (id) => GITIGNORE_TEMPLATES[id]
            ).filter((t) => t.category === key);

            return (
              <div key={key}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  {label}
                </h3>
                <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
                  {templates.map((tpl) => {
                    const active = selectedTemplates.includes(tpl.id);
                    return (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => toggleTemplate(tpl.id)}
                        className={`flex items-start gap-3 rounded-2xl border p-3 text-left transition ${
                          active
                            ? 'border-indigo-500 bg-indigo-500/10 text-indigo-950 dark:border-indigo-500/60 dark:bg-indigo-500/15 dark:text-indigo-100'
                            : 'border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:border-indigo-400'
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border ${
                            active
                              ? 'border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500'
                              : 'border-[var(--border)] bg-[var(--card)]'
                          }`}
                        >
                          {active && <Check className="size-3 stroke-[3]" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{tpl.name}</p>
                          <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                            {tpl.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Custom Ignore Pattern */}
        <div className="mt-7 border-t border-[var(--border)] pt-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            Add Custom Rule
          </h3>
          <form onSubmit={addCustomRule} className="mt-2 flex gap-2">
            <input
              type="text"
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              placeholder="e.g. .secrets.json, *.log, /config/local"
              className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-mono outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-700"
            >
              <Plus className="size-3.5" /> Add
            </button>
          </form>

          {customRules.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {customRules.map((rule) => (
                <span
                  key={rule}
                  className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-2.5 py-1 text-xs font-mono"
                >
                  {rule}
                  <button
                    type="button"
                    onClick={() => removeCustomRule(rule)}
                    aria-label={`Remove rule ${rule}`}
                    className="text-[var(--muted-foreground)] hover:text-red-500"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Output / Preview Panel */}
      <aside className="min-w-0 rounded-3xl border border-indigo-500/20 bg-indigo-500/5 p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Generated .gitignore</h2>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              {templateCount} templates • {ruleCount} unique rules
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyToClipboard}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700"
            >
              {copied ? (
                <>
                  <Check className="size-3.5" /> Copied
                </>
              ) : (
                <>
                  <Copy className="size-3.5" /> Copy
                </>
              )}
            </button>
            <button
              type="button"
              onClick={downloadGitignore}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-xs font-bold transition hover:bg-[var(--muted)]"
            >
              <Download className="size-3.5" /> Download
            </button>
          </div>
        </div>

        {/* Code Preview Box */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--border)] bg-slate-950 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <FileCode className="size-3.5 text-indigo-400" /> .gitignore
            </span>
            <span>UTF-8 • LF</span>
          </div>
          <pre className="max-h-[580px] overflow-auto p-4 font-mono text-xs leading-relaxed text-slate-200">
            <code>{content}</code>
          </pre>
        </div>

        <div className="mt-5 flex items-center justify-between text-xs text-[var(--muted-foreground)]">
          <span>Deterministic local generation • No network calls</span>
          <button
            type="button"
            onClick={() => {
              setSelectedTemplates(['node', 'macos', 'vscode']);
              setCustomRules([]);
            }}
            className="inline-flex items-center gap-1 font-semibold hover:text-[var(--foreground)]"
          >
            <RotateCcw className="size-3" /> Reset default
          </button>
        </div>
      </aside>
    </div>
  );
}
