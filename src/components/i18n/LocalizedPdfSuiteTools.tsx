'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import {
  FileText,
  Upload,
  Download,
  FileImage,
  Hash,
  Stamp,
  Crop,
  PenTool,
  Eraser,
  FileCode,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import ResultActions from '@/components/ui/ResultActions';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';
import { decodeWebpToPng } from '@/lib/images/browser';
import { fieldClass, buttonClass } from './ToolControls';

export type PdfSuiteToolSlug =
  | 'add-image-to-pdf'
  | 'add-page-numbers'
  | 'add-watermark'
  | 'crop-pdf'
  | 'extract-pdf-text'
  | 'heic-to-pdf'
  | 'jpg-to-pdf'
  | 'markdown-to-pdf'
  | 'pdf-to-image'
  | 'pdf-to-jpg'
  | 'sign-pdf'
  | 'webp-to-pdf';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

async function loadPdfJs() {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
  return pdfjs;
}

export default function LocalizedPdfSuiteTools({
  slug,
  locale,
  dictionary,
}: {
  slug: PdfSuiteToolSlug;
  locale: Locale;
  dictionary: Dictionary;
}) {
  const d = dictionary;
  const ui = d.ui;
  const p = d.pdfTools;

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState<string>('processed.pdf');

  // Generic PDF File state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Add Image
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [addImagePage, setAddImagePage] = useState<number>(1);
  const [imageWidthPercent, setImageWidthPercent] = useState<number>(30);
  const [imagePosition, setImagePosition] = useState<string>('center');
  const imageInputRef = useRef<HTMLInputElement>(null);

  // 2. Add Page Numbers
  const [startNumber, setStartNumber] = useState<number>(1);
  const [numPosition, setNumPosition] = useState<string>('bottom-center');
  const [numberedPagesResult, setNumberedPagesResult] = useState<number | null>(null);

  // 3. Add Watermark
  const [watermarkText, setWatermarkText] = useState<string>(p.watermark.sampleText);
  const [watermarkResult, setWatermarkResult] = useState<number | null>(null);

  // 4. Crop PDF
  const [cropTop, setCropTop] = useState<number>(36);
  const [cropBottom, setCropBottom] = useState<number>(36);
  const [cropLeft, setCropLeft] = useState<number>(36);
  const [cropRight, setCropRight] = useState<number>(36);
  const [cropResult, setCropResult] = useState<number | null>(null);

  // 5. Extract Text
  const [extractedText, setExtractedText] = useState<string>('');
  const [txtDownloadUrl, setTxtDownloadUrl] = useState<string | null>(null);

  // 6. Sign PDF
  const [signPage, setSignPage] = useState<number>(1);
  const [signPosX, setSignPosX] = useState<number>(50);
  const [signPosY, setSignPosY] = useState<number>(150);
  const [hasSignature, setHasSignature] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 7 & 8. Images to PDF (JPG, WebP)
  const [batchImages, setBatchImages] = useState<File[]>([]);
  const batchImagesInputRef = useRef<HTMLInputElement>(null);

  // 9. HEIC to PDF
  const [heicFile, setHeicFile] = useState<File | null>(null);
  const heicInputRef = useRef<HTMLInputElement>(null);

  // 10. Markdown to PDF
  const [markdownInput, setMarkdownInput] = useState<string>('# Document Title\n\nThis is a sample paragraph formatted for PDF export.\n\n- First point\n- Second point');
  const mdFileInputRef = useRef<HTMLInputElement>(null);

  // 11 & 12. PDF to Image (PNG / JPG)
  const [targetRenderPage, setTargetRenderPage] = useState<number>(1);
  const [renderFormat, setRenderFormat] = useState<'png' | 'jpeg'>(slug === 'pdf-to-jpg' ? 'jpeg' : 'png');
  const [renderScale, setRenderScale] = useState<number>(2);
  const [renderQuality, setRenderQuality] = useState<number>(0.92);
  const [renderedImageUrl, setRenderedImageUrl] = useState<string | null>(null);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      if (txtDownloadUrl) URL.revokeObjectURL(txtDownloadUrl);
      if (renderedImageUrl) URL.revokeObjectURL(renderedImageUrl);
    };
  }, [downloadUrl, txtDownloadUrl, renderedImageUrl]);

  // Load PDF file
  const handlePdfUpload = async (file: File | undefined) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError(p.common.statusError);
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setError(p.common.fileSizeExceeded);
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { updateMetadata: false });
      const pages = doc.getPageCount();
      setPdfFile(file);
      setPageCount(pages);
      setAddImagePage(1);
      setSignPage(1);
      setTargetRenderPage(1);
    } catch {
      setError(p.common.statusError);
      setPdfFile(null);
      setPageCount(0);
    } finally {
      setBusy(false);
    }
  };

  // 1. Execute Add Image to PDF
  const handleAddImage = async () => {
    if (!pdfFile || !imageFile) return;
    setBusy(true);
    setError(null);
    try {
      const pdf = await PDFDocument.load(await pdfFile.arrayBuffer());
      const imgBytes = imageFile.type === 'image/webp' ? await decodeWebpToPng(imageFile) : await imageFile.arrayBuffer();
      const image = imageFile.type === 'image/jpeg' ? await pdf.embedJpg(imgBytes) : await pdf.embedPng(imgBytes);

      const targetIdx = Math.min(Math.max(0, addImagePage - 1), pdf.getPageCount() - 1);
      const page = pdf.getPages()[targetIdx];
      const { width: pWidth, height: pHeight } = page.getSize();
      const margin = 24;

      const reqWidth = pWidth * (imageWidthPercent / 100);
      const reqHeight = reqWidth * (image.height / image.width);
      const maxH = pHeight - margin * 2;
      const scale = reqHeight > maxH ? maxH / reqHeight : 1;
      const w = reqWidth * scale;
      const h = reqHeight * scale;

      let x = (pWidth - w) / 2;
      let y = (pHeight - h) / 2;
      if (imagePosition === 'top-left') { x = margin; y = pHeight - h - margin; }
      else if (imagePosition === 'top-right') { x = pWidth - w - margin; y = pHeight - h - margin; }
      else if (imagePosition === 'bottom-left') { x = margin; y = margin; }
      else if (imagePosition === 'bottom-right') { x = pWidth - w - margin; y = margin; }

      page.drawImage(image, { x: Math.max(0, x), y: Math.max(0, y), width: w, height: h });

      const pdfBytes = await pdf.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadFilename(`image_added_${pdfFile.name}`);
    } catch {
      setError(p.common.statusError);
    } finally {
      setBusy(false);
    }
  };

  // 2. Execute Add Page Numbers
  const handleAddPageNumbers = async () => {
    if (!pdfFile) return;
    setBusy(true);
    setError(null);
    try {
      const pdf = await PDFDocument.load(await pdfFile.arrayBuffer());
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();
      const fontSize = 10;
      const color = rgb(0.2, 0.25, 0.35);

      pages.forEach((page, idx) => {
        const { width, height } = page.getSize();
        const numText = `${startNumber + idx}`;
        const textWidth = font.widthOfTextAtSize(numText, fontSize);
        const margin = 30;

        let x = (width - textWidth) / 2;
        let y = margin;

        if (numPosition === 'bottom-right') { x = width - textWidth - margin; y = margin; }
        else if (numPosition === 'bottom-left') { x = margin; y = margin; }
        else if (numPosition === 'top-center') { x = (width - textWidth) / 2; y = height - margin; }
        else if (numPosition === 'top-right') { x = width - textWidth - margin; y = height - margin; }
        else if (numPosition === 'top-left') { x = margin; y = height - margin; }

        page.drawText(numText, { x, y, size: fontSize, font, color });
      });

      const pdfBytes = await pdf.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadFilename(`numbered_${pdfFile.name}`);
      setNumberedPagesResult(pages.length);
    } catch {
      setError(p.common.statusError);
    } finally {
      setBusy(false);
    }
  };

  // 3. Execute Add Watermark
  const handleAddWatermark = async () => {
    if (!pdfFile || !watermarkText.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const pdf = await PDFDocument.load(await pdfFile.arrayBuffer());
      const font = await pdf.embedFont(StandardFonts.HelveticaBold);
      const pages = pdf.getPages();
      const fontSize = 48;
      const text = watermarkText.trim();
      const textWidth = font.widthOfTextAtSize(text, fontSize);

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        page.drawText(text, {
          x: (width - textWidth * 0.707) / 2,
          y: (height - textWidth * 0.707) / 2,
          size: fontSize,
          font,
          color: rgb(0.7, 0.75, 0.8),
          opacity: 0.35,
          rotate: degrees(45),
        });
      });

      const pdfBytes = await pdf.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadFilename(`watermarked_${pdfFile.name}`);
      setWatermarkResult(pages.length);
    } catch {
      setError(p.common.statusError);
    } finally {
      setBusy(false);
    }
  };

  // 4. Execute Crop PDF
  const handleCropPdf = async () => {
    if (!pdfFile) return;
    setBusy(true);
    setError(null);
    try {
      const pdf = await PDFDocument.load(await pdfFile.arrayBuffer());
      const pages = pdf.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const newX = Math.max(0, cropLeft);
        const newY = Math.max(0, cropBottom);
        const newWidth = Math.max(10, width - cropLeft - cropRight);
        const newHeight = Math.max(10, height - cropTop - cropBottom);

        page.setCropBox(newX, newY, newWidth, newHeight);
        page.setMediaBox(newX, newY, newWidth, newHeight);
      });

      const pdfBytes = await pdf.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadFilename(`cropped_${pdfFile.name}`);
      setCropResult(pages.length);
    } catch {
      setError(p.common.statusError);
    } finally {
      setBusy(false);
    }
  };

  // 5. Execute Extract PDF Text
  const handleExtractText = async () => {
    if (!pdfFile) return;
    setBusy(true);
    setError(null);
    try {
      const pdfjs = await loadPdfJs();
      const data = new Uint8Array(await pdfFile.arrayBuffer());
      const loadingTask = pdfjs.getDocument({ data });
      const doc = await loadingTask.promise;
      let fullText = '';

      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const textContent = await page.getTextContent();
        const pageStr = textContent.items
          .map((item) => ('str' in item ? (item as { str: string }).str : ''))
          .join(' ');
        fullText += `--- Page ${i} ---\n${pageStr.trim()}\n\n`;
      }

      setExtractedText(fullText.trim());
      const txtBlob = new Blob([fullText.trim()], { type: 'text/plain;charset=utf-8' });
      setTxtDownloadUrl(URL.createObjectURL(txtBlob));
    } catch {
      setError(p.common.statusError);
    } finally {
      setBusy(false);
    }
  };

  // 6. Sign PDF Canvas Handling
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    setHasSignature(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1e293b';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleApplySignature = async () => {
    const canvas = canvasRef.current;
    if (!pdfFile || !canvas || !hasSignature) return;
    setBusy(true);
    setError(null);
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const pngBytes = await fetch(dataUrl).then((res) => res.arrayBuffer());

      const pdf = await PDFDocument.load(await pdfFile.arrayBuffer());
      const signatureImg = await pdf.embedPng(pngBytes);

      const targetIdx = Math.min(Math.max(0, signPage - 1), pdf.getPageCount() - 1);
      const page = pdf.getPages()[targetIdx];

      const sigWidth = 140;
      const sigHeight = (signatureImg.height / signatureImg.width) * sigWidth;

      page.drawImage(signatureImg, {
        x: Math.max(0, signPosX),
        y: Math.max(0, signPosY),
        width: sigWidth,
        height: sigHeight,
      });

      const pdfBytes = await pdf.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadFilename(`signed_${pdfFile.name}`);
    } catch {
      setError(p.common.statusError);
    } finally {
      setBusy(false);
    }
  };

  // 7 & 8. Execute Images to PDF (JPG or WebP)
  const handleBatchImagesToPdf = async () => {
    if (batchImages.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const pdf = await PDFDocument.create();

      for (const imgFile of batchImages) {
        const isWebp = imgFile.type === 'image/webp' || imgFile.name.endsWith('.webp');
        const isJpg = imgFile.type === 'image/jpeg' || imgFile.name.endsWith('.jpg') || imgFile.name.endsWith('.jpeg');
        const imgBytes = isWebp ? await decodeWebpToPng(imgFile) : await imgFile.arrayBuffer();

        const image = isJpg ? await pdf.embedJpg(imgBytes) : await pdf.embedPng(imgBytes);
        const page = pdf.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }

      const pdfBytes = await pdf.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadFilename(`images_converted_${Date.now()}.pdf`);
    } catch {
      setError(p.common.statusError);
    } finally {
      setBusy(false);
    }
  };

  // 9. Execute HEIC to PDF
  const handleHeicToPdf = async () => {
    if (!heicFile) return;
    setBusy(true);
    setError(null);
    try {
      const heic = (await import('heic2any')).default;
      const converted = await heic({ blob: heicFile, toType: 'image/png' });
      const source: Blob = Array.isArray(converted) ? converted[0] : converted;

      const imgBuffer = await source.arrayBuffer();
      const pdf = await PDFDocument.create();
      const image = await pdf.embedPng(imgBuffer);
      const page = pdf.addPage([image.width, image.height]);
      page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });

      const pdfBytes = await pdf.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadFilename(`${heicFile.name.replace(/\.[^.]+$/, '')}.pdf`);
    } catch {
      setError(p.common.statusError);
    } finally {
      setBusy(false);
    }
  };

  // 10. Execute Markdown to PDF
  const handleMarkdownToPdf = async () => {
    if (!markdownInput.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const pdf = await PDFDocument.create();
      const regular = await pdf.embedFont(StandardFonts.Helvetica);
      const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
      let page = pdf.addPage([595, 842]);
      let y = 790;

      for (const raw of markdownInput.split(/\r?\n/)) {
        const heading = /^#{1,5}\s/.test(raw);
        const size = heading ? 16 : 11;
        let remaining = raw.replace(/^#{1,5}\s/, '').replace(/\*\*|__/g, '').replace(/[^\x20-\x7e\u00a0-\u00ff]/g, '?');

        if (!remaining) {
          y -= 10;
          continue;
        }

        while (remaining.length) {
          let part = remaining.slice(0, heading ? 52 : 84);
          if (remaining.length > part.length) {
            const j = part.lastIndexOf(' ');
            if (j > 25) part = part.slice(0, j);
          }
          if (y < 55) {
            page = pdf.addPage([595, 842]);
            y = 790;
          }
          page.drawText(part, { x: 40, y, size, font: heading ? bold : regular, color: rgb(0.1, 0.15, 0.25) });
          y -= size * 1.6;
          remaining = remaining.slice(part.length).trimStart();
        }
      }

      const pdfBytes = await pdf.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadFilename('markdown_document.pdf');
    } catch {
      setError(p.common.statusError);
    } finally {
      setBusy(false);
    }
  };

  // 11 & 12. Execute PDF to Image (PNG / JPG)
  const handlePdfToImage = async () => {
    if (!pdfFile) return;
    setBusy(true);
    setError(null);
    try {
      const pdfjs = await loadPdfJs();
      const data = new Uint8Array(await pdfFile.arrayBuffer());
      const loadingTask = pdfjs.getDocument({ data });
      const doc = await loadingTask.promise;

      const pageIdx = Math.min(Math.max(1, targetRenderPage), doc.numPages);
      const page = await doc.getPage(pageIdx);
      const viewport = page.getViewport({ scale: renderScale });

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas unavailable');

      // For JPEG format, fill white background to prevent black/transparent borders
      if (renderFormat === 'jpeg' || slug === 'pdf-to-jpg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, viewport.width, viewport.height);
      }

      const renderContext = { canvasContext: ctx, viewport } as unknown as Parameters<typeof page.render>[0];
      await page.render(renderContext).promise;

      const mimeType = slug === 'pdf-to-jpg' || renderFormat === 'jpeg' ? 'image/jpeg' : 'image/png';
      const ext = mimeType === 'image/jpeg' ? 'jpg' : 'png';

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), mimeType, renderQuality)
      );
      if (!blob) throw new Error('Image generation failed');

      const url = URL.createObjectURL(blob);
      setRenderedImageUrl(url);
      setDownloadUrl(url);
      setDownloadFilename(`${pdfFile.name.replace(/\.[^.]+$/, '')}_page_${pageIdx}.${ext}`);
    } catch {
      setError(p.common.statusError);
    } finally {
      setBusy(false);
    }
  };

  // Dynamic summary rows
  const dlRows = useMemo(() => {
    const rows: [string, string][] = [];
    if (slug === 'add-image-to-pdf') {
      rows.push([p.addImage.pdfDocument, pdfFile ? pdfFile.name : p.common.statusReady]);
      rows.push([p.addImage.targetPage, `${addImagePage}`]);
      rows.push([p.common.status, downloadUrl ? p.common.statusSuccess : p.common.statusReady]);
    } else if (slug === 'add-page-numbers') {
      rows.push([p.common.pages, `${pageCount}`]);
      rows.push([p.pageNumbers.appliedPages, numberedPagesResult ? `${numberedPagesResult}` : `${pageCount}`]);
      rows.push([p.common.status, downloadUrl ? p.common.statusSuccess : p.common.statusReady]);
    } else if (slug === 'add-watermark') {
      rows.push([p.watermark.watermarkText, watermarkText]);
      rows.push([p.watermark.stampedPages, watermarkResult ? `${watermarkResult}` : `${pageCount}`]);
      rows.push([p.common.status, downloadUrl ? p.common.statusSuccess : p.common.statusReady]);
    } else if (slug === 'crop-pdf') {
      rows.push([p.common.pages, `${pageCount}`]);
      rows.push([p.crop.croppedPages, cropResult ? `${cropResult}` : `${pageCount}`]);
      rows.push([p.common.status, downloadUrl ? p.common.statusSuccess : p.common.statusReady]);
    } else if (slug === 'extract-pdf-text') {
      rows.push([p.common.pages, `${pageCount}`]);
      rows.push([p.extractText.characterCount, `${extractedText.length}`]);
      rows.push([p.common.status, extractedText ? p.common.statusSuccess : p.common.statusReady]);
    } else if (slug === 'sign-pdf') {
      rows.push([p.sign.targetPage, `${signPage}`]);
      rows.push([p.common.status, downloadUrl ? p.common.statusSuccess : p.common.statusReady]);
    } else if (slug === 'jpg-to-pdf' || slug === 'webp-to-pdf') {
      rows.push([p.imageToPdf.imagesSelected, `${batchImages.length}`]);
      rows.push([p.common.status, downloadUrl ? p.common.statusSuccess : p.common.statusReady]);
    } else if (slug === 'heic-to-pdf') {
      rows.push([p.converters.selectFile, heicFile ? heicFile.name : p.common.statusReady]);
      rows.push([p.common.status, downloadUrl ? p.common.statusSuccess : p.common.statusReady]);
    } else if (slug === 'markdown-to-pdf') {
      rows.push([p.common.status, downloadUrl ? p.common.statusSuccess : p.common.statusReady]);
    } else if (slug === 'pdf-to-image' || slug === 'pdf-to-jpg') {
      rows.push([p.pdfToImage.selectPage, `${targetRenderPage}`]);
      rows.push([p.pdfToImage.format, slug === 'pdf-to-jpg' ? 'JPG' : renderFormat.toUpperCase()]);
      rows.push([p.common.status, renderedImageUrl ? p.common.statusSuccess : p.common.statusReady]);
    }
    return rows;
  }, [
    slug,
    pdfFile,
    pageCount,
    addImagePage,
    downloadUrl,
    numberedPagesResult,
    watermarkText,
    watermarkResult,
    cropResult,
    extractedText,
    signPage,
    batchImages,
    heicFile,
    targetRenderPage,
    renderFormat,
    renderedImageUrl,
    p,
  ]);

  const copySummary = useMemo(() => {
    const title = (d.tools as Record<string, { title: string }>)[slug]?.title || slug;
    return `${title}\n${dlRows.map(([k, v]) => `${k}: ${v}`).join('\n')}`;
  }, [d.tools, slug, dlRows]);

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-8">
      {/* 1. Add Image to PDF */}
      {slug === 'add-image-to-pdf' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">{p.addImage.heading}</h2>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-semibold">{p.addImage.choosePdf}</p>
              {!pdfFile ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-400 p-6 text-sm font-semibold hover:bg-indigo-500/5"
                >
                  <Upload className="h-5 w-5 text-indigo-500" />
                  {p.addImage.choosePdf}
                </button>
              ) : (
                <div className="flex items-center justify-between rounded-xl bg-[var(--muted)] p-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{pdfFile.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{pageCount} {p.common.pages.toLowerCase()}</p>
                  </div>
                  <button type="button" onClick={() => setPdfFile(null)} className="p-1 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => void handlePdfUpload(e.target.files?.[0])}
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold">{p.addImage.chooseImage}</p>
              {!imageFile ? (
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-400 p-6 text-sm font-semibold hover:bg-indigo-500/5"
                >
                  <FileImage className="h-5 w-5 text-indigo-500" />
                  {p.addImage.chooseImage}
                </button>
              ) : (
                <div className="flex items-center justify-between rounded-xl bg-[var(--muted)] p-4">
                  <p className="truncate font-semibold">{imageFile.name}</p>
                  <button type="button" onClick={() => setImageFile(null)} className="p-1 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-sm font-semibold">
              {p.addImage.targetPage}
              <input
                type="number"
                min={1}
                max={Math.max(1, pageCount)}
                value={addImagePage}
                disabled={!pdfFile}
                onChange={(e) => setAddImagePage(Math.min(Math.max(1, Number(e.target.value)), Math.max(1, pageCount)))}
                className={fieldClass}
              />
            </label>
            <label className="block text-sm font-semibold">
              {p.addImage.imageWidth}
              <select
                value={imageWidthPercent}
                onChange={(e) => setImageWidthPercent(Number(e.target.value))}
                className={fieldClass}
              >
                <option value={15}>15%</option>
                <option value={30}>30%</option>
                <option value={50}>50%</option>
                <option value={75}>75%</option>
              </select>
            </label>
            <label className="block text-sm font-semibold">
              {p.addImage.position}
              <select
                value={imagePosition}
                onChange={(e) => setImagePosition(e.target.value)}
                className={fieldClass}
              >
                <option value="center">{p.addImage.center}</option>
                <option value="top-left">{p.addImage.topLeft}</option>
                <option value="top-right">{p.addImage.topRight}</option>
                <option value="bottom-left">{p.addImage.bottomLeft}</option>
                <option value="bottom-right">{p.addImage.bottomRight}</option>
              </select>
            </label>
          </div>

          <button
            type="button"
            disabled={!pdfFile || !imageFile || busy}
            onClick={handleAddImage}
            className={`${buttonClass} w-full`}
          >
            {busy ? p.addImage.processing : p.addImage.addAction}
          </button>
        </div>
      )}

      {/* 2. Add Page Numbers */}
      {slug === 'add-page-numbers' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">{p.pageNumbers.heading}</h2>

          {!pdfFile ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-400 p-8 text-sm font-semibold hover:bg-indigo-500/5"
            >
              <Hash className="h-6 w-6 text-indigo-500" />
              {p.common.selectFile}
            </button>
          ) : (
            <div className="flex items-center justify-between rounded-xl bg-[var(--muted)] p-4">
              <div>
                <p className="font-semibold">{pdfFile.name}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{pageCount} {p.common.pages.toLowerCase()}</p>
              </div>
              <button type="button" onClick={() => setPdfFile(null)} className="p-1 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => void handlePdfUpload(e.target.files?.[0])}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">
              {p.pageNumbers.startNumber}
              <input
                type="number"
                min={1}
                value={startNumber}
                onChange={(e) => setStartNumber(Math.max(1, Number(e.target.value)))}
                className={fieldClass}
              />
            </label>
            <label className="block text-sm font-semibold">
              {p.pageNumbers.position}
              <select
                value={numPosition}
                onChange={(e) => setNumPosition(e.target.value)}
                className={fieldClass}
              >
                <option value="bottom-center">{p.pageNumbers.bottomCenter}</option>
                <option value="bottom-right">{p.pageNumbers.bottomRight}</option>
                <option value="bottom-left">{p.pageNumbers.bottomLeft}</option>
                <option value="top-center">{p.pageNumbers.topCenter}</option>
                <option value="top-right">{p.pageNumbers.topRight}</option>
                <option value="top-left">{p.pageNumbers.topLeft}</option>
              </select>
            </label>
          </div>

          <button
            type="button"
            disabled={!pdfFile || busy}
            onClick={handleAddPageNumbers}
            className={`${buttonClass} w-full`}
          >
            {busy ? p.common.status : p.pageNumbers.addAction}
          </button>
        </div>
      )}

      {/* 3. Add Watermark */}
      {slug === 'add-watermark' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">{p.watermark.heading}</h2>

          {!pdfFile ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-400 p-8 text-sm font-semibold hover:bg-indigo-500/5"
            >
              <Stamp className="h-6 w-6 text-indigo-500" />
              {p.common.selectFile}
            </button>
          ) : (
            <div className="flex items-center justify-between rounded-xl bg-[var(--muted)] p-4">
              <div>
                <p className="font-semibold">{pdfFile.name}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{pageCount} {p.common.pages.toLowerCase()}</p>
              </div>
              <button type="button" onClick={() => setPdfFile(null)} className="p-1 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => void handlePdfUpload(e.target.files?.[0])}
          />

          <label className="block text-sm font-semibold">
            {p.watermark.watermarkText}
            <input
              type="text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              className={fieldClass}
            />
          </label>

          <button
            type="button"
            disabled={!pdfFile || !watermarkText.trim() || busy}
            onClick={handleAddWatermark}
            className={`${buttonClass} w-full`}
          >
            {busy ? p.common.status : p.watermark.addAction}
          </button>
        </div>
      )}

      {/* 4. Crop PDF */}
      {slug === 'crop-pdf' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">{p.crop.heading}</h2>

          {!pdfFile ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-400 p-8 text-sm font-semibold hover:bg-indigo-500/5"
            >
              <Crop className="h-6 w-6 text-indigo-500" />
              {p.common.selectFile}
            </button>
          ) : (
            <div className="flex items-center justify-between rounded-xl bg-[var(--muted)] p-4">
              <div>
                <p className="font-semibold">{pdfFile.name}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{pageCount} {p.common.pages.toLowerCase()}</p>
              </div>
              <button type="button" onClick={() => setPdfFile(null)} className="p-1 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => void handlePdfUpload(e.target.files?.[0])}
          />

          <div className="grid gap-4 sm:grid-cols-4">
            <label className="block text-sm font-semibold">
              {p.crop.topMargin}
              <input
                type="number"
                min={0}
                value={cropTop}
                onChange={(e) => setCropTop(Math.max(0, Number(e.target.value)))}
                className={fieldClass}
              />
            </label>
            <label className="block text-sm font-semibold">
              {p.crop.bottomMargin}
              <input
                type="number"
                min={0}
                value={cropBottom}
                onChange={(e) => setCropBottom(Math.max(0, Number(e.target.value)))}
                className={fieldClass}
              />
            </label>
            <label className="block text-sm font-semibold">
              {p.crop.leftMargin}
              <input
                type="number"
                min={0}
                value={cropLeft}
                onChange={(e) => setCropLeft(Math.max(0, Number(e.target.value)))}
                className={fieldClass}
              />
            </label>
            <label className="block text-sm font-semibold">
              {p.crop.rightMargin}
              <input
                type="number"
                min={0}
                value={cropRight}
                onChange={(e) => setCropRight(Math.max(0, Number(e.target.value)))}
                className={fieldClass}
              />
            </label>
          </div>

          <button
            type="button"
            disabled={!pdfFile || busy}
            onClick={handleCropPdf}
            className={`${buttonClass} w-full`}
          >
            {busy ? p.common.status : p.crop.cropAction}
          </button>
        </div>
      )}

      {/* 5. Extract PDF Text */}
      {slug === 'extract-pdf-text' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">{p.extractText.heading}</h2>

          {!pdfFile ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-400 p-8 text-sm font-semibold hover:bg-indigo-500/5"
            >
              <FileText className="h-6 w-6 text-indigo-500" />
              {p.common.selectFile}
            </button>
          ) : (
            <div className="flex items-center justify-between rounded-xl bg-[var(--muted)] p-4">
              <div>
                <p className="font-semibold">{pdfFile.name}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{pageCount} {p.common.pages.toLowerCase()}</p>
              </div>
              <button type="button" onClick={() => { setPdfFile(null); setExtractedText(''); }} className="p-1 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => void handlePdfUpload(e.target.files?.[0])}
          />

          <button
            type="button"
            disabled={!pdfFile || busy}
            onClick={handleExtractText}
            className={`${buttonClass} w-full`}
          >
            {busy ? p.common.status : p.extractText.extractAction}
          </button>

          {extractedText && (
            <div className="space-y-4">
              <pre className="max-h-80 overflow-y-auto whitespace-pre-wrap rounded-xl border border-[var(--border)] bg-[var(--muted)] p-4 text-xs font-mono">
                {extractedText}
              </pre>
              {txtDownloadUrl && (
                <a
                  href={txtDownloadUrl}
                  download={`${pdfFile?.name.replace(/\.[^.]+$/, '') || 'document'}.txt`}
                  className={`${buttonClass} inline-flex items-center gap-2`}
                >
                  <Download className="h-4 w-4" />
                  {p.extractText.downloadTxt}
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {/* 6. Sign PDF */}
      {slug === 'sign-pdf' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">{p.sign.heading}</h2>

          {!pdfFile ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-400 p-8 text-sm font-semibold hover:bg-indigo-500/5"
            >
              <PenTool className="h-6 w-6 text-indigo-500" />
              {p.common.selectFile}
            </button>
          ) : (
            <div className="flex items-center justify-between rounded-xl bg-[var(--muted)] p-4">
              <div>
                <p className="font-semibold">{pdfFile.name}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{pageCount} {p.common.pages.toLowerCase()}</p>
              </div>
              <button type="button" onClick={() => setPdfFile(null)} className="p-1 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => void handlePdfUpload(e.target.files?.[0])}
          />

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold">{p.sign.drawSignature}</p>
              <button
                type="button"
                onClick={clearCanvas}
                className="inline-flex items-center gap-1 text-xs text-red-500 hover:underline"
              >
                <Eraser className="h-3 w-3" />
                {p.sign.clearSignature}
              </button>
            </div>
            <canvas
              ref={canvasRef}
              width={400}
              height={140}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full max-w-md rounded-xl border-2 border-dashed border-slate-300 bg-white shadow-inner dark:border-slate-700"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-sm font-semibold">
              {p.sign.targetPage}
              <input
                type="number"
                min={1}
                max={Math.max(1, pageCount)}
                value={signPage}
                disabled={!pdfFile}
                onChange={(e) => setSignPage(Math.min(Math.max(1, Number(e.target.value)), Math.max(1, pageCount)))}
                className={fieldClass}
              />
            </label>
            <label className="block text-sm font-semibold">
              {p.sign.posX}
              <input
                type="number"
                min={0}
                value={signPosX}
                onChange={(e) => setSignPosX(Math.max(0, Number(e.target.value)))}
                className={fieldClass}
              />
            </label>
            <label className="block text-sm font-semibold">
              {p.sign.posY}
              <input
                type="number"
                min={0}
                value={signPosY}
                onChange={(e) => setSignPosY(Math.max(0, Number(e.target.value)))}
                className={fieldClass}
              />
            </label>
          </div>

          <button
            type="button"
            disabled={!pdfFile || !hasSignature || busy}
            onClick={handleApplySignature}
            className={`${buttonClass} w-full`}
          >
            {busy ? p.common.status : p.sign.signAction}
          </button>
        </div>
      )}

      {/* 7 & 8. JPG / WebP to PDF */}
      {(slug === 'jpg-to-pdf' || slug === 'webp-to-pdf') && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">{p.imageToPdf.heading}</h2>

          <div>
            <button
              type="button"
              onClick={() => batchImagesInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-400 p-8 text-sm font-semibold hover:bg-indigo-500/5"
            >
              <FileImage className="h-6 w-6 text-indigo-500" />
              {p.imageToPdf.addImages}
            </button>
            <input
              ref={batchImagesInputRef}
              type="file"
              multiple
              accept={slug === 'jpg-to-pdf' ? 'image/jpeg,.jpg,.jpeg' : 'image/webp,.webp'}
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  setBatchImages((prev) => [...prev, ...Array.from(e.target.files!)]);
                }
              }}
            />
          </div>

          {batchImages.length > 0 && (
            <div className="space-y-2">
              {batchImages.map((img, idx) => (
                <div key={`${img.name}-${idx}`} className="flex items-center justify-between rounded-xl bg-[var(--muted)] p-3 text-sm">
                  <span className="truncate font-medium">{idx + 1}. {img.name}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const copy = [...batchImages];
                        [copy[idx - 1], copy[idx]] = [copy[idx], copy[idx - 1]];
                        setBatchImages(copy);
                      }}
                      className="p-1 hover:text-indigo-500 disabled:opacity-30"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === batchImages.length - 1}
                      onClick={() => {
                        const copy = [...batchImages];
                        [copy[idx + 1], copy[idx]] = [copy[idx], copy[idx + 1]];
                        setBatchImages(copy);
                      }}
                      className="p-1 hover:text-indigo-500 disabled:opacity-30"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setBatchImages((prev) => prev.filter((_, i) => i !== idx))}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            disabled={batchImages.length === 0 || busy}
            onClick={handleBatchImagesToPdf}
            className={`${buttonClass} w-full`}
          >
            {busy ? p.common.status : p.imageToPdf.convertAction}
          </button>
        </div>
      )}

      {/* 9. HEIC to PDF */}
      {slug === 'heic-to-pdf' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">{p.converters.heading}</h2>

          {!heicFile ? (
            <button
              type="button"
              onClick={() => heicInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-400 p-8 text-sm font-semibold hover:bg-indigo-500/5"
            >
              <FileImage className="h-6 w-6 text-indigo-500" />
              {p.converters.selectFile} (HEIC / HEIF)
            </button>
          ) : (
            <div className="flex items-center justify-between rounded-xl bg-[var(--muted)] p-4">
              <span className="truncate font-semibold">{heicFile.name} ({formatBytes(heicFile.size)})</span>
              <button type="button" onClick={() => setHeicFile(null)} className="p-1 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
          <input
            ref={heicInputRef}
            type="file"
            accept=".heic,.heif,image/heic,image/heif"
            className="hidden"
            onChange={(e) => setHeicFile(e.target.files?.[0] || null)}
          />

          <button
            type="button"
            disabled={!heicFile || busy}
            onClick={handleHeicToPdf}
            className={`${buttonClass} w-full`}
          >
            {busy ? p.common.status : p.converters.convertAction}
          </button>
        </div>
      )}

      {/* 10. Markdown to PDF */}
      {slug === 'markdown-to-pdf' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">{p.converters.heading}</h2>

          <div>
            <label htmlFor="markdown-text-area" className="mb-2 block text-sm font-semibold">
              Markdown Text
            </label>
            <textarea
              id="markdown-text-area"
              rows={8}
              value={markdownInput}
              onChange={(e) => setMarkdownInput(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => mdFileInputRef.current?.click()}
              className="inline-flex items-center gap-2 text-xs text-indigo-600 hover:underline dark:text-indigo-400"
            >
              <FileCode className="h-4 w-4" />
              {p.converters.selectFile} (.md, .txt)
            </button>
            <input
              ref={mdFileInputRef}
              type="file"
              accept=".md,.markdown,.txt,text/plain"
              className="hidden"
              onChange={async (e) => {
                if (e.target.files?.[0]) {
                  setMarkdownInput(await e.target.files[0].text());
                }
              }}
            />
          </div>

          <button
            type="button"
            disabled={!markdownInput.trim() || busy}
            onClick={handleMarkdownToPdf}
            className={`${buttonClass} w-full`}
          >
            {busy ? p.common.status : p.converters.convertAction}
          </button>
        </div>
      )}

      {/* 11 & 12. PDF to Image / JPG */}
      {(slug === 'pdf-to-image' || slug === 'pdf-to-jpg') && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">{p.pdfToImage.heading}</h2>

          {!pdfFile ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-400 p-8 text-sm font-semibold hover:bg-indigo-500/5"
            >
              <ImageIcon className="h-6 w-6 text-indigo-500" />
              {p.common.selectFile}
            </button>
          ) : (
            <div className="flex items-center justify-between rounded-xl bg-[var(--muted)] p-4">
              <div>
                <p className="font-semibold">{pdfFile.name}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{pageCount} {p.common.pages.toLowerCase()}</p>
              </div>
              <button type="button" onClick={() => { setPdfFile(null); setRenderedImageUrl(null); }} className="p-1 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => void handlePdfUpload(e.target.files?.[0])}
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-sm font-semibold">
              {p.pdfToImage.selectPage}
              <input
                type="number"
                min={1}
                max={Math.max(1, pageCount)}
                value={targetRenderPage}
                disabled={!pdfFile}
                onChange={(e) => setTargetRenderPage(Math.min(Math.max(1, Number(e.target.value)), Math.max(1, pageCount)))}
                className={fieldClass}
              />
            </label>

            {slug !== 'pdf-to-jpg' && (
              <label className="block text-sm font-semibold">
                {p.pdfToImage.format}
                <select
                  value={renderFormat}
                  onChange={(e) => setRenderFormat(e.target.value as 'png' | 'jpeg')}
                  className={fieldClass}
                >
                  <option value="png">PNG</option>
                  <option value="jpeg">JPG</option>
                </select>
              </label>
            )}

            <label className="block text-sm font-semibold">
              {p.pdfToImage.resolution}
              <select
                value={renderScale}
                onChange={(e) => setRenderScale(Number(e.target.value))}
                className={fieldClass}
              >
                <option value={1}>1x (Standard)</option>
                <option value={2}>2x (High Definition)</option>
                <option value={3}>3x (Ultra Sharp)</option>
              </select>
            </label>
          </div>

          <button
            type="button"
            disabled={!pdfFile || busy}
            onClick={handlePdfToImage}
            className={`${buttonClass} w-full`}
          >
            {busy ? p.common.status : p.pdfToImage.convertAction}
          </button>

          {renderedImageUrl && (
            <div className="space-y-3">
              <p className="text-sm font-semibold">{p.pdfToImage.preview}</p>
              <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-slate-100 p-2 dark:bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={renderedImageUrl}
                  alt={p.pdfToImage.preview}
                  className="max-h-96 w-auto mx-auto rounded shadow-sm"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Busy indicator */}
      {busy && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-indigo-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          {p.common.status}
        </div>
      )}

      {/* Error display */}
      {error && (
        <div role="alert" className="mt-4 flex items-center gap-2 rounded-xl bg-red-500/10 p-4 text-sm font-semibold text-red-600 dark:text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Download Action */}
      {downloadUrl && (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
          <CheckCircle className="h-8 w-8 text-emerald-500" />
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
            {p.common.statusSuccess}
          </p>
          <a
            href={downloadUrl}
            download={downloadFilename}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700 shadow-md transition"
          >
            <Download className="h-5 w-5" />
            {p.common.downloadPdf}
          </a>
        </div>
      )}

      {/* Results Summary & Actions */}
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-bold">{p.common.results}</h3>
        <dl className="grid gap-3 sm:grid-cols-2">
          {dlRows.map(([label, value]) => (
            <div key={label} className="rounded-xl bg-[var(--muted)] p-3">
              <dt className="text-xs text-[var(--muted-foreground)]">{label}</dt>
              <dd className="mt-1 font-bold text-[var(--foreground)]">
                <bdi dir="ltr">{value}</bdi>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-4">
        <ResultActions actions={[{ kind: 'copy', label: d.ui.copy, getContent: () => copySummary }]} />
      </div>
    </section>
  );
}
