"use client";

import { useEffect, useState } from "react";
import { Calculator, FileText, Image, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const stats = [
  { key: "calculators", icon: Calculator, value: "40+", color: "from-blue-500 to-blue-600" },
  { key: "pdf_tools", icon: FileText, value: "15+", color: "from-orange-500 to-orange-600" },
  { key: "image_tools", icon: Image, value: "10+", color: "from-purple-500 to-purple-600" },
  { key: "active_users", icon: Users, value: "10K+", color: "from-pink-500 to-pink-600" },
];

export default function PremiumStats() {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-transparent to-white dark:to-slate-950">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/80 p-6 text-center border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-slate-800/50 transition-all duration-300 hover:-translate-y-1"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              <div className="relative">
                <stat.icon className={`w-8 h-8 mx-auto mb-3 text-transparent bg-gradient-to-br ${stat.color} bg-clip-text`} />
                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t(`stats.${stat.key}`)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
