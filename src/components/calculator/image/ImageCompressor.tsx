"use client";

import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Download, Loader2, CheckCircle, Zap, Sliders } from "lucide-react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatFileSize, generateId } from "@/lib/calculations/pdf-utils";

interface ImageFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  file: File;
  preview: string;
}

export default function ImageCompressor() {
  const [file, setFile] = useState<ImageFile | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<"low" | "medium" | "high">("medium");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ 
    success: boolean; 
    message: string; 
    outputUrl?: string; 
    outputSize?: number;
    originalSize?: number;
    compressionRatio?: number;
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
        preview: URL.createObjectURL(file),
      });
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.gif'],
    },
    maxFiles: 1,
  });

  const removeFile = () => {
    if (file) {
      URL.revokeObjectURL(file.url);
      URL.revokeObjectURL(file.preview);
    }
    setFile(null);
    setResult(null);
  };

  const getCompressionOptions = (level: string) => {
    const options = {
      low: { maxSizeMB: 2, maxWidthOrHeight: 1920, useWebWorker: true },
      medium: { maxSizeMB: 1, maxWidthOrHeight: 1280, useWebWorker: true },
      high: { maxSizeMB: 0.5, maxWidthOrHeight: 800, useWebWorker: true },
    };
    return options[level as keyof typeof options] || options.medium;
  };

  const handleCompress = async () => {
    if (!file) {
      setResult({ success: false, message: "Please upload an image first." });
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      const options = getCompressionOptions(compressionLevel);
      const compressedFile = await imageCompression(file.file, options);
      
      const url = URL.createObjectURL(compressedFile);
      const originalSize = file.size;
      const newSize = compressedFile.size;
      const compressionRatio = ((originalSize - newSize) / originalSize) * 100;

      setResult({
        success: true,
        message: `Image compressed successfully!`,
        outputUrl: url,
        outputSize: newSize,
        originalSize,
        compressionRatio,
        fileName: `compressed-${file.name}`,
      });
    } catch (error) {
      console.error('Compression error:', error);
      setResult({
        success: false,
        message: "Failed to compress image. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result?.outputUrl) {
      const link = document.createElement('a');
      link.href = result.outputUrl;
      link.download = result.fileName || 'compressed.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const compressionOptions = [
    { value: "low", label: "Low", description: "Best quality, larger size", icon: "🟢" },
    { value: "medium", label: "Medium", description: "Balanced quality and size", icon: "🟡" },
    { value: "high", label: "High", description: "Smallest size, lower quality", icon: "🔴" },
  ];

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="Image Compressor"
        description="Reduce image file size while maintaining quality."
        icon="🖼️"
        accuracy="Lossless and lossy compression options"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
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
              {isDragActive ? 'Drop image here' : 'Drag & drop an image'}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              or click to browse (max 1 file)
            </p>
            <div className="flex justify-center gap-3 mt-2 text-xs text-slate-400">
              <span>🖼️ JPG</span>
              <span>🖼️ PNG</span>
              <span>🖼️ WEBP</span>
              <span>🖼️ GIF</span>
            </div>
          </div>
        )}

        {file && !result?.success && (
          <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4">
            <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
              <img src={file.preview} alt={file.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
              <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
            </div>
            <button
              onClick={removeFile}
              className="rounded-lg p-1 hover:bg-slate-100 transition"
            >
              <X className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        )}

        {file && !result?.success && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700">Compression Level</label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {compressionOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setCompressionLevel(option.value as any)}
                  className={`p-4 rounded-xl border-2 text-center transition ${
                    compressionLevel === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-2xl">{option.icon}</div>
                  <p className={`mt-1 text-sm font-semibold ${
                    compressionLevel === option.value ? 'text-blue-700' : 'text-slate-700'
                  }`}>
                    {option.label}
                  </p>
                  <p className="text-xs text-slate-500">{option.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {file && !result?.success && (
          <Button
            onClick={handleCompress}
            disabled={isProcessing}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Compressing...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-5 w-5" />
                Compress Image
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
                {result.success && result.originalSize && result.outputSize && (
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <p className="text-xs text-slate-500">Original</p>
                      <p className="text-sm font-semibold text-slate-700">
                        {formatFileSize(result.originalSize)}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <p className="text-xs text-slate-500">Compressed</p>
                      <p className="text-sm font-semibold text-green-700">
                        {formatFileSize(result.outputSize)}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-200 col-span-2">
                      <p className="text-xs text-slate-500">Reduction</p>
                      <p className="text-lg font-bold text-blue-600">
                        {result.compressionRatio?.toFixed(1)}% smaller
                      </p>
                      <div className="mt-2 h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-green-500 to-blue-500"
                          style={{ width: `${Math.min(100, result.compressionRatio || 0)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {result.success && result.outputUrl && (
                  <Button
                    onClick={handleDownload}
                    className="mt-4 w-full"
                    size="lg"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Compressed Image
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
              <li><strong>Low:</strong> Best quality, minimal size reduction</li>
              <li><strong>Medium:</strong> Balanced quality and size (recommended)</li>
              <li><strong>High:</strong> Maximum compression, smaller size</li>
              <li>All processing happens in your browser for privacy</li>
            </ul>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
