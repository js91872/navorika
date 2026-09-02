export type ExportCell = string | number | boolean | null | undefined;

export function escapeCsvCell(value: ExportCell): string {
  const text = value == null ? '' : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function rowsToCsv(rows: readonly (readonly ExportCell[])[]): string {
  return rows.map((row) => row.map(escapeCsvCell).join(',')).join('\r\n');
}

export function valueToJson(value: unknown): string {
  if (value === undefined) return '';
  return JSON.stringify(value, null, 2);
}
