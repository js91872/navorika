"use client";

import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Download, Loader2, CheckCircle, RefreshCw, FileType } from "lucide-react";
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

export default function ImageConverter() {
  const [file, setFile] = useState<ImageFile | null>(null);
  const [outputFormat, setOutputFormat] = useState<"jpeg" | "png" | "webp" | "bmp" | "gif">("jpeg");
  const [quality, setQuality] = useState<number>(85);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ 
    success: boolean; 
    message: string; 
    outputUrl?: string; 
    outputSize?: number;
    originalSize?: number;
    fileName?: string;
    format?: string;
  } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const url = URL.createObjectURL(file);
      
      setFile({
        id: generateId(),
        name: file.name,
        size: file.size,
        type: file.type,
        url,
        file,
        preview: url,
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

  const handleConvert = async () => {
    if (!file) {
      setResult({ success: false, message: "Please upload an image first." });
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      const options = {
        maxSizeMB: 10,
        useWebWorker: true,
        fileType: `image/${outputFormat}`,
        quality: quality / 100,
      };

      const convertedFile = await imageCompression(file.file, options);
      const url = URL.createObjectURL(convertedFile);

      const extensionMap = {
        jpeg: 'jpg',
        png: 'png',
        webp: 'webp',
        bmp: 'bmp',
        gif: 'gif',
      };

      setResult({
        success: true,
        message: `Image converted to ${outputFormat.toUpperCase()} successfully!`,
        outputUrl: url,
        outputSize: convertedFile.size,
        originalSize: file.size,
        fileName: file.name.replace(/\.[^.]+$/, `.${extensionMap[outputFormat]}`),
        format: outputFormat,
      });
    } catch (error) {
      console.error('Conversion error:', error);
      setResult({
        success: false,
        message: "Failed to convert image. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result?.outputUrl) {
      const link = document.createElement('a');
      link.href = result.outputUrl;
      link.download = result.fileName || `converted.${outputFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatOptions = [
    { value: "jpeg", label: "JPG", icon: "🖼️", description: "Best for photos" },
    { value: "png", label: "PNG", icon: "🔲", description: "Best for graphics" },
    { value: "webp", label: "WEBP", icon: "🌐", description: "Best for web" },
    { value: "bmp", label: "BMP", icon: "📷", description: "Uncompressed" },
    { value: "gif", label: "GIF", icon: "🎬", description: "Best for animation" },
  ];

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="Image Converter"
        description="Convert images between JPG, PNG, WEBP, BMP, and GIF formats."
        icon="🔄"
        accuracy="Preserves image quality"
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
              <p className="text-xs text-slate-400 mt-0.5">
                Current format: {file.type.split('/')[1]?.toUpperCase() || 'Unknown'}
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

        {file && !result?.success && (
          <div className="space-y-6">
            {/* Output Format Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">Convert to</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {formatOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setOutputFormat(option.value as any)}
                    className={`p-3 rounded-xl border-2 text-center transition ${
                      outputFormat === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-2xl">{option.icon}</div>
                    <p className={`mt-1 text-sm font-semibold ${
                      outputFormat === option.value ? 'text-blue-700' : 'text-slate-700'
                    }`}>
                      {option.label}
                    </p>
                    <p className="text-[10px] text-slate-500">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Quality</label>
                <span className="text-sm font-semibold text-blue-600">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-xs text-slate-400">
                Higher quality = larger file size
              </p>
            </div>

            {/* Info Box */}
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-700">
              <p className="font-medium">ℹ️ Format Guide:</p>
              <ul className="mt-2 space-y-1 text-xs">
                <li><strong>JPG:</strong> Best for photos, small file size</li>
                <li><strong>PNG:</strong> Best for graphics, supports transparency</li>
                <li><strong>WEBP:</strong> Modern format, excellent compression</li>
                <li><strong>BMP:</strong> Uncompressed, large file size</li>
                <li><strong>GIF:</strong> Best for simple animations</li>
              </ul>
            </div>

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
                  <FileType className="mr-2 h-5 w-5" />
                  Convert to {outputFormat.toUpperCase()}
                </>
              )}
            </Button>
          </div>
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
                      <p className="text-xs text-slate-400">
                        {file?.type.split('/')[1]?.toUpperCase() || 'Unknown'}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <p className="text-xs text-slate-500">Converted</p>
                      <p className="text-sm font-semibold text-green-700">
                        {formatFileSize(result.outputSize)}
                      </p>
                      <p className="text-xs text-slate-400">
                        {result.format?.toUpperCase()}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-200 col-span-2">
                      <p className="text-xs text-slate-500">Change</p>
                      <p className={`text-sm font-semibold ${
                        result.outputSize < result.originalSize ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {result.outputSize < result.originalSize ? '📉 Smaller' : '📈 Larger'}
                        {' '}
                        ({((result.outputSize - result.originalSize) / result.originalSize * 100).toFixed(1)}%)
                      </p>
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
                    Download {result.format?.toUpperCase()} Image
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}

        {!result?.success && file && (
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-medium text-slate-700">💡 Tips:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-xs">
              <li><strong>JPG:</strong> Best for photos and web images</li>
              <li><strong>PNG:</strong> Best for graphics with transparency</li>
              <li><strong>WEBP:</strong> Modern format with best compression</li>
              <li>Higher quality = better image but larger file size</li>
              <li>All processing happens in your browser for privacy</li>
            </ul>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
