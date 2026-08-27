'use client';

import { Copy, Download } from 'lucide-react';
import { useMemo, useState } from 'react';
import { parseCsv } from '@/lib/calculations/csvToJson';

const sample = 'name,city,active\n"Doe, Jane",Austin,true\n"Smith, John","New York",false';
const field = 'rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm';

export default function CsvToJsonConverter() {
  const [input, setInput] = useState(sample);
  const [delimiter, setDelimiter] = useState(',');
  const [headers, setHeaders] = useState(true);
  const [trim, setTrim] = useState(true);
  const [inferTypes, setInferTypes] = useState(true);
  const result = useMemo(() => {
    try { return { value: parseCsv(input, { delimiter, headers, trim, inferTypes }), error: '' }; }
    catch (error) { return { value: null, error: error instanceof Error ? error.message : 'Unable to parse CSV.' }; }
  }, [input, delimiter, headers, trim, inferTypes]);
  const json = result.value ? JSON.stringify(result.value.records, null, 2) : '';
  const download = () => {
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'navorika-data.json'; anchor.click(); URL.revokeObjectURL(url);
  };
  return <div className="space-y-6">
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5">
        <h2 className="text-xl font-bold">CSV input</h2>
        <label className="mt-4 block text-sm font-semibold">Paste CSV<textarea aria-label="CSV input" value={input} onChange={(event) => setInput(event.target.value)} className="mt-2 min-h-80 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm" /></label>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-semibold">Delimiter<select value={delimiter} onChange={(event) => setDelimiter(event.target.value)} className={`${field} mt-2 w-full`}><option value=",">Comma</option><option value=";">Semicolon</option><option value={'\t'}>Tab</option><option value="|">Pipe</option></select></label>
          <div className="space-y-2 text-sm"><label className="flex gap-2"><input type="checkbox" checked={headers} onChange={(event) => setHeaders(event.target.checked)} /> First row is headers</label><label className="flex gap-2"><input type="checkbox" checked={trim} onChange={(event) => setTrim(event.target.checked)} /> Trim values</label><label className="flex gap-2"><input type="checkbox" checked={inferTypes} onChange={(event) => setInferTypes(event.target.checked)} /> Infer numbers, booleans and nulls</label></div>
        </div>{result.error && <p role="alert" className="mt-3 text-sm text-red-600">{result.error}</p>}
      </div>
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold">JSON preview</h2><div className="flex gap-2"><button type="button" disabled={!json} onClick={() => void navigator.clipboard.writeText(json)} className={`${field} inline-flex items-center gap-2`}><Copy className="size-4" /> Copy</button><button type="button" disabled={!json} onClick={download} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-bold text-white"><Download className="size-4" /> Download</button></div></div>
        <pre className="mt-4 min-h-80 overflow-auto whitespace-pre-wrap rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 text-sm">{json || 'Valid CSV will appear here.'}</pre>
      </div>
    </section>
    {result.value && result.value.rows.length > 0 && <section className="overflow-x-auto rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5"><h2 className="text-xl font-bold">Table preview</h2><table className="mt-4 min-w-full text-left text-sm"><thead><tr>{result.value.columns.map((column) => <th key={column} className="border-b border-[var(--border)] p-3">{column}</th>)}</tr></thead><tbody>{result.value.rows.slice(0, 20).map((row, index) => <tr key={index}>{result.value?.columns.map((column, columnIndex) => <td key={column} className="border-b border-[var(--border)] p-3">{String(row[columnIndex] ?? '')}</td>)}</tr>)}</tbody></table></section>}
  </div>;
}
