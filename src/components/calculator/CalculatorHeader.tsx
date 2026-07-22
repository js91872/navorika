interface CalculatorHeaderProps {
  title: string;
  description: string;
  icon: string;
  accuracy?: string;
  showTitle?: boolean;
}

export default function CalculatorHeader({
  title,
  description,
  icon,
  accuracy,
  showTitle = false,
}: CalculatorHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-brand-600 via-accent-500 to-brand-600 bg-[length:200%_auto] px-6 py-6 text-white">
      <div className="flex items-center gap-4">
        <div className="text-3xl">{icon}</div>
        <div className="flex-1">
          {showTitle && <h2 className="text-xl font-bold">{title}</h2>}
          <p className="text-sm text-white/80">{description}</p>
          {accuracy && (
            <p className="text-xs text-white/60 mt-1">⚡ {accuracy}</p>
          )}
        </div>
      </div>
    </div>
  );
}
