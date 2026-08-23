'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, QrCode, Upload, Download, Scan } from 'lucide-react';
import { tools } from '@/data/registry';
import QRCode from 'qrcode';
import jsQR from 'jsqr';

export default function QrCodeStudioTool() {
  const meta = tools.find(t => t.slug === 'qr-code-generator');
  // Default meta if not found
  const toolMeta = meta || {
    heroTitle: "QR Code Generator",
    heroDescription: "Process your documents efficiently with this tool.",
    formulaExplanation: "This tool processes your data locally in your browser for maximum privacy and speed.",
    faq: [
      { question: "How does this tool work?", answer: "All processing happens locally in your browser. No data is ever uploaded to any server." },
      { question: "Is my data safe?", answer: "Yes! Your files and data never leave your computer." },
      { question: "Do I need to install anything?", answer: "No installation needed. Everything runs directly in your web browser." }
    ]
  };

  const [mode, setMode] = useState<'generate' | 'scan'>('generate');
  
  // Generator State
  const [qrText, setQrText] = useState('https://navorika.com');
  const [qrColor, setQrColor] = useState('#000000');
  const [qrDataUrl, setQrDataUrl] = useState('');
  
  // Scanner State
  const [scanResult, setScanResult] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode === 'generate' && qrText) {
      QRCode.toDataURL(qrText, {
        width: 400,
        margin: 2,
        color: { dark: qrColor, light: '#ffffff' }
      }).then(url => setQrDataUrl(url)).catch(err => console.error(err));
    }
  }, [qrText, qrColor, mode]);

  const handleScanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            setScanResult(code.data);
          } else {
            setScanResult('No QR code detected in this image. Please try a clearer picture.');
          }
        }
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  };

  if (!meta) return null;

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 lg:px-8">
      <a href="/categories/image-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 transition mb-8"><ArrowLeft className="h-4 w-4" /> Back to Image Tools</a>
      <div className="text-center mb-10"><h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{toolMeta.heroTitle}</h1></div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden p-8">
        <div className="flex gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
          <button onClick={() => setMode('generate')} className={`px-6 py-2 rounded-xl text-sm font-bold transition ${mode === 'generate' ? 'bg-purple-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>Generate QR</button>
          <button onClick={() => setMode('scan')} className={`px-6 py-2 rounded-xl text-sm font-bold transition ${mode === 'scan' ? 'bg-purple-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>Scan & Decode QR</button>
        </div>

        {mode === 'generate' ? (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Data (URL or Text)</label>
                <textarea value={qrText} onChange={e => setQrText(e.target.value)} className="w-full h-32 mt-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border outline-none text-sm font-mono" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">QR Color</label>
                <input type="color" value={qrColor} onChange={e => setQrColor(e.target.value)} className="w-full h-10 rounded cursor-pointer mt-2" />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center border rounded-2xl bg-slate-50 dark:bg-slate-950 p-6">
              {qrDataUrl ? (
                <>
                  <img src={qrDataUrl} alt="Generated QR" className="w-64 h-64 shadow-md rounded-lg mb-6 bg-white" />
                  <a href={qrDataUrl} download={`Navorika_QR_${Date.now()}.png`} className="bg-purple-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2"><Download className="h-4 w-4"/> Download Code</a>
                </>
              ) : (
                <div className="text-slate-400 font-bold uppercase text-xs"><QrCode className="h-8 w-8 mx-auto mb-2 opacity-50"/> Awaiting Data</div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
             <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-purple-300 rounded-2xl p-12 text-center cursor-pointer h-64 flex flex-col justify-center">
              <Upload className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Upload QR Code Image</h4>
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleScanUpload} />
            </div>
            <div className="border rounded-2xl bg-slate-50 dark:bg-slate-950 p-6 flex flex-col">
               <label className="text-xs font-bold uppercase text-slate-500 mb-2">Decoded Result</label>
               <textarea readOnly value={scanResult} placeholder="Decoded text will appear here..." className="w-full flex-1 p-4 rounded-xl bg-white dark:bg-slate-900 border outline-none text-sm font-mono text-emerald-600 dark:text-emerald-400 font-bold resize-none" />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
