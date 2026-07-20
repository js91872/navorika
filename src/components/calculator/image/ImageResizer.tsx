"use client";

import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Download, Loader2, CheckCircle, Maximize, RefreshCw } from "lucide-react";
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

export default function ImageResizer() {
  const [file, setFile] = useState<ImageFile | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [resizeMode, setResizeMode] = useState<"pixels" | "percentage" | "preset">("pixels");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ 
    success: boolean; 
    message: string; 
    outputUrl?: string; 
    outputSize?: number;
    originalSize?: number;
    fileName?: string;
    dimensions?: { width: number; height: number };
  } | null>(null);

  const presets = [
    { label: "Social Media", width: 1080, height: 1080 },
    { label: "Facebook Cover", width: 820, height: 312 },
    { label: "Instagram Post", width: 1080, height: 1080 },
    { label: "Twitter Header", width: 1500, height: 500 },
    { label: "LinkedIn Post", width: 1200, height: 627 },
    { label: "YouTube Thumbnail", width: 1280, height: 720 },
    { label: "HD (720p)", width: 1280, height: 720 },
    { label: "Full HD (1080p)", width: 1920, height: 1080 },
    { label: "4K", width: 3840, height: 2160 },
  ];

  const [selectedPreset, setSelectedPreset] = useState<string>("Social Media");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const url = URL.createObjectURL(file);
      
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = url;

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

  const handleWidthChange = (value: number) => {
    setWidth(value);
    if (maintainAspectRatio && originalDimensions.width > 0) {
      const ratio = originalDimensions.height / originalDimensions.width;
      setHeight(Math.round(value * ratio));
    }
  };

  const handleHeightChange = (value: number) => {
    setHeight(value);
    if (maintainAspectRatio && originalDimensions.height > 0) {
      const ratio = originalDimensions.width / originalDimensions.height;
      setWidth(Math.round(value * ratio));
    }
  };

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    const selected = presets.find(p => p.label === preset);
    if (selected) {
      setWidth(selected.width);
      setHeight(selected.height);
    }
  };

  const handleReset = () => {
    setWidth(originalDimensions.width);
    setHeight(originalDimensions.height);
    setSelectedPreset("Custom");
  };

  const handleResize = async () => {
    if (!file) {
      setResult({ success: false, message: "Please upload an image first." });
      return;
    }

    if (width < 1 || height < 1) {
      setResult({ success: false, message: "Please enter valid dimensions." });
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      const options = {
        maxWidthOrHeight: Math.max(width, height),
        useWebWorker: true,
        fileType: file.type,
      };

      const resizedFile = await imageCompression(file.file, options);
      const url = URL.createObjectURL(resizedFile);

      setResult({
        success: true,
        message: `Image resized successfully!`,
        outputUrl: url,
        outputSize: resizedFile.size,
        originalSize: file.size,
        fileName: `resized-${file.name}`,
        dimensions: { width, height },
      });
    } catch (error) {
      console.error('Resize error:', error);
      setResult({
        success: false,
        message: "Failed to resize image. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result?.outputUrl) {
      const link = document.createElement('a');
      link.href = result.outputUrl;
      link.download = result.fileName || 'resized.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resizeModes = [
    { value: "pixels", label: "Pixels", icon: "📐" },
    { value: "percentage", label: "Percentage", icon: "📊" },
    { value: "preset", label: "Presets", icon: "⚡" },
  ];

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="Image Resizer"
        description="Resize images to any dimensions with ease."
        icon="📐"
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
              <p className="text-xs text-slate-500">
                {formatFileSize(file.size)} • {originalDimensions.width}×{originalDimensions.height}
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
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Resize Mode</label>
              <div className="grid grid-cols-3 gap-2">
                {resizeModes.map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => setResizeMode(mode.value as any)}
                    className={`py-2 px-3 rounded-xl text-sm font-medium transition ${
                      resizeMode === mode.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span className="mr-1">{mode.icon}</span>
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {resizeMode === "preset" && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Preset Dimensions</label>
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {presets.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => handlePresetChange(preset.label)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium transition ${
                        selectedPreset === preset.label
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {preset.label}
                      <span className="block text-[10px] opacity-75">
                        {preset.width}×{preset.height}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(resizeMode === "pixels" || resizeMode === "percentage") && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Width {resizeMode === "percentage" ? "(%)" : "(px)"}
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Height {resizeMode === "percentage" ? "(%)" : "(px)"}
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="aspect-ratio"
                checked={maintainAspectRatio}
                onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="aspect-ratio" className="text-sm text-slate-700">
                Maintain aspect ratio
              </label>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset to Original
            </Button>

            <Button
              onClick={handleResize}
              disabled={isProcessing}
              className="w-full"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Resizing...
                </>
              ) : (
                <>
                  <Maximize className="mr-2 h-5 w-5" />
                  Resize Image
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
                {result.success && result.originalSize && result.outputSize && result.dimensions && (
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <p className="text-xs text-slate-500">Original</p>
                      <p className="text-sm font-semibold text-slate-700">
                        {formatFileSize(result.originalSize)}
                      </p>
                      <p className="text-xs text-slate-400">
                        {originalDimensions.width}×{originalDimensions.height}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <p className="text-xs text-slate-500">Resized</p>
                      <p className="text-sm font-semibold text-green-700">
                        {formatFileSize(result.outputSize)}
                      </p>
                      <p className="text-xs text-slate-400">
                        {result.dimensions.width}×{result.dimensions.height}
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
                    Download Resized Image
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
              <li>Use presets for common social media dimensions</li>
              <li>Maintain aspect ratio to prevent distortion</li>
              <li>Larger images take longer to process</li>
              <li>All processing happens in your browser for privacy</li>
            </ul>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
