export function calculateDrawdown(input: { startValue?: number; currentValue?: number; lossPercent?: number }) {
  const start = Math.max(0, Number.isFinite(input.startValue) ? input.startValue ?? 0 : 0);
  const current = Math.max(0, Number.isFinite(input.currentValue) ? input.currentValue ?? 0 : 0);
  const enteredLoss = Math.min(100, Math.max(0, Number.isFinite(input.lossPercent) ? input.lossPercent ?? 0 : 0));
  const lossRatio = start > 0 ? Math.min(1, Math.max(0, (start - current) / start)) : enteredLoss / 100;
  const effectiveStart = start > 0 ? start : 100;
  const effectiveCurrent = start > 0 ? Math.min(start, current) : effectiveStart * (1 - lossRatio);
  const amountLost = effectiveStart - effectiveCurrent;
  return { startValue: effectiveStart, currentValue: effectiveCurrent, drawdownPercent: lossRatio * 100, amountLost, recoveryGainPercent: effectiveCurrent > 0 ? amountLost / effectiveCurrent * 100 : null, requiredGain: amountLost, targetValue: effectiveStart };
}

export interface Debt { id: string; name: string; balance: number; aprPercent: number; minimumPayment: number }
export interface DebtSimulation { payoffMonths: number | null; totalInterest: number; totalPaid: number; payoffOrder: string[]; error?: string }

export function simulateDebtPayoff(debts: Debt[], extraMonthlyPayment: number, strategy: 'snowball' | 'avalanche', maxMonths = 1200): DebtSimulation {
  const working = debts.map((debt) => ({ ...debt, balance: Math.max(0, debt.balance), aprPercent: Math.max(0, debt.aprPercent), minimumPayment: Math.max(0, debt.minimumPayment) })).filter((debt) => debt.balance > 0);
  if (!working.length) return { payoffMonths: 0, totalInterest: 0, totalPaid: 0, payoffOrder: [] };
  if (working.some((debt) => debt.minimumPayment <= debt.balance * (debt.aprPercent / 100 / 12))) return { payoffMonths: null, totalInterest: 0, totalPaid: 0, payoffOrder: [], error: 'At least one minimum payment does not cover first-month interest.' };
  const baseBudget = working.reduce((sum, debt) => sum + debt.minimumPayment, 0) + Math.max(0, extraMonthlyPayment);
  let totalInterest = 0;
  let totalPaid = 0;
  const payoffOrder: string[] = [];
  for (let month = 1; month <= maxMonths; month += 1) {
    for (const debt of working) {
      if (debt.balance <= 0) continue;
      const interest = debt.balance * debt.aprPercent / 100 / 12;
      debt.balance += interest;
      totalInterest += interest;
    }
    let remainingBudget = baseBudget;
    for (const debt of working) {
      if (debt.balance <= 0) continue;
      const payment = Math.min(debt.balance, debt.minimumPayment);
      debt.balance -= payment;
      remainingBudget -= payment;
      totalPaid += payment;
      if (debt.balance <= 0 && !payoffOrder.includes(debt.name)) payoffOrder.push(debt.name);
    }
    while (remainingBudget > 0.005) {
      const open = working.filter((debt) => debt.balance > 0);
      if (!open.length) break;
      open.sort(strategy === 'snowball' ? (a, b) => a.balance - b.balance || b.aprPercent - a.aprPercent : (a, b) => b.aprPercent - a.aprPercent || a.balance - b.balance);
      const target = open[0];
      const payment = Math.min(target.balance, remainingBudget);
      target.balance -= payment;
      remainingBudget -= payment;
      totalPaid += payment;
      if (target.balance <= 0 && !payoffOrder.includes(target.name)) payoffOrder.push(target.name);
    }
    if (working.every((debt) => debt.balance <= 0.005)) return { payoffMonths: month, totalInterest, totalPaid, payoffOrder };
  }
  return { payoffMonths: null, totalInterest, totalPaid, payoffOrder, error: `The plan did not pay off all debts within ${maxMonths} months.` };
}
