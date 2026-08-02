'use client';

import { useState, useRef } from 'react';
import { FileText, ArrowLeft, Upload, X, ShieldCheck, Download, Loader2, Image as ImageIcon } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { tools } from '@/data/registry';

export default function AddImageToPDFTool() {
  const meta = tools.find(t => t.slug === 'add-image-to-pdf');
  // Default meta if not found
  const toolMeta = meta || {
    heroTitle: "Add Image To Pdf",
    heroDescription: "Process your PDF documents efficiently.",
    formulaExplanation: "This tool processes your PDF documents locally in your browser for maximum privacy and security.",
    faq: [
      { question: "How does this tool work?", answer: "All processing happens locally in your browser. No data is ever uploaded to any server." },
      { question: "Is my data safe?", answer: "Yes! Your files and data never leave your computer." },
      { question: "Do I need to install anything?", answer: "No installation needed. Everything runs directly in your web browser." }
    ]
  };

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(1);
  const [targetPage, setTargetPage] = useState<number>(1);
  
  const [posX, setPosX] = useState<number>(100);
  const [posY, setPosY] = useState<number>(500);
  const [imgWidth, setImgWidth] = useState<number>(200);

  const [isProcessing, setIsProcessing] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);

  const handlePdfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== 'application/pdf') return;
      try {
        setPdfFile(selected);
        const fileBuffer = await selected.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer, { updateMetadata: false });
        setPageCount(pdf.getPageCount());
      } catch (err) {
        alert("Failed to read PDF structure.");
        setPdfFile(null);
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type === 'image/jpeg' || selected.type === 'image/png') {
        setImageFile(selected);
      } else {
        alert("Please select a valid JPG or PNG image.");
      }
    }
  };

  const processImageInjection = async () => {
    if (!pdfFile || !imageFile) return;
    setIsProcessing(true);
    
    try {
      const pdfBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      
      const imgBuffer = await imageFile.arrayBuffer();
      let embeddedImage;

      if (imageFile.type === 'image/png') {
        embeddedImage = await pdfDoc.embedPng(imgBuffer);
      } else {
        embeddedImage = await pdfDoc.embedJpg(imgBuffer);
      }

      // Calculate proportional height based on chosen width
      const imgDims = embeddedImage.scale(1);
      const ratio = imgDims.height / imgDims.width;
      const finalHeight = imgWidth * ratio;

      const pages = pdfDoc.getPages();
      const targetPageIndex = Math.min(Math.max(1, targetPage), pageCount) - 1;
      const page = pages[targetPageIndex];

      page.drawImage(embeddedImage, {
        x: posX,
        y: posY,
        width: imgWidth,
        height: finalHeight,
      });

      const finalBytes = await pdfDoc.save();
      const blob = new Blob([finalBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `Navorika_Graphic_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Failed to map image arrays into the PDF document.");
    }
    setIsProcessing(false);
  };

  if (!meta) return null;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
      <a href="/categories/pdf-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to PDF Tools
      </a>
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20">
          <ShieldCheck className="h-4 w-4" /> Direct Layer Injection
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{toolMeta.heroTitle}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{toolMeta.heroDescription}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mb-16 p-8">
        {!pdfFile ? (
          <div onClick={() => pdfInputRef.current?.click()} className="border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-colors">
            <Upload className="h-10 w-10 text-indigo-500 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">1. Select PDF Document</h3>
            <input type="file" accept="application/pdf" className="hidden" ref={pdfInputRef} onChange={handlePdfChange} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{pdfFile.name} ({pageCount} pages)</span>
              </div>
              <button onClick={() => setPdfFile(null)} className="p-2 text-slate-400 hover:text-red-500"><X className="h-4 w-4" /></button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 border-t border-slate-100 dark:border-slate-800 pt-8">
              {/* Image Upload Area */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">2. Upload Graphic (JPG/PNG)</label>
                {!imageFile ? (
                  <div onClick={() => imgInputRef.current?.click()} className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <ImageIcon className="h-6 w-6 text-slate-400 mb-2" />
                    <span className="text-sm text-slate-500 font-bold">Select Image File</span>
                    <input type="file" accept="image/jpeg,image/png" className="hidden" ref={imgInputRef} onChange={handleImageChange} />
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800">
                    <span className="text-sm font-semibold text-purple-700 dark:text-purple-300 truncate w-32">{imageFile.name}</span>
                    <button onClick={() => setImageFile(null)} className="text-red-500 hover:text-red-700"><X className="h-4 w-4" /></button>
                  </div>
                )}
              </div>

              {/* Coordinates */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Target Page</label>
                  <input type="number" min={1} max={pageCount} value={targetPage} onChange={(e) => setTargetPage(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">X Position</label>
                    <input type="number" value={posX} onChange={(e) => setPosX(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Y Position (from bottom)</label>
                    <input type="number" value={posY} onChange={(e) => setPosY(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Image Width (Height auto-scales)</label>
                  <input type="number" value={imgWidth} onChange={(e) => setImgWidth(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none" />
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-6">
              <button onClick={processImageInjection} disabled={isProcessing || !imageFile} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition shadow-md">
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImageIcon className="h-5 w-5" />}
                {isProcessing ? 'Stamping Image...' : 'Embed Graphic & Download'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
