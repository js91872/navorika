'use client';

import { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

type Position = 'bottom-center' | 'bottom-right' | 'bottom-left';
type Format = 'page_x' | 'page_x_of_y';

export default function PageNumbersHub() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [position, setPosition] = useState<Position>('bottom-center');
  const [format, setFormat] = useState<Format>('page_x_of_y');
  const [fontSize, setFontSize] = useState<string>('10');
  const [processing, setProcessing] = useState<boolean>(false);
  const [status, setStatus] = useState<{ text: string; isError: boolean } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setStatus(null);
    }
  };

  const executeStamping = async () => {
    if (!selectedFile) {
      setStatus({ text: "Please select a target PDF document first.", isError: true });
      return;
    }

    setProcessing(true);
    setStatus(null);

    try {
      const fileBytes = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBytes);
      const pages = pdfDoc.getPages();
      const totalPages = pages.length;

      // Embed standard clean Helvetica font
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const size = parseInt(fontSize, 10) || 10;

      pages.forEach((page, index) => {
        const { width, height } = page.getSize();
        const pageNum = index + 1;
        
        let text = format === 'page_x_of_y' ? `Page ${pageNum} of ${totalPages}` : `${pageNum}`;
        
        // Calculate text width to align properly
        const textWidth = helveticaFont.widthOfTextAtSize(text, size);
        
        let x = width / 2 - textWidth / 2; // Default bottom-center
        const y = 30; // 30 points from bottom edge

        if (position === 'bottom-right') {
          x = width - textWidth - 50; // 50 points margin from right
        } else if (position === 'bottom-left') {
          x = 50; // 50 points margin from left
        }

        page.drawText(text, {
          x,
          y,
          size,
          font: helveticaFont,
          color: rgb(0.3, 0.3, 0.3), // Sleek professional slate-grey
        });
      });

      const modifiedBytes = await pdfDoc.save();
      
      const blob = new Blob([modifiedBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Navorika_Numbered_${selectedFile.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setStatus({ text: `Successfully stamped page numbers across all ${totalPages} pages!`, isError: false });
    } catch (err: any) {
      console.error(err);
      setStatus({ text: "Failed to stamp page numbers. Ensure the file is a valid, unencrypted PDF.", isError: true });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Insert Page Numbers in PDF</h1>
        <p className="text-slate-600 mt-2 text-sm max-w-2xl">
          Automatically calculate and stamp clean page number footers onto every page of your PDF documents locally inside your browser.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Upload Box */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-3">1. Upload PDF Document</label>
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50 hover:bg-slate-100/60 transition-colors relative cursor-pointer">
            <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="text-2xl mb-1">🔢</div>
            <p className="text-sm font-semibold text-slate-700">{selectedFile ? `Selected: ${selectedFile.name}` : 'Click to select target PDF file'}</p>
          </div>
        </div>

        {/* Configurations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-slate-50 border border-slate-200 rounded-xl">
          
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Numbering Format</label>
            <select 
              value={format} 
              onChange={(e) => setFormat(e.target.value as Format)} 
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500"
            >
              <option value="page_x_of_y">Page X of Y (e.g. Page 1 of 10)</option>
              <option value="page_x">Simple Number (e.g. 1, 2, 3...)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Footer Position Alignment</label>
            <select 
              value={position} 
              onChange={(e) => setPosition(e.target.value as Position)} 
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500"
            >
              <option value="bottom-center">Bottom Center</option>
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Font Size (Points)</label>
            <input 
              type="number" 
              value={fontSize} 
              onChange={(e) => setFontSize(e.target.value)} 
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500" 
            />
          </div>

        </div>

        {status && (
          <div className={`p-4 rounded-xl text-xs font-bold border ${status.isError ? 'bg-red-50 border-red-100 text-red-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
            {status.text}
          </div>
        )}

        <button
          type="button"
          disabled={processing || !selectedFile}
          onClick={executeStamping}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-4 rounded-xl text-sm transition-all shadow-md"
        >
          {processing ? 'Stamping Page Numbers...' : 'Insert Page Numbers ➔'}
        </button>

      </div>
    </div>
  );
}
