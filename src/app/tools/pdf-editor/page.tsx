'use client';

import { useState } from 'react';
import { PDFDocument, degrees, rgb } from 'pdf-lib';

type EditMode = 'rotate' | 'reorder' | 'add_text' | 'add_image';

export default function PDFEditorHub() {
  const [mode, setMode] = useState<EditMode>('rotate');
  const [targetFile, setTargetFile] = useState<File | null>(null);
  
  // Rotate State
  const [rotationDegree, setRotationDegree] = useState<string>('90');
  
  // Reorder State
  const [pageOrder, setPageOrder] = useState<string>('');
  
  // Add Text State
  const [textInput, setTextInput] = useState<string>('CONFIDENTIAL');
  const [textSize, setTextSize] = useState<string>('48');
  
  // Add Image State
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [processing, setProcessing] = useState<boolean>(false);
  const [status, setStatus] = useState<{ text: string; isError: boolean } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTargetFile(e.target.files[0]);
      setStatus(null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const downloadBlob = (bytes: Uint8Array, name: string) => {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const executeEdit = async () => {
    if (!targetFile) {
      setStatus({ text: "Please upload a source PDF first.", isError: true });
      return;
    }
    setProcessing(true);
    setStatus(null);

    try {
      const fileBytes = await targetFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBytes);
      const pages = pdfDoc.getPages();

      if (mode === 'rotate') {
        const rot = parseInt(rotationDegree, 10);
        pages.forEach((page) => {
          page.setRotation(degrees(rot));
        });
        setStatus({ text: `Successfully rotated pages by ${rot} degrees.`, isError: false });
      } 
      
      else if (mode === 'reorder') {
        if (!pageOrder.trim()) throw new Error("Please enter a page order.");
        const newOrderIndices = pageOrder.split(',').map(n => parseInt(n.trim(), 10) - 1);
        
        // Validate indices
        newOrderIndices.forEach(idx => {
          if (isNaN(idx) || idx < 0 || idx >= pages.length) {
            throw new Error(`Invalid page number found. File has ${pages.length} pages.`);
          }
        });

        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(pdfDoc, newOrderIndices);
        copiedPages.forEach(page => newPdf.addPage(page));
        
        const modifiedPdfBytes = await newPdf.save();
        downloadBlob(modifiedPdfBytes, "Navorika_Reordered.pdf");
        setStatus({ text: "Successfully reordered PDF pages.", isError: false });
        setProcessing(false);
        return; // Early return because we created a new doc instance
      }

      else if (mode === 'add_text') {
        const size = parseInt(textSize, 10) || 24;
        pages.forEach((page) => {
          const { width, height } = page.getSize();
          page.drawText(textInput, {
            x: 50,
            y: height / 2, // Centered roughly vertically
            size: size,
            color: rgb(0, 0, 0),
            opacity: 0.5, // Acts as a watermark
            rotate: degrees(45), // Diagonal watermark style
          });
        });
        setStatus({ text: "Text watermark stamped successfully.", isError: false });
      }

      else if (mode === 'add_image') {
        if (!imageFile) throw new Error("Please upload an image asset to stamp.");
        const imageBytes = await imageFile.arrayBuffer();
        
        let embeddedImage;
        if (imageFile.type === 'image/png') {
          embeddedImage = await pdfDoc.embedPng(imageBytes);
        } else {
          embeddedImage = await pdfDoc.embedJpg(imageBytes);
        }

        pages.forEach((page) => {
          const { width, height } = page.getSize();
          // Scale image down if it's too big, stamp it in top-right corner
          const scale = Math.min(100 / embeddedImage.width, 100 / embeddedImage.height);
          const scaledDims = embeddedImage.scale(scale);
          
          page.drawImage(embeddedImage, {
            x: width - scaledDims.width - 20,
            y: height - scaledDims.height - 20,
            width: scaledDims.width,
            height: scaledDims.height,
          });
        });
        setStatus({ text: "Image stamp added successfully to all pages.", isError: false });
      }

      const modifiedPdfBytes = await pdfDoc.save();
      downloadBlob(modifiedPdfBytes, `Navorika_Modified_${mode}.pdf`);
      
    } catch (error: any) {
      console.error(error);
      setStatus({ text: error.message || "An error occurred while modifying the PDF.", isError: true });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">PDF Editor & Modifier</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm max-w-2xl">
          Apply structural modifications to your PDF files natively in your browser. Rotate layouts, reorder pages, and stamp custom text or images with zero server uploads.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
        {[
          { id: 'rotate', label: 'Rotate Pages' },
          { id: 'reorder', label: 'Reorder Pages' },
          { id: 'add_text', label: 'Add Text Stamp' },
          { id: 'add_image', label: 'Add Image Stamp' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => { setMode(btn.id as EditMode); setStatus(null); }}
            className={`px-3 py-3 rounded-xl border text-xs font-bold transition-all text-center ${
              mode === btn.id
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white dark:bg-slate-900 transition-colors text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 transition-colors border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Universal PDF Source Upload */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-3">Target PDF Document</label>
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center bg-slate-50 dark:bg-slate-950 transition-colors hover:bg-slate-100/60 transition-colors relative cursor-pointer">
            <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="text-2xl mb-1">📄</div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{targetFile ? targetFile.name : 'Click to select source PDF'}</p>
          </div>
        </div>

        {/* Dynamic Controls based on Mode */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950 transition-colors border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-200 dark:border-slate-800 pb-2">Tool Parameters</h3>
          
          {mode === 'rotate' && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-2">Rotation Angle</label>
              <select value={rotationDegree} onChange={(e) => setRotationDegree(e.target.value)} className="w-full bg-white dark:bg-slate-900 transition-colors text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-indigo-500">
                <option value="90">90 Degrees (Clockwise)</option>
                <option value="180">180 Degrees (Upside Down)</option>
                <option value="270">270 Degrees (Counter-Clockwise)</option>
              </select>
            </div>
          )}

          {mode === 'reorder' && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-2">New Page Order</label>
              <input type="text" value={pageOrder} onChange={(e) => setPageOrder(e.target.value)} placeholder="e.g. 4, 1, 2, 3" className="w-full bg-white dark:bg-slate-900 transition-colors text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500" />
              <p className="text-[11px] text-slate-500 mt-2">Enter comma-separated page numbers. E.g., &quot;3, 1, 2&quot; will make page 3 the first page.</p>
            </div>
          )}

          {mode === 'add_text' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-2">Watermark Text</label>
                <input type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)} className="w-full bg-white dark:bg-slate-900 transition-colors text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-2">Font Size</label>
                <input type="number" value={textSize} onChange={(e) => setTextSize(e.target.value)} className="w-full bg-white dark:bg-slate-900 transition-colors text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500" />
              </div>
            </div>
          )}

          {mode === 'add_image' && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-3">Upload Image Stamp (PNG/JPG)</label>
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900 transition-colors relative cursor-pointer">
                <input type="file" accept="image/png, image/jpeg" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 text-center">{imageFile ? imageFile.name : 'Select image to stamp onto PDF'}</p>
              </div>
            </div>
          )}
        </div>

        {status && (
          <div className={`p-4 rounded-xl text-xs font-bold border ${status.isError ? 'bg-red-50 border-red-100 text-red-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
            {status.text}
          </div>
        )}

        <button
          type="button"
          disabled={processing || !targetFile}
          onClick={executeEdit}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
        >
          {processing ? 'Processing Document...' : 'Execute PDF Modification ➔'}
        </button>
      </div>
    </div>
  );
}
