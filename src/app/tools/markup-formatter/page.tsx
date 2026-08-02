'use client';

import { useState } from 'react';
import { ArrowLeft, ShieldCheck, Database, FileCode2, Copy, AlignLeft, Trash2 } from 'lucide-react';
import { tools } from '@/data/registry';

export default function MarkupFormatterTool() {
  const meta = tools.find(t => t.slug === 'markup-formatter');
  // Default meta if not found
  const toolMeta = meta || {
    heroTitle: "Markup Formatter",
    heroDescription: "Process your documents efficiently with this tool.",
    formulaExplanation: "This tool processes your data locally in your browser for maximum privacy and speed.",
    faq: [
      { question: "How does this tool work?", answer: "All processing happens locally in your browser. No data is ever uploaded to any server." },
      { question: "Is my data safe?", answer: "Yes! Your files and data never leave your computer." },
      { question: "Do I need to install anything?", answer: "No installation needed. Everything runs directly in your web browser." }
    ]
  };

  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'sql' | 'xml' | 'yaml'>('sql');
  const [copied, setCopied] = useState(false);

  // Native RegEx Formatters
  const formatCode = () => {
    if (!input.trim()) return;
    let formatted = input;

    if (mode === 'sql') {
      // Basic SQL keyword indentation formatting
      const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'LIMIT', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'HAVING', 'INSERT INTO', 'UPDATE', 'DELETE FROM', 'VALUES', 'SET'];
      const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
      
      formatted = input
        .replace(/\s+/g, ' ')
        .replace(regex, '\n$1')
        .replace(/\(\s*/g, '(\n  ')
        .replace(/\s*\)/g, '\n)')
        .replace(/,\s*/g, ',\n  ')
        .trim();
    } else if (mode === 'xml') {
      // Basic XML/HTML indentation
      let pad = 0;
      formatted = input.replace(/>\s*</g, '><')
        .replace(/(<[^>]+>)/g, '$1\n')
        .split('\n')
        .map(line => {
          let indent = 0;
          if (line.match(/^<\/\w/)) pad -= 1;
          indent = Math.max(0, pad);
          if (line.match(/^<\w[^>]*[^\/]>.*$/) && !line.match(/^<\w[^>]*>.*<\/\w[^>]*>/)) pad += 1;
          return '  '.repeat(indent) + line;
        })
        .join('\n')
        .trim();
    } else if (mode === 'yaml') {
      // Basic YAML cleanup (removing trailing spaces, standardizing indentations)
      formatted = input.replace(/[\t ]+$/gm, '').replace(/\t/g, '  ');
    }

    setInput(formatted);
  };

  const copy = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!meta) return null;

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 lg:px-8">
      <a href="/categories/developer-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-600 transition mb-8"><ArrowLeft className="h-4 w-4" /> Back to Developer Tools</a>
      
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20">
           <ShieldCheck className="h-4 w-4" /> Offline Syntax Parser
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{toolMeta.heroTitle}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{toolMeta.heroDescription}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col">
        
        <div className="flex flex-wrap items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 gap-4">
          <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
            <button onClick={() => setMode('sql')} className={`flex items-center gap-2 px-6 py-1.5 rounded-md text-xs font-bold uppercase transition ${mode === 'sql' ? 'bg-white dark:bg-slate-950 text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              <Database className="h-3 w-3"/> SQL
            </button>
            <button onClick={() => setMode('xml')} className={`flex items-center gap-2 px-6 py-1.5 rounded-md text-xs font-bold uppercase transition ${mode === 'xml' ? 'bg-white dark:bg-slate-950 text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              <FileCode2 className="h-3 w-3"/> XML
            </button>
            <button onClick={() => setMode('yaml')} className={`flex items-center gap-2 px-6 py-1.5 rounded-md text-xs font-bold uppercase transition ${mode === 'yaml' ? 'bg-white dark:bg-slate-950 text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              YAML
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={formatCode} className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow"><AlignLeft className="h-4 w-4"/> Beautify {mode.toUpperCase()}</button>
            <button onClick={copy} className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition"><Copy className="h-4 w-4"/> {copied ? 'Copied' : 'Copy'}</button>
            <button onClick={() => setInput('')} className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-500 hover:text-red-500 rounded-lg transition"><Trash2 className="h-4 w-4"/></button>
          </div>
        </div>

        <div className="relative flex-1">
          <textarea 
            value={input} onChange={e => setInput(e.target.value)}
            placeholder={`Paste your raw ${mode.toUpperCase()} data here to format...`}
            className="w-full min-h-[500px] p-6 bg-transparent outline-none font-mono text-sm text-slate-800 dark:text-slate-300 resize-y" spellCheck="false"
          />
        </div>
      </div>
    </main>
  );
}
