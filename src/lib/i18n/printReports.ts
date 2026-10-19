import type { Dictionary } from './dictionaries';
import type { Language } from './config';
import type { PageBoxInspection, PageBoxRect } from '@/lib/calculations/pdfBleedTrim';

export function pdfInterpretation(page: PageBoxInspection, d: Dictionary) {
  if (!page.hasExplicitTrimBox && !page.hasExplicitBleedBox) return d.pdf.none;
  if (page.hasExplicitTrimBox && !page.hasExplicitBleedBox) return d.pdf.trimOnly;
  if (!page.hasExplicitTrimBox) return d.pdf.bleedOnly;
  return page.hasExtraBleedBoxArea ? d.pdf.extended : d.pdf.zero;
}

export function pdfReportRows(pages: PageBoxInspection[], d: Dictionary, locale: Language) {
  const f = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format;
  const size = (box: PageBoxRect) => `${f(box.width / 72 * 25.4)} × ${f(box.height / 72 * 25.4)}`;
  const headers = [d.pdf.page, ...[d.pdf.media, d.pdf.crop, d.pdf.trim, d.pdf.bleed,
    d.pdf.top, d.pdf.bottom, d.pdf.left, d.pdf.right].map((label) => `${label} (${d.ui.mm})`),
  d.pdf.explicitTrim, d.pdf.explicitBleed, d.pdf.explicitCrop, d.ui.result];
  return [headers, ...pages.map((p) => [f(p.pageNumber), size(p.mediaBox), size(p.cropBox), size(p.trimBox), size(p.bleedBox),
    ...['top', 'bottom', 'left', 'right'].map((side) => f(p.bleedMarginMm[side as keyof typeof p.bleedMarginMm])),
    p.hasExplicitTrimBox ? d.ui.yes : d.ui.no, p.hasExplicitBleedBox ? d.ui.yes : d.ui.no,
    p.hasExplicitCropBox ? d.ui.yes : d.ui.no, pdfInterpretation(p, d),
  ])];
}
