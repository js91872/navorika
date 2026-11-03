'use client';

import { useState } from 'react';
import { ShieldCheck, Check, X, AlertTriangle } from 'lucide-react';

interface Scenario {
  id: string;
  title: string;
  targetDevice: string;
  riskRating: 'low' | 'moderate';
  summary: string;
  dataLost: string[];
  dataSafe: string[];
  recommendation: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'old-device',
    title: 'Deleting backup of an old / traded-in iPhone or iPad',
    targetDevice: 'A previously owned device you no longer carry',
    riskRating: 'moderate', 
    summary:
      'Deleting an old device backup may free storage, but it permanently removes that recovery point. Confirm that no unique data remains only in that backup and that you have a usable alternative before deleting.',
    dataLost: [
      'The historical settings snapshot of that old device',
      'The ability to clone that exact old phone to a new device in the future',
    ],
    dataSafe: [
      'All data on your current active iPhone and iPad',
      'All iCloud Photos, Contacts, Notes, and iCloud Drive documents',
      'All iMessage history',
      'All App Store purchases and account credentials',
    ],
    recommendation:
      'Do not delete until you have checked the backup date, device identity, and whether it contains information you might still need to restore.',
  },
  {
    id: 'active-device-cloud-only',
    title: 'Deleting backup of your current active phone (no local backup)',
    targetDevice: 'Your primary everyday iPhone',
    riskRating: 'moderate',
    summary:
      'Does NOT delete anything off your physical phone. Your photos, contacts, apps, and messages remain completely intact right now. However, if your phone is lost, stolen, or dropped in water tomorrow, you will have no cloud snapshot to restore your settings and home screen.',
    dataLost: [
      'Nightly automated disaster recovery snapshot',
      'Home screen app layout and custom wallpaper arrangements',
      'App state and local game saves not backed up to a dedicated developer cloud',
      'Health data and HomeKit configurations if not synced via Keychain',
    ],
    dataSafe: [
      'Everything currently on your iPhone right now (nothing disappears)',
      'iCloud Photos (photos stay on your phone and in iCloud Photos)',
      'Contacts, Calendars, Notes, and Reminders',
      'Messages in iCloud (if turned on in Settings)',
      'iCloud Drive documents and files',
    ],
    recommendation:
      'Before deleting, create a free encrypted local backup on your Mac or PC, or toggle off heavy individual apps instead of wiping the entire backup.',
  },
  {
    id: 'active-device-local-backup',
    title: 'Deleting iCloud backup after creating a local Mac / PC backup',
    targetDevice: 'Your primary iPhone, safely mirrored to computer',
    riskRating: 'low',
    summary:
      'A verified encrypted computer backup provides an alternative recovery method, but it can become outdated or unavailable if the computer fails. Keep another protected copy and understand that cloud backup protection will be lost.',
    dataLost: [
      'Automated nightly cloud backups over Wi-Fi (you must plug into computer periodically to back up manually)',
    ],
    dataSafe: [
      'Full physical phone data (intact on device)',
      'Full encrypted backup snapshot (stored safely on your Mac or PC drive)',
      'All live synchronized iCloud data (Photos, Contacts, Notes, Drive)',
      'Health data and saved passwords (safely included in encrypted local backup)',
    ],
    recommendation:
      'Consider keeping iCloud Backup enabled. If you choose to delete it, first verify that the encrypted computer backup can be located and restored, and establish a regular backup schedule.',
  },
];

export default function ICloudBackupSafetyChecklist() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(SCENARIOS[0].id);
  const [checks, setChecks] = useState<Record<string, boolean>>({
    'check-sync': true,
    'check-device': true,
    'check-local': false,
    'check-understand': true,
  });

  const scenario = SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIOS[0];

  const toggleCheck = (id: string) => {
    setChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allChecksSatisfied =
    checks['check-sync'] && checks['check-device'] && checks['check-understand'];

  return (
    <div className="not-prose my-10 rounded-2xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-5 sm:p-8 shadow-sm">
      <div className="border-b border-[#e4e4e8] dark:border-[#27272a] pb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff1f1] dark:bg-[#e5322d]/10 px-3 py-1 text-xs font-bold text-[#e5322d] border border-[#fecaca] dark:border-[#e5322d]/20">
          <ShieldCheck className="h-3.5 w-3.5" /> Safety Verification Tool
        </span>
        <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-[#18181b] dark:text-white">
          iCloud Backup Pre-Deletion Safety Checklist &amp; Consequence Simulator
        </h3>
        <p className="mt-1 text-sm text-[#5b5b63] dark:text-[#a1a1aa]">
          Verify exactly what will and will not happen before tapping &quot;Delete Backup&quot;. Deleting a backup does NOT erase your physical phone.
        </p>
      </div>

      {/* Scenario buttons */}
      <div className="mt-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#5b5b63] dark:text-[#a1a1aa]">
          Select What You Are Planning to Delete
        </label>
        <div className="mt-2.5 grid gap-3 sm:grid-cols-3">
          {SCENARIOS.map((s) => {
            const isSelected = s.id === selectedScenarioId;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedScenarioId(s.id)}
                className={`rounded-xl border p-4 text-left transition ${
                  isSelected
                    ? 'border-[#e5322d] bg-[#fff1f1] dark:bg-[#e5322d]/10 text-[#18181b] dark:text-white font-bold shadow-xs'
                    : 'border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] text-[#5b5b63] dark:text-[#a1a1aa] hover:border-slate-300'
                }`}
              >
                <div className="text-xs uppercase font-extrabold tracking-wider text-[#e5322d] dark:text-[#ff6b68]">
                  {s.riskRating === 'low'
                    ? 'Low Risk'
                    : 'Moderate Risk'}
                </div>
                <div className="mt-1 text-sm font-bold leading-tight">{s.title}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Consequence Matrix */}
      <div className="mt-6 rounded-2xl border border-[#e4e4e8] dark:border-[#27272a] bg-[#f7f7f8] dark:bg-[#121214] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e4e4e8] dark:border-[#27272a] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#5b5b63] dark:text-[#a1a1aa]">
              Target Device Scope
            </span>
            <div className="text-base font-extrabold text-[#18181b] dark:text-white">
              {scenario.targetDevice}
            </div>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
              scenario.riskRating === 'low'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
            }`}
          >
            {scenario.riskRating === 'low'
              ? 'Locally Protected'
              : 'Caution Advised'}
          </span>
        </div>

        <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa]">
          {scenario.summary}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {/* What is safe */}
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-950/80 bg-white dark:bg-[#18181b] p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              <Check className="h-4 w-4" /> What Is Not Directly Removed by This Action
            </div>
            <ul className="mt-3 space-y-2 text-xs text-[#5b5b63] dark:text-[#a1a1aa]">
              {scenario.dataSafe.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-0.5">&bull;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What is lost */}
          <div className="rounded-xl border border-red-200 dark:border-red-950/80 bg-white dark:bg-[#18181b] p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
              <X className="h-4 w-4" /> What Is Removed by Deleting Backup
            </div>
            <ul className="mt-3 space-y-2 text-xs text-[#5b5b63] dark:text-[#a1a1aa]">
              {scenario.dataLost.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-red-600 font-bold mt-0.5">&bull;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actionable recommendation */}
        <div className="mt-5 rounded-xl bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] p-4 text-xs leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa]">
          <strong className="text-[#18181b] dark:text-white">Editorial Recommendation: </strong>
          {scenario.recommendation}
        </div>
      </div>

      {/* Safety checklist verification */}
      <div className="mt-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#5b5b63] dark:text-[#a1a1aa]">
          Interactive Pre-Deletion Safety Check
        </label>
        <div className="mt-3 space-y-2.5">
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#e4e4e8] dark:border-[#27272a] p-3 hover:bg-[#f7f7f8] dark:hover:bg-[#202023] transition">
            <input
              type="checkbox"
              checked={checks['check-sync']}
              onChange={() => toggleCheck('check-sync')}
              className="mt-0.5 h-4 w-4 rounded accent-[#e5322d]"
            />
            <span className="text-xs sm:text-sm text-[#18181b] dark:text-white">
              I verified that iCloud Photos, Contacts, and Notes sync toggles are <strong>ON</strong> in Settings &gt; [My Name] &gt; iCloud. (These sync independently of backups).
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#e4e4e8] dark:border-[#27272a] p-3 hover:bg-[#f7f7f8] dark:hover:bg-[#202023] transition">
            <input
              type="checkbox"
              checked={checks['check-device']}
              onChange={() => toggleCheck('check-device')}
              className="mt-0.5 h-4 w-4 rounded accent-[#e5322d]"
            />
            <span className="text-xs sm:text-sm text-[#18181b] dark:text-white">
              I checked the device name under Backups to confirm whether it is an old retired device or my active everyday phone.
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#e4e4e8] dark:border-[#27272a] p-3 hover:bg-[#f7f7f8] dark:hover:bg-[#202023] transition">
            <input
              type="checkbox"
              checked={checks['check-local']}
              onChange={() => toggleCheck('check-local')}
              className="mt-0.5 h-4 w-4 rounded accent-[#e5322d]"
            />
            <span className="text-xs sm:text-sm text-[#18181b] dark:text-white">
              (Optional but recommended) I created an encrypted offline backup on my Mac (Finder) or Windows PC (Apple Devices app).
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#e4e4e8] dark:border-[#27272a] p-3 hover:bg-[#f7f7f8] dark:hover:bg-[#202023] transition">
            <input
              type="checkbox"
              checked={checks['check-understand']}
              onChange={() => toggleCheck('check-understand')}
              className="mt-0.5 h-4 w-4 rounded accent-[#e5322d]"
            />
            <span className="text-xs sm:text-sm text-[#18181b] dark:text-white">
              I understand that deleting this backup does <strong>NOT</strong> delete the apps, pictures, or contacts currently stored on my physical phone.
            </span>
          </label>
        </div>
      </div>

      {/* Safety verdict */}
      <div className="mt-6 border-t border-[#e4e4e8] dark:border-[#27272a] pt-4">
        {allChecksSatisfied ? (
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
            <span>
              Checklist completed. Deleting a backup is irreversible and may remove your only recovery copy. Confirm the correct device and a verified alternative backup before proceeding.
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5" />
            <span>
              Please review and complete the safety checklist above before deleting backups.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
