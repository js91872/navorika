"use client";

import { useState, useCallback } from "react";
import { Upload, X, FileText, Plus, Download, Loader2, CheckCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PDFFile, formatFileSize, generateId, mergePDFs } from "@/lib/calculations/pdf-utils";

export default function MergePDF() {
  const [files, setFiles] = useState<PDFFile[]>([]);
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
    const newFiles: PDFFile[] = acceptedFiles.map((file) => ({
      id: generateId(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      file,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    setResult(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 20,
  });

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setResult(null);
  };

  const clearAll = () => {
    files.forEach(f => URL.revokeObjectURL(f.url));
    setFiles([]);
    setResult(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setResult({ 
        success: false, 
        message: "Please add at least 2 PDF files to merge." 
      });
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      const fileList = files.map((f) => f.file);
      const result = await mergePDFs(fileList);
      setResult(result);
    } catch (error) {
      setResult({
        success: false,
        message: "An error occurred while merging. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result?.outputUrl) {
      const link = document.createElement('a');
      link.href = result.outputUrl;
      link.download = result.fileName || 'merged.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="Merge PDF"
        description="Combine multiple PDF files into a single document. Free and easy to use."
        icon="📄"
        accuracy="Processed securely in your browser"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Upload Area */}
        {!result?.success && (
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
              {isDragActive ? 'Drop PDF files here' : 'Drag & drop PDF files here'}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              or click to browse files (max 20 files)
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Supports .pdf files only
            </p>
          </div>
        )}

        {/* File List */}
        {files.length > 0 && !result?.success && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">
                {files.length} file(s) selected
              </span>
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Clear All
              </Button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {files.map((file, index) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-sm font-medium text-blue-600">
                    {index + 1}
                  </span>
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
                    onClick={() => removeFile(file.id)}
                    className="rounded-lg p-1 hover:bg-slate-100 transition"
                  >
                    <X className="h-4 w-4 text-slate-400" />
                  </button>
                </div>
              ))}
            </div>

            {files.length >= 2 && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Plus className="h-4 w-4" />
                <span>Files will be merged in the order shown above</span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {files.length > 0 && !result?.success && (
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleMerge}
              disabled={isProcessing || files.length < 2}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Merging...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Merge PDFs
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
                    Download Merged PDF
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
              <li>Upload PDF files in the order you want them merged</li>
              <li>Maximum file size: 50MB per file</li>
              <li>All files are processed securely in your browser</li>
            </ul>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
