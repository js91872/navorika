'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Download, Loader2, FileText, ShieldCheck, X, FileUp, FileDown } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

function ExtractPdfPagesContent() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== 'application/pdf') return;
      setFile(selected);
      setDownloadUrl(null);
      
      // Get total pages
      try {
        const buffer = await selected.arrayBuffer();
        const pdf = await PDFDocument.load(buffer);
        setTotalPages(pdf.getPageCount());
      } catch (error) {
        console.error('Error reading PDF:', error);
      }
    }
  };

  const handleExtract = async () => {
    if (!file || !pages) return;
    setIsProcessing(true);

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);
      const newPdf = await PDFDocument.create();
      
      // Parse page numbers
      const pageNumbers = pages.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p) && p > 0 && p <= totalPages);
      
      if (pageNumbers.length === 0) {
        alert('Please enter valid page numbers.');
        setIsProcessing(false);
        return;
      }

      // Copy pages
      for (const pageNum of pageNumbers) {
        const [page] = await newPdf.copyPages(pdf, [pageNum - 1]);
        newPdf.addPage(page);
      }

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (error) {
      console.error('Extraction error:', error);
      alert('Failed to extract pages. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setPages('');
    setDownloadUrl(null);
    setTotalPages(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
        <div className="space-y-6">
          {/* Upload Area */}
          <div 
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {!file ? (
              <div>
                <div className="text-6xl mb-4">📄</div>
                <p className="text-lg font-medium mb-2">Upload PDF to extract pages</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Click to select or drag and drop</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-indigo-500" />
                  <div className="text-left">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Total pages: {totalPages}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); resetTool(); }}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>
            )}
          </div>

          {/* Page Selection */}
          {file && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Page Numbers to Extract
                <span className="text-xs text-slate-500 ml-2">(e.g., 1, 3, 5-7)</span>
              </label>
              <input
                type="text"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                placeholder="1, 3, 5, 7-10"
                className="w-full px-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] focus:border-indigo-500 outline-none transition-colors"
              />
              {totalPages > 0 && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Available pages: 1 to {totalPages}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {file && (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExtract}
                disabled={isProcessing || !pages}
                className="flex-1 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <FileUp className="h-5 w-5" />
                    Extract Pages
                  </>
                )}
              </button>
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={`extracted-${file?.name || 'pages.pdf'}`}
                  className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  <Download className="h-5 w-5" />
                  Download
                </a>
              )}
            </div>
          )}

          {/* Info */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Your PDF is processed locally in your browser. No data is uploaded to any server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExtractPdfPagesPage() {
  const meta = tools.find(t => t.slug === 'extract-pdf-pages');
  return (
    <EnhancedToolWrapper meta={meta}>
      <ExtractPdfPagesContent />
    </EnhancedToolWrapper>
  );
}
