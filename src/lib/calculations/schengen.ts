export interface SchengenTrip {
  id?: string;
  entryDate: string;
  exitDate: string;
  label?: string;
}

export interface SchengenInput {
  referenceDate: string;
  trips: SchengenTrip[];
}

export interface SchengenStayResult {
  [key: string]: number | string | boolean | null;
  daysUsed: number;
  daysRemaining: number;
  overstayDays: number;
  windowStart: string;
  referenceDate: string;
  compliant: boolean;
}

export function parseIsoDateToUtcDays(str: string): number | null {
  if (!str || typeof str !== 'string') return null;
  const match = str.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const y = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const d = parseInt(match[3], 10);
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
}

export function utcDaysToIsoDate(utcDays: number): string {
  const d = new Date(utcDays * 86400000);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function calculateSchengenStay(input: SchengenInput): SchengenStayResult {
  let refDays = parseIsoDateToUtcDays(input.referenceDate);
  if (refDays === null) {
    const now = new Date();
    refDays = Math.floor(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 86400000);
  }

  const windowStartDays = refDays - 179;
  const windowStart = utcDaysToIsoDate(windowStartDays);
  const normalizedReferenceDate = utcDaysToIsoDate(refDays);

  const stayDays = new Set<number>();

  for (const trip of input.trips || []) {
    const entry = parseIsoDateToUtcDays(trip.entryDate);
    const exit = parseIsoDateToUtcDays(trip.exitDate);
    if (entry === null || exit === null) continue;
    const start = Math.min(entry, exit);
    const end = Math.max(entry, exit);

    const overlapStart = Math.max(windowStartDays, start);
    const overlapEnd = Math.min(refDays, end);

    for (let day = overlapStart; day <= overlapEnd; day++) {
      stayDays.add(day);
    }
  }

  const daysUsed = stayDays.size;
  const daysRemaining = Math.max(0, 90 - daysUsed);
  const overstayDays = Math.max(0, daysUsed - 90);
  const compliant = daysUsed <= 90;

  return {
    daysUsed,
    daysRemaining,
    overstayDays,
    windowStart,
    referenceDate: normalizedReferenceDate,
    compliant,
  };
}
