export interface AiTokenInputs {
  inputTokensPerRequest: number;
  outputTokensPerRequest: number;
  cachedInputTokensPerRequest: number;
  requestsPerDay: number;
  daysPerMonth: number;
}

const finiteNonNegative = (value: number) =>
  Number.isFinite(value) ? Math.max(0, value) : 0;

export function calculateAiTokens(input: AiTokenInputs) {
  const inputPerRequest = finiteNonNegative(input.inputTokensPerRequest);
  const outputPerRequest = finiteNonNegative(input.outputTokensPerRequest);
  const cachedPerRequest = Math.min(inputPerRequest, finiteNonNegative(input.cachedInputTokensPerRequest));
  const requestsPerDay = finiteNonNegative(input.requestsPerDay);
  const daysPerMonth = finiteNonNegative(input.daysPerMonth);
  const monthlyRequests = requestsPerDay * daysPerMonth;
  const dailyInputTokens = inputPerRequest * requestsPerDay;
  const dailyOutputTokens = outputPerRequest * requestsPerDay;
  const inputTokensMonth = inputPerRequest * monthlyRequests;
  const outputTokensMonth = outputPerRequest * monthlyRequests;
  return {
    tokensPerRequest: inputPerRequest + outputPerRequest,
    cachedTokensMonth: cachedPerRequest * monthlyRequests,
    dailyInputTokens,
    dailyOutputTokens,
    dailyTotalTokens: dailyInputTokens + dailyOutputTokens,
    inputTokensMonth,
    outputTokensMonth,
    totalTokensMonth: inputTokensMonth + outputTokensMonth,
    annualTokens: (inputTokensMonth + outputTokensMonth) * 12,
  };
}

export interface LlmCostInputs extends AiTokenInputs {
  inputPricePerMillion: number;
  outputPricePerMillion: number;
  cachedInputPricePerMillion: number;
}

export function calculateLlmCost(input: LlmCostInputs) {
  const tokens = calculateAiTokens(input);
  const cached = tokens.cachedTokensMonth;
  const uncached = Math.max(0, tokens.inputTokensMonth - cached);
  const inputCost = (uncached / 1_000_000) * finiteNonNegative(input.inputPricePerMillion)
    + (cached / 1_000_000) * finiteNonNegative(input.cachedInputPricePerMillion);
  const outputCost = (tokens.outputTokensMonth / 1_000_000) * finiteNonNegative(input.outputPricePerMillion);
  const monthlyCost = inputCost + outputCost;
  const monthlyRequests = finiteNonNegative(input.requestsPerDay) * finiteNonNegative(input.daysPerMonth);
  return { ...tokens, inputCost, outputCost, monthlyCost, annualCost: monthlyCost * 12, costPerRequest: monthlyRequests ? monthlyCost / monthlyRequests : 0 };
}

export function calculateGpuCost(input: { gpuCount: number; hourlyRate: number; hoursPerRun: number; runsPerDay: number; utilizationPercent: number; daysPerMonth: number }) {
  const fleetHourlyCost = finiteNonNegative(input.gpuCount) * finiteNonNegative(input.hourlyRate);
  const costPerRun = fleetHourlyCost * finiteNonNegative(input.hoursPerRun);
  const scheduledGpuHours = finiteNonNegative(input.gpuCount) * finiteNonNegative(input.hoursPerRun) * finiteNonNegative(input.runsPerDay);
  const utilization = Math.min(100, finiteNonNegative(input.utilizationPercent)) / 100;
  const dailyCost = costPerRun * finiteNonNegative(input.runsPerDay) * utilization;
  const monthlyCost = dailyCost * finiteNonNegative(input.daysPerMonth);
  return { fleetHourlyCost, costPerRun, scheduledGpuHours, utilizedGpuHours: scheduledGpuHours * utilization, dailyCost, monthlyCost, annualCost: monthlyCost * 12 };
}

export function calculateCloudHostingCost(input: { instances: number; hourlyCost: number; runtimeHoursMonth: number; storageGb: number; storageRate: number; bandwidthGb: number; bandwidthRate: number; additionalCost: number }) {
  const computeCost = finiteNonNegative(input.instances) * finiteNonNegative(input.hourlyCost) * finiteNonNegative(input.runtimeHoursMonth);
  const storageCost = finiteNonNegative(input.storageGb) * finiteNonNegative(input.storageRate);
  const bandwidthCost = finiteNonNegative(input.bandwidthGb) * finiteNonNegative(input.bandwidthRate);
  const additionalCost = finiteNonNegative(input.additionalCost);
  const monthlyCost = computeCost + storageCost + bandwidthCost + additionalCost;
  const percent = (value: number) => monthlyCost ? (value / monthlyCost) * 100 : 0;
  return { computeCost, storageCost, bandwidthCost, additionalCost, monthlyCost, annualCost: monthlyCost * 12, percentages: { compute: percent(computeCost), storage: percent(storageCost), bandwidth: percent(bandwidthCost), additional: percent(additionalCost) } };
}

export function calculateCdnCost(input: { bandwidthGb: number; egressPricePerGb: number; requests: number; requestPricePerMillion: number; cacheHitPercent: number; originEgressPricePerGb: number }) {
  const bandwidthGb = finiteNonNegative(input.bandwidthGb);
  const cacheHitRatio = Math.min(100, finiteNonNegative(input.cacheHitPercent)) / 100;
  const originTrafficGb = Math.max(0, bandwidthGb * (1 - cacheHitRatio));
  const bandwidthCost = bandwidthGb * finiteNonNegative(input.egressPricePerGb);
  const requestCost = (finiteNonNegative(input.requests) / 1_000_000) * finiteNonNegative(input.requestPricePerMillion);
  const originCost = originTrafficGb * finiteNonNegative(input.originEgressPricePerGb);
  const monthlyCost = bandwidthCost + requestCost + originCost;
  return { bandwidthCost, requestCost, originTrafficGb, originCost, monthlyCost, annualCost: monthlyCost * 12 };
}
