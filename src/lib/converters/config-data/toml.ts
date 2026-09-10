import * as TOML from 'smol-toml';
import type { ConversionOptions, ConversionResult, ValidationResult } from './types';
import { extractErrorSnippet, getByteSize, getLineCount, sortObjectKeys } from './utils';

export function parseTomlWithLocation(raw: string): {
  parsed?: Record<string, unknown>;
  error?: string;
  line?: number;
  column?: number;
  snippet?: string;
} {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { error: 'Input is empty' };
  }

  try {
    const parsed = TOML.parse(raw);
    return { parsed: parsed as Record<string, unknown> };
  } catch (err: unknown) {
    let line: number | undefined;
    let column: number | undefined;
    const message = err instanceof Error ? err.message : 'Invalid TOML syntax';

    if (err && typeof err === 'object') {
      if ('line' in err && typeof (err as { line: unknown }).line === 'number') {
        line = (err as { line: number }).line;
      }
      if ('column' in err && typeof (err as { column: unknown }).column === 'number') {
        column = (err as { column: number }).column;
      }
    }

    const snippet = extractErrorSnippet(raw, line, column);
    return {
      error: message,
      line,
      column,
      snippet,
    };
  }
}

export function validateToml(raw: string): ValidationResult {
  const { parsed, error, line, column, snippet } = parseTomlWithLocation(raw);
  if (error || parsed === undefined) {
    return {
      valid: false,
      format: 'toml',
      message: error ?? 'Invalid TOML',
      line,
      column,
      snippet,
    };
  }

  const topLevelKeys = Object.keys(parsed).length;

  return {
    valid: true,
    format: 'toml',
    message: 'Valid TOML document',
    stats: {
      lineCount: getLineCount(raw),
      byteSize: getByteSize(raw),
      topLevelKeys,
      valueType: 'table',
    },
  };
}

export function tomlToJson(raw: string, options: ConversionOptions = {}): ConversionResult {
  const { parsed, error, line, column, snippet } = parseTomlWithLocation(raw);
  if (error || parsed === undefined) {
    return {
      success: false,
      error: error ?? 'Invalid TOML syntax',
      line,
      column,
      snippet,
    };
  }

  try {
    let dataToConvert: unknown = parsed;
    if (options.sortKeys) {
      dataToConvert = sortObjectKeys(dataToConvert);
    }

    const indent = options.indent ?? 2;
    const jsonString = JSON.stringify(dataToConvert, null, indent);

    return {
      success: true,
      data: jsonString,
      parsed: dataToConvert,
      byteSize: getByteSize(jsonString),
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'JSON serialization failed',
    };
  }
}
