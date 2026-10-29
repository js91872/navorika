'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Network,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  ArrowDownUp,
  Download,
  Upload,
  Search,
  Binary,
  RotateCcw,
  ShieldCheck,
  KeyRound,
  Fingerprint,
  Plus,
  ArrowRight,
} from 'lucide-react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import cronstrue from 'cronstrue/i18n';
import { CronExpressionParser } from 'cron-parser';
import { calculateCidrSubnet } from '@/lib/calculations/cidrSubnet';
import { calculateIpRange, allocateVlsm, type VlsmRequest } from '@/lib/calculations/networkExpansion';
import { calculateUnicodeBytes } from '@/lib/calculations/unicodeBytes';
import {
  calculateGlacierRetrieval,
  type GlacierRetrievalTier,
  type GlacierStorageClass,
} from '@/lib/calculations/awsGlacierRetrieval';
import { beautifyCode, minifyCode, type CodeLanguage, type BeautifyIndent } from '@/lib/formatters/codeMinifier';
import {
  formatSqlCode,
  validateAndFormatXml,
  validateAndFormatYaml,
  SQL_DIALECTS,
  type MarkupLanguage,
  type MarkupIndent,
} from '@/lib/formatters/markupFormatter';
import type { SqlLanguage } from 'sql-formatter';
import { getToolIcon } from '@/lib/toolIcons';
import { localizedPath, type Locale, type TranslatedTool } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { fieldClass } from './ToolControls';

const UlidGeneratorTool = dynamic(() => import('@/components/tools/identifiers/UlidGeneratorTool'));
const CronExpressionGeneratorTool = dynamic(() => import('@/components/tools/cron/CronExpressionGeneratorTool'));
const CronNextRunCalculator = dynamic(() => import('@/components/tools/CronNextRunCalculator'));
const EpochTimeConverterTool = dynamic(() => import('@/components/tools/time/EpochTimeConverterTool'));
const BinaryToDecimalTool = dynamic(() => import('@/components/tools/number-systems/BinaryToDecimalTool'));
const GitignoreGenerator = dynamic(() => import('@/components/tools/GitignoreGenerator'));
const DockerRunGenerator = dynamic(() => import('@/components/tools/DockerRunGenerator'));
const GitCommitFormatter = dynamic(() => import('@/components/tools/GitCommitFormatter'));
const TypescriptToZodConverter = dynamic(() => import('@/components/tools/TypescriptToZodConverter'));
const PsdToHtmlTool = dynamic(() => import('@/components/tools/PsdToHtmlTool'));
const StepTo3dPdfTool = dynamic(() => import('@/components/tools/cad/StepTo3dPdfTool'));

export type DevToolSlug =
  | 'cidr-subnet-wildcard-calculator'
  | 'ip-range-calculator'
  | 'vlsm-subnet-calculator'
  | 'mac-address-generator'
  | 'http-status-code-lookup'
  | 'url-encoder-decoder'
  | 'html-entity-encoder-decoder'
  | 'base64-encoder'
  | 'jwt-decoder'
  | 'utf8-vs-utf16-byte-calculator'
  | 'aws-glacier-retrieval-calculator'
  | 'webmaster-seo-builder'
  | 'web-crypto-studio'
  | 'qr-code-generator'
  | 'code-minifier-beautifier'
  | 'uuid-generator'
  | 'ulid-generator'
  | 'cron-expression-generator'
  | 'cron-expression-humanizer'
  | 'cron-next-run-calculator'
  | 'epoch-time-converter'
  | 'binary-to-decimal-with-steps'
  | 'gitignore-generator'
  | 'docker-run-command-generator'
  | 'git-commit-message-formatter'
  | 'typescript-to-zod-schema-converter'
  | 'markup-formatter'
  | 'psd-to-html'
  | 'step-to-3d-pdf-converter'
  | 'developer-utils';

interface Props {
  slug: DevToolSlug;
  locale: Locale;
  dictionary: Dictionary;
}

// -------------------------------------------------------------
// 1. CIDR, Subnet & Wildcard Calculator
// -------------------------------------------------------------
function LocalizedCidrSubnet({ dictionary, locale }: { dictionary: Dictionary; locale: Locale }) {
  const [input, setInput] = useState('192.168.1.0/27');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const result = useMemo(() => calculateCidrSubnet(input), [input]);
  const t = dictionary.devTools;

  const copy = (val: string, key: string) => {
    void navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const rows: [string, string][] = result.valid
    ? [
        ['IP Address', result.ipAddress ?? ''],
        ['CIDR Prefix', result.cidr != null ? `/${result.cidr}` : ''],
        ['Subnet Mask', result.subnetMask ?? ''],
        ['Wildcard Mask', result.wildcardMask ?? ''],
        ['Network Address', result.networkAddress ?? ''],
        ['Broadcast Address', result.broadcastAddress ?? ''],
        ['First Host', result.firstHost ?? ''],
        ['Last Host', result.lastHost ?? ''],
        ['Total Addresses', result.totalAddresses?.toLocaleString(locale) ?? ''],
        ['Usable Hosts', result.usableHosts?.toLocaleString(locale) ?? ''],
      ]
    : [];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(340px,1.15fr)]">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7">
        <div className="flex items-center gap-3">
          <Network className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-bold">IPv4 CIDR</h2>
        </div>
        <label className="mt-6 block text-sm font-semibold">
          {t.input}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            dir="ltr"
            className={`${fieldClass} mt-2 font-mono`}
            placeholder="192.168.1.0/24"
          />
        </label>
        {!result.valid && <p role="alert" className="mt-3 text-sm font-semibold text-red-600">{result.error}</p>}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {['10.0.0.0/8', '172.16.0.0/16', '192.168.1.0/24', '192.168.1.0/27'].map((preset) => (
            <button
              key={preset}
              type="button"
              dir="ltr"
              onClick={() => setInput(preset)}
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-semibold font-mono transition hover:border-indigo-500"
            >
              {preset}
            </button>
          ))}
        </div>
      </section>

      <aside className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
          {t.output}
        </h2>
        {result.valid ? (
          <>
            <p dir="ltr" className="mt-2 font-mono text-3xl font-black text-indigo-600 dark:text-indigo-400">
              {result.networkAddress}/{result.cidr}
            </p>
            <dl className="mt-6 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] px-4">
              {rows.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-sm text-[var(--muted-foreground)]">{label}</dt>
                  <dd dir="ltr" className="flex items-center gap-2 font-mono text-sm font-bold">
                    <span>{value}</span>
                    {typeof value === 'string' && (
                      <button
                        type="button"
                        onClick={() => copy(value, label)}
                        aria-label={`Copy ${label}`}
                        className="text-[var(--muted-foreground)] hover:text-indigo-600"
                      >
                        {copiedKey === label ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                      </button>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted-foreground)]">Cisco Wildcard</p>
              <code dir="ltr" className="mt-2 block font-mono text-sm">{result.networkAddress} {result.wildcardMask}</code>
            </div>
            <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted-foreground)]">Binary Mask</p>
              <code dir="ltr" className="mt-2 block break-all font-mono text-xs leading-6">{result.binaryMask}</code>
            </div>
          </>
        ) : (
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">Enter a valid IPv4 prefix.</p>
        )}
      </aside>
    </div>
  );
}

// -------------------------------------------------------------
// 2. IP Range Calculator
// -------------------------------------------------------------
function LocalizedIpRange({ dictionary, locale }: { dictionary: Dictionary; locale: Locale }) {
  const [start, setStart] = useState('192.168.1.1');
  const [end, setEnd] = useState('192.168.1.254');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => calculateIpRange(start, end), [start, end]);
  const t = dictionary.devTools;

  const copyBlocks = () => {
    if (!result.valid) return;
    void navigator.clipboard.writeText(result.exactCidrs.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <h2 className="text-xl font-bold">{t.input}</h2>
        <div className="mt-5 space-y-4">
          <label className="block text-sm font-semibold">
            Start Address
            <input
              value={start}
              onChange={(e) => setStart(e.target.value)}
              dir="ltr"
              className={`${fieldClass} mt-2 font-mono`}
            />
          </label>
          <label className="block text-sm font-semibold">
            End Address
            <input
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              dir="ltr"
              className={`${fieldClass} mt-2 font-mono`}
            />
          </label>
        </div>
        {!result.valid && <p role="alert" className="mt-4 text-sm font-semibold text-red-600">{result.error}</p>}
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <h2 className="text-xl font-bold">{t.output}</h2>
        {result.valid ? (
          <>
            <dl className="mt-4 space-y-3">
              {[
                ['Start', result.start],
                ['End', result.end],
                ['Total Addresses', result.count.toLocaleString(locale)],
                ['Smallest Enclosing CIDR', result.containingCidr],
              ].map(([lbl, val]) => (
                <div key={lbl} className="flex justify-between gap-4 border-b border-[var(--border)] py-2 text-sm">
                  <dt className="text-[var(--muted-foreground)]">{lbl}</dt>
                  <dd dir="ltr" className="font-mono font-bold">{val}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex items-center justify-between">
              <h3 className="font-bold text-sm">Exact CIDR Blocks</h3>
              <button
                type="button"
                onClick={copyBlocks}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                {copied ? t.copied : t.copy}
              </button>
            </div>
            <pre dir="ltr" className="mt-3 max-h-64 overflow-auto rounded-xl bg-[var(--background)] p-4 font-mono text-xs">
              {result.exactCidrs.join('\n')}
            </pre>
          </>
        ) : (
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">Specify valid IPv4 range endpoints.</p>
        )}
      </section>
    </div>
  );
}

// -------------------------------------------------------------
// 3. VLSM Subnet Calculator
// -------------------------------------------------------------
const initialVlsm: VlsmRequest[] = [
  { id: '1', name: 'Users', hosts: 100 },
  { id: '2', name: 'Servers', hosts: 50 },
  { id: '3', name: 'Voice', hosts: 20 },
  { id: '4', name: 'Management', hosts: 10 },
];

function LocalizedVlsmSubnet({ dictionary, locale }: { dictionary: Dictionary; locale: Locale }) {
  const [parent, setParent] = useState('192.168.0.0/24');
  const [rows, setRows] = useState<VlsmRequest[]>(initialVlsm);

  const result = useMemo(() => allocateVlsm(parent, rows), [parent, rows]);
  const t = dictionary.devTools;

  const update = (id: string, key: 'name' | 'hosts', value: string) => {
    setRows((items) =>
      items.map((it) => (it.id === id ? { ...it, [key]: key === 'hosts' ? Number(value) : value } : it))
    );
  };

  const addRow = () => {
    setRows((items) => [...items, { id: crypto.randomUUID(), name: `Subnet ${items.length + 1}`, hosts: 10 }]);
  };

  const removeRow = (id: string) => {
    setRows((items) => items.filter((it) => it.id !== id));
  };

  return (
    <div className="space-y-6">
      <section className="min-w-0 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-6 shadow-sm">
        <label className="block text-sm font-semibold">
          Parent IPv4 CIDR
          <input
            value={parent}
            onChange={(e) => setParent(e.target.value)}
            dir="ltr"
            className={`${fieldClass} mt-2 w-full min-w-0 font-mono`}
          />
        </label>

        <div className="mt-5 space-y-3">
          {rows.map((row) => (
            <div key={row.id} className="grid min-w-0 grid-cols-[minmax(0,1fr)_80px_36px] sm:grid-cols-[minmax(0,1fr)_120px_40px] gap-2">
              <input
                value={row.name}
                onChange={(e) => update(row.id, 'name', e.target.value)}
                className="w-full min-w-0 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
              />
              <input
                type="number"
                min="1"
                step="1"
                value={row.hosts}
                onChange={(e) => update(row.id, 'hosts', e.target.value)}
                dir="ltr"
                className="w-full min-w-0 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-mono"
              />
              <button
                type="button"
                onClick={() => removeRow(row.id)}
                className="flex items-center justify-center text-slate-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addRow}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold transition hover:border-indigo-500"
        >
          <Plus className="h-4 w-4" /> {t.addNetwork}
        </button>

        {!result.valid && (
          <p role="alert" className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm font-semibold text-red-600">
            {result.error}
          </p>
        )}
      </section>

      {result.allocations && result.allocations.length > 0 && (
        <section className="min-w-0 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5 shadow-sm">
          <h2 className="text-xl font-bold">{t.output}</h2>
          <div className="mt-4 w-full min-w-0 overflow-x-auto">
            <table className="min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted-foreground)]">
                  <th className="p-3">Name</th>
                  <th className="p-3">Network</th>
                  <th className="p-3">Mask</th>
                  <th className="p-3">First Usable</th>
                  <th className="p-3">Last Usable</th>
                  <th className="p-3">Broadcast</th>
                  <th className="p-3">Capacity</th>
                  <th className="p-3">Waste</th>
                </tr>
              </thead>
              <tbody>
                {result.allocations.map((a) => (
                  <tr key={a.id} className="border-t border-[var(--border)]">
                    <td className="p-3 font-bold">{a.name}</td>
                    <td dir="ltr" className="p-3 font-mono">{a.network}/{a.prefix}</td>
                    <td dir="ltr" className="p-3 font-mono">{a.mask}</td>
                    <td dir="ltr" className="p-3 font-mono">{a.first}</td>
                    <td dir="ltr" className="p-3 font-mono">{a.last}</td>
                    <td dir="ltr" className="p-3 font-mono">{a.broadcast}</td>
                    <td dir="ltr" className="p-3">{a.capacity.toLocaleString(locale)}</td>
                    <td dir="ltr" className="p-3">{a.waste.toLocaleString(locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {result.valid && (
            <p className="mt-4 text-xs text-[var(--muted-foreground)]">
              Remaining Addresses: <strong dir="ltr">{result.remaining.toLocaleString(locale)}</strong>
            </p>
          )}
        </section>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 4. MAC Address Generator
// -------------------------------------------------------------
type MacSeparator = ':' | '-' | '';

function createMac(uppercase: boolean, sep: MacSeparator, local: boolean) {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  bytes[0] = (bytes[0] & 0xfe) | (local ? 0x02 : 0);
  const parts = [...bytes].map((b) => b.toString(16).padStart(2, '0'));
  const text = parts.join(sep);
  return uppercase ? text.toUpperCase() : text.toLowerCase();
}

function LocalizedMacGenerator({ dictionary }: { dictionary: Dictionary }) {
  const [count, setCount] = useState(10);
  const [uppercase, setUppercase] = useState(true);
  const [separator, setSeparator] = useState<MacSeparator>(':');
  const [local, setLocal] = useState(true);
  const [addresses, setAddresses] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const t = dictionary.devTools;

  const generate = () => {
    const qty = Math.min(100, Math.max(1, Math.floor(count)));
    setAddresses(Array.from({ length: qty }, () => createMac(uppercase, separator, local)));
  };

  const copyItem = (addr: string, idx: number) => {
    void navigator.clipboard.writeText(addr);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm font-semibold">
          Count (1–100)
          <input
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            dir="ltr"
            className={`${fieldClass} mt-2 font-mono`}
          />
        </label>
        <label className="text-sm font-semibold">
          Case
          <select
            value={uppercase ? 'upper' : 'lower'}
            onChange={(e) => setUppercase(e.target.value === 'upper')}
            className={`${fieldClass} mt-2`}
          >
            <option value="upper">Uppercase (AA:BB:CC)</option>
            <option value="lower">Lowercase (aa:bb:cc)</option>
          </select>
        </label>
        <label className="text-sm font-semibold">
          Delimiter
          <select
            value={separator}
            onChange={(e) => setSeparator(e.target.value as MacSeparator)}
            className={`${fieldClass} mt-2`}
          >
            <option value=":">Colon (:)</option>
            <option value="-">Hyphen (-)</option>
            <option value="">None</option>
          </select>
        </label>
        <div className="flex flex-col justify-end space-y-2 pt-2 text-sm">
          <label className="flex items-center gap-2 cursor-pointer font-medium">
            <input type="checkbox" checked={local} onChange={(e) => setLocal(e.target.checked)} className="rounded" />
            Locally Administered Bit
          </label>
        </div>
      </div>

      <button
        type="button"
        onClick={generate}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white shadow transition hover:bg-indigo-700"
      >
        <RefreshCw className="h-4 w-4" /> {t.generate}
      </button>

      {addresses.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <h3 className="font-bold text-sm">{t.output} ({addresses.length})</h3>
            <button
              type="button"
              onClick={() => void navigator.clipboard.writeText(addresses.join('\n'))}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              <Copy className="h-4 w-4" /> {t.copyAll}
            </button>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {addresses.map((address, index) => (
              <button
                key={`${address}-${index}`}
                type="button"
                onClick={() => copyItem(address, index)}
                dir="ltr"
                className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 text-left font-mono text-sm transition hover:border-indigo-500"
              >
                <span>{address}</span>
                {copiedIndex === index ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-slate-400" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

// -------------------------------------------------------------
// 5. HTTP Status Code Lookup
// -------------------------------------------------------------
const HTTP_CODES = [
  [100, 'Continue', 'Server received headers; client may send body.', 'Body negotiation', 'Intermediaries handle invisibly.'],
  [101, 'Switching Protocols', 'Server is changing protocols.', 'WebSocket handshakes', 'Requires Upgrade header.'],
  [200, 'OK', 'Request succeeded.', 'Standard GET/POST', 'Use specific 2xx when applicable.'],
  [201, 'Created', 'A new resource was created.', 'Resource creation', 'Include Location header.'],
  [202, 'Accepted', 'Request accepted for background execution.', 'Asynchronous jobs', 'Processing may fail later.'],
  [204, 'No Content', 'Success without response body.', 'DELETE/PUT updates', 'Must not include message body.'],
  [206, 'Partial Content', 'Response contains requested byte range.', 'Media streaming and resume', 'Requires Range headers.'],
  [301, 'Moved Permanently', 'Resource has permanent new URL.', 'Permanent redirect', 'May change POST to GET.'],
  [302, 'Found', 'Resource temporarily at another URL.', 'Temporary redirect', 'Method change may occur.'],
  [304, 'Not Modified', 'Cached copy is fresh.', 'Conditional GET', 'Does not include response body.'],
  [307, 'Temporary Redirect', 'Temporary redirect preserving method and body.', 'API redirects', 'Preserves POST body.'],
  [308, 'Permanent Redirect', 'Permanent redirect preserving method and body.', 'API migrations', 'Preserves POST body.'],
  [400, 'Bad Request', 'Malformed request syntax.', 'Validation errors', 'Do not leak sensitive internals.'],
  [401, 'Unauthorized', 'Authentication required or invalid.', 'Missing credentials', 'Means unauthenticated.'],
  [403, 'Forbidden', 'Server refuses authorized request.', 'Permission denial', 'Do not use when login needed.'],
  [404, 'Not Found', 'Target resource does not exist.', 'Missing routes', 'Can conceal secret resources.'],
  [405, 'Method Not Allowed', 'Method unsupported for route.', 'GET only endpoints', 'Provide Allow header.'],
  [408, 'Request Timeout', 'Server timed out waiting for client.', 'Idle client socket', 'Distinct from 504 gateway.'],
  [409, 'Conflict', 'Request conflicts with resource state.', 'Version conflicts', 'Include conflict detail.'],
  [410, 'Gone', 'Resource permanently deleted.', 'Retired APIs', 'Stronger permanence than 404.'],
  [413, 'Content Too Large', 'Request payload exceeds limits.', 'File upload size', 'Formerly Payload Too Large.'],
  [415, 'Unsupported Media Type', 'Content-Type unsupported.', 'Format mismatch', 'Specify allowed types.'],
  [422, 'Unprocessable Content', 'Syntax valid but semantic failure.', 'Validation failure', 'Formerly Unprocessable Entity.'],
  [429, 'Too Many Requests', 'Client rate limit exceeded.', 'API throttling', 'Include Retry-After header.'],
  [500, 'Internal Server Error', 'Unexpected server crash.', 'Unhandled exceptions', 'Mask internal traces.'],
  [501, 'Not Implemented', 'Server lacks execution capability.', 'Unsupported verbs', 'Not for temporary outages.'],
  [502, 'Bad Gateway', 'Invalid response from upstream server.', 'Proxy/gateway errors', 'Check upstream health.'],
  [503, 'Service Unavailable', 'Temporary server maintenance or overload.', 'Downtime maintenance', 'Provide Retry-After.'],
  [504, 'Gateway Timeout', 'Upstream server timed out.', 'Slow backend API', 'Check network connectivity.'],
] as const;

function LocalizedHttpStatusLookup({ dictionary }: { dictionary: Dictionary }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  const t = dictionary.devTools;

  const filtered = useMemo(() => {
    return HTTP_CODES.filter((item) => {
      const matchCat = category === 'all' || String(item[0]).startsWith(category);
      const text = `${item[0]} ${item[1]} ${item[2]} ${item[3]}`.toLowerCase();
      return matchCat && text.includes(query.toLowerCase());
    });
  }, [query, category]);

  return (
    <section className="space-y-6">
      <div className="grid gap-4 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:grid-cols-[1fr_220px]">
        <label className="text-sm font-semibold">
          {t.search}
          <div className="relative mt-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`${fieldClass} pl-10`}
              placeholder="e.g. 404, redirect, timeout..."
            />
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          </div>
        </label>
        <label className="text-sm font-semibold">
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${fieldClass} mt-2`}
          >
            <option value="all">{t.all} (1xx - 5xx)</option>
            <option value="1">1xx Informational</option>
            <option value="2">2xx Success</option>
            <option value="3">3xx Redirection</option>
            <option value="4">4xx Client Error</option>
            <option value="5">5xx Server Error</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map(([code, phrase, meaning, use, caveat]) => (
          <article
            key={code}
            className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {String(code)[0]}xx Standard HTTP
              </p>
              <h3 className="mt-1 font-mono text-xl font-black">
                {code} {phrase}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{meaning}</p>
            </div>
            <div className="mt-4 border-t border-[var(--border)] pt-3 text-xs space-y-1 text-[var(--muted-foreground)]">
              <p><strong>Use:</strong> {use}</p>
              <p><strong>Caveat:</strong> {caveat}</p>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && <p className="text-center text-sm text-[var(--muted-foreground)]">No matching HTTP status codes.</p>}
    </section>
  );
}

// -------------------------------------------------------------
// 6. URL Encoder & Decoder
// -------------------------------------------------------------
function LocalizedUrlEncoder({ dictionary }: { dictionary: Dictionary }) {
  const [input, setInput] = useState('hello world?tag=one&tag=two');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [component, setComponent] = useState(true);
  const [copied, setCopied] = useState(false);

  const t = dictionary.devTools;

  const result = useMemo(() => {
    try {
      const out =
        mode === 'encode'
          ? component ? encodeURIComponent(input) : encodeURI(input)
          : component ? decodeURIComponent(input) : decodeURI(input);
      return { output: out, error: '' };
    } catch {
      return { output: '', error: 'Malformed percent-encoding string.' };
    }
  }, [input, mode, component]);

  const copy = () => {
    if (!result.output) return;
    void navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const swap = () => {
    if (result.output) {
      setInput(result.output);
      setMode(mode === 'encode' ? 'decode' : 'encode');
    }
  };

  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold">
            Mode:
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as 'encode' | 'decode')}
              className="ml-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-bold"
            >
              <option value="encode">{t.encode}</option>
              <option value="decode">{t.decode}</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={component}
              onChange={(e) => setComponent(e.target.checked)}
              className="rounded"
            />
            Component Mode (Escape Delimiters)
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={swap}
            disabled={!result.output || !!result.error}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-semibold hover:border-indigo-500 disabled:opacity-50"
          >
            <ArrowDownUp className="h-3.5 w-3.5" /> {t.swap}
          </button>
          <button
            type="button"
            onClick={() => setInput('')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-semibold hover:border-red-500 hover:text-red-500"
          >
            <Trash2 className="h-3.5 w-3.5" /> {t.clear}
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
            {t.input}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            dir="ltr"
            className="h-56 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-xs outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              {t.output}
            </span>
            <button
              type="button"
              onClick={copy}
              disabled={!result.output}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 disabled:opacity-50"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? t.copied : t.copy}
            </button>
          </div>
          <textarea
            value={result.output}
            readOnly
            dir="ltr"
            className="h-56 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-xs outline-none"
          />
        </div>
      </div>
      {result.error && <p role="alert" className="mt-3 text-sm font-semibold text-red-600">{result.error}</p>}
    </section>
  );
}

// -------------------------------------------------------------
// 7. HTML Entity Encoder & Decoder
// -------------------------------------------------------------
const encodeHtml = (str: string, numeric: boolean) =>
  [...str]
    .map((c) => {
      if (numeric && (c.codePointAt(0) ?? 0) > 127) return `&#${c.codePointAt(0)};`;
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[c] ?? c;
    })
    .join('');

const decodeHtml = (str: string) => {
  if (typeof DOMParser !== 'undefined') {
    const doc = new DOMParser().parseFromString(str, 'text/html');
    return doc.documentElement.textContent || '';
  }
  return str;
};

function LocalizedHtmlEntityEncoder({ dictionary }: { dictionary: Dictionary }) {
  const [input, setInput] = useState('<p title="Tea & biscuits">Café</p>');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [numeric, setNumeric] = useState(false);
  const [copied, setCopied] = useState(false);

  const t = dictionary.devTools;
  const output = useMemo(() => (mode === 'encode' ? encodeHtml(input, numeric) : decodeHtml(input)), [input, mode, numeric]);

  const copy = () => {
    if (!output) return;
    void navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const swap = () => {
    setInput(output);
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-semibold">
            Mode:
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as 'encode' | 'decode')}
              className="ml-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-bold"
            >
              <option value="encode">{t.encode}</option>
              <option value="decode">{t.decode}</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={numeric}
              onChange={(e) => setNumeric(e.target.checked)}
              disabled={mode === 'decode'}
              className="rounded"
            />
            Encode non-ASCII as Numeric Entities
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={swap}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-semibold hover:border-indigo-500"
          >
            <ArrowDownUp className="h-3.5 w-3.5" /> {t.swap}
          </button>
          <button
            type="button"
            onClick={() => setInput('')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-semibold hover:border-red-500 hover:text-red-500"
          >
            <Trash2 className="h-3.5 w-3.5" /> {t.clear}
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
            {t.input}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            dir="ltr"
            className="h-56 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-xs outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              {t.output}
            </span>
            <button
              type="button"
              onClick={copy}
              disabled={!output}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 disabled:opacity-50"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? t.copied : t.copy}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            dir="ltr"
            className="h-56 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-xs outline-none"
          />
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// 8. Base64 Encoder & Decoder
// -------------------------------------------------------------
function encodeUtf8Base64(val: string) {
  const bytes = new TextEncoder().encode(val);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function decodeUtf8Base64(val: string) {
  const binary = atob(val.replace(/\s/g, ''));
  const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

function LocalizedBase64Encoder({ dictionary }: { dictionary: Dictionary }) {
  const [input, setInput] = useState('Hello World! 🚀');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const t = dictionary.devTools;

  const { output, error } = useMemo(() => {
    if (!input) return { output: '', error: '' };
    try {
      const res = mode === 'encode' ? encodeUtf8Base64(input) : decodeUtf8Base64(input);
      return { output: res, error: '' };
    } catch {
      return { output: '', error: 'Invalid Base64 sequence.' };
    }
  }, [input, mode]);

  const copy = () => {
    if (!output) return;
    void navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const swap = () => {
    if (output) {
      setInput(output);
      setMode(mode === 'encode' ? 'decode' : 'encode');
    }
  };

  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode('encode')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              mode === 'encode' ? 'bg-indigo-600 text-white' : 'border border-[var(--border)] hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Text ➔ Base64
          </button>
          <button
            type="button"
            onClick={() => setMode('decode')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              mode === 'decode' ? 'bg-indigo-600 text-white' : 'border border-[var(--border)] hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Base64 ➔ Text
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={swap}
            disabled={!output || !!error}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-semibold hover:border-indigo-500 disabled:opacity-50"
          >
            <ArrowDownUp className="h-3.5 w-3.5" /> {t.swap}
          </button>
          <button
            type="button"
            onClick={() => setInput('')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-semibold hover:border-red-500 hover:text-red-500"
          >
            <Trash2 className="h-3.5 w-3.5" /> {t.clear}
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
            {t.input}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            dir="ltr"
            className="h-56 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-xs outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              {t.output}
            </span>
            <button
              type="button"
              onClick={copy}
              disabled={!output}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 disabled:opacity-50"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? t.copied : t.copy}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            dir="ltr"
            className="h-56 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-xs outline-none"
          />
        </div>
      </div>
      {error && <p role="alert" className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
    </section>
  );
}

// -------------------------------------------------------------
// 9. JWT Decoder
// -------------------------------------------------------------
function decodeBase64Url(str: string) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(pad);
  const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

function LocalizedJwtDecoder({ dictionary }: { dictionary: Dictionary }) {
  const [token, setToken] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const t = dictionary.devTools;

  const decoded = useMemo(() => {
    if (!token.trim()) return null;
    try {
      const parts = token.trim().split('.');
      if (parts.length !== 3) throw new Error('JWT must have 3 segments separated by dots.');
      const header = JSON.parse(decodeBase64Url(parts[0]));
      const payload = JSON.parse(decodeBase64Url(parts[1]));
      return { header, payload, error: '' };
    } catch (err) {
      return { header: null, payload: null, error: err instanceof Error ? err.message : 'Invalid JWT token.' };
    }
  }, [token]);

  const copy = (val: unknown, key: string) => {
    void navigator.clipboard.writeText(JSON.stringify(val, null, 2));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7">
        <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
          Encoded JWT Token
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            dir="ltr"
            placeholder="Paste eyJhbGciOi... JWT here"
            className="mt-2 h-32 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-xs outline-none focus:border-indigo-500"
          />
        </label>
        {decoded?.error && <p role="alert" className="mt-3 text-sm font-semibold text-red-600">{decoded.error}</p>}
      </section>

      {decoded?.header && decoded?.payload && (
        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="font-bold text-sm text-red-500">Header: Algorithm & Token Type</h3>
              <button
                type="button"
                onClick={() => copy(decoded.header, 'header')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                {copiedKey === 'header' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedKey === 'header' ? t.copied : t.copy}
              </button>
            </div>
            <pre dir="ltr" className="mt-4 max-h-80 overflow-auto font-mono text-xs text-red-600 dark:text-red-400">
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </section>

          <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="font-bold text-sm text-purple-500">Payload: Claims</h3>
              <button
                type="button"
                onClick={() => copy(decoded.payload, 'payload')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                {copiedKey === 'payload' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedKey === 'payload' ? t.copied : t.copy}
              </button>
            </div>
            <pre dir="ltr" className="mt-4 max-h-80 overflow-auto font-mono text-xs text-purple-600 dark:text-purple-400">
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>
          </section>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 10. UTF-8 vs UTF-16 Byte Calculator
// -------------------------------------------------------------
const UNICODE_PRESETS = [
  { label: 'Hello 🌍', text: 'Hello 🌍' },
  { label: 'Pure ASCII', text: 'The quick brown fox jumps over the lazy dog.' },
  { label: 'Accented Latin', text: 'café crème résumé voilà' },
  { label: 'Chinese CJK', text: '你好世界，欢迎来到开源世界' },
  { label: 'Emoji Trio', text: '🚀 ✨ 💡' },
  { label: 'Hindi Devanagari', text: 'नमस्ते भारत और दुनिया' },
];

function LocalizedUnicodeByte({ dictionary }: { dictionary: Dictionary }) {
  const [text, setText] = useState('Hello 🌍');
  const [includeBom, setIncludeBom] = useState(false);
  const [copied, setCopied] = useState(false);

  const t = dictionary.devTools;
  const result = useMemo(() => calculateUnicodeBytes(text, includeBom), [text, includeBom]);

  const rows = [
    ['Text Length (UTF-16 Code Units)', `${result.utf16CodeUnits}`],
    ['Unicode Code Points', `${result.characters}`],
    ['UTF-8 Byte Count', `${result.utf8Bytes} bytes`],
    ['UTF-16 Byte Count', `${result.utf16Bytes} bytes`],
    ['Byte Difference (UTF-8 − UTF-16)', `${result.difference > 0 ? `+${result.difference}` : result.difference} bytes`],
    ['Smaller Encoding', result.smallerEncoding],
  ] as const;

  const copySummary = () => {
    const summary = rows.map(([k, v]) => `${k}: ${v}`).join('\n');
    void navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-3">
            <Binary className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-bold">{t.input}</h2>
          </div>
          <button
            type="button"
            onClick={() => { setText('Hello 🌍'); setIncludeBom(false); }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted-foreground)] hover:text-indigo-600"
          >
            <RotateCcw className="h-3.5 w-3.5" /> {t.reset}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {UNICODE_PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setText(p.text)}
              className="rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-semibold hover:border-indigo-500"
            >
              {p.label}
            </button>
          ))}
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mt-4 h-48 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 text-sm outline-none focus:border-indigo-500"
        />

        <label className="mt-3 flex items-center gap-2 text-xs font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={includeBom}
            onChange={(e) => setIncludeBom(e.target.checked)}
            className="rounded"
          />
          Include Byte Order Mark (BOM)
        </label>
      </section>

      <aside className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--muted-foreground)]">{t.output}</h2>
          <button
            type="button"
            onClick={copySummary}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? t.copied : t.copy}
          </button>
        </div>

        <dl className="mt-4 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] px-4">
          {rows.map(([lbl, val]) => (
            <div key={lbl} className="flex items-center justify-between gap-4 py-3 text-sm">
              <dt className="text-[var(--muted-foreground)]">{lbl}</dt>
              <dd dir="ltr" className="font-mono font-bold text-slate-900 dark:text-white">{val}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </div>
  );
}

// -------------------------------------------------------------
// 11. AWS Glacier Retrieval Cost Calculator
// -------------------------------------------------------------
function LocalizedAwsGlacier({ dictionary, locale }: { dictionary: Dictionary; locale: Locale }) {
  const [storageClass, setStorageClass] = useState<GlacierStorageClass>('deep-archive');
  const [tier, setTier] = useState<GlacierRetrievalTier>('standard');
  const [dataGb, setDataGb] = useState('1000');
  const [objects, setObjects] = useState('10000');
  const [rateGb, setRateGb] = useState('0.02');
  const [requestRate, setRequestRate] = useState('0.10');
  const [restoreDays, setRestoreDays] = useState('1');
  const [temporaryRate, setTemporaryRate] = useState('0.023');
  const [includeTemp, setIncludeTemp] = useState(true);

  const t = dictionary.devTools;

  const result = useMemo(() => {
    return calculateGlacierRetrieval({
      dataGb: Math.max(0, Number(dataGb) || 0),
      objectCount: Math.max(0, Number(objects) || 0),
      storageClass,
      retrievalTier: tier,
      retrievalRatePerGb: Math.max(0, Number(rateGb) || 0),
      requestRatePerThousand: Math.max(0, Number(requestRate) || 0),
      restoreDays: Math.max(0, Number(restoreDays) || 0),
      temporaryStorageRatePerGbMonth: Math.max(0, Number(temporaryRate) || 0),
      includeTemporaryStorage: includeTemp,
    });
  }, [dataGb, objects, storageClass, tier, rateGb, requestRate, restoreDays, temporaryRate, includeTemp]);

  const currencyFmt = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' });

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7 space-y-5">
        <h2 className="text-xl font-bold">{t.input}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            Storage Class
            <select
              value={storageClass}
              onChange={(e) => {
                const val = e.target.value as GlacierStorageClass;
                setStorageClass(val);
                if (val === 'deep-archive' && tier === 'expedited') setTier('standard');
              }}
              className={`${fieldClass} mt-1`}
            >
              <option value="deep-archive">S3 Glacier Deep Archive</option>
              <option value="flexible">S3 Glacier Flexible Retrieval</option>
            </select>
          </label>
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            Retrieval Speed Tier
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value as GlacierRetrievalTier)}
              className={`${fieldClass} mt-1`}
            >
              {storageClass !== 'deep-archive' && <option value="expedited">Expedited (1–5 mins)</option>}
              <option value="standard">Standard (3–5 hours / 12 hours)</option>
              <option value="bulk">Bulk (5–12 hours / 48 hours)</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            Archive Volume (GB)
            <input
              type="number"
              min="0"
              value={dataGb}
              onChange={(e) => setDataGb(e.target.value)}
              dir="ltr"
              className={`${fieldClass} mt-1 font-mono`}
            />
          </label>
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            Object Count
            <input
              type="number"
              min="0"
              value={objects}
              onChange={(e) => setObjects(e.target.value)}
              dir="ltr"
              className={`${fieldClass} mt-1 font-mono`}
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            Data Retrieval Rate ($/GB)
            <input
              type="number"
              step="0.001"
              value={rateGb}
              onChange={(e) => setRateGb(e.target.value)}
              dir="ltr"
              className={`${fieldClass} mt-1 font-mono`}
            />
          </label>
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            Request Rate ($/1,000 reqs)
            <input
              type="number"
              step="0.01"
              value={requestRate}
              onChange={(e) => setRequestRate(e.target.value)}
              dir="ltr"
              className={`${fieldClass} mt-1 font-mono`}
            />
          </label>
        </div>

        <div className="border-t border-[var(--border)] pt-4 space-y-3">
          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={includeTemp}
              onChange={(e) => setIncludeTemp(e.target.checked)}
              className="rounded"
            />
            Include S3 Standard Temporary Storage Fee
          </label>
          {includeTemp && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                Restore Duration (Days)
                <input
                  type="number"
                  min="1"
                  value={restoreDays}
                  onChange={(e) => setRestoreDays(e.target.value)}
                  dir="ltr"
                  className={`${fieldClass} mt-1 font-mono`}
                />
              </label>
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                S3 Standard Rate ($/GB-mo)
                <input
                  type="number"
                  step="0.001"
                  value={temporaryRate}
                  onChange={(e) => setTemporaryRate(e.target.value)}
                  dir="ltr"
                  className={`${fieldClass} mt-1 font-mono`}
                />
              </label>
            </div>
          )}
        </div>
      </section>

      <aside className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--muted-foreground)]">{t.output}</h2>
        <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 text-center">
          <p className="text-xs font-bold text-[var(--muted-foreground)] uppercase">Total Estimated Restore Cost</p>
          <p dir="ltr" className="mt-2 text-4xl font-black text-indigo-600 dark:text-indigo-400">
            {currencyFmt.format(result.totalCost)}
          </p>
          <p className="mt-2 text-xs text-[var(--muted-foreground)]">Estimated Speed: {result.retrievalTime}</p>
        </div>

        <dl className="mt-6 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] px-4">
          {[
            ['Data Retrieval Fee', currencyFmt.format(result.retrievalCost)],
            ['Request Fee', currencyFmt.format(result.requestCost)],
            ['Temporary Storage Fee', currencyFmt.format(result.temporaryStorageCost)],
          ].map(([lbl, val]) => (
            <div key={lbl} className="flex justify-between gap-4 py-3 text-sm">
              <dt className="text-[var(--muted-foreground)]">{lbl}</dt>
              <dd dir="ltr" className="font-mono font-bold text-slate-900 dark:text-white">{val}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </div>
  );
}

// -------------------------------------------------------------
// 12. Webmaster SEO Tools Hub
// -------------------------------------------------------------
function LocalizedWebmasterHub({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const t = dictionary.devTools;

  const sections = [
    {
      title: 'Campaign & Search Engine Directive Utilities',
      slugs: ['utm-builder', 'meta-tag-generator', 'robots-txt-generator'],
    },
    {
      title: 'Web Text, Markup & Data Converters',
      slugs: ['url-encoder-decoder', 'html-entity-encoder-decoder', 'base64-encoder', 'jwt-decoder'],
    },
    {
      title: 'Code Processing & Cryptographic Utilities',
      slugs: ['qr-code-generator', 'code-minifier-beautifier', 'web-crypto-studio'],
    },
  ];

  return (
    <div className="space-y-10">
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6">
        <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <span>{t.hubTitle}</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-emerald-900/90 dark:text-emerald-200/90">
          {t.hubDescription}
        </p>
      </div>

      {sections.map((section) => (
        <div key={section.title} className="space-y-4">
          <h2 className="border-b border-[var(--border)] pb-2 text-lg font-bold text-slate-900 dark:text-white">
            {section.title}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {section.slugs.map((toolSlug) => {
              const meta = dictionary.tools[toolSlug as TranslatedTool];
              if (!meta) return null;
              return (
                <Link
                  key={toolSlug}
                  href={localizedPath(locale, toolSlug as TranslatedTool)}
                  className="group flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:border-indigo-500 hover:shadow-md"
                >
                  <div>
                    <h3 className="font-bold text-slate-900 transition group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                      {meta.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[var(--muted-foreground)]">
                      {meta.description}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    <span>Open</span>
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// -------------------------------------------------------------
// 13. Web Crypto Studio
// -------------------------------------------------------------
const PWD_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*_-+=';

function generateRandomPassword(length: number) {
  const out: string[] = [];
  const limit = Math.floor(0x100000000 / PWD_ALPHABET.length) * PWD_ALPHABET.length;
  while (out.length < length) {
    const vals = new Uint32Array(length - out.length);
    crypto.getRandomValues(vals);
    for (const val of vals) {
      if (val < limit) out.push(PWD_ALPHABET[val % PWD_ALPHABET.length]);
      if (out.length === length) break;
    }
  }
  return out.join('');
}

function LocalizedWebCrypto({ dictionary }: { dictionary: Dictionary }) {
  const [hashInput, setHashInput] = useState('Navorika Secure String');
  const [hash, setHash] = useState('');
  const [pwdLength, setPwdLength] = useState(20);
  const [password, setPassword] = useState('NavorikaSecurePass2026!');
  const [uuid, setUuid] = useState('00000000-0000-4000-8000-000000000000');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const t = dictionary.devTools;

  useEffect(() => {
    if (typeof crypto !== 'undefined') {
      setPassword(generateRandomPassword(20));
      if (crypto.randomUUID) {
        setUuid(crypto.randomUUID());
      }
    }
  }, []);

  const makeHash = async () => {
    if (!hashInput) {
      setHash('');
      return;
    }
    try {
      const bytes = new TextEncoder().encode(hashInput);
      const digest = await crypto.subtle.digest('SHA-256', bytes);
      setHash(Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join(''));
    } catch {
      setHash('');
    }
  };

  const copy = (val: string, key: string) => {
    void navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2" suppressHydrationWarning>
      {/* SHA-256 Section */}
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="font-bold text-lg">SHA-256 Digest</h2>
          </div>
          <button
            type="button"
            onClick={() => void makeHash()}
            className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            {t.generate}
          </button>
        </div>
        <textarea
          value={hashInput}
          onChange={(e) => setHashInput(e.target.value)}
          dir="ltr"
          placeholder="Text to hash"
          className="h-28 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 font-mono text-xs outline-none focus:border-indigo-500"
        />
        <button
          type="button"
          onClick={() => void makeHash()}
          className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-700"
        >
          {t.generate} Hash
        </button>
        {hash && (
          <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
            <code dir="ltr" className="break-all font-mono text-xs">{hash}</code>
            <button
              type="button"
              onClick={() => copy(hash, 'hash')}
              className="ml-2 text-[var(--muted-foreground)] hover:text-indigo-600"
            >
              {copiedKey === 'hash' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        )}
      </section>

      {/* Password & UUID Section */}
      <div className="space-y-6">
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="font-bold text-lg">Cryptographic Password</h2>
            </div>
            <button
              type="button"
              onClick={() => setPassword(generateRandomPassword(pwdLength))}
              className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              <RefreshCw className="h-3.5 w-3.5 inline mr-1" /> {t.generate}
            </button>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="8"
              max="64"
              value={pwdLength}
              onChange={(e) => {
                const len = Number(e.target.value);
                setPwdLength(len);
                setPassword(generateRandomPassword(len));
              }}
              className="w-full cursor-pointer accent-indigo-600"
            />
            <span dir="ltr" className="font-mono text-xs font-bold">{pwdLength} chars</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
            <code dir="ltr" className="break-all font-mono text-xs" suppressHydrationWarning>{password}</code>
            <button
              type="button"
              onClick={() => copy(password, 'pwd')}
              className="ml-2 text-[var(--muted-foreground)] hover:text-indigo-600"
            >
              {copiedKey === 'pwd' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="font-bold text-lg">UUID v4 Identifier</h2>
            </div>
            <button
              type="button"
              onClick={() => { if (crypto.randomUUID) setUuid(crypto.randomUUID()); }}
              className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              <RefreshCw className="h-3.5 w-3.5 inline mr-1" /> {t.generate}
            </button>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
            <code dir="ltr" className="break-all font-mono text-xs" suppressHydrationWarning>{uuid}</code>
            <button
              type="button"
              onClick={() => copy(uuid, 'uuid')}
              className="ml-2 text-[var(--muted-foreground)] hover:text-indigo-600"
            >
              {copiedKey === 'uuid' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 14. QR Code Generator & Scanner
// -------------------------------------------------------------
function LocalizedQrCodeTool({ dictionary }: { dictionary: Dictionary }) {
  const [mode, setMode] = useState<'generate' | 'scan'>('generate');
  const [qrText, setQrText] = useState('https://navorika.com');
  const [qrColor, setQrColor] = useState('#000000');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [scanResult, setScanResult] = useState('');
  const [scanError, setScanError] = useState('');
  const [copied, setCopied] = useState(false);

  const t = dictionary.devTools;

  useEffect(() => {
    if (mode === 'generate' && qrText) {
      QRCode.toDataURL(qrText, {
        width: 360,
        margin: 2,
        color: { dark: qrColor, light: '#ffffff' },
      })
        .then((url) => setQrDataUrl(url))
        .catch(() => setQrDataUrl(''));
    }
  }, [qrText, qrColor, mode]);

  const handleScanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imgData.data, imgData.width, imgData.height);
        if (code) {
          setScanResult(code.data);
          setScanError('');
        } else {
          setScanResult('');
          setScanError('No QR code detected in this image.');
        }
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const copyScan = () => {
    if (!scanResult) return;
    void navigator.clipboard.writeText(scanResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <div className="flex gap-4 border-b border-[var(--border)] pb-4 mb-6">
        <button
          type="button"
          onClick={() => setMode('generate')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
            mode === 'generate' ? 'bg-indigo-600 text-white' : 'border border-[var(--border)] hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          {t.generate} QR Code
        </button>
        <button
          type="button"
          onClick={() => setMode('scan')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
            mode === 'scan' ? 'bg-indigo-600 text-white' : 'border border-[var(--border)] hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          Scan & Decode Image
        </button>
      </div>

      {mode === 'generate' ? (
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              {t.input}
              <textarea
                value={qrText}
                onChange={(e) => setQrText(e.target.value)}
                dir="ltr"
                className="mt-2 h-36 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-xs outline-none focus:border-indigo-500"
              />
            </label>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                QR Color
              </label>
              <input
                type="color"
                value={qrColor}
                onChange={(e) => setQrColor(e.target.value)}
                className="mt-2 h-10 w-24 cursor-pointer rounded-lg border border-[var(--border)] bg-[var(--background)] p-1"
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6">
            {qrDataUrl && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrDataUrl} alt="Generated QR code" className="h-56 w-56 rounded-xl bg-white p-2 shadow-sm" />
                <a
                  href={qrDataUrl}
                  download="navorika-qr-code.png"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white transition hover:bg-indigo-700"
                >
                  <Download className="h-4 w-4" /> {t.download}
                </a>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <label className="block border-2 border-dashed border-[var(--border)] rounded-2xl p-8 text-center cursor-pointer hover:border-indigo-500 transition">
            <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Click to upload QR image</span>
            <input type="file" accept="image/*" onChange={handleScanUpload} className="hidden" />
          </label>

          {scanResult && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  Decoded Content
                </span>
                <button
                  type="button"
                  onClick={copyScan}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-300"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? t.copied : t.copy}
                </button>
              </div>
              <p dir="ltr" className="break-all font-mono text-sm">{scanResult}</p>
            </div>
          )}
          {scanError && <p role="alert" className="text-sm font-semibold text-red-600">{scanError}</p>}
        </div>
      )}
    </section>
  );
}

// -------------------------------------------------------------
// 15. Code Minifier & Beautifier
// -------------------------------------------------------------
function LocalizedCodeMinifier({ dictionary }: { dictionary: Dictionary }) {
  const [lang, setLang] = useState<CodeLanguage>('javascript');
  const [input, setInput] = useState(
    'function calculateTotal(price,taxRate){\nconst tax=price*taxRate;\nreturn price+tax;\n}'
  );
  const [status, setStatus] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [processing, setProcessing] = useState(false);

  const t = dictionary.devTools;

  const handleBeautify = async (indent: BeautifyIndent) => {
    if (!input.trim()) return;
    setProcessing(true);
    const res = await beautifyCode(input, lang, indent);
    setProcessing(false);
    if (res.success) {
      setInput(res.output);
      setStatus(`Formatted ${lang.toUpperCase()} (${indent} spaces).`);
    } else {
      setStatus(res.error || 'Formatting failed.');
    }
  };

  const handleMinify = async () => {
    if (!input.trim()) return;
    setProcessing(true);
    const res = await minifyCode(input, lang);
    setProcessing(false);
    if (res.success) {
      setInput(res.output);
      setStatus(`Minified ${lang.toUpperCase()}.`);
    } else {
      setStatus(res.error || 'Minification failed.');
    }
  };

  const copy = () => {
    void navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold">
            Language:
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as CodeLanguage)}
              className="ml-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-bold"
            >
              <option value="javascript">JavaScript</option>
              <option value="css">CSS</option>
              <option value="html">HTML</option>
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleBeautify(2)}
            disabled={processing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-semibold transition hover:border-indigo-500 disabled:opacity-50"
          >
            {t.format} (2 sp)
          </button>
          <button
            type="button"
            onClick={() => handleBeautify(4)}
            disabled={processing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-semibold transition hover:border-indigo-500 disabled:opacity-50"
          >
            {t.format} (4 sp)
          </button>
          <button
            type="button"
            onClick={handleMinify}
            disabled={processing}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {t.minify}
          </button>
          <button
            type="button"
            onClick={copy}
            disabled={!input}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-semibold hover:border-indigo-500 disabled:opacity-50"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? t.copied : t.copy}
          </button>
          <button
            type="button"
            onClick={() => { setInput(''); setStatus(''); }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-semibold hover:border-red-500 hover:text-red-500"
          >
            <Trash2 className="h-3.5 w-3.5" /> {t.clear}
          </button>
        </div>
      </div>

      <div className="mt-5">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          dir="ltr"
          className="h-80 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-xs outline-none focus:border-indigo-500"
        />
      </div>
      {status && <p className="mt-3 text-xs font-semibold text-slate-600 dark:text-slate-300">{status}</p>}
    </section>
  );
}

// -------------------------------------------------------------
// 16. UUID Generator
// -------------------------------------------------------------
function LocalizedUuidGenerator({ dictionary }: { dictionary: Dictionary }) {
  const [version, setVersion] = useState<'v4' | 'v7'>('v7');
  const [quantity, setQuantity] = useState(10);
  const [format, setFormat] = useState<'standard' | 'compact' | 'braces'>('standard');
  const [casing, setCasing] = useState<'lowercase' | 'uppercase'>('lowercase');
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const t = dictionary.devTools;

  const generate = () => {
    const list: string[] = [];
    for (let i = 0; i < quantity; i++) {
      let raw: string;
      if (version === 'v7') {
        const bytes = new Uint8Array(16);
        crypto.getRandomValues(bytes);
        const timestamp = Date.now();
        bytes[0] = Math.floor(timestamp / 2 ** 40) & 0xff;
        bytes[1] = Math.floor(timestamp / 2 ** 32) & 0xff;
        bytes[2] = Math.floor(timestamp / 2 ** 24) & 0xff;
        bytes[3] = Math.floor(timestamp / 2 ** 16) & 0xff;
        bytes[4] = Math.floor(timestamp / 2 ** 8) & 0xff;
        bytes[5] = timestamp & 0xff;
        bytes[6] = (bytes[6] & 0x0f) | 0x70;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'));
        raw = [
          hex.slice(0, 4).join(''),
          hex.slice(4, 6).join(''),
          hex.slice(6, 8).join(''),
          hex.slice(8, 10).join(''),
          hex.slice(10, 16).join(''),
        ].join('-');
      } else {
        if (typeof crypto.randomUUID === 'function') {
          raw = crypto.randomUUID();
        } else {
          const bytes = new Uint8Array(16);
          crypto.getRandomValues(bytes);
          bytes[6] = (bytes[6] & 0x0f) | 0x40;
          bytes[8] = (bytes[8] & 0x3f) | 0x80;
          const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'));
          raw = [
            hex.slice(0, 4).join(''),
            hex.slice(4, 6).join(''),
            hex.slice(6, 8).join(''),
            hex.slice(8, 10).join(''),
            hex.slice(10, 16).join(''),
          ].join('-');
        }
      }

      if (format === 'compact') raw = raw.replaceAll('-', '');
      if (format === 'braces') raw = `{${raw}}`;
      list.push(casing === 'uppercase' ? raw.toUpperCase() : raw.toLowerCase());
    }
    setUuids(list);
  };

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, quantity, format, casing]);

  const copy = (text: string, key: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const downloadText = () => {
    if (!uuids.length) return;
    const blob = new Blob([uuids.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `uuid-${version}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(340px,1.15fr)]">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7 space-y-6">
        <div className="flex items-center gap-3">
          <Fingerprint className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-bold">UUID / GUID</h2>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Version</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(['v7', 'v4'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVersion(v)}
                className={`rounded-xl py-2.5 text-sm font-bold transition ${
                  version === v
                    ? 'bg-indigo-600 text-white'
                    : 'border border-[var(--border)] bg-[var(--background)] hover:border-indigo-500'
                }`}
              >
                UUID {v.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Count</label>
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className={`mt-2 ${fieldClass}`}
          >
            {[1, 5, 10, 25, 50, 100].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Format</label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(['standard', 'compact', 'braces'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFormat(f)}
                className={`rounded-xl py-2 text-xs font-semibold capitalize transition ${
                  format === f
                    ? 'bg-indigo-600 text-white'
                    : 'border border-[var(--border)] bg-[var(--background)] hover:border-indigo-500'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Case</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(['lowercase', 'uppercase'] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCasing(c)}
                className={`rounded-xl py-2 text-xs font-semibold capitalize transition ${
                  casing === c
                    ? 'bg-indigo-600 text-white'
                    : 'border border-[var(--border)] bg-[var(--background)] hover:border-indigo-500'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={generate}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <RefreshCw className="h-4 w-4" />
          {t.generate}
        </button>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
          <span className="text-sm font-bold text-[var(--foreground)]">
            {uuids.length} Generated IDs
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => copy(uuids.join('\n'), 'all')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-medium hover:border-indigo-500"
            >
              {copiedKey === 'all' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedKey === 'all' ? t.copied : t.copyAll}
            </button>
            <button
              type="button"
              onClick={downloadText}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-medium hover:border-indigo-500"
            >
              <Download className="h-3.5 w-3.5" />
              {t.download}
            </button>
          </div>
        </div>

        <div className="max-h-[500px] space-y-2 overflow-y-auto pr-1">
          {uuids.map((id, index) => (
            <div
              key={`${id}-${index}`}
              className="flex items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 transition hover:border-indigo-400"
            >
              <code dir="ltr" className="break-all font-mono text-xs text-slate-800 dark:text-slate-200">
                {id}
              </code>
              <button
                type="button"
                onClick={() => copy(id, id)}
                className="shrink-0 text-[var(--muted-foreground)] hover:text-indigo-600"
              >
                {copiedKey === id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// -------------------------------------------------------------
// 17. Cron Expression Humanizer
// -------------------------------------------------------------
function LocalizedCronHumanizer({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const [expression, setExpression] = useState('0 9 * * 1-5');
  const [use24Hour, setUse24Hour] = useState(true);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = dictionary.devTools;

  const presets = [
    { label: '* * * * *', value: '* * * * *' },
    { label: '*/5 * * * *', value: '*/5 * * * *' },
    { label: '0 * * * *', value: '0 * * * *' },
    { label: '0 9 * * *', value: '0 9 * * *' },
    { label: '0 9 * * 1-5', value: '0 9 * * 1-5' },
    { label: '0 0 * * 0', value: '0 0 * * 0' },
    { label: '0 0 1 * *', value: '0 0 1 * *' },
  ];

  const cronLocale = locale === 'ar' ? 'en' : locale === 'pt' ? 'pt_BR' : locale;

  const result = useMemo(() => {
    const normalized = expression.trim().replace(/\s+/g, ' ');
    if (!normalized) {
      return { valid: false, description: '', error: 'Enter a cron expression', nextRuns: [] as Date[] };
    }
    const parts = normalized.split(' ');
    if (parts.length !== 5) {
      return { valid: false, description: '', error: 'Standard 5-field cron syntax required', nextRuns: [] as Date[] };
    }
    try {
      const description = cronstrue.toString(normalized, {
        locale: cronLocale,
        use24HourTimeFormat: use24Hour,
      });
      const parser = CronExpressionParser.parse(normalized, {
        currentDate: mounted ? new Date() : new Date('2026-01-01T00:00:00Z'),
      });
      const nextRuns = parser.take(5).map((item) => item.toDate());
      return { valid: true, description, error: '', nextRuns };
    } catch (e) {
      return { valid: false, description: '', error: e instanceof Error ? e.message : 'Invalid cron expression', nextRuns: [] as Date[] };
    }
  }, [expression, cronLocale, use24Hour, mounted]);

  const copy = () => {
    if (!result.description) return;
    void navigator.clipboard.writeText(result.description);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(340px,1.15fr)]">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7 space-y-6">
        <div>
          <label className="text-sm font-semibold">{t.input}</label>
          <input
            type="text"
            dir="ltr"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            className={`mt-2 font-mono ${fieldClass}`}
            placeholder="0 9 * * 1-5"
          />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Presets</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setExpression(p.value)}
                className={`rounded-lg px-2.5 py-1.5 font-mono text-xs transition ${
                  expression === p.value
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'border border-[var(--border)] bg-[var(--background)] hover:border-indigo-400'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="use24HourToggle"
            checked={use24Hour}
            onChange={(e) => setUse24Hour(e.target.checked)}
            className="size-4 rounded accent-indigo-600"
          />
          <label htmlFor="use24HourToggle" className="cursor-pointer text-sm font-medium">
            24-hour time
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7 space-y-6">
        <div>
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <span className="text-sm font-bold text-[var(--foreground)]">{t.output}</span>
            {result.valid && (
              <button
                type="button"
                onClick={copy}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? t.copied : t.copy}
              </button>
            )}
          </div>

          {result.valid ? (
            <div className="mt-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-5">
              <p className="text-base font-bold text-indigo-900 dark:text-indigo-200">
                {result.description}
              </p>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
              {result.error}
            </div>
          )}
        </div>

        {result.nextRuns.length > 0 && (
          <div className="space-y-3" suppressHydrationWarning>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Next scheduled runs
            </span>
            <div className="space-y-2" suppressHydrationWarning>
              {result.nextRuns.map((d, index) => (
                <div
                  key={`${d.toISOString()}-${index}`}
                  className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm"
                >
                  <span className="font-mono text-xs font-bold text-[var(--muted-foreground)]">
                    #{index + 1}
                  </span>
                  <time dateTime={d.toISOString()} className="font-semibold" suppressHydrationWarning>
                    {mounted ? new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(d) : d.toISOString()}
                  </time>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

// -------------------------------------------------------------
// 18. Markup & Query Formatter
// -------------------------------------------------------------
function LocalizedMarkupFormatter({ dictionary }: { dictionary: Dictionary }) {
  const [language, setLanguage] = useState<MarkupLanguage>('sql');
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState<MarkupIndent>(2);
  const [sqlDialect, setSqlDialect] = useState<SqlLanguage>('sql');

  const t = dictionary.devTools;

  const handleFormat = () => {
    if (!input.trim()) return;
    if (language === 'sql') {
      const res = formatSqlCode(input, { dialect: sqlDialect, tabWidth: indent, keywordCase: 'upper' });
      if (res.success) {
        setInput(res.output);
        setStatus('Formatted SQL query.');
      } else {
        setStatus(res.error || 'SQL formatting failed.');
      }
    } else if (language === 'xml') {
      const res = validateAndFormatXml(input, { tabWidth: indent });
      if (res.success) {
        setInput(res.output);
        setStatus('Formatted XML document.');
      } else {
        setStatus(res.error || 'Invalid XML syntax.');
      }
    } else if (language === 'yaml') {
      const res = validateAndFormatYaml(input, { tabWidth: indent });
      if (res.success) {
        setInput(res.output);
        setStatus('Formatted YAML configuration.');
      } else {
        setStatus(res.error || 'Invalid YAML syntax.');
      }
    }
  };

  const copy = () => {
    if (!input) return;
    void navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="min-w-0 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm sm:p-7 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-semibold">
            Format:
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value as MarkupLanguage);
                setStatus('');
              }}
              className="ml-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm"
            >
              <option value="sql">SQL</option>
              <option value="xml">XML</option>
              <option value="yaml">YAML</option>
            </select>
          </label>

          {language === 'sql' && (
            <label className="text-sm font-semibold">
              Dialect:
              <select
                value={sqlDialect}
                onChange={(e) => setSqlDialect(e.target.value as SqlLanguage)}
                className="ml-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm"
              >
                {SQL_DIALECTS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="text-sm font-semibold">
            Indent:
            <select
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value) as MarkupIndent)}
              className="ml-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
            </select>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copy}
            disabled={!input}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2 text-xs font-medium hover:border-indigo-500 disabled:opacity-50"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            {copied ? t.copied : t.copy}
          </button>
          <button
            type="button"
            onClick={() => {
              setInput('');
              setStatus('');
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2 text-xs font-medium hover:border-red-500"
          >
            <Trash2 className="h-4 w-4" />
            {t.clear}
          </button>
        </div>
      </div>

      <textarea
        dir="ltr"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter SQL, XML, or YAML code here..."
        rows={12}
        className={`font-mono text-xs ${fieldClass}`}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={handleFormat}
          disabled={!input.trim()}
          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
        >
          {t.format}
        </button>
        {status && <span className="text-xs font-semibold text-[var(--muted-foreground)]">{status}</span>}
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// 19. Developer Utilities Hub
// -------------------------------------------------------------
function LocalizedDeveloperUtilsHub({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const t = dictionary.devTools;

  const sections = [
    {
      title: 'Text, Patterns & Time Utilities',
      description:
        'Test regular expressions, convert epoch timestamps, humanize cron schedules, and calculate upcoming run dates.',
      slugs: [
        'regex-tester',
        'epoch-time-converter',
        'cron-expression-generator',
        'cron-expression-humanizer',
        'cron-next-run-calculator',
      ],
    },
    {
      title: 'Identifiers & Binary Number Systems',
      description:
        'Generate cryptographic UUIDs and ULIDs, inspect millisecond timestamps, and convert binary numbers with step-by-step arithmetic.',
      slugs: ['uuid-generator', 'ulid-generator', 'binary-to-decimal-with-steps'],
    },
    {
      title: 'DevOps, Formats & Schema Generation',
      description:
        'Scaffold .gitignore files, assemble Docker run commands, format conventional git commits, and generate Zod validation schemas.',
      slugs: [
        'gitignore-generator',
        'docker-run-command-generator',
        'git-commit-message-formatter',
        'typescript-to-zod-schema-converter',
        'markup-formatter',
      ],
    },
    {
      title: 'CAD & Design Handoff Utilities',
      description:
        'Convert STEP CAD files to interactive 3D PDFs and inspect PSD mockups for HTML and CSS generation.',
      slugs: ['step-to-3d-pdf-converter', 'psd-to-html'],
    },
  ];

  return (
    <div className="space-y-10">
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6">
        <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <span>{t.hubTitle}</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-emerald-900/90 dark:text-emerald-200/90">
          {t.hubDescription}
        </p>
      </div>

      {sections.map((section) => (
        <div key={section.title} className="space-y-4">
          <h2 className="border-b border-[var(--border)] pb-2 text-lg font-bold text-slate-900 dark:text-white">
            {section.title}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {section.slugs.map((toolSlug) => {
              const meta = dictionary.tools[toolSlug as TranslatedTool];
              if (!meta) return null;
              const icon = getToolIcon(toolSlug);
              return (
                <Link
                  key={toolSlug}
                  href={localizedPath(locale, toolSlug as TranslatedTool)}
                  className="group flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:border-indigo-500 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xl transition group-hover:bg-indigo-600 dark:bg-slate-800 dark:group-hover:bg-indigo-500">
                        <span>{icon}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 transition group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                        {meta.title}
                      </h3>
                    </div>
                    <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-[var(--muted-foreground)]">
                      {meta.description}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// -------------------------------------------------------------
// Main Dispatcher Component
// -------------------------------------------------------------
export default function LocalizedDevTools({ slug, locale, dictionary }: Props) {
  if (slug === 'cidr-subnet-wildcard-calculator') return <LocalizedCidrSubnet dictionary={dictionary} locale={locale} />;
  if (slug === 'ip-range-calculator') return <LocalizedIpRange dictionary={dictionary} locale={locale} />;
  if (slug === 'vlsm-subnet-calculator') return <LocalizedVlsmSubnet dictionary={dictionary} locale={locale} />;
  if (slug === 'mac-address-generator') return <LocalizedMacGenerator dictionary={dictionary} />;
  if (slug === 'http-status-code-lookup') return <LocalizedHttpStatusLookup dictionary={dictionary} />;
  if (slug === 'url-encoder-decoder') return <LocalizedUrlEncoder dictionary={dictionary} />;
  if (slug === 'html-entity-encoder-decoder') return <LocalizedHtmlEntityEncoder dictionary={dictionary} />;
  if (slug === 'base64-encoder') return <LocalizedBase64Encoder dictionary={dictionary} />;
  if (slug === 'jwt-decoder') return <LocalizedJwtDecoder dictionary={dictionary} />;
  if (slug === 'utf8-vs-utf16-byte-calculator') return <LocalizedUnicodeByte dictionary={dictionary} />;
  if (slug === 'aws-glacier-retrieval-calculator') return <LocalizedAwsGlacier dictionary={dictionary} locale={locale} />;
  if (slug === 'webmaster-seo-builder') return <LocalizedWebmasterHub locale={locale} dictionary={dictionary} />;
  if (slug === 'web-crypto-studio') return <LocalizedWebCrypto dictionary={dictionary} />;
  if (slug === 'qr-code-generator') return <LocalizedQrCodeTool dictionary={dictionary} />;
  if (slug === 'code-minifier-beautifier') return <LocalizedCodeMinifier dictionary={dictionary} />;

  // Cohort 19D additions
  if (slug === 'uuid-generator') return <LocalizedUuidGenerator dictionary={dictionary} />;
  if (slug === 'ulid-generator') return <UlidGeneratorTool />;
  if (slug === 'cron-expression-generator') return <CronExpressionGeneratorTool />;
  if (slug === 'cron-expression-humanizer') return <LocalizedCronHumanizer locale={locale} dictionary={dictionary} />;
  if (slug === 'cron-next-run-calculator') return <CronNextRunCalculator />;
  if (slug === 'epoch-time-converter') return <EpochTimeConverterTool />;
  if (slug === 'binary-to-decimal-with-steps') return <BinaryToDecimalTool />;
  if (slug === 'gitignore-generator') return <GitignoreGenerator />;
  if (slug === 'docker-run-command-generator') return <DockerRunGenerator />;
  if (slug === 'git-commit-message-formatter') return <GitCommitFormatter />;
  if (slug === 'typescript-to-zod-schema-converter') return <TypescriptToZodConverter />;
  if (slug === 'markup-formatter') return <LocalizedMarkupFormatter dictionary={dictionary} />;
  if (slug === 'psd-to-html') return <PsdToHtmlTool />;
  if (slug === 'step-to-3d-pdf-converter') return <StepTo3dPdfTool locale={locale} />;
  if (slug === 'developer-utils') return <LocalizedDeveloperUtilsHub locale={locale} dictionary={dictionary} />;

  return null;
}
