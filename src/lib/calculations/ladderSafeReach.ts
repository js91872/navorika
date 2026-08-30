export interface LadderInput {
  ladderLengthFeet: number;
  userHeightFeet: number;
  ladderType: 'extension' | 'step';
}

export interface LadderResult {
  baseDistanceFeet: number;
  verticalHeightFeet: number;
  ladderAngleDegrees: number;
  approximateReachFeet: number;
  recommendedRoofExtensionFeet: number;
}

function positive(value: number, name: string): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${name} must be greater than zero.`);
  }
  return value;
}

export function calculateLadderSafeReach(
  input: LadderInput,
): LadderResult {
  const ladderLength = positive(input.ladderLengthFeet, 'Ladder length');
  const userHeight = positive(input.userHeightFeet, 'User height');

  if (input.ladderType === 'step') {
    /*
     * Step-ladder usable standing height varies by manufacturer and ladder
     * rating. This is intentionally a conservative planning approximation.
     */
    const approximateStandingHeight = Math.max(0, ladderLength - 4);

    return {
      baseDistanceFeet: 0,
      verticalHeightFeet: ladderLength,
      ladderAngleDegrees: 90,
      approximateReachFeet: approximateStandingHeight + userHeight,
      recommendedRoofExtensionFeet: 0,
    };
  }

  /*
   * OSHA 29 CFR 1926.1053(b)(5)(i): horizontal distance is approximately
   * one-quarter of the ladder's working length (the hypotenuse here).
   */
  const baseDistance = ladderLength / 4;
  const verticalHeight = Math.sqrt(ladderLength ** 2 - baseDistance ** 2);

  const ladderAngle =
    Math.atan2(verticalHeight, baseDistance) * (180 / Math.PI);

  /*
   * Approximate reach only. Safe standing level depends on ladder type,
   * manufacturer labeling and the task being performed.
   */
  const approximateReach =
    Math.max(0, verticalHeight - 3) + userHeight;

  return {
    baseDistanceFeet: baseDistance,
    verticalHeightFeet: verticalHeight,
    ladderAngleDegrees: ladderAngle,
    approximateReachFeet: approximateReach,
    recommendedRoofExtensionFeet: 3,
  };
}
