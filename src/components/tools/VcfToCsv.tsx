'use client';

import { useMemo, useState } from 'react';

type Contact = { name: string; first: string; last: string; phone: string; email: string; company: string; title: string };
const empty = (): Contact => ({ name: '', first: '', last: '', phone: '', email: '', company: '', title: '' });
const unescapeValue = (value: string): string => value.replace(/\\([nN,;\\])/g, (_match, char: string) => /n/i.test(char) ? '\n' : char);

function unfold(input: string): string[] {
  return input.replace(/\r\n?/g, '\n').split('\n').reduce<string[]>((lines, line) => {
    if (/^[ \t]/.test(line) && lines.length) lines[lines.length - 1] += line.slice(1);
    else lines.push(line);
    return lines;
  }, []);
}
function parseVcards(input: string): Contact[] {
  const contacts: Contact[] = [];
  let contact: Contact | null = null;
  for (const raw of unfold(input.replace(/^\uFEFF/, ''))) {
    const line = raw.trimEnd();
    if (line.toUpperCase() === 'BEGIN:VCARD') {
      if (contact) throw new Error('Found a new vCard before the previous contact ended.');
      contact = empty(); continue;
    }
    if (line.toUpperCase() === 'END:VCARD') {
      if (!contact) throw new Error('Unexpected END:VCARD.');
      contact.name ||= [contact.first, contact.last].filter(Boolean).join(' ') || contact.company;
      contacts.push(contact); contact = null; continue;
    }
    if (!contact) continue;
    const colon = line.indexOf(':');
    if (colon < 0) continue;
    const field = line.slice(0, colon).split(';')[0].split('.').pop()?.toUpperCase();
    const value = unescapeValue(line.slice(colon + 1));
    switch (field) {
      case 'FN': contact.name ||= value; break;
      case 'N': {
        const parts = line.slice(colon + 1).split(/(?<!\\);/).map(unescapeValue);
        contact.last ||= parts[0] || ''; contact.first ||= parts[1] || ''; break;
      }
      case 'TEL': contact.phone ||= value; break;
      case 'EMAIL': contact.email ||= value; break;
      case 'ORG': contact.company ||= value.split(';')[0]; break;
      case 'TITLE': contact.title ||= value; break;
    }
  }
  if (contact) throw new Error('The last vCard is missing END:VCARD.');
  if (!contacts.length) throw new Error('No vCard contacts were found. Choose a valid .vcf file.');
  return contacts;
}
const csvValue = (value: string): string => '"' + value.replace(/"/g, '""') + '"';
function makeCsv(contacts: Contact[]) {
  const columns: (keyof Contact)[] = ['name', 'first', 'last', 'phone', 'email', 'company', 'title'];
  return ['Full Name,First Name,Last Name,Phone,Email,Company,Job Title',
    ...contacts.map(contact => columns.map(field => csvValue(contact[field])).join(','))].join('\r\n');
}

export default function VcfToCsv() {
  const [source, setSource] = useState('');
  const [fileError, setFileError] = useState('');
  const result = useMemo(() => {
    if (!source.trim()) return { contacts: [] as Contact[], error: '' };
    try { return { contacts: parseVcards(source), error: '' }; }
    catch (error) { return { contacts: [] as Contact[], error: error instanceof Error ? error.message : 'Invalid VCF input.' }; }
  }, [source]);
  const download = () => {
    if (!result.contacts.length) return;
    const blob = new Blob(['\uFEFF' + makeCsv(result.contacts)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = 'contacts.csv'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <section className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
    <div>
      <label htmlFor="vcf-upload" className="block font-semibold">Upload your VCF contacts file</label>
      <input id="vcf-upload" type="file" accept=".vcf,.vcard,text/vcard,text/x-vcard" className="peer sr-only" onChange={async event => {
        const file = event.target.files?.[0]; if (!file) return;
        if (file.size > 5 * 1024 * 1024) { setFileError('Choose a VCF file smaller than 5 MB.'); return; }
        setSource(await file.text()); setFileError('');
      }}/>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label htmlFor="vcf-upload" className="inline-flex cursor-pointer items-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2">Choose VCF File</label>
        <span className="text-sm text-[var(--muted-foreground)]">VCF or vCard, up to 5 MB</span>
      </div>
    </div>
    <div><label htmlFor="vcf-text" className="block font-semibold">Or paste vCard text</label>
      <textarea id="vcf-text" rows={9} value={source} onChange={e => {setSource(e.target.value);setFileError('');}} placeholder={'BEGIN:VCARD\nVERSION:3.0\nFN:Alex Taylor\nTEL:+1 415 555 0123\nEMAIL:alex@example.com\nEND:VCARD'} spellCheck={false} className="mt-3 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 font-mono text-sm"/>
    </div>
    {(fileError || result.error) && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{fileError || result.error}</p>}
    <div className="flex flex-wrap items-center gap-4">
      <button type="button" disabled={!result.contacts.length || Boolean(fileError)} onClick={download} className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-50">Download contacts.csv</button>
      <span className="text-sm text-[var(--muted-foreground)]">{result.contacts.length} contact{result.contacts.length === 1 ? '' : 's'} ready</span>
    </div>
    {!!result.contacts.length && <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
      <table className="w-full text-left text-sm">
        <thead><tr className="border-b border-[var(--border)]"><th className="p-3">Name</th><th className="p-3">Phone</th><th className="p-3">Email</th></tr></thead>
        <tbody>{result.contacts.slice(0, 5).map((c, i) => <tr key={i} className="border-b border-[var(--border)] last:border-0"><td className="p-3">{c.name}</td><td className="p-3">{c.phone}</td><td className="p-3">{c.email}</td></tr>)}</tbody>
      </table>
    </div>}
    <p className="text-xs text-[var(--muted-foreground)]">Supports standard plain-text vCard 3.0/4.0 contact fields. Exports the first phone number and email per contact. Embedded photos, complex contact groups and quoted-printable vCards are not imported. Processing stays in your browser.</p>
  </section>;
}
