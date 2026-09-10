import YAML from 'yaml';
import * as TOML from 'smol-toml';
import type { ConversionOptions, ConversionResult, ValidationResult } from './types';
import { extractErrorSnippet, getByteSize, getLineCount, sortObjectKeys } from './utils';

export function parseJsonWithLocation(raw: string): { parsed?: unknown; error?: string; line?: number; column?: number; snippet?: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { error: 'Input is empty' };
  }

  try {
    const parsed = JSON.parse(trimmed);
    return { parsed };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid JSON format';
    let line: number | undefined;
    let column: number | undefined;

    // Pattern 1: "... at position 42"
    const posMatch = message.match(/at position (\d+)/i);
    if (posMatch) {
      const position = parseInt(posMatch[1], 10);
      const prefix = trimmed.slice(0, Math.min(position, trimmed.length));
      const lines = prefix.split(/\r?\n/);
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    }

    // Pattern 2: "... at line 2 column 5"
    const lineColMatch = message.match(/line (\d+) column (\d+)/i);
    if (lineColMatch) {
      line = parseInt(lineColMatch[1], 10);
      column = parseInt(lineColMatch[2], 10);
    }

    const snippet = extractErrorSnippet(trimmed, line, column);
    return {
      error: message,
      line,
      column,
      snippet,
    };
  }
}

export function validateJson(raw: string): ValidationResult {
  const { parsed, error, line, column, snippet } = parseJsonWithLocation(raw);
  if (error || parsed === undefined) {
    return {
      valid: false,
      format: 'json',
      message: error ?? 'Invalid JSON',
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
    format: 'json',
    message: 'Valid JSON document',
    stats: {
      lineCount: getLineCount(raw),
      byteSize: getByteSize(raw),
      topLevelKeys,
      arrayItems,
      valueType,
    },
  };
}

export function jsonToYaml(raw: string, options: ConversionOptions = {}): ConversionResult {
  const { parsed, error, line, column, snippet } = parseJsonWithLocation(raw);
  if (error || parsed === undefined) {
    return {
      success: false,
      error: error ?? 'Invalid JSON syntax',
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
    const yamlString = YAML.stringify(dataToConvert, {
      indent,
      lineWidth: 0,
      nullStr: 'null',
    });

    return {
      success: true,
      data: yamlString,
      parsed: dataToConvert,
      byteSize: getByteSize(yamlString),
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'YAML serialization failed',
    };
  }
}

/**
 * Checks for unsupported TOML values (such as null, undefined, function, symbols)
 * and returns the path where it occurs.
 */
function findUnsupportedTomlStructure(
  val: unknown,
  path = ''
): { unsupported: boolean; reason: string; path: string } | null {
  if (val === null) {
    return {
      unsupported: true,
      reason: 'TOML v1.0 does not support null values',
      path: path || 'root',
    };
  }

  if (typeof val === 'undefined') {
    return {
      unsupported: true,
      reason: 'Undefined values cannot be represented in TOML',
      path: path || 'root',
    };
  }

  if (Array.isArray(val)) {
    for (let i = 0; i < val.length; i++) {
      const sub = findUnsupportedTomlStructure(val[i], `${path}[${i}]`);
      if (sub) return sub;
    }
    return null;
  }

  if (typeof val === 'object' && val !== null) {
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      const keyPath = path ? `${path}.${k}` : k;
      const sub = findUnsupportedTomlStructure(v, keyPath);
      if (sub) return sub;
    }
    return null;
  }

  return null;
}

export function jsonToToml(raw: string, options: ConversionOptions = {}): ConversionResult {
  const { parsed, error, line, column, snippet } = parseJsonWithLocation(raw);
  if (error || parsed === undefined) {
    return {
      success: false,
      error: error ?? 'Invalid JSON syntax',
      line,
      column,
      snippet,
    };
  }

  // TOML Root must be a non-null object
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return {
      success: false,
      error:
        'TOML requires a top-level table (object). A root array, null, or primitive value cannot be serialized directly to TOML.',
    };
  }

  // Check for unsupported structures such as null values
  const unsupported = findUnsupportedTomlStructure(parsed);
  if (unsupported) {
    return {
      success: false,
      error: `${unsupported.reason} (encountered at "${unsupported.path}"). In TOML, keys with absent values should be omitted.`,
    };
  }

  try {
    let dataToConvert = parsed as Record<string, unknown>;
    if (options.sortKeys) {
      dataToConvert = sortObjectKeys(dataToConvert) as Record<string, unknown>;
    }

    const tomlString = TOML.stringify(dataToConvert);
    return {
      success: true,
      data: tomlString,
      parsed: dataToConvert,
      byteSize: getByteSize(tomlString),
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'TOML serialization failed',
    };
  }
}
