"use client";

interface ActionBarProps {
  onExport?: () => void;
  onPrint?: () => void;
  onShare?: () => void;
  onCopy?: () => void;
}

export default function ActionBar({
  onExport,
  onPrint,
  onShare,
  onCopy,
}: ActionBarProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

      <h3 className="mb-4 text-lg font-semibold">
        Actions
      </h3>

      <div className="grid grid-cols-2 gap-3">

        <button
          onClick={onExport}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium transition hover:bg-slate-50"
        >
          Export CSV
        </button>

        <button
          onClick={onPrint}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium transition hover:bg-slate-50"
        >
          Print
        </button>

        <button
          onClick={onShare}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium transition hover:bg-slate-50"
        >
          Share
        </button>

        <button
          onClick={onCopy}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium transition hover:bg-slate-50"
        >
          Copy
        </button>

      </div>

    </div>
  );
}