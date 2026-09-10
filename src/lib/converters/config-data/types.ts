export type ConfigDataFormat = 'json' | 'yaml' | 'toml';

export interface ParseErrorDetail {
  message: string;
  line?: number;
  column?: number;
  snippet?: string;
}

export interface ConversionSuccess<T = unknown> {
  success: true;
  data: string;
  parsed: T;
  byteSize: number;
}

export interface ConversionFailure {
  success: false;
  error: string;
  line?: number;
  column?: number;
  snippet?: string;
}

export type ConversionResult<T = unknown> = ConversionSuccess<T> | ConversionFailure;

export interface ValidationSuccess {
  valid: true;
  format: ConfigDataFormat;
  message: string;
  stats: {
    lineCount: number;
    byteSize: number;
    topLevelKeys?: number;
    arrayItems?: number;
    valueType: string;
  };
}

export interface ValidationFailure {
  valid: false;
  format: ConfigDataFormat;
  message: string;
  line?: number;
  column?: number;
  snippet?: string;
}

export type ValidationResult = ValidationSuccess | ValidationFailure;

export interface ConversionOptions {
  indent?: 2 | 4;
  sortKeys?: boolean;
}
