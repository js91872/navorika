'use client';

import { useState, useRef, useMemo, useEffect, useTransition } from 'react';
import {
  Upload,
  FileText,
  X,
  ShieldCheck,
  Download,
  Copy,
  Check,
  AlertCircle,
  AlertTriangle,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Search,
  BookOpen,
  Mic,
  HelpCircle,
  ArrowUpDown,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import {
  analyzeDocument,
  DEFAULT_COUNTING_OPTIONS,
  type CountingOptions,
  type DocumentAnalysisResult,
  type PageRawInput,
  type WordFrequencyItem,
  type PhraseFrequencyItem,
} from '@/lib/calculations/pdfWordCounter';
import { extractPdfTextPages, type ExtractionProgress } from '@/lib/pdf/pdfExtractor';
import { rowsToCsv } from '@/lib/resultExport';

type ActiveTab = 'summary' | 'pages' | 'frequency' | 'quality' | 'text';
type FrequencyMode = 'single' | 'bigram' | 'trigram';
type SortField = 'page' | 'words' | 'chars' | 'sentences' | 'time';
type SortOrder = 'asc' | 'desc';
type FreqSortField = 'count' | 'alpha' | 'percentage';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PdfWordCounterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [rawPages, setRawPages] = useState<PageRawInput[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState<ExtractionProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState<ActiveTab>('summary');
  const [showOptions, setShowOptions] = useState(false);
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [options, setOptions] = useState<CountingOptions>(DEFAULT_COUNTING_OPTIONS);

  // Sorting & Filtering for Page table
  const [pageSortField, setPageSortField] = useState<SortField>('page');
  const [pageSortOrder, setPageSortOrder] = useState<SortOrder>('asc');
  const [previewPageNumber, setPreviewPageNumber] = useState<number | null>(null);

  // Frequency tab state
  const [freqMode, setFreqMode] = useState<FrequencyMode>('single');
  const [freqSearch, setFreqSearch] = useState('');
  const [freqPreset, setFreqPreset] = useState<number>(25); // 10, 25, 50, -1 (all)
  const [freqSortField, setFreqSortField] = useState<FreqSortField>('count');
  const [freqSortOrder, setFreqSortOrder] = useState<SortOrder>('desc');

  // Extracted text tab state
  const [textSearch, setTextSearch] = useState('');
  const [selectedTextPage, setSelectedTextPage] = useState<number | 'all'>('all');

  // Copy feedback state
  const [copiedAction, setCopiedAction] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Clean up ongoing extraction on component unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const triggerCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAction(key);
    setTimeout(() => setCopiedAction(null), 2000);
  };

  // Run calculation analysis whenever rawPages or options change
  const analysis: DocumentAnalysisResult | null = useMemo(() => {
    if (!rawPages.length) return null;
    return analyzeDocument(rawPages, options);
  }, [rawPages, options]);

  // Handle file selection
  const handleFile = async (selected: File) => {
    if (selected.type !== 'application/pdf' && !selected.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a valid PDF file (.pdf).');
      return;
    }

    if (selected.size === 0) {
      setError('The selected file is empty (0 bytes).');
      return;
    }

    // Abort any previous ongoing extraction before starting a new one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Reset previous state
    setError(null);
    setRawPages([]);
    setProgress({ currentPage: 0, totalPages: 0, percent: 0 });
    setIsExtracting(true);
    setFile(selected);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const buffer = await selected.arrayBuffer();
      const extracted = await extractPdfTextPages(buffer, {
        onProgress: (prog) => {
          if (!abortController.signal.aborted) {
            setProgress(prog);
          }
        },
        signal: abortController.signal,
      });

      if (abortController.signal.aborted) {
        return;
      }

      startTransition(() => {
        setRawPages(extracted);
      });
    } catch (err: unknown) {
      if (abortController.signal.aborted) {
        return;
      }
      if (err instanceof Error) {
        if (err.message.includes('cancelled')) {
          return;
        }
        setError(err.message);
      } else {
        setError('Failed to extract text from this PDF.');
      }
      setFile(null);
    } finally {
      if (abortControllerRef.current === abortController) {
        setIsExtracting(false);
        setProgress(null);
        abortControllerRef.current = null;
      }
    }
  };

  const handleCancelExtraction = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsExtracting(false);
    setProgress(null);
    setFile(null);
    setRawPages([]);
  };

  const handleReset = () => {
    handleCancelExtraction();
    setError(null);
    setFile(null);
    setRawPages([]);
    setOptions(DEFAULT_COUNTING_OPTIONS);
    setActiveTab('summary');
    setPreviewPageNumber(null);
    setShowOptions(false);
    setShowAssumptions(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag and Drop handlers
  const [isDragging, setIsDragging] = useState(false);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Sorted Pages list
  const sortedPages = useMemo(() => {
    if (!analysis) return [];
    const list = [...analysis.pageMetrics];
    list.sort((a, b) => {
      let valA = 0;
      let valB = 0;
      if (pageSortField === 'page') {
        valA = a.pageNumber;
        valB = b.pageNumber;
      } else if (pageSortField === 'words') {
        valA = a.words;
        valB = b.words;
      } else if (pageSortField === 'chars') {
        valA = a.charactersWithSpaces;
        valB = b.charactersWithSpaces;
      } else if (pageSortField === 'sentences') {
        valA = a.sentences;
        valB = b.sentences;
      } else if (pageSortField === 'time') {
        valA = a.readingTimeMinutes;
        valB = b.readingTimeMinutes;
      }
      return pageSortOrder === 'asc' ? valA - valB : valB - valA;
    });
    return list;
  }, [analysis, pageSortField, pageSortOrder]);

  // Filtered Frequency list
  const filteredFrequencies = useMemo(() => {
    if (!analysis) return [];
    let list: (WordFrequencyItem | PhraseFrequencyItem)[] = [];
    if (freqMode === 'single') {
      list = analysis.wordFrequencies;
    } else if (freqMode === 'bigram') {
      list = analysis.twoWordPhrases;
    } else {
      list = analysis.threeWordPhrases;
    }

    if (freqSearch.trim()) {
      const q = freqSearch.toLowerCase().trim();
      list = list.filter((item) => {
        const text = 'word' in item ? item.word : item.phrase;
        return text.toLowerCase().includes(q);
      });
    }

    list = [...list].sort((a, b) => {
      if (freqSortField === 'alpha') {
        const textA = 'word' in a ? a.word : a.phrase;
        const textB = 'word' in b ? b.word : b.phrase;
        return freqSortOrder === 'asc' ? textA.localeCompare(textB) : textB.localeCompare(textA);
      }
      if (freqSortField === 'percentage') {
        return freqSortOrder === 'asc' ? a.percentage - b.percentage : b.percentage - a.percentage;
      }
      return freqSortOrder === 'asc' ? a.count - b.count : b.count - a.count;
    });

    if (freqPreset > 0) {
      list = list.slice(0, freqPreset);
    }

    return list;
  }, [analysis, freqMode, freqSearch, freqPreset, freqSortField, freqSortOrder]);

  // Export handlers
  const handleDownloadPagesCsv = () => {
    if (!analysis) return;
    const rows = [
      ['Page Number', 'Words', 'Characters (with spaces)', 'Characters (no spaces)', 'Sentences', 'Paragraphs', 'Reading Time (sec)', 'Status'],
      ...analysis.pageMetrics.map((p) => [
        p.pageNumber,
        p.words,
        p.charactersWithSpaces,
        p.charactersWithoutSpaces,
        p.sentences,
        p.paragraphs,
        p.readingTimeMinutes * 60,
        p.hasExtractableText ? 'Extractable' : 'No text (Scanned/Empty)',
      ]),
    ];
    const csvContent = rowsToCsv(rows);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name?.replace(/\.pdf$/i, '') || 'document'}_page_statistics.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadFreqCsv = () => {
    if (!analysis) return;
    const isSingle = freqMode === 'single';
    const rows = isSingle
      ? [
          ['Rank', 'Word', 'Occurrences', 'Percentage (%)', 'Page Count', 'Pages'],
          ...analysis.wordFrequencies.map((f, idx) => [
            idx + 1,
            f.word,
            f.count,
            f.percentage,
            f.pageCount,
            f.compactPages,
          ]),
        ]
      : [
          ['Rank', 'Phrase', 'Occurrences', 'Percentage (%)'],
          ...(freqMode === 'bigram' ? analysis.twoWordPhrases : analysis.threeWordPhrases).map(
            (p, idx) => [idx + 1, p.phrase, p.count, p.percentage]
          ),
        ];

    const csvContent = rowsToCsv(rows);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name?.replace(/\.pdf$/i, '') || 'document'}_${freqMode}_frequencies.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadText = () => {
    if (!analysis || !analysis.extractedText) return;
    const blob = new Blob([analysis.extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name?.replace(/\.pdf$/i, '') || 'document'}_extracted_text.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copySummaryMarkdown = () => {
    if (!analysis || !file) return;
    const summary = [
      `# PDF Word Count Summary: ${file.name}`,
      `- Total Words: ${analysis.totalWords.toLocaleString()}`,
      `- Unique Words: ${analysis.uniqueWords.toLocaleString()} (${analysis.lexicalDensity}% lexical density)`,
      `- Characters (with spaces): ${analysis.charactersWithSpaces.toLocaleString()}`,
      `- Characters (no spaces): ${analysis.charactersWithoutSpaces.toLocaleString()}`,
      `- Sentences: ${analysis.totalSentences.toLocaleString()}`,
      `- Paragraphs: ${analysis.totalParagraphs.toLocaleString()}`,
      `- Total Pages: ${analysis.totalPages} (${analysis.pagesWithText} with text)`,
      `- Est. Reading Time: ${analysis.estimatedReadingTime.formatted} (@ 225 wpm)`,
      `- Est. Speaking Time: ${analysis.estimatedSpeakingTime.formatted} (@ 130 wpm)`,
      `- Readability: ${analysis.writingQuality.fleschReadingEase} (${analysis.writingQuality.readabilityInterpretation})`,
    ].join('\n');
    triggerCopy('summary', summary);
  };

  return (
    <div className="space-y-8">
      {/* Upload Zone & Privacy Area */}
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload PDF document to count words"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className={`group relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 text-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            isDragging
              ? 'border-indigo-600 bg-indigo-500/10'
              : 'border-[var(--border)] bg-[var(--card)] hover:border-indigo-500/50 hover:bg-indigo-500/5'
          }`}
        >
          <div className="grid size-16 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
            <Upload className="size-8" />
          </div>

          <h3 className="mt-5 text-xl font-bold text-[var(--foreground)]">
            Drop your PDF here, or <span className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-300">browse files</span>
          </h3>
          <p className="mt-2 text-sm text-[var(--muted-foreground)] max-w-md">
            Works with normal text-based PDFs. Supports multi-page documents, research papers, ebooks, essays, and reports.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="size-4" />
            Your PDF is processed locally in your browser and never uploaded.
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />
        </div>
      ) : (
        /* Processing or Completed Header Bar */
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <FileText className="size-6" />
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-base font-bold text-[var(--foreground)] sm:text-lg">
                  {file.name}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted-foreground)]">
                  <span>{formatFileSize(file.size)}</span>
                  {rawPages.length > 0 && <span>• {rawPages.length} pages extracted</span>}
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="size-3.5" /> Processed Locally
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowOptions(!showOptions)}
                aria-expanded={showOptions}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2 text-xs font-semibold text-[var(--foreground)] hover:border-indigo-500/50 hover:bg-indigo-500/5 transition focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <SlidersHorizontal className="size-3.5" />
                Counting Options
                {showOptions ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
              </button>

              <button
                type="button"
                onClick={handleReset}
                aria-label="Remove file and count another PDF"
                className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 hover:border-rose-500/30 transition focus-visible:ring-2 focus-visible:ring-rose-500"
              >
                <X className="size-4" />
                Reset
              </button>
            </div>
          </div>

          {/* Active Extraction Progress Bar */}
          {isExtracting && progress && (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-indigo-600 animate-ping" />
                  Extracting text: Page {progress.currentPage} of {progress.totalPages || '...'}
                </span>
                <span className="text-[var(--muted-foreground)]">{progress.percent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-full bg-indigo-600 transition-all duration-150"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
              <div className="text-right">
                <button
                  type="button"
                  onClick={handleCancelExtraction}
                  className="text-xs text-rose-600 hover:underline"
                >
                  Cancel extraction
                </button>
              </div>
            </div>
          )}

          {/* Expandable Counting Options Panel */}
          {showOptions && (
            <div className="pt-4 border-t border-[var(--border)] mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeNumbers}
                  onChange={(e) => setOptions({ ...options, includeNumbers: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-medium text-[var(--foreground)]">Include numbers (e.g. 2026, 15.5%)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeUrls}
                  onChange={(e) => setOptions({ ...options, includeUrls: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-medium text-[var(--foreground)]">Include URLs as words</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeEmails}
                  onChange={(e) => setOptions({ ...options, includeEmails: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-medium text-[var(--foreground)]">Include email addresses</span>
              </label>

              <div className="space-y-1">
                <span className="font-medium text-[var(--foreground)] block">Hyphenated Words</span>
                <select
                  value={options.hyphenatedWordMode}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      hyphenatedWordMode: e.target.value as 'single' | 'split',
                    })
                  }
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] p-1.5 text-xs text-[var(--foreground)] focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="single">Count as 1 word (e.g. well-known = 1)</option>
                  <option value="split">Split into words (e.g. well-known = 2)</option>
                </select>
              </div>

              <div className="space-y-1">
                <span className="font-medium text-[var(--foreground)] block">Header / Footer Exclusion</span>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={options.excludeHeaderFooter}
                    onChange={(e) => setOptions({ ...options, excludeHeaderFooter: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-[var(--foreground)]">Exclude repeated headers & footers</span>
                </label>
              </div>

              <div className="space-y-1">
                <span className="font-medium text-[var(--foreground)] block">Page Range</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={rawPages.length || 1}
                    placeholder="From"
                    value={options.pageRange ? options.pageRange[0] : ''}
                    onChange={(e) => {
                      const from = Number.parseInt(e.target.value, 10);
                      if (Number.isNaN(from)) {
                        setOptions({ ...options, pageRange: null });
                      } else {
                        const to = options.pageRange ? options.pageRange[1] : rawPages.length;
                        setOptions({ ...options, pageRange: [from, Math.max(from, to)] });
                      }
                    }}
                    className="w-20 rounded-lg border border-[var(--border)] bg-[var(--background)] p-1.5 text-xs text-[var(--foreground)]"
                  />
                  <span>to</span>
                  <input
                    type="number"
                    min={1}
                    max={rawPages.length || 1}
                    placeholder="To"
                    value={options.pageRange ? options.pageRange[1] : ''}
                    onChange={(e) => {
                      const to = Number.parseInt(e.target.value, 10);
                      if (Number.isNaN(to)) {
                        setOptions({ ...options, pageRange: null });
                      } else {
                        const from = options.pageRange ? options.pageRange[0] : 1;
                        setOptions({ ...options, pageRange: [Math.min(from, to), to] });
                      }
                    }}
                    className="w-20 rounded-lg border border-[var(--border)] bg-[var(--background)] p-1.5 text-xs text-[var(--foreground)]"
                  />
                  {options.pageRange && (
                    <button
                      type="button"
                      onClick={() => setOptions({ ...options, pageRange: null })}
                      className="text-xs text-indigo-600 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-sm text-rose-800 dark:text-rose-200"
        >
          <AlertCircle className="size-5 shrink-0 mt-0.5 text-rose-600" />
          <div className="flex-1">
            <h4 className="font-bold">PDF Extraction Error</h4>
            <p className="mt-1 text-xs opacity-90">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-600 hover:text-rose-800"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Scanned PDF Warning Banner */}
      {analysis && analysis.isLikelyScanned && (
        <div
          role="alert"
          className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm text-amber-900 dark:text-amber-200 space-y-2"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div>
              <h4 className="font-bold">This PDF appears to contain scanned images rather than selectable text.</h4>
              <p className="mt-1 text-xs text-amber-800 dark:text-amber-300 leading-5">
                A standard PDF word counter inspects embedded digital text characters. Scanned documents and photograph-only PDFs store graphical pictures of pages without an underlying selectable text layer.
              </p>
              {analysis.scannedPages.length > 0 && (
                <p className="mt-2 text-xs font-semibold">
                  Pages with no selectable text: {analysis.scannedPages.slice(0, 20).join(', ')}
                  {analysis.scannedPages.length > 20 ? ' ...' : ''}
                </p>
              )}
              <p className="mt-2 text-xs opacity-80">
                To count words in image-only scans, run an Optical Character Recognition (OCR) tool on your PDF to generate a searchable text layer, then reload the document here.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Analysis Results Interface */}
      {analysis && (
        <div className="space-y-6">
          {/* Result Navigation Tabs */}
          <div
            role="tablist"
            aria-label="PDF Word Counter Results"
            className="flex flex-wrap gap-2 border-b border-[var(--border)] pb-3"
          >
            {[
              { id: 'summary', label: 'Summary', count: `${analysis.totalWords.toLocaleString()} words` },
              { id: 'pages', label: 'Pages', count: `${analysis.pageMetrics.length} pages` },
              { id: 'frequency', label: 'Repeated Words', count: `${analysis.wordFrequencies.length} unique` },
              { id: 'quality', label: 'Writing Quality', count: `${analysis.writingQuality.totalIssues} checks` },
              { id: 'text', label: 'Extracted Text', count: `${formatFileSize(analysis.extractedText.length)}` },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-[var(--muted-foreground)] hover:bg-[var(--card)] hover:text-[var(--foreground)]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-normal ${
                      isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-[var(--border)] text-[var(--muted-foreground)]'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: SUMMARY DASHBOARD */}
          {activeTab === 'summary' && (
            <div id="panel-summary" role="tabpanel" aria-labelledby="tab-summary" className="space-y-6">
              {/* Primary metric cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                    Total Words
                  </span>
                  <div className="mt-2 text-3xl font-black text-indigo-600 dark:text-indigo-400">
                    {analysis.totalWords.toLocaleString()}
                  </div>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    {analysis.uniqueWords.toLocaleString()} unique ({analysis.lexicalDensity}% density)
                  </p>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                    Characters
                  </span>
                  <div className="mt-2 text-3xl font-black text-[var(--foreground)]">
                    {analysis.charactersWithSpaces.toLocaleString()}
                  </div>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    {analysis.charactersWithoutSpaces.toLocaleString()} excluding spaces
                  </p>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                    Sentences & Paragraphs
                  </span>
                  <div className="mt-2 text-3xl font-black text-[var(--foreground)]">
                    {analysis.totalSentences.toLocaleString()}
                  </div>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    Across {analysis.totalParagraphs.toLocaleString()} paragraphs
                  </p>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                    Pages with Text
                  </span>
                  <div className="mt-2 text-3xl font-black text-emerald-600 dark:text-emerald-400">
                    {analysis.pagesWithText} <span className="text-lg font-normal text-[var(--muted-foreground)]">/ {analysis.totalPages}</span>
                  </div>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    {analysis.scannedPages.length > 0 ? `${analysis.scannedPages.length} pages without text` : 'All pages contain text'}
                  </p>
                </div>
              </div>

              {/* Timing & Readability row */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 flex items-start gap-4">
                  <div className="grid size-11 place-items-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                    <BookOpen className="size-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                      Silent Reading Time
                    </span>
                    <div className="mt-1 text-2xl font-bold text-[var(--foreground)]">
                      {analysis.estimatedReadingTime.formatted}
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                      Based on standard 225 wpm silent pace
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 flex items-start gap-4">
                  <div className="grid size-11 place-items-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 shrink-0">
                    <Mic className="size-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                      Speaking / Speech Pace
                    </span>
                    <div className="mt-1 text-2xl font-bold text-[var(--foreground)]">
                      {analysis.estimatedSpeakingTime.formatted}
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                      Based on normal 130 wpm presentation pace
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 flex items-start gap-4">
                  <div className="grid size-11 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <FileCheck className="size-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                      Flesch Reading Ease
                    </span>
                    <div className="mt-1 text-2xl font-bold text-[var(--foreground)]">
                      {analysis.writingQuality.fleschReadingEase}
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5 truncate">
                      {analysis.writingQuality.readabilityInterpretation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Assumptions & Export Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssumptions(!showAssumptions)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <HelpCircle className="size-3.5" />
                  {showAssumptions ? 'Hide calculation assumptions' : 'View calculation assumptions'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={copySummaryMarkdown}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-xs font-semibold text-[var(--foreground)] hover:border-indigo-500/50 hover:bg-indigo-500/5 transition focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    {copiedAction === 'summary' ? (
                      <>
                        <Check className="size-3.5 text-emerald-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        Copy Summary
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadPagesCsv}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3.5 py-2 text-xs font-semibold hover:opacity-90 transition focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <Download className="size-3.5" />
                    Download CSV
                  </button>
                </div>
              </div>

              {/* Expandable Assumptions Card */}
              {showAssumptions && (
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-xs text-[var(--muted-foreground)] space-y-2">
                  <h4 className="font-bold text-[var(--foreground)] text-sm">Measurement Assumptions</h4>
                  <ul className="list-disc pl-5 space-y-1.5 leading-5">
                    <li>
                      <strong>Silent Reading Speed:</strong> 225 words per minute. Peer-reviewed reading research shows adult non-fiction silent reading ranges from 200 to 250 wpm.
                    </li>
                    <li>
                      <strong>Speaking Speed:</strong> 130 words per minute. Standard presentation and audio narration typically runs between 120 and 140 wpm.
                    </li>
                    <li>
                      <strong>Sentences:</strong> Defined by punctuation boundaries (. ? !), carefully accounting for common abbreviations (Mr., Dr., e.g., i.e., vs., Inc., etc.) so they do not falsely split sentences.
                    </li>
                    <li>
                      <strong>Paragraphs:</strong> Blocks of text separated by one or more blank line breaks.
                    </li>
                    <li>
                      <strong>Lexical Density:</strong> Percentage of distinct unique words compared to total words, indicating vocabulary breadth.
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PAGE-BY-PAGE ANALYSIS */}
          {activeTab === 'pages' && (
            <div id="panel-pages" role="tabpanel" aria-labelledby="tab-pages" className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-[var(--muted-foreground)]">
                  Showing metrics for {sortedPages.length} page{sortedPages.length === 1 ? '' : 's'}. Click table headers to sort.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadPagesCsv}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-xs font-semibold text-[var(--foreground)] hover:border-indigo-500/50 transition focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <Download className="size-3.5" />
                    Export Page Stats (CSV)
                  </button>
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[var(--border)] bg-[var(--background)]/60 text-[var(--muted-foreground)] uppercase tracking-wider font-semibold">
                    <tr>
                      <th
                        scope="col"
                        className="p-3.5 cursor-pointer hover:text-[var(--foreground)]"
                        onClick={() => {
                          if (pageSortField === 'page') setPageSortOrder(pageSortOrder === 'asc' ? 'desc' : 'asc');
                          else { setPageSortField('page'); setPageSortOrder('asc'); }
                        }}
                      >
                        <span className="flex items-center gap-1">Page <ArrowUpDown className="size-3" /></span>
                      </th>
                      <th
                        scope="col"
                        className="p-3.5 cursor-pointer hover:text-[var(--foreground)]"
                        onClick={() => {
                          if (pageSortField === 'words') setPageSortOrder(pageSortOrder === 'asc' ? 'desc' : 'asc');
                          else { setPageSortField('words'); setPageSortOrder('desc'); }
                        }}
                      >
                        <span className="flex items-center gap-1">Words <ArrowUpDown className="size-3" /></span>
                      </th>
                      <th
                        scope="col"
                        className="p-3.5 cursor-pointer hover:text-[var(--foreground)]"
                        onClick={() => {
                          if (pageSortField === 'chars') setPageSortOrder(pageSortOrder === 'asc' ? 'desc' : 'asc');
                          else { setPageSortField('chars'); setPageSortOrder('desc'); }
                        }}
                      >
                        <span className="flex items-center gap-1">Characters <ArrowUpDown className="size-3" /></span>
                      </th>
                      <th
                        scope="col"
                        className="p-3.5 cursor-pointer hover:text-[var(--foreground)]"
                        onClick={() => {
                          if (pageSortField === 'sentences') setPageSortOrder(pageSortOrder === 'asc' ? 'desc' : 'asc');
                          else { setPageSortField('sentences'); setPageSortOrder('desc'); }
                        }}
                      >
                        <span className="flex items-center gap-1">Sentences <ArrowUpDown className="size-3" /></span>
                      </th>
                      <th
                        scope="col"
                        className="p-3.5 cursor-pointer hover:text-[var(--foreground)]"
                        onClick={() => {
                          if (pageSortField === 'time') setPageSortOrder(pageSortOrder === 'asc' ? 'desc' : 'asc');
                          else { setPageSortField('time'); setPageSortOrder('desc'); }
                        }}
                      >
                        <span className="flex items-center gap-1">Reading Time <ArrowUpDown className="size-3" /></span>
                      </th>
                      <th scope="col" className="p-3.5">Status</th>
                      <th scope="col" className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {sortedPages.map((page) => {
                      const pageTextObj = analysis.filteredPages.find((p) => p.pageNumber === page.pageNumber);
                      const pageText = pageTextObj?.text || '';
                      return (
                        <tr key={page.pageNumber} className="hover:bg-indigo-500/5 transition">
                          <td className="p-3.5 font-bold text-[var(--foreground)]">
                            Page {page.pageNumber}
                          </td>
                          <td className="p-3.5 font-bold text-indigo-600 dark:text-indigo-400">
                            {page.words.toLocaleString()}
                          </td>
                          <td className="p-3.5 text-[var(--muted-foreground)]">
                            {page.charactersWithSpaces.toLocaleString()}{' '}
                            <span className="text-[10px] opacity-70">({page.charactersWithoutSpaces.toLocaleString()} no spaces)</span>
                          </td>
                          <td className="p-3.5 text-[var(--muted-foreground)]">
                            {page.sentences}
                          </td>
                          <td className="p-3.5 text-[var(--muted-foreground)]">
                            {page.readingTimeFormatted}
                          </td>
                          <td className="p-3.5">
                            {page.hasExtractableText ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                                <CheckCircle2 className="size-3" /> Extractable
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                                <AlertTriangle className="size-3" /> Scanned / Empty
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => setPreviewPageNumber(previewPageNumber === page.pageNumber ? null : page.pageNumber)}
                              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                              {previewPageNumber === page.pageNumber ? 'Hide Text' : 'View Text'}
                            </button>
                            <button
                              type="button"
                              onClick={() => triggerCopy(`page-${page.pageNumber}`, pageText)}
                              className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                            >
                              {copiedAction === `page-${page.pageNumber}` ? 'Copied' : 'Copy'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Single Page Text Preview Modal/Drawer */}
              {previewPageNumber !== null && (
                <div className="rounded-2xl border border-indigo-500/30 bg-[var(--card)] p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-[var(--foreground)]">
                      Text Preview — Page {previewPageNumber}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setPreviewPageNumber(null)}
                      className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    >
                      Close Preview
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={analysis.filteredPages.find((p) => p.pageNumber === previewPageNumber)?.text || '(No text on this page)'}
                    className="w-full min-h-40 rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 text-xs font-mono text-[var(--foreground)]"
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WORD FREQUENCY & REPEATED WORDS */}
          {activeTab === 'frequency' && (
            <div id="panel-frequency" role="tabpanel" aria-labelledby="tab-frequency" className="space-y-5">
              {/* Frequency Controls & Sub-modes */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] p-1">
                  <button
                    type="button"
                    onClick={() => setFreqMode('single')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      freqMode === 'single' ? 'bg-indigo-600 text-white' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    Single Words ({analysis.wordFrequencies.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFreqMode('bigram')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      freqMode === 'bigram' ? 'bg-indigo-600 text-white' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    2-Word Phrases ({analysis.twoWordPhrases.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFreqMode('trigram')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      freqMode === 'trigram' ? 'bg-indigo-600 text-white' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    3-Word Phrases ({analysis.threeWordPhrases.length})
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadFreqCsv}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] hover:border-indigo-500/50 transition focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <Download className="size-3.5" />
                    Download CSV
                  </button>
                </div>
              </div>

              {/* Filter bar */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
                {/* Search */}
                <div className="relative">
                  <Search className="size-3.5 absolute left-3 top-2.5 text-[var(--muted-foreground)]" />
                  <input
                    type="text"
                    placeholder="Search word or phrase..."
                    value={freqSearch}
                    onChange={(e) => setFreqSearch(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] pl-8 pr-3 py-2 text-xs text-[var(--foreground)] focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Preset filter */}
                <div className="flex items-center gap-2">
                  <span className="text-[var(--muted-foreground)]">Display:</span>
                  <select
                    value={freqPreset}
                    onChange={(e) => setFreqPreset(Number.parseInt(e.target.value, 10))}
                    className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--card)] p-2 text-xs text-[var(--foreground)]"
                  >
                    <option value={10}>Top 10</option>
                    <option value={25}>Top 25</option>
                    <option value={50}>Top 50</option>
                    <option value={-1}>All ({freqMode === 'single' ? analysis.wordFrequencies.length : freqMode === 'bigram' ? analysis.twoWordPhrases.length : analysis.threeWordPhrases.length})</option>
                  </select>
                </div>

                {/* Stop words toggle (for single words) */}
                {freqMode === 'single' && (
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--muted-foreground)]">Stop words:</span>
                    <select
                      value={options.stopWordsFilter || 'exclude'}
                      onChange={(e) =>
                        setOptions({
                          ...options,
                          stopWordsFilter: e.target.value as 'exclude' | 'include',
                        })
                      }
                      className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--card)] p-2 text-xs text-[var(--foreground)]"
                    >
                      <option value="exclude">Ignore Stop Words (e.g. the, and)</option>
                      <option value="include">Include Stop Words</option>
                    </select>
                  </div>
                )}

                {/* Minimum word length (for single words) */}
                {freqMode === 'single' && (
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--muted-foreground)]">Min Length:</span>
                    <select
                      value={options.minWordLength || 1}
                      onChange={(e) =>
                        setOptions({
                          ...options,
                          minWordLength: Number.parseInt(e.target.value, 10),
                        })
                      }
                      className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--card)] p-2 text-xs text-[var(--foreground)]"
                    >
                      <option value={1}>All lengths (1+)</option>
                      <option value={2}>2+ letters</option>
                      <option value={3}>3+ letters</option>
                      <option value={4}>4+ letters</option>
                      <option value={5}>5+ letters</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Frequencies Table */}
              <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[var(--border)] bg-[var(--background)]/60 text-[var(--muted-foreground)] uppercase tracking-wider font-semibold">
                    <tr>
                      <th scope="col" className="p-3.5 w-16">Rank</th>
                      <th
                        scope="col"
                        className="p-3.5 cursor-pointer hover:text-[var(--foreground)]"
                        onClick={() => {
                          if (freqSortField === 'alpha') setFreqSortOrder(freqSortOrder === 'asc' ? 'desc' : 'asc');
                          else { setFreqSortField('alpha'); setFreqSortOrder('asc'); }
                        }}
                      >
                        <span className="flex items-center gap-1">
                          {freqMode === 'single' ? 'Word' : 'Phrase'} <ArrowUpDown className="size-3" />
                        </span>
                      </th>
                      <th
                        scope="col"
                        className="p-3.5 cursor-pointer hover:text-[var(--foreground)]"
                        onClick={() => {
                          if (freqSortField === 'count') setFreqSortOrder(freqSortOrder === 'asc' ? 'desc' : 'asc');
                          else { setFreqSortField('count'); setFreqSortOrder('desc'); }
                        }}
                      >
                        <span className="flex items-center gap-1">Count <ArrowUpDown className="size-3" /></span>
                      </th>
                      <th
                        scope="col"
                        className="p-3.5 cursor-pointer hover:text-[var(--foreground)]"
                        onClick={() => {
                          if (freqSortField === 'percentage') setFreqSortOrder(freqSortOrder === 'asc' ? 'desc' : 'asc');
                          else { setFreqSortField('percentage'); setFreqSortOrder('desc'); }
                        }}
                      >
                        <span className="flex items-center gap-1">% of Words <ArrowUpDown className="size-3" /></span>
                      </th>
                      {freqMode === 'single' && (
                        <th scope="col" className="p-3.5">Pages where found</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {filteredFrequencies.length === 0 ? (
                      <tr>
                        <td colSpan={freqMode === 'single' ? 5 : 4} className="p-8 text-center text-[var(--muted-foreground)]">
                          No matching words or phrases found.
                        </td>
                      </tr>
                    ) : (
                      filteredFrequencies.map((item, index) => {
                        const wordText = 'word' in item ? item.word : item.phrase;
                        const pageCount = 'pageCount' in item ? item.pageCount : null;
                        const compactPages = 'compactPages' in item ? item.compactPages : null;
                        return (
                          <tr key={`${wordText}-${index}`} className="hover:bg-indigo-500/5 transition">
                            <td className="p-3.5 text-[var(--muted-foreground)] font-mono">{index + 1}</td>
                            <td className="p-3.5 font-bold text-[var(--foreground)]">{wordText}</td>
                            <td className="p-3.5 font-bold text-indigo-600 dark:text-indigo-400">
                              {item.count.toLocaleString()}
                            </td>
                            <td className="p-3.5 text-[var(--muted-foreground)]">
                              <div className="flex items-center gap-2">
                                <span>{item.percentage}%</span>
                                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                                  <div
                                    className="h-full bg-indigo-500"
                                    style={{ width: `${Math.min(100, item.percentage * 5)}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            {freqMode === 'single' && (
                              <td className="p-3.5 text-[var(--muted-foreground)]">
                                <span className="font-semibold text-[var(--foreground)]">{pageCount} page{pageCount === 1 ? '' : 's'}</span>
                                {compactPages && <span className="opacity-75"> (pp. {compactPages})</span>}
                              </td>
                            )}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: WRITING QUALITY (BASIC WRITING CHECKS) */}
          {activeTab === 'quality' && (
            <div id="panel-quality" role="tabpanel" aria-labelledby="tab-quality" className="space-y-6">
              {/* Disclaimer */}
              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-xs text-[var(--muted-foreground)] leading-5">
                <span className="font-bold text-[var(--foreground)]">Basic Writing Checks:</span> Automated rule-based heuristics run 100% locally in your browser. No text is transmitted externally. These checks assist with mechanical consistency and readability, but do not replace human editorial proofreading.
              </div>

              {/* Readability & Metrics Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
                  <span className="text-xs text-[var(--muted-foreground)] uppercase font-semibold">
                    Flesch Reading Ease
                  </span>
                  <div className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {analysis.writingQuality.fleschReadingEase} / 100
                  </div>
                  <p className="mt-1 text-[11px] text-[var(--muted-foreground)]">
                    {analysis.writingQuality.readabilityInterpretation}
                  </p>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
                  <span className="text-xs text-[var(--muted-foreground)] uppercase font-semibold">
                    Flesch-Kincaid Grade
                  </span>
                  <div className="mt-1 text-2xl font-bold text-[var(--foreground)]">
                    Grade {analysis.writingQuality.fleschKincaidGradeLevel}
                  </div>
                  <p className="mt-1 text-[11px] text-[var(--muted-foreground)]">
                    US school grade readability equivalent
                  </p>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
                  <span className="text-xs text-[var(--muted-foreground)] uppercase font-semibold">
                    Avg Sentence Length
                  </span>
                  <div className="mt-1 text-2xl font-bold text-[var(--foreground)]">
                    {analysis.writingQuality.averageSentenceLength} words
                  </div>
                  <p className="mt-1 text-[11px] text-[var(--muted-foreground)]">
                    Standard target is 15–20 words per sentence
                  </p>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
                  <span className="text-xs text-[var(--muted-foreground)] uppercase font-semibold">
                    Difficult Words (3+ syl)
                  </span>
                  <div className="mt-1 text-2xl font-bold text-[var(--foreground)]">
                    {analysis.writingQuality.difficultWordsPercentage}%
                  </div>
                  <p className="mt-1 text-[11px] text-[var(--muted-foreground)]">
                    {analysis.writingQuality.difficultWordsCount} multi-syllable words
                  </p>
                </div>
              </div>

              {/* Potential Writing Issues List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[var(--foreground)]">
                    Detected Writing Observations ({analysis.writingQuality.totalIssues})
                  </h4>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {Object.entries(analysis.writingQuality.issueCountsByType).map(([type, count]) => {
                      if (count === 0) return null;
                      return (
                        <span key={type} className="rounded-full bg-[var(--border)] px-2.5 py-0.5 text-[11px] text-[var(--foreground)]">
                          {type.replace(/-/g, ' ')}: {count}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {analysis.writingQuality.issues.length === 0 ? (
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-xs text-[var(--muted-foreground)]">
                    <CheckCircle2 className="size-8 mx-auto text-emerald-600 mb-2" />
                    No mechanical inconsistencies (duplicate words, spacing errors, or excessively long sentences) detected.
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {analysis.writingQuality.issues.map((issue, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-[var(--foreground)]">{issue.title}</span>
                          {issue.pageNumber && (
                            <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                              Page {issue.pageNumber}
                            </span>
                          )}
                        </div>
                        <p className="text-[var(--muted-foreground)] leading-5">{issue.message}</p>
                        <div className="rounded bg-[var(--background)] p-2 font-mono text-[11px] text-slate-700 dark:text-slate-300 overflow-x-auto">
                          {issue.excerpt}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: EXTRACTED TEXT */}
          {activeTab === 'text' && (
            <div id="panel-text" role="tabpanel" aria-labelledby="tab-text" className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--muted-foreground)]">View:</span>
                    <select
                      value={selectedTextPage}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedTextPage(val === 'all' ? 'all' : Number.parseInt(val, 10));
                      }}
                      className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-2 text-xs text-[var(--foreground)]"
                    >
                      <option value="all">All Pages ({analysis.filteredPages.length})</option>
                      {analysis.filteredPages.map((p) => (
                        <option key={p.pageNumber} value={p.pageNumber}>
                          Page {p.pageNumber}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <Search className="size-3.5 absolute left-3 top-2.5 text-[var(--muted-foreground)]" />
                    <input
                      type="text"
                      placeholder="Find within text..."
                      value={textSearch}
                      onChange={(e) => setTextSearch(e.target.value)}
                      className="rounded-xl border border-[var(--border)] bg-[var(--card)] pl-8 pr-3 py-1.5 text-xs text-[var(--foreground)] focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const textToCopy =
                        selectedTextPage === 'all'
                          ? analysis.extractedText
                          : analysis.filteredPages.find((p) => p.pageNumber === selectedTextPage)?.text || '';
                      triggerCopy('extracted-text', textToCopy);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-xs font-semibold text-[var(--foreground)] hover:border-indigo-500/50 transition focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    {copiedAction === 'extracted-text' ? (
                      <>
                        <Check className="size-3.5 text-emerald-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        Copy Text
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadText}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3.5 py-2 text-xs font-semibold hover:opacity-90 transition focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <Download className="size-3.5" />
                    Download TXT
                  </button>
                </div>
              </div>

              {/* Text Display Box */}
              <div className="relative">
                <textarea
                  readOnly
                  aria-label="Extracted PDF text layer"
                  value={
                    selectedTextPage === 'all'
                      ? analysis.extractedText
                      : analysis.filteredPages.find((p) => p.pageNumber === selectedTextPage)?.text || '(No text extracted on this page)'
                  }
                  className="w-full min-h-96 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-xs font-mono leading-6 text-[var(--foreground)] focus:ring-2 focus:ring-indigo-500 select-text"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
