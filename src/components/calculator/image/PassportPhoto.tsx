"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { 
  Upload, X, Image as ImageIcon, Download, Loader2, CheckCircle, 
  Crop, RefreshCw, ZoomIn, ZoomOut, RotateCw, Users, Flag 
} from "lucide-react";
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

interface CountryPreset {
  code: string;
  name: string;
  flag: string;
  width: number;
  height: number;
  unit: "mm" | "inch" | "px";
  bgColor: string;
  headSize: string;
  description: string;
}

const countryPresets: CountryPreset[] = [
  { code: "US", name: "United States", flag: "🇺🇸", width: 2, height: 2, unit: "inch", bgColor: "#FFFFFF", headSize: "1-1 3/8 inches", description: "2x2 inches, white background" },
  { code: "UK", name: "United Kingdom", flag: "🇬🇧", width: 35, height: 45, unit: "mm", bgColor: "#FFFFFF", headSize: "29-34mm", description: "35x45mm, white background" },
  { code: "IN", name: "India", flag: "🇮🇳", width: 2, height: 2, unit: "inch", bgColor: "#FFFFFF", headSize: "1.5-1.8 inches", description: "2x2 inches, white/off-white background" },
  { code: "CA", name: "Canada", flag: "🇨🇦", width: 35, height: 45, unit: "mm", bgColor: "#FFFFFF", headSize: "31-36mm", description: "35x45mm, white background" },
  { code: "AU", name: "Australia", flag: "🇦🇺", width: 35, height: 45, unit: "mm", bgColor: "#FFFFFF", headSize: "32-36mm", description: "35x45mm, white background" },
  { code: "EU", name: "Europe (Schengen)", flag: "🇪🇺", width: 35, height: 45, unit: "mm", bgColor: "#FFFFFF", headSize: "32-36mm", description: "35x45mm, white/light background" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", width: 35, height: 45, unit: "mm", bgColor: "#FFFFFF", headSize: "30-35mm", description: "35x45mm, white background" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾", width: 35, height: 50, unit: "mm", bgColor: "#FFFFFF", headSize: "28-33mm", description: "35x50mm, white background" },
  { code: "JP", name: "Japan", flag: "🇯🇵", width: 35, height: 45, unit: "mm", bgColor: "#FFFFFF", headSize: "32-36mm", description: "35x45mm, white background" },
  { code: "CN", name: "China", flag: "🇨🇳", width: 33, height: 48, unit: "mm", bgColor: "#FFFFFF", headSize: "29-34mm", description: "33x48mm, white background" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", width: 5, height: 7, unit: "cm", bgColor: "#FFFFFF", headSize: "3-4cm", description: "5x7cm, white background" },
  { code: "RU", name: "Russia", flag: "🇷🇺", width: 35, height: 45, unit: "mm", bgColor: "#FFFFFF", headSize: "32-36mm", description: "35x45mm, white background" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", width: 2, height: 2, unit: "inch", bgColor: "#FFFFFF", headSize: "1.5-1.8 inches", description: "2x2 inches, white background" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿", width: 35, height: 45, unit: "mm", bgColor: "#FFFFFF", headSize: "32-36mm", description: "35x45mm, white background" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰", width: 2, height: 2, unit: "inch", bgColor: "#FFFFFF", headSize: "1.5-1.8 inches", description: "2x2 inches, white background" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩", width: 2, height: 2, unit: "inch", bgColor: "#FFFFFF", headSize: "1.5-1.8 inches", description: "2x2 inches, white background" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", width: 2, height: 2, unit: "inch", bgColor: "#FFFFFF", headSize: "1.5-1.8 inches", description: "2x2 inches, white background" },
];

export default function PassportPhoto() {
  const [file, setFile] = useState<ImageFile | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("US");
  const [crop, setCrop] = useState<ReactCropType>({
    unit: "px",
    width: 200,
    height: 200,
    x: 0,
    y: 0,
  });
  const [completedCrop, setCompletedCrop] = useState<ReactCropType | null>(null);
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
  const [showPreview, setShowPreview] = useState(false);
  const [zoom, setZoom] = useState(1);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const selectedPreset = countryPresets.find(c => c.code === selectedCountry) || countryPresets[0];

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
    setShowPreview(false);
    setCompletedCrop(null);
  };

  const handleCropComplete = (c: ReactCropType) => {
    setCompletedCrop(c);
  };

  const handleGenerate = async () => {
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

      // Get target dimensions based on country preset
      let targetWidth = selectedPreset.width;
      let targetHeight = selectedPreset.height;
      
      // Convert to pixels if needed (assuming 300 DPI for print quality)
      if (selectedPreset.unit === "mm") {
        targetWidth = Math.round(targetWidth / 25.4 * 300);
        targetHeight = Math.round(targetHeight / 25.4 * 300);
      } else if (selectedPreset.unit === "inch") {
        targetWidth = Math.round(targetWidth * 300);
        targetHeight = Math.round(targetHeight * 300);
      } else if (selectedPreset.unit === "cm") {
        targetWidth = Math.round(targetWidth / 2.54 * 300);
        targetHeight = Math.round(targetHeight / 2.54 * 300);
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context not available");

      // Draw background
      ctx.fillStyle = selectedPreset.bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw image centered with proper sizing
      const imageAspect = cropWidth / cropHeight;
      const canvasAspect = targetWidth / targetHeight;
      
      let drawWidth, drawHeight, dx, dy;
      
      if (imageAspect > canvasAspect) {
        drawWidth = targetWidth;
        drawHeight = targetWidth / imageAspect;
        dx = 0;
        dy = (targetHeight - drawHeight) / 2;
      } else {
        drawHeight = targetHeight;
        drawWidth = targetHeight * imageAspect;
        dx = (targetWidth - drawWidth) / 2;
        dy = 0;
      }

      ctx.drawImage(
        image,
        cropX * scaleX,
        cropY * scaleY,
        cropWidth * scaleX,
        cropHeight * scaleY,
        dx,
        dy,
        drawWidth,
        drawHeight
      );

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else throw new Error("Failed to create blob");
        }, "image/jpeg", 0.95);
      });

      const url = URL.createObjectURL(blob);

      setResult({
        success: true,
        message: `Passport photo generated successfully! (${selectedPreset.name})`,
        outputUrl: url,
        outputSize: blob.size,
        originalSize: file.size,
        fileName: `passport-${selectedPreset.code}-${Date.now()}.jpg`,
        dimensions: { width: targetWidth, height: targetHeight },
      });
      setShowPreview(true);
    } catch (error) {
      console.error('Generation error:', error);
      setResult({
        success: false,
        message: "Failed to generate passport photo. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result?.outputUrl) {
      const link = document.createElement('a');
      link.href = result.outputUrl;
      link.download = result.fileName || 'passport-photo.jpg';
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
        title="Passport Size Photo Maker"
        description="Create passport photos that meet official requirements for any country."
        icon="📸"
        accuracy="Meets international passport photo standards"
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
              {isDragActive ? 'Drop image here' : 'Drag & drop a photo'}
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
              📸 Make sure your photo has a clear face and good lighting
            </div>
          </div>
        )}

        {file && !result?.success && (
          <div className="space-y-6">
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

            {/* Country Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Flag className="h-4 w-4" />
                Select Country
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                {countryPresets.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => setSelectedCountry(country.code)}
                    className={`p-2 rounded-xl border-2 text-center transition ${
                      selectedCountry === country.code
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-2xl">{country.flag}</div>
                    <p className={`mt-1 text-xs font-medium ${
                      selectedCountry === country.code ? 'text-blue-700' : 'text-slate-700'
                    }`}>
                      {country.code}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">{country.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Country Requirements */}
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedPreset.flag}</span>
                <span className="font-medium text-blue-700">{selectedPreset.name}</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-blue-700">
                <div>
                  <span className="font-medium">Size:</span> {selectedPreset.width}×{selectedPreset.height} {selectedPreset.unit}
                </div>
                <div>
                  <span className="font-medium">Background:</span> {selectedPreset.bgColor}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Head size:</span> {selectedPreset.headSize}
                </div>
                <div className="col-span-2 text-blue-600 text-[10px]">
                  {selectedPreset.description}
                </div>
              </div>
            </div>

            {/* Crop Area */}
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
              <div className="p-4">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={handleCropComplete}
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
                🎯 Crop your face area - this will be sized to {selectedPreset.width}×{selectedPreset.height} {selectedPreset.unit}
              </div>
            </div>

            {/* Crop Dimensions */}
            {completedCrop && (
              <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-600">Crop area:</span>
                <span className="font-medium text-slate-800">
                  {Math.round(completedCrop.width || 0)} × {Math.round(completedCrop.height || 0)} px
                </span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-600">Output size:</span>
                <span className="font-medium text-blue-600">
                  {selectedPreset.width}×{selectedPreset.height} {selectedPreset.unit}
                </span>
              </div>
            )}

            {/* Hidden Canvas */}
            <canvas ref={canvasRef} className="hidden" />

            <Button
              onClick={handleGenerate}
              disabled={isProcessing || !completedCrop}
              className="w-full"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Passport Photo...
                </>
              ) : (
                <>
                  <Users className="mr-2 h-5 w-5" />
                  Generate Passport Photo
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
                  {result.success && result.dimensions && (
                    <div className="mt-2 text-xs text-green-600">
                      <p>Output: {result.dimensions.width}×{result.dimensions.height} px • {formatFileSize(result.outputSize || 0)}</p>
                      <p className="text-green-500">✅ Ready for {selectedPreset.name} passport requirements</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

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

                <div className="rounded-xl border border-slate-200 overflow-hidden bg-white p-4 flex justify-center">
                  <img
                    src={result.outputUrl}
                    alt="Passport photo"
                    className="max-h-[400px] w-auto object-contain transition-transform duration-300"
                    style={{ transform: `scale(${zoom})` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleDownload}
                    className="w-full"
                    size="lg"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Photo
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setResult(null);
                      setShowPreview(false);
                      setCompletedCrop(null);
                    }}
                    className="w-full"
                    size="lg"
                  >
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Start Over
                  </Button>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 text-xs text-slate-600">
                  <p className="font-medium text-slate-700">📌 Tips for best results:</p>
                  <ul className="mt-1 space-y-0.5 list-disc list-inside">
                    <li>Use a photo with good lighting on your face</li>
                    <li>Stand against a plain, light-colored background</li>
                    <li>Keep a neutral expression</li>
                    <li>Make sure your face is clearly visible</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {!result?.success && file && (
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-medium text-slate-700">📋 Instructions:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-xs">
              <li>Upload a recent photo of yourself</li>
              <li>Select your country from the list</li>
              <li>Crop the image to focus on your face</li>
              <li>Review the country-specific requirements</li>
              <li>Generate and download your passport photo</li>
            </ul>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
