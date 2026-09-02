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
