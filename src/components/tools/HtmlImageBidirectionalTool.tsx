'use client';

import { useState } from 'react';
import { ArrowRightLeft, Code2, ImageIcon } from 'lucide-react';

import HtmlToImageConverterTool from '@/components/tools/HtmlToImageConverterTool';
import JpgToHtmlInlineTool from '@/components/tools/image/JpgToHtmlInlineTool';

export default function HtmlImageBidirectionalTool() {
  const [mode, setMode] =
    useState<'html-image' | 'jpg-html'>('html-image');

  return (
    <div>
      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-300">
            <ArrowRightLeft className="size-4" />
            HTML ↔ Image Workspace
          </div>

          <div className="mx-auto flex max-w-xl rounded-2xl border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setMode('html-image')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
                mode === 'html-image'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <Code2 className="size-4" />
              HTML → Image
            </button>

            <button
              type="button"
              onClick={() => setMode('jpg-html')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
                mode === 'jpg-html'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <ImageIcon className="size-4" />
              JPG → HTML
            </button>
          </div>
        </div>
      </div>

      {mode === 'html-image' ? (
        <HtmlToImageConverterTool
          title="HTML to Image Converter"
          description="Convert HTML code or uploaded HTML files into PNG or JPG images with secure browser-local rendering."
          currentSlug="html-to-image"
        />
      ) : (
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              JPG to HTML Converter
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
              Convert JPG or JPEG into a standalone HTML document with
              the image embedded directly as a Base64 Data URL.
            </p>
          </div>

          <JpgToHtmlInlineTool />
        </div>
      )}
    </div>
  );
}
