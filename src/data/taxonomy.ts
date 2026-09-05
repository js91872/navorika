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
  { id: 'image-optimize', name: 'Image Size and Quality', description: 'Resize, compress, upscale, and inspect image output for web or print use.', category: 'image-tools', toolSlugs: ['change-image-resolution', 'resize-image-to-1000x1000', 'compress-image', 'compress-jpg', 'compress-png', 'compress-webp', 'image-dpi-converter', 'image-metadata-viewer', 'resize-image', 'upscale-image'] },
  { id: 'image-edit', name: 'Image Editing', description: 'Crop, rotate, retouch, watermark, and protect visual content.', category: 'image-tools', toolSlugs: ['blur-face', 'crop-image', 'photo-editor', 'rotate-image', 'watermark-image'] },
  { id: 'image-create', name: 'Image Creation and Publishing', description: 'Create visual assets, sample colors, and prepare images for identity, social, and web use.', category: 'image-tools', toolSlugs: ['image-color-picker', 'html-to-image', 'icon-sticker-maker', 'id-photo-maker', 'meme-generator', 'photo-collage-maker', 'social-media-resizer'] },

  { id: 'finance-budget', name: 'Budgeting and Cash Flow', description: 'Model spending, purchasing power, currency, and household cash flow.', category: 'finance-calculators', toolSlugs: ['cashflow-budget-architect', 'currency-converter', 'wealth-inflation-matrix', 'ev-vs-gas-break-even-calculator', 'job-offer-total-comp-calculator'] },
  { id: 'finance-invest', name: 'Investing and Returns', description: 'Project recurring investments, fixed returns, and comparable investment outcomes.', category: 'finance-calculators', toolSlugs: ['sip-calculator', 'fd-calculator', 'ppf-calculator', 'investment-return-profiler'] },
  { id: 'saas-metrics', name: 'SaaS Metrics', description: 'Model cash runway, burn, acquisition efficiency, churn, growth, profitability, and recurring-revenue retention.', category: 'finance-calculators', toolSlugs: ['startup-runway-calculator', 'saas-burn-rate-calculator', 'ltv-cac-ratio-calculator', 'cac-payback-calculator', 'churn-impact-calculator', 'rule-of-40-calculator', 'net-revenue-retention-calculator', 'meeting-roi-calculator'] },
  { id: 'real-estate-investing', name: 'Real Estate Investing', description: 'Estimate rental operations, property yields, refinance outcomes, and renovation-project returns.', category: 'finance-calculators', toolSlugs: ['rental-property-cash-flow-calculator', 'rental-yield-calculator', 'cap-rate-calculator', 'cash-on-cash-return-calculator', 'brrrr-calculator', 'fix-and-flip-profit-calculator', 'short-term-rental-break-even-calculator', 'house-hacking-effective-rent-calculator'] },
  { id: 'investment-decisions', name: 'Investment and Debt Decisions', description: 'Understand loss recovery and compare structured multi-debt payoff strategies.', category: 'finance-calculators', toolSlugs: ['drawdown-recovery-calculator', 'debt-snowball-vs-avalanche-calculator'] },
  { id: 'finance-loans', name: 'Loans and Amortization', description: 'Estimate repayments, interest costs, and amortization schedules.', category: 'finance-calculators', toolSlugs: ['loan-emi-calculator', 'loan-amortization-suite'] },
  { id: 'finance-retirement', name: 'Savings and Retirement', description: 'Plan longer-term savings targets and retirement funding.', category: 'finance-calculators', toolSlugs: ['retirement-calculator', 'savings-retirement-hub'] },
  { id: 'finance-tax', name: 'Tax and Business Finance', description: 'Estimate tax, GST, and compliance-related figures for planning.', category: 'finance-calculators', toolSlugs: ['gst-calculator', 'tax-calculator', 'taxation-compliance-deck'] },

  { id: 'health-body', name: 'Body Composition', description: 'Estimate weight ranges and body-composition screening measures.', category: 'health-calculators', toolSlugs: ['bmi-calculator', 'body-fat-calculator', 'healthy-weight-calculator', 'ideal-weight-calculator', 'lean-body-mass-calculator', 'waist-to-height-ratio-calculator', 'waist-to-hip-ratio-calculator'] },
  { id: 'health-energy', name: 'Energy and Nutrition', description: 'Estimate resting energy, daily expenditure, and calorie targets.', category: 'health-calculators', toolSlugs: ['bmr-calculator', 'calorie-calculator', 'tdee-calculator', 'caffeine-half-life-calculator'] },
  { id: 'health-activity', name: 'Activity and Calories', description: 'Estimate energy used during common walking, running, and strength activities.', category: 'health-calculators', toolSlugs: ['calories-burned-calculator', 'running-calories-calculator', 'walking-calories-calculator', 'wilks-dots-powerlifting-calculator'] },
  { id: 'health-heart', name: 'Heart Rate and Training', description: 'Convert pulse counts and estimate heart-rate ranges and training zones for exercise planning.', category: 'health-calculators', toolSlugs: ['heart-rate-calculator', 'hrv-baseline-deviation-calculator'] },
  { id: 'pet-health', name: 'Pet Health and Nutrition', description: 'Estimate canine age progression, puppy adult weight curves, and feline energy requirements.', category: 'health-calculators', toolSlugs: ['dog-age-breed-specific-calculator', 'puppy-growth-predictor', 'cat-calorie-calculator'] },

  { id: 'developer-code-formatting', name: 'Code Formatting and Utility Hubs', description: 'Access general developer suites and parser-backed code or markup formatting workflows.', category: 'developer-tools', toolSlugs: ['code-minifier-beautifier', 'developer-utils', 'markup-formatter', 'gitignore-generator', 'docker-run-command-generator', 'typescript-to-zod-schema-converter', 'git-commit-message-formatter'] },
  { id: 'developer-json', name: 'JSON and Tabular Data', description: 'Format, validate, compare, flatten, and convert JSON and CSV data.', category: 'developer-tools', toolSlugs: ['json-formatter', 'json-schema-validator', 'json-diff-compare', 'json-to-csv-flattener', 'csv-to-json-converter'] },
  { id: 'developer-xml-documents', name: 'XML and Document Conversion', description: 'Merge and validate XML, create genuine DOCX documents, and extract clean or raw XML from modern Word files.', category: 'developer-tools', toolSlugs: ['merge-xml-files', 'xml-to-word-converter', 'word-to-xml-converter'] },
  { id: 'coreldraw-cdr-tools', name: 'CorelDRAW and CDR Tools', description: 'Prepare CorelDRAW-ready interchange files, preview supported CDR documents, inspect versions, and export open formats without fake native CDR files.', category: 'developer-tools', toolSlugs: ['coreldraw-tools', 'pdf-to-cdr-converter', 'word-to-cdr-converter', 'png-to-cdr-converter', 'jpg-to-cdr-converter', 'svg-to-cdr-converter', 'ai-to-cdr-converter', 'eps-to-cdr-converter', 'cdr-viewer', 'cdr-version-converter', 'cdr-to-pdf-converter', 'cdr-to-svg-converter', 'cdr-to-png-converter', 'cdr-to-jpg-converter', 'cdr-to-eps-converter'] },
  { id: 'developer-encoding', name: 'Text and URL Encoding', description: 'Encode and decode Base64, URLs, and HTML entities locally.', category: 'developer-tools', toolSlugs: ['base64-encoder', 'url-encoder-decoder', 'html-entity-encoder-decoder', 'utf8-vs-utf16-byte-calculator'] },
  { id: 'developer-networking', name: 'IPv4 Networking', description: 'Plan CIDR, subnet, wildcard, VLSM, IP range, and MAC-address workflows.', category: 'developer-tools', toolSlugs: ['cidr-subnet-wildcard-calculator', 'ip-range-calculator', 'vlsm-subnet-calculator', 'mac-address-generator'] },
  { id: 'developer-scheduling', name: 'Cron and Time', description: 'Understand cron schedules, calculate upcoming runs, and convert Unix timestamps.', category: 'developer-tools', toolSlugs: ['cron-next-run-calculator', 'cron-expression-humanizer', 'unix-timestamp-converter'] },
  { id: 'developer-debugging', name: 'Testing and HTTP Reference', description: 'Test regular expressions and look up standardized HTTP response behavior.', category: 'developer-tools', toolSlugs: ['regex-tester', 'http-status-code-lookup'] },
  { id: 'developer-security', name: 'Security, Tokens, and IDs', description: 'Generate identifiers, inspect tokens, use browser cryptography, and create scannable codes.', category: 'developer-tools', toolSlugs: ['uuid-generator', 'jwt-decoder', 'qr-code-generator', 'web-crypto-studio'] },
  { id: 'developer-web', name: 'Web and SEO', description: 'Build responsive CSS, metadata, campaign URLs, and crawler directives.', category: 'developer-tools', toolSlugs: ['aspect-ratio-padding-calculator', 'css-clamp-font-generator', 'css-flexbox-generator', 'css-gradient-generator', 'meta-tag-generator', 'robots-txt-generator', 'utm-builder', 'webmaster-seo-builder'] },
  { id: 'ai-cloud-costs', name: 'AI and Cloud Cost Planning', description: 'Estimate AI token demand, LLM API pricing, GPU compute, hosting, CDN, and archive-retrieval costs.', category: 'developer-tools', toolSlugs: ['ai-token-calculator', 'llm-api-cost-calculator', 'gpu-compute-cost-calculator', 'cloud-hosting-cost-calculator', 'cdn-cost-calculator', 'aws-glacier-retrieval-calculator'] },
  { id: 'developer-scientific-data', name: 'Scientific Data Utilities', description: 'Support defined scientific data schemas and validated browser-based analysis models.', category: 'developer-tools', toolSlugs: ['bioluminescent-reader'] },

  { id: 'construction-concrete', name: 'Concrete and Masonry', description: 'Estimate concrete, cement, brick, reinforcement, sand, and post-hole concrete needs.', category: 'construction-calculators', toolSlugs: ['brick-calculator', 'cement-calculator', 'concrete-calculator', 'post-hole-concrete-calculator', 'rebar-calculator', 'sand-calculator'] },
  { id: 'construction-finishes', name: 'Interior Surfaces and Finishes', description: 'Plan flooring, tile, paint, drywall, and wallpaper quantities for interior work.', category: 'construction-calculators', toolSlugs: ['drywall-calculator', 'flooring-calculator', 'paint-calculator', 'tile-calculator', 'wallpaper-calculator'] },
  { id: 'construction-roofing', name: 'Roofing Geometry and Materials', description: 'Calculate roof area, pitch, angles, gambrel geometry, truss quantity, and rafter planning values.', category: 'construction-calculators', toolSlugs: ['12-foot-gambrel-roof-truss-calculator', 'roof-area-calculator', 'roof-pitch-calculator'] },
  { id: 'construction-site', name: 'Site and Earthworks', description: 'Estimate site area, excavation, asphalt, aggregate, and storage quantities.', category: 'construction-calculators', toolSlugs: ['asphalt-calculator', 'excavation-calculator', 'gravel-calculator', 'land-area-converter', 'water-tank-calculator'] },
  { id: 'construction-outdoor-projects', name: 'Decks, Fences, and Hardscaping', description: 'Estimate boards, fencing, pavers, joint sand, and related outdoor-project materials.', category: 'construction-calculators', toolSlugs: ['deck-board-calculator', 'fence-calculator', 'paver-calculator', 'polymeric-sand-calculator'] },
  { id: 'construction-landscaping', name: 'Landscaping Materials', description: 'Estimate mulch and topsoil volume, bags, and optional material weight.', category: 'construction-calculators', toolSlugs: ['mulch-calculator', 'topsoil-calculator'] },
  { id: 'construction-carpentry', name: 'Carpentry and Cutting', description: 'Plan stairs, lumber volume, equal-width cuts, kerf loss, and offcuts.', category: 'construction-calculators', toolSlugs: ['stair-stringer-calculator', 'board-foot-calculator', 'saw-kerf-calculator'] },
  { id: 'construction-jobsite', name: 'Jobsite Planning and Safety', description: 'Plan safe ladder reach, sanitation minimums, egress openings, and debris weight.', category: 'construction-calculators', toolSlugs: ['ladder-safe-reach-calculator', 'osha-portable-toilet-calculator', 'egress-window-code-checker', 'dumpster-weight-calculator'] },
  { id: 'construction-equipment', name: 'Construction Equipment Capacity', description: 'Match compressor output, air-tool demand, duty cycle, and tank runtime.', category: 'construction-calculators', toolSlugs: ['air-compressor-cfm-calculator'] },
  { id: 'construction-structural', name: 'Structural and Electrical', description: 'Plan steel, wire, voltage-drop, and solar requirements before detailed design.', category: 'construction-calculators', toolSlugs: ['solar-panel-calculator', 'steel-weight-calculator', 'voltage-drop-calculator', 'wire-size-calculator'] },
  { id: 'construction-estimating', name: 'Project and Contractor Estimating', description: 'Create early building-cost estimates and detailed contractor documents with itemized project costs.', category: 'construction-calculators', toolSlugs: ['construction-cost-calculator', 'house-construction-cost-calculator', 'construction-estimate-builder', 'contractor-estimate-generator'] },

  { id: 'everyday-travel-automotive', name: 'Travel and Automotive', description: 'Estimate trip fuel sharing and compare tire dimensions, clearance, and speedometer effects.', category: 'everyday-calculators', toolSlugs: ['fuel-cost-split-calculator', 'tire-size-calculator', 'schengen-90-180-day-calculator'] },
  { id: 'everyday-home-utilities', name: 'Home and Utility Planning', description: 'Estimate aquarium capacity and appliance electricity consumption and cost.', category: 'everyday-calculators', toolSlugs: ['aquarium-volume-calculator', 'electricity-cost-calculator', 'heat-pump-vs-furnace-cost-calculator'] },
  { id: 'everyday-shopping-shipping', name: 'Shopping and Shipping', description: 'Compare package value and calculate dimensional shipping weight.', category: 'everyday-calculators', toolSlugs: ['unit-price-calculator', 'dimensional-weight-calculator'] },
  { id: 'everyday-strength-training', name: 'Strength Training', description: 'Plan balanced barbell plate loading for a target total weight.', category: 'everyday-calculators', toolSlugs: ['barbell-plate-calculator'] },
];

export const toolkits: Toolkit[] = [
  {
    slug: 'contractor-estimating-calculators', name: 'Contractor Estimating Calculators', seoTitle: 'Free Contractor Estimating Calculators',
    description: 'Estimate materials, site quantities, and early project costs with connected construction calculators.',
    intro: 'Move from site measurements to practical material and cost estimates. These calculators support early planning and quoting; final quantities should still be checked against drawings, specifications, local conditions, and supplier guidance.',
    categorySlugs: ['construction-calculators'],
    groups: [
      { name: 'Concrete and masonry', description: 'Estimate core mix, reinforcement, masonry, and post-hole quantities before ordering.', toolSlugs: ['concrete-calculator', 'cement-calculator', 'rebar-calculator', 'brick-calculator', 'sand-calculator', 'gravel-calculator', 'post-hole-concrete-calculator'] },
      { name: 'Site and project costs', description: 'Translate site dimensions into earthwork, paving, debris, and early building-cost estimates.', toolSlugs: ['excavation-calculator', 'asphalt-calculator', 'paver-calculator', 'dumpster-weight-calculator', 'construction-cost-calculator', 'house-construction-cost-calculator'] },
      { name: 'Professional estimates', description: 'Turn itemized material, labor, equipment, markup, and tax inputs into contractor-ready estimates.', toolSlugs: ['construction-estimate-builder', 'contractor-estimate-generator'] },
    ], guideSlugs: [],
  },
  {
    slug: 'home-improvement-calculators', name: 'Home Improvement Calculators', seoTitle: 'Free Home Improvement Calculators',
    description: 'Plan flooring, tile, paint, roofing, electrical, solar, and water-storage projects.',
    intro: 'Use these calculators to turn room, roof, and household requirements into planning quantities. The grouped workflow makes it easier to compare surface finishes, utility needs, and allowance for waste.',
    categorySlugs: ['construction-calculators'],
    groups: [
      { name: 'Rooms and surfaces', description: 'Plan coverage and material allowances for floors, walls, drywall, and wallpaper.', toolSlugs: ['flooring-calculator', 'tile-calculator', 'paint-calculator', 'drywall-calculator', 'wallpaper-calculator'] },
      { name: 'Roofing and outdoor projects', description: 'Estimate roof geometry and materials for decks, fences, pavers, and landscaping.', toolSlugs: ['12-foot-gambrel-roof-truss-calculator', 'roof-area-calculator', 'roof-pitch-calculator', 'deck-board-calculator', 'fence-calculator', 'paver-calculator', 'polymeric-sand-calculator', 'mulch-calculator', 'topsoil-calculator'] },
      { name: 'Home utilities', description: 'Estimate practical electrical, solar, and water-storage requirements.', toolSlugs: ['wire-size-calculator', 'voltage-drop-calculator', 'solar-panel-calculator', 'water-tank-calculator', 'heat-pump-vs-furnace-cost-calculator'] },
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
      { name: 'SaaS business metrics', description: 'Connect runway, burn, acquisition efficiency, churn, growth, and revenue retention.', toolSlugs: ['startup-runway-calculator', 'saas-burn-rate-calculator', 'ltv-cac-ratio-calculator', 'cac-payback-calculator', 'churn-impact-calculator', 'rule-of-40-calculator', 'net-revenue-retention-calculator', 'meeting-roi-calculator'] },
      { name: 'Real estate investing', description: 'Compare rental income, property yields, cash invested, refinance, and flip scenarios.', toolSlugs: ['rental-property-cash-flow-calculator', 'rental-yield-calculator', 'cap-rate-calculator', 'cash-on-cash-return-calculator', 'brrrr-calculator', 'fix-and-flip-profit-calculator', 'short-term-rental-break-even-calculator', 'house-hacking-effective-rent-calculator'] },
      { name: 'Investment risk', description: 'Understand the asymmetric gain required to recover from a portfolio drawdown.', toolSlugs: ['drawdown-recovery-calculator'] },
    ], guideSlugs: ['how-to-calculate-sip-returns', 'ppf-vs-fd-comparison'],
    faqs: [{ question: 'Are the projected returns guaranteed?', answer: 'No. The calculators show scenarios from the inputs and assumptions you provide. Actual rates, returns, taxes, fees, and inflation can differ.' }],
  },
  {
    slug: 'loan-and-budget-calculators', name: 'Loan and Budget Calculators', seoTitle: 'Free Loan and Budget Calculators',
    description: 'Connect borrowing costs, repayment schedules, household cash flow, and tax planning.',
    intro: 'Evaluate whether a payment fits the wider budget, not just whether a lender offers it. These tools bring loan repayment, cash-flow, currency, and tax estimates into one planning path.',
    categorySlugs: ['finance-calculators'],
    groups: [
      { name: 'Borrowing', description: 'Estimate monthly payments, total interest, repayment schedules, and payoff-strategy tradeoffs.', toolSlugs: ['loan-emi-calculator', 'loan-amortization-suite', 'debt-snowball-vs-avalanche-calculator'] },
      { name: 'Cash flow and tax', description: 'Review affordability alongside cash flow, currency, GST, and tax estimates.', toolSlugs: ['cashflow-budget-architect', 'currency-converter', 'gst-calculator', 'tax-calculator', 'ev-vs-gas-break-even-calculator', 'job-offer-total-comp-calculator'] },
    ], guideSlugs: ['how-to-calculate-emi', 'gst-calculation-guide', 'tax-planning-guide-2026'],
  },
  {
    slug: 'web-developer-tools', name: 'Web Developer Tools', seoTitle: 'Free Web Developer Tools',
    description: 'Format data, inspect tokens, test patterns, and prepare metadata and crawl directives.',
    intro: 'Handle common web-development checks without sending working data to an unnecessary server. Use the groups below to move from data inspection to testing and publishing tasks.',
    categorySlugs: ['developer-tools'],
    groups: [
      { name: 'JSON and data conversion', description: 'Format, validate, compare, flatten, and convert JSON, CSV, and encoded text.', toolSlugs: ['json-formatter', 'json-schema-validator', 'json-diff-compare', 'json-to-csv-flattener', 'csv-to-json-converter', 'base64-encoder', 'url-encoder-decoder', 'html-entity-encoder-decoder', 'utf8-vs-utf16-byte-calculator', 'typescript-to-zod-schema-converter'] },
      { name: 'XML and document conversion', description: 'Merge and format XML, turn XML data into DOCX, and extract structured or raw XML from DOCX packages.', toolSlugs: ['merge-xml-files', 'xml-to-word-converter', 'word-to-xml-converter', 'markup-formatter'] },
      { name: 'CorelDRAW and CDR workflows', description: 'Prepare import-ready artwork, inspect supported CDR files, and export genuine open document or image formats.', toolSlugs: ['coreldraw-tools', 'pdf-to-cdr-converter', 'word-to-cdr-converter', 'png-to-cdr-converter', 'jpg-to-cdr-converter', 'svg-to-cdr-converter', 'ai-to-cdr-converter', 'eps-to-cdr-converter', 'cdr-viewer', 'cdr-version-converter', 'cdr-to-pdf-converter', 'cdr-to-svg-converter', 'cdr-to-png-converter', 'cdr-to-jpg-converter', 'cdr-to-eps-converter'] },
      { name: 'Networking and schedules', description: 'Plan IPv4 ranges and subnets, generate MAC addresses, and understand cron schedules.', toolSlugs: ['cidr-subnet-wildcard-calculator', 'ip-range-calculator', 'vlsm-subnet-calculator', 'mac-address-generator', 'cron-next-run-calculator', 'cron-expression-humanizer', 'unix-timestamp-converter', 'http-status-code-lookup'] },
      { name: 'Tokens and identifiers', description: 'Generate identifiers and QR codes, inspect JWT payloads, and use browser cryptography.', toolSlugs: ['uuid-generator', 'jwt-decoder', 'qr-code-generator', 'web-crypto-studio'] },
      { name: 'Publishing and SEO', description: 'Prepare responsive CSS, metadata, campaign links, crawler rules, and reusable web assets.', toolSlugs: ['aspect-ratio-padding-calculator', 'css-clamp-font-generator', 'css-flexbox-generator', 'meta-tag-generator', 'robots-txt-generator', 'utm-builder', 'webmaster-seo-builder', 'css-gradient-generator'] },
      { name: 'Repository and container workflows', description: 'Configure project ignore rules, format conventional commits, and generate safe Docker execution commands.', toolSlugs: ['gitignore-generator', 'git-commit-message-formatter', 'docker-run-command-generator'] },
      { name: 'AI and cloud costs', description: 'Estimate token volume, model API rates, GPU workloads, hosting, delivery, and archive retrieval.', toolSlugs: ['ai-token-calculator', 'llm-api-cost-calculator', 'gpu-compute-cost-calculator', 'cloud-hosting-cost-calculator', 'cdn-cost-calculator', 'aws-glacier-retrieval-calculator'] },
    ], guideSlugs: ['json-formatting-guide', 'base64-encoding-guide', 'jwt-decoding-guide', 'seo-tools-guide', 'word-to-cdr-formatting-guide', 'pdf-to-cdr-editing-guide', 'raster-image-to-cdr-guide', 'svg-vs-cdr-guide', 'open-cdr-without-coreldraw', 'newer-cdr-older-coreldraw', 'best-coreldraw-print-format', 'preserve-fonts-coreldraw-conversion'],
  },
  {
    slug: 'image-optimization-tools', name: 'Image Optimization Tools', seoTitle: 'Free Image Optimization Tools',
    description: 'Resize, compress, convert, crop, and prepare images for web and social publishing.',
    intro: 'Choose the right dimensions, format, and compression level for the destination. This collection connects the practical steps that usually happen together before an image is published.',
    categorySlugs: ['image-tools'],
    groups: [
      { name: 'Size and quality', description: 'Control pixel dimensions and file size while reviewing output quality.', toolSlugs: ['resize-image', 'change-image-resolution', 'compress-image', 'compress-jpg', 'compress-webp', 'upscale-image'] },
      { name: 'Prepare and publish', description: 'Sample colors, convert, crop, rotate, watermark, and resize images for common channels.', toolSlugs: ['image-color-picker', 'convert-png-to-webp', 'convert-webp-to-jpg', 'crop-image', 'rotate-image', 'watermark-image', 'social-media-resizer'] },
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
      { name: 'Activity and heart rate', description: 'Connect activity energy estimates with pulse conversion, heart-rate training ranges, and strength performance.', toolSlugs: ['walking-calories-calculator', 'running-calories-calculator', 'calories-burned-calculator', 'heart-rate-calculator', 'hrv-baseline-deviation-calculator', 'wilks-dots-powerlifting-calculator'] },
    ], guideSlugs: ['bmi-calculator-guide', 'bmr-tdee-guide', 'heart-rate-zones-guide', 'calorie-deficit-guide'],
    faqs: [{ question: 'Do these calculators provide medical advice?', answer: 'No. They provide educational estimates from standard inputs and formulas. A qualified clinician should interpret results for personal medical decisions.' }],
  },
];

export const complementaryTools: Record<string, string[]> = {
  'coreldraw-tools': ['pdf-to-cdr-converter', 'word-to-cdr-converter', 'cdr-viewer', 'cdr-version-converter'],
  'pdf-to-cdr-converter': ['word-to-cdr-converter', 'svg-to-cdr-converter', 'cdr-to-pdf-converter'],
  'word-to-cdr-converter': ['pdf-to-cdr-converter', 'svg-to-cdr-converter', 'cdr-viewer'],
  'png-to-cdr-converter': ['jpg-to-cdr-converter', 'svg-to-cdr-converter', 'image-color-picker'],
  'jpg-to-cdr-converter': ['png-to-cdr-converter', 'svg-to-cdr-converter', 'image-converter'],
  'svg-to-cdr-converter': ['png-to-cdr-converter', 'pdf-to-cdr-converter', 'cdr-to-svg-converter'],
  'ai-to-cdr-converter': ['eps-to-cdr-converter', 'svg-to-cdr-converter', 'pdf-to-cdr-converter'],
  'eps-to-cdr-converter': ['ai-to-cdr-converter', 'pdf-to-cdr-converter', 'svg-to-cdr-converter'],
  'cdr-viewer': ['cdr-to-pdf-converter', 'cdr-to-svg-converter', 'cdr-version-converter'],
  'cdr-version-converter': ['cdr-viewer', 'cdr-to-pdf-converter', 'coreldraw-tools'],
  'cdr-to-pdf-converter': ['cdr-viewer', 'cdr-to-svg-converter', 'pdf-to-cdr-converter'],
  'cdr-to-svg-converter': ['cdr-viewer', 'cdr-to-pdf-converter', 'svg-to-cdr-converter'],
  'cdr-to-png-converter': ['cdr-viewer', 'cdr-to-jpg-converter', 'cdr-to-pdf-converter'],
  'cdr-to-jpg-converter': ['cdr-viewer', 'cdr-to-png-converter', 'cdr-to-pdf-converter'],
  'cdr-to-eps-converter': ['cdr-viewer', 'cdr-to-pdf-converter', 'eps-to-cdr-converter'],
  'xml-to-word-converter': ['word-to-xml-converter', 'markup-formatter', 'json-formatter'],
  'word-to-xml-converter': ['xml-to-word-converter', 'markup-formatter', 'extract-pdf-text'],
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
  'heart-rate-calculator': ['calories-burned-calculator', 'running-calories-calculator', 'walking-calories-calculator'],
  'merge-pdf': ['reorder-pdf', 'rotate-pdf', 'split-pdf'],
  'split-pdf': ['extract-pdf-pages', 'merge-pdf', 'reorder-pdf'],
  'resize-image': ['compress-image', 'crop-image', 'social-media-resizer'],
  'compress-image': ['resize-image', 'image-metadata-viewer'],
  'image-color-picker': ['watermark-image', 'css-gradient-generator'],
  'json-formatter': ['json-schema-validator', 'json-diff-compare', 'json-to-csv-flattener', 'csv-to-json-converter'],
  'json-schema-validator': ['json-formatter', 'json-diff-compare'],
  'csv-to-json-converter': ['json-formatter', 'json-to-csv-flattener'],
  'json-to-csv-flattener': ['csv-to-json-converter', 'json-formatter'],
  'jwt-decoder': ['base64-encoder', 'web-crypto-studio', 'uuid-generator'],
  'qr-code-generator': ['utm-builder', 'url-encoder-decoder'],
  'cidr-subnet-wildcard-calculator': ['ip-range-calculator', 'vlsm-subnet-calculator'],
  'ip-range-calculator': ['cidr-subnet-wildcard-calculator', 'vlsm-subnet-calculator'],
  'vlsm-subnet-calculator': ['cidr-subnet-wildcard-calculator', 'ip-range-calculator'],
  'cron-next-run-calculator': ['cron-expression-humanizer', 'unix-timestamp-converter'],
  '12-foot-gambrel-roof-truss-calculator': ['roof-area-calculator', 'roof-pitch-calculator', 'board-foot-calculator', 'construction-cost-calculator'],
  'roof-pitch-calculator': ['12-foot-gambrel-roof-truss-calculator', 'roof-area-calculator'],
  'roof-area-calculator': ['12-foot-gambrel-roof-truss-calculator', 'roof-pitch-calculator'],
  'post-hole-concrete-calculator': ['fence-calculator', 'concrete-calculator'],
  'paver-calculator': ['polymeric-sand-calculator', 'asphalt-calculator'],
  'deck-board-calculator': ['board-foot-calculator', 'saw-kerf-calculator'],
  'construction-estimate-builder': ['contractor-estimate-generator', 'construction-cost-calculator', 'dumpster-weight-calculator'],
  'contractor-estimate-generator': ['construction-estimate-builder', 'house-construction-cost-calculator'],
  'house-construction-cost-calculator': ['construction-estimate-builder', 'concrete-calculator', 'brick-calculator', 'flooring-calculator'],
  'meta-tag-generator': ['robots-txt-generator', 'utm-builder', 'webmaster-seo-builder'],
  'ai-token-calculator': ['llm-api-cost-calculator', 'gpu-compute-cost-calculator'],
  'llm-api-cost-calculator': ['ai-token-calculator', 'gpu-compute-cost-calculator', 'cloud-hosting-cost-calculator'],
  'gpu-compute-cost-calculator': ['llm-api-cost-calculator', 'cloud-hosting-cost-calculator'],
  'cloud-hosting-cost-calculator': ['cdn-cost-calculator', 'aws-glacier-retrieval-calculator'],
  'cdn-cost-calculator': ['cloud-hosting-cost-calculator', 'aws-glacier-retrieval-calculator'],
  'startup-runway-calculator': ['saas-burn-rate-calculator', 'rule-of-40-calculator'],
  'saas-burn-rate-calculator': ['startup-runway-calculator', 'rule-of-40-calculator'],
  'ltv-cac-ratio-calculator': ['cac-payback-calculator', 'churn-impact-calculator'],
  'cac-payback-calculator': ['ltv-cac-ratio-calculator', 'net-revenue-retention-calculator'],
  'churn-impact-calculator': ['net-revenue-retention-calculator', 'ltv-cac-ratio-calculator'],
  'rule-of-40-calculator': ['saas-burn-rate-calculator', 'startup-runway-calculator'],
  'net-revenue-retention-calculator': ['churn-impact-calculator', 'ltv-cac-ratio-calculator'],
  'rental-property-cash-flow-calculator': ['cap-rate-calculator', 'cash-on-cash-return-calculator'],
  'rental-yield-calculator': ['cap-rate-calculator', 'rental-property-cash-flow-calculator'],
  'cap-rate-calculator': ['rental-yield-calculator', 'rental-property-cash-flow-calculator'],
  'cash-on-cash-return-calculator': ['rental-property-cash-flow-calculator', 'brrrr-calculator'],
  'brrrr-calculator': ['cash-on-cash-return-calculator', 'fix-and-flip-profit-calculator'],
  'fix-and-flip-profit-calculator': ['brrrr-calculator', 'rental-property-cash-flow-calculator'],
  'drawdown-recovery-calculator': ['investment-return-profiler', 'wealth-inflation-matrix'],
  'debt-snowball-vs-avalanche-calculator': ['loan-emi-calculator', 'loan-amortization-suite'],
  'meeting-roi-calculator': ['startup-runway-calculator', 'saas-burn-rate-calculator', 'cac-payback-calculator'],
  'ev-vs-gas-break-even-calculator': ['electricity-cost-calculator', 'fuel-cost-split-calculator', 'solar-panel-calculator'],
  'heat-pump-vs-furnace-cost-calculator': ['electricity-cost-calculator', 'solar-panel-calculator', 'construction-cost-calculator'],
  'short-term-rental-break-even-calculator': ['rental-property-cash-flow-calculator', 'rental-yield-calculator', 'cap-rate-calculator'],
  'house-hacking-effective-rent-calculator': ['rental-property-cash-flow-calculator', 'cash-on-cash-return-calculator', 'brrrr-calculator'],
  'job-offer-total-comp-calculator': ['tax-calculator', 'investment-return-profiler', 'retirement-calculator'],
  'schengen-90-180-day-calculator': ['currency-converter'],
  'dog-age-breed-specific-calculator': ['puppy-growth-predictor', 'cat-calorie-calculator'],
  'puppy-growth-predictor': ['dog-age-breed-specific-calculator', 'cat-calorie-calculator'],
  'cat-calorie-calculator': ['calorie-calculator', 'dog-age-breed-specific-calculator'],
  'caffeine-half-life-calculator': ['heart-rate-calculator', 'hrv-baseline-deviation-calculator'],
  'hrv-baseline-deviation-calculator': ['heart-rate-calculator', 'caffeine-half-life-calculator'],
  'wilks-dots-powerlifting-calculator': ['barbell-plate-calculator', 'calories-burned-calculator'],
  'gitignore-generator': ['git-commit-message-formatter', 'docker-run-command-generator'],
  'css-flexbox-generator': ['aspect-ratio-padding-calculator', 'css-clamp-font-generator'],
  'docker-run-command-generator': ['gitignore-generator', 'cloud-hosting-cost-calculator'],
  'typescript-to-zod-schema-converter': ['json-schema-validator', 'json-to-csv-flattener'],
  'git-commit-message-formatter': ['gitignore-generator', 'developer-utils'],
  'utf8-vs-utf16-byte-calculator': ['base64-encoder', 'url-encoder-decoder'],
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
