"use client";

import { useState, useCallback } from "react";
import { Upload, X, FileText, Download, Loader2, CheckCircle, File } from "lucide-react";
import { useDropzone } from "react-dropzone";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PDFFile, formatFileSize, generateId } from "@/lib/calculations/pdf-utils";

export default function PDFToWord() {
  const [file, setFile] = useState<PDFFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ 
    success: boolean; 
    message: string; 
    outputUrl?: string; 
    outputSize?: number;
    fileName?: string;
  } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFile({
        id: generateId(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        file,
      });
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  const removeFile = () => {
    if (file) URL.revokeObjectURL(file.url);
    setFile(null);
    setResult(null);
  };

  const handleConvert = async () => {
    if (!file) {
      setResult({ success: false, message: "Please upload a PDF file first." });
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      // For demonstration, we'll simulate the conversion
      // In production, this would call an API or use a library
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a dummy Word document (in production, this would be actual conversion)
      const dummyWordBlob = new Blob(
        ['This is a simulated Word document. In production, this would be the actual converted PDF to Word content.'],
        { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
      );
      const url = URL.createObjectURL(dummyWordBlob);

      setResult({
        success: true,
        message: "PDF converted to Word successfully! (Simulated)",
        outputUrl: url,
        outputSize: dummyWordBlob.size,
        fileName: file.name.replace('.pdf', '.docx'),
      });
    } catch (error) {
      setResult({
        success: false,
        message: "Conversion failed. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result?.outputUrl) {
      const link = document.createElement('a');
      link.href = result.outputUrl;
      link.download = result.fileName || 'converted.docx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="PDF to Word"
        description="Convert PDF files to editable Word documents."
        icon="📄→📝"
        accuracy="Processed securely"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {!file && !result?.success && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition cursor-pointer ${
              isDragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <p className="text-lg font-medium text-slate-700">
              {isDragActive ? 'Drop PDF file here' : 'Drag & drop a PDF file'}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              or click to browse (max 1 file)
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Supports .pdf files only
            </p>
          </div>
        )}

        {file && !result?.success && (
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
            <FileText className="h-5 w-5 text-slate-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">
                {file.name}
              </p>
              <p className="text-xs text-slate-500">
                {formatFileSize(file.size)}
              </p>
            </div>
            <button
              onClick={removeFile}
              className="rounded-lg p-1 hover:bg-slate-100 transition"
            >
              <X className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        )}

        {file && !result?.success && (
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleConvert}
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <File className="mr-2 h-4 w-4" />
                  Convert to Word
                </>
              )}
            </Button>
          </div>
        )}

        {result && (
          <Card className={`p-6 ${result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <div className="flex items-start gap-4">
              {result.success ? (
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              ) : (
                <X className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                  {result.message}
                </p>
                {result.success && result.outputUrl && (
                  <Button
                    onClick={handleDownload}
                    className="mt-3"
                    size="sm"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Word Document
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>
    </CalculatorShell>
  );
}
