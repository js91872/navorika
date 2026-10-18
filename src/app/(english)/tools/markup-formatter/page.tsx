'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ShieldCheck,
  AlignLeft,
  Copy,
  Check,
  Trash2,
  CheckCircle2,
  XCircle,
  Database,
  Code2,
  FileText,
  Sparkles,
} from 'lucide-react';
import { tools } from '@/data/registry';
import {
  formatSqlCode,
  validateAndFormatXml,
  validateAndFormatYaml,
  SQL_DIALECTS,
  MARKUP_SAMPLES,
  type MarkupLanguage,
  type MarkupIndent,
} from '@/lib/formatters/markupFormatter';
import type { SqlLanguage } from 'sql-formatter';

export default function MarkupFormatterPage() {
  const meta = tools.find((t) => t.slug === 'markup-formatter');
  const toolMeta = meta || {
    heroTitle: 'Markup & Query Formatter',
    heroDescription:
      'Format, beautify, and validate SQL queries, XML documents, and YAML configurations locally in your browser.',
  };

  const [language, setLanguage] = useState<MarkupLanguage>('sql');
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState<MarkupIndent>(2);

  // SQL options
  const [sqlDialect, setSqlDialect] = useState<SqlLanguage>('sql');
  const [keywordCase, setKeywordCase] = useState<'upper' | 'lower' | 'preserve'>('upper');

  const handleLanguageChange = (newLang: MarkupLanguage) => {
    setLanguage(newLang);
    setStatus('idle');
    setStatusMessage('');
  };

  const handleFormat = () => {
    if (!input.trim()) {
      setStatus('idle');
      setStatusMessage('');
      return;
    }

    if (language === 'sql') {
      const result = formatSqlCode(input, {
        dialect: sqlDialect,
        tabWidth: indent,
        keywordCase,
      });

      if (result.success) {
        setInput(result.output);
        setStatus('success');
        const dialectLabel = SQL_DIALECTS.find((d) => d.value === sqlDialect)?.label || 'SQL';
        setStatusMessage(`Successfully formatted query using ${dialectLabel} rules.`);
      } else {
        setStatus('error');
        setStatusMessage(result.error || 'SQL formatting failed: check query syntax.');
      }
    } else if (language === 'xml') {
      const result = validateAndFormatXml(input, {
        tabWidth: indent,
      });

      if (result.success) {
        setInput(result.output);
        setStatus('success');
        setStatusMessage('XML structure is valid and formatted cleanly.');
      } else {
        setStatus('error');
        const locInfo = result.line ? ` (line ${result.line}${result.column ? `, col ${result.column}` : ''})` : '';
        setStatusMessage(`${result.error || 'Invalid XML syntax'}${locInfo}`);
      }
    } else if (language === 'yaml') {
      const result = validateAndFormatYaml(input, {
        tabWidth: indent,
      });

      if (result.success) {
        setInput(result.output);
        setStatus('success');
        setStatusMessage('YAML configuration parsed and normalized successfully.');
      } else {
        setStatus('error');
        const locInfo = result.line ? ` (line ${result.line}${result.column ? `, col ${result.column}` : ''})` : '';
        setStatusMessage(`${result.error || 'Invalid YAML syntax'}${locInfo}`);
      }
    }
  };

  const handleLoadSample = () => {
    const sample = MARKUP_SAMPLES[language];
    setInput(sample);
    setStatus('idle');
    setStatusMessage('');
  };

  const handleCopy = async () => {
    if (!input) return;
    try {
      await navigator.clipboard.writeText(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setStatus('error');
      setStatusMessage('Clipboard access was denied. Select and copy the text manually.');
    }
  };

  const handleClear = () => {
    setInput('');
    setStatus('idle');
    setStatusMessage('');
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 lg:px-8">
      <Link
        href="/categories/developer-tools"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Developer Tools
      </Link>

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20">
          <ShieldCheck className="h-4 w-4" /> Grammar-Aware Client Processing
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
          {toolMeta.heroTitle}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {toolMeta.heroDescription}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800">
        {/* Language Selection Tabs */}
        <div className="flex flex-wrap items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleLanguageChange('sql')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition ${
                language === 'sql'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Database className="h-4 w-4" /> SQL
            </button>
            <button
              onClick={() => handleLanguageChange('xml')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition ${
                language === 'xml'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Code2 className="h-4 w-4" /> XML
            </button>
            <button
              onClick={() => handleLanguageChange('yaml')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition ${
                language === 'yaml'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <FileText className="h-4 w-4" /> YAML
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadSample}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
            >
              <Sparkles className="h-3.5 w-3.5" /> Load Sample
            </button>
            <button
              onClick={() => void handleCopy()}
              disabled={!input}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition disabled:opacity-50 shadow"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={handleClear}
              disabled={!input}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear
            </button>
          </div>
        </div>

        {/* Options Toolbar */}
        <div className="flex flex-wrap items-center justify-between p-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleFormat}
              disabled={!input.trim()}
              className="flex items-center gap-2 px-5 py-2 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition disabled:opacity-50 shadow"
            >
              <AlignLeft className="h-4 w-4" /> Format & Validate
            </button>

            {/* Indent selector */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 pl-2 border-l border-slate-200 dark:border-slate-700">
              <span>Indent:</span>
              <button
                onClick={() => setIndent(2)}
                className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                  indent === 2
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                2 Spaces
              </button>
              <button
                onClick={() => setIndent(4)}
                className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                  indent === 4
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                4 Spaces
              </button>
            </div>

            {/* SQL Dialect and Case Options */}
            {language === 'sql' && (
              <div className="flex flex-wrap items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Dialect:
                </label>
                <select
                  value={sqlDialect}
                  onChange={(e) => setSqlDialect(e.target.value as SqlLanguage)}
                  className="px-2.5 py-1 text-xs font-bold rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                >
                  {SQL_DIALECTS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>

                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-2">
                  Keywords:
                </label>
                <select
                  value={keywordCase}
                  onChange={(e) => setKeywordCase(e.target.value as 'upper' | 'lower' | 'preserve')}
                  className="px-2.5 py-1 text-xs font-bold rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                >
                  <option value="upper">UPPERCASE</option>
                  <option value="lower">lowercase</option>
                  <option value="preserve">Preserve</option>
                </select>
              </div>
            )}
          </div>

          <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>
              Length: <strong className="text-slate-800 dark:text-slate-200">{input.length.toLocaleString()}</strong> chars
            </span>
          </div>
        </div>

        {/* Status / Error Banner */}
        {status !== 'idle' && (
          <div
            className={`px-4 py-2.5 text-sm font-semibold flex items-start gap-2 border-b ${
              status === 'success'
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
            }`}
          >
            {status === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 font-mono text-xs break-all whitespace-pre-wrap">
              {statusMessage}
            </div>
          </div>
        )}

        {/* Code Editor */}
        <div className="relative flex-1">
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (status !== 'idle') setStatus('idle');
            }}
            placeholder={`Paste your ${language.toUpperCase()} payload here...`}
            className="w-full min-h-[500px] p-6 bg-transparent outline-none font-mono text-sm text-slate-800 dark:text-slate-200 resize-y leading-relaxed"
            spellCheck="false"
          />
          {!input && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-300 dark:text-slate-700">
              <Code2 className="h-16 w-16 mb-4 opacity-40" />
              <p className="font-bold uppercase tracking-widest text-xs">
                Awaiting {language.toUpperCase()} Input
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
