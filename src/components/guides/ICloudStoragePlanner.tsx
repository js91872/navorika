'use client';

import { useId, useMemo, useState } from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck, Copy, HardDrive } from 'lucide-react';

interface TierOption {
  id: string;
  name: string;
  capacityGB: number;
  monthlyCostUSD: number;
}

const TIERS: TierOption[] = [
  { id: 'free', name: '5 GB Free', capacityGB: 5, monthlyCostUSD: 0 },
  { id: '50gb', name: '50 GB iCloud+', capacityGB: 50, monthlyCostUSD: 0.99 },
  { id: '200gb', name: '200 GB iCloud+', capacityGB: 200, monthlyCostUSD: 2.99 },
  { id: '2tb', name: '2 TB iCloud+', capacityGB: 2000, monthlyCostUSD: 9.99 },
];

interface CleanupAction {
  id: string;
  label: string;
  category: 'photos' | 'backups' | 'messages' | 'drive';
  defaultSavingsGB: number;
  risk: 'safe' | 'caution' | 'destructive';
  riskLabel: string;
  explanation: string;
  steps: string;
}

const CLEANUP_ACTIONS: CleanupAction[] = [
  {
    id: 'empty-recently-deleted',
    label: 'Empty "Recently Deleted" album permanently',
    category: 'photos',
    defaultSavingsGB: 3.5,
    risk: 'destructive',
    riskLabel: 'Permanent deletion',
    explanation: 'Deleted photos occupy full iCloud space for 30 days unless emptied manually from Recently Deleted.',
    steps: 'Open Photos > Albums > Recently Deleted > Select > Delete All.',
  },
  {
    id: 'offload-4k-videos',
    label: 'Export 4K/60fps and slow-mo videos to external drive or Mac',
    category: 'photos',
    defaultSavingsGB: 12.0,
    risk: 'safe',
    riskLabel: 'Safe with verified copy',
    explanation: 'One hour of 4K video consumes 20–24 GB. Moving video archives to an external SSD frees massive space.',
    steps: 'Connect iPhone/Mac to external drive > Export Unmodified Originals > Delete from Photos library.',
  },
  {
    id: 'delete-old-backup',
    label: 'Delete obsolete backup from traded-in or older device',
    category: 'backups',
    defaultSavingsGB: 6.5,
    risk: 'safe',
    riskLabel: 'Zero risk to current phone',
    explanation: 'Old iPhones remain stored as static snapshots in iCloud even years after you upgrade to a new model.',
    steps: 'Settings > [Your Name] > iCloud > Manage Storage > Backups > Select old device > Delete & Turn Off.',
  },
  {
    id: 'prune-messages-attachments',
    label: 'Review and delete large iMessage attachments (>25 MB)',
    category: 'messages',
    defaultSavingsGB: 4.0,
    risk: 'caution',
    riskLabel: 'Check before deleting',
    explanation: 'Shared videos, GIFs, and PDFs received over years silently fill iCloud Messages without deleting chat text.',
    steps: 'Settings > General > iPhone Storage > Messages > Top Conversations / Large Attachments.',
  },
  {
    id: 'disable-heavy-app-backups',
    label: 'Exclude third-party video and design caches from backup snapshot',
    category: 'backups',
    defaultSavingsGB: 2.5,
    risk: 'safe',
    riskLabel: 'Safe',
    explanation: 'Apps like CapCut, Lightroom, or streaming offline files often get needlessly included in your phone backup.',
    steps: 'Settings > [Your Name] > iCloud > Manage Storage > Backups > This iPhone > Toggle off non-essential apps.',
  },
  {
    id: 'clean-icloud-drive-downloads',
    label: 'Purge Downloads and old zip files in iCloud Drive',
    category: 'drive',
    defaultSavingsGB: 2.0,
    risk: 'caution',
    riskLabel: 'Review file list',
    explanation: 'Safari downloads and desktop folders synced from a Mac can accumulate forgotten ISOs and installers.',
    steps: 'Files app > iCloud Drive > Downloads > Sort by Size > Delete unneeded files.',
  },
];

export default function ICloudStoragePlanner() {
  const [selectedTierId, setSelectedTierId] = useState<string>('50gb');
  const [photosGB, setPhotosGB] = useState<number>(32);
  const [backupsGB, setBackupsGB] = useState<number>(10);
  const [messagesGB, setMessagesGB] = useState<number>(5.5);
  const [driveGB, setDriveGB] = useState<number>(2.5);
  const [copied, setCopied] = useState<boolean>(false);

  const [activeActions, setActiveActions] = useState<Record<string, boolean>>({
    'empty-recently-deleted': true,
    'delete-old-backup': true,
    'prune-messages-attachments': true,
    'disable-heavy-app-backups': false,
    'offload-4k-videos': false,
    'clean-icloud-drive-downloads': false,
  });

  const tier = TIERS.find((t) => t.id === selectedTierId) || TIERS[1];
  const totalUsedBefore = useMemo(() => {
    return Math.max(0, photosGB + backupsGB + messagesGB + driveGB);
  }, [photosGB, backupsGB, messagesGB, driveGB]);

  const estimatedSavings = useMemo(() => {
    let savings = 0;
    for (const action of CLEANUP_ACTIONS) {
      if (activeActions[action.id]) {
        // Cap savings so they don't exceed the actual category size
        if (action.category === 'photos') {
          savings += Math.min(action.defaultSavingsGB, photosGB);
        } else if (action.category === 'backups') {
          savings += Math.min(action.defaultSavingsGB, backupsGB);
        } else if (action.category === 'messages') {
          savings += Math.min(action.defaultSavingsGB, messagesGB);
        } else if (action.category === 'drive') {
          savings += Math.min(action.defaultSavingsGB, driveGB);
        }
      }
    }
    return Math.min(savings, totalUsedBefore);
  }, [activeActions, photosGB, backupsGB, messagesGB, driveGB, totalUsedBefore]);

  const totalUsedAfter = Math.max(0, totalUsedBefore - estimatedSavings);
  const percentBefore = Math.min(100, (totalUsedBefore / tier.capacityGB) * 100);
  const percentAfter = Math.min(100, (totalUsedAfter / tier.capacityGB) * 100);

  const toggleAction = (id: string) => {
    setActiveActions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const loadPreset = (preset: 'free-crisis' | 'average' | 'heavy') => {
    if (preset === 'free-crisis') {
      setSelectedTierId('free');
      setPhotosGB(3.2);
      setBackupsGB(1.4);
      setMessagesGB(0.4);
      setDriveGB(0.2);
      setActiveActions({
        'empty-recently-deleted': true,
        'delete-old-backup': true,
        'prune-messages-attachments': true,
        'disable-heavy-app-backups': true,
        'offload-4k-videos': false,
        'clean-icloud-drive-downloads': true,
      });
    } else if (preset === 'average') {
      setSelectedTierId('50gb');
      setPhotosGB(32);
      setBackupsGB(10);
      setMessagesGB(5.5);
      setDriveGB(2.5);
      setActiveActions({
        'empty-recently-deleted': true,
        'delete-old-backup': true,
        'prune-messages-attachments': true,
        'disable-heavy-app-backups': false,
        'offload-4k-videos': false,
        'clean-icloud-drive-downloads': false,
      });
    } else {
      setSelectedTierId('200gb');
      setPhotosGB(130);
      setBackupsGB(35);
      setMessagesGB(22);
      setDriveGB(15);
      setActiveActions({
        'empty-recently-deleted': true,
        'offload-4k-videos': true,
        'delete-old-backup': true,
        'prune-messages-attachments': true,
        'disable-heavy-app-backups': true,
        'clean-icloud-drive-downloads': true,
      });
    }
  };

  const copyPlanText = () => {
    const lines = [
      `--- Navorika iCloud Storage Cleanup Plan ---`,
      `Current Plan: ${tier.name} (${tier.capacityGB} GB)`,
      `Starting Usage: ${totalUsedBefore.toFixed(1)} GB (${percentBefore.toFixed(0)}%)`,
      `Projected Space Reclaimed: ${estimatedSavings.toFixed(1)} GB`,
      `Projected Post-Cleanup Usage: ${totalUsedAfter.toFixed(1)} GB (${percentAfter.toFixed(0)}%)`,
      ``,
      `Selected Action Steps:`,
      ...CLEANUP_ACTIONS.filter((a) => activeActions[a.id]).map(
        (a, i) => `${i + 1}. [${a.riskLabel}] ${a.label}\n   How: ${a.steps}`
      ),
      ``,
      `Note: Generated via Navorika privacy-first local calculator. Never delete items from Recently Deleted before ensuring you have permanent offsite copies if needed.`,
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const photosId = useId();
  const backupsId = useId();
  const messagesId = useId();
  const driveId = useId();

  return (
    <div className="not-prose my-10 rounded-2xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-5 sm:p-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e4e4e8] dark:border-[#27272a] pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff1f1] dark:bg-[#e5322d]/10 px-3 py-1 text-xs font-bold text-[#e5322d] border border-[#fecaca] dark:border-[#e5322d]/20">
            <HardDrive className="h-3.5 w-3.5" /> Interactive Utility
          </span>
          <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-[#18181b] dark:text-white">
            iCloud Storage Cleanup Planner & Estimate Simulator
          </h3>
          <p className="mt-1 text-sm text-[#5b5b63] dark:text-[#a1a1aa]">
            Simulate realistic before-and-after storage results across your Apple devices. 100% private and runs locally in your browser.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <button
            onClick={() => loadPreset('free-crisis')}
            className="rounded-lg border border-[#e4e4e8] dark:border-[#27272a] bg-[#f7f7f8] dark:bg-[#202023] px-3 py-1.5 text-[#18181b] dark:text-white hover:border-[#e5322d] transition"
          >
            5 GB Crisis Preset
          </button>
          <button
            onClick={() => loadPreset('average')}
            className="rounded-lg border border-[#e4e4e8] dark:border-[#27272a] bg-[#f7f7f8] dark:bg-[#202023] px-3 py-1.5 text-[#18181b] dark:text-white hover:border-[#e5322d] transition"
          >
            50 GB Typical Preset
          </button>
          <button
            onClick={() => loadPreset('heavy')}
            className="rounded-lg border border-[#e4e4e8] dark:border-[#27272a] bg-[#f7f7f8] dark:bg-[#202023] px-3 py-1.5 text-[#18181b] dark:text-white hover:border-[#e5322d] transition"
          >
            200 GB Heavy Preset
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left column: inputs & actions */}
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5b5b63] dark:text-[#a1a1aa]">
              Step 1: Select Your Current iCloud Plan
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {TIERS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTierId(t.id)}
                  className={`rounded-xl border p-3 text-left transition ${
                    selectedTierId === t.id
                      ? 'border-[#e5322d] bg-[#fff1f1] dark:bg-[#e5322d]/10 text-[#18181b] dark:text-white font-bold'
                      : 'border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] text-[#5b5b63] dark:text-[#a1a1aa] hover:border-slate-400'
                  }`}
                >
                  <div className="text-sm font-bold">{t.name}</div>
                  <div className="mt-1 text-xs text-[#5b5b63] dark:text-[#a1a1aa]">
                    {t.monthlyCostUSD === 0 ? 'Free' : `$${t.monthlyCostUSD}/mo`}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5b5b63] dark:text-[#a1a1aa]">
              Step 2: Enter Your Current Usage by Category (GB)
            </label>
            <p className="mt-1 text-xs text-[#5b5b63] dark:text-[#a1a1aa]">
              Check on iPhone: <em>Settings &gt; [Your Name] &gt; iCloud</em>.
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[#e4e4e8] dark:border-[#27272a] p-3">
                <div className="flex justify-between text-xs font-medium">
                  <label htmlFor={photosId} className="cursor-pointer">Photos &amp; Videos</label>
                  <span className="font-bold text-[#18181b] dark:text-white">{photosGB.toFixed(1)} GB</span>
                </div>
                <input
                  id={photosId}
                  type="range"
                  min="0"
                  max={Math.min(tier.capacityGB, 1000)}
                  step="0.5"
                  value={photosGB}
                  onChange={(e) => setPhotosGB(parseFloat(e.target.value) || 0)}
                  className="mt-2 w-full accent-[#e5322d]"
                  aria-label="Photos & Videos usage in GB"
                />
              </div>

              <div className="rounded-xl border border-[#e4e4e8] dark:border-[#27272a] p-3">
                <div className="flex justify-between text-xs font-medium">
                  <label htmlFor={backupsId} className="cursor-pointer">Device Backups</label>
                  <span className="font-bold text-[#18181b] dark:text-white">{backupsGB.toFixed(1)} GB</span>
                </div>
                <input
                  id={backupsId}
                  type="range"
                  min="0"
                  max={Math.min(tier.capacityGB, 500)}
                  step="0.5"
                  value={backupsGB}
                  onChange={(e) => setBackupsGB(parseFloat(e.target.value) || 0)}
                  className="mt-2 w-full accent-[#e5322d]"
                  aria-label="Device Backups usage in GB"
                />
              </div>

              <div className="rounded-xl border border-[#e4e4e8] dark:border-[#27272a] p-3">
                <div className="flex justify-between text-xs font-medium">
                  <label htmlFor={messagesId} className="cursor-pointer">Messages &amp; Attachments</label>
                  <span className="font-bold text-[#18181b] dark:text-white">{messagesGB.toFixed(1)} GB</span>
                </div>
                <input
                  id={messagesId}
                  type="range"
                  min="0"
                  max={Math.min(tier.capacityGB, 200)}
                  step="0.5"
                  value={messagesGB}
                  onChange={(e) => setMessagesGB(parseFloat(e.target.value) || 0)}
                  className="mt-2 w-full accent-[#e5322d]"
                  aria-label="Messages & Attachments usage in GB"
                />
              </div>

              <div className="rounded-xl border border-[#e4e4e8] dark:border-[#27272a] p-3">
                <div className="flex justify-between text-xs font-medium">
                  <label htmlFor={driveId} className="cursor-pointer">iCloud Drive &amp; Files</label>
                  <span className="font-bold text-[#18181b] dark:text-white">{driveGB.toFixed(1)} GB</span>
                </div>
                <input
                  id={driveId}
                  type="range"
                  min="0"
                  max={Math.min(tier.capacityGB, 200)}
                  step="0.5"
                  value={driveGB}
                  onChange={(e) => setDriveGB(parseFloat(e.target.value) || 0)}
                  className="mt-2 w-full accent-[#e5322d]"
                  aria-label="iCloud Drive & Files usage in GB"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5b5b63] dark:text-[#a1a1aa]">
              Step 3: Select Planned Cleanup Actions
            </label>
            <p className="mt-1 text-xs text-[#5b5b63] dark:text-[#a1a1aa]">
              Toggle cleanup items to calculate your projected recovered storage and view safety instructions.
            </p>
            <div className="mt-3 space-y-2.5">
              {CLEANUP_ACTIONS.map((action) => {
                const isActive = activeActions[action.id] || false;
                return (
                  <div
                    key={action.id}
                    onClick={() => toggleAction(action.id)}
                    className={`cursor-pointer rounded-xl border p-3 transition ${
                      isActive
                        ? 'border-[#e5322d]/60 bg-[#fff1f1]/60 dark:bg-[#e5322d]/5'
                        : 'border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={() => {}}
                          className="mt-1 h-4 w-4 rounded accent-[#e5322d]"
                        />
                        <div>
                          <div className="text-sm font-bold text-[#18181b] dark:text-white">
                            {action.label}
                          </div>
                          <div className="mt-1 text-xs text-[#5b5b63] dark:text-[#a1a1aa] leading-relaxed">
                            {action.explanation}
                          </div>
                          <div className="mt-1.5 text-xs text-[#e5322d] font-semibold dark:text-[#ff6b68]">
                            &rarr; {action.steps}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-extrabold text-[#18181b] dark:text-white">
                          ~{action.defaultSavingsGB} GB
                        </span>
                        <div className="mt-1">
                          <span
                            className={`inline-block rounded px-1.5 py-0.5 text-[0.65rem] font-bold uppercase ${
                              action.risk === 'safe'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : action.risk === 'caution'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                            }`}
                          >
                            {action.riskLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Results & Before/After */}
        <div className="flex flex-col justify-between space-y-6 lg:border-l lg:border-[#e4e4e8] lg:dark:border-[#27272a] lg:pl-8">
          <div>
            <div className="rounded-2xl border border-[#e4e4e8] dark:border-[#27272a] bg-[#f7f7f8] dark:bg-[#121214] p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#5b5b63] dark:text-[#a1a1aa]">
                Storage Recovery Projection
              </h4>

              <div className="mt-4 grid grid-cols-2 gap-4 border-b border-[#e4e4e8] dark:border-[#27272a] pb-4">
                <div>
                  <div className="text-xs text-[#5b5b63] dark:text-[#a1a1aa]">Estimated Reclaimed</div>
                  <div className="mt-1 text-3xl font-black text-[#e5322d] dark:text-[#ff6b68]">
                    {estimatedSavings.toFixed(1)} <span className="text-base font-bold text-[#18181b] dark:text-white">GB</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#5b5b63] dark:text-[#a1a1aa]">New Remaining Usage</div>
                  <div className="mt-1 text-3xl font-black text-[#18181b] dark:text-white">
                    {totalUsedAfter.toFixed(1)} <span className="text-base font-bold text-[#5b5b63] dark:text-[#a1a1aa]">/ {tier.capacityGB} GB</span>
                  </div>
                </div>
              </div>

              {/* Before vs After Visual Bars */}
              <div className="mt-5 space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#5b5b63] dark:text-[#a1a1aa]">Before Cleanup</span>
                    <span className={percentBefore >= 95 ? 'text-red-600 font-bold' : 'text-[#18181b] dark:text-white'}>
                      {totalUsedBefore.toFixed(1)} GB ({percentBefore.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="mt-1.5 h-3.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-zinc-800">
                    <div
                      className={`h-full transition-all duration-500 ${
                        percentBefore >= 95 ? 'bg-red-600' : percentBefore >= 80 ? 'bg-amber-500' : 'bg-slate-700'
                      }`}
                      style={{ width: `${Math.min(100, percentBefore)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-emerald-700 dark:text-emerald-400">After Selected Actions</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                      {totalUsedAfter.toFixed(1)} GB ({percentAfter.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="mt-1.5 h-3.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-zinc-800">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, percentAfter)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] p-4 text-xs leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa]">
                {percentAfter <= 70 ? (
                  <div className="flex items-start gap-2 text-emerald-800 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>
                      <strong>Healthy headroom:</strong> Your projected storage drops under 70% capacity, leaving ample space for automated nightly device backups and incoming email.
                    </span>
                  </div>
                ) : percentAfter <= 90 ? (
                  <div className="flex items-start gap-2 text-amber-800 dark:text-amber-400">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>
                      <strong>Moderate buffer:</strong> You will stop getting &quot;Storage Almost Full&quot; warnings, but consider exporting older 4K video clips if you record frequently.
                    </span>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-red-800 dark:text-red-400">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>
                      <strong>Still tight:</strong> Projected storage remains above 90%. To avoid failed sync, consider offloading more 4K video or stepping up to the next storage tier ($0.99/mo).
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={copyPlanText}
                className="flex items-center gap-1.5 rounded-xl bg-[#e5322d] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#c92823] transition"
              >
                {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Plan Copied to Clipboard!' : 'Copy My Cleanup Checklist'}
              </button>
            </div>
          </div>

          <aside className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-4 text-xs leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa]">
            <div className="flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <strong>Accuracy and Privacy Guarantee:</strong> This planner operates entirely in your browser using standard mathematical formulas. It does not access, read, or modify your Apple ID or iCloud data. File sizes and savings are realistic estimates; verify actual item sizes in iOS Settings before permanent deletion.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
