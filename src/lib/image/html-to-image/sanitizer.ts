import type { HtmlValidationResult, SanitizeResult } from './types';

// Dangerous elements that must never execute or render in the sandboxed preview or image
const DANGEROUS_TAG_PATTERNS = [
  /<script\b[^>]*>[\s\S]*?<\/script\s*>/gi,
  /<noscript\b[^>]*>[\s\S]*?<\/noscript\s*>/gi,
  /<iframe\b[^>]*>[\s\S]*?<\/iframe\s*>/gi,
  /<iframe\b[^>]*\/?>/gi,
  /<frame\b[^>]*>[\s\S]*?<\/frame\s*>/gi,
  /<frame\b[^>]*\/?>/gi,
  /<frameset\b[^>]*>[\s\S]*?<\/frameset\s*>/gi,
  /<object\b[^>]*>[\s\S]*?<\/object\s*>/gi,
  /<object\b[^>]*\/?>/gi,
  /<embed\b[^>]*>[\s\S]*?<\/embed\s*>/gi,
  /<embed\b[^>]*\/?>/gi,
  /<applet\b[^>]*>[\s\S]*?<\/applet\s*>/gi,
  /<applet\b[^>]*\/?>/gi,
  /<meta\b[^>]*\/?>/gi,
  /<base\b[^>]*\/?>/gi,
  /<!DOCTYPE\b[^>]*>/gi,
  /<!ENTITY\b[^>]*>/gi,
];

// Inline event handlers like onclick, onload, onerror, onmouseover, etc.
const EVENT_HANDLER_REGEX = /\s+on[a-zA-Z0-9_-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;

// Dangerous URI schemes like javascript: or vbscript: or data:text/html
const DANGEROUS_URI_ATTR_REGEX = /\s+(?:href|src|action|formaction|poster|background|xlink:href)\s*=\s*(?:["']\s*(?:javascript|vbscript|data\s*:\s*text\/html)[\s\S]*?["']|(?:javascript|vbscript):[^\s>]+)/gi;

// External image URL pattern (http/https)
const EXTERNAL_IMAGE_REGEX = /<img\b[^>]*\bsrc\s*=\s*["']https?:\/\/[^"']+["']/i;
const EXTERNAL_CSS_URL_REGEX = /url\(\s*["']?https?:\/\/[^"')]+["']?\s*\)/i;

// Void HTML elements that must be self-closed in XHTML / SVG foreignObject
const VOID_ELEMENTS = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

export const MAX_HTML_LENGTH = 2 * 1024 * 1024; // 2 MB limit to prevent browser memory exhaustion

/**
 * Validates raw HTML input size and non-emptiness.
 */
export function validateHtmlInput(raw: string): HtmlValidationResult {
  const trimmed = raw.trim();
  const characterCount = trimmed.length;

  if (characterCount === 0) {
    return {
      isValid: false,
      error: 'Please enter HTML markup or upload an HTML file.',
      characterCount: 0,
    };
  }

  if (raw.length > MAX_HTML_LENGTH) {
    return {
      isValid: false,
      error: `HTML input exceeds maximum allowable size of 2 MB (${(raw.length / (1024 * 1024)).toFixed(2)} MB provided).`,
      characterCount,
    };
  }

  return {
    isValid: true,
    characterCount,
  };
}

/**
 * Sanitizes HTML string by stripping script tags, event handlers, dangerous tags, and malicious URIs.
 * Provides diagnostics for technical honesty and security notices.
 */
export function sanitizeHtml(rawHtml: string): SanitizeResult {
  const warnings: string[] = [];
  let strippedCount = 0;

  let hasScripts = false;
  let hasDangerousTags = false;
  let hasEventHandlers = false;

  // Check for scripts
  if (/<script\b/i.test(rawHtml)) {
    hasScripts = true;
    warnings.push('JavaScript <script> tags were removed. Browser-local image conversion does not execute client scripts.');
  }

  // Check for event handlers
  if (/\son[a-zA-Z0-9_-]+\s*=/i.test(rawHtml)) {
    hasEventHandlers = true;
    warnings.push('Inline event handlers (e.g. onload, onclick, onerror) were removed for security.');
  }

  // Check for dangerous container tags
  if (/<(?:iframe|object|embed|applet|frame|frameset|base|meta)\b/i.test(rawHtml)) {
    hasDangerousTags = true;
    warnings.push('Embedded frame and executable plugin tags (<object>, <embed>, <iframe>) were stripped.');
  }

  // Check for external images or fonts
  const hasExternalImages = EXTERNAL_IMAGE_REGEX.test(rawHtml) || EXTERNAL_CSS_URL_REGEX.test(rawHtml);
  if (hasExternalImages) {
    warnings.push('External cross-origin images or webfonts were detected. Note that browser security policies may block remote subresources during canvas export unless served with permissible CORS headers or embedded as Data URLs.');
  }

  // Perform tag stripping
  let cleanHtml = rawHtml;
  for (const pattern of DANGEROUS_TAG_PATTERNS) {
    cleanHtml = cleanHtml.replace(pattern, () => {
      strippedCount++;
      return '';
    });
  }

  // Strip event handlers
  cleanHtml = cleanHtml.replace(EVENT_HANDLER_REGEX, () => {
    strippedCount++;
    return '';
  });

  // Strip dangerous URIs
  cleanHtml = cleanHtml.replace(DANGEROUS_URI_ATTR_REGEX, () => {
    strippedCount++;
    return ' data-blocked-uri="true"';
  });

  // Prepare XHTML string suitable for SVG foreignObject
  const sanitizedForForeignObject = prepareXhtmlForForeignObject(cleanHtml);

  return {
    cleanHtml,
    sanitizedForForeignObject,
    warnings,
    hasScripts,
    hasExternalImages,
    hasEventHandlers,
    hasDangerousTags,
    strippedCount,
  };
}

/**
 * Normalizes HTML void tags to self-closing XML tags so XMLSerializer/SVG parser
 * does not choke on standard unclosed HTML5 tags like <img src="..."> or <br>.
 */
export function ensureSelfClosingVoidTags(html: string): string {
  let result = html;
  for (const tag of VOID_ELEMENTS) {
    // Match unclosed void tags: <tag (attrs)> where not ending in />
    const regex = new RegExp(`(<${tag}\\b[^>]*?)(?<!\\/)>`, 'gi');
    result = result.replace(regex, '$1 />');
  }
  return result;
}

/**
 * Prepares compliant XHTML for embedding in SVG <foreignObject>.
 * If running in a browser environment with DOMParser and XMLSerializer available,
 * leverages native browser parsing to guarantee well-formed XML.
 * In a non-browser environment, performs robust regex-based void-tag self-closing.
 */
export function prepareXhtmlForForeignObject(html: string): string {
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined' && typeof XMLSerializer !== 'undefined') {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Strip any lingering script, object, embed, iframe elements from DOM
      const disallowed = doc.querySelectorAll('script, noscript, iframe, object, embed, frame, applet, base, meta');
      disallowed.forEach((node) => node.remove());

      // Strip any lingering on* attributes
      const allElements = doc.querySelectorAll('*');
      allElements.forEach((el) => {
        const attributesToRemove: string[] = [];
        for (let i = 0; i < el.attributes.length; i++) {
          const attr = el.attributes[i];
          if (/^on/i.test(attr.name)) {
            attributesToRemove.push(attr.name);
          } else if (/^(?:href|src|action|formaction)$/i.test(attr.name)) {
            if (/^\s*(?:javascript|vbscript|data\s*:\s*text\/html):/i.test(attr.value)) {
              attributesToRemove.push(attr.name);
            }
          }
        }
        attributesToRemove.forEach((name) => el.removeAttribute(name));
      });

      // Extract styles from head if present
      const styles = Array.from(doc.head.querySelectorAll('style'))
        .map((style) => style.outerHTML)
        .join('\n');

      const serializer = new XMLSerializer();
      // Serialize body content
      let bodyXhtml = '';
      for (let i = 0; i < doc.body.childNodes.length; i++) {
        bodyXhtml += serializer.serializeToString(doc.body.childNodes[i]);
      }

      // If document had only text or elements outside standard body structure
      if (!bodyXhtml.trim() && doc.documentElement) {
        bodyXhtml = serializer.serializeToString(doc.documentElement);
      }

      return styles ? `${styles}\n${bodyXhtml}` : bodyXhtml;
    } catch {
      // Fall through to regex-based normalization if DOMParser throws
    }
  }

  // Non-browser or fallback regex normalization
  return ensureSelfClosingVoidTags(html);
}
