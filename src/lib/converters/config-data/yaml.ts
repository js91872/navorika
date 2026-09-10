import YAML from 'yaml';
import type { ConversionOptions, ConversionResult, ValidationResult } from './types';
import { extractErrorSnippet, getByteSize, getLineCount, sortObjectKeys } from './utils';

export function parseYamlWithLocation(raw: string): {
  parsed?: unknown;
  error?: string;
  line?: number;
  column?: number;
  snippet?: string;
} {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { error: 'Input is empty' };
  }

  const doc = YAML.parseDocument(raw);
  if (doc.errors && doc.errors.length > 0) {
    const firstError = doc.errors[0];
    const message = firstError.message;
    let line: number | undefined;
    let column: number | undefined;

    if (firstError.linePos && firstError.linePos.length > 0) {
      line = firstError.linePos[0].line;
      column = firstError.linePos[0].col;
    }

    const snippet = extractErrorSnippet(raw, line, column);
    return {
      error: message,
      line,
      column,
      snippet,
    };
  }

  try {
    const parsed = doc.toJS();
    return { parsed };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'YAML parsing failed';
    return { error: message };
  }
}

export function validateYaml(raw: string): ValidationResult {
  const { parsed, error, line, column, snippet } = parseYamlWithLocation(raw);
  if (error || parsed === undefined) {
    return {
      valid: false,
      format: 'yaml',
      message: error ?? 'Invalid YAML',
      line,
      column,
      snippet,
    };
  }

  let topLevelKeys: number | undefined;
  let arrayItems: number | undefined;
  let valueType: string = typeof parsed;

  if (Array.isArray(parsed)) {
    valueType = 'array';
    arrayItems = parsed.length;
  } else if (parsed !== null && typeof parsed === 'object') {
    valueType = 'object';
    topLevelKeys = Object.keys(parsed as Record<string, unknown>).length;
  } else if (parsed === null) {
    valueType = 'null';
  }

  return {
    valid: true,
    format: 'yaml',
    message: 'Valid YAML document',
    stats: {
      lineCount: getLineCount(raw),
      byteSize: getByteSize(raw),
      topLevelKeys,
      arrayItems,
      valueType,
    },
  };
}

export function yamlToJson(raw: string, options: ConversionOptions = {}): ConversionResult {
  const { parsed, error, line, column, snippet } = parseYamlWithLocation(raw);
  if (error || parsed === undefined) {
    return {
      success: false,
      error: error ?? 'Invalid YAML syntax',
      line,
      column,
      snippet,
    };
  }

  try {
    let dataToConvert: any = parsed;
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
