'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Upload,
  Download,
  RotateCcw,
  Crop,
  ShieldCheck,
  Check,
  Copy,
  Sliders,
  X,
  FileImage,
  Loader2,
  FileCode,
} from 'lucide-react';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';
import { fieldClass, buttonClass } from './ToolControls';
import { parseSvgDimensions } from '@/lib/calculations/svgDimensions';
import { rowsToCsv } from '@/lib/resultExport';

export type ImageCanvasToolSlug =
  | 'crop-image'
  | 'icon-sticker-maker'
  | 'id-photo-maker'
  | 'image-color-picker'
  | 'image-metadata-viewer'
  | 'meme-generator'
  | 'photo-collage-maker'
  | 'photo-editor'
  | 'social-media-resizer'
  | 'svg-dimensions-checker'
  | 'upscale-image'
  | 'watermark-image';

interface Props {
  slug: ImageCanvasToolSlug;
  locale: Locale;
  dictionary: Dictionary;
}

const SOCIAL_PRESETS = [
  {
    id: 'instagram',
    name: 'Instagram',
    formats: [
      { name: 'Square Post', w: 1080, h: 1080 },
      { name: 'Portrait Post', w: 1080, h: 1350 },
      { name: 'Story / Reel', w: 1080, h: 1920 },
    ],
  },
  {
    id: 'facebook',
    name: 'Facebook',
    formats: [
      { name: 'Shared Image', w: 1200, h: 630 },
      { name: 'Cover Photo', w: 820, h: 312 },
      { name: 'Profile Picture', w: 170, h: 170 },
    ],
  },
  {
    id: 'youtube',
    name: 'YouTube',
    formats: [
      { name: 'Thumbnail', w: 1280, h: 720 },
      { name: 'Channel Banner', w: 2560, h: 1440 },
      { name: 'Profile Pic', w: 800, h: 800 },
    ],
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    formats: [
      { name: 'In-Stream Photo', w: 1600, h: 900 },
      { name: 'Header', w: 1500, h: 500 },
    ],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    formats: [
      { name: 'Company Logo', w: 300, h: 300 },
      { name: 'Cover Photo', w: 1128, h: 191 },
      { name: 'Shared Image', w: 1200, h: 627 },
    ],
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    formats: [
      { name: 'Standard Pin', w: 1000, h: 1500 },
      { name: 'Square Pin', w: 1000, h: 1000 },
    ],
  },
] as const;

type MetadataDetails = {
  name: string;
  type: string;
  size: number;
  width: number;
  height: number;
  modified: string;
};

type CollageItem = { file: File; url: string };

export default function LocalizedImageCanvasTools({ slug, locale, dictionary }: Props) {
  const d = dictionary;
  const cv = d.imageTools.canvas;
  const cm = d.imageTools.common;
  const t = d.tools[slug];

  // Common file state
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // 1. crop-image
  const [cropX, setCropX] = useState(50);
  const [cropY, setCropY] = useState(50);
  const [cropW, setCropW] = useState(300);
  const [cropH, setCropH] = useState(300);

  // 2. icon-sticker-maker
  const [stickerFormat, setStickerFormat] = useState<'whatsapp' | 'favicon-512' | 'favicon-192' | 'favicon-32'>('whatsapp');

  // 3. id-photo-maker
  const [idPreset, setIdPreset] = useState<'us_passport' | 'uk_passport' | 'in_passport' | 'in_pan' | 'linkedin'>('us_passport');
  const [idZoom, setIdZoom] = useState(1);
  const [idOffsetX, setIdOffsetX] = useState(0);
  const [idOffsetY, setIdOffsetY] = useState(0);

  // 4. image-color-picker
  const [pickedColor, setPickedColor] = useState<string | null>(null);

  // 5. image-metadata-viewer
  const [metaDetails, setMetaDetails] = useState<MetadataDetails | null>(null);

  // 6. meme-generator
  const [topText, setTopText] = useState('TOP CAPTION');
  const [bottomText, setBottomText] = useState('BOTTOM CAPTION');
  const [memeFontSize, setMemeFontSize] = useState(10);

  // 7. photo-collage-maker
  const [collageItems, setCollageItems] = useState<CollageItem[]>([]);
  const [collageCols, setCollageCols] = useState(3);
  const [collageGap, setCollageGap] = useState(12);
  const collageInputRef = useRef<HTMLInputElement>(null);

  // 8. photo-editor
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [sepia, setSepia] = useState(0);

  // 9. social-media-resizer
  const [socialPlatformId, setSocialPlatformId] = useState('instagram');
  const [socialFormatIdx, setSocialFormatIdx] = useState(0);
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover');
  const [bgColor, setBgColor] = useState('#ffffff');

  // 10. svg-dimensions-checker
  const [svgMarkup, setSvgMarkup] = useState(
    `<svg width="100mm" height="50mm" viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="50" fill="#6366f1" rx="5"/>
  <circle cx="50" cy="25" r="15" fill="#ffffff"/>
</svg>`
  );
  const [svgFileName, setSvgFileName] = useState('');

  // 11. upscale-image
  const [upscaleMultiplier, setUpscaleMultiplier] = useState<number>(2);
  const [originDims, setOriginDims] = useState({ w: 0, h: 0 });

  // 12. watermark-image
  const [watermarkText, setWatermarkText] = useState('© Navorika');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.5);
  const [watermarkPos, setWatermarkPos] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'>('bottom-right');
  const [watermarkColor, setWatermarkColor] = useState('#ffffff');

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      collageItems.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [previewUrl, collageItems]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setErrorMsg('');
      const url = URL.createObjectURL(selected);
      setPreviewUrl(url);

      if (slug === 'image-metadata-viewer') {
        createImageBitmap(selected)
          .then((bitmap) => {
            setMetaDetails({
              name: selected.name,
              type: selected.type || 'image/*',
              size: selected.size,
              width: bitmap.width,
              height: bitmap.height,
              modified: new Date(selected.lastModified).toLocaleDateString(locale),
            });
            bitmap.close();
          })
          .catch(() => {
            setErrorMsg(cm.errorUnsupported);
          });
      }
    }
  };

  // Render canvas based on active tool
  useEffect(() => {
    if (!previewUrl || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setOriginDims({ w: img.width, h: img.height });

      if (slug === 'icon-sticker-maker') {
        let targetSize = 512;
        if (stickerFormat === 'favicon-32') targetSize = 32;
        if (stickerFormat === 'favicon-192') targetSize = 192;
        if (stickerFormat === 'favicon-512') targetSize = 512;

        canvas.width = targetSize;
        canvas.height = targetSize;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const paddingMultiplier = stickerFormat === 'whatsapp' ? 0.9 : 1.0;
        const drawW = img.width * scale * paddingMultiplier;
        const drawH = img.height * scale * paddingMultiplier;
        const drawX = (canvas.width - drawW) / 2;
        const drawY = (canvas.height - drawH) / 2;

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      } else if (slug === 'id-photo-maker') {
        const presets: Record<string, { w: number; h: number }> = {
          us_passport: { w: 600, h: 600 },
          uk_passport: { w: 413, h: 531 },
          in_passport: { w: 413, h: 531 },
          in_pan: { w: 295, h: 413 },
          linkedin: { w: 800, h: 800 },
        };
        const p = presets[idPreset] || presets.us_passport;
        canvas.width = p.w;
        canvas.height = p.h;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const scale = Math.max(canvas.width / img.width, canvas.height / img.height) * idZoom;
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        const drawX = (canvas.width - drawW) / 2 + idOffsetX;
        const drawY = (canvas.height - drawH) / 2 + idOffsetY;

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      } else if (slug === 'image-color-picker') {
        const maxW = 500;
        const ratio = img.width / img.height;
        canvas.width = Math.min(img.width, maxW);
        canvas.height = canvas.width / ratio;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } else if (slug === 'meme-generator') {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const calculatedSize = Math.floor(canvas.height * (memeFontSize / 100));
        ctx.font = `900 ${calculatedSize}px Impact, "Arial Black", sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = Math.max(3, calculatedSize / 15);

        if (topText) {
          ctx.textBaseline = 'top';
          ctx.strokeText(topText.toUpperCase(), canvas.width / 2, 20);
          ctx.fillText(topText.toUpperCase(), canvas.width / 2, 20);
        }
        if (bottomText) {
          ctx.textBaseline = 'bottom';
          ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
          ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
        }
      } else if (slug === 'photo-editor') {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${sepia}%)`;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } else if (slug === 'social-media-resizer') {
        const plat = SOCIAL_PRESETS.find((p) => p.id === socialPlatformId) || SOCIAL_PRESETS[0];
        const fmt = plat.formats[socialFormatIdx] || plat.formats[0];
        canvas.width = fmt.w;
        canvas.height = fmt.h;

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const srcRatio = img.width / img.height;
        const dstRatio = canvas.width / canvas.height;
        let drawW: number, drawH: number, drawX: number, drawY: number;

        if (fitMode === 'cover') {
          if (srcRatio > dstRatio) {
            drawH = canvas.height;
            drawW = drawH * srcRatio;
            drawX = (canvas.width - drawW) / 2;
            drawY = 0;
          } else {
            drawW = canvas.width;
            drawH = drawW / srcRatio;
            drawX = 0;
            drawY = (canvas.height - drawH) / 2;
          }
        } else {
          if (srcRatio > dstRatio) {
            drawW = canvas.width;
            drawH = drawW / srcRatio;
            drawX = 0;
            drawY = (canvas.height - drawH) / 2;
          } else {
            drawH = canvas.height;
            drawW = drawH * srcRatio;
            drawX = (canvas.width - drawW) / 2;
            drawY = 0;
          }
        }
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      } else if (slug === 'upscale-image') {
        canvas.width = img.width * upscaleMultiplier;
        canvas.height = img.height * upscaleMultiplier;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } else if (slug === 'watermark-image') {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.globalAlpha = 1.0;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const fontSize = Math.max(20, canvas.width * 0.05);
        ctx.font = `bold ${fontSize}px Arial, sans-serif`;
        ctx.fillStyle = watermarkColor;
        ctx.globalAlpha = watermarkOpacity;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        const metrics = ctx.measureText(watermarkText);
        const textWidth = metrics.width;
        const offset = fontSize;
        let x = 0;
        let y = 0;

        switch (watermarkPos) {
          case 'top-left':
            x = offset;
            y = offset + fontSize;
            break;
          case 'top-right':
            x = canvas.width - textWidth - offset;
            y = offset + fontSize;
            break;
          case 'bottom-left':
            x = offset;
            y = canvas.height - offset;
            break;
          case 'bottom-right':
            x = canvas.width - textWidth - offset;
            y = canvas.height - offset;
            break;
          case 'center':
            x = (canvas.width - textWidth) / 2;
            y = (canvas.height + fontSize) / 2;
            break;
        }
        ctx.fillText(watermarkText, x, y);
        ctx.globalAlpha = 1.0;
        ctx.shadowColor = 'transparent';
      }
    };
    img.src = previewUrl;
  }, [
    slug,
    previewUrl,
    stickerFormat,
    idPreset,
    idZoom,
    idOffsetX,
    idOffsetY,
    memeFontSize,
    topText,
    bottomText,
    brightness,
    contrast,
    saturation,
    sepia,
    socialPlatformId,
    socialFormatIdx,
    fitMode,
    bgColor,
    upscaleMultiplier,
    watermarkText,
    watermarkOpacity,
    watermarkPos,
    watermarkColor,
  ]);

  // Specific Actions
  const executeCrop = () => {
    if (!file || !previewUrl) return;
    setIsProcessing(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = cropW;
      canvas.height = cropH;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Navorika_Cropped_${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
          }
          setIsProcessing(false);
        }, 'image/png');
      }
    };
    img.src = previewUrl;
  };

  const downloadCanvasBlob = (filename: string, mime: string = 'image/png') => {
    if (!canvasRef.current) return;
    setIsProcessing(true);
    canvasRef.current.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(url);
        }
        setIsProcessing(false);
      },
      mime,
      1.0
    );
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (slug !== 'image-color-picker' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1).toUpperCase()}`;
    setPickedColor(hex);
  };

  // Collage actions
  const addCollageFiles = (list: FileList | null) => {
    if (!list) return;
    const files = Array.from(list);
    setCollageItems((prev) => {
      const available = Math.max(0, 12 - prev.length);
      const added = files.slice(0, available).map((f) => ({ file: f, url: URL.createObjectURL(f) }));
      return [...prev, ...added];
    });
    if (collageInputRef.current) collageInputRef.current.value = '';
  };

  const removeCollageItem = (idx: number) => {
    setCollageItems((prev) => {
      const removed = prev[idx];
      if (removed) URL.revokeObjectURL(removed.url);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const createCollage = async () => {
    if (collageItems.length === 0) return;
    setIsProcessing(true);
    try {
      const bitmaps: ImageBitmap[] = [];
      for (const item of collageItems) {
        const bm = await createImageBitmap(item.file);
        bitmaps.push(bm);
      }
      const size = 1200;
      const rows = Math.ceil(bitmaps.length / collageCols);
      const cellWidth = (size - collageGap * (collageCols + 1)) / collageCols;

      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = Math.ceil(cellWidth * rows + collageGap * (rows + 1));
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      bitmaps.forEach((bm, i) => {
        const col = i % collageCols;
        const row = Math.floor(i / collageCols);
        const x = collageGap + col * (cellWidth + collageGap);
        const y = collageGap + row * (cellWidth + collageGap);
        const scale = Math.max(cellWidth / bm.width, cellWidth / bm.height);
        const w = bm.width * scale;
        const h = bm.height * scale;

        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, cellWidth, cellWidth);
        ctx.clip();
        ctx.drawImage(bm, x + (cellWidth - w) / 2, y + (cellWidth - h) / 2, w, h);
        ctx.restore();
        bm.close();
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Navorika_Collage_${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(url);
        }
        setIsProcessing(false);
      }, 'image/png');
    } catch {
      setIsProcessing(false);
      setErrorMsg(cm.errorUnsupported);
    }
  };

  // SVG dimensions
  const svgResult = useMemo(() => {
    if (slug !== 'svg-dimensions-checker') return null;
    return parseSvgDimensions(svgMarkup);
  }, [slug, svgMarkup]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Build summary DL
  const dlRows = useMemo(() => {
    const rows: [string, string][] = [];
    if (slug === 'crop-image') {
      rows.push([cv.widthPx, `${cropW} px`]);
      rows.push([cv.heightPx, `${cropH} px`]);
      rows.push([cv.xOffset, `${cropX} px`]);
      rows.push([cv.yOffset, `${cropY} px`]);
    } else if (slug === 'icon-sticker-maker') {
      rows.push([cv.targetProfile, stickerFormat.toUpperCase()]);
      rows.push([cm.dimensions, stickerFormat === 'favicon-32' ? '32×32' : stickerFormat === 'favicon-192' ? '192×192' : '512×512']);
    } else if (slug === 'id-photo-maker') {
      rows.push([cv.passportPreset, idPreset.toUpperCase()]);
      rows.push([cv.zoom, `${idZoom}×`]);
    } else if (slug === 'image-color-picker') {
      rows.push([cv.pickedHex, pickedColor || '#FFFFFF']);
      rows.push([cv.fileName, file ? file.name : '-']);
    } else if (slug === 'image-metadata-viewer') {
      if (metaDetails) {
        rows.push([cv.fileName, metaDetails.name]);
        rows.push([cv.mimeType, metaDetails.type]);
        rows.push([cv.fileSize, `${(metaDetails.size / 1024).toFixed(1)} KB`]);
        rows.push([cv.pixelDimensions, `${metaDetails.width} × ${metaDetails.height}`]);
        rows.push([cv.aspectRatio, (metaDetails.width / metaDetails.height).toFixed(4)]);
        rows.push([cv.lastModified, metaDetails.modified]);
      } else {
        rows.push([cm.originalSize, '-']);
      }
    } else if (slug === 'meme-generator') {
      rows.push([cv.topCaption, topText || '-']);
      rows.push([cv.bottomCaption, bottomText || '-']);
      rows.push([cv.textScale, `${memeFontSize}%`]);
    } else if (slug === 'photo-collage-maker') {
      rows.push([cv.columns, `${collageCols}`]);
      rows.push([cv.gap, `${collageGap} px`]);
      rows.push([cm.dimensions, `${collageItems.length} / 12`]);
    } else if (slug === 'photo-editor') {
      rows.push([cv.brightness, `${brightness}%`]);
      rows.push([cv.contrast, `${contrast}%`]);
      rows.push([cv.saturation, `${saturation}%`]);
      rows.push([cv.sepia, `${sepia}%`]);
    } else if (slug === 'social-media-resizer') {
      const plat = SOCIAL_PRESETS.find((p) => p.id === socialPlatformId) || SOCIAL_PRESETS[0];
      const fmt = plat.formats[socialFormatIdx] || plat.formats[0];
      rows.push([cv.socialPlatform, plat.name]);
      rows.push([cv.socialFormat, fmt.name]);
      rows.push([cm.dimensions, `${fmt.w} × ${fmt.h}`]);
    } else if (slug === 'svg-dimensions-checker' && svgResult) {
      rows.push([cv.declaredWidth, svgResult.declaredWidth !== null ? `${svgResult.declaredWidth} ${svgResult.declaredWidthUnit}` : '-']);
      rows.push([cv.declaredHeight, svgResult.declaredHeight !== null ? `${svgResult.declaredHeight} ${svgResult.declaredHeightUnit}` : '-']);
      rows.push([cv.pixelEquivalent, svgResult.widthInPixels !== null ? `${svgResult.widthInPixels} × ${svgResult.heightInPixels} px` : '-']);
      rows.push([cv.viewBox, svgResult.viewBox || '-']);
      rows.push([cv.aspectRatio, svgResult.aspectRatioString || '-']);
    } else if (slug === 'upscale-image') {
      rows.push([cv.upscaleFactor, `${upscaleMultiplier}×`]);
      rows.push([cm.originalSize, `${originDims.w} × ${originDims.h}`]);
      rows.push([cm.outputSize, `${originDims.w * upscaleMultiplier} × ${originDims.h * upscaleMultiplier}`]);
    } else if (slug === 'watermark-image') {
      rows.push([cv.watermarkText, watermarkText || '-']);
      rows.push([cv.watermarkPosition, watermarkPos]);
      rows.push([cv.opacity, `${Math.round(watermarkOpacity * 100)}%`]);
    }
    return rows;
  }, [
    slug,
    cv,
    cm,
    cropW,
    cropH,
    cropX,
    cropY,
    stickerFormat,
    idPreset,
    idZoom,
    pickedColor,
    file,
    metaDetails,
    topText,
    bottomText,
    memeFontSize,
    collageCols,
    collageGap,
    collageItems.length,
    brightness,
    contrast,
    saturation,
    sepia,
    socialPlatformId,
    socialFormatIdx,
    svgResult,
    upscaleMultiplier,
    originDims,
    watermarkText,
    watermarkPos,
    watermarkOpacity,
  ]);

  return (
    <div data-hydrated="true" dir={locale === 'ar' ? 'rtl' : 'ltr'} className="space-y-8">
      {/* Hero Header */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            {d.ui.local}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">{t.title}</h1>
        <p className="mt-2 text-base text-[var(--muted-foreground)] leading-relaxed">{t.description}</p>
      </div>

      {/* Main Studio Interactive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm space-y-5">
            {/* 1. crop-image Controls */}
            {slug === 'crop-image' && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-400 p-8 text-sm font-semibold hover:bg-indigo-500/5 transition"
                >
                  <Upload className="h-5 w-5 text-indigo-500" />
                  {file ? file.name : cv.cropPrompt}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

                {file && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[var(--muted-foreground)] uppercase mb-1.5">{cv.xOffset}</label>
                        <input type="number" value={cropX} onChange={(e) => setCropX(Number(e.target.value))} className={fieldClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[var(--muted-foreground)] uppercase mb-1.5">{cv.yOffset}</label>
                        <input type="number" value={cropY} onChange={(e) => setCropY(Number(e.target.value))} className={fieldClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[var(--muted-foreground)] uppercase mb-1.5">{cv.widthPx}</label>
                        <input type="number" value={cropW} onChange={(e) => setCropW(Number(e.target.value))} className={fieldClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[var(--muted-foreground)] uppercase mb-1.5">{cv.heightPx}</label>
                        <input type="number" value={cropH} onChange={(e) => setCropH(Number(e.target.value))} className={fieldClass} />
                      </div>
                    </div>
                    <button type="button" onClick={executeCrop} disabled={isProcessing} className={buttonClass}>
                      <Crop className="h-4 w-4" />
                      {cv.cropAction}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* 2. icon-sticker-maker Controls */}
            {slug === 'icon-sticker-maker' && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-400 p-8 text-sm font-semibold hover:bg-indigo-500/5 transition"
                >
                  <Upload className="h-5 w-5 text-indigo-500" />
                  {file ? file.name : cm.uploadPrompt}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

                {file && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[var(--muted-foreground)] uppercase mb-1.5">{cv.targetProfile}</label>
                      <select
                        value={stickerFormat}
                        onChange={(e) => setStickerFormat(e.target.value as any)}
                        className={fieldClass}
                      >
                        <option value="whatsapp">{cv.whatsappSticker}</option>
                        <option value="favicon-512">{cv.highResIcon}</option>
                        <option value="favicon-192">{cv.pwaIcon}</option>
                        <option value="favicon-32">{cv.browserFavicon}</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        downloadCanvasBlob(
                          `Navorika_${stickerFormat}_${Date.now()}.${stickerFormat === 'whatsapp' ? 'webp' : 'png'}`,
                          stickerFormat === 'whatsapp' ? 'image/webp' : 'image/png'
                        )
                      }
                      disabled={isProcessing}
                      className={buttonClass}
                    >
                      <Download className="h-4 w-4" />
                      {cv.generateAsset}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* 3. id-photo-maker Controls */}
            {slug === 'id-photo-maker' && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-400 p-8 text-sm font-semibold hover:bg-indigo-500/5 transition"
                >
                  <Upload className="h-5 w-5 text-indigo-500" />
                  {file ? file.name : cm.uploadPrompt}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

                {file && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[var(--muted-foreground)] uppercase mb-1.5">{cv.passportPreset}</label>
                      <select
                        value={idPreset}
                        onChange={(e) => setIdPreset(e.target.value as any)}
                        className={fieldClass}
                      >
                        <option value="us_passport">{cv.usPassport}</option>
                        <option value="uk_passport">{cv.ukPassport}</option>
                        <option value="in_passport">{cv.inPassport}</option>
                        <option value="in_pan">{cv.inPan}</option>
                        <option value="linkedin">{cv.profileSquare}</option>
                      </select>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold text-[var(--muted-foreground)] mb-1">
                        <span>{cv.zoom}</span>
                        <span>{idZoom}×</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2.5"
                        step="0.05"
                        value={idZoom}
                        onChange={(e) => setIdZoom(Number(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[var(--muted-foreground)] uppercase mb-1.5">{cv.xOffset}</label>
                        <input
                          type="number"
                          value={idOffsetX}
                          onChange={(e) => setIdOffsetX(Number(e.target.value))}
                          className={fieldClass}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[var(--muted-foreground)] uppercase mb-1.5">{cv.yOffset}</label>
                        <input
                          type="number"
                          value={idOffsetY}
                          onChange={(e) => setIdOffsetY(Number(e.target.value))}
                          className={fieldClass}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => downloadCanvasBlob(`Navorika_ID_Photo_${Date.now()}.jpg`, 'image/jpeg')}
                      disabled={isProcessing}
                      className={buttonClass}
                    >
                      <Download className="h-4 w-4" />
                      {cv.downloadIdPhoto}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* 4. image-color-picker Controls */}
            {slug === 'image-color-picker' && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-400 p-8 text-sm font-semibold hover:bg-indigo-500/5 transition"
                >
                  <Upload className="h-5 w-5 text-indigo-500" />
                  {file ? file.name : cv.uploadPickPrompt}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

                {pickedColor && (
                  <div className="space-y-4 rounded-2xl bg-[var(--muted)] p-4 border border-[var(--border)]">
                    <div className="flex items-center gap-4">
                      <div
                        className="h-12 w-12 rounded-xl border border-white/20 shadow-inner"
                        style={{ backgroundColor: pickedColor }}
                      />
                      <div>
                        <p className="text-xs font-bold uppercase text-[var(--muted-foreground)]">{cv.pickedHex}</p>
                        <p className="text-lg font-mono font-bold text-[var(--foreground)]">{pickedColor}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(pickedColor)}
                      className={buttonClass}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? d.ui.copied : cv.copyColorCode}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* 5. image-metadata-viewer Controls */}
            {slug === 'image-metadata-viewer' && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-400 p-8 text-sm font-semibold hover:bg-indigo-500/5 transition"
                >
                  <Upload className="h-5 w-5 text-indigo-500" />
                  {file ? file.name : cv.chooseImage}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{cv.exifNotice}</p>
              </>
            )}

            {/* 6. meme-generator Controls */}
            {slug === 'meme-generator' && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-400 p-8 text-sm font-semibold hover:bg-indigo-500/5 transition"
                >
                  <Upload className="h-5 w-5 text-indigo-500" />
                  {file ? file.name : cv.uploadMemePrompt}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

                {file && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[var(--muted-foreground)] uppercase mb-1.5">{cv.topCaption}</label>
                      <input
                        type="text"
                        value={topText}
                        onChange={(e) => setTopText(e.target.value)}
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[var(--muted-foreground)] uppercase mb-1.5">{cv.bottomCaption}</label>
                      <input
                        type="text"
                        value={bottomText}
                        onChange={(e) => setBottomText(e.target.value)}
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold text-[var(--muted-foreground)] mb-1">
                        <span>{cv.textScale}</span>
                        <span>{memeFontSize}%</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="25"
                        value={memeFontSize}
                        onChange={(e) => setMemeFontSize(Number(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => downloadCanvasBlob(`Navorika_Meme_${Date.now()}.png`, 'image/png')}
                      disabled={isProcessing}
                      className={buttonClass}
                    >
                      <Download className="h-4 w-4" />
                      {cv.downloadMeme}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* 7. photo-collage-maker Controls */}
            {slug === 'photo-collage-maker' && (
              <>
                <button
                  type="button"
                  onClick={() => collageInputRef.current?.click()}
                  disabled={collageItems.length >= 12 || isProcessing}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-400 p-8 text-sm font-semibold hover:bg-indigo-500/5 transition disabled:opacity-50"
                >
                  <Upload className="h-5 w-5 text-indigo-500" />
                  {cv.collagePrompt}
                </button>
                <input
                  ref={collageInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => addCollageFiles(e.target.files)}
                />

                {collageItems.length > 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[var(--muted-foreground)] uppercase mb-1.5">{cv.columns}</label>
                        <select
                          value={collageCols}
                          onChange={(e) => setCollageCols(Number(e.target.value))}
                          className={fieldClass}
                        >
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[var(--muted-foreground)] uppercase mb-1.5">
                          {cv.gap}: {collageGap}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="40"
                          value={collageGap}
                          onChange={(e) => setCollageGap(Number(e.target.value))}
                          className="w-full accent-indigo-600 mt-2"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={createCollage}
                      disabled={isProcessing}
                      className={buttonClass}
                    >
                      {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                      {isProcessing ? cv.creatingCollage : cv.createCollage}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* 8. photo-editor Controls */}
            {slug === 'photo-editor' && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-400 p-8 text-sm font-semibold hover:bg-indigo-500/5 transition"
                >
                  <Upload className="h-5 w-5 text-indigo-500" />
                  {file ? file.name : cm.uploadPrompt}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

                {file && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-[var(--muted-foreground)] mb-1">
                        <span>{cv.brightness}</span>
                        <span>{brightness}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold text-[var(--muted-foreground)] mb-1">
                        <span>{cv.contrast}</span>
                        <span>{contrast}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        value={contrast}
                        onChange={(e) => setContrast(Number(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold text-[var(--muted-foreground)] mb-1">
                        <span>{cv.saturation}</span>
                        <span>{saturation}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        value={saturation}
                        onChange={(e) => setSaturation(Number(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold text-[var(--muted-foreground)] mb-1">
                        <span>{cv.sepia}</span>
                        <span>{sepia}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sepia}
                        onChange={(e) => setSepia(Number(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setBrightness(100);
                          setContrast(100);
                          setSaturation(100);
                          setSepia(0);
                        }}
                        className="flex-1 py-3 px-4 rounded-xl border border-[var(--border)] text-sm font-semibold hover:bg-[var(--muted)] transition flex items-center justify-center gap-1.5"
                      >
                        <RotateCcw className="h-4 w-4" />
                        {cv.resetFilters}
                      </button>
                      <button
                        type="button"
                        onClick={() => downloadCanvasBlob(`Navorika_Edited_${Date.now()}.png`, 'image/png')}
                        disabled={isProcessing}
                        className={buttonClass}
                      >
                        <Download className="h-4 w-4" />
                        {cv.downloadEdited}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* 9. social-media-resizer Controls */}
            {slug === 'social-media-resizer' && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-400 p-8 text-sm font-semibold hover:bg-indigo-500/5 transition"
                >
                  <Upload className="h-5 w-5 text-indigo-500" />
                  {file ? file.name : cm.uploadPrompt}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

                {file && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[var(--muted-foreground)] uppercase mb-1.5">{cv.socialPlatform}</label>
                      <select
                        value={socialPlatformId}
                        onChange={(e) => {
                          setSocialPlatformId(e.target.value);
                          setSocialFormatIdx(0);
                        }}
                        className={fieldClass}
                      >
                        {SOCIAL_PRESETS.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[var(--muted-foreground)] uppercase mb-1.5">{cv.socialFormat}</label>
                      <select
                        value={socialFormatIdx}
                        onChange={(e) => setSocialFormatIdx(Number(e.target.value))}
                        className={fieldClass}
                      >
                        {(SOCIAL_PRESETS.find((p) => p.id === socialPlatformId) || SOCIAL_PRESETS[0]).formats.map((f, i) => (
                          <option key={f.name} value={i}>
                            {f.name} ({f.w}×{f.h})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[var(--muted-foreground)] uppercase mb-1.5">{cv.socialFormat}</label>
                        <select
                          value={fitMode}
                          onChange={(e) => setFitMode(e.target.value as any)}
                          className={fieldClass}
                        >
                          <option value="cover">{cv.fitModeCover}</option>
                          <option value="contain">{cv.fitModeContain}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[var(--muted-foreground)] uppercase mb-1.5">{cv.backgroundColor}</label>
                        <input
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="w-full h-10 p-1 rounded-xl border border-[var(--border)] cursor-pointer"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        downloadCanvasBlob(
                          `Navorika_Social_${socialPlatformId}_${Date.now()}.png`,
                          'image/png'
                        )
                      }
                      disabled={isProcessing}
                      className={buttonClass}
                    >
                      <Download className="h-4 w-4" />
                      {cv.downloadSocial}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* 10. svg-dimensions-checker Controls */}
            {slug === 'svg-dimensions-checker' && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-400 p-6 text-sm font-semibold hover:bg-indigo-500/5 transition"
                >
                  <FileCode className="h-5 w-5 text-indigo-500" />
                  {svgFileName ? svgFileName : cv.uploadSvg}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".svg,image/svg+xml"
                  className="hidden"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      const f = e.target.files[0];
                      setSvgFileName(f.name);
                      setSvgMarkup(await f.text());
                    }
                  }}
                />
                <div>
                  <label className="block text-xs font-bold text-[var(--muted-foreground)] uppercase mb-1.5">{cv.pasteSvg}</label>
                  <textarea
                    rows={6}
                    value={svgMarkup}
                    onChange={(e) => setSvgMarkup(e.target.value)}
                    className={`${fieldClass} font-mono text-xs`}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!svgResult || !svgResult.valid) return;
                      const rows = [
                        [cv.declaredWidth, svgResult.declaredWidth !== null ? `${svgResult.declaredWidth} ${svgResult.declaredWidthUnit}` : '-'],
                        [cv.declaredHeight, svgResult.declaredHeight !== null ? `${svgResult.declaredHeight} ${svgResult.declaredHeightUnit}` : '-'],
                        [cv.pixelEquivalent, svgResult.widthInPixels !== null ? `${svgResult.widthInPixels} × ${svgResult.heightInPixels} px` : '-'],
                        [cv.viewBox, svgResult.viewBox || '-'],
                        [cv.aspectRatio, svgResult.aspectRatioString || '-'],
                      ];
                      const csv = rowsToCsv(rows);
                      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `svg-dimensions-${Date.now()}.csv`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className={buttonClass}
                  >
                    <Download className="h-4 w-4" />
                    {d.ui.result}
                  </button>
                </div>
              </div>
            )}

            {/* 11. upscale-image Controls */}
            {slug === 'upscale-image' && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-400 p-8 text-sm font-semibold hover:bg-indigo-500/5 transition"
                >
                  <Upload className="h-5 w-5 text-indigo-500" />
                  {file ? file.name : cv.uploadUpscalePrompt}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

                {file && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[var(--muted-foreground)] uppercase mb-1.5">{cv.upscaleFactor}</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[2, 4, 8].map((mult) => (
                          <button
                            key={mult}
                            type="button"
                            onClick={() => setUpscaleMultiplier(mult)}
                            className={`py-3 rounded-xl border text-sm font-bold transition ${
                              upscaleMultiplier === mult
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)]'
                            }`}
                          >
                            {mult}×
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        downloadCanvasBlob(
                          `Navorika_Enlarged_${upscaleMultiplier}x_${Date.now()}.png`,
                          'image/png'
                        )
                      }
                      disabled={isProcessing}
                      className={buttonClass}
                    >
                      <Download className="h-4 w-4" />
                      {cv.downloadUpscaled}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* 12. watermark-image Controls */}
            {slug === 'watermark-image' && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-400 p-8 text-sm font-semibold hover:bg-indigo-500/5 transition"
                >
                  <Upload className="h-5 w-5 text-indigo-500" />
                  {file ? file.name : cm.uploadPrompt}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

                {file && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[var(--muted-foreground)] uppercase mb-1.5">{cv.watermarkText}</label>
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold text-[var(--muted-foreground)] mb-1">
                        <span>{cv.opacity}</span>
                        <span>{Math.round(watermarkOpacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.05"
                        value={watermarkOpacity}
                        onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[var(--muted-foreground)] uppercase mb-1.5">{cv.watermarkPosition}</label>
                        <select
                          value={watermarkPos}
                          onChange={(e) => setWatermarkPos(e.target.value as any)}
                          className={fieldClass}
                        >
                          <option value="top-left">{cv.posTopLeft}</option>
                          <option value="top-right">{cv.posTopRight}</option>
                          <option value="bottom-left">{cv.posBottomLeft}</option>
                          <option value="bottom-right">{cv.posBottomRight}</option>
                          <option value="center">{cv.posCenter}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[var(--muted-foreground)] uppercase mb-1.5">{cv.watermarkColor}</label>
                        <input
                          type="color"
                          value={watermarkColor}
                          onChange={(e) => setWatermarkColor(e.target.value)}
                          className="w-full h-10 p-1 rounded-xl border border-[var(--border)] cursor-pointer"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        downloadCanvasBlob(
                          `Navorika_Watermarked_${Date.now()}.png`,
                          'image/png'
                        )
                      }
                      disabled={isProcessing}
                      className={buttonClass}
                    >
                      <Download className="h-4 w-4" />
                      {cv.downloadWatermarked}
                    </button>
                  </div>
                )}
              </>
            )}

            {errorMsg && <p className="text-xs text-red-500 font-semibold">{errorMsg}</p>}
          </div>
        </div>

        {/* Canvas & Preview Viewport Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] flex items-center gap-1.5">
                <FileImage className="h-4 w-4 text-indigo-500" />
                {cm.dimensions}
              </span>
              {file && (
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreviewUrl('');
                    setMetaDetails(null);
                    setPickedColor(null);
                  }}
                  className="text-xs text-red-500 hover:text-red-600 font-semibold flex items-center gap-1"
                >
                  <X className="h-3.5 w-3.5" />
                  {cm.removeImage}
                </button>
              )}
            </div>

            {/* Collage preview grid */}
            {slug === 'photo-collage-maker' ? (
              <div>
                {collageItems.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {collageItems.map((item, index) => (
                      <div key={`${item.file.name}-${index}`} className="relative aspect-square">
                        <img
                          src={item.url}
                          alt={item.file.name}
                          className="w-full h-full object-cover rounded-xl border border-[var(--border)]"
                        />
                        <button
                          type="button"
                          onClick={() => removeCollageItem(index)}
                          className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full hover:bg-black"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center text-xs text-[var(--muted-foreground)] font-semibold">
                    {cv.collagePrompt}
                  </div>
                )}
              </div>
            ) : slug === 'svg-dimensions-checker' ? (
              <div className="p-4 rounded-2xl bg-[var(--muted)] border border-[var(--border)]">
                <div
                  className="w-full flex items-center justify-center p-6 bg-white dark:bg-slate-950 rounded-xl"
                  dangerouslySetInnerHTML={{ __html: svgMarkup }}
                />
              </div>
            ) : slug === 'image-metadata-viewer' ? (
              <div className="p-6 text-center">
                {file ? (
                  <img
                    src={previewUrl}
                    alt={file.name}
                    className="max-h-64 mx-auto object-contain rounded-xl shadow-sm"
                  />
                ) : (
                  <p className="text-xs text-[var(--muted-foreground)] font-semibold">{cv.chooseImage}</p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[320px] bg-slate-50 dark:bg-slate-950 rounded-2xl border border-[var(--border)] p-4 overflow-hidden">
                {previewUrl ? (
                  <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    className={`max-w-full max-h-[460px] object-contain shadow-sm rounded-lg ${
                      slug === 'image-color-picker' ? 'cursor-crosshair' : ''
                    }`}
                  />
                ) : (
                  <div className="text-center text-xs text-[var(--muted-foreground)] font-semibold p-8">
                    {cv.awaitingTransparent}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results Summary Definition List */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)] mb-4 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-indigo-500" />
              {d.ui.result}
            </h3>
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {dlRows.map(([label, value]) => (
                <div key={label} className="p-3 rounded-2xl bg-[var(--muted)] border border-[var(--border)]">
                  <dt className="text-xs font-semibold text-[var(--muted-foreground)]">{label}</dt>
                  <dd className="mt-1 font-mono text-sm font-bold text-[var(--foreground)] truncate">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Editorial Content: How It Works & FAQs */}
      <div className="mt-12 space-y-6">
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">{d.ui.how}</h2>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{t.how}</p>
        </section>

        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">{d.ui.limits}</h2>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{t.limits}</p>
        </section>

        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">{d.ui.faq}</h2>
          <div className="space-y-4">
            <div className="rounded-2xl border border-[var(--border)] p-4 bg-[var(--background)]">
              <h3 className="text-sm font-bold text-[var(--foreground)]">{t.question}</h3>
              <p className="mt-1.5 text-xs text-[var(--muted-foreground)] leading-relaxed">{t.answer}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
