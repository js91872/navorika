export interface GuideSource { name: string; url: string }

const webImageFormats = { name: 'MDN Web Docs — Image file type and format guide', url: 'https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types' };
const pdfSpecification = { name: 'PDF Association — ISO 32000 (PDF specification)', url: 'https://pdfa.org/resource/iso-32000-pdf/' };

export const guideSources: Record<string, GuideSource[]> = {
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
};

export function getGuideSources(slug: string) {
  return guideSources[slug] ?? [];
}
