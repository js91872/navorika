export interface AmortizationRow {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  years: number
): AmortizationRow[] {
  const months = years * 12;

  const monthlyRate = annualRate / 12 / 100;

  const emi =
    (principal *
      monthlyRate *
      Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  let balance = principal;

  const schedule: AmortizationRow[] = [];

  for (let month = 1; month <= months; month++) {
    const interest = balance * monthlyRate;

    const principalPaid = emi - interest;

    balance -= principalPaid;

    schedule.push({
      month,
      emi,
      principal: principalPaid,
      interest,
      balance: Math.max(balance, 0),
    });
  }

  return schedule;
}