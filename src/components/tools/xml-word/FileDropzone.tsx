'use client';

import { useRef, useState } from 'react';
import { FileUp } from 'lucide-react';

export default function FileDropzone({ accept, label, help, file, onFile }: { accept: string; label: string; help: string; file: File | null; onFile: (file: File) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  return <div
    className={`rounded-2xl border-2 border-dashed p-5 text-center transition ${dragging ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30' : 'border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-950/40'}`}
    onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
    onDragOver={(event) => event.preventDefault()}
    onDragLeave={(event) => { if (event.currentTarget === event.target) setDragging(false); }}
    onDrop={(event) => { event.preventDefault(); setDragging(false); const dropped = event.dataTransfer.files[0]; if (dropped) onFile(dropped); }}
  >
    <input ref={input} type="file" accept={accept} className="sr-only" onChange={(event) => { const selected = event.target.files?.[0]; if (selected) onFile(selected); event.target.value = ''; }} />
    <FileUp className="mx-auto size-9 text-indigo-600" aria-hidden="true" />
    <p className="mt-3 break-words font-bold">{file ? file.name : label}</p>
    <p className="mt-1 text-sm text-[var(--muted-foreground)]">{help}</p>
    <button type="button" onClick={() => input.current?.click()} className="mt-4 min-h-11 rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow-sm ring-1 ring-slate-300 hover:ring-indigo-500 dark:bg-slate-900 dark:text-white dark:ring-slate-700">Choose file</button>
  </div>;
}
