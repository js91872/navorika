'use client';

import dynamic from 'next/dynamic';

// Dynamically import ImageConverterEngine with SSR disabled
const ImageConverterEngine = dynamic(
  () => import('@/components/ImageConverterEngine'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-12">
        <div className="animate-pulse text-slate-400">Loading converter...</div>
      </div>
    )
  }
);

export default function ImageConverterEngineWrapper(props: any) {
  return <ImageConverterEngine {...props} />;
}
