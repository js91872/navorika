# Visual Inspection and Verification of Localized PDF Exports (Arabic & Russian)

This document provides a visual inspection report and technical analysis of multi-page Markdown-to-PDF generation for non-Latin script locales (**Arabic RTL** and **Russian Cyrillic**), comparing both standalone Node-generated samples and live browser-generated outputs in Chromium.

---

## 1. Overview of Artifacts & Relative Paths

All exported sample PDF files and rendered 2x resolution (1190 × 1684) PNG page screenshots are stored in [`public/samples/`](../public/samples/):

### Standalone Node-Generated Samples (`@napi-rs/canvas` + Skia)
- **Arabic PDF**: [`../public/samples/sample-arabic.pdf`](../public/samples/sample-arabic.pdf) (2 pages, ~283 KB)
  - Page 1: [`../public/samples/arabic-page-1.png`](../public/samples/arabic-page-1.png)
  - Page 2: [`../public/samples/arabic-page-2.png`](../public/samples/arabic-page-2.png)
- **Russian PDF**: [`../public/samples/sample-russian.pdf`](../public/samples/sample-russian.pdf) (2 pages, ~310 KB)
  - Page 1: [`../public/samples/russian-page-1.png`](../public/samples/russian-page-1.png)
  - Page 2: [`../public/samples/russian-page-2.png`](../public/samples/russian-page-2.png)

### Live Browser-Generated Outputs (Chromium HTML5 Canvas via Playwright)
- **Arabic PDF**: [`../public/samples/browser-arabic.pdf`](../public/samples/browser-arabic.pdf) (2 pages, ~283 KB)
  - Page 1: [`../public/samples/browser-arabic-page-1.png`](../public/samples/browser-arabic-page-1.png)
  - Page 2: [`../public/samples/browser-arabic-page-2.png`](../public/samples/browser-arabic-page-2.png)
- **Russian PDF**: [`../public/samples/browser-russian.pdf`](../public/samples/browser-russian.pdf) (2 pages, ~310 KB)
  - Page 1: [`../public/samples/browser-russian-page-1.png`](../public/samples/browser-russian-page-1.png)
  - Page 2: [`../public/samples/browser-russian-page-2.png`](../public/samples/browser-russian-page-2.png)

---

## 2. Visual Inspection Checklist

Visual inspection was performed on all rendered pages. Dark-pixel counts and density metrics serve as automated sanity boundaries, while human visual inspection verifies typographic legibility:

| Quality Criterion | Arabic RTL Inspection | Russian Cyrillic Inspection |
| :--- | :--- | :--- |
| **Glyph Integrity & Shaping** | **Passed**: HarfBuzz cursive shaping is preserved seamlessly. Letters connect fluently in initial, medial, and final forms without disjointed glyphs or missing dots. | **Passed**: All Cyrillic characters (ш, щ, ю, я, ж, ц, ъ, ь, etc.) render crisply with distinct letterforms and clean strokes. Zero tofu (``) or missing glyph replacements. |
| **Reading Direction & Alignment** | **Passed**: Headings, paragraphs, and list items align strictly to the right margin (`textAlign: 'right'`). Flow is right-to-left. | **Passed**: Headings, paragraphs, and list items align strictly to the left margin (`textAlign: 'left'`). Flow is left-to-right. |
| **Bullet Placement & Indentation** | **Passed**: Bullet symbol `•` is positioned at the right margin (`PAGE_WIDTH - MARGIN_X`), with text indented 28px leftward. Wrapped subsequent lines maintain the 28px indent without colliding with the bullet. | **Passed**: Bullet symbol `•` is positioned at `MARGIN_X`, with text indented 28px rightward. Wrapped lines align cleanly to the text boundary. |
| **Mixed Script & Numeric Handling** | **Passed**: Mixed Latin identifiers ("PDF", "ISO 216", "CMYK", "TypeScript", "LocalStorage") and Arabic-Indic/Latin numerals ("٣٠٠", "٣ ملم", "٥ ملم") integrate naturally into Arabic sentences without character inversion. | **Passed**: Embedded Latin terms ("Navorika", "Preflight", "Bleed", "Safety Margin", "300 DPI", "Dot Gain", "TypeScript") maintain correct spacing and baseline alignment. |
| **Line Wrapping & Edge Margins** | **Passed**: Lines wrap at `CONTENT_WIDTH - 28px` (for bullets) and `CONTENT_WIDTH` (for text). Ample margins prevent text clipping at the page boundaries. | **Passed**: Lines wrap cleanly at `CONTENT_WIDTH` without clipping or horizontal overflow. |
| **Multi-Page Pagination** | **Passed**: Multi-page document flows across Page 1 and Page 2. Clean page break between Section 3 and Section 4; trailing empty canvas pages are eliminated. | **Passed**: Section 2.2 flows onto Page 2 cleanly, followed by Sections 3 and 4. |

---

## 3. Comparison: Node-Generated vs. Browser-Generated Output

- **Node Generation**: Uses `@napi-rs/canvas` (powered by Skia and system-provided fonts such as `Noto Sans Arabic` and `Arial`).
- **Browser Generation**: Uses the browser's native HTML5 Canvas inside Chromium (powered by Blink's font-rendering pipeline and local font configuration).
- **Parity Result**: Both pipelines produce visually identical line-wrapping boundaries, paragraph breaks, and font sizes. File sizes are virtually identical (~283 KB for Arabic, ~310 KB for Russian across 2 pages).

---

## 4. Architectural Limitations & Trade-Offs

1. **Unselectable & Unsearchable Text**:
   - For Western / Latin-script languages (`en`, `fr`, `it`, `pt`, `es`, `de`), Navorika embeds Type 1 standard vector fonts directly in `pdf-lib`, producing lightweight, selectable, and searchable text streams.
   - For complex scripts (Arabic RTL and Russian Cyrillic), `pdf-lib` standard fonts do not provide unicode glyph coverage or OpenType layout tables. Navorika uses high-resolution (2x) canvas rasterization as an embedded PNG fallback.
   - **Consequence**: The rendered text is visually sharp and legible when printed or viewed, but readers cannot highlight, select, or copy text strings directly from the PDF viewer.
2. **File Size**:
   - Vector PDFs for Latin languages are typically 10–25 KB.
   - Rasterized 2x multi-page PDFs are approximately 140–160 KB per page (~280–310 KB for a 2-page document).
