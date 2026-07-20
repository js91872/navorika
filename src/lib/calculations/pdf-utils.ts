import { PDFDocument } from 'pdf-lib';

export interface PDFFile {
  id: string;
  name: string;
  size: number;
  type: string;
  pages?: number;
  url: string;
  file: File;
}

export interface PDFResult {
  success: boolean;
  message: string;
  outputUrl?: string;
  outputSize?: number;
  pageCount?: number;
  fileName?: string;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Actual PDF Merge Function
export async function mergePDFs(files: File[]): Promise<PDFResult> {
  try {
    const mergedPdf = await PDFDocument.create();
    let totalPages = 0;

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => {
        mergedPdf.addPage(page);
        totalPages++;
      });
    }

    const pdfBytes = await mergedPdf.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    return {
      success: true,
      message: `Successfully merged ${files.length} files into 1 PDF with ${totalPages} pages!`,
      outputUrl: url,
      outputSize: blob.size,
      pageCount: totalPages,
      fileName: `merged-${Date.now()}.pdf`,
    };
  } catch (error) {
    console.error('Merge error:', error);
    return {
      success: false,
      message: 'Failed to merge PDFs. Please make sure the files are valid PDFs.',
    };
  }
}

// Actual PDF Split Function
export async function splitPDF(file: File, pageRanges: string): Promise<PDFResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const totalPages = pdf.getPageCount();

    const ranges = pageRanges.split(',').map(r => r.trim());
    const resultFiles: Blob[] = [];
    
    for (const range of ranges) {
      const [start, end] = range.split('-').map(Number);
      
      if (isNaN(start) || (end !== undefined && isNaN(end))) {
        return {
          success: false,
          message: `Invalid page range: ${range}. Please use format like "1-3" or "4".`,
        };
      }

      const startPage = Math.max(1, start);
      const endPage = end !== undefined ? Math.min(totalPages, end) : startPage;

      if (startPage > totalPages || endPage > totalPages) {
        return {
          success: false,
          message: `Page range ${range} exceeds total pages (${totalPages}).`,
        };
      }

      const newPdf = await PDFDocument.create();
      const pageIndices = [];
      for (let i = startPage - 1; i < endPage; i++) {
        pageIndices.push(i);
      }
      const pages = await newPdf.copyPages(pdf, pageIndices);
      pages.forEach((page) => newPdf.addPage(page));
      
      const pdfBytes = await newPdf.save();
      resultFiles.push(new Blob([pdfBytes], { type: 'application/pdf' }));
    }

    if (resultFiles.length === 1) {
      const url = URL.createObjectURL(resultFiles[0]);
      return {
        success: true,
        message: `Successfully extracted pages ${pageRanges}!`,
        outputUrl: url,
        outputSize: resultFiles[0].size,
        pageCount: pdf.getPageCount(),
        fileName: `split-${Date.now()}.pdf`,
      };
    }

    const url = URL.createObjectURL(resultFiles[0]);
    return {
      success: true,
      message: `Successfully split into ${resultFiles.length} files! Download the first file. (Multi-file download coming soon)`,
      outputUrl: url,
      outputSize: resultFiles[0].size,
      pageCount: pdf.getPageCount(),
      fileName: `split-${Date.now()}.pdf`,
    };
  } catch (error) {
    console.error('Split error:', error);
    return {
      success: false,
      message: 'Failed to split PDF. Please make sure the file is a valid PDF.',
    };
  }
}