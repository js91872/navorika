import DOMPurify from 'dompurify';
import type { Email } from 'postal-mime';
import { attachmentBytes, escapeXml, headers } from './email';

// Detached DOM parsing never installs email markup in the live page. All URL-bearing
// attributes and CSS are removed before the sanitized document can be rendered.
export function cleanBody(email: Email): string {
  const clean = DOMPurify.sanitize(
    email.html || `<pre>${escapeXml(email.text || '')}</pre>`,
    {
      ALLOWED_TAGS: [
        'p',
        'br',
        'div',
        'span',
        'b',
        'strong',
        'i',
        'em',
        'u',
        's',
        'blockquote',
        'pre',
        'code',
        'ul',
        'ol',
        'li',
        'table',
        'thead',
        'tbody',
        'tr',
        'th',
        'td',
        'h1',
        'h2',
        'h3',
        'h4',
        'hr',
        'img',
      ],
      ALLOWED_ATTR: ['alt', 'colspan', 'rowspan'],
      ALLOW_DATA_ATTR: false,
    },
  );
  // CID images are deliberately omitted: no sender-controlled URL is ever restored.
  return clean;
}
export function bodyText(email: Email): string {
  if (email.text) return email.text;
  const template = document.createElement('template');
  template.innerHTML = cleanBody(email)
    .replace(/<\/(?:td|th)\s*>/gi, '\t')
    .replace(/<(?:br|\/p|\/div|\/tr|\/li|\/h[1-4])\b[^>]*>/gi, '\n');
  return template.content.textContent || '';
}
export function htmlDocument(email: Email): string {
  const meta = headers(email)
    .filter(([, v]) => v)
    .map(([k, v]) => `<dt>${k}</dt><dd>${escapeXml(v)}</dd>`)
    .join('');
  const attachments = email.attachments
    .map(
      (a) =>
        `<li>${escapeXml(a.filename || 'unnamed attachment')} (${attachmentBytes(a.content).length} bytes)</li>`,
    )
    .join('');
  return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src 'none'; base-uri 'none'; form-action 'none'"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeXml(email.subject || 'Email')}</title><style>body{font:16px/1.6 system-ui;max-width:900px;margin:32px auto;padding:20px;overflow-wrap:anywhere}dt{font-weight:bold}dd{margin:0 0 10px}table{border-collapse:collapse}td,th{border:1px solid #ccc;padding:6px}pre{white-space:pre-wrap}img{display:none}</style></head><body><dl>${meta}</dl><hr>${cleanBody(email)}${attachments ? `<hr><h2>Attachment names (files not embedded)</h2><ul>${attachments}</ul>` : ''}</body></html>`;
}
