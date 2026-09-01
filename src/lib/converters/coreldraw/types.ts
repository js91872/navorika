export type CorelInputFormat = 'pdf' | 'png' | 'jpg' | 'doc' | 'docx' | 'svg' | 'ai' | 'eps' | 'cdr';
export type CorelOutputFormat = 'pdf' | 'svg' | 'eps' | 'png' | 'jpg';

export interface CorelCapabilities {
  docxToPdf: boolean;
  pdfToSvg: boolean;
  pdfToEps: boolean;
  postscriptToPdf: boolean;
  rasterVectorization: boolean;
  cdrRead: boolean;
  cdrWrite: false;
  nativeCdrReason: string;
}

export interface CdrWriterProvider {
  available(): Promise<boolean>;
  convert(inputPath: string, options: Record<string, unknown>): Promise<{ path: string; version?: string }>;
}

export type ServerConversionKind =
  | 'word-to-corel'
  | 'pdf-to-corel'
  | 'svg-to-corel'
  | 'ai-to-corel'
  | 'eps-to-corel'
  | 'cdr-viewer'
  | 'cdr-to-pdf'
  | 'cdr-to-svg'
  | 'cdr-to-png'
  | 'cdr-to-jpg'
  | 'cdr-to-eps';
