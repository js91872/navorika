'use client';

import { useId, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Copy,
  Download,
  FileCheck2,
  RotateCcw,
  Upload,
} from 'lucide-react';
import { validateYaml, type ValidationResult } from '@/lib/converters/config-data';

const SAMPLE_VALID_YAML = `version: "3.8"
services:
  database:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_DB: navorika_db
      POSTGRES_USER: navorika_user
      POSTGRES_PASSWORD: secret_password
    volumes:
      - db_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  db_data:
    driver: local`;

const SAMPLE_BROKEN_YAML = `version: "3.8"
services:
  database:
    image: postgres:16-alpine
      # Error below: irregular indentation
      environment:
        POSTGRES_DB: navorika_db
    ports:
      - "5432:5432"
    - broken_list_item_under_map`;

export default function YamlValidatorTool() {
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [input, setInput] = useState(SAMPLE_VALID_YAML);
  const [liveMode, setLiveMode] = useState(true);
  const [copied, setCopied] = useState(false);
  const [manualValidationTrigger, setManualValidationTrigger] = useState(0);

  const validation: ValidationResult | null = useMemo(() => {
    // Suppress unused trigger warning
    void manualValidationTrigger;
    if (!input.trim()) return null;
    return validateYaml(input);
  }, [input, manualValidationTrigger]);

  const handleCopy = async () => {
    if (!input) return;
    try {
      await navigator.clipboard.writeText(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore copy errors
    }
  };

  const handleDownload = () => {
    if (!input) return;
    const blob = new Blob([input], { type: 'text/yaml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'validated.yaml';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setInput(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {!liveMode && (
            <button
              type="button"
              onClick={() => setManualValidationTrigger((p) => p + 1)}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 transition"
            >
              <FileCheck2 className="size-4" />
              Validate YAML
            </button>
          )}

          <button
            type="button"
            onClick={() => setInput(SAMPLE_VALID_YAML)}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-semibold text-[var(--foreground)] hover:border-emerald-500 hover:text-emerald-600 transition"
          >
            Sample Valid
          </button>

          <button
            type="button"
            onClick={() => setInput(SAMPLE_BROKEN_YAML)}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-semibold text-[var(--foreground)] hover:border-red-500 hover:text-red-600 transition"
          >
            Sample Broken
          </button>

          <input
            id={fileInputId}
            ref={fileInputRef}
            type="file"
            accept=".yaml,.yml"
            onChange={handleFileUpload}
            className="hidden"
            aria-label="Upload YAML file"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-semibold text-[var(--foreground)] hover:border-indigo-500 transition"
          >
            <Upload className="size-4" />
            Upload YAML
          </button>

          <button
            type="button"
            onClick={() => setInput('')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-semibold text-[var(--muted-foreground)] hover:text-red-500 hover:border-red-300 transition"
          >
            <RotateCcw className="size-3.5" />
            Clear
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)] cursor-pointer">
            <input
              type="checkbox"
              checked={liveMode}
              onChange={(e) => setLiveMode(e.target.checked)}
              className="size-3.5 rounded border-gray-300 text-indigo-600"
            />
            Live validation
          </label>

          <button
            type="button"
            disabled={!input}
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-bold text-[var(--foreground)] hover:border-indigo-500 disabled:opacity-40 transition"
          >
            <Copy className="size-3.5" />
            {copied ? 'Copied' : 'Copy'}
          </button>

          <button
            type="button"
            disabled={!input}
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-bold text-[var(--foreground)] hover:border-indigo-500 disabled:opacity-40 transition"
          >
            <Download className="size-3.5" />
            Download
          </button>

          <Link
            href="/tools/yaml-to-json-converter"
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Convert to JSON <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>

      {/* Editor & Validation State */}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* YAML Input Area */}
        <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3 bg-[var(--muted)]/20">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              YAML Document Editor
            </span>
            <span className="text-xs text-[var(--muted-foreground)]">
              {input.length.toLocaleString()} bytes • {input ? input.split('\n').length : 0} lines
            </span>
          </div>

          <textarea
            aria-label="YAML input code editor"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste or type your YAML document here..."
            className="w-full min-h-[460px] p-4 font-mono text-sm leading-relaxed bg-transparent outline-none resize-y text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/50"
            spellCheck={false}
          />
        </div>

        {/* Validation Result Panel */}
        <div className="flex flex-col gap-4">
          {validation === null ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] p-8 text-center text-[var(--muted-foreground)] min-h-[220px]">
              <FileCheck2 className="size-10 mb-3 opacity-40" />
              <p className="font-semibold text-sm">Awaiting YAML Input</p>
              <p className="text-xs mt-1 max-w-xs">
                Enter or paste YAML on the left to validate syntax, indentation, and structure in real time.
              </p>
            </div>
          ) : validation.valid ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-emerald-800 dark:text-emerald-200 shadow-sm">
                <CheckCircle2 className="size-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <h3 className="font-bold text-base">Valid YAML Document</h3>
                  <p className="text-xs opacity-90 mt-0.5">
                    Your YAML syntax is well-formed according to the official YAML specification.
                  </p>
                </div>
              </div>

              {/* Statistics Card */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Document Statistics
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-[var(--muted)]/20 p-3">
                    <p className="text-xs text-[var(--muted-foreground)]">Total Lines</p>
                    <p className="text-lg font-black mt-1">{validation.stats.lineCount}</p>
                  </div>
                  <div className="rounded-xl bg-[var(--muted)]/20 p-3">
                    <p className="text-xs text-[var(--muted-foreground)]">Byte Size</p>
                    <p className="text-lg font-black mt-1">{validation.stats.byteSize} B</p>
                  </div>
                  <div className="rounded-xl bg-[var(--muted)]/20 p-3">
                    <p className="text-xs text-[var(--muted-foreground)]">Root Type</p>
                    <p className="text-lg font-black capitalize mt-1">{validation.stats.valueType}</p>
                  </div>
                  <div className="rounded-xl bg-[var(--muted)]/20 p-3">
                    <p className="text-xs text-[var(--muted-foreground)]">Top-Level Keys</p>
                    <p className="text-lg font-black mt-1">{validation.stats.topLevelKeys ?? 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-800 dark:text-red-200 shadow-sm">
                <div className="flex items-start gap-3">
                  <AlertCircle className="size-6 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-base">
                      YAML Syntax Error
                      {validation.line !== undefined && ` at Line ${validation.line}`}
                      {validation.column !== undefined && `, Col ${validation.column}`}
                    </h3>
                    <p className="text-xs opacity-90 mt-1 break-words">{validation.message}</p>
                  </div>
                </div>

                {validation.snippet && (
                  <div className="mt-4 rounded-xl bg-slate-950 p-3 font-mono text-xs text-slate-200 overflow-x-auto">
                    <pre>{validation.snippet}</pre>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-xs text-[var(--muted-foreground)] space-y-2">
                <p className="font-bold text-[var(--foreground)]">Common YAML Indentation Rules:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>YAML forbids literal tabs (<code className="font-mono">\t</code>) for indentation. Use spaces.</li>
                  <li>Sibling elements must align to the exact same column indent.</li>
                  <li>Dictionary keys must be followed by a colon and a space (<code className="font-mono">key: value</code>).</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
