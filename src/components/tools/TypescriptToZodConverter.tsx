'use client';

import { useMemo, useState } from 'react';
import {
  Check,
  Copy,
  Download,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  Code2,
} from 'lucide-react';
import { convertTypescriptToZod } from '@/lib/calculations/typescriptToZod';

const PRESETS: Record<string, { label: string; code: string }> = {
  user: {
    label: 'User Profile',
    code: `interface User {
  id: string;
  name: string;
  age: number;
  email: string;
  active?: boolean;
  createdAt: Date;
}`,
  },
  product: {
    label: 'Product Catalog',
    code: `type Product = {
  sku: string;
  title: string;
  price: number;
  tags: string[];
  inStock: boolean;
  discount?: number;
};`,
  },
  apiResponse: {
    label: 'API Response & Enums',
    code: `interface AccountResponse {
  status: 'success' | 'error';
  role: 'admin' | 'editor' | 'viewer';
  errorMessage: string | null;
  retries?: 1 | 2 | 3;
}`,
  },
  nested: {
    label: 'Nested Objects',
    code: `interface Order {
  orderId: string;
  amount: number;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
  };
}`,
  },
};

export default function TypescriptToZodConverter() {
  const [typescript, setTypescript] = useState<string>(PRESETS.user.code);
  const [copied, setCopied] = useState(false);

  const { zodSchema, warnings, fieldCount, isValid } = useMemo(() => {
    return convertTypescriptToZod(typescript);
  }, [typescript]);

  const copyZod = async () => {
    await navigator.clipboard.writeText(zodSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadZod = () => {
    const blob = new Blob([zodSchema], { type: 'text/typescript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'schema.ts';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const applyPreset = (key: keyof typeof PRESETS) => {
    setTypescript(PRESETS[key].code);
  };

  const clear = () => {
    setTypescript('');
  };

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)]">
      {/* Input Section */}
      <section className="min-w-0 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-3">
            <Code2 className="size-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-bold">TypeScript Definition</h2>
          </div>
          <button
            type="button"
            onClick={clear}
            className="rounded-lg border border-[var(--border)] px-2.5 py-1 text-xs font-semibold hover:bg-[var(--muted)]"
          >
            Clear
          </button>
        </div>

        {/* Example Presets */}
        <div className="mt-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            Load Example
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(PRESETS).map(([key, item]) => (
              <button
                key={key}
                type="button"
                onClick={() => applyPreset(key)}
                className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs font-semibold text-[var(--foreground)] transition hover:border-indigo-500 hover:text-indigo-600"
              >
                <Sparkles className="size-3 text-indigo-500" />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-semibold text-[var(--muted-foreground)]">
            Paste interface or type definition
          </label>
          <textarea
            value={typescript}
            onChange={(e) => setTypescript(e.target.value)}
            rows={15}
            spellCheck={false}
            placeholder="interface User {&#10;  name: string;&#10;  age: number;&#10;  active?: boolean;&#10;}"
            className="w-full resize-y rounded-2xl border border-[var(--border)] bg-slate-50 p-4 font-mono text-xs leading-relaxed text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <ShieldCheck className="size-4 text-emerald-600" />
          <span>No eval or code execution. Parser operates strictly on text syntax.</span>
        </div>
      </section>

      {/* Output Section */}
      <aside className="min-w-0 rounded-3xl border border-indigo-500/20 bg-indigo-500/5 p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Starter Zod Schema</h2>
            <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
              {isValid ? `${fieldCount} fields parsed • Starter code for review` : 'Waiting for valid input'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyZod}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700"
            >
              {copied ? (
                <>
                  <Check className="size-3.5" /> Copied Schema
                </>
              ) : (
                <>
                  <Copy className="size-3.5" /> Copy Zod
                </>
              )}
            </button>
            <button
              type="button"
              onClick={downloadZod}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs font-bold transition hover:bg-[var(--muted)]"
            >
              <Download className="size-3.5" /> Download
            </button>
          </div>
        </div>

        {/* Warnings Banner */}
        {warnings.length > 0 && (
          <div className="mt-4 space-y-1 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="size-3.5 text-amber-600" />
              <span>Conversion Notes & Limitations</span>
            </div>
            <ul className="list-inside list-disc space-y-0.5 pl-1">
              {warnings.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Code Box */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--border)] bg-slate-950 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2 text-xs font-mono text-slate-400">
            <span>zodSchema.ts</span>
            <span>zod v3</span>
          </div>
          <pre className="max-h-[520px] overflow-auto p-4 font-mono text-xs leading-relaxed text-indigo-300">
            <code>{zodSchema}</code>
          </pre>
        </div>

        <div className="mt-4 rounded-2xl border border-indigo-500/20 bg-[var(--card)] p-4 text-xs leading-relaxed text-[var(--muted-foreground)]">
          <strong className="text-[var(--foreground)]">Next step:</strong> Add domain validation
          refinements such as <code className="font-mono text-indigo-500">.email()</code>,{' '}
          <code className="font-mono text-indigo-500">.min(1)</code>, or{' '}
          <code className="font-mono text-indigo-500">.regex(...)</code> to match your business requirements.
        </div>
      </aside>
    </div>
  );
}
