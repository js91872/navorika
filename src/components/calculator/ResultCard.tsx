interface ResultCardProps {
  label: string;
  value: string;
  icon?: string;
  subtitle?: string;
}

export default function ResultCard({ label, value, icon, subtitle }: ResultCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-center hover:shadow-md transition-shadow dark:border-slate-700 dark:bg-slate-800">
      {icon && <div className="text-2xl mb-1">{icon}</div>}
      <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
      <div className="text-xl font-bold text-slate-800 mt-1 dark:text-slate-200">{value}</div>
      {subtitle && <div className="text-xs text-slate-400 mt-1 dark:text-slate-500">{subtitle}</div>}
    </div>
  );
}
