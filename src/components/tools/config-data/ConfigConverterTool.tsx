'use client';

import { useId, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeftRight,
  Check,
  Copy,
  Download,
  FileCode,
  RotateCcw,
  Upload,
  AlertCircle,
} from 'lucide-react';
import {
  jsonToYaml,
  yamlToJson,
  jsonToToml,
  tomlToJson,
  type ConversionResult,
} from '@/lib/converters/config-data';

export type ConfigConverterKind =
  | 'json-to-yaml'
  | 'yaml-to-json'
  | 'json-to-toml'
  | 'toml-to-json';

interface ConfigConverterToolProps {
  kind: ConfigConverterKind;
}

const TOOL_CONFIG: Record<
  ConfigConverterKind,
  {
    title: string;
    sourceFormat: string;
    targetFormat: string;
    sourceExtension: string;
    targetExtension: string;
    targetMimeType: string;
    reverseSlug: string;
    reverseLabel: string;
    sampleData: string;
    supportsIndent: boolean;
  }
> = {
  'json-to-yaml': {
    title: 'JSON to YAML Converter',
    sourceFormat: 'JSON',
    targetFormat: 'YAML',
    sourceExtension: '.json',
    targetExtension: '.yaml',
    targetMimeType: 'text/yaml;charset=utf-8',
    reverseSlug: 'yaml-to-json-converter',
    reverseLabel: 'Switch to YAML → JSON',
    supportsIndent: true,
    sampleData: JSON.stringify(
      {
        appName: 'navorika-service',
        version: '2.4.0',
        environment: 'production',
        database: {
          host: 'db.internal.net',
          port: 5432,
          ssl: true,
          poolSize: 10,
        },
        features: ['rate-limiting', 'local-encryption', 'automated-backups'],
        metrics: {
          intervalSeconds: 60,
          enabled: true,
        },
      },
      null,
      2
    ),
  },
  'yaml-to-json': {
    title: 'YAML to JSON Converter',
    sourceFormat: 'YAML',
    targetFormat: 'JSON',
    sourceExtension: '.yaml,.yml',
    targetExtension: '.json',
    targetMimeType: 'application/json;charset=utf-8',
    reverseSlug: 'json-to-yaml-converter',
    reverseLabel: 'Switch to JSON → YAML',
    supportsIndent: true,
    sampleData: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-frontend
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: web
          image: nginx:1.27-alpine
          ports:
            - containerPort: 80
          resources:
            limits:
              cpu: 500m
              memory: 256Mi`,
  },
  'json-to-toml': {
    title: 'JSON to TOML Converter',
    sourceFormat: 'JSON',
    targetFormat: 'TOML',
    sourceExtension: '.json',
    targetExtension: '.toml',
    targetMimeType: 'application/toml;charset=utf-8',
    reverseSlug: 'toml-to-json-converter',
    reverseLabel: 'Switch to TOML → JSON',
    supportsIndent: false,
    sampleData: JSON.stringify(
      {
        package: {
          name: 'backend-core',
          version: '1.2.0',
          authors: ['Engineering Team <dev@example.com>'],
          edition: '2024',
        },
        dependencies: {
          tokio: '1.40',
          serde: '1.0',
          tracing: '0.1',
        },
        server: {
          bindAddress: '0.0.0.0',
          port: 8080,
          timeoutSeconds: 30,
        },
      },
      null,
      2
    ),
  },
  'toml-to-json': {
    title: 'TOML to JSON Converter',
    sourceFormat: 'TOML',
    targetFormat: 'JSON',
    sourceExtension: '.toml',
    targetExtension: '.json',
    targetMimeType: 'application/json;charset=utf-8',
    reverseSlug: 'json-to-toml-converter',
    reverseLabel: 'Switch to JSON → TOML',
    supportsIndent: true,
    sampleData: `[server]
host = "127.0.0.1"
port = 9000
workers = 4
debug_mode = false

[database]
engine = "postgresql"
name = "prod_db"
max_connections = 50

[[routes]]
path = "/api/v1/health"
method = "GET"
auth_required = false

[[routes]]
path = "/api/v1/metrics"
method = "GET"
auth_required = true`,
  },
};

export default function ConfigConverterTool({ kind }: ConfigConverterToolProps) {
  const config = TOOL_CONFIG[kind];
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [input, setInput] = useState(config.sampleData);
  const [indent, setIndent] = useState<2 | 4>(2);
  const [liveMode, setLiveMode] = useState(true);
  const [sortKeys, setSortKeys] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastManualTrigger, setLastManualTrigger] = useState(0);

  const conversionResult: ConversionResult = useMemo(() => {
    // Suppress lint unused variable warning for lastManualTrigger
    void lastManualTrigger;
    if (!input.trim()) {
      return { success: true, data: '', parsed: null, byteSize: 0 };
    }

    if (kind === 'json-to-yaml') {
      return jsonToYaml(input, { indent, sortKeys });
    }
    if (kind === 'yaml-to-json') {
      return yamlToJson(input, { indent, sortKeys });
    }
    if (kind === 'json-to-toml') {
      return jsonToToml(input, { sortKeys });
    }
    return tomlToJson(input, { indent, sortKeys });
  }, [input, kind, indent, sortKeys, lastManualTrigger]);

  const outputText = conversionResult.success ? conversionResult.data : '';

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard write failures
    }
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: config.targetMimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `converted${config.targetExtension}`;
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

  const handleClear = () => {
    setInput('');
  };

  const handleLoadSample = () => {
    setInput(config.sampleData);
  };

  const handleManualConvert = () => {
    setLastManualTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Top action toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {!liveMode && (
            <button
              type="button"
              onClick={handleManualConvert}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 transition"
            >
              <FileCode className="size-4" />
              Convert {config.sourceFormat} → {config.targetFormat}
            </button>
          )}

          <button
            type="button"
            onClick={handleLoadSample}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2 text-sm font-semibold text-[var(--foreground)] hover:border-indigo-500 transition"
          >
            Load Sample
          </button>

          <input
            id={fileInputId}
            ref={fileInputRef}
            type="file"
            accept={config.sourceExtension}
            onChange={handleFileUpload}
            className="hidden"
            aria-label={`Upload ${config.sourceFormat} file`}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2 text-sm font-semibold text-[var(--foreground)] hover:border-indigo-500 transition"
          >
            <Upload className="size-4" />
            Upload {config.sourceExtension.split(',')[0]}
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2 text-sm font-semibold text-[var(--muted-foreground)] hover:text-red-500 hover:border-red-300 transition"
          >
            <RotateCcw className="size-3.5" />
            Clear
          </button>
        </div>

        {/* Options & reverse tool link */}
        <div className="flex flex-wrap items-center gap-3">
          {config.supportsIndent && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--muted-foreground)]">
              <span>Indent:</span>
              <button
                type="button"
                onClick={() => setIndent(2)}
                className={`rounded-lg px-2.5 py-1 transition ${
                  indent === 2
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'border border-[var(--border)] bg-[var(--background)]'
                }`}
              >
                2 sp
              </button>
              <button
                type="button"
                onClick={() => setIndent(4)}
                className={`rounded-lg px-2.5 py-1 transition ${
                  indent === 4
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'border border-[var(--border)] bg-[var(--background)]'
                }`}
              >
                4 sp
              </button>
            </div>
          )}

          <label className="flex items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)] cursor-pointer">
            <input
              type="checkbox"
              checked={sortKeys}
              onChange={(e) => setSortKeys(e.target.checked)}
              className="size-3.5 rounded border-gray-300 text-indigo-600"
            />
            Sort keys
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)] cursor-pointer">
            <input
              type="checkbox"
              checked={liveMode}
              onChange={(e) => setLiveMode(e.target.checked)}
              className="size-3.5 rounded border-gray-300 text-indigo-600"
            />
            Live convert
          </label>

          <Link
            href={`/tools/${config.reverseSlug}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition"
          >
            <ArrowLeftRight className="size-3.5" />
            {config.reverseLabel}
          </Link>
        </div>
      </div>

      {/* Editors Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Source Column */}
        <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3 bg-[var(--muted)]/20">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              {config.sourceFormat} Input
            </span>
            <span className="text-xs text-[var(--muted-foreground)]">
              {input.length.toLocaleString()} chars • {input ? input.split('\n').length : 0} lines
            </span>
          </div>

          <textarea
            aria-label={`${config.sourceFormat} input code editor`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Paste your ${config.sourceFormat} content here...`}
            className="w-full min-h-[420px] p-4 font-mono text-sm leading-relaxed bg-transparent outline-none resize-y text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/50"
            spellCheck={false}
          />
        </div>

        {/* Target Output Column */}
        <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3 bg-[var(--muted)]/20">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                {config.targetFormat} Output
              </span>
              {conversionResult.success && outputText && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  <Check className="size-3" /> Valid {config.targetFormat}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!outputText}
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-xs font-bold text-[var(--foreground)] hover:border-indigo-500 disabled:opacity-40 transition"
              >
                {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>

              <button
                type="button"
                disabled={!outputText}
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-xs font-bold text-[var(--foreground)] hover:border-indigo-500 disabled:opacity-40 transition"
              >
                <Download className="size-3.5" />
                Download {config.targetExtension}
              </button>
            </div>
          </div>

          <textarea
            aria-label={`${config.targetFormat} converted output`}
            readOnly
            value={outputText}
            placeholder={`Converted ${config.targetFormat} output will appear here...`}
            className="w-full min-h-[420px] p-4 font-mono text-sm leading-relaxed bg-[var(--muted)]/10 outline-none resize-y text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/50"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Error Presentation with Line / Column and Snippet */}
      {!conversionResult.success && (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-700 dark:text-red-300"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="size-5 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
            <div className="space-y-2 text-sm flex-1">
              <p className="font-bold">
                Conversion Error
                {conversionResult.line !== undefined && ` at Line ${conversionResult.line}`}
                {conversionResult.column !== undefined && `, Column ${conversionResult.column}`}
              </p>
              <p className="text-xs break-words opacity-90">{conversionResult.error}</p>

              {conversionResult.snippet && (
                <div className="mt-3 rounded-xl bg-slate-950 p-3 font-mono text-xs text-slate-200 overflow-x-auto">
                  <pre>{conversionResult.snippet}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
