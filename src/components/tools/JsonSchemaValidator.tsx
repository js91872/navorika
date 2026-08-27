'use client';

import { useMemo, useState } from 'react';
import { validateJsonSchema } from '@/lib/calculations/jsonSchemaSubset';

const dataSample = '{\n  "name": "Navorika",\n  "active": true,\n  "tags": ["tools"]\n}';
const schemaSample = '{\n  "type": "object",\n  "required": ["name", "active"],\n  "additionalProperties": false,\n  "properties": {\n    "name": { "type": "string", "minLength": 2 },\n    "active": { "type": "boolean" },\n    "tags": { "type": "array", "items": { "type": "string" } }\n  }\n}';

export default function JsonSchemaValidator() {
  const [data, setData] = useState(dataSample); const [schema, setSchema] = useState(schemaSample);
  const result = useMemo(() => { try { const parsedData = JSON.parse(data) as unknown; const parsedSchema = JSON.parse(schema) as unknown; return { issues: validateJsonSchema(parsedData, parsedSchema), syntax: '' }; } catch (error) { return { issues: [], syntax: error instanceof SyntaxError ? error.message : 'Invalid JSON syntax.' }; } }, [data, schema]);
  const valid = !result.syntax && result.issues.length === 0;
  return <div className="space-y-5"><section className="grid gap-5 lg:grid-cols-2">{[['JSON data',data,setData],['JSON Schema',schema,setSchema]].map(([label,value,setter]) => <label key={label as string} className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 text-lg font-bold">{label as string}<textarea value={value as string} onChange={(event) => (setter as (value:string)=>void)(event.target.value)} spellCheck={false} className="mt-4 min-h-96 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm font-normal" /></label>)}</section><section aria-live="polite" className={`rounded-2xl border p-5 ${valid ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-red-500/30 bg-red-500/10'}`}><h2 className="text-xl font-bold">{valid ? 'Valid against this schema' : 'Validation errors'}</h2>{result.syntax ? <p className="mt-3 text-sm">JSON syntax error: {result.syntax}</p> : result.issues.length > 0 && <ul className="mt-3 space-y-2 text-sm">{result.issues.map((issue, index) => <li key={`${issue.path}-${index}`}><code className="font-bold">{issue.path}</code>: {issue.message}</li>)}</ul>}</section><p className="text-sm text-[var(--muted-foreground)]">Supported subset: type, properties, required, additionalProperties, items, minItems, maxItems, minimum, maximum, minLength, maxLength, pattern, enum, const, anyOf, allOf and oneOf. This is not a full JSON Schema implementation.</p></div>;
}
