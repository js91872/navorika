'use client';

import {
  ArchiveRestore,
  Clock3,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  calculateGlacierRetrieval,
  type GlacierRetrievalTier,
  type GlacierStorageClass,
} from '@/lib/calculations/awsGlacierRetrieval';

const field =
  'mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';

function number(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed)
    ? Math.max(0, parsed)
    : 0;
}

export default function AwsGlacierRetrievalCalculator() {
  const [storageClass, setStorageClass] =
    useState<GlacierStorageClass>(
      'deep-archive',
    );

  const [tier, setTier] =
    useState<GlacierRetrievalTier>(
      'standard',
    );

  const [dataGb, setDataGb] =
    useState('1000');

  const [objects, setObjects] =
    useState('10000');

  const [rateGb, setRateGb] =
    useState('0.02');

  const [requestRate, setRequestRate] =
    useState('0.10');

  const [restoreDays, setRestoreDays] =
    useState('1');

  const [temporaryRate, setTemporaryRate] =
    useState('0.023');

  const [includeTemp, setIncludeTemp] =
    useState(true);

  const result = useMemo(
    () =>
      calculateGlacierRetrieval({
        dataGb: number(dataGb),
        objectCount: number(objects),
        storageClass,
        retrievalTier: tier,
        retrievalRatePerGb: number(rateGb),
        requestRatePerThousand:
          number(requestRate),
        restoreDays: number(restoreDays),
        temporaryStorageRatePerGbMonth:
          number(temporaryRate),
        includeTemporaryStorage:
          includeTemp,
      }),
    [
      dataGb,
      objects,
      storageClass,
      tier,
      rateGb,
      requestRate,
      restoreDays,
      temporaryRate,
      includeTemp,
    ],
  );

  const changeStorageClass = (
    value: GlacierStorageClass,
  ) => {
    setStorageClass(value);

    if (
      value === 'deep-archive' &&
      tier === 'expedited'
    ) {
      setTier('standard');
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)]">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7">
        <div className="flex items-center gap-3">
          <ArchiveRestore className="size-6 text-indigo-600" />
          <h2 className="text-xl font-bold">
            Retrieval details
          </h2>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Storage class
            <select
              value={storageClass}
              onChange={(event) =>
                changeStorageClass(
                  event.target
                    .value as GlacierStorageClass,
                )
              }
              className={field}
            >
              <option value="flexible">
                S3 Glacier Flexible Retrieval
              </option>
              <option value="deep-archive">
                S3 Glacier Deep Archive
              </option>
            </select>
          </label>

          <label className="text-sm font-semibold">
            Retrieval tier
            <select
              value={tier}
              onChange={(event) =>
                setTier(
                  event.target
                    .value as GlacierRetrievalTier,
                )
              }
              className={field}
            >
              {storageClass === 'flexible' && (
                <option value="expedited">
                  Expedited
                </option>
              )}
              <option value="standard">
                Standard
              </option>
              <option value="bulk">
                Bulk
              </option>
            </select>
          </label>

          <label className="text-sm font-semibold">
            Data to retrieve (GB)
            <input
              type="number"
              min="0"
              step="any"
              value={dataGb}
              onChange={(event) =>
                setDataGb(event.target.value)
              }
              className={field}
            />
          </label>

          <label className="text-sm font-semibold">
            Number of objects
            <input
              type="number"
              min="0"
              step="1"
              value={objects}
              onChange={(event) =>
                setObjects(event.target.value)
              }
              className={field}
            />
          </label>
        </div>

        <div className="mt-8 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5">
          <h3 className="font-bold">
            Enter current AWS regional rates
          </h3>

          <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
            Pricing varies by AWS Region and can
            change. Enter the current rates from
            AWS pricing for your region rather
            than treating these example values as
            authoritative.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              Retrieval ($/GB)
              <input
                type="number"
                min="0"
                step="0.0001"
                value={rateGb}
                onChange={(event) =>
                  setRateGb(event.target.value)
                }
                className={field}
              />
            </label>

            <label className="text-sm font-semibold">
              Requests ($/1,000)
              <input
                type="number"
                min="0"
                step="0.0001"
                value={requestRate}
                onChange={(event) =>
                  setRequestRate(
                    event.target.value,
                  )
                }
                className={field}
              />
            </label>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-[var(--border)] p-5">
          <label className="flex items-center gap-3 font-semibold">
            <input
              type="checkbox"
              checked={includeTemp}
              onChange={(event) =>
                setIncludeTemp(
                  event.target.checked,
                )
              }
            />
            Include temporary restored-copy storage
          </label>

          {includeTemp && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                Restore duration (days)
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={restoreDays}
                  onChange={(event) =>
                    setRestoreDays(
                      event.target.value,
                    )
                  }
                  className={field}
                />
              </label>

              <label className="text-sm font-semibold">
                Temporary storage ($/GB-month)
                <input
                  type="number"
                  min="0"
                  step="0.0001"
                  value={temporaryRate}
                  onChange={(event) =>
                    setTemporaryRate(
                      event.target.value,
                    )
                  }
                  className={field}
                />
              </label>
            </div>
          )}
        </div>
      </section>

      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg">
          <p className="text-sm text-[var(--muted-foreground)]">
            Estimated retrieval cost
          </p>

          <p className="mt-1 text-4xl font-black">
            ${result.totalCost.toFixed(2)}
          </p>

          <dl className="mt-6 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] px-4">
            <div className="flex justify-between gap-4 py-4">
              <dt className="text-sm text-[var(--muted-foreground)]">
                Data retrieval
              </dt>
              <dd className="font-bold">
                ${result.retrievalCost.toFixed(2)}
              </dd>
            </div>

            <div className="flex justify-between gap-4 py-4">
              <dt className="text-sm text-[var(--muted-foreground)]">
                Restore requests
              </dt>
              <dd className="font-bold">
                ${result.requestCost.toFixed(2)}
              </dd>
            </div>

            <div className="flex justify-between gap-4 py-4">
              <dt className="text-sm text-[var(--muted-foreground)]">
                Temporary copy
              </dt>
              <dd className="font-bold">
                ${result.temporaryStorageCost.toFixed(
                  2,
                )}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="flex items-center gap-2">
            <Clock3 className="size-5 text-indigo-600" />
            <h2 className="font-bold">
              Typical retrieval time
            </h2>
          </div>

          <p className="mt-4 text-lg font-bold">
            {result.retrievalTime}
          </p>

          <p className="mt-3 text-xs leading-5 text-[var(--muted-foreground)]">
            Actual restore time can vary with
            object size, request volume, AWS
            capacity and retrieval method.
          </p>
        </section>
      </aside>
    </div>
  );
}
