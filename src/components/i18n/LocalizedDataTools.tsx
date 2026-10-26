'use client';

import { useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  FileCode,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Minimize2,
  AlignLeft,
  Trash2,
  Copy,
  Check,
  Download,
  Upload,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';

// Lazy-load existing tool components
const VcfToCsv = dynamic(() => import('@/components/tools/VcfToCsv'));
const CsvToVcard = dynamic(() => import('@/components/tools/CsvToVcard'));
const XmlMergeTool = dynamic(() => import('@/components/tools/XmlMergeTool'));
const XmlToWordTool = dynamic(() => import('@/components/tools/xml-word/XmlToWordTool'));
const WordToXmlTool = dynamic(() => import('@/components/tools/xml-word/WordToXmlTool'));
const CsvToJsonConverter = dynamic(() => import('@/components/tools/CsvToJsonConverter'));
const JsonToCsvFlattener = dynamic(() => import('@/components/tools/JsonToCsvFlattener'));
const JsonDiffCompare = dynamic(() => import('@/components/tools/JsonDiffCompare'));
const JsonSchemaValidator = dynamic(() => import('@/components/tools/JsonSchemaValidator'));
const ConfigConverterTool = dynamic(() => import('@/components/tools/config-data/ConfigConverterTool'));
const YamlValidatorTool = dynamic(() => import('@/components/tools/config-data/YamlValidatorTool'));

export type DataToolSlug =
  | 'vcf-to-csv'
  | 'xml-to-csv'
  | 'csv-to-vcard'
  | 'merge-xml-files'
  | 'xml-to-word-converter'
  | 'word-to-xml-converter'
  | 'csv-to-json-converter'
  | 'json-to-csv-flattener'
  | 'json-formatter'
  | 'json-diff-compare'
  | 'json-schema-validator'
  | 'json-to-yaml-converter'
  | 'yaml-to-json-converter'
  | 'json-to-toml-converter'
  | 'toml-to-json-converter'
  | 'yaml-validator';

interface Props {
  slug: DataToolSlug;
  locale: Locale;
  dictionary: Dictionary;
}

function escapeCsvField(val: string): string {
  return /[",\r\n]/.test(val) ? '"' + val.replace(/"/g, '""') + '"' : val;
}

function parseXmlToCsv(xmlString: string): string {
  const xml = new DOMParser().parseFromString(xmlString, 'application/xml');
  if (xml.querySelector('parsererror')) {
    throw new Error('Invalid XML structure');
  }
  const children = Array.from(xml.documentElement.children);
  if (!children.length) {
    throw new Error('XML root must contain repeated record elements');
  }
  const group = new Map<string, Element[]>();
  children.forEach((el) => {
    group.set(el.tagName, [...(group.get(el.tagName) || []), el]);
  });
  const records = Array.from(group.values()).sort((a, b) => b.length - a.length)[0];
  const fields = new Set<string>();
  const rows = records.map((rec) => {
    const row: Record<string, string> = {};
    for (const child of Array.from(rec.children)) {
      if (child.children.length > 0) {
        throw new Error('Nested record tags require specialized flattening');
      }
      fields.add(child.tagName);
      row[child.tagName] = child.textContent || '';
    }
    return row;
  });
  const columns = Array.from(fields);
  if (!columns.length) {
    throw new Error('No record fields detected in XML');
  }
  return [
    columns.map(escapeCsvField).join(','),
    ...rows.map((r) => columns.map((col) => escapeCsvField(r[col] || '')).join(',')),
  ].join('\r\n') + '\r\n';
}

/**
 * Localized XML to CSV Converter
 */
function LocalizedXmlToCsv({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const d = dictionary;
  const dt = d.dataTools;
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertAndDownload = async () => {
    setBusy(true);
    setError('');
    try {
      const xmlSource = text.trim() ? text : file ? await file.text() : '';
      if (!xmlSource) {
        throw new Error(d.ui.invalid);
      }
      const csvData = parseXmlToCsv(xmlSource);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(file?.name.replace(/\.[^.]+$/, '') || 'navorika_export')}.csv`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : d.ui.invalid);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Privacy Notice */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 text-sm text-emerald-800 dark:text-emerald-300">
        <div className="flex items-center gap-2 font-medium">
          <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{dt.localPrivacy}</span>
        </div>
        <span className="rounded-full bg-emerald-600/20 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
          {d.ui.local}
        </span>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-8 space-y-6">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {dt.input}
          </label>
          <div className="mt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700"
            >
              <Upload className="h-4 w-4" />
              {d.ui.selectFile}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xml,application/xml,text/xml"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setFile(f);
                  setError('');
                }
              }}
            />
            {file && (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                <FileCode className="h-4 w-4 text-indigo-500" />
                {file.name}
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            XML Markup
          </label>
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setError('');
            }}
            rows={8}
            placeholder="<records><item><id>1</id><name>Item</name></item></records>"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm dark:border-slate-700 dark:bg-slate-800"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-400">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            disabled={busy || (!file && !text.trim())}
            onClick={convertAndDownload}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {dt.downloadAction}
          </button>
          <button
            type="button"
            onClick={() => {
              setText('');
              setFile(null);
              setError('');
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <Trash2 className="h-4 w-4" />
            {dt.clearAction}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Localized JSON Formatter & Validator
 */
function LocalizedJsonFormatter({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const d = dictionary;
  const dt = d.dataTools;
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const processJson = (mode: 'beautify-2' | 'beautify-4' | 'minify') => {
    if (!input.trim()) {
      setStatus('idle');
      setErrorMessage('');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      let res = '';
      if (mode === 'beautify-2') {
        res = JSON.stringify(parsed, null, 2);
      } else if (mode === 'beautify-4') {
        res = JSON.stringify(parsed, null, 4);
      } else {
        res = JSON.stringify(parsed);
      }
      setInput(res);
      setStatus('valid');
      setErrorMessage(dt.validSyntax);
    } catch (err: unknown) {
      setStatus('invalid');
      setErrorMessage(err instanceof Error ? err.message : dt.invalidSyntax);
    }
  };

  const copyToClipboard = () => {
    if (!input) return;
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    if (!input) return;
    const blob = new Blob([input], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Privacy Notice */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 text-sm text-emerald-800 dark:text-emerald-300">
        <div className="flex items-center gap-2 font-medium">
          <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{dt.localPrivacy}</span>
        </div>
        <span className="rounded-full bg-emerald-600/20 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
          {d.ui.local}
        </span>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => processJson('beautify-2')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              <AlignLeft className="h-3.5 w-3.5" />
              {dt.beautifyAction} (2)
            </button>
            <button
              type="button"
              onClick={() => processJson('beautify-4')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              <AlignLeft className="h-3.5 w-3.5" />
              {dt.beautifyAction} (4)
            </button>
            <button
              type="button"
              onClick={() => processJson('minify')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              <Minimize2 className="h-3.5 w-3.5" />
              {dt.minifyAction}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={copyToClipboard}
              disabled={!input}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? d.ui.copied : d.ui.copy}
            </button>
            <button
              type="button"
              onClick={downloadJson}
              disabled={!input}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              <Download className="h-3.5 w-3.5" />
              {dt.downloadAction}
            </button>
            <button
              type="button"
              onClick={() => {
                setInput('');
                setStatus('idle');
                setErrorMessage('');
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 shadow-sm hover:bg-red-50 dark:border-slate-700 dark:bg-slate-900 dark:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {dt.clearAction}
            </button>
          </div>
        </div>

        {/* Status Notification */}
        {status === 'valid' && (
          <div className="flex items-center gap-2 bg-emerald-50 px-5 py-2.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-b border-emerald-100 dark:border-emerald-900/30">
            <CheckCircle2 className="h-4 w-4" />
            <span>{errorMessage}</span>
          </div>
        )}
        {status === 'invalid' && (
          <div className="flex items-center gap-2 bg-red-50 px-5 py-2.5 text-xs font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-300 border-b border-red-100 dark:border-red-900/30">
            <XCircle className="h-4 w-4" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Editor Area */}
        <div className="p-4 sm:p-6">
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setStatus('idle');
              setErrorMessage('');
            }}
            placeholder='{"example": "value", "items": [1, 2, 3]}'
            rows={14}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 font-mono text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Main Exported LocalizedDataTools Component
 */
export default function LocalizedDataTools({ slug, locale, dictionary }: Props) {
  if (slug === 'json-formatter') {
    return <LocalizedJsonFormatter locale={locale} dictionary={dictionary} />;
  }

  if (slug === 'xml-to-csv') {
    return <LocalizedXmlToCsv locale={locale} dictionary={dictionary} />;
  }

  if (slug === 'vcf-to-csv') {
    return <VcfToCsv />;
  }

  if (slug === 'csv-to-vcard') {
    return <CsvToVcard />;
  }

  if (slug === 'merge-xml-files') {
    return <XmlMergeTool />;
  }

  if (slug === 'xml-to-word-converter') {
    return <XmlToWordTool />;
  }

  if (slug === 'word-to-xml-converter') {
    return <WordToXmlTool />;
  }

  if (slug === 'csv-to-json-converter') {
    return <CsvToJsonConverter />;
  }

  if (slug === 'json-to-csv-flattener') {
    return <JsonToCsvFlattener />;
  }

  if (slug === 'json-diff-compare') {
    return <JsonDiffCompare />;
  }

  if (slug === 'json-schema-validator') {
    return <JsonSchemaValidator />;
  }

  if (slug === 'json-to-yaml-converter') {
    return <ConfigConverterTool kind="json-to-yaml" />;
  }

  if (slug === 'yaml-to-json-converter') {
    return <ConfigConverterTool kind="yaml-to-json" />;
  }

  if (slug === 'json-to-toml-converter') {
    return <ConfigConverterTool kind="json-to-toml" />;
  }

  if (slug === 'toml-to-json-converter') {
    return <ConfigConverterTool kind="toml-to-json" />;
  }

  if (slug === 'yaml-validator') {
    return <YamlValidatorTool />;
  }

  return null;
}
