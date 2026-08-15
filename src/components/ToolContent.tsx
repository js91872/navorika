'use client';

interface ToolContentProps {
  title: string;
  slug: string;
  category: string;
  description: string;
  benefits?: string[];
  useCases?: string[];
  tips?: string[];
}

export default function ToolContent({
  title,
  slug,
  category,
  description,
  benefits = [],
  useCases = [],
  tips = []
}: ToolContentProps) {
  const displayName = title || slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">What is {displayName}?</h2>
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 space-y-4">
          <p className="text-[var(--muted-foreground)] leading-relaxed">{description}</p>
          <p className="text-[var(--muted-foreground)] leading-relaxed">
            {displayName} is a free online tool that helps you with {slug.replace('-', ' ')} 
            quickly and accurately. All processing happens locally in your browser - no data 
            is stored or transmitted to any server.
          </p>
        </div>
      </section>

      {benefits.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Key Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                <span className="text-green-500 text-xl flex-shrink-0 mt-0.5">✅</span>
                <p className="font-medium">{benefit}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {useCases.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Common Use Cases</h2>
          <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
            <ul className="space-y-3">
              {useCases.map((useCase, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-blue-500 text-lg">🎯</span>
                  <span className="text-[var(--muted-foreground)]">{useCase}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {tips.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Tips for Best Results</h2>
          <div className="bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-6">
            <ul className="space-y-2">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-amber-700 dark:text-amber-400">
                  <span className="text-amber-500">💡</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
