'use client';

import Script from 'next/script';
import { useEffect } from 'react';

const publisherId = 'ca-pub-9025398782962067';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

/** Manual units render only in the two approved editorial positions. */
export default function SafeAdSlot({ slotId }: { slotId: string | undefined }) {
  useEffect(() => {
    if (!slotId) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ad blockers and unavailable ad scripts should not affect tool use.
    }
  }, [slotId]);

  if (!slotId) return null;

  return (
    <aside className="my-6 py-6" aria-label="Advertisement">
      <p className="mb-2 text-center text-xs text-[var(--muted-foreground)]">Advertisement</p>
      <ins
        className="adsbygoogle block min-h-24"
        style={{ display: 'block' }}
        data-ad-client={publisherId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <Script
        id="navorika-adsense-manual-units"
        async
        strategy="afterInteractive"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
        crossOrigin="anonymous"
      />
    </aside>
  );
}
