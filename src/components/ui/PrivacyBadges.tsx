import { CloudOff, LockKeyhole, UserRoundX, WifiOff } from 'lucide-react';
import { getToolCapabilities } from '@/data/toolUx';

export default function PrivacyBadges({ slug, className = '' }: { slug: string; className?: string }) {
  const capabilities = getToolCapabilities(slug);
  const badges = [
    capabilities.processedLocally && { label: 'Processed locally', icon: CloudOff },
    capabilities.noUpload && { label: 'No upload required', icon: LockKeyhole },
    capabilities.noAccount && { label: 'No account required', icon: UserRoundX },
    capabilities.worksOffline && { label: 'Works offline', icon: WifiOff },
  ].filter((badge): badge is { label: string; icon: typeof CloudOff } => Boolean(badge));

  if (!badges.length) return null;
  return <ul aria-label="Verified tool capabilities" className={`flex flex-wrap gap-2 ${className}`}>
    {badges.map(({ label, icon: Icon }) => <li key={label} className="inline-flex min-h-9 items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300"><Icon className="size-4" aria-hidden="true" />{label}</li>)}
  </ul>;
}
