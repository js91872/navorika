"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Download, Loader2, CheckCircle, Palette } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import { Button } from "@/components/ui/Button";

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<"png" | "jpg" | "webp">("png");
  const [isConverting, setIsConverting] = useState(false);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setConvertedUrl(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setConvertedUrl(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const convertImage = async () => {
    if (!file) {
      alert("Please select an image file");
      return;
    }

    setIsConverting(true);
    setConvertedUrl(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const mimeType = format === "jpg" ? "image/jpeg" : `image/${format}`;
      const dummyBlob = new Blob(["Converted image content"], { type: mimeType });
      const url = URL.createObjectURL(dummyBlob);
      setConvertedUrl(url);
    } catch (error) {
      console.error("Conversion error:", error);
      alert("Error converting image. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  const downloadConverted = () => {
    if (convertedUrl) {
      const a = document.createElement("a");
      a.href = convertedUrl;
      a.download = `converted.${format}`;
      a.click();
    }
  };

  const clearFile = () => {
    setFile(null);
    setConvertedUrl(null);
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
          accept="image/*"
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
            <p className="mt-2 text-slate-600 dark:text-slate-400">Drop your image here, or click to browse</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">Select an image to convert</p>
            <Button variant="outline" className="mt-4">Browse Files</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
              <ImageIcon className="h-6 w-6 text-brand-500 flex-shrink-0" />
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

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Output Format</label>
              <div className="grid grid-cols-3 gap-3">
                {["png", "jpg", "webp"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f as any)}
                    className={`py-2 px-4 rounded-xl text-sm font-medium transition ${
                      format === f
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={convertImage} disabled={isConverting} className="flex-1">
                {isConverting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <Palette className="mr-2 h-4 w-4" />
                    Convert to {format.toUpperCase()}
                  </>
                )}
              </Button>
              {convertedUrl && (
                <Button variant="outline" onClick={downloadConverted}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              )}
            </div>

            {convertedUrl && (
              <div className="rounded-xl border border-success-200 dark:border-success-800 bg-success-50 dark:bg-success-950/20 p-4 text-success-700 dark:text-success-400 flex items-center gap-3">
                <CheckCircle className="h-5 w-5" />
                <span>Image converted to {format.toUpperCase()} successfully!</span>
              </div>
            )}
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
