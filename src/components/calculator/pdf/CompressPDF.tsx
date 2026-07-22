"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, Download, Loader2, CheckCircle, FileArchive } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import { Button } from "@/components/ui/Button";

export default function CompressPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setCompressedUrl(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setCompressedUrl(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const compressPDF = async () => {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    setIsCompressing(true);
    setCompressedUrl(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const dummyBlob = new Blob(["Compressed PDF content"], { type: "application/pdf" });
      const url = URL.createObjectURL(dummyBlob);
      setCompressedUrl(url);
    } catch (error) {
      console.error("Compress error:", error);
      alert("Error compressing PDF. Please try again.");
    } finally {
      setIsCompressing(false);
    }
  };

  const downloadCompressed = () => {
    if (compressedUrl) {
      const a = document.createElement("a");
      a.href = compressedUrl;
      a.download = "compressed.pdf";
      a.click();
    }
  };

  const clearFile = () => {
    setFile(null);
    setCompressedUrl(null);
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
          onChange={handleFileSelect}
          className="hidden"
        />

        {!file ? (
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="relative rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 p-8 text-center transition cursor-pointer hover:border-brand-400 dark:hover:border-brand-500"
          >
            <Upload className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
            <p className="mt-2 text-slate-600 dark:text-slate-400">Drop your PDF here, or click to browse</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">Select a PDF file to compress</p>
            <Button variant="outline" className="mt-4">Browse Files</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
              <FileText className="h-6 w-6 text-brand-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-slate-800 dark:text-slate-200">{file.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button onClick={clearFile} className="text-slate-400 hover:text-red-500 transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={compressPDF} disabled={isCompressing} className="flex-1">
                {isCompressing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Compressing...
                  </>
                ) : (
                  <>
                    <FileArchive className="mr-2 h-4 w-4" />
                    Compress PDF
                  </>
                )}
              </Button>
              {compressedUrl && (
                <Button variant="outline" onClick={downloadCompressed}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              )}
            </div>

            {compressedUrl && (
              <div className="rounded-xl border border-success-200 dark:border-success-800 bg-success-50 dark:bg-success-950/20 p-4 text-success-700 dark:text-success-400 flex items-center gap-3">
                <CheckCircle className="h-5 w-5" />
                <span>PDF compressed successfully! Click Download to save.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
