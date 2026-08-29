const n = (value: number) => Number.isFinite(value) ? Math.max(0, value) : 0;
const rate = (value: number) => Math.min(100, n(value)) / 100;

export function calculateStartupRunway(input: { cash: number; monthlyRevenue: number; monthlyExpenses: number; revenueGrowthPercent?: number; expenseGrowthPercent?: number; projectionMonths?: number }) {
  const cash = n(input.cash);
  const revenue = n(input.monthlyRevenue);
  const expenses = n(input.monthlyExpenses);
  const netBurn = expenses - revenue;
  const simpleRunwayMonths = netBurn > 0 ? cash / netBurn : null;
  let balance = cash;
  let projectedRevenue = revenue;
  let projectedExpenses = expenses;
  let projectedRunwayMonths: number | null = null;
  const limit = Math.min(600, Math.max(1, Math.floor(n(input.projectionMonths ?? 120))));
  for (let month = 1; month <= limit; month += 1) {
    balance += projectedRevenue - projectedExpenses;
    if (balance <= 0) { projectedRunwayMonths = month; break; }
    projectedRevenue *= 1 + rate(input.revenueGrowthPercent ?? 0);
    projectedExpenses *= 1 + rate(input.expenseGrowthPercent ?? 0);
  }
  return { netBurn, simpleRunwayMonths, projectedRunwayMonths, profitable: netBurn <= 0, endingCash: Math.max(0, balance) };
}

export function calculateBurnRate(input: { startingCash: number; endingCash: number; periodMonths: number; revenue: number; expenses: number }) {
  const startingCash = n(input.startingCash);
  const endingCash = n(input.endingCash);
  const months = Math.max(1, n(input.periodMonths));
  const grossBurn = n(input.expenses) / months;
  const netBurnFromOperations = (n(input.expenses) - n(input.revenue)) / months;
  const cashBurn = (startingCash - endingCash) / months;
  return { grossBurn, netBurn: netBurnFromOperations, cashBurn, runwayMonths: cashBurn > 0 ? endingCash / cashBurn : null };
}

export function calculateLtvCac(input: { arpu: number; grossMarginPercent: number; monthlyChurnPercent: number; cac: number }) {
  const grossProfitPerMonth = n(input.arpu) * rate(input.grossMarginPercent);
  const churn = rate(input.monthlyChurnPercent);
  const ltv = churn > 0 ? grossProfitPerMonth / churn : null;
  const cac = n(input.cac);
  return { grossProfitPerMonth, ltv, ratio: ltv !== null && cac > 0 ? ltv / cac : null, paybackMonths: grossProfitPerMonth > 0 ? cac / grossProfitPerMonth : null };
}

export function calculateCacPayback(input: { cac: number; monthlyRevenuePerCustomer: number; grossMarginPercent: number }) {
  const monthlyGrossProfit = n(input.monthlyRevenuePerCustomer) * rate(input.grossMarginPercent);
  return { monthlyGrossProfit, paybackMonths: monthlyGrossProfit > 0 ? n(input.cac) / monthlyGrossProfit : null };
}

export function calculateChurnImpact(input: { startingCustomers: number; arpu: number; monthlyChurnPercent: number; newCustomersPerMonth: number; months: number }) {
  let customers = Math.floor(n(input.startingCustomers));
  const arpu = n(input.arpu);
  const churn = rate(input.monthlyChurnPercent);
  const newCustomers = Math.floor(n(input.newCustomersPerMonth));
  const months = Math.min(120, Math.max(1, Math.floor(n(input.months))));
  let customersLost = 0;
  let cumulativeRevenueLost = 0;
  for (let month = 0; month < months; month += 1) {
    const lost = customers * churn;
    customersLost += lost;
    cumulativeRevenueLost += lost * arpu;
    customers = Math.max(0, customers - lost + newCustomers);
  }
  return { customersLost, cumulativeRevenueLost, remainingCustomers: customers, endingMrr: customers * arpu, netCustomerChange: customers - Math.floor(n(input.startingCustomers)) };
}

export function calculateRuleOf40(growthPercent: number, profitabilityPercent: number) {
  const growth = Number.isFinite(growthPercent) ? growthPercent : 0;
  const profitability = Number.isFinite(profitabilityPercent) ? profitabilityPercent : 0;
  const score = growth + profitability;
  return { score, difference: score - 40 };
}

export function calculateNrr(input: { startingRevenue: number; expansionRevenue: number; contractionRevenue: number; churnedRevenue: number }) {
  const start = n(input.startingRevenue);
  const expansion = n(input.expansionRevenue);
  const losses = n(input.contractionRevenue) + n(input.churnedRevenue);
  const retainedRevenue = Math.max(0, start + expansion - losses);
  return { retainedRevenue, expansion, losses, netChange: retainedRevenue - start, nrrPercent: start > 0 ? (retainedRevenue / start) * 100 : null };
}
