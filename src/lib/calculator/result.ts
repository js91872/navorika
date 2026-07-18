import { CalculatorResult } from "./types";

export function createResult(
  values: Partial<CalculatorResult>
): CalculatorResult {
  return {
    ...values,
  };
}