"use client";

import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { LanguageContext } from "@/contexts/LanguageContext";

export default function PremiumCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Sparkles className="w-12 h-12 text-white/50 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('cta.title')}
            <span className="block text-white/90">{t('cta.subtitle')}</span>
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            {t('cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {t('cta.explore')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20"
            >
              {t('cta.browse')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
