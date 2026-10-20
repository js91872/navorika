import type { reverseSalesTax } from '@/lib/calculations/reverseSalesTax';

export type TaxExport = {
  result: ReturnType<typeof reverseSalesTax>;
  mode: 'price' | 'rate';
  currency: string;
};
const source = 'https://navorika.com/tools/reverse-sales-tax-calculator';
const notes = [
  'One taxable base and one rate; exclude tips, exempt items and unrelated fees.',
  'Amounts are rounded to two decimals. Receipt rounding may differ.',
  'Currency is a display label only. No currency conversion or tax-rate lookup.',
  'This report is a calculation snapshot, not a tax invoice or tax advice.',
];
function validate(data: TaxExport) {
  const { result, mode, currency } = data;
  if (!['price', 'rate'].includes(mode) || !['USD', 'CAD', 'AUD', 'NZD', 'GBP', 'EUR', 'INR'].includes(currency)) throw new Error('Invalid report settings.');
  if (Object.values(result).some(value => !Number.isFinite(value) || value < 0)) throw new Error('A valid result is required before exporting.');
}
function calculation(data: TaxExport) {
  const { result: r, mode } = data;
  const rate = Number(r.rate.toFixed(4));
  return mode === 'price'
    ? `${r.total.toFixed(2)} / (1 + ${rate} / 100) = ${r.beforeTax.toFixed(2)} before tax`
    : `(${r.total.toFixed(2)} - ${r.beforeTax.toFixed(2)}) / ${r.beforeTax.toFixed(2)} x 100 = ${rate}%`;
}

export async function createTaxPdf(data: TaxExport): Promise<Uint8Array> {
  validate(data);
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  const pdf = await PDFDocument.create();
  pdf.setTitle('Reverse Sales Tax Calculator - Navorika');
  pdf.setAuthor('Navorika');
  const page = pdf.addPage([612, 792]); // US Letter
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const ink = rgb(.12, .16, .25), muted = rgb(.35, .39, .47), accent = rgb(.26, .27, .75);
  const text = (value: string, x: number, y: number, size = 11, strong = false, color = ink) => page.drawText(value, { x, y, size, font: strong ? bold : regular, color });
  page.drawRectangle({ x: 0, y: 675, width: 612, height: 117, color: accent });
  text('NAVORIKA', 42, 752, 12, true, rgb(1, 1, 1));
  text('Reverse Sales Tax Calculator', 42, 717, 23, true, rgb(1, 1, 1));
  text('Receipt breakdown', 42, 692, 11, false, rgb(.88, .89, 1));
  const { result: r, currency, mode } = data;
  text(`Mode: ${mode === 'price' ? 'Find price before tax' : 'Find tax rate'}`, 42, 645);
  text(`Currency: ${currency}  |  Snapshot: ${new Date().toISOString().slice(0, 10)} (UTC)`, 42, 623, 10, false, muted);
  const rows: [string, string][] = [
    ['Price before tax', `${currency} ${r.beforeTax.toFixed(2)}`],
    ['Included sales tax', `${currency} ${r.tax.toFixed(2)}`],
    ['Total including tax', `${currency} ${r.total.toFixed(2)}`],
    [mode === 'rate' ? 'Implied tax rate' : 'Entered tax rate', `${Number(r.rate.toFixed(4))}%`],
  ];
  let y = 577;
  for (const [label, value] of rows) {
    page.drawRectangle({ x: 42, y: y - 15, width: 528, height: 39, color: rgb(.95, .96, .99) });
    text(label, 54, y, 11, true);
    text(value, 558 - bold.widthOfTextAtSize(value, 12), y, 12, true, accent);
    y -= 49;
  }
  text('Calculation steps', 42, 355, 14, true);
  // Wrap long calculation lines, including extreme inputs, without shrinking the type.
  function wrap(value: string, startY: number, size = 10) {
    let line = '', yy = startY;
    for (const word of value.split(' ')) {
      const next = line ? `${line} ${word}` : word;
      if (regular.widthOfTextAtSize(next, size) > 528 && line) { text(line, 42, yy, size); yy -= 16; line = word; } else line = next;
    }
    if (line) text(line, 42, yy, size);
    return yy - 19;
  }
  y = wrap(calculation(data), 331);
  y = wrap(`Included tax: ${r.total.toFixed(2)} - ${r.beforeTax.toFixed(2)} = ${r.tax.toFixed(2)} ${currency}`, y);
  text('Assumptions and rounding', 42, y - 15, 13, true);
  y -= 39;
  for (const note of notes) y = wrap(note, y, 9);
  text(source, 42, 56, 9, false, accent);
  text('Generated locally in your browser', 42, 38, 9, false, muted);
  return pdf.save();
}

/** Minimal native OOXML workbook; numeric results remain usable in Excel. */
export async function createTaxExcel(data: TaxExport): Promise<Uint8Array> {
  validate(data);
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();
  const esc = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  const { result: r, currency, mode } = data;
  const rows: (string | number)[][] = [
    ['Navorika | Reverse Sales Tax Calculator'],
    ['Calculation snapshot', new Date().toISOString()],
    ['Mode', mode === 'price' ? 'Find price before tax' : 'Find tax rate'],
    ['Currency', currency],
    [],
    ['Receipt breakdown', 'Amount'],
    ['Price before tax', r.beforeTax],
    ['Included sales tax', r.tax],
    ['Total including tax', r.total],
    [mode === 'rate' ? 'Implied tax rate' : 'Entered tax rate', r.rate / 100],
    [],
    ['Calculation steps'],
    [calculation(data)],
    [`Included tax: ${r.total.toFixed(2)} - ${r.beforeTax.toFixed(2)} = ${r.tax.toFixed(2)} ${currency}`],
    [],
    ['Assumptions and rounding'],
    ...notes.map(note => [note]),
    ['Amounts and rate are exported as numbers. This file is a static result snapshot.'],
    ['Source', source],
  ];
  const sheetRows = rows.map((row, index) => {
    const n = index + 1;
    const header = [1, 6, 12, 16].includes(n);
    return `<row r="${n}" ht="${n >= 13 ? 32 : 26}" customHeight="1">${row.map((value, col) => {
      const ref = `${col === 0 ? 'A' : 'B'}${n}`;
      if (typeof value === 'number') return `<c r="${ref}" s="${n === 10 ? 3 : 2}"><v>${value}</v></c>`;
      return `<c r="${ref}" t="inlineStr" s="${header ? 1 : 0}"><is><t xml:space="preserve">${esc(value)}</t></is></c>`;
    }).join('')}</row>`;
  }).join('');
  const merges = [1, 12, 13, 14, 16, 17, 18, 19, 20, 21].map(n => `<mergeCell ref="A${n}:B${n}"/>`).join('');
  zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`);
  zip.file('_rels/.rels', '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>');
  zip.file('xl/workbook.xml', '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Tax breakdown" sheetId="1" r:id="rId1"/></sheets></workbook>');
  zip.file('xl/_rels/workbook.xml.rels', '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>');
  zip.file('xl/styles.xml', `<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="2"><numFmt numFmtId="164" formatCode="&quot;${currency} &quot;#,##0.00"/><numFmt numFmtId="165" formatCode="0.####%"/></numFmts><fonts count="2"><font><sz val="11"/><name val="Calibri"/><color rgb="FF263244"/></font><font><b/><sz val="12"/><name val="Calibri"/><color rgb="FFFFFFFF"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF4345BF"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="4"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"><alignment vertical="center" wrapText="1"/></xf><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFill="1" applyFont="1"><alignment vertical="center" wrapText="1"/></xf><xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"><alignment vertical="center"/></xf><xf numFmtId="165" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"><alignment vertical="center"/></xf></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`);
  zip.file('xl/worksheets/sheet1.xml', `<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><dimension ref="A1:B22"/><sheetViews><sheetView workbookViewId="0" showGridLines="0"/></sheetViews><sheetFormatPr defaultRowHeight="26"/><cols><col min="1" max="1" width="55" customWidth="1"/><col min="2" max="2" width="70" customWidth="1"/></cols><sheetData>${sheetRows}</sheetData><mergeCells count="10">${merges}</mergeCells><pageMargins left="0.4" right="0.4" top="0.5" bottom="0.5" header="0.2" footer="0.2"/><pageSetup paperSize="1" orientation="landscape" fitToWidth="1" fitToHeight="1"/></worksheet>`);
  return zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
}

export function downloadTaxFile(bytes: Uint8Array, type: 'pdf' | 'xlsx') {
  const blob = new Blob([bytes as BlobPart], { type: type === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `navorika-reverse-sales-tax.${type}`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30000);
}
