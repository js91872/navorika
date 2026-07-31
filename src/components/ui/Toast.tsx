'use client';

interface ToastProps {
  message: string;
  isVisible: boolean;
}

export default function Toast({ message, isVisible }: ToastProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3.5 rounded-2xl shadow-2xl text-xs font-bold tracking-wide animate-fade-in-up border border-slate-800 dark:border-slate-200">
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      {message}
    </div>
  );
}
