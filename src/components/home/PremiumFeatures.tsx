"use client";

import { useEffect, useState } from "react";
import { Zap, Shield, Clock, Globe, Users, Sparkles } from "lucide-react";

const features = [
  { icon: Zap, title: "Lightning Fast", desc: "Instant calculations with no loading delays", color: "from-yellow-500 to-orange-500" },
  { icon: Shield, title: "100% Secure", desc: "All calculations are client-side and private", color: "from-emerald-500 to-teal-500" },
  { icon: Clock, title: "Always Available", desc: "24/7 access from any device, anywhere", color: "from-blue-500 to-cyan-500" },
  { icon: Globe, title: "Free to Use", desc: "No subscriptions, no hidden fees", color: "from-purple-500 to-pink-500" },
  { icon: Users, title: "10K+ Users", desc: "Trusted by professionals worldwide", color: "from-pink-500 to-rose-500" },
  { icon: Sparkles, title: "Beautiful Design", desc: "Clean, modern interface with dark mode", color: "from-indigo-500 to-purple-500" },
];

export default function PremiumFeatures() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Why Choose
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-1">
              Navorika?
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            We combine powerful functionality with an exceptional user experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-8 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-1`}
              style={{ animation: `fadeInUp 0.6s ease forwards ${index * 0.1 + 0.3}s`, opacity: 0 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              <div className="relative">
                <feature.icon className={`w-10 h-10 mb-4 text-transparent bg-gradient-to-br ${feature.color} bg-clip-text`} />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
