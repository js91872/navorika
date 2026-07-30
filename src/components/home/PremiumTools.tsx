import { getAllTools } from "@/lib/toolRegistry";
import Link from 'next/link';

export default function PremiumTools() {
  const tools = getAllTools();

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-indigo-600 text-xs font-bold uppercase tracking-widest block mb-2">High-Performance Ecosystem</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Active Tools Hub</h2>
        </div>
      </div>
      
      {tools.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
          <p className="text-slate-500 font-medium">No tools loaded in pipeline baseline registry yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link 
              href={tool.path} 
              key={tool.id} 
              className="group p-6 bg-white border border-slate-200 rounded-2xl hover:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                    {tool.category}
                  </span>
                  <span className="text-xs font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">Launch →</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {tool.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
