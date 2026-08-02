export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0A0A0B] text-slate-900 dark:text-slate-100 py-16 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black tracking-tight mb-4">About NavorikaPro</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-12 font-medium">
          The universal client suite engineered for high performance, absolute data privacy, and zero latency.
        </p>

        <div className="p-8 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-sm space-y-6">
          <h3 className="text-2xl font-bold">Our Mission</h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            We build ultra-fast, code-light productivity tools and calculators designed to benchmark top-tier web applications. By eliminating server roundtrips, we guarantee complete privacy for corporate workflows, personal documents, and financial computations.
          </p>
          <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
            <span>Global Edge Architecture</span>
            <span>Zero Tracking Policy</span>
          </div>
        </div>
      </div>
    </main>
  );
}
