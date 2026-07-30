'use client';

import { useState } from 'react';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt';
import { decryptPDF } from '@pdfsmaller/pdf-decrypt';

type SecurityMode = 'lock' | 'unlock';

export default function PDFSecurityHub() {
  const [mode, setMode] = useState<SecurityMode>('lock');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Encryption Configurations
  const [userPassword, setUserPassword] = useState<string>('');
  const [restrictPrinting, setRestrictPrinting] = useState<boolean>(false);
  const [restrictEditing, setRestrictEditing] = useState<boolean>(false);

  // Decryption Configurations
  const [decryptionPassword, setDecryptionPassword] = useState<string>('');

  const [processing, setProcessing] = useState<boolean>(false);
  const [status, setStatus] = useState<{ text: string; isError: boolean } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setStatus(null);
    }
  };

  const executeSecurityAction = async () => {
    if (!selectedFile) {
      setStatus({ text: "Please select a target PDF document first.", isError: true });
      return;
    }

    if (mode === 'lock' && !userPassword.trim()) {
      setStatus({ text: "Please enter a valid password to secure the PDF.", isError: true });
      return;
    }

    if (mode === 'unlock' && !decryptionPassword.trim()) {
      setStatus({ text: "Please enter the password to unlock the file.", isError: true });
      return;
    }

    setProcessing(true);
    setStatus(null);

    try {
      const fileBytes = await selectedFile.arrayBuffer();
      const uint8Bytes = new Uint8Array(fileBytes);
      
      if (mode === 'lock') {
        // Apply true AES-256 encryption via Web Crypto API
        const encryptedBytes = await encryptPDF(uint8Bytes, userPassword, {
          ownerPassword: userPassword,
          allowPrinting: !restrictPrinting,
          allowModifying: !restrictEditing,
          allowCopying: !restrictEditing,
          allowAnnotating: !restrictEditing,
          allowFillingForms: !restrictEditing
        });
        
        triggerDownload(encryptedBytes, `Navorika_Secured_${selectedFile.name}`);
        setStatus({ text: "Success! Document is now securely encrypted with AES-256.", isError: false });
      } 
      else {
        // Decrypt using the official AES-256 client decoder
        const decryptedBytes = await decryptPDF(uint8Bytes, decryptionPassword);
        
        triggerDownload(decryptedBytes, `Navorika_Unlocked_${selectedFile.name}`);
        setStatus({ text: "Password permissions cleared successfully! File unlocked.", isError: false });
      }
    } catch (err: any) {
      console.error(err);
      if (mode === 'lock') {
        setStatus({ text: "Failed to encrypt document. Ensure it is a valid PDF.", isError: true });
      } else {
        setStatus({ 
          text: "Decryption failed. Ensure the password is correct or that the file format is supported.", 
          isError: true 
        });
      }
    } finally {
      setProcessing(false);
    }
  };

  const triggerDownload = (bytes: Uint8Array, fileName: string) => {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reusable input class for dark mode consistency
  const inputClassName = "w-full bg-white dark:bg-slate-900 transition-colors dark:bg-slate-950 text-slate-900 dark:text-white dark:text-white border border-slate-200 dark:border-slate-800 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors";

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8 border-b border-slate-200 dark:border-slate-800 dark:border-slate-800 pb-6 transition-colors">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white dark:text-white tracking-tight">PDF Security & Permissions</h1>
        <p className="text-slate-600 dark:text-slate-400 dark:text-slate-400 mt-2 text-sm max-w-2xl">
          Encrypt your files with enterprise-grade AES-256 password layers or clear restriction permissions instantly within your browser.
        </p>
      </div>

      <div className="flex border border-slate-200 dark:border-slate-800 dark:border-slate-800 rounded-xl p-1 bg-white dark:bg-slate-900 transition-colors dark:bg-slate-900 max-w-xs mb-8 shadow-sm transition-colors">
        <button
          onClick={() => { setMode('lock'); setSelectedFile(null); setStatus(null); }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${mode === 'lock' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          Protect & Lock PDF
        </button>
        <button
          onClick={() => { setMode('unlock'); setSelectedFile(null); setStatus(null); }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${mode === 'unlock' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          Unlock & Clear Password
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 transition-colors dark:bg-slate-900 border border-slate-200 dark:border-slate-800 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 transition-colors">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 dark:text-slate-400 block mb-3">Upload PDF File</label>
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 dark:border-slate-700 rounded-2xl p-6 text-center bg-slate-50 dark:bg-slate-950 transition-colors dark:bg-slate-950/50 hover:bg-slate-100/60 dark:hover:bg-slate-900 transition-colors relative cursor-pointer">
            <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="text-2xl mb-1">{mode === 'lock' ? '🔒' : '🔓'}</div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-300">{selectedFile ? `Selected: ${selectedFile.name}` : 'Select document file to process'}</p>
          </div>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-950 transition-colors dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 dark:border-slate-800 rounded-xl space-y-4 transition-colors">
          <h3 className="font-bold text-slate-900 dark:text-white dark:text-white text-sm border-b border-slate-200 dark:border-slate-800 dark:border-slate-800 pb-2">Security Parameters</h3>

          {mode === 'lock' ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 dark:text-slate-400 block mb-2">Set Document Password</label>
                <input type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} placeholder="Enter strong security pass key..." className={inputClassName} />
              </div>
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={restrictPrinting} onChange={(e) => setRestrictPrinting(e.target.checked)} id="print-check" className="w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-slate-700 dark:bg-slate-950 focus:ring-indigo-500 dark:focus:ring-indigo-500" />
                  <label htmlFor="print-check" className="text-xs font-bold text-slate-700 dark:text-slate-300 dark:text-slate-300 uppercase tracking-wider">Restrict Printing Privileges</label>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={restrictEditing} onChange={(e) => setRestrictEditing(e.target.checked)} id="edit-check" className="w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-slate-700 dark:bg-slate-950 focus:ring-indigo-500 dark:focus:ring-indigo-500" />
                  <label htmlFor="edit-check" className="text-xs font-bold text-slate-700 dark:text-slate-300 dark:text-slate-300 uppercase tracking-wider">Restrict Content Copying & Editing</label>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 dark:text-slate-400 block mb-2">Enter Current Password</label>
              <input type="password" value={decryptionPassword} onChange={(e) => setDecryptionPassword(e.target.value)} placeholder="Type matching password to release document hold..." className={inputClassName} />
            </div>
          )}
        </div>

        {status && (
          <div className={`p-4 rounded-xl text-xs font-bold border transition-colors ${status.isError ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-500/30 text-red-700 dark:text-red-400' : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400'}`}>
            {status.text}
          </div>
        )}

        <button
          type="button"
          disabled={processing || !selectedFile}
          onClick={executeSecurityAction}
          className="w-full bg-slate-900 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md"
        >
          {processing ? 'Processing Crypto Tasks...' : (mode === 'lock' ? 'Secure PDF Document ➔' : 'Release Security Lock ➔')}
        </button>
      </div>
    </div>
  );
}