'use client';

import { cn } from '@/lib/utils';

interface ComparisonRow {
  label: string;
  values: Array<{
    value: string | number;
    highlight?: boolean;
    color?: string;
  }>;
}

interface ComparisonTableProps {
  headers: string[];
  rows: ComparisonRow[];
  className?: string;
}

export function ComparisonTable({ headers, rows, className }: ComparisonTableProps) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="text-left py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-500">
              Metric
            </th>
            {headers.map((header, index) => (
              <th
                key={index}
                className="text-center py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-500"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={cn(
                'border-b border-slate-100 dark:border-slate-800',
                rowIndex % 2 === 0 && 'bg-slate-50 dark:bg-slate-900/50'
              )}
            >
              <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                {row.label}
              </td>
              {row.values.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={cn(
                    'py-3 px-4 text-center font-bold',
                    cell.highlight && 'text-indigo-600 dark:text-indigo-400',
                    cell.color && `text-${cell.color}-600 dark:text-${cell.color}-400`
                  )}
                >
                  {cell.value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
