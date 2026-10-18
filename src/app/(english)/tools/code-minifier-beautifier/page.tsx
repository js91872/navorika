'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ShieldCheck,
  AlignLeft,
  Minimize2,
  Copy,
  Check,
  Trash2,
  FileCode,
  CheckCircle2,
  XCircle,
  FileText,
  Sparkles,
  TrendingDown,
} from 'lucide-react';
import { tools } from '@/data/registry';
import {
  beautifyCode,
  minifyCode,
  CODE_SAMPLES,
  type CodeLanguage,
  type BeautifyIndent,
} from '@/lib/formatters/codeMinifier';

export default function CodeMinifierBeautifierPage() {
  const meta = tools.find((t) => t.slug === 'code-minifier-beautifier');
  const toolMeta = meta || {
    heroTitle: 'Code Minifier & Beautifier',
    heroDescription:
      'Format, beautify, and minify JavaScript, CSS, and HTML code locally in your browser with Prettier, Terser, and CleanCSS.',
  };

  const [language, setLanguage] = useState<CodeLanguage>('javascript');
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastAction, setLastAction] = useState<'beautify' | 'minify' | null>(null);
  const [originalLength, setOriginalLength] = useState(0);

  const handleLanguageChange = (newLang: CodeLanguage) => {
    setLanguage(newLang);
    setStatus('idle');
    setStatusMessage('');
    setLastAction(null);
  };

  const handleBeautify = async (indent: BeautifyIndent) => {
    if (!input.trim()) {
      setStatus('idle');
      setStatusMessage('');
      return;
    }

    setIsProcessing(true);
    const prevLength = input.length;
    const result = await beautifyCode(input, language, indent);
    setIsProcessing(false);

    if (result.success) {
      setOriginalLength(prevLength);
      setInput(result.output);
      setStatus('success');
      setStatusMessage(`Successfully formatted ${language.toUpperCase()} with ${indent}-space indentation.`);
      setLastAction('beautify');
    } else {
      setStatus('error');
      setStatusMessage(result.error || `Failed to format ${language.toUpperCase()} code.`);
    }
  };

  const handleMinify = async () => {
    if (!input.trim()) {
      setStatus('idle');
      setStatusMessage('');
      return;
    }

    setIsProcessing(true);
    const prevLength = input.length;
    const result = await minifyCode(input, language);
    setIsProcessing(false);

    if (result.success) {
      setOriginalLength(prevLength);
      setInput(result.output);
      setStatus('success');
      setStatusMessage(`Successfully minified ${language.toUpperCase()} code.`);
      setLastAction('minify');
    } else {
      setStatus('error');
      setStatusMessage(result.error || `Failed to minify ${language.toUpperCase()} code.`);
    }
  };

  const handleLoadSample = () => {
    const sample = CODE_SAMPLES[language];
    setInput(sample);
    setStatus('idle');
    setStatusMessage('');
    setLastAction(null);
  };

  const handleCopy = async () => {
    if (!input) return;
    try {
      await navigator.clipboard.writeText(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setStatus('error');
      setStatusMessage('Clipboard access was denied. Select and copy the code manually.');
    }
  };

  const handleClear = () => {
    setInput('');
    setStatus('idle');
    setStatusMessage('');
    setLastAction(null);
    setOriginalLength(0);
  };

  // Metrics calculation
  const currentLength = input.length;
  const sizeDiff = originalLength > 0 ? currentLength - originalLength : 0;
  const reductionPercent =
    originalLength > 0 && lastAction === 'minify' && sizeDiff < 0
      ? (((originalLength - currentLength) / originalLength) * 100).toFixed(1)
      : null;

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
          <ShieldCheck className="h-4 w-4" /> 100% Client-Side Engine
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
          {toolMeta.heroTitle}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {toolMeta.heroDescription}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800">
        {/* Language Tabs */}
        <div className="flex flex-wrap items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleLanguageChange('javascript')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition ${
                language === 'javascript'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <FileCode className="h-4 w-4" /> JavaScript
            </button>
            <button
              onClick={() => handleLanguageChange('css')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition ${
                language === 'css'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <FileText className="h-4 w-4" /> CSS
            </button>
            <button
              onClick={() => handleLanguageChange('html')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition ${
                language === 'html'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <FileCode className="h-4 w-4" /> HTML
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

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between p-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleBeautify(2)}
              disabled={isProcessing || !input.trim()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition disabled:opacity-50"
            >
              <AlignLeft className="h-4 w-4" /> Beautify (2 Spaces)
            </button>
            <button
              onClick={() => handleBeautify(4)}
              disabled={isProcessing || !input.trim()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition disabled:opacity-50"
            >
              <AlignLeft className="h-4 w-4" /> Beautify (4 Spaces)
            </button>
            <button
              onClick={handleMinify}
              disabled={isProcessing || !input.trim()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 shadow"
            >
              <Minimize2 className="h-4 w-4" /> Minify
            </button>
          </div>

          {/* Metrics summary */}
          <div className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>
              Length: <strong className="text-slate-800 dark:text-slate-200">{currentLength.toLocaleString()}</strong> chars
            </span>
            {reductionPercent && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/20">
                <TrendingDown className="h-3 w-3" /> -{reductionPercent}% ({Math.abs(sizeDiff).toLocaleString()} chars saved)
              </span>
            )}
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
            placeholder={`Paste your ${language.toUpperCase()} code here...`}
            className="w-full min-h-[500px] p-6 bg-transparent outline-none font-mono text-sm text-slate-800 dark:text-slate-200 resize-y leading-relaxed"
            spellCheck="false"
          />
          {!input && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-300 dark:text-slate-700">
              <FileCode className="h-16 w-16 mb-4 opacity-40" />
              <p className="font-bold uppercase tracking-widest text-xs">
                Awaiting {language.toUpperCase()} Input Code
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
