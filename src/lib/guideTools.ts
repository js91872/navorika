// Map guides to relevant tools
export const guideTools: Record<string, string[]> = {
  'how-to-calculate-sip-returns': ['sip-calculator', 'fd-calculator', 'ppf-calculator'],
  'how-to-calculate-emi': ['loan-emi-calculator', 'loan-amortization-suite', 'cashflow-budget-architect'],
  'bmi-calculator-guide': ['bmi-calculator', 'bmr-calculator', 'body-fat-calculator'],
  'bmr-tdee-guide': ['bmr-calculator', 'tdee-calculator', 'calorie-calculator'],
  'pdf-compression-guide': ['compress-pdf', 'merge-pdf', 'split-pdf'],
  'how-to-merge-pdf-files': ['merge-pdf', 'split-pdf', 'reorder-pdf'],
  'image-compression-guide': ['compress-image', 'resize-image', 'image-converter'],
  'how-to-resize-images': ['resize-image', 'crop-image', 'rotate-image'],
  'gst-calculation-guide': ['gst-calculator', 'tax-calculator'],
  'pdf-security-guide': ['protect-pdf', 'unlock-pdf', 'sign-pdf'],
  'heart-rate-zones-guide': ['heart-rate-calculator'],
  'ppf-vs-fd-comparison': ['ppf-calculator', 'fd-calculator', 'sip-calculator'],
  'base64-encoding-guide': ['base64-encoder', 'jwt-decoder', 'json-formatter'],
  'qr-code-guide': ['qr-code-generator'],
  'calorie-deficit-guide': ['calorie-calculator', 'calories-burned-calculator', 'bmi-calculator'],
  'jwt-decoding-guide': ['jwt-decoder', 'base64-encoder', 'json-formatter'],
  'tax-planning-guide-2026': ['tax-calculator', 'gst-calculator', 'ppf-calculator'],
  'macronutrients-guide': ['calorie-calculator', 'bmi-calculator', 'bmr-calculator'],
  'json-formatting-guide': ['json-formatter', 'json-schema-validator', 'json-diff-compare', 'json-to-csv-flattener', 'csv-to-json-converter'],
  'image-formats-guide': ['image-converter', 'compress-image', 'resize-image'],
  'seo-tools-guide': ['webmaster-seo-builder', 'utm-builder', 'meta-tag-generator', 'robots-txt-generator'],
  'house-construction-cost-guide': ['house-construction-cost-calculator', 'construction-cost-calculator', 'construction-estimate-builder'],
  'water-tank-size-capacity-guide': ['water-tank-calculator', 'land-area-converter'],
  'how-to-calculate-roof-area': ['roof-area-calculator', 'roof-pitch-calculator', 'house-construction-cost-calculator'],
  'flooring-calculation-guide': ['flooring-calculator', 'tile-calculator', 'land-area-converter'],
  'asphalt-calculation-guide': ['asphalt-calculator', 'gravel-calculator', 'sand-calculator'],
  'gravel-calculation-guide': ['gravel-calculator', 'sand-calculator', 'topsoil-calculator', 'mulch-calculator', 'paver-calculator'],
  'electricity-cost-calculation-guide': ['electricity-cost-calculator', 'solar-panel-calculator'],
  'brick-calculation-guide': ['brick-calculator', 'cement-calculator', 'sand-calculator', 'house-construction-cost-calculator'],
  'dimensional-weight-guide': ['dimensional-weight-calculator', 'unit-price-calculator'],
  'construction-estimate-quote-guide': ['construction-estimate-builder', 'contractor-estimate-generator', 'construction-cost-calculator', 'house-construction-cost-calculator']
};

export function getGuideTools(slug: string): string[] {
  return guideTools[slug] || [];
}
