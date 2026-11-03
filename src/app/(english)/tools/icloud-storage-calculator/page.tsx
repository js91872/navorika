import type { Metadata } from 'next';
import Link from 'next/link';
import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import ICloudStoragePlanner from '@/components/guides/ICloudStoragePlanner';

export const metadata: Metadata = {
  title: 'iCloud Storage Cleanup Planner — Estimate Space You Could Free',
  description: 'Plan iCloud storage cleanup using your own category estimates. Compare hypothetical savings and review photo and backup deletion warnings before acting.',
  alternates: { canonical: 'https://navorika.com/tools/icloud-storage-calculator' },
};

export default function Page() {
  return (
    <ExpansionToolPage
      category="everyday-calculators"
      eyebrow="Plan before you delete"
      title="iCloud Storage Cleanup Planner"
      description="Enter your approximate iCloud storage usage and explore possible cleanup scenarios. This browser-only planner does not connect to Apple or delete any files."
      slug="icloud-storage-calculator"
    >
      <ICloudStoragePlanner />
      <section className="mt-8 space-y-4 rounded-2xl border border-[#e4e4e8] bg-white p-6 text-[#18181b] dark:border-[#27272a] dark:bg-[#18181b] dark:text-white">
        <h2 className="text-2xl font-bold">How to use this iCloud storage planner</h2>
        <p>Open your iCloud storage breakdown in Apple Settings. Choose the storage plan that matches your account, then adjust the Photos, Backups, Messages, and Drive estimates. Select cleanup actions to explore a hypothetical before-and-after scenario. These are planning estimates, not a measurement of recoverable files.</p>
        <h2 className="text-xl font-bold">Before deleting photos or backups</h2>
        <p>iCloud Photos syncs deletions across devices. Deleting an iCloud backup removes a recovery option. Verify independent copies and confirm you no longer need the data before making permanent changes. Removing a local download does not necessarily reduce iCloud usage.</p>
        <h2 className="text-xl font-bold">What this tool cannot do</h2>
        <p>The planner cannot access your Apple account, inspect stored files, recover deleted data, or guarantee how much space you will save. Some selected actions can overlap, and actual results depend on your own storage contents.</p>
        <p>For step-by-step instructions, read our <Link className="font-semibold text-[#e5322d] underline" href="/guides/how-to-clear-icloud-storage">guide to clearing iCloud storage safely</Link>. If your usage remains full after cleanup, see <Link className="font-semibold text-[#e5322d] underline" href="/guides/why-is-my-icloud-storage-full">why iCloud storage may still be full</Link>.</p>
      </section>
    </ExpansionToolPage>
  );
}
