import type { SvgSanitizeResult } from './types';

const DANGEROUS_TAGS_REGEX = /<\s*(?:script|object|embed|foreignobject|iframe|frame|applet|meta|link)\b/i;
const DANGEROUS_ATTRIBUTES_REGEX = /\s*(?:on\w+|formaction|action)\s*=/i;
const DANGEROUS_URI_SCHEMES_REGEX = /(?:javascript|vbscript|data\s*:\s*text\/html)\s*:/i;
const XML_ENTITY_EXPANSION_REGEX = /<!(?:DOCTYPE|ENTITY)\b/i;

/**
 * Checks an SVG string for active scripts, event handlers, and dangerous XML constructs.
 */
export function inspectSvgSecurity(svgText: string): SvgSanitizeResult {
  const reasons: string[] = [];

  if (XML_ENTITY_EXPANSION_REGEX.test(svgText)) {
    reasons.push('Contains DOCTYPE or ENTITY declarations which can trigger XML entity expansion (Billion Laughs attack).');
  }

  if (DANGEROUS_TAGS_REGEX.test(svgText)) {
    reasons.push('Contains active executable tags (e.g. <script>, <foreignObject>, <embed>, <object>).');
  }

  if (DANGEROUS_ATTRIBUTES_REGEX.test(svgText)) {
    reasons.push('Contains inline JavaScript event handlers (e.g. onload, onerror, onclick).');
  }

  if (DANGEROUS_URI_SCHEMES_REGEX.test(svgText)) {
    reasons.push('Contains dangerous URI schemes (e.g. javascript:).');
  }

  const isSafe = reasons.length === 0;

  return {
    isSafe,
    reasons,
    sanitizedSvg: isSafe ? svgText : undefined,
  };
}

/**
 * Checks whether text or a buffer represents SVG markup.
 */
export function isSvgContent(content: string | Uint8Array): boolean {
  let str: string;
  if (typeof content === 'string') {
    str = content.trim();
  } else {
    try {
      str = new TextDecoder('utf-8', { fatal: false }).decode(content.slice(0, 1024)).trim();
    } catch {
      return false;
    }
  }

  const sample = str.slice(0, 500).toLowerCase();
  return sample.includes('<svg') || (sample.includes('<?xml') && sample.includes('svg'));
}
