import type { Email } from 'postal-mime';
import { type EmailFormat, headers } from './email';
import { bodyText, htmlDocument } from './html';

export async function exportEmail(
  email: Email,
  format: Exclude<EmailFormat, 'excel'>,
): Promise<Uint8Array> {
  const text = bodyText(email);
  if (format === 'html') return new TextEncoder().encode(htmlDocument(email));
  if (format === 'msg') {
    const { emailToMsg } = await import('./msg');
    return emailToMsg(email, text, htmlDocument(email));
  }
  const lines = [
    ...headers(email)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`),
    '',
    text,
    '',
    ...(email.attachments.length
      ? [
          'Attachment names (files not embedded):',
          ...email.attachments.map((a) => a.filename || 'unnamed attachment'),
        ]
      : []),
  ];
  if (format === 'word') {
    const { Document, Paragraph, TextRun, Packer } = await import('docx');
    const doc = new Document({
      sections: [
        {
          children: lines.flatMap((line) =>
            line
              .split(/\r?\n/)
              .map((s) => new Paragraph({ children: [new TextRun(s)] })),
          ),
        },
      ],
    });
    const blob = await Packer.toBlob(doc);
    return new Uint8Array(await blob.arrayBuffer());
  }
  const { emailTextToPdf } = await import('./pdf');
  return emailTextToPdf(lines.join('\n'), email.subject || 'Email');
}
