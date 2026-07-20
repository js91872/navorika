"use client";

import { useState, useCallback } from "react";
import { Upload, X, FileText, Download, Loader2, Scissors, CheckCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PDFFile, formatFileSize, generateId, splitPDF } from "@/lib/calculations/pdf-utils";

export default function SplitPDF() {
  const [file, setFile] = useState<PDFFile | null>(null);
  const [pageRanges, setPageRanges] = useState<string>("1-3,4-6,7-10");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ 
    success: boolean; 
    message: string; 
    outputUrl?: string; 
    outputSize?: number;
    pageCount?: number;
    fileName?: string;
  } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFile({
        id: generateId(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        file,
      });
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  const removeFile = () => {
    if (file) URL.revokeObjectURL(file.url);
    setFile(null);
    setResult(null);
  };

  const handleSplit = async () => {
    if (!file) {
      setResult({ success: false, message: "Please upload a PDF file first." });
      return;
    }

    if (!pageRanges.trim()) {
      setResult({ success: false, message: "Please specify page ranges." });
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      const result = await splitPDF(file.file, pageRanges);
      setResult(result);
    } catch (error) {
      setResult({
        success: false,
        message: "An error occurred while splitting. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result?.outputUrl) {
      const link = document.createElement('a');
      link.href = result.outputUrl;
      link.download = result.fileName || 'split.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="Split PDF"
        description="Split a PDF file into multiple documents by page ranges."
        icon="✂️"
        accuracy="Processed securely in your browser"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Upload Area */}
        {!file && !result?.success && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition cursor-pointer ${
              isDragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <p className="text-lg font-medium text-slate-700">
              {isDragActive ? 'Drop PDF file here' : 'Drag & drop a PDF file'}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              or click to browse (max 1 file)
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Supports .pdf files only
            </p>
          </div>
        )}

        {/* File Display */}
        {file && !result?.success && (
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
            <FileText className="h-5 w-5 text-slate-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">
                {file.name}
              </p>
              <p className="text-xs text-slate-500">
                {formatFileSize(file.size)}
              </p>
            </div>
            <button
              onClick={removeFile}
              className="rounded-lg p-1 hover:bg-slate-100 transition"
            >
              <X className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        )}

        {/* Page Ranges Input */}
        {file && !result?.success && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Page Ranges
            </label>
            <input
              type="text"
              value={pageRanges}
              onChange={(e) => setPageRanges(e.target.value)}
              placeholder="e.g., 1-3, 4-6, 7-10"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <p className="text-xs text-slate-500">
              Separate page ranges with commas. Use hyphens for ranges (e.g., 1-3, 4-6).
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {file && !result?.success && (
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleSplit}
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Splitting...
                </>
              ) : (
                <>
                  <Scissors className="mr-2 h-4 w-4" />
                  Split PDF
                </>
              )}
            </Button>
          </div>
        )}

        {/* Result */}
        {result && (
          <Card className={`p-6 ${result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <div className="flex items-start gap-4">
              {result.success ? (
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              ) : (
                <X className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                  {result.message}
                </p>
                {result.success && result.outputSize && (
                  <p className="text-xs text-green-600 mt-1">
                    File size: {formatFileSize(result.outputSize)} • {result.pageCount || 0} pages
                  </p>
                )}
                {result.success && result.outputUrl && (
                  <Button
                    onClick={handleDownload}
                    className="mt-3"
                    size="sm"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Split PDF
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Tips */}
        {!result?.success && (
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-medium text-slate-700">💡 Tips:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-xs">
              <li>Example: "1-3" extracts pages 1, 2, and 3</li>
              <li>Example: "1-3, 4-6, 7-10" creates 3 separate documents</li>
              <li>Maximum file size: 50MB</li>
            </ul>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
