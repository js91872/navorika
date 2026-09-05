'use client';

import { Calculator, Info } from 'lucide-react';
import { useMemo, useState } from 'react';
import { calculateAiTokens, calculateCdnCost, calculateCloudHostingCost, calculateGpuCost, calculateLlmCost } from '@/lib/calculations/cloudCosts';
import { calculateBrrrr, calculateCapRate, calculateCashOnCash, calculateFlip, calculateRentalCashFlow, calculateRentalYield } from '@/lib/calculations/realEstate';
import { calculateBurnRate, calculateCacPayback, calculateChurnImpact, calculateLtvCac, calculateNrr, calculateRuleOf40, calculateStartupRunway } from '@/lib/calculations/saasMetrics';
import { calculateDrawdown } from '@/lib/calculations/financialDecisions';
import { calculateMeetingRoi } from '@/lib/calculations/meetingRoi';
import { calculateEvVsGas, calculateHeatPumpVsFurnace } from '@/lib/calculations/consumerEnergy';
import { calculateShortTermRental, calculateHouseHacking } from '@/lib/calculations/personalRealEstate';
import { calculateTotalCompensation } from '@/lib/calculations/compensation';
import { calculateDogAge, calculatePuppyGrowth, calculateCatCalories } from '@/lib/calculations/petHealth';
import { calculateCaffeineHalfLife, calculateHrvDeviation } from '@/lib/calculations/healthBiometrics';
import { calculateWilksDots } from '@/lib/calculations/powerlifting';
import { calculateSoffitFascia } from '@/lib/calculations/soffitFascia';
import { calculateAtticInsulation } from '@/lib/calculations/atticInsulation';
import { calculateJoistDeflection } from '@/lib/calculations/joistDeflection';
import { calculateHvacDuctCfm } from '@/lib/calculations/hvacDuctCfm';
import { calculateShedRamp } from '@/lib/calculations/shedRamp';
import { calculateMaterialWaste } from '@/lib/calculations/materialWaste';
import { calculateImageMegapixel } from '@/lib/calculations/imageMegapixel';
import { calculateImagePrintSize } from '@/lib/calculations/imagePrintSize';
import { calculateImageFileSize } from '@/lib/calculations/imageFileSize';
import { calculateImageScaling } from '@/lib/calculations/imageScaling';
import { calculatePhotoStorage } from '@/lib/calculations/photoStorage';
import { calculateImageBandwidth } from '@/lib/calculations/imageBandwidth';
import { calculateIpv6Subnet } from '@/lib/calculations/ipv6Subnet';
import { calculatePortRange } from '@/lib/calculations/portRange';
import { calculateCidrSummarization } from '@/lib/calculations/cidrSummarization';
import { calculateIpClassifier } from '@/lib/calculations/ipClassifier';
import { calculatePortServiceLookup } from '@/lib/calculations/portServiceLookup';
import { calculateUrlParser } from '@/lib/calculations/urlParser';
import { calculatePrintBleed } from '@/lib/calculations/printBleed';
import { calculateCdrPrintReadiness } from '@/lib/calculations/cdrPrintReadiness';
import ResultActions, { type ResultAction } from '@/components/ui/ResultActions';
import { toolUx } from '@/data/toolUx';
import { rowsToCsv } from '@/lib/resultExport';

type ValueMap = Record<string, number | string>;
type ResultMap = Record<string, any>;
type Format = 'currency' | 'number' | 'percent' | 'months' | 'text';
interface FieldOption { value: string; label: string }
interface Field {
  key: string;
  label: string;
  defaultValue: number | string;
  type?: 'number' | 'select' | 'text' | 'textarea';
  options?: FieldOption[];
  min?: number;
  max?: number;
  step?: number;
  help?: string;
  placeholder?: string;
  rows?: number;
}
interface Result { key: string; label: string; format: Format }
interface Config { fields: Field[]; results: Result[]; calculate: (values: ValueMap) => ResultMap; note: string }

const v = (values: ValueMap, key: string) => {
  const val = values[key];
  return typeof val === 'number' ? val : Number(val) || 0;
};
const s = (values: ValueMap, key: string, fallback = '') => {
  const val = values[key];
  return typeof val === 'string' ? val : typeof val === 'number' ? String(val) : fallback;
};

const configs: Record<string, Config> = {
  'ai-token-calculator': {
    fields: [
      { key: 'input', label: 'Input tokens per request', defaultValue: 1000, min: 0, step: 1 },
      { key: 'output', label: 'Output tokens per request', defaultValue: 500, min: 0, step: 1 },
      { key: 'cached', label: 'Cached input tokens per request', defaultValue: 0, min: 0, step: 1, help: 'Must be part of the entered input-token count.' },
      { key: 'requests', label: 'Requests per day', defaultValue: 100, min: 0, step: 1 },
      { key: 'days', label: 'Days per month', defaultValue: 30, min: 1, max: 31, step: 1 },
    ],
    results: [{ key: 'tokensPerRequest', label: 'Tokens per request', format: 'number' }, { key: 'dailyTotalTokens', label: 'Daily tokens', format: 'number' }, { key: 'inputTokensMonth', label: 'Monthly input tokens', format: 'number' }, { key: 'cachedTokensMonth', label: 'Monthly cached input tokens', format: 'number' }, { key: 'outputTokensMonth', label: 'Monthly output tokens', format: 'number' }, { key: 'totalTokensMonth', label: 'Monthly total tokens', format: 'number' }, { key: 'annualTokens', label: 'Annualized tokens', format: 'number' }],
    calculate: (x) => calculateAiTokens({ inputTokensPerRequest: v(x, 'input'), outputTokensPerRequest: v(x, 'output'), cachedInputTokensPerRequest: v(x, 'cached'), requestsPerDay: v(x, 'requests'), daysPerMonth: v(x, 'days') }),
    note: 'Token counts are entered directly. Character-to-token ratios vary by tokenizer, language, and model, so this tool does not claim an exact text conversion.',
  },
  'llm-api-cost-calculator': {
    fields: [
      { key: 'input', label: 'Input tokens per request', defaultValue: 1000, min: 0, step: 1 }, { key: 'output', label: 'Output tokens per request', defaultValue: 500, min: 0, step: 1 }, { key: 'cached', label: 'Cached input tokens per request', defaultValue: 0, min: 0, step: 1 },
      { key: 'requests', label: 'Requests per day', defaultValue: 100, min: 0, step: 1 }, { key: 'days', label: 'Days per month', defaultValue: 30, min: 1, max: 31, step: 1 },
      { key: 'inputPrice', label: 'Input price per 1M tokens ($)', defaultValue: 2, min: 0, step: 0.0001 }, { key: 'outputPrice', label: 'Output price per 1M tokens ($)', defaultValue: 8, min: 0, step: 0.0001 }, { key: 'cachedPrice', label: 'Cached input price per 1M ($)', defaultValue: 0, min: 0, step: 0.0001 },
    ],
    results: [{ key: 'inputCost', label: 'Monthly input cost', format: 'currency' }, { key: 'outputCost', label: 'Monthly output cost', format: 'currency' }, { key: 'costPerRequest', label: 'Cost per request', format: 'currency' }, { key: 'monthlyCost', label: 'Monthly cost', format: 'currency' }, { key: 'annualCost', label: 'Annualized cost', format: 'currency' }],
    calculate: (x) => calculateLlmCost({ inputTokensPerRequest: v(x, 'input'), outputTokensPerRequest: v(x, 'output'), cachedInputTokensPerRequest: v(x, 'cached'), requestsPerDay: v(x, 'requests'), daysPerMonth: v(x, 'days'), inputPricePerMillion: v(x, 'inputPrice'), outputPricePerMillion: v(x, 'outputPrice'), cachedInputPricePerMillion: v(x, 'cachedPrice') }),
    note: 'All prices are editable planning inputs. Verify current provider and model rates, billing units, cache rules, batch discounts, and taxes before relying on the estimate.',
  },
  'gpu-compute-cost-calculator': {
    fields: [{ key: 'gpus', label: 'Number of GPUs', defaultValue: 2, min: 1, step: 1 }, { key: 'rate', label: 'Hourly rate per GPU ($)', defaultValue: 1.5, min: 0, step: 0.01 }, { key: 'hours', label: 'Hours per run', defaultValue: 10, min: 0, step: 0.1 }, { key: 'runs', label: 'Runs per day', defaultValue: 1, min: 0, step: 0.1 }, { key: 'utilization', label: 'Billable utilization (%)', defaultValue: 100, min: 0, max: 100, step: 1 }, { key: 'days', label: 'Days per month', defaultValue: 30, min: 1, max: 31, step: 1 }],
    results: [{ key: 'fleetHourlyCost', label: 'Fleet cost per hour', format: 'currency' }, { key: 'costPerRun', label: 'Cost per run at 100%', format: 'currency' }, { key: 'utilizedGpuHours', label: 'Daily utilized GPU-hours', format: 'number' }, { key: 'dailyCost', label: 'Daily cost', format: 'currency' }, { key: 'monthlyCost', label: 'Monthly cost', format: 'currency' }, { key: 'annualCost', label: 'Annualized cost', format: 'currency' }],
    calculate: (x) => calculateGpuCost({ gpuCount: v(x, 'gpus'), hourlyRate: v(x, 'rate'), hoursPerRun: v(x, 'hours'), runsPerDay: v(x, 'runs'), utilizationPercent: v(x, 'utilization'), daysPerMonth: v(x, 'days') }),
    note: 'This generic estimate uses the entered billable rate. Reserved capacity, startup time, storage, networking, CPU/RAM, taxes, and provider-specific rounding are not included.',
  },
  'cloud-hosting-cost-calculator': {
    fields: [{ key: 'instances', label: 'Compute instances', defaultValue: 2, min: 0, step: 1 }, { key: 'hourly', label: 'Hourly cost per instance ($)', defaultValue: 0.1, min: 0, step: 0.001 }, { key: 'hours', label: 'Runtime hours per month', defaultValue: 730, min: 0, step: 1 }, { key: 'storage', label: 'Storage (GB)', defaultValue: 100, min: 0 }, { key: 'storageRate', label: 'Storage cost per GB-month ($)', defaultValue: 0.02, min: 0, step: 0.001 }, { key: 'bandwidth', label: 'Outbound bandwidth (GB)', defaultValue: 500, min: 0 }, { key: 'bandwidthRate', label: 'Bandwidth rate per GB ($)', defaultValue: 0.08, min: 0, step: 0.001 }, { key: 'additional', label: 'Additional monthly services ($)', defaultValue: 0, min: 0 }],
    results: [{ key: 'computeCost', label: 'Compute', format: 'currency' }, { key: 'computePercent', label: 'Compute share', format: 'percent' }, { key: 'storageCost', label: 'Storage', format: 'currency' }, { key: 'storagePercent', label: 'Storage share', format: 'percent' }, { key: 'bandwidthCost', label: 'Bandwidth', format: 'currency' }, { key: 'bandwidthPercent', label: 'Bandwidth share', format: 'percent' }, { key: 'additionalCost', label: 'Additional services', format: 'currency' }, { key: 'additionalPercent', label: 'Additional share', format: 'percent' }, { key: 'monthlyCost', label: 'Monthly total', format: 'currency' }, { key: 'annualCost', label: 'Annual total', format: 'currency' }],
    calculate: (x) => {
      const result = calculateCloudHostingCost({ instances: v(x, 'instances'), hourlyCost: v(x, 'hourly'), runtimeHoursMonth: v(x, 'hours'), storageGb: v(x, 'storage'), storageRate: v(x, 'storageRate'), bandwidthGb: v(x, 'bandwidth'), bandwidthRate: v(x, 'bandwidthRate'), additionalCost: v(x, 'additional') });
      return { computeCost: result.computeCost, computePercent: result.percentages.compute, storageCost: result.storageCost, storagePercent: result.percentages.storage, bandwidthCost: result.bandwidthCost, bandwidthPercent: result.percentages.bandwidth, additionalCost: result.additionalCost, additionalPercent: result.percentages.additional, monthlyCost: result.monthlyCost, annualCost: result.annualCost };
    },
    note: 'This is a provider-independent planning estimator, not an exact AWS, Azure, or Google Cloud bill. Enter rates that match your region and service configuration.',
  },
  'cdn-cost-calculator': {
    fields: [{ key: 'bandwidth', label: 'Monthly CDN bandwidth (GB)', defaultValue: 1000, min: 0 }, { key: 'egress', label: 'CDN egress price per GB ($)', defaultValue: 0.05, min: 0, step: 0.001 }, { key: 'requests', label: 'Monthly requests', defaultValue: 10000000, min: 0, step: 1 }, { key: 'requestRate', label: 'Request price per 1M ($)', defaultValue: 0.75, min: 0, step: 0.01 }, { key: 'cacheHit', label: 'Cache-hit ratio (%)', defaultValue: 85, min: 0, max: 100 }, { key: 'originRate', label: 'Origin egress price per GB ($)', defaultValue: 0.08, min: 0, step: 0.001 }],
    results: [{ key: 'bandwidthCost', label: 'CDN bandwidth cost', format: 'currency' }, { key: 'requestCost', label: 'Request cost', format: 'currency' }, { key: 'originTrafficGb', label: 'Estimated origin traffic', format: 'number' }, { key: 'originCost', label: 'Origin cost', format: 'currency' }, { key: 'monthlyCost', label: 'Monthly total', format: 'currency' }, { key: 'annualCost', label: 'Annualized cost', format: 'currency' }],
    calculate: (x) => calculateCdnCost({ bandwidthGb: v(x, 'bandwidth'), egressPricePerGb: v(x, 'egress'), requests: v(x, 'requests'), requestPricePerMillion: v(x, 'requestRate'), cacheHitPercent: v(x, 'cacheHit'), originEgressPricePerGb: v(x, 'originRate') }),
    note: 'Origin traffic is estimated as CDN bandwidth × (1 − cache-hit ratio). Real billing can count requests, cache misses, revalidation, regional tiers, and origin transfer differently.',
  },
  'startup-runway-calculator': {
    fields: [{ key: 'cash', label: 'Current cash ($)', defaultValue: 120000, min: 0 }, { key: 'revenue', label: 'Monthly revenue ($)', defaultValue: 10000, min: 0 }, { key: 'expenses', label: 'Monthly operating expenses ($)', defaultValue: 30000, min: 0 }, { key: 'revenueGrowth', label: 'Monthly revenue growth (%)', defaultValue: 0, min: 0, max: 100 }, { key: 'expenseGrowth', label: 'Monthly expense growth (%)', defaultValue: 0, min: 0, max: 100 }],
    results: [{ key: 'netBurn', label: 'Current net burn', format: 'currency' }, { key: 'simpleRunwayMonths', label: 'Simple runway', format: 'months' }, { key: 'projectedRunwayMonths', label: 'Projected runway', format: 'months' }, { key: 'endingCash', label: 'Cash at projection end', format: 'currency' }],
    calculate: (x) => calculateStartupRunway({ cash: v(x, 'cash'), monthlyRevenue: v(x, 'revenue'), monthlyExpenses: v(x, 'expenses'), revenueGrowthPercent: v(x, 'revenueGrowth'), expenseGrowthPercent: v(x, 'expenseGrowth') }),
    note: 'When revenue meets or exceeds expenses, simple runway is shown as not applicable rather than infinity. Growth projections are scenarios, not forecasts.',
  },
  'saas-burn-rate-calculator': {
    fields: [{ key: 'start', label: 'Starting cash ($)', defaultValue: 500000, min: 0 }, { key: 'end', label: 'Ending cash ($)', defaultValue: 400000, min: 0 }, { key: 'months', label: 'Period length (months)', defaultValue: 3, min: 1, step: 1 }, { key: 'revenue', label: 'Revenue during period ($)', defaultValue: 150000, min: 0 }, { key: 'expenses', label: 'Expenses during period ($)', defaultValue: 250000, min: 0 }],
    results: [{ key: 'grossBurn', label: 'Average gross burn', format: 'currency' }, { key: 'netBurn', label: 'Average operating net burn', format: 'currency' }, { key: 'cashBurn', label: 'Average cash burn', format: 'currency' }, { key: 'runwayMonths', label: 'Runway at cash-burn pace', format: 'months' }],
    calculate: (x) => calculateBurnRate({ startingCash: v(x, 'start'), endingCash: v(x, 'end'), periodMonths: v(x, 'months'), revenue: v(x, 'revenue'), expenses: v(x, 'expenses') }),
    note: 'Gross burn is average expenses; operating net burn is expenses minus revenue; cash burn is the observed decline in cash. Financing and working-capital changes can make them differ.',
  },
  'ltv-cac-ratio-calculator': {
    fields: [{ key: 'arpu', label: 'Monthly ARPU ($)', defaultValue: 100, min: 0 }, { key: 'margin', label: 'Gross margin (%)', defaultValue: 80, min: 0, max: 100 }, { key: 'churn', label: 'Monthly customer churn (%)', defaultValue: 3, min: 0, max: 100 }, { key: 'cac', label: 'Customer acquisition cost ($)', defaultValue: 1200, min: 0 }],
    results: [{ key: 'grossProfitPerMonth', label: 'Monthly gross profit/customer', format: 'currency' }, { key: 'ltv', label: 'Estimated LTV', format: 'currency' }, { key: 'ratio', label: 'LTV:CAC ratio', format: 'number' }, { key: 'paybackMonths', label: 'Gross-profit payback', format: 'months' }],
    calculate: (x) => calculateLtvCac({ arpu: v(x, 'arpu'), grossMarginPercent: v(x, 'margin'), monthlyChurnPercent: v(x, 'churn'), cac: v(x, 'cac') }),
    note: 'This uses ARPU × gross margin ÷ monthly churn. Cohort, revenue-retention, discount-rate, contribution-margin, and contract models can produce different LTV estimates.',
  },
  'cac-payback-calculator': {
    fields: [{ key: 'cac', label: 'Customer acquisition cost ($)', defaultValue: 1200, min: 0 }, { key: 'mrr', label: 'MRR per customer ($)', defaultValue: 200, min: 0 }, { key: 'margin', label: 'Gross margin (%)', defaultValue: 80, min: 0, max: 100 }],
    results: [{ key: 'monthlyGrossProfit', label: 'Monthly gross profit/customer', format: 'currency' }, { key: 'paybackMonths', label: 'CAC payback period', format: 'months' }],
    calculate: (x) => calculateCacPayback({ cac: v(x, 'cac'), monthlyRevenuePerCustomer: v(x, 'mrr'), grossMarginPercent: v(x, 'margin') }),
    note: 'Payback uses steady monthly gross profit and does not model churn, expansion, collections timing, sales commissions outside CAC, or the time value of money.',
  },
  'churn-impact-calculator': {
    fields: [{ key: 'customers', label: 'Starting customers', defaultValue: 1000, min: 0, step: 1 }, { key: 'arpu', label: 'Monthly revenue per customer ($)', defaultValue: 100, min: 0 }, { key: 'churn', label: 'Monthly gross churn (%)', defaultValue: 3, min: 0, max: 100 }, { key: 'newCustomers', label: 'New customers per month', defaultValue: 20, min: 0, step: 1 }, { key: 'months', label: 'Projection months', defaultValue: 12, min: 1, max: 120, step: 1 }],
    results: [{ key: 'customersLost', label: 'Cumulative customers lost', format: 'number' }, { key: 'cumulativeRevenueLost', label: 'Cumulative monthly revenue lost', format: 'currency' }, { key: 'remainingCustomers', label: 'Ending customers', format: 'number' }, { key: 'endingMrr', label: 'Ending MRR', format: 'currency' }, { key: 'netCustomerChange', label: 'Net customer change', format: 'number' }],
    calculate: (x) => calculateChurnImpact({ startingCustomers: v(x, 'customers'), arpu: v(x, 'arpu'), monthlyChurnPercent: v(x, 'churn'), newCustomersPerMonth: v(x, 'newCustomers'), months: v(x, 'months') }),
    note: 'Gross churn is applied to each month’s opening customer base, then new customers are added. New customers affect net change but do not reduce the reported gross losses.',
  },
  'rule-of-40-calculator': {
    fields: [{ key: 'growth', label: 'Annual revenue growth (%)', defaultValue: 30, step: 0.1 }, { key: 'margin', label: 'Profitability margin (%)', defaultValue: 12, step: 0.1, help: 'Use either EBITDA or free-cash-flow margin consistently.' }],
    results: [{ key: 'score', label: 'Rule of 40 score', format: 'percent' }, { key: 'difference', label: 'Difference from 40', format: 'percent' }],
    calculate: (x) => calculateRuleOf40(v(x, 'growth'), v(x, 'margin')),
    note: 'The score is growth plus the selected profitability margin. It is a screening heuristic—not proof that a company is healthy, valuable, or suitable for investment.',
  },
  'net-revenue-retention-calculator': {
    fields: [{ key: 'start', label: 'Starting recurring revenue ($)', defaultValue: 100000, min: 0 }, { key: 'expansion', label: 'Expansion revenue ($)', defaultValue: 10000, min: 0 }, { key: 'contraction', label: 'Contraction revenue ($)', defaultValue: 5000, min: 0 }, { key: 'churn', label: 'Churned revenue ($)', defaultValue: 8000, min: 0 }],
    results: [{ key: 'nrrPercent', label: 'Net revenue retention', format: 'percent' }, { key: 'retainedRevenue', label: 'Ending retained revenue', format: 'currency' }, { key: 'expansion', label: 'Expansion', format: 'currency' }, { key: 'losses', label: 'Contraction + churn', format: 'currency' }, { key: 'netChange', label: 'Net change', format: 'currency' }],
    calculate: (x) => calculateNrr({ startingRevenue: v(x, 'start'), expansionRevenue: v(x, 'expansion'), contractionRevenue: v(x, 'contraction'), churnedRevenue: v(x, 'churn') }),
    note: 'NRR requires positive starting recurring revenue. Keep the period and revenue definition consistent and exclude new-customer revenue from expansion.',
  },
  'rental-property-cash-flow-calculator': {
    fields: [{ key: 'rent', label: 'Monthly rent ($)', defaultValue: 2500, min: 0 }, { key: 'income', label: 'Other monthly income ($)', defaultValue: 100, min: 0 }, { key: 'vacancy', label: 'Vacancy allowance (%)', defaultValue: 5, min: 0, max: 100 }, { key: 'tax', label: 'Monthly property tax ($)', defaultValue: 300, min: 0 }, { key: 'insurance', label: 'Monthly insurance ($)', defaultValue: 150, min: 0 }, { key: 'maintenance', label: 'Monthly maintenance ($)', defaultValue: 200, min: 0 }, { key: 'management', label: 'Monthly management ($)', defaultValue: 200, min: 0 }, { key: 'hoa', label: 'Monthly HOA ($)', defaultValue: 0, min: 0 }, { key: 'utilities', label: 'Owner-paid utilities ($)', defaultValue: 0, min: 0 }, { key: 'other', label: 'Other operating expenses ($)', defaultValue: 0, min: 0 }, { key: 'debt', label: 'Monthly mortgage/debt service ($)', defaultValue: 1200, min: 0 }],
    results: [{ key: 'effectiveIncome', label: 'Effective rental income', format: 'currency' }, { key: 'operatingExpenses', label: 'Operating expenses', format: 'currency' }, { key: 'noi', label: 'Monthly NOI', format: 'currency' }, { key: 'debtService', label: 'Debt service (after NOI)', format: 'currency' }, { key: 'monthlyCashFlow', label: 'Monthly cash flow', format: 'currency' }, { key: 'annualCashFlow', label: 'Annual cash flow', format: 'currency' }],
    calculate: (x) => calculateRentalCashFlow({ monthlyRent: v(x, 'rent'), otherIncome: v(x, 'income'), vacancyPercent: v(x, 'vacancy'), propertyTax: v(x, 'tax'), insurance: v(x, 'insurance'), maintenance: v(x, 'maintenance'), management: v(x, 'management'), hoa: v(x, 'hoa'), utilities: v(x, 'utilities'), otherExpenses: v(x, 'other'), debtService: v(x, 'debt') }),
    note: 'NOI subtracts operating expenses from effective income and deliberately excludes mortgage principal and interest. Debt service is deducted afterward to estimate cash flow.',
  },
  'rental-yield-calculator': {
    fields: [{ key: 'value', label: 'Property value or purchase price ($)', defaultValue: 400000, min: 0 }, { key: 'monthlyRent', label: 'Monthly rent ($)', defaultValue: 2500, min: 0 }, { key: 'annualRent', label: 'Optional annual rent override ($)', defaultValue: 0, min: 0, help: 'When greater than zero, this replaces monthly rent × 12.' }, { key: 'expenses', label: 'Annual operating expenses ($)', defaultValue: 8000, min: 0 }],
    results: [{ key: 'annualRent', label: 'Annual rental income', format: 'currency' }, { key: 'netIncome', label: 'Rent after entered expenses', format: 'currency' }, { key: 'grossYield', label: 'Gross rental yield', format: 'percent' }, { key: 'netYield', label: 'Net rental yield', format: 'percent' }],
    calculate: (x) => calculateRentalYield({ propertyValue: v(x, 'value'), annualRent: v(x, 'annualRent') > 0 ? v(x, 'annualRent') : v(x, 'monthlyRent') * 12, annualExpenses: v(x, 'expenses') }),
    note: 'Gross yield is annual rent ÷ property value. Net yield subtracts the entered operating expenses first; financing and taxes on your personal income are not included.',
  },
  'cap-rate-calculator': {
    fields: [{ key: 'value', label: 'Property value or purchase price ($)', defaultValue: 400000, min: 0 }, { key: 'rent', label: 'Annual rental income ($)', defaultValue: 30000, min: 0 }, { key: 'vacancy', label: 'Vacancy allowance (%)', defaultValue: 0, min: 0, max: 100 }, { key: 'expenses', label: 'Annual operating expenses ($)', defaultValue: 10000, min: 0 }],
    results: [{ key: 'effectiveIncome', label: 'Effective annual income', format: 'currency' }, { key: 'noi', label: 'Net operating income', format: 'currency' }, { key: 'capRate', label: 'Capitalization rate', format: 'percent' }],
    calculate: (x) => calculateCapRate({ propertyValue: v(x, 'value'), annualRent: v(x, 'rent'), vacancyPercent: v(x, 'vacancy'), annualOperatingExpenses: v(x, 'expenses') }),
    note: 'Cap rate equals NOI ÷ property value. NOI excludes mortgage/debt service, depreciation, income tax, and capital expenditures unless you deliberately include an allowance in operating expenses.',
  },
  'cash-on-cash-return-calculator': {
    fields: [{ key: 'down', label: 'Down payment ($)', defaultValue: 80000, min: 0 }, { key: 'closing', label: 'Closing costs ($)', defaultValue: 10000, min: 0 }, { key: 'rehab', label: 'Rehab and initial work ($)', defaultValue: 5000, min: 0 }, { key: 'other', label: 'Other initial cash ($)', defaultValue: 5000, min: 0 }, { key: 'cashFlow', label: 'Annual pre-tax cash flow ($)', defaultValue: 12000, step: 1 }],
    results: [{ key: 'cashInvested', label: 'Total cash invested', format: 'currency' }, { key: 'annualCashFlow', label: 'Annual pre-tax cash flow', format: 'currency' }, { key: 'returnPercent', label: 'Cash-on-cash return', format: 'percent' }],
    calculate: (x) => calculateCashOnCash({ downPayment: v(x, 'down'), closingCosts: v(x, 'closing'), rehabCosts: v(x, 'rehab'), otherInitialCosts: v(x, 'other'), annualCashFlow: v(x, 'cashFlow') }),
    note: 'Cash-on-cash return compares annual pre-tax cash flow with initial cash invested. It excludes appreciation, principal paydown, sale proceeds, and tax effects.',
  },
  'brrrr-calculator': {
    fields: [{ key: 'purchase', label: 'Purchase price ($)', defaultValue: 200000, min: 0 }, { key: 'purchaseCosts', label: 'Purchase and closing costs ($)', defaultValue: 10000, min: 0 }, { key: 'rehab', label: 'Rehab costs ($)', defaultValue: 50000, min: 0 }, { key: 'arv', label: 'After-repair value ($)', defaultValue: 350000, min: 0 }, { key: 'ltv', label: 'Refinance LTV (%)', defaultValue: 75, min: 0, max: 100 }, { key: 'refiCosts', label: 'Refinance costs ($)', defaultValue: 5000, min: 0 }, { key: 'rent', label: 'Monthly rent ($)', defaultValue: 2800, min: 0 }, { key: 'vacancy', label: 'Vacancy (%)', defaultValue: 5, min: 0, max: 100 }, { key: 'expenses', label: 'Monthly operating expenses ($)', defaultValue: 800, min: 0 }, { key: 'debt', label: 'Estimated monthly debt service ($)', defaultValue: 1500, min: 0 }],
    results: [{ key: 'totalProjectCash', label: 'Project cash before refinance', format: 'currency' }, { key: 'refinanceLoan', label: 'Estimated refinance loan', format: 'currency' }, { key: 'cashRecovered', label: 'Cash recovered after refi costs', format: 'currency' }, { key: 'cashLeftInDeal', label: 'Cash left in deal', format: 'currency' }, { key: 'monthlyCashFlow', label: 'Monthly cash flow', format: 'currency' }, { key: 'annualCashFlow', label: 'Annual cash flow', format: 'currency' }, { key: 'cashOnCashPercent', label: 'Post-refinance cash-on-cash', format: 'percent' }],
    calculate: (x) => calculateBrrrr({ purchasePrice: v(x, 'purchase'), purchaseCosts: v(x, 'purchaseCosts'), rehabCosts: v(x, 'rehab'), afterRepairValue: v(x, 'arv'), refinanceLtvPercent: v(x, 'ltv'), refinanceCosts: v(x, 'refiCosts'), monthlyRent: v(x, 'rent'), vacancyPercent: v(x, 'vacancy'), monthlyOperatingExpenses: v(x, 'expenses'), monthlyDebtService: v(x, 'debt') }),
    note: 'Refinance proceeds, value, costs, rent, vacancy, and debt service are estimates. Lending approval, appraisal, seasoning rules, taxes, reserves, and unplanned repairs are not modeled.',
  },
  'fix-and-flip-profit-calculator': {
    fields: [{ key: 'purchase', label: 'Purchase price ($)', defaultValue: 200000, min: 0 }, { key: 'acquisition', label: 'Acquisition and closing costs ($)', defaultValue: 10000, min: 0 }, { key: 'rehab', label: 'Rehab cost ($)', defaultValue: 60000, min: 0 }, { key: 'financing', label: 'Financing and interest ($)', defaultValue: 15000, min: 0 }, { key: 'holding', label: 'Holding costs ($)', defaultValue: 10000, min: 0 }, { key: 'sale', label: 'Selling price ($)', defaultValue: 375000, min: 0 }, { key: 'sellingCosts', label: 'Selling costs and commission ($)', defaultValue: 25000, min: 0 }, { key: 'other', label: 'Other costs ($)', defaultValue: 0, min: 0 }],
    results: [{ key: 'costBasis', label: 'Cost basis before sale costs', format: 'currency' }, { key: 'netSaleProceeds', label: 'Net sale proceeds', format: 'currency' }, { key: 'profit', label: 'Estimated profit', format: 'currency' }, { key: 'roiPercent', label: 'ROI on cost basis', format: 'percent' }, { key: 'profitMarginPercent', label: 'Profit margin on sale price', format: 'percent' }, { key: 'breakEvenSalePrice', label: 'Break-even sale price', format: 'currency' }],
    calculate: (x) => calculateFlip({ purchasePrice: v(x, 'purchase'), acquisitionCosts: v(x, 'acquisition'), rehabCost: v(x, 'rehab'), financingCost: v(x, 'financing'), holdingCosts: v(x, 'holding'), sellingPrice: v(x, 'sale'), sellingCosts: v(x, 'sellingCosts'), otherCosts: v(x, 'other') }),
    note: 'This planning estimate excludes tax and legal conclusions. Actual costs can change with project scope, time, financing terms, inspections, market conditions, and transaction details.',
  },
  'drawdown-recovery-calculator': {
    fields: [{ key: 'loss', label: 'Portfolio loss (%)', defaultValue: 30, min: 0, max: 100, help: 'Used when start value is zero.' }, { key: 'start', label: 'Optional start value ($)', defaultValue: 0, min: 0 }, { key: 'current', label: 'Optional current value ($)', defaultValue: 0, min: 0, help: 'When a start value is entered, this value determines the drawdown.' }],
    results: [{ key: 'drawdownPercent', label: 'Drawdown', format: 'percent' }, { key: 'amountLost', label: 'Amount lost', format: 'currency' }, { key: 'recoveryGainPercent', label: 'Required recovery gain', format: 'percent' }, { key: 'requiredGain', label: 'Required gain in value', format: 'currency' }, { key: 'targetValue', label: 'Recovery target', format: 'currency' }],
    calculate: (x) => calculateDrawdown({ lossPercent: v(x, 'loss'), startValue: v(x, 'start'), currentValue: v(x, 'current') }),
    note: 'A loss and an equal percentage gain do not cancel because the gain starts from a smaller base. A 100% loss has no finite percentage recovery and is shown as not applicable.',
  },
  'meeting-roi-calculator': {
    fields: [
      { key: 'attendees', label: 'Number of attendees', defaultValue: 8, min: 1, step: 1 },
      { key: 'compensation', label: 'Average annual compensation ($)', defaultValue: 80000, min: 0, step: 1000 },
      { key: 'overhead', label: 'Employer overhead / benefits (%)', defaultValue: 25, min: 0, max: 200, step: 1 },
      { key: 'workingHours', label: 'Working hours per year', defaultValue: 2080, min: 1, step: 1 },
      { key: 'duration', label: 'Meeting duration (minutes)', defaultValue: 60, min: 1, step: 1 },
      { key: 'meetingsPerWeek', label: 'Meetings per week', defaultValue: 1, min: 0, step: 1 },
      { key: 'workingWeeks', label: 'Working weeks per year', defaultValue: 48, min: 1, max: 52, step: 1 },
      { key: 'estimatedValue', label: 'Estimated value created per meeting ($)', defaultValue: 1000, min: 0, step: 50 },
    ],
    results: [
      { key: 'hourlyLoadedCost', label: 'Loaded hourly cost per attendee', format: 'currency' },
      { key: 'attendeeHours', label: 'Total attendee-hours', format: 'number' },
      { key: 'costPerMeeting', label: 'Cost per meeting', format: 'currency' },
      { key: 'weeklyMeetingCost', label: 'Weekly meeting cost', format: 'currency' },
      { key: 'monthlyMeetingCost', label: 'Monthly equivalent meeting cost', format: 'currency' },
      { key: 'annualMeetingCost', label: 'Annual meeting cost', format: 'currency' },
      { key: 'breakEvenValuePerMeeting', label: 'Break-even value per meeting', format: 'currency' },
      { key: 'netValuePerMeeting', label: 'Net value per meeting', format: 'currency' },
      { key: 'estimatedRoiPercent', label: 'Estimated ROI', format: 'percent' },
    ],
    calculate: (x) => calculateMeetingRoi({
      attendees: v(x, 'attendees'),
      annualCompensation: v(x, 'compensation'),
      overheadPercent: v(x, 'overhead'),
      workingHoursPerYear: v(x, 'workingHours'),
      durationMinutes: v(x, 'duration'),
      meetingsPerWeek: v(x, 'meetingsPerWeek'),
      workingWeeksPerYear: v(x, 'workingWeeks'),
      estimatedValuePerMeeting: v(x, 'estimatedValue'),
    }),
    note: 'Cost estimates model direct loaded employee compensation and exclude preparation, follow-up, room, software, and opportunity costs. Value created is an entered planning assumption, not an accounting fact.',
  },
  'ev-vs-gas-break-even-calculator': {
    fields: [
      { key: 'evPrice', label: 'EV purchase price ($)', defaultValue: 45000, min: 0, step: 500 },
      { key: 'gasPriceVehicle', label: 'Gas vehicle purchase price ($)', defaultValue: 35000, min: 0, step: 500 },
      { key: 'annualMiles', label: 'Annual driving distance (miles)', defaultValue: 12000, min: 0, step: 500 },
      { key: 'evEfficiency', label: 'EV efficiency (kWh/100 miles)', defaultValue: 30, min: 0, step: 1 },
      { key: 'electricityRate', label: 'Electricity price per kWh ($)', defaultValue: 0.16, min: 0, step: 0.01 },
      { key: 'gasMpg', label: 'Gas vehicle fuel economy (MPG)', defaultValue: 30, min: 0, step: 1 },
      { key: 'fuelPrice', label: 'Gasoline price per gallon ($)', defaultValue: 3.5, min: 0, step: 0.05 },
      { key: 'evMaintenance', label: 'EV annual maintenance ($)', defaultValue: 500, min: 0, step: 50 },
      { key: 'gasMaintenance', label: 'Gas annual maintenance ($)', defaultValue: 900, min: 0, step: 50 },
    ],
    results: [
      { key: 'pricePremium', label: 'EV purchase-price premium', format: 'currency' },
      { key: 'evAnnualEnergy', label: 'EV annual energy cost', format: 'currency' },
      { key: 'gasAnnualFuel', label: 'Gas annual fuel cost', format: 'currency' },
      { key: 'annualSavings', label: 'Annual operating savings', format: 'currency' },
      { key: 'breakEvenYears', label: 'Break-even time (years)', format: 'number' },
      { key: 'breakEvenMiles', label: 'Break-even mileage', format: 'number' },
    ],
    calculate: (x) => calculateEvVsGas({
      evPrice: v(x, 'evPrice'),
      gasPriceVehicle: v(x, 'gasPriceVehicle'),
      annualMiles: v(x, 'annualMiles'),
      evEfficiency: v(x, 'evEfficiency'),
      electricityRate: v(x, 'electricityRate'),
      gasMpg: v(x, 'gasMpg'),
      fuelPrice: v(x, 'fuelPrice'),
      evMaintenance: v(x, 'evMaintenance'),
      gasMaintenance: v(x, 'gasMaintenance'),
    }),
    note: 'Excludes financing, taxes, depreciation, insurance, and tax incentives. Real-world efficiency varies with weather, speed, and driving style.',
  },
  'heat-pump-vs-furnace-cost-calculator': {
    fields: [
      { key: 'heatingDemand', label: 'Annual useful heating demand (kWh)', defaultValue: 15000, min: 0, step: 500 },
      { key: 'cop', label: 'Heat pump seasonal COP', defaultValue: 3, min: 0.1, step: 0.1 },
      { key: 'electricityRate', label: 'Electricity price per kWh ($)', defaultValue: 0.16, min: 0, step: 0.01 },
      { key: 'furnaceEfficiency', label: 'Furnace efficiency (%)', defaultValue: 90, min: 1, max: 100, step: 1 },
      { key: 'fuelEnergyPrice', label: 'Furnace fuel price per kWh equivalent ($)', defaultValue: 0.08, min: 0, step: 0.005 },
      { key: 'heatPumpInstall', label: 'Heat pump installed cost ($)', defaultValue: 12000, min: 0, step: 500 },
      { key: 'furnaceInstall', label: 'Furnace installed cost ($)', defaultValue: 7000, min: 0, step: 500 },
    ],
    results: [
      { key: 'heatPumpAnnualCost', label: 'Heat pump annual energy cost', format: 'currency' },
      { key: 'furnaceAnnualCost', label: 'Furnace annual fuel cost', format: 'currency' },
      { key: 'annualSavings', label: 'Annual energy savings', format: 'currency' },
      { key: 'installPremium', label: 'Heat pump installation premium', format: 'currency' },
      { key: 'paybackYears', label: 'Simple payback (years)', format: 'number' },
    ],
    calculate: (x) => calculateHeatPumpVsFurnace({
      heatingDemand: v(x, 'heatingDemand'),
      cop: v(x, 'cop'),
      electricityRate: v(x, 'electricityRate'),
      furnaceEfficiency: v(x, 'furnaceEfficiency'),
      fuelEnergyPrice: v(x, 'fuelEnergyPrice'),
      heatPumpInstall: v(x, 'heatPumpInstall'),
      furnaceInstall: v(x, 'furnaceInstall'),
    }),
    note: 'Simplified seasonal energy model. Excludes backup auxiliary heat, equipment maintenance, service life, and delivery/connection standing fees.',
  },
  'short-term-rental-break-even-calculator': {
    fields: [
      { key: 'nightlyRate', label: 'Average nightly rate ($)', defaultValue: 180, min: 0, step: 5 },
      { key: 'availableNights', label: 'Available nights per month', defaultValue: 30, min: 1, max: 31, step: 1 },
      { key: 'occupancy', label: 'Expected occupancy (%)', defaultValue: 65, min: 0, max: 100, step: 1 },
      { key: 'variableCost', label: 'Variable cost per occupied night ($)', defaultValue: 35, min: 0, step: 1 },
      { key: 'fixedCosts', label: 'Monthly fixed operating costs ($)', defaultValue: 2200, min: 0, step: 50 },
      { key: 'platformFee', label: 'Platform/payment fees (%)', defaultValue: 3, min: 0, max: 100, step: 0.5 },
    ],
    results: [
      { key: 'occupiedNights', label: 'Occupied nights', format: 'number' },
      { key: 'grossRevenue', label: 'Gross booking revenue', format: 'currency' },
      { key: 'platformFees', label: 'Platform/payment fees', format: 'currency' },
      { key: 'totalCosts', label: 'Total monthly costs', format: 'currency' },
      { key: 'monthlyProfit', label: 'Estimated monthly profit', format: 'currency' },
      { key: 'breakEvenOccupancy', label: 'Break-even occupancy', format: 'percent' },
    ],
    calculate: (x) => calculateShortTermRental({
      nightlyRate: v(x, 'nightlyRate'),
      availableNights: v(x, 'availableNights'),
      occupancy: v(x, 'occupancy'),
      variableCost: v(x, 'variableCost'),
      fixedCosts: v(x, 'fixedCosts'),
      platformFee: v(x, 'platformFee'),
    }),
    note: 'Excludes income taxes, debt service principal paydown, seasonality fluctuations, and local short-term rental compliance fees.',
  },
  'house-hacking-effective-rent-calculator': {
    fields: [
      { key: 'mortgage', label: 'Monthly mortgage payment ($)', defaultValue: 2200, min: 0, step: 50 },
      { key: 'taxInsurance', label: 'Monthly property tax and insurance ($)', defaultValue: 600, min: 0, step: 25 },
      { key: 'hoa', label: 'Monthly HOA ($)', defaultValue: 0, min: 0, step: 25 },
      { key: 'utilities', label: 'Owner-paid utilities ($)', defaultValue: 300, min: 0, step: 25 },
      { key: 'maintenance', label: 'Monthly maintenance reserve ($)', defaultValue: 250, min: 0, step: 25 },
      { key: 'other', label: 'Other monthly housing costs ($)', defaultValue: 0, min: 0, step: 25 },
      { key: 'rentReceived', label: 'Expected monthly rent received ($)', defaultValue: 1800, min: 0, step: 50 },
      { key: 'vacancy', label: 'Rental vacancy allowance (%)', defaultValue: 5, min: 0, max: 100, step: 1 },
    ],
    results: [
      { key: 'grossHousingCost', label: 'Gross monthly housing cost', format: 'currency' },
      { key: 'effectiveRentIncome', label: 'Vacancy-adjusted rent received', format: 'currency' },
      { key: 'effectiveHousingCost', label: 'Effective monthly housing cost', format: 'currency' },
      { key: 'annualEffectiveCost', label: 'Annual effective housing cost', format: 'currency' },
      { key: 'costOffsetPercent', label: 'Housing cost offset by rent', format: 'percent' },
    ],
    calculate: (x) => calculateHouseHacking({
      mortgage: v(x, 'mortgage'),
      taxInsurance: v(x, 'taxInsurance'),
      hoa: v(x, 'hoa'),
      utilities: v(x, 'utilities'),
      maintenance: v(x, 'maintenance'),
      other: v(x, 'other'),
      rentReceived: v(x, 'rentReceived'),
      vacancy: v(x, 'vacancy'),
    }),
    note: 'Cash-flow planning calculation. Excludes principal accumulation, property appreciation, income taxes, and transaction closing costs.',
  },
  'job-offer-total-comp-calculator': {
    fields: [
      { key: 'salary', label: 'Annual base salary ($)', defaultValue: 100000, min: 0, step: 1000 },
      { key: 'bonus', label: 'Target annual bonus ($)', defaultValue: 10000, min: 0, step: 500 },
      { key: 'equityTotal', label: 'Total equity grant value ($)', defaultValue: 40000, min: 0, step: 1000 },
      { key: 'vestingYears', label: 'Equity vesting period (years)', defaultValue: 4, min: 0.1, step: 0.5 },
      { key: 'retirement', label: 'Annual employer retirement contribution ($)', defaultValue: 5000, min: 0, step: 250 },
      { key: 'benefits', label: 'Other annual employer-paid benefits ($)', defaultValue: 5000, min: 0, step: 250 },
      { key: 'signingBonus', label: 'One-time signing bonus ($)', defaultValue: 10000, min: 0, step: 500 },
    ],
    results: [
      { key: 'annualizedEquity', label: 'Annualized equity', format: 'currency' },
      { key: 'recurringComp', label: 'Estimated recurring annual compensation', format: 'currency' },
      { key: 'firstYearComp', label: 'Estimated first-year compensation', format: 'currency' },
      { key: 'monthlyEquivalent', label: 'Recurring monthly equivalent', format: 'currency' },
      { key: 'baseSalaryShare', label: 'Base salary share', format: 'percent' },
    ],
    calculate: (x) => calculateTotalCompensation({
      salary: v(x, 'salary'),
      bonus: v(x, 'bonus'),
      equityTotal: v(x, 'equityTotal'),
      vestingYears: v(x, 'vestingYears'),
      retirement: v(x, 'retirement'),
      benefits: v(x, 'benefits'),
      signingBonus: v(x, 'signingBonus'),
    }),
    note: 'Equity values and bonuses are planning estimates. Stock price volatility, tax withholding, vesting cliffs, and non-guaranteed bonuses can alter actual take-home compensation.',
  },
  'dog-age-breed-specific-calculator': {
    fields: [
      { key: 'dogAge', label: 'Dog age (years)', defaultValue: 5, min: 0, max: 30, step: 0.1 },
      {
        key: 'breedSize',
        label: 'Breed-size category',
        defaultValue: 'medium',
        type: 'select',
        options: [
          { value: 'small', label: 'Small (under 20 lbs / 9 kg)' },
          { value: 'medium', label: 'Medium (21–50 lbs / 9.5–23 kg)' },
          { value: 'large', label: 'Large (51–90 lbs / 23.5–41 kg)' },
          { value: 'giant', label: 'Giant (over 90 lbs / 41+ kg)' },
        ],
        help: 'Smaller breeds generally mature faster in year 1 but age more slowly in subsequent years.',
      },
    ],
    results: [
      { key: 'humanEquivalent', label: 'Estimated human-equivalent age', format: 'number' },
      { key: 'lifeStage', label: 'Approximate life stage', format: 'text' },
    ],
    calculate: (x) => calculateDogAge({ dogAge: v(x, 'dogAge'), breedSize: s(x, 'breedSize', 'medium') }),
    note: 'Human-equivalent age is an educational approximation. Genetics, individual weight, lifestyle, and veterinary care significantly influence biological aging.',
  },
  'puppy-growth-predictor': {
    fields: [
      { key: 'ageWeeks', label: 'Puppy age (weeks)', defaultValue: 16, min: 4, max: 104, step: 1 },
      { key: 'currentWeight', label: 'Current puppy weight (lbs or kg)', defaultValue: 15, min: 0.1, step: 0.1, help: 'Outputs will reflect the same unit entered.' },
      {
        key: 'breedSize',
        label: 'Expected breed-size category',
        defaultValue: 'medium',
        type: 'select',
        options: [
          { value: 'small', label: 'Small breed (adult under 22 lbs / 10 kg)' },
          { value: 'medium', label: 'Medium breed (adult 22–55 lbs / 10–25 kg)' },
          { value: 'large', label: 'Large breed (adult 55–100 lbs / 25–45 kg)' },
          { value: 'giant', label: 'Giant breed (adult over 100 lbs / 45+ kg)' },
        ],
        help: 'Small breeds reach full size much faster (9–10 months) than giant breeds (18–24 months).',
      },
    ],
    results: [
      { key: 'estimatedAdultWeight', label: 'Estimated adult weight', format: 'number' },
      { key: 'lowEstimate', label: 'Estimated lower range', format: 'number' },
      { key: 'highEstimate', label: 'Estimated upper range', format: 'number' },
      { key: 'growthProgress', label: 'Approximate growth completed', format: 'percent' },
    ],
    calculate: (x) => calculatePuppyGrowth({ ageWeeks: v(x, 'ageWeeks'), currentWeight: v(x, 'currentWeight'), breedSize: s(x, 'breedSize', 'medium') }),
    note: 'Growth curves are population estimates based on typical breed-size timelines. Nutrition, genetics, and health status cause individual variation.',
  },
  'cat-calorie-calculator': {
    fields: [
      { key: 'weightKg', label: 'Cat weight (kg)', defaultValue: 4.5, min: 0.5, max: 30, step: 0.1 },
      {
        key: 'factor',
        label: 'Life stage / activity factor',
        defaultValue: 'neutered-adult',
        type: 'select',
        options: [
          { value: 'neutered-adult', label: 'Neutered adult (1.2× RER)' },
          { value: 'intact-adult', label: 'Intact adult (1.4× RER)' },
          { value: 'inactive-prone', label: 'Inactive adult (1.0× RER)' },
          { value: 'active-adult', label: 'Highly active adult (1.6× RER)' },
          { value: 'kitten-young', label: 'Kitten under 4 months (2.5× RER)' },
          { value: 'kitten-older', label: 'Kitten 4 to 12 months (2.0× RER)' },
          { value: 'senior', label: 'Senior cat (1.1× RER)' },
        ],
        help: 'Multiplies Resting Energy Requirement (70 × weight^0.75) by the life-stage factor.',
      },
    ],
    results: [
      { key: 'rer', label: 'Resting energy requirement (kcal/day)', format: 'number' },
      { key: 'dailyCalories', label: 'Estimated daily calories (kcal/day)', format: 'number' },
    ],
    calculate: (x) => calculateCatCalories({ weightKg: v(x, 'weightKg'), factor: s(x, 'factor', 'neutered-adult') }),
    note: 'General informational energy estimates based on standard feline equations. Not a therapeutic feeding prescription, disease-specific diet, or medical weight-loss plan. Consult a veterinarian for personalized nutritional supervision.',
  },
  'caffeine-half-life-calculator': {
    fields: [
      { key: 'doseMg', label: 'Caffeine consumed (mg)', defaultValue: 200, min: 0, step: 10, help: 'Typical 8oz brewed coffee is ~95mg; espresso ~63mg; energy drink ~160mg.' },
      { key: 'hoursElapsed', label: 'Hours since consumption', defaultValue: 6, min: 0, step: 0.25 },
      { key: 'halfLifeHours', label: 'Estimated caffeine half-life (hours)', defaultValue: 5, min: 1, max: 12, step: 0.25, help: 'Typical adult half-life is 4–6 hours (average ~5 hours).' },
    ],
    results: [
      { key: 'remainingMg', label: 'Estimated caffeine remaining (mg)', format: 'number' },
      { key: 'remainingPercent', label: 'Estimated caffeine remaining (%)', format: 'percent' },
      { key: 'eliminatedMg', label: 'Estimated caffeine metabolized (mg)', format: 'number' },
    ],
    calculate: (x) => calculateCaffeineHalfLife({ doseMg: v(x, 'doseMg'), hoursElapsed: v(x, 'hoursElapsed'), halfLifeHours: v(x, 'halfLifeHours') }),
    note: 'Pharmacokinetic half-life estimate. Individual clearance rates vary with genetics (CYP1A2), pregnancy, oral contraceptives, smoking, medications, and age.',
  },
  'hrv-baseline-deviation-calculator': {
    fields: [
      { key: 'baselineHrv', label: 'Personal baseline HRV (ms)', defaultValue: 55, min: 0.1, step: 1, help: 'Your established rolling 7–30 day average HRV (e.g., rMSSD or SDNN).' },
      { key: 'currentHrv', label: 'Current HRV reading (ms)', defaultValue: 48, min: 0, step: 1, help: 'Measured under consistent resting morning conditions.' },
    ],
    results: [
      { key: 'absoluteDifference', label: 'Absolute difference (ms)', format: 'number' },
      { key: 'percentDeviation', label: 'Deviation from baseline', format: 'percent' },
      { key: 'ratio', label: 'Current-to-baseline ratio', format: 'number' },
      { key: 'direction', label: 'Direction versus baseline', format: 'text' },
    ],
    calculate: (x) => calculateHrvDeviation({ baselineHrv: v(x, 'baselineHrv'), currentHrv: v(x, 'currentHrv') }),
    note: 'Mathematical comparison only. Device sensors, sleep, circadian rhythm, and measurement posture affect readings. Does not diagnose recovery, fitness, stress, or health status.',
  },
  'wilks-dots-powerlifting-calculator': {
    fields: [
      {
        key: 'sex',
        label: 'Scoring category',
        defaultValue: 'male',
        type: 'select',
        options: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
        ],
      },
      { key: 'bodyweightKg', label: 'Bodyweight (kg)', defaultValue: 90, min: 20, max: 300, step: 0.1 },
      { key: 'totalKg', label: 'Powerlifting competition total (kg)', defaultValue: 600, min: 0, step: 0.5, help: 'Sum of best valid squat, bench press, and deadlift in kg.' },
    ],
    results: [
      { key: 'dotsScore', label: 'DOTS score', format: 'number' },
      { key: 'wilksScore', label: 'Wilks-style score', format: 'number' },
      { key: 'totalBodyweightRatio', label: 'Total / bodyweight ratio', format: 'number' },
    ],
    calculate: (x) => calculateWilksDots({ sex: s(x, 'sex', 'male'), bodyweightKg: v(x, 'bodyweightKg'), totalKg: v(x, 'totalKg') }),
    note: 'Uses published standard coefficients for DOTS and original 1994 Wilks scoring. Different federations or eras may use updated coefficients. For training and comparative analysis only.',
  },
  'soffit-fascia-calculator': {
    fields: [
      { key: 'eaveLength', label: 'Total eave length (ft)', defaultValue: 120, min: 0, step: 1 },
      { key: 'soffitDepth', label: 'Soffit depth (ft)', defaultValue: 2, min: 0, step: 0.25 },
      { key: 'fasciaBoardLength', label: 'Fascia board length (ft)', defaultValue: 12, min: 0, step: 1 },
      { key: 'soffitPanelCoverage', label: 'Soffit panel coverage (sq ft/piece)', defaultValue: 12, min: 0, step: 1 },
      { key: 'wastePercent', label: 'Waste allowance (%)', defaultValue: 10, min: 0, max: 50, step: 1 },
    ],
    results: [
      { key: 'soffitArea', label: 'Soffit net area (sq ft)', format: 'number' },
      { key: 'soffitAreaWithWaste', label: 'Soffit area with waste (sq ft)', format: 'number' },
      { key: 'soffitPieces', label: 'Estimated soffit panels', format: 'number' },
      { key: 'fasciaLengthWithWaste', label: 'Fascia length with waste (ft)', format: 'number' },
      { key: 'fasciaBoards', label: 'Estimated fascia boards', format: 'number' },
    ],
    calculate: (x) =>
      calculateSoffitFascia({
        eaveLength: v(x, 'eaveLength'),
        soffitDepth: v(x, 'soffitDepth'),
        fasciaBoardLength: v(x, 'fasciaBoardLength'),
        soffitPanelCoverage: v(x, 'soffitPanelCoverage'),
        wastePercent: v(x, 'wastePercent'),
      }),
    note: 'Roof geometry, gables, hip returns, and rake boards may require separate measurement. Verify manufacturer panel dimensions and field measurements before ordering.',
  },
  'attic-insulation-payback-calculator': {
    fields: [
      { key: 'atticArea', label: 'Attic area (sq ft)', defaultValue: 1500, min: 0, step: 50 },
      { key: 'installedCostPerArea', label: 'Installed cost per sq ft ($)', defaultValue: 1.8, min: 0, step: 0.05 },
      { key: 'annualHeatingCoolingCost', label: 'Annual heating & cooling cost ($)', defaultValue: 1800, min: 0, step: 25 },
      { key: 'estimatedSavingsPercent', label: 'Estimated energy savings (%)', defaultValue: 12, min: 0, max: 100, step: 1 },
      { key: 'rebates', label: 'Rebates or incentives ($)', defaultValue: 0, min: 0, step: 25 },
    ],
    results: [
      { key: 'grossProjectCost', label: 'Gross project cost', format: 'currency' },
      { key: 'netProjectCost', label: 'Net project cost', format: 'currency' },
      { key: 'annualSavings', label: 'Estimated annual savings', format: 'currency' },
      { key: 'monthlySavings', label: 'Estimated monthly savings', format: 'currency' },
      { key: 'paybackYears', label: 'Simple payback period (years)', format: 'number' },
    ],
    calculate: (x) =>
      calculateAtticInsulation({
        atticArea: v(x, 'atticArea'),
        installedCostPerArea: v(x, 'installedCostPerArea'),
        annualHeatingCoolingCost: v(x, 'annualHeatingCoolingCost'),
        estimatedSavingsPercent: v(x, 'estimatedSavingsPercent'),
        rebates: v(x, 'rebates'),
      }),
    note: 'This is a simple-payback estimator and not a building energy simulation. Actual savings depend on climate zone, current insulation level, air sealing, HVAC efficiency, and occupant habits.',
  },
  'joist-deflection-calculator': {
    fields: [
      { key: 'span', label: 'Clear span (ft)', defaultValue: 12, min: 0, step: 0.5 },
      { key: 'uniformLoad', label: 'Uniform load (psf)', defaultValue: 40, min: 0, step: 5, help: 'Total dead + live area load (e.g. 10 psf dead + 30 psf live = 40 psf).' },
      { key: 'spacing', label: 'Joist spacing (inches on-center)', defaultValue: 16, min: 0, step: 1 },
      { key: 'elasticModulus', label: 'Modulus of elasticity E (psi)', defaultValue: 1600000, min: 0, step: 50000, help: 'Typical framing lumber: 1,300,000 to 1,800,000 psi.' },
      { key: 'width', label: 'Joist width b (inches)', defaultValue: 1.5, min: 0, step: 0.125, help: 'Actual dimension (e.g. 1.5" for nominal 2x lumber).' },
      { key: 'depth', label: 'Joist depth d (inches)', defaultValue: 9.25, min: 0, step: 0.125, help: 'Actual dimension (e.g. 7.25" for 2x8, 9.25" for 2x10, 11.25" for 2x12).' },
    ],
    results: [
      { key: 'lineLoad', label: 'Tributary line load (lb/ft)', format: 'number' },
      { key: 'momentOfInertia', label: 'Moment of inertia I (in⁴)', format: 'number' },
      { key: 'deflection', label: 'Estimated midspan deflection (inches)', format: 'number' },
      { key: 'l360Limit', label: 'L/360 deflection limit (inches)', format: 'number' },
      { key: 'ratio', label: 'Span / deflection ratio', format: 'text' },
    ],
    calculate: (x) =>
      calculateJoistDeflection({
        span: v(x, 'span'),
        uniformLoad: v(x, 'uniformLoad'),
        spacing: v(x, 'spacing'),
        elasticModulus: v(x, 'elasticModulus'),
        width: v(x, 'width'),
        depth: v(x, 'depth'),
      }),
    note: 'Simplified engineering estimate for simply supported, uniformly loaded rectangular members. Does not evaluate shear deflection, vibration, composite action, load duration, notches, holes, or building code compliance. Consult a licensed structural engineer for safety-critical framing.',
  },
  'hvac-duct-cfm-calculator': {
    fields: [
      {
        key: 'ductShape',
        label: 'Duct shape',
        defaultValue: 'round',
        type: 'select',
        options: [
          { value: 'round', label: 'Round duct' },
          { value: 'rectangular', label: 'Rectangular duct' },
        ],
      },
      { key: 'diameter', label: 'Round duct diameter (inches)', defaultValue: 8, min: 0, step: 1 },
      { key: 'width', label: 'Rectangular duct width (inches)', defaultValue: 12, min: 0, step: 1 },
      { key: 'height', label: 'Rectangular duct height (inches)', defaultValue: 8, min: 0, step: 1 },
      { key: 'velocity', label: 'Air velocity (FPM)', defaultValue: 700, min: 0, step: 25, help: 'Typical branch ducts run 600–800 FPM; main trunks run 800–1,000 FPM.' },
    ],
    results: [
      { key: 'ductArea', label: 'Duct cross-sectional area (sq ft)', format: 'number' },
      { key: 'cfm', label: 'Estimated airflow (CFM)', format: 'number' },
    ],
    calculate: (x) =>
      calculateHvacDuctCfm({
        ductShape: s(x, 'ductShape', 'round'),
        diameter: v(x, 'diameter'),
        width: v(x, 'width'),
        height: v(x, 'height'),
        velocity: v(x, 'velocity'),
      }),
    note: 'Calculates theoretical airflow from cross-sectional area and air velocity (Q = A × V). Does not size ducts from static pressure, friction loss, equivalent length, fittings, or fan curves. Use ACCA Manual D for complete HVAC design.',
  },
  'shed-ramp-angle-calculator': {
    fields: [
      { key: 'rise', label: 'Vertical rise (inches)', defaultValue: 12, min: 0, step: 0.5 },
      { key: 'run', label: 'Horizontal run (inches)', defaultValue: 48, min: 0, step: 1 },
    ],
    results: [
      { key: 'angleDegrees', label: 'Ramp slope angle (degrees)', format: 'number' },
      { key: 'slopePercent', label: 'Ramp slope', format: 'percent' },
      { key: 'rampLength', label: 'Ramp surface length (inches)', format: 'number' },
      { key: 'riseRunRatio', label: 'Rise-to-run ratio', format: 'text' },
    ],
    calculate: (x) =>
      calculateShedRamp({
        rise: v(x, 'rise'),
        run: v(x, 'run'),
      }),
    note: 'Geometric calculation only, not an ADA accessibility or building code compliance checker. Safe ramp angle depends on intended equipment (e.g. lawn mower deck clearance), wheel traction, and weather conditions.',
  },
  'construction-material-waste-calculator': {
    fields: [
      { key: 'netQuantity', label: 'Net material quantity', defaultValue: 1000, min: 0, step: 1, help: 'Measured net requirement (sq ft, linear ft, pieces, or units).' },
      { key: 'wastePercent', label: 'Waste allowance (%)', defaultValue: 10, min: 0, max: 100, step: 1 },
      { key: 'unitCost', label: 'Unit cost ($)', defaultValue: 2.5, min: 0, step: 0.05 },
    ],
    results: [
      { key: 'wasteQuantity', label: 'Waste allowance quantity', format: 'number' },
      { key: 'orderQuantity', label: 'Recommended order quantity', format: 'number' },
      { key: 'netMaterialCost', label: 'Net material cost', format: 'currency' },
      { key: 'wasteCost', label: 'Waste allowance cost', format: 'currency' },
      { key: 'totalMaterialCost', label: 'Total material cost', format: 'currency' },
    ],
    calculate: (x) =>
      calculateMaterialWaste({
        netQuantity: v(x, 'netQuantity'),
        wastePercent: v(x, 'wastePercent'),
        unitCost: v(x, 'unitCost'),
      }),
    note: 'General allowance calculation for material ordering. Material layout, cuts, pattern matching, and jobsite damage affect actual scrap. Final purchasing may require rounding to full bundles, cartons, sheets, or pallets.',
  },
  'image-megapixel-calculator': {
    fields: [
      { key: 'widthPixels', label: 'Image width (px)', defaultValue: 6000, min: 0, step: 1 },
      { key: 'heightPixels', label: 'Image height (px)', defaultValue: 4000, min: 0, step: 1 },
    ],
    results: [
      { key: 'totalPixels', label: 'Total pixels', format: 'number' },
      { key: 'megapixels', label: 'Megapixels', format: 'number' },
      { key: 'aspectRatio', label: 'Aspect ratio', format: 'text' },
    ],
    calculate: (x) =>
      calculateImageMegapixel({
        widthPixels: v(x, 'widthPixels'),
        heightPixels: v(x, 'heightPixels'),
      }),
    note: 'Megapixel count measures pixel resolution and grid density, not overall optical sharpness or image quality. Sensor size, lens quality, compression, and lighting also determine final image fidelity.',
  },
  'image-print-size-calculator': {
    fields: [
      { key: 'widthPixels', label: 'Image width (px)', defaultValue: 3000, min: 0, step: 1 },
      { key: 'heightPixels', label: 'Image height (px)', defaultValue: 2400, min: 0, step: 1 },
      { key: 'ppi', label: 'Print resolution (PPI)', defaultValue: 300, min: 0, step: 1, help: 'Pixels per inch (standard photographic print is 300 PPI).' },
    ],
    results: [
      { key: 'widthInches', label: 'Print width (in)', format: 'number' },
      { key: 'heightInches', label: 'Print height (in)', format: 'number' },
      { key: 'widthCm', label: 'Print width (cm)', format: 'number' },
      { key: 'heightCm', label: 'Print height (cm)', format: 'number' },
    ],
    calculate: (x) =>
      calculateImagePrintSize({
        widthPixels: v(x, 'widthPixels'),
        heightPixels: v(x, 'heightPixels'),
        ppi: v(x, 'ppi'),
      }),
    note: 'PPI (pixels per inch) describes pixel density for physical print output. It differs from printer hardware DPI (dots of ink per inch). Changing PPI values recalculates physical dimensions without altering source image pixel data.',
  },
  'image-file-size-estimator': {
    fields: [
      { key: 'widthPixels', label: 'Image width (px)', defaultValue: 1920, min: 0, step: 1 },
      { key: 'heightPixels', label: 'Image height (px)', defaultValue: 1080, min: 0, step: 1 },
      { key: 'channels', label: 'Color channels', defaultValue: 3, min: 1, max: 4, step: 1, help: '3 for RGB, 4 for RGBA with transparency.' },
      { key: 'bitsPerChannel', label: 'Bits per channel', defaultValue: 8, min: 1, max: 32, step: 1, help: '8-bit standard, 10/12/16-bit HDR or wide-gamut.' },
    ],
    results: [
      { key: 'totalBits', label: 'Raw bits', format: 'number' },
      { key: 'totalBytes', label: 'Raw uncompressed bytes', format: 'number' },
      { key: 'kib', label: 'Uncompressed memory (KiB)', format: 'number' },
      { key: 'mib', label: 'Uncompressed memory (MiB)', format: 'number' },
    ],
    calculate: (x) =>
      calculateImageFileSize({
        widthPixels: v(x, 'widthPixels'),
        heightPixels: v(x, 'heightPixels'),
        channels: v(x, 'channels'),
        bitsPerChannel: v(x, 'bitsPerChannel'),
      }),
    note: 'Estimates uncompressed in-memory raster pixel data (width × height × channels × bit depth). This is not a predictor for compressed JPEG, PNG, WebP, or AVIF file sizes on disk, which vary dramatically with image complexity and entropy encoding.',
  },
  'image-scaling-calculator': {
    fields: [
      { key: 'originalWidth', label: 'Original width (px)', defaultValue: 1920, min: 0, step: 1 },
      { key: 'originalHeight', label: 'Original height (px)', defaultValue: 1080, min: 0, step: 1 },
      { key: 'scalePercent', label: 'Scale percentage (%)', defaultValue: 50, min: 0, step: 0.1 },
    ],
    results: [
      { key: 'scaledWidth', label: 'Scaled width (px)', format: 'number' },
      { key: 'scaledHeight', label: 'Scaled height (px)', format: 'number' },
      { key: 'scaleFactor', label: 'Scale factor', format: 'number' },
      { key: 'pixelAreaPercent', label: 'Pixel area vs original', format: 'percent' },
    ],
    calculate: (x) =>
      calculateImageScaling({
        originalWidth: v(x, 'originalWidth'),
        originalHeight: v(x, 'originalHeight'),
        scalePercent: v(x, 'scalePercent'),
      }),
    note: 'Calculates proportional target dimensions and pixel area. Scaling width and height to 50% yields 25% of the original pixel area (0.5 × 0.5 = 0.25). This tool calculates geometric dimensions only and does not resample or modify image files.',
  },
  'photo-storage-calculator': {
    fields: [
      { key: 'storageGb', label: 'Storage capacity (GB)', defaultValue: 64, min: 0, step: 1 },
      { key: 'averagePhotoMb', label: 'Average photo size (MB)', defaultValue: 5, min: 0, step: 0.1 },
      { key: 'reservedPercent', label: 'Reserved / OS space (%)', defaultValue: 10, min: 0, max: 100, step: 1, help: 'Space allocated for system files, formatting overhead, or apps.' },
    ],
    results: [
      { key: 'usableStorageGb', label: 'Usable storage (GB)', format: 'number' },
      { key: 'usableStorageMb', label: 'Usable storage (MB)', format: 'number' },
      { key: 'estimatedPhotos', label: 'Estimated photo count', format: 'number' },
    ],
    calculate: (x) =>
      calculatePhotoStorage({
        storageGb: v(x, 'storageGb'),
        averagePhotoMb: v(x, 'averagePhotoMb'),
        reservedPercent: v(x, 'reservedPercent'),
      }),
    note: 'Storage estimates use standard binary units (1 GB = 1,024 MB). Actual photo file sizes fluctuate widely depending on camera sensor, capture format (RAW vs JPEG), ISO noise, and scene detail. Formatting overhead and filesystem metadata also reduce available capacity.',
  },
  'image-bandwidth-calculator': {
    fields: [
      { key: 'imageSizeKb', label: 'Average image size (KB)', defaultValue: 250, min: 0, step: 1 },
      { key: 'imagesPerView', label: 'Images per page view', defaultValue: 5, min: 0, step: 1 },
      { key: 'pageViews', label: 'Monthly page views', defaultValue: 10000, min: 0, step: 100 },
    ],
    results: [
      { key: 'dataPerViewKb', label: 'Image payload per page view (KB)', format: 'number' },
      { key: 'totalTransferKb', label: 'Total image transfer (KB)', format: 'number' },
      { key: 'totalTransferMb', label: 'Total image transfer (MB)', format: 'number' },
      { key: 'totalTransferGb', label: 'Total image transfer (GB)', format: 'number' },
    ],
    calculate: (x) =>
      calculateImageBandwidth({
        imageSizeKb: v(x, 'imageSizeKb'),
        imagesPerView: v(x, 'imagesPerView'),
        pageViews: v(x, 'pageViews'),
      }),
    note: 'Calculates raw image transfer volume using binary conversions (1 MB = 1,024 KB, 1 GB = 1,024 MB). Actual network egress will vary based on CDN edge caching, browser caching, responsive image srcsets, repeat visitor ratios, and lazy-loading.',
  },
  'ipv6-subnet-calculator': {
    fields: [
      { key: 'parentPrefix', label: 'Parent prefix length (/0–/128)', defaultValue: 48, min: 0, max: 128, step: 1, help: 'Leading routing prefix (e.g. /48 site allocation or /56 delegation).' },
      { key: 'subnetPrefix', label: 'Subnet prefix length (/0–/128)', defaultValue: 64, min: 0, max: 128, step: 1, help: 'Target subnet size (e.g. /64 standard LAN or /128 single address).' },
    ],
    results: [
      { key: 'subnetBits', label: 'Subnet bits', format: 'number' },
      { key: 'subnetCount', label: 'Number of subnets', format: 'text' },
      { key: 'hostBits', label: 'Interface/host bits per subnet', format: 'number' },
      { key: 'addressesPerSubnet', label: 'Addresses per subnet', format: 'text' },
    ],
    calculate: (x) =>
      calculateIpv6Subnet({
        parentPrefix: v(x, 'parentPrefix'),
        subnetPrefix: v(x, 'subnetPrefix'),
      }),
    note: 'IPv6 prefix mathematics uses exact 128-bit integer capacity. A /64 prefix is the standard LAN allocation recommended by RFC 4291/7217 for SLAAC autoconfiguration, providing 18.4 quintillion addresses per subnet. Subnet counts and address capacities exceeding 2^53 are computed using exact BigInt arithmetic.',
  },
  'tcp-udp-port-range-calculator': {
    fields: [
      { key: 'startPort', label: 'Start port (0–65535)', defaultValue: 1024, min: 0, max: 65535, step: 1 },
      { key: 'endPort', label: 'End port (0–65535)', defaultValue: 49151, min: 0, max: 65535, step: 1 },
    ],
    results: [
      { key: 'portCount', label: 'Ports in range', format: 'number' },
      { key: 'range', label: 'Inclusive range', format: 'text' },
      { key: 'classification', label: 'Port range classification', format: 'text' },
    ],
    calculate: (x) =>
      calculatePortRange({
        startPort: v(x, 'startPort'),
        endPort: v(x, 'endPort'),
      }),
    note: 'Calculates the inclusive numeric port span across the 16-bit port number space (0–65535). Categorization identifies standard IANA port segments: System/Well-Known (0–1023), User/Registered (1024–49151), and Dynamic/Private/Ephemeral (49152–65535). Numeric counting does not test port accessibility or protocol state.',
  },
  'cidr-summarization-calculator': {
    fields: [
      { key: 'cidrList', label: 'IPv4 CIDR networks', defaultValue: '192.168.0.0/25\n192.168.0.128/25', type: 'textarea', rows: 5, help: 'Enter one IPv4 CIDR prefix per line (e.g. 192.168.0.0/25).' },
    ],
    results: [
      { key: 'inputNetworks', label: 'Valid input networks', format: 'number' },
      { key: 'summaryNetworks', label: 'Summarized CIDRs', format: 'text' },
      { key: 'summaryCount', label: 'Summary count', format: 'number' },
      { key: 'addressesCovered', label: 'Addresses covered', format: 'number' },
    ],
    calculate: (x) =>
      calculateCidrSummarization({
        cidrList: s(x, 'cidrList'),
      }),
    note: 'Exact IPv4 route aggregation normalizes subnets to network boundaries, eliminates contained redundant networks, and iteratively merges adjacent equal-sized sibling blocks where the parent exactly covers the address space. Non-sibling or misaligned networks are never combined into wider blocks that cover unsupplied addresses.',
  },
  'ip-address-classifier': {
    fields: [
      { key: 'ipAddress', label: 'IP address (IPv4 or IPv6)', defaultValue: '192.168.1.10', type: 'text', placeholder: 'e.g. 192.168.1.1 or 2001:db8::1', help: 'Evaluated locally without external network probes or DNS resolution.' },
    ],
    results: [
      { key: 'version', label: 'IP version', format: 'text' },
      { key: 'classification', label: 'Classification', format: 'text' },
      { key: 'scope', label: 'Scope / special use', format: 'text' },
      { key: 'matchedRange', label: 'Matched range', format: 'text' },
    ],
    calculate: (x) =>
      calculateIpClassifier({
        ipAddress: s(x, 'ipAddress'),
      }),
    note: 'Classification evaluates IP syntax against authoritative IANA Special-Purpose Address Registries (RFC 6890, RFC 1918, RFC 4291, RFC 3927). A classification of Global Unicast indicates syntactic public allocation; reachability depends on network topology and firewall configurations. No network connections are initiated.',
  },
  'common-port-service-lookup': {
    fields: [
      { key: 'port', label: 'Port number (0–65535)', defaultValue: 443, min: 0, max: 65535, step: 1 },
      { key: 'protocol', label: 'Protocol', defaultValue: 'TCP', type: 'select', options: [{ value: 'TCP', label: 'TCP' }, { value: 'UDP', label: 'UDP' }, { value: 'Both', label: 'TCP & UDP' }] },
    ],
    results: [
      { key: 'portNumber', label: 'Port', format: 'number' },
      { key: 'protocol', label: 'Protocol', format: 'text' },
      { key: 'service', label: 'Common service', format: 'text' },
      { key: 'rangeClass', label: 'Port range', format: 'text' },
    ],
    calculate: (x) =>
      calculatePortServiceLookup({
        port: v(x, 'port'),
        protocol: s(x, 'protocol'),
      }),
    note: 'Searches a curated local reference of standardized and commonly observed service port assignments. If no match is found, the lookup explicitly states that no common entry exists rather than estimating or inventing a service. Service assignment does not indicate an active listener on your local machine.',
  },
  'url-parser': {
    fields: [
      { key: 'url', label: 'Target URL', defaultValue: 'https://example.com:8080/products/item?id=42&utm_source=test#details', type: 'text', help: 'Must be an absolute URL including scheme (e.g. https://).' },
    ],
    results: [
      { key: 'protocol', label: 'Protocol', format: 'text' },
      { key: 'hostname', label: 'Hostname', format: 'text' },
      { key: 'port', label: 'Port', format: 'text' },
      { key: 'pathname', label: 'Path', format: 'text' },
      { key: 'query', label: 'Query string', format: 'text' },
      { key: 'fragment', label: 'Fragment', format: 'text' },
      { key: 'queryParameters', label: 'Query parameters', format: 'text' },
    ],
    calculate: (x) =>
      calculateUrlParser({
        url: s(x, 'url'),
      }),
    note: 'Standards-compliant WHATWG/RFC 3986 URL parsing executed entirely in your browser. Extracts protocol, host, explicit/default port, pathname, search parameters (preserving duplicate parameter keys), and fragment identifier. User credentials presence is detected without exposing passwords. No network requests are made.',
  },
  'print-bleed-calculator': {
    fields: [
      { key: 'finishedWidth', label: 'Finished trim width', defaultValue: 210, min: 0, step: 0.1, help: 'Width of final cut document' },
      { key: 'finishedHeight', label: 'Finished trim height', defaultValue: 297, min: 0, step: 0.1, help: 'Height of final cut document' },
      { key: 'bleedPerEdge', label: 'Bleed allowance per edge', defaultValue: 3, min: 0, step: 0.1, help: 'Standard commercial bleed (typically 3mm or 0.125 in)' },
      {
        key: 'unit',
        label: 'Measurement unit',
        defaultValue: 'mm',
        type: 'select',
        options: [
          { value: 'mm', label: 'Millimeters (mm)' },
          { value: 'cm', label: 'Centimeters (cm)' },
          { value: 'in', label: 'Inches (in)' },
        ],
      },
    ],
    results: [
      { key: 'documentWidth', label: 'Document width with bleed', format: 'number' },
      { key: 'documentHeight', label: 'Document height with bleed', format: 'number' },
      { key: 'totalAddedWidth', label: 'Total added width', format: 'number' },
      { key: 'totalAddedHeight', label: 'Total added height', format: 'number' },
      { key: 'finishedArea', label: 'Finished trimmed area', format: 'number' },
      { key: 'bleedInclusiveArea', label: 'Bleed-inclusive total area', format: 'number' },
      { key: 'addedBleedArea', label: 'Added bleed area', format: 'number' },
      { key: 'dimensionsSummary', label: 'Dimensions summary', format: 'text' },
    ],
    calculate: (x) =>
      calculatePrintBleed({
        finishedWidth: v(x, 'finishedWidth'),
        finishedHeight: v(x, 'finishedHeight'),
        bleedPerEdge: v(x, 'bleedPerEdge'),
        unit: s(x, 'unit', 'mm'),
      }),
    note: 'Calculates total document dimensions after adding print bleed around finished trim: Document Width = Finished Width + 2 × Bleed, Document Height = Finished Height + 2 × Bleed. Bleed ensures borderless artwork avoids white margins when cut on mechanical guillotine shears.',
  },
  'cdr-print-readiness-checker': {
    fields: [
      {
        key: 'documentSize',
        label: 'Document dimensions',
        defaultValue: 'confirmed',
        type: 'select',
        options: [
          { value: 'confirmed', label: 'Confirmed (Trim size matches exact ordering specs)' },
          { value: 'review', label: 'Requires Review (Dimensions unverified or variable)' },
          { value: 'missing', label: 'Missing / Inconsistent with printer specification' },
        ],
      },
      {
        key: 'bleed',
        label: 'Bleed allowance',
        defaultValue: 'confirmed',
        type: 'select',
        options: [
          { value: 'confirmed', label: 'Confirmed (3mm / 0.125 in bleed added to artwork)' },
          { value: 'review', label: 'Requires Review (Bleed uncertain or partial)' },
          { value: 'missing', label: 'Missing (Artwork ends strictly at trim line)' },
        ],
      },
      {
        key: 'colorMode',
        label: 'Color palette & separations',
        defaultValue: 'confirmed',
        type: 'select',
        options: [
          { value: 'confirmed', label: 'Confirmed (Pure CMYK / verified spot inks)' },
          { value: 'review', label: 'Requires Review (Contains unseparated RGB elements)' },
          { value: 'missing', label: 'Missing (Document color palette is RGB)' },
        ],
      },
      {
        key: 'fonts',
        label: 'Fonts & typography',
        defaultValue: 'confirmed',
        type: 'select',
        options: [
          { value: 'confirmed', label: 'Confirmed (All text converted to curves / Ctrl+Q)' },
          { value: 'review', label: 'Requires Review (Live fonts present in artwork)' },
          { value: 'missing', label: 'Missing (Unconverted live fonts; missing font risk)' },
        ],
      },
      {
        key: 'imageResolution',
        label: 'Bitmap image resolution',
        defaultValue: 'confirmed',
        type: 'select',
        options: [
          { value: 'confirmed', label: 'Confirmed (All raster images ≥ 300 DPI at placement size)' },
          { value: 'review', label: 'Requires Review (Some images 150–299 DPI)' },
          { value: 'missing', label: 'Missing (Low-resolution web images < 150 DPI)' },
        ],
      },
      {
        key: 'transparency',
        label: 'Transparency & drop shadows',
        defaultValue: 'confirmed',
        type: 'select',
        options: [
          { value: 'confirmed', label: 'Confirmed (Lens/shadow effects flattened or tested)' },
          { value: 'review', label: 'Requires Review (Live complex transparency present)' },
          { value: 'missing', label: 'Missing (Unflattened transparency causing RIP artifacts)' },
        ],
      },
      {
        key: 'overprint',
        label: 'Black & white overprint',
        defaultValue: 'confirmed',
        type: 'select',
        options: [
          { value: 'confirmed', label: 'Confirmed (100% K black overprints; white does NOT)' },
          { value: 'review', label: 'Requires Review (Overprint settings unverified)' },
          { value: 'missing', label: 'Missing (Accidental white overprint detected)' },
        ],
      },
      {
        key: 'exportFormat',
        label: 'Export / prepress preparation',
        defaultValue: 'confirmed',
        type: 'select',
        options: [
          { value: 'confirmed', label: 'Confirmed (Exported as PDF/X-1a or PDF/X-4)' },
          { value: 'review', label: 'Requires Review (Exported as generic PDF or native CDR)' },
          { value: 'missing', label: 'Missing (Output format unverified)' },
        ],
      },
    ],
    results: [
      { key: 'readinessRating', label: 'Preflight readiness', format: 'text' },
      { key: 'score', label: 'Readiness score', format: 'number' },
      { key: 'passedCount', label: 'Passed criteria', format: 'number' },
      { key: 'reviewCount', label: 'Items needing review', format: 'number' },
      { key: 'failedCount', label: 'Critical / missing items', format: 'number' },
      { key: 'summaryText', label: 'Assessment summary', format: 'text' },
    ],
    calculate: (x) =>
      calculateCdrPrintReadiness({
        documentSize: s(x, 'documentSize'),
        bleed: s(x, 'bleed'),
        colorMode: s(x, 'colorMode'),
        fonts: s(x, 'fonts'),
        imageResolution: s(x, 'imageResolution'),
        transparency: s(x, 'transparency'),
        overprint: s(x, 'overprint'),
        exportFormat: s(x, 'exportFormat'),
      }),
    note: 'Guided preflight checklist for CorelDRAW files based on user-verified preparation conditions. Browser inspection cannot reliably decode proprietary CorelDRAW binary document trees; this tool ensures critical print requirements (bleed, CMYK, curves, DPI, overprint) are systematically reviewed before sending files to a commercial printer.',
  },
};

const inputClass = 'mt-2 w-full min-w-0 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';

function display(value: number | string | null | boolean | undefined, format: Format) {
  if (value === null || value === undefined || typeof value === 'boolean') return 'Not applicable';
  if (format === 'text') return String(value);
  if (typeof value !== 'number' || !Number.isFinite(value)) return 'Not applicable';
  if (format === 'currency') return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value);
  if (format === 'percent') return `${value.toLocaleString(undefined, { maximumFractionDigits: 3 })}%`;
  if (format === 'months') return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })} months`;
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default function BusinessCalculatorTool({ slug }: { slug: string }) {
  const config = configs[slug];
  if (!config) throw new Error(`Unknown business calculator: ${slug}`);
  const defaults = useMemo(() => Object.fromEntries(config.fields.map((item) => [item.key, item.defaultValue])) as ValueMap, [config]);
  const [values, setValues] = useState<ValueMap>(defaults);
  const [scenarioLabel, setScenarioLabel] = useState('Custom model or provider');
  const result = useMemo(() => config.calculate(values), [config, values]);
  const resultRows = config.results.map((item) => [item.label, display(result[item.key], item.format)] as const);
  const summary = `${slug === 'brrrr-calculator' ? 'BRRRR estimate' : 'Estimated results'}\n${resultRows.map(([label, value]) => `${label}: ${value}`).join('\n')}`;
  const actions = (toolUx[slug]?.resultActions ?? []).reduce<ResultAction[]>((items, kind) => {
    if (kind === 'copy-summary') items.push({ kind: 'copy', label: 'Copy summary', getContent: () => summary });
    if (kind === 'download-csv') items.push({ kind: 'download', label: 'Download CSV', filename: `${slug}-results.csv`, mimeType: 'text/csv;charset=utf-8', getContent: () => rowsToCsv([['Result', 'Value'], ...resultRows]) });
    if (kind === 'print') items.push({ kind: 'print', label: 'Print / Save PDF' });
    return items;
  }, []);
  return <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,.8fr)]">
    <section className="min-w-0 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7">
      <div className="flex items-center gap-3"><Calculator className="size-6 text-indigo-600"/><h2 className="text-xl font-bold">Planning inputs</h2></div>
      {slug === 'llm-api-cost-calculator' && <label className="mt-6 block text-sm font-semibold">Model or provider label<input className={inputClass} type="text" value={scenarioLabel} onChange={(event) => setScenarioLabel(event.target.value)} /></label>}
      <div className="mt-6 grid min-w-0 gap-4 sm:grid-cols-2">
        {config.fields.map((item) => (
          <label key={item.key} className={`min-w-0 text-sm font-semibold ${item.type === 'textarea' ? 'sm:col-span-2' : ''}`}>
            {item.label}
            {item.type === 'select' ? (
              <select
                className={inputClass}
                value={s(values, item.key, String(item.defaultValue))}
                onChange={(event) => setValues((current) => ({ ...current, [item.key]: event.target.value }))}
              >
                {item.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : item.type === 'textarea' ? (
              <textarea
                className={`${inputClass} font-mono`}
                rows={item.rows ?? 4}
                placeholder={item.placeholder}
                value={s(values, item.key, String(item.defaultValue))}
                onChange={(event) => setValues((current) => ({ ...current, [item.key]: event.target.value }))}
              />
            ) : item.type === 'text' ? (
              <input
                className={`${inputClass} font-mono`}
                type="text"
                placeholder={item.placeholder}
                value={s(values, item.key, String(item.defaultValue))}
                onChange={(event) => setValues((current) => ({ ...current, [item.key]: event.target.value }))}
              />
            ) : (
              <input
                className={inputClass}
                type="number"
                inputMode="decimal"
                min={item.min}
                max={item.max}
                step={item.step ?? 'any'}
                value={values[item.key] ?? ''}
                onChange={(event) => setValues((current) => ({ ...current, [item.key]: event.target.value === '' ? '' : Number(event.target.value) }))}
              />
            )}
            {item.help && <span className="mt-1 block text-xs font-normal leading-5 text-[var(--muted-foreground)]">{item.help}</span>}
          </label>
        ))}
      </div>
      <button type="button" className="mt-6 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold hover:bg-[var(--muted)]" onClick={() => { setValues(defaults); setScenarioLabel('Custom model or provider'); }}>Reset example</button>
    </section>
    <aside className="min-w-0 rounded-3xl border border-indigo-500/20 bg-indigo-500/5 p-5 sm:p-7">
      <h2 className="break-words text-xl font-bold">{slug === 'llm-api-cost-calculator' ? `${scenarioLabel || 'Custom scenario'} estimate` : 'Estimated results'}</h2>
      <dl className="mt-5 grid gap-3">{config.results.map((item) => <div key={item.key} className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"><dt className="text-sm text-[var(--muted-foreground)]">{item.label}</dt><dd className="mt-1 break-words text-xl font-black whitespace-pre-wrap">{display(result[item.key], item.format)}</dd></div>)}</dl>
      <ResultActions actions={actions} className="mt-5" />
      <div className="mt-5 flex gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-6"><Info className="mt-0.5 size-5 shrink-0"/><p>{config.note}</p></div>
    </aside>
  </div>;
}
