import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

/** Plain text export: no Markdown interpretation or character stripping. */
export async function emailTextToPdf(
  text: string,
  title: string,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(title);
  pdf.setAuthor('Navorika');
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const normalized = text
    .replace(/\r\n?/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '');
  let vector = true;
  try {
    font.encodeText(normalized.replace(/\n/g, ''));
  } catch {
    vector = false;
  }
  if (vector) {
    let page = pdf.addPage([595.28, 841.89]);
    let y = 790;
    const draw = (line: string) => {
      if (y < 52) {
        page = pdf.addPage([595.28, 841.89]);
        y = 790;
      }
      if (line)
        page.drawText(line, {
          x: 48,
          y,
          size: 10,
          font,
          color: rgb(0.12, 0.12, 0.14),
        });
      y -= 15;
    };
    for (const paragraph of normalized.split('\n')) {
      let line = '';
      for (const char of paragraph) {
        if (font.widthOfTextAtSize(line + char, 10) > 495 && line) {
          draw(line);
          line = '';
        }
        line += char;
      }
      draw(line);
    }
  } else {
    if (typeof document === 'undefined')
      throw new Error('Non-Western PDF text requires a browser canvas.');
    const canvas = document.createElement('canvas');
    canvas.width = 1190;
    canvas.height = 1684;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('PDF drawing is unavailable in this browser.');
    let y = 100;
    let hasContent = false;
    const reset = () => {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#18181b';
      ctx.font = '20px system-ui, sans-serif';
      ctx.textBaseline = 'top';
    };
    reset();
    const flush = async () => {
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (b) =>
            b ? resolve(b) : reject(new Error('PDF page export failed.')),
          'image/png',
        ),
      );
      const image = await pdf.embedPng(await blob.arrayBuffer());
      pdf
        .addPage([595, 842])
        .drawImage(image, { x: 0, y: 0, width: 595, height: 842 });
      reset();
      y = 100;
      hasContent = false;
    };
    const draw = async (line: string) => {
      if (y > 1570) await flush();
      const rtl = /[\u0590-\u08ff]/.test(line);
      ctx.direction = rtl ? 'rtl' : 'ltr';
      ctx.textAlign = rtl ? 'right' : 'left';
      ctx.fillText(line, rtl ? 1094 : 96, y);
      y += 30;
      hasContent = true;
    };
    for (const paragraph of normalized.split('\n')) {
      let line = '';
      for (const char of paragraph) {
        if (ctx.measureText(line + char).width > 998 && line) {
          await draw(line);
          line = '';
        }
        line += char;
      }
      await draw(line);
    }
    if (hasContent) await flush();
    canvas.width = 0;
    canvas.height = 0;
  }
  return pdf.save();
}
