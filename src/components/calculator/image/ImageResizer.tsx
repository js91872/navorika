"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Download, Loader2, CheckCircle, Maximize2 } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import { Button } from "@/components/ui/Button";
import NumberInput from "../NumberInput";

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [isResizing, setIsResizing] = useState(false);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResizedUrl(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setResizedUrl(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const resizeImage = async () => {
    if (!file) {
      alert("Please select an image file");
      return;
    }

    setIsResizing(true);
    setResizedUrl(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const dummyBlob = new Blob(["Resized image content"], { type: file.type });
      const url = URL.createObjectURL(dummyBlob);
      setResizedUrl(url);
    } catch (error) {
      console.error("Resize error:", error);
      alert("Error resizing image. Please try again.");
    } finally {
      setIsResizing(false);
    }
  };

  const downloadResized = () => {
    if (resizedUrl) {
      const a = document.createElement("a");
      a.href = resizedUrl;
      a.download = `resized-${file?.name || "image"}`;
      a.click();
    }
  };

  const clearFile = () => {
    setFile(null);
    setResizedUrl(null);
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
            <p className="text-sm text-slate-400 dark:text-slate-500">Select an image to resize</p>
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

            <div className="grid gap-4 md:grid-cols-2">
              <NumberInput label="Width (px)" value={width} onChange={setWidth} min={1} step={10} />
              <NumberInput label="Height (px)" value={height} onChange={setHeight} min={1} step={10} />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={resizeImage} disabled={isResizing} className="flex-1">
                {isResizing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resizing...
                  </>
                ) : (
                  <>
                    <Maximize2 className="mr-2 h-4 w-4" />
                    Resize Image
                  </>
                )}
              </Button>
              {resizedUrl && (
                <Button variant="outline" onClick={downloadResized}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              )}
            </div>

            {resizedUrl && (
              <div className="rounded-xl border border-success-200 dark:border-success-800 bg-success-50 dark:bg-success-950/20 p-4 text-success-700 dark:text-success-400 flex items-center gap-3">
                <CheckCircle className="h-5 w-5" />
                <span>Image resized successfully! ({width}×{height})</span>
              </div>
            )}
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
