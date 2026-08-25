'use client';

import { Copy, Network } from 'lucide-react';
import { useMemo, useState } from 'react';
import { calculateCidrSubnet } from '@/lib/calculations/cidrSubnet';

const fieldClass =
  'w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';

export default function CidrSubnetCalculator() {
  const [input, setInput] = useState('192.168.1.0/27');

  const result = useMemo(
    () => calculateCidrSubnet(input),
    [input],
  );

  const copy = (value: string) => {
    void navigator.clipboard.writeText(value);
  };

  const rows = result.valid
    ? [
        ['IP address', result.ipAddress],
        ['CIDR prefix', `/${result.cidr}`],
        ['Subnet mask', result.subnetMask],
        ['Wildcard mask', result.wildcardMask],
        ['Network address', result.networkAddress],
        ['Broadcast address', result.broadcastAddress],
        ['First host', result.firstHost],
        ['Last host', result.lastHost],
        [
          'Total addresses',
          result.totalAddresses?.toLocaleString(),
        ],
        [
          'Usable hosts',
          result.usableHosts?.toLocaleString(),
        ],
      ]
    : [];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(340px,1.2fr)]">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7">
        <div className="flex items-center gap-3">
          <Network className="size-6 text-indigo-600" />
          <h2 className="text-xl font-bold">
            IPv4 network
          </h2>
        </div>

        <label className="mt-6 block text-sm font-semibold">
          IPv4 address / CIDR
          <input
            value={input}
            onChange={(event) =>
              setInput(event.target.value)
            }
            spellCheck={false}
            className={`${fieldClass} mt-2 font-mono`}
            placeholder="192.168.1.0/24"
          />
        </label>

        {!result.valid && (
          <p className="mt-3 text-sm text-red-600">
            {result.error}
          </p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          {[
            '10.0.0.0/8',
            '172.16.0.0/16',
            '192.168.1.0/24',
            '192.168.1.0/27',
          ].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setInput(preset)}
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-semibold transition hover:border-indigo-500"
            >
              {preset}
            </button>
          ))}
        </div>
      </section>

      <aside className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg">
        <p className="text-sm text-[var(--muted-foreground)]">
          Network details
        </p>

        {result.valid ? (
          <>
            <p className="mt-1 font-mono text-3xl font-black">
              {result.networkAddress}/{result.cidr}
            </p>

            <dl className="mt-6 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] px-4">
              {rows.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <dt className="text-sm text-[var(--muted-foreground)]">
                    {label}
                  </dt>

                  <dd className="flex items-center gap-2 font-mono text-sm font-bold">
                    {value}

                    {typeof value === 'string' && (
                      <button
                        type="button"
                        onClick={() => copy(value)}
                        aria-label={`Copy ${label}`}
                        className="text-[var(--muted-foreground)] hover:text-indigo-600"
                      >
                        <Copy className="size-4" />
                      </button>
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted-foreground)]">
                Cisco wildcard
              </p>

              <code className="mt-2 block font-mono text-sm">
                {result.networkAddress}{' '}
                {result.wildcardMask}
              </code>
            </div>

            <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted-foreground)]">
                Binary subnet mask
              </p>

              <code className="mt-2 block break-all font-mono text-xs leading-6">
                {result.binaryMask}
              </code>
            </div>
          </>
        ) : (
          <p className="mt-6 text-sm text-[var(--muted-foreground)]">
            Enter a valid IPv4 CIDR network to see
            subnet details.
          </p>
        )}
      </aside>
    </div>
  );
}
