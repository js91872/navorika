"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, X, Image as ImageIcon, Download, Loader2, CheckCircle, Wand2, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { removeBackground } from "@imgly/background-removal";

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

export default function BackgroundRemover() {
  const [file, setFile] = useState<ImageFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ 
    success: boolean; 
    message: string; 
    outputUrl?: string; 
    outputSize?: number;
    originalSize?: number;
    fileName?: string;
  } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [zoom, setZoom] = useState(1);

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
      setShowPreview(false);
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
    setShowPreview(false);
  };

  const handleRemoveBackground = async () => {
    if (!file) {
      setResult({ success: false, message: "Please upload an image first." });
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      // Convert file to blob
      const blob = new Blob([await file.file.arrayBuffer()], { type: file.type });
      
      // Remove background using the library
      const resultBlob = await removeBackground(blob, {
        progress: (key: string, current: number, total: number) => {
          console.log(`Progress: ${key} - ${current}/${total}`);
        },
      });

      const url = URL.createObjectURL(resultBlob);

      setResult({
        success: true,
        message: "Background removed successfully!",
        outputUrl: url,
        outputSize: resultBlob.size,
        originalSize: file.size,
        fileName: `no-bg-${file.name}`,
      });
      setShowPreview(true);
    } catch (error) {
      console.error('Background removal error:', error);
      setResult({
        success: false,
        message: "Failed to remove background. Please try again with a different image.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result?.outputUrl) {
      const link = document.createElement('a');
      link.href = result.outputUrl;
      link.download = result.fileName || 'no-bg.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.25, 0.5));
  };

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="Background Remover"
        description="Remove image backgrounds automatically with AI."
        icon="✨"
        accuracy="AI-powered background removal"
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
            <div className="mt-3 text-xs text-slate-400 bg-slate-50 rounded-lg p-2">
              ⚡ AI-powered background removal
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
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-700">
              <p className="font-medium">ℹ️ How it works:</p>
              <ul className="mt-2 space-y-1 text-xs">
                <li>• AI detects the subject in your image</li>
                <li>• Automatically removes the background</li>
                <li>• Works best with clear subjects</li>
                <li>• Supports PNG with transparency</li>
              </ul>
            </div>

            <Button
              onClick={handleRemoveBackground}
              disabled={isProcessing}
              className="w-full"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Removing Background...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Remove Background
                </>
              )}
            </Button>
          </div>
        )}

        {result && (
          <div className="space-y-4">
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
                        <p className="text-xs text-slate-500">Result</p>
                        <p className="text-sm font-semibold text-green-700">
                          {formatFileSize(result.outputSize)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Preview Section */}
            {result.success && result.outputUrl && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-700">Preview</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleZoomOut}
                      className="rounded-lg p-1 hover:bg-slate-100 transition"
                      disabled={zoom <= 0.5}
                    >
                      <ZoomOut className="h-4 w-4 text-slate-500" />
                    </button>
                    <span className="text-xs text-slate-500">{Math.round(zoom * 100)}%</span>
                    <button
                      onClick={handleZoomIn}
                      className="rounded-lg p-1 hover:bg-slate-100 transition"
                      disabled={zoom >= 3}
                    >
                      <ZoomIn className="h-4 w-4 text-slate-500" />
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 overflow-hidden bg-white p-4">
                  <div className="relative flex items-center justify-center min-h-[200px] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiNmZmZmZmYiLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNmMGYwZjAiLz48cmVjdCB4PSI0MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+')] bg-repeat">
                    <img
                      src={result.outputUrl}
                      alt="Background removed"
                      className="max-h-[400px] w-auto object-contain transition-transform duration-300"
                      style={{ transform: `scale(${zoom})` }}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleDownload}
                  className="w-full"
                  size="lg"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Image (PNG with Transparency)
                </Button>
              </div>
            )}
          </div>
        )}

        {!result?.success && file && (
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-medium text-slate-700">💡 Tips for best results:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-xs">
              <li>Use images with clear subject-background contrast</li>
              <li>Portraits and product photos work best</li>
              <li>Avoid busy or complex backgrounds</li>
              <li>Results may vary based on image quality</li>
              <li>All processing happens in your browser for privacy</li>
            </ul>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
