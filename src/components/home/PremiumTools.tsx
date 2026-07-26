"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { getAllTools } from "@/lib/toolRegistry";

export default function PremiumTools() {
  const [tools, setTools] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    try {
      const allTools = getAllTools();
      const featured = allTools.filter(tool => tool.featured === true).slice(0, 6);
      setTools(featured);
    } catch (error) {
      console.error("Error loading tools:", error);
    }
  }, []);

  if (tools.length === 0) {
    return null;
  }

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      "Finance": "💰",
      "Health": "💪",
      "PDF Tools": "📄",
      "Image Tools": "🖼️",
      "Developer Tools": "💻",
      "productivity": "🚀",
      "Construction": "🏗️",
    };
    return emojis[category] || "🔧";
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Finance": "from-blue-500 to-blue-600",
      "Health": "from-emerald-500 to-emerald-600",
      "PDF Tools": "from-orange-500 to-orange-600",
      "Image Tools": "from-purple-500 to-purple-600",
      "Developer Tools": "from-cyan-500 to-cyan-600",
      "productivity": "from-indigo-500 to-indigo-600",
      "Construction": "from-amber-500 to-amber-600",
    };
    return colors[category] || "from-slate-500 to-slate-600";
  };

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Featured</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Most Popular
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-1">
              Featured Tools
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Hand-picked tools that our users love and use every day
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-2 transition-all duration-700 opacity-0 translate-y-10`}
              style={{ 
                animation: `fadeInUp 0.6s ease forwards ${index * 0.1 + 0.3}s`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-slate-800/50" />
              
              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryColor(tool.category)} flex items-center justify-center text-xl shadow-lg`}>
                    {getCategoryEmoji(tool.category)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {tool.title}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                      {tool.category}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                  {tool.shortDescription}
                </p>
                <div className="flex flex-wrap gap-2">
                  {tool.keywords?.slice(0, 2).map((keyword: string) => (
                    <span key={keyword} className="text-xs px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Gradient line at bottom */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${getCategoryColor(tool.category)} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
          >
            View All Tools
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
