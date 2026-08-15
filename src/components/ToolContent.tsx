'use client';

interface ToolContentProps {
  title: string;
  description: string;
  category: string;
  benefits?: string[];
  useCases?: string[];
  tips?: string[];
}

export default function ToolContent({
  title,
  description,
  category,
  benefits = [],
  useCases = [],
  tips = []
}: ToolContentProps) {
  return (
    <div className="space-y-8">
      {/* Detailed Description */}
      <section>
        <h2 className="text-2xl font-bold mb-4">What is {title}?</h2>
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
          <p className="text-[var(--muted-foreground)] leading-relaxed">
            {description}
          </p>
          <p className="text-[var(--muted-foreground)] leading-relaxed mt-4">
            This free online {title.toLowerCase()} is designed to help you with {category.replace('-', ' ')} 
            quickly and accurately. Whether you're a professional, student, or hobbyist, this tool 
            provides instant results with complete privacy.
          </p>
          <p className="text-[var(--muted-foreground)] leading-relaxed mt-4">
            Unlike other online tools that upload your data to servers, {title} processes everything 
            locally in your browser. This means your data never leaves your device, ensuring complete 
            privacy and security.
          </p>
        </div>
      </section>

      {/* Benefits */}
      {benefits.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Why Use {title}?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                <span className="text-green-500 text-xl flex-shrink-0 mt-0.5">✅</span>
                <div>
                  <p className="font-medium">{benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Use Cases */}
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

      {/* Tips */}
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
