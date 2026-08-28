import { categories, tools, type RegisteredTool } from '@/data/registry';
import { toolsUnderReview } from '@/lib/seo/toolReview';

export interface ToolCluster {
  id: string;
  name: string;
  description: string;
  category: string;
  toolSlugs: string[];
}

export interface ToolkitGroup {
  name: string;
  description: string;
  toolSlugs: string[];
}

export interface Toolkit {
  slug: string;
  name: string;
  seoTitle: string;
  description: string;
  intro: string;
  categorySlugs: string[];
  groups: ToolkitGroup[];
  guideSlugs: string[];
  faqs?: Array<{ question: string; answer: string }>;
}

export const clusters: ToolCluster[] = [
  { id: 'pdf-organize', name: 'Organize PDF Pages', description: 'Combine, separate, reorder, rotate, and extract pages in document workflows.', category: 'pdf-tools', toolSlugs: ['merge-pdf', 'split-pdf', 'reorder-pdf', 'rotate-pdf', 'delete-pdf-pages', 'extract-pdf-pages', 'interleave-pdf'] },
  { id: 'pdf-convert', name: 'PDF Conversion', description: 'Move content between PDF, image, and text formats.', category: 'pdf-tools', toolSlugs: ['jpg-to-pdf', 'webp-to-pdf', 'pdf-to-image', 'pdf-to-jpg', 'extract-pdf-text'] },
  { id: 'pdf-edit', name: 'Edit and Prepare PDFs', description: 'Prepare page appearance, metadata, numbering, and reusable document output.', category: 'pdf-tools', toolSlugs: ['add-image-to-pdf', 'add-page-numbers', 'add-watermark', 'compress-pdf', 'crop-pdf', 'flatten-pdf', 'pdf-metadata-editor'] },
  { id: 'pdf-security', name: 'PDF Signing and Security', description: 'Sign documents and manage document access where browser support is validated.', category: 'pdf-tools', toolSlugs: ['sign-pdf', 'protect-pdf', 'unlock-pdf'] },

  { id: 'image-convert', name: 'Image Format Conversion', description: 'Convert individual images or batches between common web and document formats.', category: 'image-tools', toolSlugs: ['batch-image-converter', 'convert-jpg-to-png', 'convert-jpg-to-webp', 'convert-png-to-jpg', 'convert-png-to-webp', 'convert-webp-to-jpg', 'heic-to-jpg', 'heic-to-png', 'image-converter', 'image-to-pdf', 'png-to-svg', 'svg-to-png', 'webp-to-png'] },
  { id: 'image-optimize', name: 'Image Size and Quality', description: 'Resize, compress, upscale, and inspect image output for web or print use.', category: 'image-tools', toolSlugs: ['change-image-resolution', 'compress-image', 'compress-jpg', 'compress-png', 'compress-webp', 'image-dpi-converter', 'image-metadata-viewer', 'resize-image', 'upscale-image'] },
  { id: 'image-edit', name: 'Image Editing', description: 'Crop, rotate, retouch, watermark, and protect visual content.', category: 'image-tools', toolSlugs: ['blur-face', 'crop-image', 'photo-editor', 'rotate-image', 'watermark-image'] },
  { id: 'image-create', name: 'Image Creation and Publishing', description: 'Create visual assets and prepare them for identity, social, and web use.', category: 'image-tools', toolSlugs: ['color-extraction-studio', 'html-to-image', 'icon-sticker-maker', 'id-photo-maker', 'meme-generator', 'photo-collage-maker', 'social-media-resizer'] },

  { id: 'finance-budget', name: 'Budgeting and Cash Flow', description: 'Model spending, purchasing power, currency, and household cash flow.', category: 'finance-calculators', toolSlugs: ['cashflow-budget-architect', 'currency-converter', 'wealth-inflation-matrix'] },
  { id: 'finance-invest', name: 'Investing and Returns', description: 'Project recurring investments, fixed returns, and comparable investment outcomes.', category: 'finance-calculators', toolSlugs: ['sip-calculator', 'fd-calculator', 'ppf-calculator', 'investment-return-profiler'] },
  { id: 'finance-loans', name: 'Loans and Amortization', description: 'Estimate repayments, interest costs, and amortization schedules.', category: 'finance-calculators', toolSlugs: ['loan-emi-calculator', 'loan-amortization-suite'] },
  { id: 'finance-retirement', name: 'Savings and Retirement', description: 'Plan longer-term savings targets and retirement funding.', category: 'finance-calculators', toolSlugs: ['retirement-calculator', 'savings-retirement-hub'] },
  { id: 'finance-tax', name: 'Tax and Business Finance', description: 'Estimate tax, GST, and compliance-related figures for planning.', category: 'finance-calculators', toolSlugs: ['gst-calculator', 'tax-calculator', 'taxation-compliance-deck'] },

  { id: 'health-body', name: 'Body Composition', description: 'Estimate weight ranges and body-composition screening measures.', category: 'health-calculators', toolSlugs: ['bmi-calculator', 'body-fat-calculator', 'healthy-weight-calculator', 'ideal-weight-calculator', 'lean-body-mass-calculator', 'waist-to-height-ratio-calculator', 'waist-to-hip-ratio-calculator'] },
  { id: 'health-energy', name: 'Energy and Nutrition', description: 'Estimate resting energy, daily expenditure, and calorie targets.', category: 'health-calculators', toolSlugs: ['bmr-calculator', 'calorie-calculator', 'tdee-calculator'] },
  { id: 'health-activity', name: 'Activity and Calories', description: 'Estimate energy used during common walking and running activities.', category: 'health-calculators', toolSlugs: ['calories-burned-calculator', 'running-calories-calculator', 'walking-calories-calculator'] },
  { id: 'health-heart', name: 'Heart Rate and Training', description: 'Estimate heart-rate ranges and training zones for exercise planning.', category: 'health-calculators', toolSlugs: ['heart-rate-calculator', 'target-heart-rate-calculator'] },

  { id: 'developer-data', name: 'Data and Text', description: 'Format, validate, encode, decode, and transform developer data.', category: 'developer-tools', toolSlugs: ['base64-encoder', 'code-minifier-beautifier', 'developer-utilities', 'developer-utils', 'markup-formatter', 'universal-json-studio'] },
  { id: 'developer-test', name: 'Testing and Time', description: 'Test patterns and convert technical time representations.', category: 'developer-tools', toolSlugs: ['regex-tester', 'unix-timestamp-converter'] },
  { id: 'developer-security', name: 'Security, Tokens, and IDs', description: 'Inspect tokens, use browser cryptography, and create scannable identifiers.', category: 'developer-tools', toolSlugs: ['bioluminescent-reader', 'jwt-base64-deck', 'qr-code-studio', 'web-crypto-studio'] },
  { id: 'developer-web', name: 'Web and SEO', description: 'Build web presentation assets, metadata, campaign URLs, and crawler directives.', category: 'developer-tools', toolSlugs: ['css-gradient-generator', 'meta-tag-generator', 'robots-txt-generator', 'utm-builder', 'webmaster-seo-builder'] },

  { id: 'construction-concrete', name: 'Concrete and Masonry', description: 'Estimate concrete, cement, brick, reinforcement, sand, and aggregate needs.', category: 'construction-calculators', toolSlugs: ['brick-calculator', 'cement-calculator', 'concrete-calculator', 'gravel-calculator', 'rebar-calculator', 'sand-calculator'] },
  { id: 'construction-finishes', name: 'Flooring and Finishes', description: 'Plan floor, tile, paint, and roof coverage for improvement work.', category: 'construction-calculators', toolSlugs: ['flooring-calculator', 'paint-calculator', 'roof-area-calculator', 'tile-calculator'] },
  { id: 'construction-site', name: 'Site and Earthworks', description: 'Estimate site area, excavation, asphalt, and storage quantities.', category: 'construction-calculators', toolSlugs: ['asphalt-calculator', 'excavation-calculator', 'land-area-converter', 'water-tank-calculator'] },
  { id: 'construction-structural', name: 'Structural and Electrical', description: 'Plan steel, wire, voltage-drop, and solar requirements before detailed design.', category: 'construction-calculators', toolSlugs: ['solar-panel-calculator', 'steel-weight-calculator', 'voltage-drop-calculator', 'wire-size-calculator'] },
  { id: 'construction-estimating', name: 'Project Cost Estimating', description: 'Create early construction and house-project cost estimates.', category: 'construction-calculators', toolSlugs: ['construction-cost-calculator', 'house-construction-cost-calculator'] },
];

export const toolkits: Toolkit[] = [
  {
    slug: 'contractor-estimating-calculators', name: 'Contractor Estimating Calculators', seoTitle: 'Free Contractor Estimating Calculators',
    description: 'Estimate materials, site quantities, and early project costs with connected construction calculators.',
    intro: 'Move from site measurements to practical material and cost estimates. These calculators support early planning and quoting; final quantities should still be checked against drawings, specifications, local conditions, and supplier guidance.',
    categorySlugs: ['construction-calculators'],
    groups: [
      { name: 'Concrete and masonry', description: 'Estimate core mix and masonry quantities before ordering.', toolSlugs: ['concrete-calculator', 'cement-calculator', 'rebar-calculator', 'brick-calculator', 'sand-calculator', 'gravel-calculator'] },
      { name: 'Site and project costs', description: 'Translate site dimensions into early earthwork, paving, and budget estimates.', toolSlugs: ['excavation-calculator', 'asphalt-calculator', 'construction-cost-calculator', 'house-construction-cost-calculator'] },
    ], guideSlugs: [],
  },
  {
    slug: 'home-improvement-calculators', name: 'Home Improvement Calculators', seoTitle: 'Free Home Improvement Calculators',
    description: 'Plan flooring, tile, paint, roofing, electrical, solar, and water-storage projects.',
    intro: 'Use these calculators to turn room, roof, and household requirements into planning quantities. The grouped workflow makes it easier to compare surface finishes, utility needs, and allowance for waste.',
    categorySlugs: ['construction-calculators'],
    groups: [
      { name: 'Rooms and surfaces', description: 'Plan coverage and material allowances for floors, walls, and roofs.', toolSlugs: ['flooring-calculator', 'tile-calculator', 'paint-calculator', 'roof-area-calculator'] },
      { name: 'Home utilities', description: 'Estimate practical electrical, solar, and water-storage requirements.', toolSlugs: ['wire-size-calculator', 'voltage-drop-calculator', 'solar-panel-calculator', 'water-tank-calculator'] },
    ], guideSlugs: [],
  },
  {
    slug: 'investment-planning-calculators', name: 'Investment Planning Calculators', seoTitle: 'Free Investment Planning Calculators',
    description: 'Compare recurring investments, fixed-return products, inflation, and retirement scenarios.',
    intro: 'Explore how contribution amount, time, assumed return, and inflation affect long-term outcomes. Results are educational projections, not promises or individualized investment advice.',
    categorySlugs: ['finance-calculators'],
    groups: [
      { name: 'Investment returns', description: 'Project and compare common recurring and fixed-return approaches.', toolSlugs: ['sip-calculator', 'fd-calculator', 'ppf-calculator', 'investment-return-profiler'] },
      { name: 'Long-term planning', description: 'Connect purchasing power, savings targets, and retirement needs.', toolSlugs: ['wealth-inflation-matrix', 'retirement-calculator', 'savings-retirement-hub'] },
    ], guideSlugs: ['how-to-calculate-sip-returns', 'ppf-vs-fd-comparison'],
    faqs: [{ question: 'Are the projected returns guaranteed?', answer: 'No. The calculators show scenarios from the inputs and assumptions you provide. Actual rates, returns, taxes, fees, and inflation can differ.' }],
  },
  {
    slug: 'loan-and-budget-calculators', name: 'Loan and Budget Calculators', seoTitle: 'Free Loan and Budget Calculators',
    description: 'Connect borrowing costs, repayment schedules, household cash flow, and tax planning.',
    intro: 'Evaluate whether a payment fits the wider budget, not just whether a lender offers it. These tools bring loan repayment, cash-flow, currency, and tax estimates into one planning path.',
    categorySlugs: ['finance-calculators'],
    groups: [
      { name: 'Borrowing', description: 'Estimate monthly payments, total interest, and repayment schedules.', toolSlugs: ['loan-emi-calculator', 'loan-amortization-suite'] },
      { name: 'Cash flow and tax', description: 'Review affordability alongside cash flow, currency, GST, and tax estimates.', toolSlugs: ['cashflow-budget-architect', 'currency-converter', 'gst-calculator', 'tax-calculator'] },
    ], guideSlugs: ['how-to-calculate-emi', 'gst-calculation-guide', 'tax-planning-guide-2026'],
  },
  {
    slug: 'web-developer-tools', name: 'Web Developer Tools', seoTitle: 'Free Web Developer Tools',
    description: 'Format data, inspect tokens, test patterns, and prepare metadata and crawl directives.',
    intro: 'Handle common web-development checks without sending working data to an unnecessary server. Use the groups below to move from data inspection to testing and publishing tasks.',
    categorySlugs: ['developer-tools'],
    groups: [
      { name: 'Data and debugging', description: 'Transform structured data, encoded strings, tokens, patterns, and timestamps.', toolSlugs: ['universal-json-studio', 'base64-encoder', 'jwt-base64-deck', 'regex-tester', 'unix-timestamp-converter'] },
      { name: 'Publishing and SEO', description: 'Prepare metadata, campaign links, crawler rules, and reusable web assets.', toolSlugs: ['meta-tag-generator', 'robots-txt-generator', 'utm-builder', 'webmaster-seo-builder', 'css-gradient-generator'] },
    ], guideSlugs: ['json-formatting-guide', 'base64-encoding-guide', 'jwt-decoding-guide', 'seo-tools-guide'],
  },
  {
    slug: 'image-optimization-tools', name: 'Image Optimization Tools', seoTitle: 'Free Image Optimization Tools',
    description: 'Resize, compress, convert, crop, and prepare images for web and social publishing.',
    intro: 'Choose the right dimensions, format, and compression level for the destination. This collection connects the practical steps that usually happen together before an image is published.',
    categorySlugs: ['image-tools'],
    groups: [
      { name: 'Size and quality', description: 'Control pixel dimensions and file size while reviewing output quality.', toolSlugs: ['resize-image', 'change-image-resolution', 'compress-image', 'compress-jpg', 'compress-webp', 'upscale-image'] },
      { name: 'Prepare and publish', description: 'Convert, crop, rotate, watermark, and resize images for common channels.', toolSlugs: ['convert-png-to-webp', 'convert-webp-to-jpg', 'crop-image', 'rotate-image', 'watermark-image', 'social-media-resizer'] },
    ], guideSlugs: ['image-compression-guide', 'how-to-resize-images', 'image-formats-guide'],
  },
  {
    slug: 'pdf-document-workflows', name: 'PDF Document Workflows', seoTitle: 'Free PDF Document Workflow Tools',
    description: 'Combine, split, rotate, extract, sign, and prepare PDF documents in connected workflows.',
    intro: 'Complete common document tasks in a sensible sequence: organize pages, prepare presentation details, then sign or export. Available tools process files locally where the implementation supports it.',
    categorySlugs: ['pdf-tools'],
    groups: [
      { name: 'Organize pages', description: 'Combine documents and put the required pages in the right order.', toolSlugs: ['merge-pdf', 'split-pdf', 'rotate-pdf', 'delete-pdf-pages', 'extract-pdf-pages', 'interleave-pdf'] },
      { name: 'Prepare documents', description: 'Add visible details, edit metadata, flatten supported fields, and sign output.', toolSlugs: ['add-page-numbers', 'add-watermark', 'crop-pdf', 'pdf-metadata-editor', 'flatten-pdf', 'sign-pdf'] },
    ], guideSlugs: ['how-to-merge-pdf-files', 'pdf-security-guide'],
  },
  {
    slug: 'fitness-and-body-calculators', name: 'Fitness and Body Calculators', seoTitle: 'Free Fitness and Body Calculators',
    description: 'Connect body composition, calorie needs, activity estimates, and heart-rate training zones.',
    intro: 'Use related screening and planning estimates together instead of treating one number as a complete health assessment. These results are educational and do not diagnose a condition or replace professional care.',
    categorySlugs: ['health-calculators'],
    groups: [
      { name: 'Body and energy', description: 'Estimate body composition, resting energy, and daily calorie needs.', toolSlugs: ['bmi-calculator', 'body-fat-calculator', 'lean-body-mass-calculator', 'bmr-calculator', 'tdee-calculator', 'calorie-calculator'] },
      { name: 'Activity and heart rate', description: 'Connect activity energy estimates with heart-rate training ranges.', toolSlugs: ['walking-calories-calculator', 'running-calories-calculator', 'calories-burned-calculator', 'heart-rate-calculator', 'target-heart-rate-calculator'] },
    ], guideSlugs: ['bmi-calculator-guide', 'bmr-tdee-guide', 'heart-rate-zones-guide', 'calorie-deficit-guide'],
    faqs: [{ question: 'Do these calculators provide medical advice?', answer: 'No. They provide educational estimates from standard inputs and formulas. A qualified clinician should interpret results for personal medical decisions.' }],
  },
];

export const complementaryTools: Record<string, string[]> = {
  'concrete-calculator': ['cement-calculator', 'rebar-calculator', 'sand-calculator', 'gravel-calculator'],
  'cement-calculator': ['concrete-calculator', 'sand-calculator', 'gravel-calculator'],
  'flooring-calculator': ['tile-calculator', 'paint-calculator'],
  'tile-calculator': ['flooring-calculator', 'paint-calculator'],
  'wire-size-calculator': ['voltage-drop-calculator', 'solar-panel-calculator'],
  'loan-emi-calculator': ['loan-amortization-suite', 'cashflow-budget-architect'],
  'sip-calculator': ['investment-return-profiler', 'fd-calculator', 'ppf-calculator'],
  'retirement-calculator': ['savings-retirement-hub', 'wealth-inflation-matrix'],
  'bmi-calculator': ['healthy-weight-calculator', 'body-fat-calculator', 'bmr-calculator'],
  'bmr-calculator': ['tdee-calculator', 'calorie-calculator'],
  'heart-rate-calculator': ['target-heart-rate-calculator', 'calories-burned-calculator'],
  'merge-pdf': ['reorder-pdf', 'rotate-pdf', 'split-pdf'],
  'split-pdf': ['extract-pdf-pages', 'merge-pdf', 'reorder-pdf'],
  'resize-image': ['compress-image', 'crop-image', 'social-media-resizer'],
  'compress-image': ['resize-image', 'image-metadata-viewer'],
  'universal-json-studio': ['base64-encoder', 'regex-tester'],
  'jwt-base64-deck': ['base64-encoder', 'web-crypto-studio'],
  'meta-tag-generator': ['robots-txt-generator', 'utm-builder', 'webmaster-seo-builder'],
};

const clusterByTool = new Map(clusters.flatMap((cluster) => cluster.toolSlugs.map((slug) => [slug, cluster] as const)));

export function getClusterForTool(slug: string) {
  return clusterByTool.get(slug);
}

export function getClustersForCategory(categorySlug: string) {
  return clusters.filter((cluster) => cluster.category === categorySlug);
}

export function getToolkitsForTool(slug: string) {
  return toolkits.filter((toolkit) => toolkit.groups.some((group) => group.toolSlugs.includes(slug)));
}

export function getToolkitsForCategory(categorySlug: string) {
  return toolkits.filter((toolkit) => toolkit.categorySlugs.includes(categorySlug));
}

export function getToolkitToolSlugs(toolkit: Toolkit) {
  return [...new Set(toolkit.groups.flatMap((group) => group.toolSlugs))];
}

export function getRelatedTools(slug: string, limit = 6, explicit: string[] = []): RegisteredTool[] {
  const current = tools.find((tool) => tool.slug === slug);
  if (!current) return [];
  const cluster = getClusterForTool(slug);
  const candidates = [
    ...explicit,
    ...(complementaryTools[slug] ?? []),
    ...(cluster?.toolSlugs ?? []),
    ...tools.filter((tool) => tool.category === current.category).map((tool) => tool.slug),
  ];
  return [...new Set(candidates)]
    .filter((candidate) => candidate !== slug && !toolsUnderReview.has(candidate))
    .flatMap((candidate) => {
      const tool = tools.find((item) => item.slug === candidate);
      return tool ? [tool] : [];
    })
    .slice(0, limit);
}

export function getCategoryName(slug: string) {
  return categories.find((category) => category.slug === slug)?.name ?? slug;
}
