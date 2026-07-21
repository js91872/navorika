export interface PercentageResult {
  result: number;
  formula: string;
  steps: string[];
}

export function calculatePercentage(
  mode: string,
  value1: number,
  value2: number,
  value3: number
): PercentageResult {
  let result = 0;
  let formula = "";
  const steps: string[] = [];

  switch (mode) {
    case "find-percentage":
      // What is X% of Y?
      result = (value1 / 100) * value2;
      formula = `${value1}% of ${value2} = ${result}`;
      steps.push(`${value1} ÷ 100 = ${value1 / 100}`);
      steps.push(`${value1 / 100} × ${value2} = ${result}`);
      break;

    case "find-value":
      // X is what % of Y?
      result = (value1 / value2) * 100;
      formula = `${value1} is ${result.toFixed(2)}% of ${value2}`;
      steps.push(`${value1} ÷ ${value2} = ${value1 / value2}`);
      steps.push(`${value1 / value2} × 100 = ${result.toFixed(2)}%`);
      break;

    case "find-change":
      // Percentage change from X to Y
      result = ((value2 - value1) / value1) * 100;
      const sign = result >= 0 ? "increase" : "decrease";
      formula = `${value1} to ${value2} is ${Math.abs(result).toFixed(2)}% ${sign}`;
      steps.push(`${value2} - ${value1} = ${value2 - value1}`);
      steps.push(`${value2 - value1} ÷ ${value1} = ${(value2 - value1) / value1}`);
      steps.push(`${(value2 - value1) / value1} × 100 = ${result.toFixed(2)}%`);
      break;

    case "find-difference":
      // Difference between X and Y as percentage
      result = ((value2 - value1) / ((value1 + value2) / 2)) * 100;
      formula = `Difference between ${value1} and ${value2} is ${Math.abs(result).toFixed(2)}%`;
      steps.push(`${value2} - ${value1} = ${value2 - value1}`);
      steps.push(`(${value1} + ${value2}) ÷ 2 = ${(value1 + value2) / 2}`);
      steps.push(`${value2 - value1} ÷ ${(value1 + value2) / 2} × 100 = ${result.toFixed(2)}%`);
      break;

    default:
      result = 0;
      formula = "Invalid mode";
  }

  return { result, formula, steps };
}
