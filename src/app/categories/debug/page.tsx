import { getAllTools } from "@/lib/toolRegistry";

export default function DebugCategoriesPage() {
  const allTools = getAllTools();
  
  // Get all unique categories
  const categories = [...new Set(allTools.map(t => t.category))];
  
  return (
    <div className="max-w-4xl mx-auto p-12">
      <h1 className="text-3xl font-bold mb-6">Debug: Available Categories</h1>
      <p className="text-slate-600 mb-4">Total tools: {allTools.length}</p>
      
      <div className="bg-slate-100 p-6 rounded-2xl mb-6">
        <h2 className="font-semibold mb-2">Categories found:</h2>
        <ul className="list-disc pl-6">
          {categories.map(cat => (
            <li key={cat} className="text-slate-700">
              {cat} ({allTools.filter(t => t.category === cat).length} tools)
            </li>
          ))}
        </ul>
      </div>
      
      <div className="bg-slate-100 p-6 rounded-2xl">
        <h2 className="font-semibold mb-2">All tools:</h2>
        <ul className="list-disc pl-6">
          {allTools.map(t => (
            <li key={t.slug} className="text-slate-700">
              {t.title} - <span className="text-slate-500">{t.category}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
