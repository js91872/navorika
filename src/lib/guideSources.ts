export interface GuideSource { name: string; url: string }

const webImageFormats = { name: 'MDN Web Docs — Image file type and format guide', url: 'https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types' };
const pdfSpecification = { name: 'PDF Association — ISO 32000 (PDF specification)', url: 'https://pdfa.org/resource/iso-32000-pdf/' };

export const guideSources: Record<string, GuideSource[]> = {
  'word-to-cdr-formatting-guide': [{ name: 'LibreOffice Help — PDF export', url: 'https://help.libreoffice.org/latest/en-US/text/shared/01/ref_pdf_export.html' }, { name: 'Unicode Consortium — Unicode Standard', url: 'https://www.unicode.org/standard/standard.html' }],
  'pdf-to-cdr-editing-guide': [pdfSpecification, { name: 'CorelDRAW Help', url: 'https://product.corel.com/help/CorelDRAW/' }],
  'raster-image-to-cdr-guide': [webImageFormats, { name: 'W3C — SVG 2 specification', url: 'https://www.w3.org/TR/SVG2/' }],
  'svg-vs-cdr-guide': [{ name: 'W3C — SVG 2 specification', url: 'https://www.w3.org/TR/SVG2/' }, { name: 'CorelDRAW Help', url: 'https://product.corel.com/help/CorelDRAW/' }],
  'open-cdr-without-coreldraw': [{ name: 'The Document Foundation — LibreOffice CorelDRAW import release notes', url: 'https://wiki.documentfoundation.org/ReleaseNotes/3.6#CorelDRAW_Import' }, { name: 'libcdr project', url: 'https://wiki.documentfoundation.org/DLP/Libraries/libcdr' }],
  'newer-cdr-older-coreldraw': [{ name: 'CorelDRAW Help', url: 'https://product.corel.com/help/CorelDRAW/' }, pdfSpecification],
  'best-coreldraw-print-format': [pdfSpecification, { name: 'W3C — SVG 2 specification', url: 'https://www.w3.org/TR/SVG2/' }],
  'preserve-fonts-coreldraw-conversion': [{ name: 'Unicode Consortium — Unicode Standard', url: 'https://www.unicode.org/standard/standard.html' }, pdfSpecification],
  'how-to-calculate-sip-returns': [{ name: 'SEBI Investor — Mutual fund investor education', url: 'https://investor.sebi.gov.in/' }],
  'how-to-calculate-emi': [{ name: 'Reserve Bank of India — Financial education', url: 'https://www.rbi.org.in/financialeducation/' }],
  'bmi-calculator-guide': [{ name: 'World Health Organization — Obesity and overweight', url: 'https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight' }],
  'bmr-tdee-guide': [{ name: 'NIDDK — Body Weight Planner', url: 'https://www.niddk.nih.gov/bwp' }],
  'pdf-compression-guide': [pdfSpecification],
  'how-to-merge-pdf-files': [pdfSpecification],
  'image-compression-guide': [webImageFormats],
  'how-to-resize-images': [webImageFormats],
  'gst-calculation-guide': [{ name: 'Central Board of Indirect Taxes and Customs — GST', url: 'https://cbic-gst.gov.in/' }],
  'pdf-security-guide': [pdfSpecification],
  'heart-rate-zones-guide': [{ name: 'American Heart Association — Target heart rates', url: 'https://www.heart.org/en/healthy-living/exercise-and-physical-activity/fitness-basics/target-heart-rates' }],
  'ppf-vs-fd-comparison': [{ name: 'India Post — Post Office saving schemes', url: 'https://www.indiapost.gov.in/Financial/Pages/Content/Post-Office-Saving-Schemes.aspx' }],
  'base64-encoding-guide': [{ name: 'IETF RFC 4648 — Base-N encodings', url: 'https://www.rfc-editor.org/rfc/rfc4648' }],
  'qr-code-guide': [{ name: 'ISO/IEC 18004 — QR Code specification', url: 'https://www.iso.org/standard/62021.html' }],
  'calorie-deficit-guide': [{ name: 'NIDDK — Body Weight Planner', url: 'https://www.niddk.nih.gov/bwp' }],
  'jwt-decoding-guide': [{ name: 'IETF RFC 7519 — JSON Web Token', url: 'https://www.rfc-editor.org/rfc/rfc7519' }],
  'tax-planning-guide-2026': [{ name: 'Income Tax Department — AY 2026–27 guidance', url: 'https://www.incometax.gov.in/iec/foportal/help/non-company/return-applicable-0' }],
  'macronutrients-guide': [{ name: 'World Health Organization — Healthy diet', url: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet' }],
  'json-formatting-guide': [{ name: 'IETF RFC 8259 — The JSON Data Interchange Format', url: 'https://www.rfc-editor.org/rfc/rfc8259' }],
  'image-formats-guide': [webImageFormats],
  'seo-tools-guide': [{ name: 'Google Search Central — SEO Starter Guide', url: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide' }, { name: 'Google Search Central — Structured data guidelines', url: 'https://developers.google.com/search/docs/appearance/structured-data/sd-policies' }],
  'house-construction-cost-guide': [{ name: 'RICS — New Rules of Measurement', url: 'https://www.rics.org/profession-standards/rics-standards-and-guidance/sector-standards/construction-standards/nrm' }],
  'water-tank-size-capacity-guide': [{ name: 'NIST — Guide for the Use of the International System of Units', url: 'https://www.nist.gov/pml/special-publication-811' }],
  'how-to-calculate-roof-area': [{ name: 'OSHA — Fall protection in residential construction', url: 'https://www.osha.gov/residential-fall-protection/guidance' }],
  'flooring-calculation-guide': [{ name: 'NIST — SI units for area', url: 'https://www.nist.gov/pml/owm/metric-si/si-units-area' }],
  'asphalt-calculation-guide': [{ name: 'Federal Highway Administration — Asphalt pavement resources', url: 'https://www.fhwa.dot.gov/pavement/asphalt/' }],
  'gravel-calculation-guide': [{ name: 'Federal Highway Administration — Aggregate resources', url: 'https://www.fhwa.dot.gov/pavement/' }],
  'electricity-cost-calculation-guide': [{ name: 'U.S. Energy Information Administration — Measuring electricity', url: 'https://www.eia.gov/energyexplained/electricity/measuring-electricity.php' }],
  'brick-calculation-guide': [{ name: 'The Brick Industry Association — Technical Notes', url: 'https://www.gobrick.com/resources/technical-notes' }],
  'dimensional-weight-guide': [{ name: 'UPS — Package dimensions, size limits and weight guide', url: 'https://www.ups.com/us/en/support/shipping-support/shipping-dimensions-weight' }],
  'construction-estimate-quote-guide': [{ name: 'RICS — New Rules of Measurement', url: 'https://www.rics.org/profession-standards/rics-standards-and-guidance/sector-standards/construction-standards/nrm' }],
};

export function getGuideSources(slug: string) {
  return guideSources[slug] ?? [];
}
