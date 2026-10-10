'use client';

import { useMemo, useState } from 'react';

type Contact = Record<string, string>;

function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], field = '', quoted = false;
  const source = input.replace(/^\uFEFF/, '');
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (ch === '"') {
      if (quoted && source[i + 1] === '"') { field += '"'; i++; }
      else if (!quoted && field.length === 0) quoted = true;
      else if (quoted) quoted = false;
      else throw new Error('Unexpected quotation mark at character ' + (i + 1));
    } else if (ch === ',' && !quoted) {
      row.push(field); field = '';
    } else if ((ch === '\n' || ch === '\r') && !quoted) {
      if (ch === '\r' && source[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some(value => value.trim())) rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  if (quoted) throw new Error('CSV contains an unclosed quoted field.');
  row.push(field);
  if (row.some(value => value.trim())) rows.push(row);
  return rows;
}

const normal = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const fieldNames: Record<string, string[]> = {
  first: ['firstname', 'givenname', 'first', 'given'],
  last: ['lastname', 'surname', 'familyname', 'last', 'family'],
  full: ['fullname', 'displayname', 'name', 'contactname'],
  phone: ['phone', 'phonenumber', 'mobile', 'cell', 'telephone', 'tel', 'primaryphone', 'mobilephone'],
  email: ['email', 'emailaddress', 'mail'],
  organization: ['company', 'organization', 'organisation', 'org'],
  title: ['jobtitle', 'title', 'position'],
};

function pick(contact: Contact, key: string): string {
  const names = fieldNames[key] || [];
  const match = Object.keys(contact).find(field => names.includes(normal(field)));
  return match ? (contact[match] || '').trim() : '';
}
function escapeVcf(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
}
function createCards(contacts: Contact[]): string {
  return contacts.map(c => {
    const first = pick(c, 'first'), last = pick(c, 'last');
    const full = pick(c, 'full') || [first, last].filter(Boolean).join(' ') || pick(c, 'organization') || 'Unnamed contact';
    const parts = ['BEGIN:VCARD', 'VERSION:3.0', 'FN:' + escapeVcf(full), 'N:' + escapeVcf(last) + ';' + escapeVcf(first) + ';;;'];
    for (const [column, property] of [['phone', 'TEL;TYPE=CELL'], ['email', 'EMAIL;TYPE=INTERNET'], ['organization', 'ORG'], ['title', 'TITLE']] as const) {
      const value = pick(c, column);
      if (value) parts.push(property + ':' + escapeVcf(value));
    }
    return [...parts, 'END:VCARD'].join('\r\n');
  }).join('\r\n') + '\r\n';
}

export default function CsvToVcard() {
  const [csv, setCsv] = useState('First Name,Last Name,Phone,Email,Company\nAlex,Taylor,+1 415 555 0123,alex@example.com,Example Co');
  const [error, setError] = useState('');
  const result = useMemo(() => {
    try {
      const rows = parseCsv(csv);
      if (rows.length < 2) return { contacts: [] as Contact[], error: 'Add a header row and at least one contact.' };
      const headers = rows[0].map(h => h.trim());
      if (headers.some(h => !h)) return { contacts: [] as Contact[], error: 'All CSV header columns must have names.' };
      const contacts = rows.slice(1).map((row, i) => {
        if (row.length > headers.length) throw new Error('Row ' + (i + 2) + ' has more values than the header.');
        return Object.fromEntries(headers.map((h, index) => [h, row[index] || '']));
      });
      if (!contacts.some(c => pick(c, 'phone') || pick(c, 'email'))) return { contacts, error: 'Include a Phone or Email column. Supported headings: First Name, Last Name, Full Name, Phone, Email, Company and Job Title.' };
      return { contacts, error: '' };
    } catch (e) { return { contacts: [] as Contact[], error: e instanceof Error ? e.message : 'Invalid CSV file.' }; }
  }, [csv]);
  const canDownload = !result.error && result.contacts.length > 0;
  const download = () => {
    if (!canDownload) return;
    const blob = new Blob([createCards(result.contacts)], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = 'contacts.vcf'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <section className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
      <div>
        <label htmlFor="csv-data" className="block font-semibold">Paste CSV contacts</label>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">The first row should contain column names. Processing stays in your browser.</p>
        <textarea id="csv-data" rows={9} value={csv} onChange={e => { setCsv(e.target.value); setError(''); }} className="mt-3 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 font-mono text-sm" spellCheck={false}/>
      </div>
      <label className="block text-sm font-medium">
        Or open a CSV file
        <input type="file" accept=".csv,text/csv" className="mt-2 block w-full text-sm" onChange={async e => {
          const file = e.target.files?.[0]; if (!file) return;
          if (file.size > 5 * 1024 * 1024) { setError('Choose a CSV file smaller than 5 MB.'); return; }
          setCsv(await file.text()); setError('');
        }}/>
      </label>
      {(error || result.error) && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error || result.error}</p>}
      <div className="flex flex-wrap items-center gap-4">
        <button type="button" disabled={!canDownload} onClick={download} className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-50">Download contacts.vcf</button>
        <span className="text-sm text-[var(--muted-foreground)]">{result.contacts.length} contact{result.contacts.length === 1 ? '' : 's'} ready</span>
      </div>
      {canDownload && <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b border-[var(--border)]"><th className="p-3">Name</th><th className="p-3">Phone</th><th className="p-3">Email</th></tr></thead>
          <tbody>{result.contacts.slice(0, 5).map((c, i) => <tr key={i} className="border-b border-[var(--border)] last:border-0">
            <td className="p-3">{pick(c, 'full') || [pick(c, 'first'), pick(c, 'last')].join(' ').trim() || 'Unnamed contact'}</td><td className="p-3">{pick(c, 'phone')}</td><td className="p-3">{pick(c, 'email')}</td>
          </tr>)}</tbody>
        </table>
      </div>}
      <p className="text-xs text-[var(--muted-foreground)]">Outputs a vCard 3.0 file for importing into supported contacts applications. Review contact fields after import. This tool supports one main phone number and email address per CSV row.</p>
    </section>
  );
}
