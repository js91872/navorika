export interface EgressWindowInput {
  clearWidthInches: number;
  clearHeightInches: number;
  sillHeightInches: number;
  gradeFloorOpening: boolean;
}

export interface EgressCriterion {
  id: 'width' | 'height' | 'area' | 'sill';
  label: string;
  passed: boolean;
  actual: string;
  required: string;
}

export interface EgressWindowResult {
  clearAreaSqFt: number;
  requiredAreaSqFt: number;
  passed: boolean;
  criteria: EgressCriterion[];
}

function safe(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function calculateEgressWindow(
  input: EgressWindowInput,
): EgressWindowResult {
  const width = safe(input.clearWidthInches);
  const height = safe(input.clearHeightInches);
  const sill = safe(input.sillHeightInches);

  const clearAreaSqFt = (width * height) / 144;

  const requiredAreaSqFt =
    input.gradeFloorOpening ? 5 : 5.7;

  const criteria: EgressCriterion[] = [
    {
      id: 'width',
      label: 'Net clear opening width',
      passed: width >= 20,
      actual: `${width.toFixed(1)} in`,
      required: 'At least 20 in',
    },
    {
      id: 'height',
      label: 'Net clear opening height',
      passed: height >= 24,
      actual: `${height.toFixed(1)} in`,
      required: 'At least 24 in',
    },
    {
      id: 'area',
      label: 'Net clear opening area',
      passed: clearAreaSqFt >= requiredAreaSqFt,
      actual: `${clearAreaSqFt.toFixed(2)} ft²`,
      required: `At least ${requiredAreaSqFt.toFixed(1)} ft²`,
    },
    {
      id: 'sill',
      label: 'Bottom of clear opening above floor',
      passed: sill <= 44,
      actual: `${sill.toFixed(1)} in`,
      required: 'Not more than 44 in',
    },
  ];

  return {
    clearAreaSqFt,
    requiredAreaSqFt,
    passed: criteria.every((criterion) => criterion.passed),
    criteria,
  };
}
