"use client";

interface ExportButtonProps {
  onClick: () => void;
}

export default function ExportButton({
  onClick,
}: ExportButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700"
    >
      Export Schedule (CSV)
    </button>
  );
}