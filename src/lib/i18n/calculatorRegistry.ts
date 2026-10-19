export const localizedCalculatorSlugs = [
  'image-file-size-estimator', 'photo-storage-calculator', 'image-bandwidth-calculator',
  'square-footage-calculator', 'cubic-yard-calculator',
  'roofing-shingle-calculator',
  'rafter-length-calculator',
  'stud-calculator',
  'drywall-mud-calculator',
  'roof-ridge-height-calculator',
  'fascia-replacement-cost-calculator',
  'ppi-calculator',
  'shed-ramp-angle-calculator',
  'construction-material-waste-calculator',
  'soffit-fascia-calculator',
  'attic-insulation-payback-calculator',
  'joist-deflection-calculator',
  'hvac-duct-cfm-calculator',
  'mortar-calculator',
  'concrete-block-calculator',
  'rainwater-harvesting-calculator',
] as const;
export type LocalizedCalculatorSlug = (typeof localizedCalculatorSlugs)[number];
export const isLocalizedCalculator = (slug: string): slug is LocalizedCalculatorSlug =>
  localizedCalculatorSlugs.some((candidate) => candidate === slug);

