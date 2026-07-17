export interface SWPResult {
  investedAmount: number;
  totalWithdrawal: number;
  finalCorpus: number;
}

export function calculateSWP(
  corpus: number,
  annualRate: number,
  yearlyWithdrawal: number,
  years: number
): SWPResult {

  let balance = corpus;

  const monthlyRate = annualRate / 100 / 12;

  const monthlyWithdrawal = yearlyWithdrawal / 12;

  const months = years * 12;

  let withdrawn = 0;

  for (let i = 0; i < months; i++) {

    balance += balance * monthlyRate;

    balance -= monthlyWithdrawal;

    if (balance < 0) {
      balance = 0;
      break;
    }

    withdrawn += monthlyWithdrawal;
  }

  return {
    investedAmount: corpus,
    totalWithdrawal: withdrawn,
    finalCorpus: balance,
  };
}