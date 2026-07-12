interface ResultCardProps {
  label: string;
  value: string;
  subtitle?: string;
  highlight?: boolean;
}

export default function ResultCard({
  label,
  value,
  subtitle,
  highlight = false,
}: ResultCardProps) {
  return (
    <div
      className={`
        rounded-3xl border p-6 transition-all duration-200
        ${
          highlight
            ? "border-blue-600 bg-blue-50 shadow-lg"
            : "border-slate-200 bg-white shadow-sm hover:shadow-md"
        }
      `}
    >
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </h3>

      {subtitle && (
        <p className="mt-2 text-sm text-slate-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}