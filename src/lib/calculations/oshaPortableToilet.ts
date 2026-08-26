export interface OshaPortableToiletResult {
  workers: number;
  toiletFacilities: number;
  toiletSeats: number;
  urinals: number;
  workersPerFixtureSet: number | null;
  regime: 'up-to-20' | '21-to-199' | '200-plus';
  summary: string;
}

function normalizeWorkers(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.max(1, Math.ceil(value));
}

export function calculateOshaPortableToilets(
  employeeCount: number,
): OshaPortableToiletResult {
  const workers = normalizeWorkers(employeeCount);

  /*
   * OSHA 29 CFR 1926.51(c)(1), Table D-1:
   *
   * 20 or less:
   *   Minimum 1 toilet facility.
   *
   * More than 20 and fewer than 200:
   *   1 toilet seat + 1 urinal per 40 workers.
   *
   * 200 or more:
   *   1 toilet seat + 1 urinal per 50 workers.
   *
   * This calculator treats exactly 20 employees under the first row.
   *
   * Portable units vary in fixture configuration, so toiletFacilities for
   * groups above 20 should be interpreted as the minimum number of fixture
   * sets if each portable unit contains one seat and one urinal.
   */

  if (workers <= 20) {
    return {
      workers,
      toiletFacilities: 1,
      toiletSeats: 1,
      urinals: 0,
      workersPerFixtureSet: null,
      regime: 'up-to-20',
      summary:
        'OSHA Table D-1 specifies at least one toilet facility for 20 or fewer employees.',
    };
  }

  if (workers < 200) {
    const sets = Math.ceil(workers / 40);

    return {
      workers,
      toiletFacilities: sets,
      toiletSeats: sets,
      urinals: sets,
      workersPerFixtureSet: 40,
      regime: '21-to-199',
      summary:
        'OSHA Table D-1 specifies one toilet seat and one urinal per 40 workers for this workforce range.',
    };
  }

  const sets = Math.ceil(workers / 50);

  return {
    workers,
    toiletFacilities: sets,
    toiletSeats: sets,
    urinals: sets,
    workersPerFixtureSet: 50,
    regime: '200-plus',
    summary:
      'OSHA Table D-1 specifies one toilet seat and one urinal per 50 workers for workforces of 200 or more.',
  };
}
