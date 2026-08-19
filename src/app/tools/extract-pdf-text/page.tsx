'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Download, Loader2, FileText, ShieldCheck, X } from 'lucide-react';

export default function ExtractPdfTextPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== 'application/pdf') {
        setError('Please select a PDF file.');
        return;
      }
      setFile(selected);
      setExtractedText('');
      setError('');
    }
  };

  const handleExtract = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError('');

    try {
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
      const document = await loadingTask.promise;
      const pageTexts: string[] = [];

      for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
        const page = await document.getPage(pageNumber);
        const content = await page.getTextContent();
        let pageText = '';
        for (const item of content.items) {
          if (!('str' in item)) continue;
          pageText += item.str;
          pageText += item.hasEOL ? '\n' : ' ';
        }
        pageTexts.push(`--- Page ${pageNumber} ---\n${pageText.trim()}`);
      }

      setExtractedText(pageTexts.join('\n\n'));
      await loadingTask.destroy();
    } catch {
      setExtractedText('');
      setError('Text could not be extracted. The PDF may be password-protected, damaged, image-only, or use unsupported text encoding.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!file || !extractedText) return;
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.replace(/\.pdf$/i, '')}_text.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
      <Link href="/categories/pdf-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to PDF Tools
      </Link>

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20">
          <ShieldCheck className="h-4 w-4" /> Local Processing Only
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
          Extract PDF Text
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Extract text content from your PDF documents.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mb-16">
        {!file ? (
          <div className="p-8">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-colors"
            >
              <Upload className="h-10 w-10 text-indigo-500 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Select PDF Document</h3>
              <p className="text-sm text-slate-500 mt-2">Upload a PDF to extract text</p>
              <input 
                type="file" 
                accept="application/pdf" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          </div>
        ) : (
          <div className="p-8">
            <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl mb-6">
              <FileText className="h-8 w-8 text-indigo-500 shrink-0" />
              <div className="flex-1">
                <p className="font-bold text-slate-900 dark:text-white">{file.name}</p>
                <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button 
                onClick={() => { setFile(null); setExtractedText(''); setError(''); }}
                aria-label="Remove selected PDF"
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <button
              onClick={handleExtract}
              disabled={isProcessing}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Extracting...
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5" />
                  Extract Text
                </>
              )}
            </button>

            {error && <p role="alert" className="mt-4 text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}

            {extractedText && (
              <div className="mt-6">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <h2 className="font-bold text-slate-900 dark:text-white">Extracted text preview</h2>
                  <button type="button" onClick={handleDownload} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold">
                    <Download className="h-4 w-4" /> Download TXT
                  </button>
                </div>
                <textarea readOnly value={extractedText} aria-label="Extracted PDF text" className="w-full min-h-80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-700 dark:text-slate-300 font-mono" />
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
