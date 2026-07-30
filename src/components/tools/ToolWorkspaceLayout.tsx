import { ReactNode } from 'react';

interface ToolWorkspaceProps {
  title: string;
  description: string;
  category: string;
  children: ReactNode;
}

export default function ToolWorkspaceLayout({ title, description, category, children }: ToolWorkspaceProps) {
  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Optimized Header Section */}
      <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 text-xs font-bold rounded-full border border-indigo-100 dark:border-indigo-900 uppercase tracking-wider">
            {category}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base max-w-3xl leading-relaxed">{description}</p>
      </div>

      {/* Main Wide-Screen Ergonomic Workspace Container */}
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none">
        {children}
      </div>
    </div>
  );
}
