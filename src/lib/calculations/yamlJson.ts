/**
 * YAML / JSON Bidirectional Converter with Syntax Validation (Batch 08 Wave C)
 */
import YAML from 'yaml';

export interface YamlJsonInput {
  sourceContent: string;
  conversionMode?: 'yaml-to-json' | 'json-to-yaml' | 'auto' | string;
  indentSpaces?: number;
  sortKeys?: boolean | string;
}

export interface YamlJsonResult {
  convertedContent: string;
  detectedFormat: string;
  byteSize: number;
  validationStatus: string;
}

function sortObjectKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortObjectKeys);
  }
  if (value !== null && typeof value === 'object') {
    const sorted: Record<string, unknown> = {};
    const keys = Object.keys(value as Record<string, unknown>).sort();
    for (const key of keys) {
      sorted[key] = sortObjectKeys((value as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  return value;
}

export function calculateYamlJson(input: YamlJsonInput): YamlJsonResult {
  const raw = (input.sourceContent ?? '').trim();
  const indent = Number.isFinite(input.indentSpaces) && (input.indentSpaces ?? 0) > 0
    ? Math.min(8, Math.max(1, Math.round(input.indentSpaces ?? 2)))
    : 2;
  const shouldSort = input.sortKeys === true || input.sortKeys === 'true';
  const mode = (input.conversionMode ?? 'yaml-to-json').toLowerCase();

  if (!raw) {
    return {
      convertedContent: '',
      detectedFormat: 'empty',
      byteSize: 0,
      validationStatus: 'Empty input',
    };
  }

  // Determine direction
  let targetMode = mode;
  let detected = 'yaml';

  const isJsonCandidate = (raw.startsWith('{') && raw.endsWith('}')) || (raw.startsWith('[') && raw.endsWith(']'));

  if (targetMode === 'auto') {
    if (isJsonCandidate) {
      try {
        JSON.parse(raw);
        targetMode = 'json-to-yaml';
        detected = 'json';
      } catch {
        targetMode = 'yaml-to-json';
        detected = 'yaml';
      }
    } else {
      targetMode = 'yaml-to-json';
      detected = 'yaml';
    }
  } else if (targetMode === 'json-to-yaml') {
    detected = 'json';
  } else {
    detected = 'yaml';
  }

  try {
    if (targetMode === 'json-to-yaml') {
      let parsed = JSON.parse(raw);
      if (shouldSort) {
        parsed = sortObjectKeys(parsed);
      }
      const convertedContent = YAML.stringify(parsed, { indent });
      const byteSize = new TextEncoder().encode(convertedContent).length;
      return {
        convertedContent,
        detectedFormat: 'JSON',
        byteSize,
        validationStatus: 'Valid JSON → YAML',
      };
    } else {
      // YAML to JSON
      let parsed = YAML.parse(raw);
      if (shouldSort) {
        parsed = sortObjectKeys(parsed);
      }
      const convertedContent = JSON.stringify(parsed, null, indent);
      const byteSize = new TextEncoder().encode(convertedContent).length;
      return {
        convertedContent,
        detectedFormat: 'YAML',
        byteSize,
        validationStatus: 'Valid YAML → JSON',
      };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      convertedContent: `/* Conversion Error: ${message} */`,
      detectedFormat: detected.toUpperCase(),
      byteSize: 0,
      validationStatus: `Syntax Error: ${message.slice(0, 80)}`,
    };
  }
}
