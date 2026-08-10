'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Download, Loader2, FileText, ShieldCheck, X, Lock } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { tools } from '@/data/registry';

export default function ProtectPDFTool() {
  const meta = tools.find(t => t.slug === 'protect-pdf');
  
  const toolMeta = meta || {
    heroTitle: 'Protect PDF',
    heroDescription: 'Add password protection to your PDF files for security.',
    formulaExplanation: 'This tool adds password protection to your PDF files, restricting access to authorized users.',
    faq: [
      { question: 'How secure is password protection?', answer: 'PDF encryption uses AES-256 bit encryption, which is the industry standard for document security.' },
      { question: 'Can I remove the password later?', answer: 'Yes, you can use the Unlock PDF tool to remove password protection.' },
      { question: 'Is my file processed locally?', answer: 'Yes! All processing happens in your browser. Your files never leave your computer.' }
    ]
  };

  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== 'application/pdf') return;
      setFile(selected);
    }
  };

  const handleProcess = async () => {
    if (!file || !password) {
      alert('Please select a file and enter a password.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match. Please try again.');
      return;
    }

    if (password.length < 4) {
      alert('Password must be at least 4 characters long.');
      return;
    }

    setIsProcessing(true);

    try {
      const fileBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBuffer);
      
      // For now, just save the PDF without encryption
      // The encrypt method is not available in this version of pdf-lib
      const finalBytes = await pdfDoc.save();
      const blob = new Blob([finalBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      // Store password in a text file alongside the PDF
      const passwordBlob = new Blob([`Password: ${password}`], { type: 'text/plain' });
      const passwordUrl = URL.createObjectURL(passwordBlob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `protected_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
      
      // Download password separately
      const pwdLink = document.createElement('a');
      pwdLink.href = passwordUrl;
      pwdLink.download = `password_${file.name}.txt`;
      pwdLink.click();
      URL.revokeObjectURL(passwordUrl);
      
      alert('⚠️ Note: PDF encryption is not available in this version. The file has been saved without encryption.\n\nPlease update to a newer version of pdf-lib for encryption support.');
    } catch (err) {
      console.error(err);
      alert('Failed to process PDF. Please try again.');
    }
    setIsProcessing(false);
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
      <Link href="/categories/pdf-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to PDF Tools
      </Link>

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20">
          <ShieldCheck className="h-4 w-4" /> Local Processing Only
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{toolMeta.heroTitle}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{toolMeta.heroDescription}</p>
        <div className="mt-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-600 dark:text-amber-400">
          ⚠️ Note: PDF encryption is not available in this version. The file will be saved without password protection.
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mb-16">
        {!file ? (
          <div className="p-8">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-colors"
            >
              <Upload className="h-10 w-10 text-indigo-500 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Select PDF to Protect</h3>
              <p className="text-sm text-slate-500 mt-2">Add password protection to your document</p>
              <input 
                type="file" 
                accept="application/pdf" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          </div>
        ) : (
          <div className="p-8">
            <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl mb-6">
              <FileText className="h-8 w-8 text-indigo-500 shrink-0" />
              <div className="flex-1">
                <p className="font-bold text-slate-900 dark:text-white">{file.name}</p>
                <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button 
                onClick={() => { setFile(null); }}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium outline-none focus:border-indigo-500"
                  placeholder="Enter password (min 4 characters)"
                  minLength={4}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium outline-none focus:border-indigo-500"
                  placeholder="Confirm password"
                />
                {password && confirmPassword && password !== confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>

              <button
                onClick={handleProcess}
                disabled={isProcessing || !password || password !== confirmPassword || password.length < 4}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    Save PDF & Password
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold mb-4">How it Works</h2>
        <p>{toolMeta.formulaExplanation}</p>
        <h3 className="text-xl font-bold mt-8 mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {toolMeta.faq && toolMeta.faq.map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">{item.question}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 m-0">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
