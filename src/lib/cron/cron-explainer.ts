import cronstrue from 'cronstrue';
import { CronExpressionParser } from 'cron-parser';

export interface CronPreset {
  id: string;
  label: string;
  expression: string;
  description: string;
}

export const CRON_PRESETS: CronPreset[] = [
  { id: 'every-minute', label: 'Every minute', expression: '* * * * *', description: 'Runs every single minute' },
  { id: 'every-5-minutes', label: 'Every 5 minutes', expression: '*/5 * * * *', description: 'Runs every 5 minutes' },
  { id: 'every-hour', label: 'Every hour', expression: '0 * * * *', description: 'Runs at minute 0 of every hour' },
  { id: 'daily-midnight', label: 'Daily at midnight', expression: '0 0 * * *', description: 'Runs every night at 00:00' },
  { id: 'daily-9am', label: 'Daily at 9:00 AM', expression: '0 9 * * *', description: 'Runs every morning at 09:00' },
  { id: 'weekdays-9am', label: 'Every weekday', expression: '0 9 * * 1-5', description: 'Runs Monday through Friday at 09:00' },
  { id: 'weekly-sunday', label: 'Weekly on Sunday', expression: '0 0 * * 0', description: 'Runs every Sunday at midnight' },
  { id: 'monthly-first', label: 'Monthly on 1st', expression: '0 0 1 * *', description: 'Runs on the 1st of every month at midnight' },
];

export interface FieldValidation {
  name: string;
  fieldIndex: number;
  value: string;
  valid: boolean;
  error?: string;
  rangeDescription: string;
}

export interface NextRunItem {
  index: number;
  date: Date;
  iso: string;
  localFormatted: string;
  relative: string;
}

export interface CronAnalysisResult {
  valid: boolean;
  normalized: string;
  error?: string;
  humanDescription: string;
  fields: FieldValidation[];
  nextRuns: NextRunItem[];
  dialectNote?: string;
}

const FIELD_CONFIGS = [
  { name: 'Minute', min: 0, max: 59, allowedChars: /^[\d\*\/\,\-]+$/ },
  { name: 'Hour', min: 0, max: 23, allowedChars: /^[\d\*\/\,\-]+$/ },
  { name: 'Day of Month', min: 1, max: 31, allowedChars: /^[\d\*\/\,\-]+$/ },
  {
    name: 'Month',
    min: 1,
    max: 12,
    allowedChars: /^[\d\*\/\,\-A-Za-z]+$/,
    names: { JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6, JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12 },
  },
  {
    name: 'Day of Week',
    min: 0,
    max: 7, // 0 and 7 are both Sunday in standard cron
    allowedChars: /^[\d\*\/\,\-A-Za-z]+$/,
    names: { SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6 },
  },
];

function validateSingleField(index: number, rawField: string): FieldValidation {
  const config = FIELD_CONFIGS[index];
  const fieldVal = rawField.trim();

  if (!fieldVal) {
    return {
      name: config.name,
      fieldIndex: index,
      value: '',
      valid: false,
      error: `${config.name} field is empty`,
      rangeDescription: `${config.min}–${config.max}`,
    };
  }

  // Asterisk
  if (fieldVal === '*') {
    return {
      name: config.name,
      fieldIndex: index,
      value: fieldVal,
      valid: true,
      rangeDescription: `${config.min}–${config.max}`,
    };
  }

  // Step e.g. */5
  if (fieldVal.startsWith('*/')) {
    const step = parseInt(fieldVal.slice(2), 10);
    if (isNaN(step) || step < 1 || step > config.max) {
      return {
        name: config.name,
        fieldIndex: index,
        value: fieldVal,
        valid: false,
        error: `Invalid step value in ${config.name}. Step must be between 1 and ${config.max}.`,
        rangeDescription: `${config.min}–${config.max}`,
      };
    }
    return {
      name: config.name,
      fieldIndex: index,
      value: fieldVal,
      valid: true,
      rangeDescription: `${config.min}–${config.max}`,
    };
  }

  // Comma-separated list items
  const items = fieldVal.split(',');
  for (const item of items) {
    // Range e.g. 1-5 or 1-5/2
    if (item.includes('-')) {
      const [rangePart, stepPart] = item.split('/');
      const [startStr, endStr] = rangePart.split('-');

      let startNum = parseInt(startStr, 10);
      let endNum = parseInt(endStr, 10);

      if (config.names) {
        const upperStart = startStr.toUpperCase() as keyof typeof config.names;
        const upperEnd = endStr.toUpperCase() as keyof typeof config.names;
        if (config.names[upperStart] !== undefined) startNum = config.names[upperStart];
        if (config.names[upperEnd] !== undefined) endNum = config.names[upperEnd];
      }

      if (isNaN(startNum) || isNaN(endNum) || startNum < config.min || endNum > config.max || startNum > endNum) {
        return {
          name: config.name,
          fieldIndex: index,
          value: fieldVal,
          valid: false,
          error: `Invalid range "${item}" in ${config.name}. Values must be between ${config.min} and ${config.max}.`,
          rangeDescription: `${config.min}–${config.max}`,
        };
      }

      if (stepPart !== undefined) {
        const stepNum = parseInt(stepPart, 10);
        if (isNaN(stepNum) || stepNum < 1) {
          return {
            name: config.name,
            fieldIndex: index,
            value: fieldVal,
            valid: false,
            error: `Invalid range step "${stepPart}" in ${config.name}.`,
            rangeDescription: `${config.min}–${config.max}`,
          };
        }
      }
    } else {
      let valNum = parseInt(item, 10);
      if (config.names) {
        const upper = item.toUpperCase() as keyof typeof config.names;
        if (config.names[upper] !== undefined) valNum = config.names[upper];
      }

      if (isNaN(valNum) || valNum < config.min || valNum > config.max) {
        return {
          name: config.name,
          fieldIndex: index,
          value: fieldVal,
          valid: false,
          error: `Value "${item}" in ${config.name} is out of range (${config.min}–${config.max}).`,
          rangeDescription: `${config.min}–${config.max}`,
        };
      }
    }
  }

  return {
    name: config.name,
    fieldIndex: index,
    value: fieldVal,
    valid: true,
    rangeDescription: `${config.min}–${config.max}`,
  };
}

export function parseAndAnalyzeCron(
  expression: string,
  use24Hour = false
): CronAnalysisResult {
  const normalized = (expression ?? '').trim().replace(/\s+/g, ' ');

  if (!normalized) {
    return {
      valid: false,
      normalized: '',
      error: 'Enter a 5-field cron expression.',
      humanDescription: '',
      fields: [],
      nextRuns: [],
    };
  }

  const parts = normalized.split(' ');

  if (parts.length === 6) {
    return {
      valid: false,
      normalized,
      error: 'Standard Linux/Unix cron requires 5 fields. You entered 6 fields, which is characteristic of Quartz (with seconds) or AWS EventBridge (with year).',
      humanDescription: '',
      fields: [],
      nextRuns: [],
      dialectNote: 'Quartz uses 6 or 7 fields (Seconds Minute Hour Day Month Weekday [Year]). AWS EventBridge uses 6 fields (Minute Hour Day Month Weekday Year). Standard Linux crontab expects exactly 5 fields.',
    };
  }

  if (parts.length === 7) {
    return {
      valid: false,
      normalized,
      error: 'Standard Linux/Unix cron requires 5 fields. You entered 7 fields, which is Quartz cron syntax.',
      humanDescription: '',
      fields: [],
      nextRuns: [],
      dialectNote: 'Quartz supports 7 fields with explicit seconds and year definitions, but standard Linux cron rejects 7 fields.',
    };
  }

  if (parts.length !== 5) {
    return {
      valid: false,
      normalized,
      error: `Expected 5 fields (minute hour day-of-month month day-of-week), but received ${parts.length} field${parts.length === 1 ? '' : 's'}.`,
      humanDescription: '',
      fields: [],
      nextRuns: [],
    };
  }

  const fields = parts.map((part, index) => validateSingleField(index, part));
  const failedField = fields.find((f) => !f.valid);

  if (failedField) {
    return {
      valid: false,
      normalized,
      error: failedField.error || `Invalid value in ${failedField.name} field`,
      humanDescription: '',
      fields,
      nextRuns: [],
    };
  }

  try {
    // Generate explanation
    const humanDescription = cronstrue.toString(normalized, {
      use24HourTimeFormat: use24Hour,
      throwExceptionOnParseError: true,
    });

    // Compute upcoming runs
    const interval = CronExpressionParser.parse(normalized, {
      currentDate: new Date(),
    });

    const nextRuns: NextRunItem[] = [];
    const now = Date.now();

    for (let i = 0; i < 5; i++) {
      const nextDate = interval.next().toDate();
      const diffMinutes = Math.round((nextDate.getTime() - now) / 60000);

      let relative = '';
      if (diffMinutes < 60) {
        relative = `in ${diffMinutes} min`;
      } else if (diffMinutes < 1440) {
        const hours = Math.floor(diffMinutes / 60);
        relative = `in ${hours} hr${hours === 1 ? '' : 's'}`;
      } else {
        const days = Math.floor(diffMinutes / 1440);
        relative = `in ${days} day${days === 1 ? '' : 's'}`;
      }

      nextRuns.push({
        index: i + 1,
        date: nextDate,
        iso: nextDate.toISOString(),
        localFormatted: nextDate.toLocaleString(undefined, {
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
        relative,
      });
    }

    return {
      valid: true,
      normalized,
      humanDescription,
      fields,
      nextRuns,
    };
  } catch (err) {
    return {
      valid: false,
      normalized,
      error: err instanceof Error ? err.message : 'Invalid cron expression syntax',
      humanDescription: '',
      fields,
      nextRuns: [],
    };
  }
}
