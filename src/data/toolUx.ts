export type ProcessingMode = 'local' | 'server' | 'external-data' | 'mixed';
export type ResultActionKind = 'copy-result' | 'copy-summary' | 'download-csv' | 'download-txt' | 'download-json' | 'print';

export interface ToolUxConfig {
  processingMode?: ProcessingMode;
  noUpload?: boolean;
  noAccount?: boolean;
  offlineVerified?: boolean;
  resultActions?: ResultActionKind[];
  workflowLabels?: Record<string, string>;
  longForm?: boolean;
}

export interface ToolCapabilitySnapshot {
  processedLocally: boolean;
  noUpload: boolean;
  noAccount: boolean;
  worksOffline: boolean;
}

export const toolUx: Record<string, ToolUxConfig> = {
  'house-construction-cost-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'], longForm: true,
    workflowLabels: {
      'construction-estimate-builder': 'Build a detailed construction estimate',
      'concrete-calculator': 'Estimate concrete quantities',
      'brick-calculator': 'Estimate bricks and masonry',
      'flooring-calculator': 'Calculate flooring materials',
    },
  },
  'json-formatter': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-result', 'download-json'],
    workflowLabels: { 'jwt-decoder': 'Decode a JWT', 'json-schema-validator': 'Validate against a JSON schema', 'json-to-csv-flattener': 'Convert JSON to CSV' },
  },
  'roof-area-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary'],
    workflowLabels: { 'roof-pitch-calculator': 'Check roof pitch', '12-foot-gambrel-roof-truss-calculator': 'Plan gambrel roof geometry' },
  },
  'brrrr-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'], longForm: true,
    workflowLabels: { 'cash-on-cash-return-calculator': 'Compare cash-on-cash return', 'fix-and-flip-profit-calculator': 'Model a sale instead of a refinance' },
  },
  'llm-api-cost-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv'],
    workflowLabels: { 'ai-token-calculator': 'Estimate token volume', 'gpu-compute-cost-calculator': 'Compare GPU compute cost', 'cloud-hosting-cost-calculator': 'Add hosting costs' },
  },
  'startup-runway-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'],
    workflowLabels: { 'saas-burn-rate-calculator': 'Review detailed burn rate', 'rule-of-40-calculator': 'Check growth and profitability' },
  },
  'saas-burn-rate-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'],
    workflowLabels: { 'startup-runway-calculator': 'Project cash runway', 'rule-of-40-calculator': 'Check the Rule of 40' },
  },
  'meeting-roi-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'],
    workflowLabels: { 'startup-runway-calculator': 'Project startup runway', 'saas-burn-rate-calculator': 'Review detailed burn rate', 'cac-payback-calculator': 'Calculate CAC payback' },
  },
  'ltv-cac-ratio-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv'],
    workflowLabels: { 'cac-payback-calculator': 'Calculate CAC payback', 'churn-impact-calculator': 'Model churn impact' },
  },
  'rental-property-cash-flow-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'],
    workflowLabels: { 'rental-yield-calculator': 'Compare rental yield', 'cap-rate-calculator': 'Calculate capitalization rate', 'cash-on-cash-return-calculator': 'Measure cash-on-cash return' },
  },
  'cap-rate-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary'],
    workflowLabels: { 'rental-property-cash-flow-calculator': 'Estimate property cash flow', 'rental-yield-calculator': 'Compare rental yield' },
  },
  'cash-on-cash-return-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary'],
    workflowLabels: { 'brrrr-calculator': 'Model a BRRRR refinance', 'rental-property-cash-flow-calculator': 'Estimate monthly cash flow' },
  },
  'fix-and-flip-profit-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'],
    workflowLabels: { 'brrrr-calculator': 'Compare a refinance strategy', 'cash-on-cash-return-calculator': 'Compare a hold strategy' },
  },
  'ai-token-calculator': { processingMode: 'local', noUpload: true, noAccount: true },
  'gpu-compute-cost-calculator': { processingMode: 'local', noUpload: true, noAccount: true },
  'cloud-hosting-cost-calculator': { processingMode: 'local', noUpload: true, noAccount: true },
  'cdn-cost-calculator': { processingMode: 'local', noUpload: true, noAccount: true },
  'cac-payback-calculator': { processingMode: 'local', noUpload: true, noAccount: true },
  'churn-impact-calculator': { processingMode: 'local', noUpload: true, noAccount: true },
  'rule-of-40-calculator': { processingMode: 'local', noUpload: true, noAccount: true },
  'net-revenue-retention-calculator': { processingMode: 'local', noUpload: true, noAccount: true },
  'rental-yield-calculator': { processingMode: 'local', noUpload: true, noAccount: true },
  'drawdown-recovery-calculator': { processingMode: 'local', noUpload: true, noAccount: true },
  'concrete-calculator': { processingMode: 'local', noUpload: true, noAccount: true },
  'brick-calculator': { processingMode: 'local', noUpload: true, noAccount: true },
  'bmi-calculator': { processingMode: 'local', noUpload: true, noAccount: true },
  'base64-encoder': { processingMode: 'local', noUpload: true, noAccount: true },
  'jwt-decoder': { processingMode: 'local', noUpload: true, noAccount: true },
  'uuid-generator': { processingMode: 'local', noUpload: true, noAccount: true },
  'ev-vs-gas-break-even-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'],
    workflowLabels: { 'electricity-cost-calculator': 'Estimate electricity cost', 'fuel-cost-split-calculator': 'Calculate fuel split', 'solar-panel-calculator': 'Model solar charging' },
  },
  'heat-pump-vs-furnace-cost-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'],
    workflowLabels: { 'electricity-cost-calculator': 'Estimate electricity cost', 'solar-panel-calculator': 'Plan solar power', 'construction-cost-calculator': 'Estimate overall construction' },
  },
  'short-term-rental-break-even-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'],
    workflowLabels: { 'rental-property-cash-flow-calculator': 'Estimate long-term cash flow', 'rental-yield-calculator': 'Compare rental yield', 'cap-rate-calculator': 'Calculate capitalization rate' },
  },
  'house-hacking-effective-rent-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'],
    workflowLabels: { 'rental-property-cash-flow-calculator': 'Estimate rental cash flow', 'cash-on-cash-return-calculator': 'Measure cash-on-cash return', 'brrrr-calculator': 'Model a BRRRR project' },
  },
  'job-offer-total-comp-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'],
    workflowLabels: { 'tax-calculator': 'Estimate tax impact', 'investment-return-profiler': 'Project investment growth', 'retirement-calculator': 'Plan retirement savings' },
  },
  'schengen-90-180-day-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'],
    workflowLabels: { 'currency-converter': 'Convert travel currencies' },
  },
  'dog-age-breed-specific-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'],
    workflowLabels: { 'puppy-growth-predictor': 'Predict adult weight', 'cat-calorie-calculator': 'Estimate feline calorie requirements' },
  },
  'puppy-growth-predictor': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'],
    workflowLabels: { 'dog-age-breed-specific-calculator': 'Calculate canine age progression', 'cat-calorie-calculator': 'Estimate feline calorie requirements' },
  },
  'cat-calorie-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'],
    workflowLabels: { 'calorie-calculator': 'Calculate human calorie requirements', 'dog-age-breed-specific-calculator': 'Calculate canine age progression' },
  },
  'caffeine-half-life-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'],
    workflowLabels: { 'heart-rate-calculator': 'Calculate exercise heart rate zones', 'hrv-baseline-deviation-calculator': 'Compare HRV to baseline' },
  },
  'hrv-baseline-deviation-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'],
    workflowLabels: { 'heart-rate-calculator': 'Calculate exercise heart rate zones', 'caffeine-half-life-calculator': 'Model caffeine clearance' },
  },
  'wilks-dots-powerlifting-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'],
    workflowLabels: { 'barbell-plate-calculator': 'Plan barbell plate loading', 'calories-burned-calculator': 'Calculate exercise calorie burn' },
  },
  'gitignore-generator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-result', 'download-txt'],
    workflowLabels: { 'git-commit-message-formatter': 'Format conventional commit', 'docker-run-command-generator': 'Generate Docker run command' },
  },
  'css-flexbox-generator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-result'],
    workflowLabels: { 'aspect-ratio-padding-calculator': 'Calculate aspect ratio padding', 'css-clamp-font-generator': 'Generate fluid clamp typography' },
  },
  'docker-run-command-generator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-result'],
    workflowLabels: { 'gitignore-generator': 'Generate .gitignore', 'cloud-hosting-cost-calculator': 'Estimate hosting costs' },
  },
  'typescript-to-zod-schema-converter': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-result', 'download-txt'],
    workflowLabels: { 'json-schema-validator': 'Validate JSON schema', 'json-to-csv-flattener': 'Flatten JSON to CSV' },
  },
  'git-commit-message-formatter': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-result'],
    workflowLabels: { 'gitignore-generator': 'Generate .gitignore', 'developer-utils': 'Developer utility hub' },
  },
  'utf8-vs-utf16-byte-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'],
    workflowLabels: { 'base64-encoder': 'Encode text to Base64', 'url-encoder-decoder': 'URL encode and decode' },
  },
  'soffit-fascia-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'],
    workflowLabels: { 'roof-area-calculator': 'Calculate roof surface area', 'roof-pitch-calculator': 'Convert roof rise and run slope' },
  },
  'attic-insulation-payback-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'],
    workflowLabels: { 'heat-pump-vs-furnace-cost-calculator': 'Compare heating system costs', 'electricity-cost-calculator': 'Calculate appliance electricity cost' },
  },
  'joist-deflection-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'],
    workflowLabels: { 'stair-stringer-calculator': 'Calculate stair stringer geometry', 'steel-weight-calculator': 'Calculate structural steel weight' },
  },
  'hvac-duct-cfm-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'],
    workflowLabels: { 'air-compressor-cfm-calculator': 'Match compressor CFM output', 'voltage-drop-calculator': 'Calculate electrical voltage drop' },
  },
  'shed-ramp-angle-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'],
    workflowLabels: { 'stair-stringer-calculator': 'Calculate stair stringer geometry', 'roof-pitch-calculator': 'Calculate roof slope and pitch' },
  },
  'construction-material-waste-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'],
    workflowLabels: { 'construction-cost-calculator': 'Estimate early project costs', 'drywall-calculator': 'Estimate drywall sheets and materials' },
  },
  'image-megapixel-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'],
    workflowLabels: { 'image-print-size-calculator': 'Calculate physical print dimensions', 'image-file-size-estimator': 'Estimate uncompressed memory size' },
  },
  'image-print-size-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'],
    workflowLabels: { 'image-megapixel-calculator': 'Calculate megapixels and aspect ratio', 'change-image-resolution': 'Change image resolution presets' },
  },
  'image-file-size-estimator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'],
    workflowLabels: { 'image-bandwidth-calculator': 'Estimate image transfer volume', 'photo-storage-calculator': 'Calculate photo storage capacity' },
  },
  'image-scaling-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'],
    workflowLabels: { 'resize-image': 'Resize image dimensions', 'social-media-resizer': 'Resize for social media' },
  },
  'photo-storage-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'],
    workflowLabels: { 'image-file-size-estimator': 'Estimate uncompressed memory size', 'image-bandwidth-calculator': 'Estimate image transfer volume' },
  },
  'image-bandwidth-calculator': {
    processingMode: 'local', noUpload: true, noAccount: true,
    resultActions: ['copy-summary', 'download-csv', 'print'],
    workflowLabels: { 'image-file-size-estimator': 'Estimate uncompressed memory size', 'photo-storage-calculator': 'Calculate photo storage capacity' },
  },
};

export function getToolCapabilities(slug: string): ToolCapabilitySnapshot {
  const config = toolUx[slug];
  return {
    processedLocally: config?.processingMode === 'local',
    noUpload: config?.noUpload === true,
    noAccount: config?.noAccount === true,
    worksOffline: config?.offlineVerified === true,
  };
}

export function getPrivacyBadgeLabels(slug: string): string[] {
  const capabilities = getToolCapabilities(slug);
  return [
    capabilities.processedLocally && 'Processed locally',
    capabilities.noUpload && 'No upload required',
    capabilities.noAccount && 'No account required',
    capabilities.worksOffline && 'Works offline',
  ].filter((label): label is string => Boolean(label));
}
