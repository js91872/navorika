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

function safe(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function calculateLadderSafeReach(
  input: LadderInput,
): LadderResult {
  const ladderLength = safe(input.ladderLengthFeet);
  const userHeight = safe(input.userHeightFeet);

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
   * 4:1 setup rule:
   * approximately one foot of horizontal base distance for every four feet
   * of vertical working height.
   *
   * Solving:
   * ladder² = height² + (height/4)²
   */
  const verticalHeight =
    ladderLength > 0
      ? ladderLength / Math.sqrt(1 + 1 / 16)
      : 0;

  const baseDistance = verticalHeight / 4;

  const ladderAngle =
    ladderLength > 0
      ? Math.atan2(verticalHeight, baseDistance) * (180 / Math.PI)
      : 0;

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
