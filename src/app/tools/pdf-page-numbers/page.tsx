'use client';

import { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

type Position = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
type NumberStyle = 'arabic' | 'roman';

// Helper to convert numbers to Roman numerals
function toRoman(num: number): string {
  const lookup: Record<string, number> = {m:1000, cm:900, d:500, cd:400, c:100, xc:90, l:50, xl:40, x:10, ix:9, v:5, iv:4, i:1};
  let roman = "";
  for (const i in lookup) {
    while (num >= lookup[i]) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman.toUpperCase();
}

export default function AdvancedPageNumbersHub() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Customization States
  const [startPage, setStartPage] = useState<string>('1');
  const [startNumber, setStartNumber] = useState<string>('1');
  const [skipCover, setSkipCover] = useState<boolean>(true);
  const [numberStyle, setNumberStyle] = useState<NumberStyle>('arabic');
  const [prefix, setPrefix] = useState<string>('Page ');
  const [suffix, setSuffix] = useState<string>('');
  
  // Positioning & Typography
  const [position, setPosition] = useState<Position>('bottom-center');
  const [fontFamily, setFontFamily] = useState<string>('Helvetica');
  const [fontSize, setFontSize] = useState<string>('10');
  const [fontColor, setFontColor] = useState<string>('#334155'); // slate-700
  const [opacity, setOpacity] = useState<string>('1');
  const [marginEdge, setMarginEdge] = useState<string>('40'); // points from edge

  const [processing, setProcessing] = useState<boolean>(false);
  const [status, setStatus] = useState<{ text: string; isError: boolean } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setStatus(null);
    }
  };

  const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.replace('#', ''), 16);
    const r = ((bigint >> 16) & 255) / 255;
    const g = ((bigint >> 8) & 255) / 255;
    const b = (bigint & 255) / 255;
    return { r, g, b };
  };

  const executeStamping = async () => {
    if (!selectedFile) {
      setStatus({ text: "Please upload a source PDF file.", isError: true });
      return;
    }

    setProcessing(true);
    setStatus(null);

    try {
      const fileBytes = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBytes);
      const pages = pdfDoc.getPages();
      
      const startingPageIndex = Math.max(0, parseInt(startPage, 10) - 1);
      const initialNumValue = parseInt(startNumber, 10) || 1;
      const margin = parseInt(marginEdge, 10) || 40;
      const size = parseInt(fontSize, 10) || 10;
      const alpha = parseFloat(opacity) || 1;
      const colorVals = hexToRgb(fontColor);

      // Select Font
      let font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      if (fontFamily === 'Times-Roman') font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      if (fontFamily === 'Courier') font = await pdfDoc.embedFont(StandardFonts.Courier);

      let currentCounter = initialNumValue;

      pages.forEach((page, index) => {
        // Skip pages before startPage or skip cover if checked
        if (index < startingPageIndex || (skipCover && index === 0)) {
          return;
        }

        const { width, height } = page.getSize();
        
        // Format text string
        const numStr = numberStyle === 'roman' ? toRoman(currentCounter) : currentCounter.toString();
        const fullText = `${prefix}${numStr}${suffix}`;
        currentCounter++;

        const textWidth = font.widthOfTextAtSize(fullText, size);
        
        // Compute Coordinates based on 6 Positions
        let x = margin;
        let y = margin;

        // X Alignment
        if (position.includes('center')) {
          x = width / 2 - textWidth / 2;
        } else if (position.includes('right')) {
          x = width - textWidth - margin;
        }

        // Y Alignment
        if (position.includes('top')) {
          y = height - margin;
        } else {
          y = margin; // bottom
        }

        page.drawText(fullText, {
          x,
          y,
          size,
          font,
          color: rgb(colorVals.r, colorVals.g, colorVals.b),
          opacity: alpha,
        });
      });

      const modifiedBytes = await pdfDoc.save();
      const blob = new Blob([modifiedBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Navorika_Advanced_Numbered_${selectedFile.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setStatus({ text: "Page numbers successfully updated and downloaded!", isError: false });
    } catch (err: any) {
      console.error(err);
      setStatus({ text: "Error updating document pages. Ensure the file is unencrypted.", isError: true });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Advanced Page Numbering Suite</h1>
        <p className="text-slate-600 mt-2 text-sm max-w-2xl">
          Stamp custom page numbers with full control over font styles, offsets, roman numerals, prefixes, and 6 positioning zones.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Upload Box */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-3">1. Upload PDF Document</label>
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50 hover:bg-slate-100/60 transition-colors relative cursor-pointer">
            <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="text-2xl mb-1">📑</div>
            <p className="text-sm font-semibold text-slate-700">{selectedFile ? `Selected: ${selectedFile.name}` : 'Click to select target PDF file'}</p>
          </div>
        </div>

        {/* Customization Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-slate-50 border border-slate-200 rounded-xl">
          
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Number Style</label>
            <select value={numberStyle} onChange={(e) => setNumberStyle(e.target.value as NumberStyle)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold">
              <option value="arabic">Arabic Numerals (1, 2, 3)</option>
              <option value="roman">Roman Numerals (I, II, III)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Start Numbering From Page</label>
            <input type="number" value={startPage} onChange={(e) => setStartPage(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold" />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Initial Starting Value</label>
            <input type="number" value={startNumber} onChange={(e) => setStartNumber(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold" />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Position Zone</label>
            <select value={position} onChange={(e) => setPosition(e.target.value as Position)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold">
              <option value="top-left">Top Left</option>
              <option value="top-center">Top Center</option>
              <option value="top-right">Top Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="bottom-center">Bottom Center (Default)</option>
              <option value="bottom-right">Bottom Right</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Prefix Text</label>
            <input type="text" value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="e.g. Page " className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold" />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Suffix Text</label>
            <input type="text" value={suffix} onChange={(e) => setSuffix(e.target.value)} placeholder="e.g. / 50" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold" />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Font Family</label>
            <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold">
              <option value="Helvetica">Helvetica (Sans-serif)</option>
              <option value="Times-Roman">Times Roman (Serif)</option>
              <option value="Courier">Courier (Monospace)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Font Size (pt)</label>
            <input type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold" />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Edge Margin (pt)</label>
            <input type="number" value={marginEdge} onChange={(e) => setMarginEdge(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold" />
          </div>

          <div className="sm:col-span-3 flex items-center gap-3 pt-2">
            <input type="checkbox" checked={skipCover} onChange={(e) => setSkipCover(e.target.checked)} id="skip-cover" className="w-4 h-4 text-indigo-600 rounded border-slate-300" />
            <label htmlFor="skip-cover" className="text-xs font-bold text-slate-700 uppercase tracking-wider">Automatically Skip First Page (Cover Page)</label>
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
          {processing ? 'Processing Document Pages...' : 'Apply Page Numbers & Download ➔'}
        </button>

      </div>
    </div>
  );
}
