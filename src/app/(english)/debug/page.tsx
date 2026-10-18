import { tools, categories } from '@/data/registry';

export default function DebugPage() {
  return (
    <div className="p-10 text-white bg-slate-900 min-h-screen font-mono">
      <h1 className="text-3xl font-bold text-emerald-500 mb-4">SYSTEM DATA DEBUGGER</h1>
      
      <div className="mb-8 p-6 bg-slate-800 rounded-xl border border-slate-700">
        <h2 className="text-2xl font-black text-blue-400">Total Tools Loaded: {tools.length}</h2>
        <h2 className="text-xl font-bold text-purple-400">Total Categories: {categories.length}</h2>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tools.map((t, index) => (
          <div key={t.slug} className="border border-slate-700 rounded p-3 text-xs bg-slate-950">
            <span className="text-emerald-500 font-black">#{index + 1}</span><br/>
            <strong>Slug:</strong> {t.slug}<br/>
            <strong>Category:</strong> <span className="text-rose-400">{t.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
