export type CsvValue = string | number | boolean | null;

export interface CsvOptions {
  delimiter: string;
  headers: boolean;
  trim: boolean;
  inferTypes: boolean;
}

export interface CsvResult {
  columns: string[];
  rows: CsvValue[][];
  records: Array<Record<string, CsvValue>> | CsvValue[][];
}

function infer(value: string): CsvValue {
  if (value === '') return null;
  if (/^(true|false)$/i.test(value)) return value.toLowerCase() === 'true';
  if (/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:e[+-]?\d+)?$/i.test(value)) return Number(value);
  return value;
}

export function parseCsv(input: string, options: CsvOptions): CsvResult {
  if (!options.delimiter || options.delimiter.length !== 1) throw new Error('Choose a one-character delimiter.');
  const parsed: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    if (quoted) {
      if (character === '"' && input[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') quoted = false;
      else field += character;
    } else if (character === '"' && field.length === 0) quoted = true;
    else if (character === options.delimiter) {
      row.push(field);
      field = '';
    } else if (character === '\n' || character === '\r') {
      if (character === '\r' && input[index + 1] === '\n') index += 1;
      row.push(field);
      parsed.push(row);
      row = [];
      field = '';
    } else field += character;
  }
  if (quoted) throw new Error('CSV contains an unclosed quoted field.');
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    parsed.push(row);
  }
  while (parsed.length && parsed[parsed.length - 1].every((value) => value === '')) parsed.pop();
  if (!parsed.length) return { columns: [], rows: [], records: [] };

  const width = Math.max(...parsed.map((item) => item.length));
  const clean = parsed.map((item) => Array.from({ length: width }, (_, index) => options.trim ? (item[index] ?? '').trim() : (item[index] ?? '')));
  const rawColumns = options.headers ? clean.shift() ?? [] : Array.from({ length: width }, (_, index) => `column_${index + 1}`);
  const seen = new Map<string, number>();
  const columns = rawColumns.map((column, index) => {
    const base = column || `column_${index + 1}`;
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count ? `${base}_${count + 1}` : base;
  });
  const rows = clean.map((item) => item.map((value) => options.inferTypes ? infer(value) : value));
  const records = options.headers
    ? rows.map((item) => Object.fromEntries(columns.map((column, index) => [column, item[index] ?? null])))
    : rows;
  return { columns, rows, records };
}
