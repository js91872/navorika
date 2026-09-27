import type { HtmlValidationResult, SanitizeResult } from './types';

/**
 * Strict Content Security Policy applied to both the hidden measurement iframe
 * and the visible preview iframe. Guarantees 0 external network requests by default.
 */
export const SANDBOX_CSP =
  "default-src 'none'; img-src data: blob:; style-src 'unsafe-inline'; font-src data:; connect-src 'none'; media-src 'none'; object-src 'none'; script-src 'none'; child-src 'none'; frame-src 'none';";

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
  /<link\b[^>]*\/?>/gi,
  /<!DOCTYPE\b[^>]*>/gi,
  /<!ENTITY\b[^>]*>/gi,
];

// Inline event handlers like onclick, onload, onerror, onmouseover, onbegin, onend, etc.
const EVENT_HANDLER_REGEX = /\s+on[a-zA-Z0-9_-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;

// Void HTML elements that must be self-closed in XHTML / SVG foreignObject
const VOID_ELEMENTS = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

export const MAX_HTML_LENGTH = 2 * 1024 * 1024; // 2 MB limit to prevent browser memory exhaustion

function tryDecodeUri(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}

/**
 * Decodes numeric, hexadecimal, and named HTML entities in a string.
 */
export function decodeHtmlEntities(input: string): string {
  if (!input) return '';
  let decoded = input;
  decoded = tryDecodeUri(decoded);

  for (let pass = 0; pass < 2; pass++) {
    // Decimal entities: &#106; or &#0106;
    decoded = decoded.replace(/&#(\d+);?/g, (_, dec) => {
      const code = parseInt(dec, 10);
      return code >= 32 && code <= 126 ? String.fromCharCode(code) : '';
    });

    // Hexadecimal entities: &#x6a; or &#X6A;
    decoded = decoded.replace(/&#x([0-9a-f]+);?/gi, (_, hex) => {
      const code = parseInt(hex, 16);
      return code >= 32 && code <= 126 ? String.fromCharCode(code) : '';
    });

    // Named entities commonly abused in URI bypasses
    decoded = decoded
      .replace(/&colon;?/gi, ':')
      .replace(/&tab;?/gi, '')
      .replace(/&newline;?/gi, '')
      .replace(/&quot;?/gi, '"')
      .replace(/&apos;?/gi, "'")
      .replace(/&amp;?/gi, '&');
  }

  return decoded;
}

/**
 * Checks whether a URL scheme is dangerous (e.g. javascript:, vbscript:, data:text/html).
 */
export function isDangerousProtocol(url: string): boolean {
  if (!url) return false;
  const decoded = decodeHtmlEntities(url).trim();
  // Strip control chars, null bytes, tabs, newlines often used to break regex
  const stripped = decoded.replace(/[\x00-\x1f\s]/g, '').toLowerCase();

  if (
    stripped.startsWith('javascript:') ||
    stripped.startsWith('vbscript:') ||
    stripped.startsWith('file:') ||
    stripped.startsWith('about:') ||
    stripped.startsWith('data:text/html') ||
    stripped.startsWith('data:text/javascript') ||
    stripped.startsWith('data:application/javascript')
  ) {
    return true;
  }

  // Any data: URI that is not a safe image data URI is treated as dangerous protocol
  if (stripped.startsWith('data:')) {
    if (!isSafeDataImageUrl(url)) {
      return true;
    }
  }

  return false;
}

/**
 * Checks whether a URL points to an external remote network destination (http://, https://, or //).
 */
export function isExternalNetworkUrl(url: string): boolean {
  if (!url) return false;
  const decoded = decodeHtmlEntities(url).trim();
  const stripped = decoded.replace(/[\x00-\x1f\s]/g, '').toLowerCase();

  return (
    stripped.startsWith('http:') ||
    stripped.startsWith('https:') ||
    stripped.startsWith('//') ||
    stripped.startsWith('\\\\') ||
    stripped.startsWith('ftp:') ||
    stripped.startsWith('ftps:')
  );
}

/**
 * Checks whether a data URL represents a safe, browser-decodable raster or vector image.
 */
export function isSafeDataImageUrl(url: string): boolean {
  if (!url) return false;
  const decoded = decodeHtmlEntities(url).trim();
  const stripped = decoded.replace(/[\x00-\x1f\s]/g, '');

  if (!stripped.toLowerCase().startsWith('data:image/')) {
    return false;
  }

  // If it is an SVG data URI, check for dangerous scripts or event handlers
  if (stripped.toLowerCase().startsWith('data:image/svg+xml')) {
    if (
      /<script\b/i.test(decoded) ||
      /javascript:/i.test(decoded) ||
      /\son[a-zA-Z0-9_-]+\s*=/i.test(decoded)
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Sanitizes CSS text (inside <style> blocks or style="" attributes)
 * by neutralizing @import, remote web fonts, and remote url(http...) assets.
 * Preserves gradients, colors, borders, flexbox, grid, and system typography.
 */
export function sanitizeCss(css: string): { cleanCss: string; hasBlockedExternal: boolean } {
  let hasBlockedExternal = false;
  let cleanCss = css;

  // 1. Strip all CSS @import statements
  cleanCss = cleanCss.replace(/@import\s+(?:url\([^)]*\)|['"][^'"]*['"]|[^;]+)[^;]*;?/gi, () => {
    hasBlockedExternal = true;
    return '/* import blocked */';
  });

  // 2. Strip or neutralize @font-face containing remote URLs
  cleanCss = cleanCss.replace(/@font-face\s*\{[^}]*(?:https?:|\/\/)[^}]*\}/gi, () => {
    hasBlockedExternal = true;
    return '/* remote font-face blocked */';
  });

  // 3. Neutralize remote url(http...) and url(//...)
  cleanCss = cleanCss.replace(
    /url\(\s*(['"]?)(?:https?:|\/\/)[^'")]+(['"]?)\s*\)/gi,
    () => {
      hasBlockedExternal = true;
      return 'none /* external url blocked */';
    }
  );

  return { cleanCss, hasBlockedExternal };
}

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
 * Authoritative sanitization step.
 * Strips active scripts, dangerous tags, inline event handlers, dangerous protocol schemes,
 * and neutralizes external HTTP/HTTPS resources to enforce the 100% browser-local privacy model.
 */
export function sanitizeHtml(rawHtml: string): SanitizeResult {
  const warnings: string[] = [];
  let strippedCount = 0;

  let hasScripts = false;
  let hasDangerousTags = false;
  let hasEventHandlers = false;
  let hasDangerousProtocols = false;
  let hasExternalResources = false;

  // Diagnostic checks
  if (/<script\b/i.test(rawHtml)) {
    hasScripts = true;
    warnings.push('JavaScript <script> tags were removed. Browser-local image conversion does not execute client scripts.');
  }

  if (/\son[a-zA-Z0-9_-]+\s*=/i.test(rawHtml)) {
    hasEventHandlers = true;
    warnings.push('Inline event handlers (e.g. onload, onclick, onerror, onmouseover) were removed for security.');
  }

  if (/<(?:iframe|object|embed|applet|frame|frameset|base|meta|link)\b/i.test(rawHtml)) {
    hasDangerousTags = true;
    warnings.push('Embedded frame, link, and plugin tags (<object>, <embed>, <iframe>, <link>) were stripped.');
  }

  // 1. Tag-level stripping of dangerous elements
  let cleanHtml = rawHtml;
  for (const pattern of DANGEROUS_TAG_PATTERNS) {
    cleanHtml = cleanHtml.replace(pattern, () => {
      strippedCount++;
      return '';
    });
  }

  // 2. Strip event handler attributes
  cleanHtml = cleanHtml.replace(EVENT_HANDLER_REGEX, () => {
    strippedCount++;
    return '';
  });

  // 3. Sanitize <style> blocks
  cleanHtml = cleanHtml.replace(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi, (_, attrs, styleContent) => {
    const { cleanCss, hasBlockedExternal: blocked } = sanitizeCss(styleContent);
    if (blocked) {
      hasExternalResources = true;
    }
    return `<style${attrs}>${cleanCss}</style>`;
  });

  // 4. Sanitize inline style="..." attributes
  cleanHtml = cleanHtml.replace(/\s+style\s*=\s*(?:"([^"]*)"|'([^']*)')/gi, (match, val1, val2) => {
    const styleContent = val1 ?? val2 ?? '';
    const { cleanCss, hasBlockedExternal: blocked } = sanitizeCss(styleContent);
    if (blocked) {
      hasExternalResources = true;
      strippedCount++;
      return ` style="${cleanCss}"`;
    }
    return match;
  });

  // 5. Audit URL-bearing attributes on tags
  // Attributes: src, href, xlink:href, srcset, action, formaction, poster, background
  cleanHtml = cleanHtml.replace(
    /(<[a-zA-Z0-9_-]+)((?:\s+(?:[a-zA-Z0-9_:-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?))*\s*)(\/?>)/gi,
    (_, openTag, attrString, closeTag) => {
      let modifiedAttrs = attrString;

      // Handle xlink:href and href
      modifiedAttrs = modifiedAttrs.replace(
        /\s+(?:xlink:)?href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi,
        (attrMatch: string, val1?: string, val2?: string, val3?: string): string => {
          const urlValue = val1 ?? val2 ?? val3 ?? '';
          if (isDangerousProtocol(urlValue)) {
            hasDangerousProtocols = true;
            strippedCount++;
            return ' data-blocked-protocol="true"';
          }

          // In SVG elements (<use>, <image>, <feImage>, etc.)
          if (/<(?:svg:)?(?:use|image|feImage)\b/i.test(openTag)) {
            if (/<(?:svg:)?use\b/i.test(openTag)) {
              const trimmed = decodeHtmlEntities(urlValue).trim();
              if (!trimmed.startsWith('#')) {
                hasExternalResources = true;
                strippedCount++;
                return ' data-blocked-external-ref="true"';
              }
            } else {
              if (isExternalNetworkUrl(urlValue)) {
                hasExternalResources = true;
                strippedCount++;
                return ' data-blocked-external-src="true"';
              }
            }
          }

          return attrMatch;
        }
      );

      // Handle src
      modifiedAttrs = modifiedAttrs.replace(
        /\s+src\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi,
        (attrMatch: string, val1?: string, val2?: string, val3?: string): string => {
          const urlValue = val1 ?? val2 ?? val3 ?? '';
          if (isDangerousProtocol(urlValue)) {
            hasDangerousProtocols = true;
            strippedCount++;
            return ' data-blocked-protocol="true"';
          }
          if (isExternalNetworkUrl(urlValue)) {
            hasExternalResources = true;
            strippedCount++;
            return ' data-blocked-external-src="true"';
          }
          return attrMatch;
        }
      );

      // Handle srcset
      modifiedAttrs = modifiedAttrs.replace(
        /\s+srcset\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi,
        (attrMatch: string, val1?: string, val2?: string, val3?: string): string => {
          const srcsetValue = val1 ?? val2 ?? val3 ?? '';
          if (/(?:https?:|\/\/)/i.test(srcsetValue) || isDangerousProtocol(srcsetValue)) {
            hasExternalResources = true;
            strippedCount++;
            return ' data-blocked-external-srcset="true"';
          }
          return attrMatch;
        }
      );

      // Handle action, formaction, poster, background
      modifiedAttrs = modifiedAttrs.replace(
        /\s+(?:action|formaction|poster|background)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi,
        (attrMatch: string, val1?: string, val2?: string, val3?: string): string => {
          const urlValue = val1 ?? val2 ?? val3 ?? '';
          if (isDangerousProtocol(urlValue)) {
            hasDangerousProtocols = true;
            strippedCount++;
            return ' data-blocked-protocol="true"';
          }
          if (isExternalNetworkUrl(urlValue)) {
            hasExternalResources = true;
            strippedCount++;
            return ' data-blocked-external-src="true"';
          }
          return attrMatch;
        }
      );

      return `${openTag}${modifiedAttrs}${closeTag}`;
    }
  );

  // Diagnostics and user notices
  if (hasDangerousProtocols) {
    warnings.push('Dangerous URI protocols (e.g. javascript:, vbscript:, data:text/html) were blocked.');
  }

  if (hasExternalResources) {
    warnings.push(
      'External network resources (remote images, CSS @import, web fonts) were blocked to enforce 100% browser-local privacy. Embedded Data URLs and local styling are recommended.'
    );
  }

  // Prepare XHTML string suitable for SVG foreignObject
  const sanitizedForForeignObject = prepareXhtmlForForeignObject(cleanHtml);

  return {
    cleanHtml,
    sanitizedForForeignObject,
    warnings,
    hasScripts,
    hasExternalImages: hasExternalResources, // alias
    hasExternalResources,
    hasEventHandlers,
    hasDangerousTags,
    hasDangerousProtocols,
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
 * Performs authoritative DOM-based traversal and sanitization when running in a browser environment
 * with native DOMParser and XMLSerializer support.
 * In a non-browser environment (Node tests), applies tag and void-closing normalization.
 */
export function prepareXhtmlForForeignObject(html: string): string {
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined' && typeof XMLSerializer !== 'undefined') {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // 1. Remove disallowed elements
      const disallowed = doc.querySelectorAll('script, noscript, iframe, object, embed, frame, frameset, applet, base, meta, link');
      disallowed.forEach((node) => node.remove());

      // 2. Walk all remaining elements for attribute, protocol, and external asset sanitization
      const allElements = doc.querySelectorAll('*');
      allElements.forEach((el) => {
        const attributesToRemove: string[] = [];
        const attributesToSet: [string, string][] = [];

        for (let i = 0; i < el.attributes.length; i++) {
          const attr = el.attributes[i];
          const attrName = attr.name.toLowerCase();
          const attrVal = attr.value;

          // Strip event handlers
          if (/^on/i.test(attrName)) {
            attributesToRemove.push(attr.name);
            continue;
          }

          // Audit style attribute
          if (attrName === 'style') {
            const { cleanCss } = sanitizeCss(attrVal);
            attributesToSet.push(['style', cleanCss]);
            continue;
          }

          // Check URL-bearing attributes
          if (['href', 'xlink:href', 'src', 'action', 'formaction', 'poster', 'background'].includes(attrName)) {
            if (isDangerousProtocol(attrVal)) {
              attributesToRemove.push(attr.name);
              continue;
            }

            // Block external network resources on media/images/links
            if (isExternalNetworkUrl(attrVal)) {
              if (['img', 'video', 'audio', 'track', 'source', 'image', 'use', 'feimage'].includes(el.tagName.toLowerCase())) {
                attributesToRemove.push(attr.name);
                attributesToSet.push(['data-blocked-external-src', 'true']);
                continue;
              }
            }

            // In SVG <use>, ensure only internal fragments (#id) are used
            if (el.tagName.toLowerCase() === 'use' && (attrName === 'href' || attrName === 'xlink:href')) {
              if (!attrVal.trim().startsWith('#')) {
                attributesToRemove.push(attr.name);
                continue;
              }
            }
          }

          // Check srcset
          if (attrName === 'srcset') {
            if (isExternalNetworkUrl(attrVal) || isDangerousProtocol(attrVal)) {
              attributesToRemove.push(attr.name);
              continue;
            }
          }
        }

        attributesToRemove.forEach((name) => el.removeAttribute(name));
        attributesToSet.forEach(([name, val]) => el.setAttribute(name, val));
      });

      // 3. Sanitize inline <style> tags
      const styles = doc.head.querySelectorAll('style');
      styles.forEach((styleEl) => {
        const { cleanCss } = sanitizeCss(styleEl.textContent || '');
        styleEl.textContent = cleanCss;
      });

      const extractedStyles = Array.from(styles)
        .map((style) => style.outerHTML)
        .join('\n');

      const serializer = new XMLSerializer();
      let bodyXhtml = '';
      for (let i = 0; i < doc.body.childNodes.length; i++) {
        bodyXhtml += serializer.serializeToString(doc.body.childNodes[i]);
      }

      if (!bodyXhtml.trim() && doc.documentElement) {
        bodyXhtml = serializer.serializeToString(doc.documentElement);
      }

      return extractedStyles ? `${extractedStyles}\n${bodyXhtml}` : bodyXhtml;
    } catch {
      // Fallback
    }
  }

  // Non-browser or fallback regex normalization
  return ensureSelfClosingVoidTags(html);
}
