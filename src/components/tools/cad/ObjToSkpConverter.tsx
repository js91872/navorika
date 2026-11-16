'use client';

import { useEffect, useState } from 'react';

export default function ObjToSkpConverter() {
  const [obj, setObj] = useState<File | null>(null);
  const [companions, setCompanions] = useState<File[]>([]);
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('Checking converter availability…');
  useEffect(() => {
    fetch('/api/obj-to-skp', { cache: 'no-store' })
      .then(async response => response.json())
      .then(result => {
        setEnabled(result.enabled === true);
        setNotice(result.enabled ? 'Converter available. Choose your files below.' : 'Private beta: conversion is not enabled on this server.');
      })
      .catch(() => setNotice('Converter availability could not be checked.'));
  }, []);

  async function convert() {
    if (!obj || !enabled || busy) return;
    setBusy(true);
    setNotice('Converting your model…');
    try {
      const form = new FormData();
      form.set('obj', obj);
      companions.forEach(file => form.append('companions', file));
      const response = await fetch('/api/obj-to-skp', { method: 'POST', body: form, cache: 'no-store' });
      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(typeof detail.error === 'string' ? detail.error : 'Conversion failed.');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = (obj.name.replace(/\.obj$/i, '').replace(/[^a-zA-Z0-9_-]/g, '_') || 'model') + '.skp';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 3000);
      setNotice('Your SKP download is ready. Open it in SketchUp and verify geometry, scale and textures.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Conversion failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-8" aria-label="OBJ to SKP file converter">
      <div className="space-y-5">
        <div>
          <label htmlFor="obj-file" className="mb-2 block text-sm font-semibold">OBJ model file (maximum 20 MB)</label>
          <input id="obj-file" type="file" accept=".obj" onChange={event => setObj(event.target.files?.[0] ?? null)}
            className="block w-full rounded-lg border border-[var(--border)] p-3 text-sm" />
        </div>
        <div>
          <label htmlFor="obj-companions" className="mb-2 block text-sm font-semibold">Optional MTL and PNG/JPEG texture files (up to 12)</label>
          <input id="obj-companions" type="file" multiple accept=".mtl,.png,.jpg,.jpeg"
            onChange={event => setCompanions(Array.from(event.target.files ?? []))}
            className="block w-full rounded-lg border border-[var(--border)] p-3 text-sm" />
          <p className="mt-2 text-xs text-[var(--muted-foreground)]">Put the files referenced by mtllib and map_Kd here. Only simple same-directory names are supported. No ZIP files or complex material options.</p>
        </div>
        <button type="button" disabled={!enabled || !obj || busy} onClick={() => { void convert(); }}
          className="w-full rounded-xl bg-[#e5322d] px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">
          {busy ? 'Converting…' : 'Convert OBJ to SKP'}
        </button>
        <p role="status" aria-live="polite" className="text-sm text-[var(--muted-foreground)]">{notice}</p>
      </div>
      <p className="mt-5 border-t border-[var(--border)] pt-4 text-xs leading-6 text-[var(--muted-foreground)]">
        This tool uploads your files to a temporary isolated server directory for conversion, then deletes that directory.
        It does not process CAD files locally in your browser. Output uses the legacy SketchUp file format and may need manual cleanup.
        Unit assumption: one OBJ unit equals one metre. Do not upload sensitive models.
      </p>
    </section>
  );
}
