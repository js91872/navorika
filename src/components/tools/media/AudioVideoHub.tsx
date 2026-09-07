import Link from 'next/link';
import { ArrowRight, ShieldCheck, Cpu, Sparkles } from 'lucide-react';
import { tools } from '@/data/registry';
import { getToolIcon } from '@/lib/toolIcons';

interface HubSection {
  title: string;
  description: string;
  slugs: string[];
}

const sections: HubSection[] = [
  {
    title: 'Video to Audio Extraction',
    description:
      'Extract pristine audio tracks from popular video containers directly in your browser. No server upload required.',
    slugs: [
      'video-to-mp3-converter',
      'mp4-to-mp3-converter',
      'webm-to-mp3-converter',
      'mov-to-mp3-converter',
      'video-to-audio-converter',
      'extract-audio-from-video',
    ],
  },
  {
    title: 'Audio Format Transcoding',
    description:
      'Transcode between audio codecs, convert voice memos and Apple recordings to universal MP3, or decode MP3s to uncompressed WAV.',
    slugs: [
      'm4a-to-mp3-converter',
      'wav-to-mp3-converter',
      'mp3-to-wav-converter',
    ],
  },
  {
    title: 'Audio Bitrate & Storage Planning',
    description:
      'Calculate bitrates from file size and duration or estimate download sizes across streaming tiers.',
    slugs: [
      'audio-bitrate-calculator',
    ],
  },
];

export default function AudioVideoHub() {
  return (
    <div className="mx-auto max-w-6xl space-y-12">
      {/* Privacy & Architecture Callout */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-emerald-950 dark:border-emerald-500/20 dark:text-emerald-100">
        <div className="flex items-center gap-2.5 font-bold text-emerald-800 dark:text-emerald-300">
          <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          <span>100% In-Browser Privacy & Local Processing Architecture</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-emerald-900/90 dark:text-emerald-200/90">
          Unlike traditional web media converters that transmit your files across the internet to remote servers,
          Navorika executes audio and video extraction locally inside your browser tab using Web Audio API
          and sandboxed WebAssembly engines. Your private media never leaves your device.
        </p>
      </div>

      {/* Feature Highlights */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <Cpu className="h-5 w-5" />
          </div>
          <h3 className="mt-3 font-bold text-slate-900 dark:text-white">Local WebAssembly</h3>
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Single-threaded client FFmpeg WASM extracts and transcodes media directly in browser memory.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="mt-3 font-bold text-slate-900 dark:text-white">Zero Server Uploads</h3>
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Your videos, voice recordings, and files stay completely private on your computer or phone.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="mt-3 font-bold text-slate-900 dark:text-white">Bitrate Control</h3>
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Choose exact MP3 encoding quality from 96 kbps voice up to 320 kbps studio master tiers.
          </p>
        </div>
      </div>

      {/* Sections & Tool Cards */}
      {sections.map((section) => (
        <section key={section.title} className="space-y-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {section.title}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {section.description}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {section.slugs.flatMap((slug) => {
              const tool = tools.find((item) => item.slug === slug);
              if (!tool) return [];
              return [
                <Link
                  key={slug}
                  href={`/tools/${slug}`}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex gap-3.5">
                    <span className="text-2xl shrink-0" aria-hidden="true">
                      {getToolIcon(slug)}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                        {tool.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    Open tool <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>,
              ];
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
