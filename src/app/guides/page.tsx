export default function GuidesPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0A0A0B] text-slate-900 dark:text-slate-100 py-16 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black tracking-tight mb-4">Platform Guides & Tutorials</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-12 font-medium">
          Learn how to utilize our client-side processing utilities securely and efficiently without server data latency.
        </p>

        <div className="grid gap-6">
          <div className="p-8 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-sm">
            <h3 className="text-xl font-bold mb-2">1. 100% Client-Side Processing Architecture</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Every document manipulation, image compression, and financial calculation runs locally inside your browser virtual memory using Web APIs and optimized JavaScript loops. Your data never gets uploaded to any remote storage.
            </p>
          </div>

          <div className="p-8 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-sm">
            <h3 className="text-xl font-bold mb-2">2. Optimizing High-Precision Calculators</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Explore how to use our amortization matrices, CAGR yield profilers, and tax compliance computation layers to forecast outcomes instantly.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
