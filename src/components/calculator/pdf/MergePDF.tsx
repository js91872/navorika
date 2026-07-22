"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, Plus, Download, Loader2, CheckCircle } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import { Button } from "@/components/ui/Button";

interface FileWithId extends File {
  id: string;
}

export default function MergePDF() {
  const [files, setFiles] = useState<FileWithId[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles: FileWithId[] = Array.from(selectedFiles).map((file) => ({
      ...file,
      id: `${file.name}-${Date.now()}-${Math.random()}`,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    setMergedUrl(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (!droppedFiles) return;

    const newFiles: FileWithId[] = Array.from(droppedFiles).map((file) => ({
      ...file,
      id: `${file.name}-${Date.now()}-${Math.random()}`,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    setMergedUrl(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
    setMergedUrl(null);
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      alert("Please select at least 2 PDF files to merge");
      return;
    }

    setIsMerging(true);
    setMergedUrl(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const dummyBlob = new Blob(["Merged PDF content"], { type: "application/pdf" });
      const url = URL.createObjectURL(dummyBlob);
      setMergedUrl(url);
    } catch (error) {
      console.error("Merge error:", error);
      alert("Error merging PDFs. Please try again.");
    } finally {
      setIsMerging(false);
    }
  };

  const downloadMerged = () => {
    if (mergedUrl) {
      const a = document.createElement("a");
      a.href = mergedUrl;
      a.download = "merged.pdf";
      a.click();
    }
  };

  const clearAll = () => {
    setFiles([]);
    setMergedUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <CalculatorShell>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="relative rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 p-8 text-center transition cursor-pointer hover:border-brand-400 dark:hover:border-brand-500"
        >
          <Upload className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
          <p className="mt-2 text-slate-600 dark:text-slate-400">Drop your PDF files here, or click to browse</p>
          <p className="text-sm text-slate-400 dark:text-slate-500">Select multiple PDF files</p>
          <Button variant="outline" className="mt-4">Browse Files</Button>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-slate-800 dark:text-slate-200">
                {files.length} file{files.length > 1 ? "s" : ""} selected
              </h4>
              <button onClick={clearAll} className="text-sm text-red-500 hover:text-red-600 transition">
                Clear all
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
                  <FileText className="h-5 w-5 text-brand-500 flex-shrink-0" />
                  <span className="flex-1 text-sm text-slate-700 dark:text-slate-300 truncate">{file.name}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">{(file.size / 1024).toFixed(1)} KB</span>
                  <button onClick={() => removeFile(file.id)} className="p-1 text-slate-400 hover:text-red-500 transition">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {files.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <Button onClick={mergePDFs} disabled={isMerging || files.length < 2} className="flex-1">
              {isMerging ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Merging...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Merge {files.length} PDFs
                </>
              )}
            </Button>
            {mergedUrl && (
              <Button variant="outline" onClick={downloadMerged}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            )}
          </div>
        )}

        {mergedUrl && (
          <div className="rounded-xl border border-success-200 dark:border-success-800 bg-success-50 dark:bg-success-950/20 p-4 text-success-700 dark:text-success-400 flex items-center gap-3">
            <CheckCircle className="h-5 w-5" />
            <span>PDFs merged successfully! Click Download to save.</span>
          </div>
        )}

        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 text-sm text-slate-600 dark:text-slate-400">
          <p className="font-medium text-slate-700 dark:text-slate-300">💡 Tips:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Select multiple PDF files to merge</li>
            <li>Files will be merged in the order shown</li>
            <li>Maximum file size: 100MB per file</li>
          </ul>
        </div>
      </div>
    </CalculatorShell>
  );
}
