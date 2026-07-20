"use client";

import { useState, useCallback } from "react";
import { Upload, X, Image, Download, Loader2, CheckCircle, Plus, FileText } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { PDFDocument } from "pdf-lib";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PDFFile, formatFileSize, generateId } from "@/lib/calculations/pdf-utils";

interface ImageFile extends PDFFile {
  preview: string;
}

export default function JPGToPDF() {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ 
    success: boolean; 
    message: string; 
    outputUrl?: string; 
    outputSize?: number;
    fileName?: string;
    pageCount?: number;
  } | null>(null);
  const [pageSize, setPageSize] = useState<"fit" | "a4" | "letter">("fit");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: ImageFile[] = acceptedFiles.map((file) => ({
      id: generateId(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      file,
      preview: URL.createObjectURL(file),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    setResult(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'],
    },
    maxFiles: 20,
  });

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const file = prev.find(f => f.id === id);
      if (file) URL.revokeObjectURL(file.url);
      return prev.filter((f) => f.id !== id);
    });
    setResult(null);
  };

  const clearAll = () => {
    files.forEach(f => URL.revokeObjectURL(f.url));
    setFiles([]);
    setResult(null);
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      setResult({ success: false, message: "Please upload at least one image." });
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      const pdfDoc = await PDFDocument.create();
      
      for (const file of files) {
        const imageBytes = await file.file.arrayBuffer();
        let image;
        
        try {
          if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
            image = await pdfDoc.embedJpg(imageBytes);
          } else {
            image = await pdfDoc.embedPng(imageBytes);
          }
        } catch (err) {
          continue;
        }

        const page = pdfDoc.addPage();
        const { width, height } = image.scale(1);
        
        let pageWidth = width;
        let pageHeight = height;
        
        if (pageSize === 'a4') {
          pageWidth = 595.28;
          pageHeight = 841.89;
        } else if (pageSize === 'letter') {
          pageWidth = 612;
          pageHeight = 792;
        }
        
        const scaleFactor = Math.min(
          (pageWidth - 40) / width,
          (pageHeight - 40) / height
        );
        
        const scaledWidth = width * scaleFactor;
        const scaledHeight = height * scaleFactor;
        
        page.setSize(pageSize === 'fit' ? [width, height] : [pageWidth, pageHeight]);
        
        const x = (page.getWidth() - scaledWidth) / 2;
        const y = (page.getHeight() - scaledHeight) / 2;
        
        page.drawImage(image, {
          x,
          y,
          width: scaledWidth,
          height: scaledHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setResult({
        success: true,
        message: `Successfully converted ${files.length} image(s) to PDF!`,
        outputUrl: url,
        outputSize: blob.size,
        fileName: `images-${Date.now()}.pdf`,
        pageCount: files.length,
      });
    } catch (error) {
      console.error('Conversion error:', error);
      setResult({
        success: false,
        message: "Failed to convert images to PDF. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result?.outputUrl) {
      const link = document.createElement('a');
      link.href = result.outputUrl;
      link.download = result.fileName || 'images.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const pageSizeOptions = [
    { value: "fit", label: "Fit to Image" },
    { value: "a4", label: "A4 (210 × 297 mm)" },
    { value: "letter", label: "Letter (8.5 × 11 in)" },
  ];

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="JPG to PDF"
        description="Convert images (JPG, PNG, GIF, BMP) to PDF files."
        icon="🖼️→📄"
        accuracy="Preserves image quality"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {files.length === 0 && !result?.success && (
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
              {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              or click to browse (max 20 images)
            </p>
            <div className="flex justify-center gap-3 mt-2 text-xs text-slate-400">
              <span>🖼️ JPG</span>
              <span>🖼️ PNG</span>
              <span>🖼️ GIF</span>
              <span>🖼️ BMP</span>
              <span>🖼️ WEBP</span>
            </div>
          </div>
        )}

        {files.length > 0 && !result?.success && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">
                {files.length} image(s) selected
              </span>
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Clear All
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto">
              {files.map((file, index) => (
                <div
                  key={file.id}
                  className="relative group rounded-lg border border-slate-200 overflow-hidden bg-slate-50"
                >
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => removeFile(file.id)}
                      className="rounded-full bg-white/20 p-1 hover:bg-white/40 transition"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                  <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                    {index + 1}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-1.5 py-0.5 truncate">
                    {file.name}
                  </div>
                </div>
              ))}
            </div>

            {files.length > 1 && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Plus className="h-4 w-4" />
                <span>Images will be added in the order shown</span>
              </div>
            )}
          </div>
        )}

        {files.length > 0 && !result?.success && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Page Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {pageSizeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPageSize(option.value as any)}
                  className={`py-2 px-3 rounded-xl text-sm font-medium transition ${
                    pageSize === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {files.length > 0 && !result?.success && (
          <Button
            onClick={handleConvert}
            disabled={isProcessing}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-5 w-5" />
                Convert {files.length} Image(s) to PDF
              </>
            )}
          </Button>
        )}

        {result && (
          <Card className={`p-6 ${result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <div className="flex items-start gap-4">
              {result.success ? (
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-green-200 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              ) : (
                <X className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                  {result.message}
                </p>
                {result.success && result.outputSize && (
                  <div className="mt-2 space-y-1 text-xs text-green-600">
                    <p>PDF size: {formatFileSize(result.outputSize)}</p>
                    {result.pageCount && <p>Pages: {result.pageCount}</p>}
                  </div>
                )}
                {result.success && result.outputUrl && (
                  <Button
                    onClick={handleDownload}
                    className="mt-3 w-full"
                    size="sm"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}

        {!result?.success && (
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-medium text-slate-700">💡 Tips:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-xs">
              <li>Supports JPG, PNG, GIF, BMP, and WEBP formats</li>
              <li>Each image becomes one page in the PDF</li>
              <li>Maximum 20 images per conversion</li>
              <li>Choose page size: Fit to Image, A4, or Letter</li>
              <li>All processing happens in your browser for privacy</li>
            </ul>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
