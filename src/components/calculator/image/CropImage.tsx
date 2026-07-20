"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Upload, X, Image as ImageIcon, Download, Loader2, CheckCircle, Crop, RotateCw, RefreshCw } from "lucide-react";
import { useDropzone } from "react-dropzone";
import ReactCrop, { type Crop as ReactCropType } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

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

export default function CropImage() {
  const [file, setFile] = useState<ImageFile | null>(null);
  const [crop, setCrop] = useState<ReactCropType>({
    unit: "px",
    width: 200,
    height: 200,
    x: 0,
    y: 0,
  });
  const [completedCrop, setCompletedCrop] = useState<ReactCropType | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);
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
  
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
      setCrop({ unit: "px", width: 200, height: 200, x: 0, y: 0 });
      setCompletedCrop(null);
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
    setCompletedCrop(null);
  };

  const aspectRatios = [
    { label: "Free", value: undefined },
    { label: "1:1 (Square)", value: 1 },
    { label: "4:3", value: 4/3 },
    { label: "3:2", value: 3/2 },
    { label: "16:9 (Widescreen)", value: 16/9 },
    { label: "9:16 (Portrait)", value: 9/16 },
    { label: "2:3", value: 2/3 },
    { label: "5:4", value: 5/4 },
    { label: "7:5", value: 7/5 },
  ];

  const handleAspectRatioChange = (ratio: number | undefined) => {
    setAspectRatio(ratio);
    setCrop({ ...crop, unit: "px", width: 200, height: 200, x: 0, y: 0 });
    setCompletedCrop(null);
  };

  const handleCropComplete = (c: ReactCropType) => {
    setCompletedCrop(c);
  };

  const handleRotate = () => {
    // Image rotation would require canvas manipulation
    // For now, we'll add a note in the UI
  };

  const handleCrop = async () => {
    if (!file || !completedCrop || !imgRef.current) {
      setResult({ success: false, message: "Please select a crop area first." });
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      const image = imgRef.current;
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("Canvas not available");

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      const cropWidth = completedCrop.width || 0;
      const cropHeight = completedCrop.height || 0;
      const cropX = completedCrop.x || 0;
      const cropY = completedCrop.y || 0;

      canvas.width = cropWidth;
      canvas.height = cropHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context not available");

      ctx.drawImage(
        image,
        cropX * scaleX,
        cropY * scaleY,
        cropWidth * scaleX,
        cropHeight * scaleY,
        0,
        0,
        cropWidth,
        cropHeight
      );

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else throw new Error("Failed to create blob");
        }, file.type || "image/jpeg", 0.95);
      });

      const url = URL.createObjectURL(blob);

      setResult({
        success: true,
        message: `Image cropped successfully!`,
        outputUrl: url,
        outputSize: blob.size,
        originalSize: file.size,
        fileName: `cropped-${file.name}`,
        dimensions: { width: cropWidth, height: cropHeight },
      });
    } catch (error) {
      console.error('Crop error:', error);
      setResult({
        success: false,
        message: "Failed to crop image. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result?.outputUrl) {
      const link = document.createElement('a');
      link.href = result.outputUrl;
      link.download = result.fileName || 'cropped.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="Crop Image"
        description="Crop your images to any dimensions or aspect ratio."
        icon="✂️"
        accuracy="Precise cropping with visual controls"
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
          <div className="space-y-4">
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

            {/* Aspect Ratio Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Aspect Ratio</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio.label}
                    onClick={() => handleAspectRatioChange(ratio.value)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium transition ${
                      aspectRatio === ratio.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Crop Canvas */}
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
              <div className="p-4">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={handleCropComplete}
                  aspect={aspectRatio}
                  className="max-h-[400px] w-full object-contain"
                >
                  <img
                    ref={imgRef}
                    src={file.preview}
                    alt="Crop preview"
                    className="max-h-[400px] w-auto object-contain"
                  />
                </ReactCrop>
              </div>
              <div className="border-t border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500">
                Drag the corners to adjust crop area
              </div>
            </div>

            {/* Crop Dimensions Display */}
            {completedCrop && (
              <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-600">Crop dimensions:</span>
                <span className="font-medium text-slate-800">
                  {Math.round(completedCrop.width || 0)} × {Math.round(completedCrop.height || 0)} px
                </span>
                {aspectRatio && (
                  <span className="text-slate-500">
                    (Aspect ratio: {aspectRatio === 1 ? '1:1' : 
                      aspectRatio === 4/3 ? '4:3' :
                      aspectRatio === 3/2 ? '3:2' :
                      aspectRatio === 16/9 ? '16:9' :
                      aspectRatio === 9/16 ? '9:16' :
                      aspectRatio === 2/3 ? '2:3' :
                      aspectRatio === 5/4 ? '5:4' :
                      aspectRatio === 7/5 ? '7:5' : 
                      `${aspectRatio.toFixed(2)}:1`})
                  </span>
                )}
              </div>
            )}

            {/* Hidden Canvas for Processing */}
            <canvas ref={canvasRef} className="hidden" />

            <Button
              onClick={handleCrop}
              disabled={isProcessing || !completedCrop}
              className="w-full"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Cropping...
                </>
              ) : (
                <>
                  <Crop className="mr-2 h-5 w-5" />
                  Crop Image
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
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <p className="text-xs text-slate-500">Cropped</p>
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
                    Download Cropped Image
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
              <li>Drag the corners of the crop box to adjust</li>
              <li>Select an aspect ratio for precise proportions</li>
              <li>Use "Free" for custom crop dimensions</li>
              <li>All processing happens in your browser for privacy</li>
            </ul>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
