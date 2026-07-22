interface ResultCardProps {
  label: string;
  value: string;
  icon?: string;
  subtitle?: string;
  className?: string;
}

export default function ResultCard({ 
  label, 
  value, 
  icon, 
  subtitle,
  className = "" 
}: ResultCardProps) {
  return (
    <div className={`rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-center transition-all hover:shadow-md ${className}`}>
      {icon && <div className="text-2xl mb-1">{icon}</div>}
      <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
      <div className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200 mt-0.5">
        {value}
      </div>
      {subtitle && (
        <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          {subtitle}
        </div>
      )}
    </div>
  );
}
