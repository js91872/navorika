export type EpochUnit = 'auto' | 'seconds' | 'milliseconds';

export interface EpochToDateResult {
  valid: boolean;
  error?: string;
  detectedUnit: 'seconds' | 'milliseconds';
  epochSeconds: number;
  epochMilliseconds: number;
  utcIso: string;
  utcHuman: string;
  localHuman: string;
  rfc2822: string;
  relative: string;
  dayOfWeek: string;
  dayOfYear: number;
  isLeapYear: boolean;
}

export interface DateToEpochParams {
  dateString: string; // YYYY-MM-DD
  timeString?: string; // HH:mm or HH:mm:ss
  timezone: 'local' | 'utc';
}

export interface DateToEpochResult {
  valid: boolean;
  error?: string;
  epochSeconds: number;
  epochMilliseconds: number;
  utcIso: string;
  localHuman: string;
  utcHuman: string;
}

function getDayOfYear(date: Date): number {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function checkLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function formatRelativeTime(targetMs: number, nowMs: number = Date.now()): string {
  const diffSec = Math.round((targetMs - nowMs) / 1000);
  const isPast = diffSec < 0;
  const absSec = Math.abs(diffSec);

  if (absSec < 5) return 'just now';
  if (absSec < 60) return `${absSec} second${absSec === 1 ? '' : 's'} ${isPast ? 'ago' : 'from now'}`;

  const minutes = Math.floor(absSec / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ${isPast ? 'ago' : 'from now'}`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ${isPast ? 'ago' : 'from now'}`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ${isPast ? 'ago' : 'from now'}`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ${isPast ? 'ago' : 'from now'}`;

  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? '' : 's'} ${isPast ? 'ago' : 'from now'}`;
}

export function epochToDate(
  rawInput: string | number,
  unit: EpochUnit = 'auto'
): EpochToDateResult {
  const cleaned = String(rawInput).trim();
  if (!cleaned) {
    return {
      valid: false,
      error: 'Enter a timestamp to convert',
      detectedUnit: 'seconds',
      epochSeconds: 0,
      epochMilliseconds: 0,
      utcIso: '',
      utcHuman: '',
      localHuman: '',
      rfc2822: '',
      relative: '',
      dayOfWeek: '',
      dayOfYear: 0,
      isLeapYear: false,
    };
  }

  // Parse numeric
  const numeric = Number(cleaned);
  if (isNaN(numeric) || !isFinite(numeric)) {
    return {
      valid: false,
      error: 'Invalid epoch number. Only numbers are supported.',
      detectedUnit: 'seconds',
      epochSeconds: 0,
      epochMilliseconds: 0,
      utcIso: '',
      utcHuman: '',
      localHuman: '',
      rfc2822: '',
      relative: '',
      dayOfWeek: '',
      dayOfYear: 0,
      isLeapYear: false,
    };
  }

  // Determine unit
  let resolvedUnit: 'seconds' | 'milliseconds' = 'seconds';
  if (unit === 'milliseconds') {
    resolvedUnit = 'milliseconds';
  } else if (unit === 'seconds') {
    resolvedUnit = 'seconds';
  } else {
    // Auto-detect heuristic:
    // 10-digit number (e.g. 1725900000) is seconds (between 1973 and 2286)
    // 13-digit number (e.g. 1725900000000) is milliseconds
    const abs = Math.abs(numeric);
    if (abs >= 1e11 || cleaned.replace('-', '').length >= 12) {
      resolvedUnit = 'milliseconds';
    } else {
      resolvedUnit = 'seconds';
    }
  }

  let ms = resolvedUnit === 'seconds' ? numeric * 1000 : numeric;
  // Guard extreme dates
  if (ms < -8640000000000000 || ms > 8640000000000000) {
    return {
      valid: false,
      error: 'Timestamp is outside the JavaScript Date range (-100,000,000 days to +100,000,000 days).',
      detectedUnit: resolvedUnit,
      epochSeconds: 0,
      epochMilliseconds: 0,
      utcIso: '',
      utcHuman: '',
      localHuman: '',
      rfc2822: '',
      relative: '',
      dayOfWeek: '',
      dayOfYear: 0,
      isLeapYear: false,
    };
  }

  const date = new Date(ms);
  if (isNaN(date.getTime())) {
    return {
      valid: false,
      error: 'Invalid Date could not be constructed from timestamp.',
      detectedUnit: resolvedUnit,
      epochSeconds: 0,
      epochMilliseconds: 0,
      utcIso: '',
      utcHuman: '',
      localHuman: '',
      rfc2822: '',
      relative: '',
      dayOfWeek: '',
      dayOfYear: 0,
      isLeapYear: false,
    };
  }

  const epochSeconds = Math.floor(ms / 1000);
  const epochMilliseconds = Math.round(ms);
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return {
    valid: true,
    detectedUnit: resolvedUnit,
    epochSeconds,
    epochMilliseconds,
    utcIso: date.toISOString(),
    utcHuman: date.toUTCString(),
    localHuman: date.toLocaleString(undefined, {
      dateStyle: 'full',
      timeStyle: 'long',
    }),
    rfc2822: date.toUTCString(),
    relative: formatRelativeTime(ms),
    dayOfWeek: daysOfWeek[date.getUTCDay()],
    dayOfYear: getDayOfYear(date),
    isLeapYear: checkLeapYear(date.getUTCFullYear()),
  };
}

export function dateToEpoch(params: DateToEpochParams): DateToEpochResult {
  const { dateString, timeString = '00:00:00', timezone } = params;

  if (!dateString || !dateString.trim()) {
    return {
      valid: false,
      error: 'Date is required (YYYY-MM-DD).',
      epochSeconds: 0,
      epochMilliseconds: 0,
      utcIso: '',
      localHuman: '',
      utcHuman: '',
    };
  }

  const cleanDate = dateString.trim();
  const cleanTime = (timeString || '00:00:00').trim();

  // Parse parts
  const dateParts = cleanDate.split('-').map((p) => parseInt(p, 10));
  if (dateParts.length !== 3 || dateParts.some(isNaN)) {
    return {
      valid: false,
      error: 'Invalid date format. Expected YYYY-MM-DD.',
      epochSeconds: 0,
      epochMilliseconds: 0,
      utcIso: '',
      localHuman: '',
      utcHuman: '',
    };
  }

  const [year, month, day] = dateParts;
  const timeParts = cleanTime.split(':').map((p) => parseInt(p, 10));
  const hours = timeParts[0] || 0;
  const minutes = timeParts[1] || 0;
  const seconds = timeParts[2] || 0;

  if (month < 1 || month > 12 || day < 1 || day > 31 || hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
    return {
      valid: false,
      error: 'Date or time component is out of valid calendar range.',
      epochSeconds: 0,
      epochMilliseconds: 0,
      utcIso: '',
      localHuman: '',
      utcHuman: '',
    };
  }

  let date: Date;
  if (timezone === 'utc') {
    date = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
  } else {
    date = new Date(year, month - 1, day, hours, minutes, seconds);
  }

  if (isNaN(date.getTime())) {
    return {
      valid: false,
      error: 'Could not construct a valid timestamp from the provided date/time.',
      epochSeconds: 0,
      epochMilliseconds: 0,
      utcIso: '',
      localHuman: '',
      utcHuman: '',
    };
  }

  const ms = date.getTime();
  const epochSeconds = Math.floor(ms / 1000);

  return {
    valid: true,
    epochSeconds,
    epochMilliseconds: ms,
    utcIso: date.toISOString(),
    localHuman: date.toLocaleString(undefined, {
      dateStyle: 'full',
      timeStyle: 'long',
    }),
    utcHuman: date.toUTCString(),
  };
}

export function getCurrentEpoch(): {
  seconds: number;
  milliseconds: number;
  iso: string;
  local: string;
} {
  const now = new Date();
  const ms = now.getTime();
  return {
    seconds: Math.floor(ms / 1000),
    milliseconds: ms,
    iso: now.toISOString(),
    local: now.toLocaleString(),
  };
}
