import JSZip from 'jszip';
import { escapeXml, headers } from './email';
import type { Email } from 'postal-mime';

export async function emailsToXlsx(
  items: { name: string; email: Email; text: string }[],
) {
  const zip = new JSZip();
  const rows = [
    [
      'Source file',
      'Subject',
      'From',
      'To',
      'Cc',
      'Bcc',
      'Date',
      'Message-ID',
      'Body',
      'Attachment Names',
      'Body truncated',
    ],
    ...items.map(({ name, email, text }) => [
      name,
      ...headers(email).map(([, v]) => v),
      text.slice(0, 32767),
      email.attachments
        .map((a) => a.filename || 'unnamed attachment')
        .join('; '),
      text.length > 32767
        ? 'Yes — Excel cell limit; use Word for full body'
        : 'No',
    ]),
  ];
  // Inline strings cannot be interpreted as formulas, even when starting with =, +, - or @.
  const sheet = `<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" state="frozen"/></sheetView></sheetViews><sheetData>${rows.map((row, i) => `<row r="${i + 1}">${row.map((cell, j) => `<c r="${String.fromCharCode(65 + j)}${i + 1}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(cell.slice(0, 32767))}</t></is></c>`).join('')}</row>`).join('')}</sheetData><autoFilter ref="A1:K${rows.length}"/></worksheet>`;
  zip.file(
    '[Content_Types].xml',
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>',
  );
  zip.file(
    '_rels/.rels',
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
  );
  zip.file(
    'xl/workbook.xml',
    '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Emails" sheetId="1" r:id="rId1"/></sheets></workbook>',
  );
  zip.file(
    'xl/_rels/workbook.xml.rels',
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>',
  );
  zip.file('xl/worksheets/sheet1.xml', sheet);
  return zip.generateAsync({ type: 'uint8array' });
}
