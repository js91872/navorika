'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '@/lib/i18n/config';

declare global {
  interface Window {
    googlefc?: {
      callbackQueue?: Array<Record<string, () => void>>;
      showRevocationMessage?: () => void;
    };
  }
}

const labels: Record<Locale | 'en', string> = {
  en: 'Privacy and cookie settings',
  fr: 'Paramètres de confidentialité et des cookies',
  it: 'Impostazioni privacy e cookie',
  de: 'Datenschutz- und Cookie-Einstellungen',
  ru: 'Настройки конфиденциальности и файлов cookie',
  pt: 'Configurações de privacidade e cookies',
  es: 'Configuración de privacidad y cookies',
  ar: 'إعدادات الخصوصية وملفات تعريف الارتباط',
};

/** Reopens Google's published European consent message for eligible visitors. */
export default function GoogleConsentSettings({ locale = 'en' }: { locale?: Locale | 'en' }) {
  const [apiReady, setApiReady] = useState(false);
  const enabled = process.env.NEXT_PUBLIC_ADSENSE_CMP_ENABLED === 'true';

  useEffect(() => {
    if (!enabled) return;
    window.googlefc = window.googlefc || {};
    window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
    window.googlefc.callbackQueue.push({
      CONSENT_API_READY: () => setApiReady(true),
    });
  }, [enabled]);

  if (!enabled || !apiReady) return null;

  return (
    <button
      type="button"
      onClick={() => window.googlefc?.showRevocationMessage?.()}
      className="text-left hover:text-[#e5322d] dark:hover:text-[#ef4444] transition-colors"
    >
      {labels[locale]}
    </button>
  );
}
