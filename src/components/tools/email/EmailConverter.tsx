'use client';

import { useState } from 'react';
import type { Email } from 'postal-mime';
import {
  type EmailFormat,
  formats,
  validateFiles,
  parseEmail,
  safeName,
  headers,
} from '@/lib/converters/email/email';

type Parsed = { name: string; email: Email };
const sample =
  'From: Alex <alex@example.com>\r\nTo: Jamie <jamie@example.com>\r\nSubject: Meeting notes\r\nDate: Tue, 10 Nov 2026 10:00:00 +0000\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=utf-8\r\n\r\nHello Jamie,\r\n\r\nPlease review the meeting notes before Friday.\r\n\r\nThanks,\r\nAlex';

function download(bytes: Uint8Array, name: string, mime: string) {
  const url = URL.createObjectURL(
    new Blob([new Uint8Array(bytes).buffer], { type: mime }),
  );
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
export default function EmailConverter({ format }: { format: EmailFormat }) {
  const [files, setFiles] = useState<File[]>([]);
  const [parsed, setParsed] = useState<Parsed[]>([]);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState('');
  const [index, setIndex] = useState(0);
  async function select(incoming: File[]) {
    setBusy(true);
    setError('');
    setStatus('Reading emails locally…');
    setParsed([]);
    setPreview('');
    setIndex(0);
    setFiles([]);
    try {
      validateFiles(incoming);
      setFiles(incoming);
      const result: Parsed[] = [];
      for (const f of incoming) {
        try {
          result.push({
            name: f.name,
            email: await parseEmail(await f.arrayBuffer()),
          });
        } catch (e) {
          throw new Error(
            `${f.name}: ${e instanceof Error ? e.message : 'Unable to read email'}`,
          );
        }
      }
      setParsed(result);
      const { htmlDocument } = await import('@/lib/converters/email/html');
      setPreview(htmlDocument(result[0].email));
      setStatus(
        `${result.length} email${result.length === 1 ? '' : 's'} ready. Review, then download.`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to read files.');
      setFiles([]);
      setParsed([]);
      setStatus('');
    } finally {
      setBusy(false);
    }
  }
  async function convert() {
    setBusy(true);
    setError('');
    setStatus('Creating your download…');
    try {
      if (format === 'excel') {
        const { emailsToXlsx } = await import('@/lib/converters/email/xlsx');
        const { bodyText } = await import('@/lib/converters/email/html');
        const rows = parsed.map((p) => ({ ...p, text: bodyText(p.email) }));
        download(await emailsToXlsx(rows), 'emails.xlsx', formats.excel.mime);
        setStatus(
          `Downloaded ${rows.length} email rows. ${rows.some((r) => r.text.length > 32767) ? 'Long bodies were shortened to the Excel cell limit; see Body truncated column.' : ''}`,
        );
      } else {
        const { exportEmail } = await import('@/lib/converters/email/export');
        if (parsed.length === 1)
          download(
            await exportEmail(parsed[0].email, format),
            `${safeName(parsed[0].name)}.${formats[format].extension}`,
            formats[format].mime,
          );
        else {
          const { default: JSZip } = await import('jszip');
          const zip = new JSZip();
          for (let i = 0; i < parsed.length; i++) {
            setStatus(`Converting ${i + 1} of ${parsed.length}…`);
            zip.file(
              `${String(i + 1).padStart(2, '0')}-${safeName(parsed[i].name)}.${formats[format].extension}`,
              await exportEmail(parsed[i].email, format),
            );
          }
          download(
            await zip.generateAsync({ type: 'uint8array' }),
            `emails-${format}.zip`,
            'application/zip',
          );
        }
        setStatus(
          'Download ready. Open the output to check the result before sharing.',
        );
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Conversion failed. Try a smaller batch.',
      );
      setStatus('');
    } finally {
      setBusy(false);
    }
  }
  async function changePreview(i: number) {
    setIndex(i);
    const { htmlDocument } = await import('@/lib/converters/email/html');
    setPreview(htmlDocument(parsed[i].email));
  }
  return (
    <section
      className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7"
      aria-label={`EML to ${formats[format].label} converter`}
    >
      <label
        className={`block rounded-xl border-2 border-dashed border-[var(--border)] p-6 text-center ${busy ? 'opacity-60' : 'cursor-pointer'}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (!busy) void select(Array.from(e.dataTransfer.files));
        }}
      >
        <span className="block text-lg font-bold">
          Choose or drop EML files
        </span>
        <span className="mt-2 block text-sm">
          Up to 50 emails · 20 MB combined
        </span>
        <input
          type="file"
          accept=".eml,message/rfc822"
          multiple
          disabled={busy}
          className="mt-4 max-w-full text-sm"
          aria-label="Choose EML files"
          onChange={(e) => {
            void select(Array.from(e.target.files || []));
            e.target.value = '';
          }}
        />
      </label>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() =>
            void select([
              new File([sample], 'sample.eml', { type: 'message/rfc822' }),
            ])
          }
          className="rounded-lg border border-[var(--border)] px-4 py-2 font-semibold disabled:opacity-50"
        >
          Try sample email
        </button>
        <button
          type="button"
          disabled={busy || !parsed.length}
          onClick={() => void convert()}
          className="rounded-lg bg-[#e5322d] px-5 py-2 font-bold text-white disabled:opacity-50"
        >
          {busy
            ? 'Working…'
            : `Convert & download ${format === 'excel' ? 'XLSX' : parsed.length > 1 ? 'ZIP' : formats[format].extension.toUpperCase()}`}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            setFiles([]);
            setParsed([]);
            setPreview('');
            setStatus('');
            setError('');
            setIndex(0);
          }}
          className="rounded-lg border border-[var(--border)] px-4 py-2 disabled:opacity-50"
        >
          Clear files
        </button>
      </div>
      <p role="status" className="mt-3 text-sm" aria-live="polite">
        {status}
      </p>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}
      <p className="mt-4 text-sm text-[var(--muted-foreground)]">
        Your files stay in this browser. Remote images, scripts and links are
        blocked.{' '}
        {format === 'msg'
          ? 'MSG embeds original attachment files; open them only if you trust the sender.'
          : format === 'html'
            ? 'HTML keeps basic formatting; attachments are listed, not embedded.'
            : 'PDF, Word and Excel use readable text; attachment names are listed, not embedded. Original email styling and images are not reproduced.'}{' '}
        {format === 'pdf'
          ? 'Western European text is searchable; other scripts may be rendered as images.'
          : ''}
      </p>
      {parsed.length > 0 && (
        <div className="mt-6 border-t border-[var(--border)] pt-5">
          <label className="block text-sm font-semibold">
            Preview email
            <select
              value={index}
              onChange={(e) => void changePreview(Number(e.target.value))}
              className="ml-3 max-w-full rounded border border-[var(--border)] bg-[var(--background)] p-2"
            >
              {files.map((f, i) => (
                <option key={`${i}-${f.name}`} value={i}>
                  {f.name}
                </option>
              ))}
            </select>
          </label>
          <dl className="my-4 grid gap-1 text-sm">
            {headers(parsed[index].email)
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="break-words">
                  <dt className="inline font-bold">{k}: </dt>
                  <dd className="inline">{v}</dd>
                </div>
              ))}
          </dl>
          <p className="mb-2 text-xs text-[var(--muted-foreground)]">
            Safe HTML preview. PDF, Word and Excel export text; MSG also retains
            the original attachments.
          </p>
          <iframe
            title="Safe email preview"
            sandbox=""
            referrerPolicy="no-referrer"
            srcDoc={preview}
            className="h-80 w-full rounded-lg border border-[var(--border)] bg-white"
          />
          <p className="mt-2 text-sm">
            Attachments:{' '}
            {parsed[index].email.attachments
              .map((a) => a.filename || 'unnamed attachment')
              .join(', ') || 'None'}
          </p>
        </div>
      )}
    </section>
  );
}
