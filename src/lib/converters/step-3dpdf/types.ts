export interface CadModelBbox {
  min: [number, number, number];
  max: [number, number, number];
  center: [number, number, number];
  dimensions: [number, number, number];
  diagonal: number;
}

export interface CadGeometryMetadata {
  solids: number;
  faces: number;
  edges: number;
  vertices: number;
  meshedFaces: number;
  meshNodes: number;
  triangles: number;
  bbox: CadModelBbox;
}

export interface StepConversionResult {
  pdfPath: string;
  pdfBytes: Uint8Array;
  fileName: string;
  metadata: CadGeometryMetadata;
}

export interface StepCapabilities {
  available: boolean;
  nativeEngine: boolean;
  asymptote: boolean;
  latex: boolean;
  ghostscript: boolean;
  maxUploadBytes: number;
}
