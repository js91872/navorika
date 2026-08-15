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
  const displayName = title || slug.replace('-', ' ').title();
  
  return (
    <div className="space-y-8">
      {/* What is section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">What is {displayName}?</h2>
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 space-y-4">
          <p className="text-[var(--muted-foreground)] leading-relaxed">
            {description}
          </p>
          <p className="text-[var(--muted-foreground)] leading-relaxed">
            {displayName} is a free online tool that helps you with {slug.replace('-', ' ')} 
            quickly and accurately. Whether you're a professional, student, or hobbyist, 
            this tool provides instant results with complete privacy.
          </p>
          <p className="text-[var(--muted-foreground)] leading-relaxed">
            Unlike other online tools that upload your data to servers, {displayName} processes 
            everything locally in your browser. This means your data never leaves your device, 
            ensuring complete privacy and security.
          </p>
        </div>
      </section>

      {/* Benefits section */}
      {benefits.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Why Use {displayName}?</h2>
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

      {/* How it works */}
      <section>
        <h2 className="text-2xl font-bold mb-4">How Does {displayName} Work?</h2>
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
          <p className="text-[var(--muted-foreground)] leading-relaxed">
            {displayName} uses advanced algorithms to process your data locally in your browser. 
            The tool is built with modern web technologies including WebAssembly and JavaScript, 
            ensuring fast and accurate results every time.
          </p>
          <p className="text-[var(--muted-foreground)] leading-relaxed mt-3">
            All calculations and processing happen on your device. No data is sent to any server, 
            making {displayName} one of the most secure and private tools available online.
          </p>
        </div>
      </section>

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

      {/* FAQ section - built-in */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: `What is ${displayName}?`,
              a: `${displayName} is a free online tool that helps you with ${slug.replace('-', ' ')} quickly and easily. It's designed to be fast, accurate, and completely private.`
            },
            {
              q: `Is ${displayName} really free?`,
              a: `Yes! ${displayName} is completely free to use with no hidden costs, premium plans, or credit card required.`
            },
            {
              q: `Is my data safe with ${displayName}?`,
              a: `Absolutely! ${displayName} processes everything locally in your browser. No files or data are ever uploaded to any server. Your data never leaves your device.`
            },
            {
              q: `Do I need to create an account?`,
              a: `No, you can use ${displayName} instantly without any signup or registration. Just open the tool and start using it.`
            },
            {
              q: `Does ${displayName} work on mobile?`,
              a: `Yes! ${displayName} is fully responsive and works perfectly on all devices including mobile phones, tablets, and desktop computers.`
            }
          ].map((faq, index) => (
            <div key={index} className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
              <h3 className="font-semibold text-[var(--foreground)] mb-2">{faq.q}</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
