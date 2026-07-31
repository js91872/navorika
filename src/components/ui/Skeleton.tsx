export default function SkeletonLoader() {
  return (
    <div className="w-full space-y-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse">
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3"></div>
      <div className="space-y-2 pt-2">
        <div className="h-10 bg-slate-100 dark:bg-slate-800/60 rounded-xl w-full"></div>
        <div className="h-10 bg-slate-100 dark:bg-slate-800/60 rounded-xl w-full"></div>
      </div>
      <div className="h-12 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl w-full mt-4"></div>
    </div>
  );
}
