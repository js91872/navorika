interface CalculatorHeaderProps {
  title: string;
  description: string;
  icon: string;
  accuracy?: string;
}

export default function CalculatorHeader({
  title,
  description,
  icon,
  accuracy,
}: CalculatorHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white dark:from-blue-700 dark:to-blue-800">
      <div className="flex items-start gap-4">
        <div className="text-4xl">{icon}</div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-blue-100 mt-1 dark:text-blue-200">{description}</p>
          {accuracy && (
            <p className="text-xs text-blue-200 mt-2 opacity-80 dark:text-blue-300">⚡ {accuracy}</p>
          )}
        </div>
      </div>
    </div>
  );
}
