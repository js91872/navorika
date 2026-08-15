'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Download, Loader2, FileText, ShieldCheck, X } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

function CompressPDFContent() {
  const meta = tools.find(t => t.slug === 'compress-pdf');
  
  const [file, setFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== 'application/pdf') return;
      setFile(selected);
      setOriginalSize(selected.size);
      setCompressedSize(0);
      setDownloadUrl(null);
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);
      
      const compressedBytes = await pdf.save({
        useObjectStreams: compressionLevel === 'high',
        addDefaultPage: false,
        objectsPerTick: 50,
      });

      const blob = new Blob([compressedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setCompressedSize(blob.size);
    } catch (error) {
      console.error('Compression error:', error);
      alert('Failed to compress PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const resetTool = () => {
    setFile(null);
    setCompressedSize(0);
    setDownloadUrl(null);
    setOriginalSize(0);
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
                <p className="text-lg font-medium mb-2">Upload PDF to compress</p>
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
                    <p className="text-sm text-slate-500 dark:text-slate-400">Size: {formatSize(originalSize)}</p>
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

          {/* Compression Level */}
          {file && (
            <div>
              <label className="block text-sm font-medium mb-2">Compression Level</label>
              <div className="grid grid-cols-3 gap-3">
                {['low', 'medium', 'high'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setCompressionLevel(level as 'low' | 'medium' | 'high')}
                    className={`px-4 py-2 rounded-xl border-2 transition-all capitalize ${
                      compressionLevel === level
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-500/30'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {file && (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleCompress}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Compressing...
                  </>
                ) : (
                  <>
                    Compress PDF
                  </>
                )}
              </button>
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={`compressed-${file?.name || 'file.pdf'}`}
                  className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  <Download className="h-5 w-5" />
                  Download
                </a>
              )}
            </div>
          )}

          {/* Results */}
          {compressedSize > 0 && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">Compression Complete!</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Original: {formatSize(originalSize)} → Compressed: {formatSize(compressedSize)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {Math.round((1 - compressedSize / originalSize) * 100)}%
                  </p>
                  <p className="text-xs text-slate-500">reduction</p>
                </div>
              </div>
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

export default function CompressPDFPage() {
  const meta = tools.find(t => t.slug === 'compress-pdf');
  return (
    <EnhancedToolWrapper meta={meta}>
      <CompressPDFContent />
    </EnhancedToolWrapper>
  );
}
