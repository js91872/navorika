'use client';

import { useState } from 'react';
import { HelpCircle, ChevronRight, RotateCcw, ShieldAlert, Sparkles } from 'lucide-react';

interface DiagnosticCase {
  id: string;
  title: string;
  shortDesc: string;
  rootCause: string;
  technicalMechanism: string;
  steps: { title: string; detail: string; path: string }[];
  recoveryWindow: string;
  dangerLevel: 'low' | 'medium' | 'high';
}

const CASES: DiagnosticCase[] = [
  {
    id: 'deleted-photos-no-change',
    title: 'I deleted hundreds of photos, but storage space didn’t change',
    shortDesc: 'You purged albums or videos, but your iCloud storage bar and warning messages remain full.',
    rootCause: 'Quarantined in "Recently Deleted" album or server background sync queue lag.',
    technicalMechanism:
      'Apple keeps deleted photos and videos in a 30-day quarantine album to protect users against accidental taps. Until that album is manually purged or expires, the files retain 100% of their iCloud storage allocation. Additionally, Apple CloudKit metadata updates can take 15–60 minutes to propagate across servers when large batches are removed.',
    steps: [
      {
        title: 'Empty the Recently Deleted album manually',
        detail: 'Open the Photos app, navigate to Albums, scroll down to Utilities, tap "Recently Deleted", unlock with Face ID/Passcode, tap "Select" in the top right, and tap "Delete All".',
        path: 'Photos > Albums > Utilities > Recently Deleted > Delete All',
      },
      {
        title: 'Force an iCloud Photos server sync refresh',
        detail: 'Connect your iPhone to Wi-Fi and plug into power. Open the Photos app, tap the "Library" tab, scroll to the bottom, and check the status line. If it says "Syncing Paused" or "Updating...", tap "Resume".',
        path: 'Photos > Library tab > Bottom status line',
      },
      {
        title: 'Verify storage on iCloud.com via browser',
        detail: 'Open Safari or Chrome, log into iCloud.com, and check the Photos section. If deleted items are gone on iCloud.com but still show on your phone, your device local cache is simply waiting for sync.',
        path: 'iCloud.com > Photos > Recently Deleted',
      },
    ],
    recoveryWindow: 'Zero recovery once purged from Recently Deleted. Ensure you have copies before confirming.',
    dangerLevel: 'high',
  },
  {
    id: 'few-photos-storage-full',
    title: 'I barely have any photos, but my 5 GB free iCloud is completely full',
    shortDesc: 'You have only a handful of pictures, but iOS persistently warns that your iCloud storage is maxed out.',
    rootCause: 'Automated device backup snapshots or hidden third-party app data caches.',
    technicalMechanism:
      'By default, Apple turns on iCloud Backup for every iOS device you sign into. A single device backup typically consumes 3 to 7 GB because it captures app data, messages, voice memos, and device settings. If you have an old iPad or a previously upgraded iPhone still attached to your account, its historical backup remains frozen in your cloud account indefinitely.',
    steps: [
      {
        title: 'Audit and delete obsolete device backups',
        detail: 'Go to Settings > [Your Name] > iCloud > Manage Storage > Backups. Look at the list of devices. If you see an older iPhone, iPad, or duplicate entry from before a phone upgrade, tap it and select "Delete & Turn Off Backup".',
        path: 'Settings > Apple Account > iCloud > Manage Account Storage > Backups',
      },
      {
        title: 'Prune third-party app data in iCloud Drive',
        detail: 'In the same Manage Storage screen, look below Backups. Apps like WhatsApp, CapCut, Procreate, or audio recorders often back up gigabytes of cache files without notifying you.',
        path: 'Settings > Apple Account > iCloud > Manage Account Storage > [App Name] > Delete Documents & Data',
      },
      {
        title: 'Turn off iCloud Mail spam clutter',
        detail: 'If you use an @icloud.com email address, large email attachments or junk mail might be clogging your 5 GB limit. Empty your Mail Trash and Junk folders.',
        path: 'Mail app > Mailboxes > Trash / Junk > Edit > Delete All',
      },
    ],
    recoveryWindow: 'Deleting an old device backup is 100% safe for your current active device.',
    dangerLevel: 'low',
  },
  {
    id: 'backup-failed-alert',
    title: 'My iPhone keeps alerting: "iPhone Backup Failed: Not Enough iCloud Storage"',
    shortDesc: 'Your daily backups fail each night because the next estimated snapshot is larger than available space.',
    rootCause: 'Camera Roll inclusion or high-overhead app caches exceeding available quota.',
    technicalMechanism:
      'When iCloud Photos is toggled OFF, your entire local Photo Library is redirected into your nightly device backup snapshot instead! If you have 8 GB of photos on your device and only 5 GB of free iCloud storage, every backup will fail automatically.',
    steps: [
      {
        title: 'Check whether Photo Library is piggybacking on Backup',
        detail: 'Navigate to Settings > [Your Name] > iCloud > Backups > This iPhone. Inspect "Next Backup Size". If "Photo Library" is enabled with several gigabytes, your photos are being dumped into the backup container.',
        path: 'Settings > Apple Account > iCloud > Backups > [This iPhone] > Backup Options',
      },
      {
        title: 'Exclude bloated video or design apps from backup',
        detail: 'In the "Choose Data to Back Up" list, disable video editors, offline music, podcast downloads, or large PDF readers. Their data can be re-downloaded from the App Store if you ever restore.',
        path: 'Settings > Apple Account > iCloud > Backups > [This iPhone] > Toggle Off High-MB Apps',
      },
      {
        title: 'Create a local Mac or PC backup as a safety baseline',
        detail: 'Connect your iPhone to a Mac (Finder) or Windows PC (Apple Devices app / iTunes). Choose "Back up all of the data on your iPhone to this Mac/PC" and check "Encrypt local backup".',
        path: 'Mac Finder or Windows Apple Devices app > General > Back Up Now',
      },
    ],
    recoveryWindow: 'Safe. Disabling individual app backups does not erase data currently on your phone.',
    dangerLevel: 'low',
  },
  {
    id: 'messages-secretly-huge',
    title: 'Messages or "Documents & Data" is consuming 10 GB to 30 GB+',
    shortDesc: 'You rarely save files, but "Messages in iCloud" or "Documents & Data" dominates your storage chart.',
    rootCause: 'Accumulated video clips, GIFs, and large attachments sent over years in group chats.',
    technicalMechanism:
      'When "Messages in iCloud" is active, every 4K video clip, voice memo, meme, or high-res photo you send or receive is synchronized to Apple cloud servers. Unlike text, video attachments average 30–150 MB each. Five years of active texting can silently consume 25 GB without you realizing it.',
    steps: [
      {
        title: 'Review and purge top attachments directly',
        detail: 'Open Settings > General > iPhone Storage > scroll down and tap "Messages". Tap "Photos", "Videos", or "Large Attachments". Tap "Edit", select heavy videos you no longer need, and tap the trash icon.',
        path: 'Settings > General > iPhone Storage > Messages > Review Large Attachments',
      },
      {
        title: 'Change message history retention from "Forever" to "1 Year"',
        detail: 'Go to Settings > Messages > scroll to "Message History" > tap "Keep Messages". Change from "Forever" to "1 Year". This automatically deletes media and messages older than 365 days.',
        path: 'Settings > Messages > Keep Messages > 1 Year (Warning: Deletes old chats)',
      },
      {
        title: 'Check iCloud Drive "Desktop and Documents" on Mac',
        detail: 'If you have a MacBook, it may be automatically uploading your desktop screenshots and project downloads into iCloud Drive. In macOS System Settings > [Your Name] > iCloud > iCloud Drive, review Desktop & Documents Folders.',
        path: 'Mac System Settings > Apple Account > iCloud > iCloud Drive > Options',
      },
    ],
    recoveryWindow: 'Once attachments are deleted from Messages, they cannot be recovered. Save important videos to Photos first.',
    dangerLevel: 'medium',
  },
  {
    id: 'family-sharing-storage-jam',
    title: 'Family Sharing says iCloud is full, but my personal usage is low',
    shortDesc: 'You share a 200 GB or 2 TB plan with family, and everyone is suddenly blocked from backing up.',
    rootCause: 'One family member’s 4K video recording or heavy laptop backup hogged the pooled pool.',
    technicalMechanism:
      'iCloud Family Sharing shares one shared pool of storage without enforcing hard per-user quotas. If one teenager shoots 4K ProRes videos or a family member syncs their Mac video archive, they can consume 180 GB of a 200 GB plan, starving everyone else of backup space.',
    steps: [
      {
        title: 'Identify which family member is using the storage',
        detail: 'Go to Settings > [Your Name] > Family Sharing > Subscriptions > iCloud+ (or Settings > [Your Name] > iCloud > Manage Family Storage). Review the breakdown per family member.',
        path: 'Settings > Apple Account > Family Sharing > iCloud+ Storage Breakdown',
      },
      {
        title: 'Have the heavy user offload 4K video to external storage',
        detail: 'The family member using the disproportionate space should connect their phone to an external drive or computer and export their largest video files.',
        path: 'Family member iPhone > Photos > Albums > Media Types > Videos',
      },
      {
        title: 'Consider individual 50 GB plan ($0.99) or upgrading shared tier',
        detail: 'If family storage demands exceed 200 GB, you can either step up to 2 TB ($9.99/mo) or have individual members leave the shared plan to use their own private $0.99/mo 50 GB plan.',
        path: 'Settings > Apple Account > iCloud > Manage Plan > Change Storage Plan',
      },
    ],
    recoveryWindow: 'Family members cannot view or delete each other’s files. Each member must clean their own data.',
    dangerLevel: 'low',
  },
];

export default function ICloudDiagnosticWizard() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(CASES[0].id);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const currentCase = CASES.find((c) => c.id === selectedCaseId) || CASES[0];

  const toggleStep = (stepKey: string) => {
    setCompletedSteps((prev) => ({ ...prev, [stepKey]: !prev[stepKey] }));
  };

  const resetProgress = () => {
    setCompletedSteps({});
  };

  return (
    <div className="not-prose my-10 rounded-2xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-5 sm:p-8 shadow-sm">
      <div className="border-b border-[#e4e4e8] dark:border-[#27272a] pb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff1f1] dark:bg-[#e5322d]/10 px-3 py-1 text-xs font-bold text-[#e5322d] border border-[#fecaca] dark:border-[#e5322d]/20">
          <HelpCircle className="h-3.5 w-3.5" /> Interactive Troubleshooting Flowchart
        </span>
        <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-[#18181b] dark:text-white">
          Why Is Your iCloud Storage Full? Interactive Diagnostic Wizard
        </h3>
        <p className="mt-1 text-sm text-[#5b5b63] dark:text-[#a1a1aa]">
          Select the symptom matching your situation to diagnose the exact root cause and get an immediate step-by-step resolution.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        {/* Symptom selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#5b5b63] dark:text-[#a1a1aa]">
            Select Your Storage Symptom
          </label>
          <div className="mt-3 space-y-2">
            {CASES.map((item) => {
              const isSelected = item.id === selectedCaseId;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedCaseId(item.id);
                  }}
                  className={`w-full rounded-xl border p-3.5 text-left transition ${
                    isSelected
                      ? 'border-[#e5322d] bg-[#fff1f1] dark:bg-[#e5322d]/10 text-[#18181b] dark:text-white shadow-xs'
                      : 'border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] text-[#5b5b63] dark:text-[#a1a1aa] hover:border-slate-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold leading-snug">{item.title}</span>
                    <ChevronRight
                      className={`h-4 w-4 shrink-0 transition-transform ${
                        isSelected ? 'rotate-90 text-[#e5322d]' : 'text-slate-400'
                      }`}
                    />
                  </div>
                  <p className="mt-1 text-xs text-[#5b5b63] dark:text-[#a1a1aa] line-clamp-2">
                    {item.shortDesc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Diagnosis & Action Steps */}
        <div className="rounded-2xl border border-[#e4e4e8] dark:border-[#27272a] bg-[#f7f7f8] dark:bg-[#121214] p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e4e4e8] dark:border-[#27272a] pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#e5322d] dark:text-[#ff6b68] flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Technical Diagnosis
              </span>
              <span
                className={`rounded px-2 py-0.5 text-[0.68rem] font-bold uppercase ${
                  currentCase.dangerLevel === 'low'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : currentCase.dangerLevel === 'medium'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                }`}
              >
                Risk: {currentCase.dangerLevel}
              </span>
            </div>

            <div className="mt-4">
              <h4 className="text-base sm:text-lg font-extrabold text-[#18181b] dark:text-white">
                {currentCase.rootCause}
              </h4>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa]">
                {currentCase.technicalMechanism}
              </p>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#18181b] dark:text-white">
                  Step-by-Step Fix Protocol
                </span>
                <button
                  onClick={resetProgress}
                  className="inline-flex items-center gap-1 text-[0.72rem] font-medium text-[#5b5b63] dark:text-[#a1a1aa] hover:text-[#e5322d]"
                >
                  <RotateCcw className="h-3 w-3" /> Reset checkboxes
                </button>
              </div>

              <div className="mt-3 space-y-3">
                {currentCase.steps.map((st, idx) => {
                  const stepKey = `${currentCase.id}-step-${idx}`;
                  const isDone = completedSteps[stepKey] || false;
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleStep(stepKey)}
                      className={`cursor-pointer rounded-xl border p-3.5 transition ${
                        isDone
                          ? 'border-emerald-300 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20'
                          : 'border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => {}}
                          className="mt-0.5 h-4 w-4 rounded accent-emerald-600"
                        />
                        <div className="text-xs sm:text-sm">
                          <div className={`font-bold ${isDone ? 'line-through text-slate-500' : 'text-[#18181b] dark:text-white'}`}>
                            {idx + 1}. {st.title}
                          </div>
                          <p className="mt-1 text-xs text-[#5b5b63] dark:text-[#a1a1aa] leading-relaxed">
                            {st.detail}
                          </p>
                          <div className="mt-1.5 font-mono text-[0.7rem] text-[#e5322d] dark:text-[#ff6b68] bg-[#fff1f1] dark:bg-[#e5322d]/10 rounded px-2 py-0.5 inline-block">
                            Path: {st.path}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#e4e4e8] dark:border-[#27272a]">
            <div className="flex items-start gap-2 text-xs leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa]">
              <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <strong>Recovery Note:</strong> {currentCase.recoveryWindow}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
