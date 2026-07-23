"use client";

import { Shield, Users, Star, Zap, CheckCircle, Clock } from "lucide-react";

interface TrustSignal {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export function TrustSignals() {
  const signals: TrustSignal[] = [
    {
      icon: <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
      label: "Active Users",
      value: "50,000+",
    },
    {
      icon: <Star className="h-5 w-5 text-amber-500" />,
      label: "User Rating",
      value: "4.9/5",
    },
    {
      icon: <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      label: "Privacy First",
      value: "100% Secure",
    },
    {
      icon: <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
      label: "Response Time",
      value: "< 1 second",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50/80 to-white dark:from-slate-900/50 dark:to-slate-800/30 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 backdrop-blur-sm">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {signals.map((signal, index) => (
          <div key={index} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition">
            <div className="flex-shrink-0 rounded-full bg-white dark:bg-slate-800 p-2 shadow-sm">
              {signal.icon}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {signal.value}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {signal.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
