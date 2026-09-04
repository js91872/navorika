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
import ResultActions, { type ResultAction } from '@/components/ui/ResultActions';
import { toolUx } from '@/data/toolUx';
import { rowsToCsv } from '@/lib/resultExport';

type ValueMap = Record<string, number>;
type ResultMap = Record<string, number | null | boolean>;
type Format = 'currency' | 'number' | 'percent' | 'months';
interface Field { key: string; label: string; defaultValue: number; min?: number; max?: number; step?: number; help?: string }
interface Result { key: string; label: string; format: Format }
interface Config { fields: Field[]; results: Result[]; calculate: (values: ValueMap) => ResultMap; note: string }

const v = (values: ValueMap, key: string) => values[key] ?? 0;

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
};

const inputClass = 'mt-2 w-full min-w-0 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';

function display(value: number | null | boolean | undefined, format: Format) {
  if (value === null || value === undefined || typeof value === 'boolean') return 'Not applicable';
  if (!Number.isFinite(value)) return 'Not applicable';
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
        {config.fields.map((item) => <label key={item.key} className="min-w-0 text-sm font-semibold">{item.label}
          <input className={inputClass} type="number" inputMode="decimal" min={item.min} max={item.max} step={item.step ?? 'any'} value={values[item.key]} onChange={(event) => setValues((current) => ({ ...current, [item.key]: Number(event.target.value) }))}/>
          {item.help && <span className="mt-1 block text-xs font-normal leading-5 text-[var(--muted-foreground)]">{item.help}</span>}
        </label>)}
      </div>
      <button type="button" className="mt-6 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold hover:bg-[var(--muted)]" onClick={() => { setValues(defaults); setScenarioLabel('Custom model or provider'); }}>Reset example</button>
    </section>
    <aside className="min-w-0 rounded-3xl border border-indigo-500/20 bg-indigo-500/5 p-5 sm:p-7">
      <h2 className="break-words text-xl font-bold">{slug === 'llm-api-cost-calculator' ? `${scenarioLabel || 'Custom scenario'} estimate` : 'Estimated results'}</h2>
      <dl className="mt-5 grid gap-3">{config.results.map((item) => <div key={item.key} className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"><dt className="text-sm text-[var(--muted-foreground)]">{item.label}</dt><dd className="mt-1 break-words text-xl font-black">{display(result[item.key], item.format)}</dd></div>)}</dl>
      <ResultActions actions={actions} className="mt-5" />
      <div className="mt-5 flex gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-6"><Info className="mt-0.5 size-5 shrink-0"/><p>{config.note}</p></div>
    </aside>
  </div>;
}
