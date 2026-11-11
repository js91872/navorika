import PostalMime, { type Address, type Email } from 'postal-mime';

export type EmailFormat = 'pdf' | 'msg' | 'html' | 'excel' | 'word';
export const MAX_FILES = 50;
export const MAX_BYTES = 20 * 1024 * 1024;
export const MAX_TEXT = 500_000;
export const formats: Record<
  EmailFormat,
  { label: string; extension: string; mime: string }
> = {
  pdf: { label: 'PDF', extension: 'pdf', mime: 'application/pdf' },
  msg: { label: 'MSG', extension: 'msg', mime: 'application/vnd.ms-outlook' },
  html: { label: 'HTML', extension: 'html', mime: 'text/html;charset=utf-8' },
  excel: {
    label: 'Excel',
    extension: 'xlsx',
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  },
  word: {
    label: 'Word',
    extension: 'docx',
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
};
export function validateFiles(files: { name: string; size: number }[]) {
  if (!files.length || files.length > MAX_FILES)
    throw new Error(`Choose 1–${MAX_FILES} EML files.`);
  if (files.some((f) => !/\.eml$/i.test(f.name)))
    throw new Error(
      'Only .eml files are supported. MSG, MBOX and renamed files are not EML.',
    );
  if (
    files.some((f) => !f.size) ||
    files.reduce((n, f) => n + f.size, 0) > MAX_BYTES
  )
    throw new Error('Files must be non-empty and no more than 20 MB combined.');
}
export async function parseEmail(
  raw: ArrayBuffer | Uint8Array | string,
): Promise<Email> {
  const size =
    typeof raw === 'string'
      ? new TextEncoder().encode(raw).length
      : raw.byteLength;
  if (!size || size > MAX_BYTES)
    throw new Error('The email is empty or exceeds 20 MB.');
  const start =
    typeof raw === 'string'
      ? raw.slice(0, 65536)
      : new TextDecoder().decode(
          raw instanceof ArrayBuffer
            ? raw.slice(0, 65536)
            : raw.subarray(0, 65536),
        );
  if (
    !/^(?:from|to|subject|date|mime-version|content-type|received|message-id):/im.test(
      start,
    )
  )
    throw new Error('This file does not contain recognizable email headers.');
  const email = await PostalMime.parse(raw, {
    maxNestingDepth: 30,
    maxRfc822NestingDepth: 0,
  });
  if ((email.text?.length || 0) + (email.html?.length || 0) > MAX_TEXT)
    throw new Error(
      'Message body exceeds the 500,000-character limit. Split this export into smaller messages.',
    );
  if (email.attachments.length > 200)
    throw new Error('A message can contain at most 200 attachments.');
  return email;
}
export function addresses(items?: Address[]): string {
  return (items || [])
    .map((a) =>
      a.group
        ? `${a.name}: ${addresses(a.group)}`
        : a.name
          ? `${a.name} <${a.address}>`
          : a.address,
    )
    .join('; ');
}
export function headers(email: Email): [string, string][] {
  return [
    ['Subject', email.subject || '(No subject)'],
    ['From', addresses(email.from ? [email.from] : [])],
    ['To', addresses(email.to)],
    ['Cc', addresses(email.cc)],
    ['Bcc', addresses(email.bcc)],
    ['Date', email.date || ''],
    ['Message-ID', email.messageId || ''],
  ];
}
export function attachmentBytes(
  content: Email['attachments'][number]['content'],
): Uint8Array {
  if (typeof content === 'string')
    throw new Error('Unexpected encoded attachment.');
  return content instanceof Uint8Array ? content : new Uint8Array(content);
}
export function safeName(name: string): string {
  return (
    name
      .replace(/\.[^.]+$/, '')
      .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')
      .replace(/^\.+|[. ]+$/g, '')
      .slice(0, 100) || 'email'
  );
}
export function escapeXml(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '')
    .replace(
      /[&<>"']/g,
      (c) =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&apos;',
        })[c]!,
    );
}
