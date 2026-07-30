'use client';

import { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import ToolWorkspaceLayout from '@/components/tools/ToolWorkspaceLayout';

type Position = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
type NumberStyle = 'arabic' | 'roman';

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
  const [startPage, setStartPage] = useState<string>('1');
  const [startNumber, setStartNumber] = useState<string>('1');
  const [skipCover, setSkipCover] = useState<boolean>(true);
  const [numberStyle, setNumberStyle] = useState<NumberStyle>('arabic');
  const [prefix, setPrefix] = useState<string>('Page ');
  const [suffix, setSuffix] = useState<string>('');
  const [position, setPosition] = useState<Position>('bottom-center');
  const [fontFamily, setFontFamily] = useState<string>('Helvetica');
  const [fontSize, setFontSize] = useState<string>('11');
  const [fontColor, setFontColor] = useState<string>('#334155');
  const [opacity, setOpacity] = useState<string>('1');
  const [marginEdge, setMarginEdge] = useState<string>('45');

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
      setStatus({ text: "Please upload a source PDF file to begin.", isError: true });
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
      const margin = parseInt(marginEdge, 10) || 45;
      const size = parseInt(fontSize, 10) || 11;
      const alpha = parseFloat(opacity) || 1;
      const colorVals = hexToRgb(fontColor);

      let font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      if (fontFamily === 'Times-Roman') font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      if (fontFamily === 'Courier') font = await pdfDoc.embedFont(StandardFonts.Courier);

      let currentCounter = initialNumValue;

      pages.forEach((page, index) => {
        if (index < startingPageIndex || (skipCover && index === 0)) {
          return;
        }

        const { width, height } = page.getSize();
        const numStr = numberStyle === 'roman' ? toRoman(currentCounter) : currentCounter.toString();
        const fullText = `${prefix}${numStr}${suffix}`;
        currentCounter++;

        const textWidth = font.widthOfTextAtSize(fullText, size);
        let x = margin;
        let y = margin;

        if (position.includes('center')) {
          x = width / 2 - textWidth / 2;
        } else if (position.includes('right')) {
          x = width - textWidth - margin;
        }

        if (position.includes('top')) {
          y = height - margin;
        } else {
          y = margin;
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
      link.download = `Navorika_Numbered_${selectedFile.name}`;
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
    <ToolWorkspaceLayout
      title="Insert Page Numbers in PDF"
      description="Stamp professional page numbers with full control over font styles, offsets, roman numerals, prefixes, and 6 positioning zones."
      category="PDF Tools"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: File Upload & Core Configuration */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 dark:text-slate-300 block mb-3">1. Upload PDF Document</label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center bg-slate-50 dark:bg-slate-950 transition-colors dark:bg-slate-800/50 hover:bg-slate-100/60 transition-colors relative cursor-pointer group">
              <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="text-3xl mb-2">📑</div>
              <p className="text-sm font-bold text-slate-900 dark:text-white dark:text-white group-hover:text-indigo-600 transition-colors">
                {selectedFile ? `Selected: ${selectedFile.name}` : 'Click to select target PDF file'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Files process locally with absolute privacy</p>
            </div>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-950 transition-colors dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 dark:border-slate-700 rounded-2xl space-y-5">
            <h3 className="font-bold text-slate-900 dark:text-white dark:text-white text-sm border-b border-slate-200 dark:border-slate-800 dark:border-slate-700 pb-3 uppercase tracking-wider">Numbering Sequence</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 dark:text-slate-400 block mb-2">Number Style</label>
                <select value={numberStyle} onChange={(e) => setNumberStyle(e.target.value as NumberStyle)} className="w-full bg-white dark:bg-slate-900 transition-colors dark:bg-slate-900 text-slate-900 dark:text-white dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500">
                  <option value="arabic">Arabic (1, 2, 3)</option>
                  <option value="roman">Roman (I, II, III)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 dark:text-slate-400 block mb-2">Position Zone</label>
                <select value={position} onChange={(e) => setPosition(e.target.value as Position)} className="w-full bg-white dark:bg-slate-900 transition-colors dark:bg-slate-900 text-slate-900 dark:text-white dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500">
                  <option value="top-left">Top Left</option>
                  <option value="top-center">Top Center</option>
                  <option value="top-right">Top Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-center">Bottom Center</option>
                  <option value="bottom-right">Bottom Right</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 dark:text-slate-400 block mb-2">Start From Page</label>
                <input type="number" value={startPage} onChange={(e) => setStartPage(e.target.value)} className="w-full bg-white dark:bg-slate-900 transition-colors dark:bg-slate-900 text-slate-900 dark:text-white dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 dark:text-slate-400 block mb-2">Initial Number</label>
                <input type="number" value={startNumber} onChange={(e) => setStartNumber(e.target.value)} className="w-full bg-white dark:bg-slate-900 transition-colors dark:bg-slate-900 text-slate-900 dark:text-white dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500" />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input type="checkbox" checked={skipCover} onChange={(e) => setSkipCover(e.target.checked)} id="skip-cover" className="w-5 h-5 text-indigo-600 rounded border-slate-300 dark:border-slate-700 focus:ring-indigo-500" />
              <label htmlFor="skip-cover" className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider cursor-pointer">Automatically Skip Cover Page</label>
            </div>
          </div>
        </div>

        {/* Right Column: Advanced Typography & Action Execution */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 bg-slate-50 dark:bg-slate-950 transition-colors dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 dark:border-slate-700 rounded-2xl space-y-5">
            <h3 className="font-bold text-slate-900 dark:text-white dark:text-white text-sm border-b border-slate-200 dark:border-slate-800 dark:border-slate-700 pb-3 uppercase tracking-wider">Typography & Layout</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 dark:text-slate-400 block mb-2">Prefix Text</label>
                <input type="text" value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="e.g. Page " className="w-full bg-white dark:bg-slate-900 transition-colors dark:bg-slate-900 text-slate-900 dark:text-white dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 dark:text-slate-400 block mb-2">Suffix Text</label>
                <input type="text" value={suffix} onChange={(e) => setSuffix(e.target.value)} placeholder="e.g. / 50" className="w-full bg-white dark:bg-slate-900 transition-colors dark:bg-slate-900 text-slate-900 dark:text-white dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 dark:text-slate-400 block mb-2">Font</label>
                <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="w-full bg-white dark:bg-slate-900 transition-colors dark:bg-slate-900 text-slate-900 dark:text-white dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-3 text-xs font-semibold focus:outline-none focus:border-indigo-500">
                  <option value="Helvetica">Helvetica</option>
                  <option value="Times-Roman">Times</option>
                  <option value="Courier">Courier</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 dark:text-slate-400 block mb-2">Size (pt)</label>
                <input type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="w-full bg-white dark:bg-slate-900 transition-colors dark:bg-slate-900 text-slate-900 dark:text-white dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-3 text-xs font-semibold focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 dark:text-slate-400 block mb-2">Margin</label>
                <input type="number" value={marginEdge} onChange={(e) => setMarginEdge(e.target.value)} className="w-full bg-white dark:bg-slate-900 transition-colors dark:bg-slate-900 text-slate-900 dark:text-white dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-3 text-xs font-semibold focus:outline-none focus:border-indigo-500" />
              </div>
            </div>
          </div>

          {status && (
            <div className={`p-4 rounded-xl text-xs font-bold border ${status.isError ? 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-900 text-red-700 dark:text-red-400' : 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400'}`}>
              {status.text}
            </div>
          )}

          <button
            type="button"
            disabled={processing || !selectedFile}
            onClick={executeStamping}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-black py-4 rounded-2xl text-base transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            {processing ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Stamping Document Pages...
              </>
            ) : (
              'Apply Page Numbers & Download ➔'
            )}
          </button>
        </div>

      </div>
    </ToolWorkspaceLayout>
  );
}
