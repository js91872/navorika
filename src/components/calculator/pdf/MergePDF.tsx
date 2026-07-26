"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, Plus, Download, Loader2, CheckCircle } from "lucide-react";
import { mergePDFs } from "@/lib/calculations/pdf-utils";
import CalculatorShell from "../CalculatorShell";
import { Button } from "@/components/ui/Button";

interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
}

export default function MergePDF() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [result, setResult] = useState<{
    url: string;
    fileName: string;
    pageCount: number;
    outputSize: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles: FileItem[] = Array.from(selectedFiles).map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    setResult(null);
    // Reset input to allow re-uploading same files
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (!droppedFiles) return;

    const newFiles: FileItem[] = Array.from(droppedFiles).map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    setResult(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
    setResult(null);
  };

  const mergePDFsHandler = async () => {
    if (files.length < 2) {
      alert("Please select at least 2 PDF files to merge");
      return;
    }

    // Validate all files are PDFs
    const invalidFiles = files.filter(f => f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf'));
    if (invalidFiles.length > 0) {
      alert(`The following files are not PDFs:\n${invalidFiles.map(f => f.name).join('\n')}`);
      return;
    }

    setIsMerging(true);
    setResult(null);

    try {
      // Extract the actual File objects
      const fileList = files.map((f) => f.file);
      const mergeResult = await mergePDFs(fileList);

      if (mergeResult.success && mergeResult.outputUrl) {
        setResult({
          url: mergeResult.outputUrl,
          fileName: mergeResult.fileName || 'merged.pdf',
          pageCount: mergeResult.pageCount || 0,
          outputSize: mergeResult.outputSize || 0,
        });
        
        // Auto-download
        const a = document.createElement("a");
        a.href = mergeResult.outputUrl;
        a.download = mergeResult.fileName || 'merged.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        alert(mergeResult.message || "Failed to merge PDFs. Please try again.");
      }
    } catch (error) {
      console.error("Merge error:", error);
      alert("Error merging PDFs. Please make sure all files are valid PDFs.");
    } finally {
      setIsMerging(false);
    }
  };

  const downloadMerged = () => {
    if (result) {
      const a = document.createElement("a");
      a.href = result.url;
      a.download = result.fileName;
      document.body.appendChild(a);
      a.click();
    }
  };

  const clearAll = () => {
    setFiles([]);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <CalculatorShell>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Merge PDF</h1>
          <p className="text-slate-600 dark:text-slate-400">Combine multiple PDF files into one</p>
        </div>

        {/* Upload Area */}
        <div
          className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <Upload className="h-12 w-12 mx-auto text-slate-400 dark:text-slate-500 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Upload PDF Files</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Click to browse or drag and drop</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Supported format: PDF</p>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-5 w-5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300 truncate">{file.name}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">
                    {formatFileSize(file.size)}
                  </span>
                  {file.type && file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf') && (
                    <span className="text-xs text-red-500 dark:text-red-400 flex-shrink-0">⚠️ Not a PDF</span>
                  )}
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                >
                  <X className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          <Button
            onClick={mergePDFsHandler}
            disabled={files.length < 2 || isMerging}
            className="flex-1"
          >
            {isMerging ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Merging...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Merge {files.length} Files
              </>
            )}
          </Button>
          {result && (
            <Button variant="outline" onClick={downloadMerged}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          )}
          {files.length > 0 && (
            <Button variant="outline" onClick={clearAll}>
              <X className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>

        {/* Result */}
        {result && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span>PDF merged successfully!</span>
            </div>
            <div className="text-sm text-green-600 dark:text-green-300 mt-1 space-y-1">
              <p>Pages: {result.pageCount}</p>
              <p>Size: {formatFileSize(result.outputSize)}</p>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
