'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

type PDFMode = 'merge' | 'delete_pages';

export default function PDFToolsHub() {
  const [mode, setMode] = useState<PDFMode>('merge');
  const [files, setFiles] = useState<File[]>([]);
  const [targetFile, setTargetFile] = useState<File | null>(null);
  const [pageNumbersToDelete, setPageNumbersToDelete] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (mode === 'merge') {
        setFiles((prev) => [...prev, ...selectedFiles]);
      } else {
        setTargetFile(selectedFiles[0] || null);
      }
      setStatusMessage(null);
    }
  };

  const clearFiles = () => {
    setFiles([]);
    setTargetFile(null);
    setStatusMessage(null);
  };

  // 100% Client-Side PDF Merging Operation
  const executeMergePDF = async () => {
    if (files.length < 2) {
      setStatusMessage({ text: "Please add at least 2 PDF files to combine.", isError: true });
      return;
    }
    setProcessing(true);
    setStatusMessage(null);

    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const file of files) {
        const fileBytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileBytes);
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      downloadBlob(mergedPdfBytes, "Navorika_Merged.pdf");
      setStatusMessage({ text: "Success! PDFs combined cleanly.", isError: false });
    } catch (error) {
      console.error(error);
      setStatusMessage({ text: "Failed to parse files. Ensure they are valid, unencrypted PDFs.", isError: true });
    } finally {
      setProcessing(false);
    }
  };

  // 100% Client-Side Page Deletion Operation
  const executeDeletePages = async () => {
    if (!targetFile) {
      setStatusMessage({ text: "Please upload a target PDF document first.", isError: true });
      return;
    }
    if (!pageNumbersToDelete.trim()) {
      setStatusMessage({ text: "Enter specific page indices to remove (e.g., 1, 3).", isError: true });
      return;
    }
    setProcessing(true);
    setStatusMessage(null);

    try {
      const fileBytes = await targetFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBytes);
      
      // Parse targets: "1, 3, 5" -> zero-based indices [0, 2, 4] sorted in descending order to avoid sliding indexing shifting shifts
      const indicesToRemove = pageNumbersToDelete
        .split(',')
        .map((num) => parseInt(num.trim(), 10) - 1)
        .filter((idx) => !isNaN(idx) && idx >= 0 && idx < pdfDoc.getPageCount())
        .sort((a, b) => b - a);

      if (indicesToRemove.length === 0) {
        setStatusMessage({ text: "No valid matching page indexes found for this document range.", isError: true });
        setProcessing(false);
        return;
      }

      indicesToRemove.forEach((index) => {
        pdfDoc.removePage(index);
      });

      const modifiedPdfBytes = await pdfDoc.save();
      downloadBlob(modifiedPdfBytes, "Navorika_Restructured.pdf");
      setStatusMessage({ text: `Successfully removed ${indicesToRemove.length} pages.`, isError: false });
    } catch (error) {
      console.error(error);
      setStatusMessage({ text: "Error editing PDF structure. Check page bounds.", isError: true });
    } finally {
      setProcessing(false);
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

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pro PDF Utilities Hub</h1>
        <p className="text-slate-600 mt-2 text-sm max-w-2xl">
          Lightning-fast document modification tools operating entirely inside your browser cache. Secure client execution safeguards complete asset confidentiality.
        </p>
      </div>

      {/* Mode Switches */}
      <div className="flex border border-slate-200 rounded-xl p-1 bg-white max-w-sm mb-8 shadow-sm">
        <button
          onClick={() => { setMode('merge'); clearFiles(); }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${mode === 'merge' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Merge Documents
        </button>
        <button
          onClick={() => { setMode('delete_pages'); clearFiles(); }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${mode === 'delete_pages' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Delete PDF Pages
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Upload Dropzone wrapper */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-3">
            {mode === 'merge' ? 'Upload PDF Documents to Combine' : 'Select Source PDF Document'}
          </label>
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50 hover:bg-slate-100/60 transition-colors relative cursor-pointer group">
            <input
              type="file"
              accept=".pdf"
              multiple={mode === 'merge'}
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="text-2xl mb-2">📄</div>
            <p className="text-sm font-semibold text-slate-700">Click to browse or drop assets here</p>
            <p className="text-xs text-slate-400 mt-1">Accepts localized standard unencrypted .pdf files</p>
          </div>
        </div>

        {/* Selected Inventory Queue Grid list render */}
        {mode === 'merge' && files.length > 0 && (
          <div className="pt-2">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase text-slate-500">File Inventory ({files.length})</span>
              <button onClick={clearFiles} className="text-xs font-bold text-red-500 hover:text-red-700">Clear All</button>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl divide-y divide-slate-200">
              {files.map((file, i) => (
                <div key={i} className="px-4 py-3 flex items-center justify-between text-xs font-medium text-slate-700">
                  <span className="truncate max-w-xs sm:max-w-md">📄 {file.name}</span>
                  <span className="text-slate-400 font-mono">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {mode === 'delete_pages' && targetFile && (
          <div className="pt-2 space-y-4">
            <div className="flex justify-between items-center text-xs font-medium bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-slate-700">
              <span className="truncate">🎯 Target: {targetFile.name}</span>
              <button onClick={clearFiles} className="text-red-500 font-bold hover:text-red-700">Remove</button>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">
                Specify Page Numbers to Delete (Comma Separated)
              </label>
              <input
                type="text"
                value={pageNumbersToDelete}
                onChange={(e) => setPageNumbersToDelete(e.target.value)}
                placeholder="e.g. 1, 4, 7"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                Provide strict 1-based structural numbers. For instance, inputting &quot;2, 5&quot; completely removes pages 2 and 5 from the final document layout output shell.
              </p>
            </div>
          </div>
        )}

        {/* Output Status Messaging Alert box */}
        {statusMessage && (
          <div className={`p-4 rounded-xl text-xs font-bold border ${statusMessage.isError ? 'bg-red-50 border-red-100 text-red-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
            {statusMessage.text}
          </div>
        )}

        {/* Action Button trigger */}
        <div className="pt-2">
          <button
            type="button"
            disabled={processing || (mode === 'merge' ? files.length < 2 : !targetFile)}
            onClick={mode === 'merge' ? executeMergePDF : executeDeletePages}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-3.5 rounded-xl text-sm shadow-md shadow-indigo-600/10 transition-all flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Processing Document Remapping Locally...
              </>
            ) : mode === 'merge' ? (
              'Combine Documents ➔'
            ) : (
              'Restructure & Strip Pages ➔'
            )}
          </button>
        </div>
      </div>

      {/* Trust privacy bar metadata footer */}
      <div className="mt-8 p-5 rounded-2xl border border-slate-100 bg-white shadow-inner flex items-center gap-3 text-xs text-slate-500 font-medium">
        <span className="text-emerald-500 text-base animate-pulse">🔒</span>
        <p>
          <span className="text-slate-800 font-bold">100% Secure Client Pipeline Sandbox:</span> Navorika runs document processing inside local worker compilation space. Absolutely zero bytes leave your local storage matrix.
        </p>
      </div>
    </div>
  );
}
