'use client';

import {
  Copy,
  Download,
  FileJson,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  convertJsonToCsv,
} from '@/lib/calculations/jsonToCsv';

const example = `[
  {
    "name": "Alice",
    "address": {
      "city": "Boston",
      "zip": "02108"
    },
    "skills": ["Excel", "SQL"]
  },
  {
    "name": "Bob",
    "address": {
      "city": "Austin",
      "zip": "78701"
    },
    "skills": ["Python", "JSON"]
  }
]`;

export default function JsonToCsvFlattener() {
  const [input, setInput] = useState(example);
  const [separator, setSeparator] =
    useState('.');
  const [arrayMode, setArrayMode] =
    useState<'json' | 'join'>('json');

  const result = useMemo(() => {
    try {
      return {
        data: convertJsonToCsv(input, {
          separator,
          arrayMode,
          arraySeparator: '; ',
        }),
        error: '',
      };
    } catch (error) {
      return {
        data: null,
        error:
          error instanceof Error
            ? error.message
            : 'Invalid JSON.',
      };
    }
  }, [input, separator, arrayMode]);

  const downloadCsv = () => {
    if (!result.data) return;

    const blob = new Blob(
      [result.data.csv],
      {
        type: 'text/csv;charset=utf-8',
      },
    );

    const url = URL.createObjectURL(blob);
    const anchor =
      document.createElement('a');

    anchor.href = url;
    anchor.download = 'navorika-json-export.csv';
    anchor.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <FileJson className="size-6 text-indigo-600" />
            <h2 className="text-xl font-bold">
              JSON input
            </h2>
          </div>

          <textarea
            value={input}
            onChange={(event) =>
              setInput(event.target.value)
            }
            spellCheck={false}
            className="mt-5 min-h-[430px] w-full resize-y rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm leading-6 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />

          {result.error && (
            <p className="mt-3 text-sm font-semibold text-red-600">
              {result.error}
            </p>
          )}
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold">
              Flattened CSV
            </h2>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={!result.data}
                onClick={() =>
                  result.data &&
                  void navigator.clipboard.writeText(
                    result.data.csv,
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-semibold"
              >
                <Copy className="size-4" />
                Copy
              </button>

              <button
                type="button"
                disabled={!result.data}
                onClick={downloadCsv}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-bold text-white"
              >
                <Download className="size-4" />
                CSV
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              Nested key separator
              <select
                value={separator}
                onChange={(event) =>
                  setSeparator(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5"
              >
                <option value=".">
                  Dot: address.city
                </option>
                <option value="_">
                  Underscore: address_city
                </option>
              </select>
            </label>

            <label className="text-sm font-semibold">
              Arrays
              <select
                value={arrayMode}
                onChange={(event) =>
                  setArrayMode(
                    event.target.value as
                      | 'json'
                      | 'join',
                  )
                }
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5"
              >
                <option value="json">
                  Preserve as JSON
                </option>
                <option value="join">
                  Join values
                </option>
              </select>
            </label>
          </div>

          <pre className="mt-5 min-h-[330px] overflow-auto whitespace-pre-wrap rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm leading-6">
            {result.data?.csv ??
              'Enter valid JSON to preview CSV.'}
          </pre>
        </div>
      </section>

      {result.data &&
        result.data.headers.length > 0 && (
          <section className="overflow-x-auto rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5">
            <h2 className="text-xl font-bold">
              Table preview
            </h2>

            <table className="mt-5 min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  {result.data.headers.map(
                    (header) => (
                      <th
                        key={header}
                        className="px-3 py-3 font-bold"
                      >
                        {header}
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              <tbody>
                {result.data.rows
                  .slice(0, 20)
                  .map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-[var(--border)]"
                    >
                      {result.data?.headers.map(
                        (header) => (
                          <td
                            key={header}
                            className="max-w-xs px-3 py-3"
                          >
                            {typeof row[header] ===
                            'string'
                              ? row[header]
                              : String(
                                  row[header] ?? '',
                                )}
                          </td>
                        ),
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>

            {result.data.rows.length > 20 && (
              <p className="mt-3 text-xs text-[var(--muted-foreground)]">
                Preview shows the first 20 rows.
                Download includes all rows.
              </p>
            )}
          </section>
        )}
    </div>
  );
}
