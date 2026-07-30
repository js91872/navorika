import { getAllTools } from "@/lib/toolRegistry";
import Link from 'next/link';

export default function PremiumTools() {
  const tools = getAllTools();

  // Dynamically group the tools by their category property
  const groupedTools = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, typeof tools>);

  // Order categories to control what shows up first (optional)
  const categoryOrder = ['Finance', 'Business', 'PDF Tools'];
  const sortedCategories = Object.keys(groupedTools).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
  });

  return (
    <section className="py-8 space-y-20">
      {tools.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
          <p className="text-slate-500 font-medium">No tools loaded in pipeline baseline registry yet.</p>
        </div>
      ) : (
        sortedCategories.map((category) => (
          <div key={category} className="scroll-mt-24" id={`category-${category.toLowerCase().replace(/\s+/g, '-')}`}>
            
            {/* Category Header */}
            <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
              <div>
                <span className="text-indigo-600 text-xs font-bold uppercase tracking-widest block mb-2">
                  {category} Suite
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {category}
                </h2>
              </div>
              <div className="hidden sm:block">
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                  {groupedTools[category].length} Tools
                </span>
              </div>
            </div>
            
            {/* Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedTools[category].map((tool) => (
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
                      <span className="text-xs font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                        Launch ➔
                      </span>
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
          </div>
        ))
      )}
    </section>
  );
}
