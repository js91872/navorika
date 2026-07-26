"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'es' | 'fr' | 'de' | 'pt' | 'it' | 'ru' | 'ja' | 'ko' | 'zh' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translations: Record<string, any>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Default English translations as fallback
const defaultTranslations = {
  nav: {
    tools: "Tools",
    categories: "Categories",
    guides: "Guides",
    about: "About",
    signIn: "Sign In",
    getStarted: "Get Started",
    search: "Search tools..."
  },
  home: {
    title: "Your Smart Toolkit for the Digital Age",
    subtitle: "Free online calculators, PDF tools, image utilities, and more — beautifully designed, lightning fast, and always free.",
    searchPlaceholder: "Search tools... (e.g., PDF, EMI, Inflation)",
    searchButton: "Search",
    trusted: "Trusted by 50,000+ users",
    responseTime: "1s average response",
    activeUsers: "50K+ active users",
    rating: "4.9/5 user rating"
  },
  hero: {
    badge: "Trusted by 10,000+ users",
    title: "Smart Tools for",
    subtitle: "Modern Professionals",
    description: "Access 40+ premium calculators and utilities designed to boost productivity, simplify complex tasks, and save you time.",
    search_placeholder: "Search for any tool...",
    search_button: "Search",
    fast: "Fast & Free",
    secure: "Secure & Private",
    users: "10K+ Users"
  },
  stats: {
    calculators: "Calculators",
    pdf_tools: "PDF Tools",
    image_tools: "Image Tools",
    active_users: "Active Users"
  },
  categories: {
    title: "Categories",
    heading: "Explore Our",
    subheading: "Tool Categories",
    description: "Find the perfect tool for your needs across 7 specialized categories",
    finance: "Finance",
    pdf_tools: "PDF Tools",
    image_tools: "Image Tools",
    health: "Health",
    productivity: "Productivity",
    developer: "Developer",
    construction: "Construction",
    back: "Back to Categories",
    tools: "tools",
    tool: "tool"
  },
  tools: {
    featured: "Featured",
    title: "Most Popular",
    subheading: "Featured Tools",
    description: "Hand-picked tools that our users love and use every day",
    view_all: "View All Tools"
  },
  features: {
    title: "Why Choose",
    subheading: "Navorika?",
    description: "We combine powerful functionality with an exceptional user experience",
    lightning: "Lightning Fast",
    lightning_desc: "Instant calculations with no loading delays",
    secure: "100% Secure",
    secure_desc: "All calculations are client-side and private",
    available: "Always Available",
    available_desc: "24/7 access from any device, anywhere",
    free: "Free to Use",
    free_desc: "No subscriptions, no hidden fees",
    users: "10K+ Users",
    users_desc: "Trusted by professionals worldwide",
    design: "Beautiful Design",
    design_desc: "Clean, modern interface with dark mode"
  },
  cta: {
    title: "Ready to Boost Your",
    subtitle: "Productivity?",
    description: "Join thousands of users who rely on Navorika for their daily calculations and conversions.",
    explore: "Explore All Tools",
    browse: "Browse Categories"
  },
  footer: {
    product: "Product",
    company: "Company",
    resources: "Resources",
    about: "About",
    contact: "Contact",
    privacy: "Privacy",
    blog: "Blog",
    help: "Help",
    sitemap: "Sitemap",
    rights: "All rights reserved"
  },
  search: {
    title: "Search Results",
    placeholder: "Search for tools...",
    noResults: "No tools found",
    tryAdjusting: "Try adjusting your search terms",
    browseAll: "Browse all tools",
    startSearching: "Start searching",
    searchBy: "Search for any tool by name, category, or keyword",
    found: "Found",
    results: "results",
    result: "result",
    for: "for",
    viewAll: "View all results"
  },
  common: {
    loading: "Loading...",
    error: "Something went wrong",
    tryAgain: "Try again",
    back: "Back",
    viewAll: "View all",
    showMore: "Show more",
    showLess: "Show less"
  }
};

// Translation data for all languages
const translationsData: Record<Language, Record<string, any>> = {
  en: defaultTranslations,
  
  hi: {
    nav: {
      tools: "उपकरण",
      categories: "श्रेणियाँ",
      guides: "गाइड",
      about: "हमारे बारे में",
      signIn: "साइन इन करें",
      getStarted: "शुरू करें",
      search: "उपकरण खोजें..."
    },
    home: {
      title: "डिजिटल युग के लिए आपका स्मार्ट टूलकिट",
      subtitle: "मुफ्त ऑनलाइन कैलकुलेटर, पीडीएफ टूल, इमेज यूटिलिटीज और भी बहुत कुछ — सुंदर डिज़ाइन, तेज़ और हमेशा मुफ्त।",
      searchPlaceholder: "उपकरण खोजें... (जैसे, पीडीएफ, ईएमआई, मुद्रास्फीति)",
      searchButton: "खोजें",
      trusted: "50,000+ उपयोगकर्ताओं द्वारा विश्वसनीय",
      responseTime: "1 सेकंड औसत प्रतिक्रिया",
      activeUsers: "50K+ सक्रिय उपयोगकर्ता",
      rating: "4.9/5 उपयोगकर्ता रेटिंग"
    },
    hero: {
      badge: "10,000+ उपयोगकर्ताओं द्वारा विश्वसनीय",
      title: "आधुनिक पेशेवरों के लिए",
      subtitle: "स्मार्ट टूल्स",
      description: "40+ प्रीमियम कैलकुलेटर और उपयोगिताएँ जो उत्पादकता बढ़ाने, जटिल कार्यों को सरल बनाने और आपका समय बचाने के लिए डिज़ाइन की गई हैं।",
      search_placeholder: "कोई भी टूल खोजें...",
      search_button: "खोजें",
      fast: "तेज़ और मुफ्त",
      secure: "सुरक्षित और निजी",
      users: "10K+ उपयोगकर्ता"
    },
    stats: {
      calculators: "कैलकुलेटर",
      pdf_tools: "पीडीएफ टूल्स",
      image_tools: "इमेज टूल्स",
      active_users: "सक्रिय उपयोगकर्ता"
    },
    categories: {
      title: "श्रेणियाँ",
      heading: "हमारी",
      subheading: "टूल श्रेणियाँ",
      description: "7 विशेष श्रेणियों में अपनी आवश्यकताओं के लिए सही टूल खोजें",
      finance: "वित्त",
      pdf_tools: "पीडीएफ टूल्स",
      image_tools: "इमेज टूल्स",
      health: "स्वास्थ्य",
      productivity: "उत्पादकता",
      developer: "डेवलपर",
      construction: "निर्माण",
      back: "श्रेणियों पर वापस जाएं",
      tools: "उपकरण",
      tool: "उपकरण"
    },
    tools: {
      featured: "विशेष",
      title: "सबसे लोकप्रिय",
      subheading: "विशेष टूल्स",
      description: "हाथ से चुने गए टूल्स जिन्हें हमारे उपयोगकर्ता पसंद करते हैं और रोज़ाना उपयोग करते हैं",
      view_all: "सभी टूल्स देखें"
    },
    features: {
      title: "क्यों चुनें",
      subheading: "Navorika?",
      description: "हम शक्तिशाली कार्यक्षमता को एक असाधारण उपयोगकर्ता अनुभव के साथ जोड़ते हैं",
      lightning: "तेज़",
      lightning_desc: "कोई लोडिंग देरी नहीं, तुरंत गणना",
      secure: "100% सुरक्षित",
      secure_desc: "सभी गणनाएँ क्लाइंट-साइड और निजी हैं",
      available: "हमेशा उपलब्ध",
      available_desc: "किसी भी डिवाइस से 24/7 पहुँच",
      free: "मुफ्त",
      free_desc: "कोई सब्सक्रिप्शन नहीं, कोई छिपी हुई फीस नहीं",
      users: "10K+ उपयोगकर्ता",
      users_desc: "दुनिया भर के पेशेवरों द्वारा भरोसा किया गया",
      design: "सुंदर डिज़ाइन",
      design_desc: "स्वच्छ, आधुनिक इंटरफ़ेस डार्क मोड के साथ"
    },
    cta: {
      title: "अपनी उत्पादकता बढ़ाने के लिए",
      subtitle: "तैयार हैं?",
      description: "हजारों उपयोगकर्ताओं के साथ जुड़ें जो अपनी दैनिक गणनाओं और रूपांतरणों के लिए Navorika पर भरोसा करते हैं।",
      explore: "सभी टूल्स देखें",
      browse: "श्रेणियाँ ब्राउज़ करें"
    },
    footer: {
      product: "उत्पाद",
      company: "कंपनी",
      resources: "संसाधन",
      about: "हमारे बारे में",
      contact: "संपर्क करें",
      privacy: "गोपनीयता",
      blog: "ब्लॉग",
      help: "सहायता",
      sitemap: "साइटमैप",
      rights: "सभी अधिकार सुरक्षित"
    },
    search: {
      title: "खोज परिणाम",
      placeholder: "उपकरण खोजें...",
      noResults: "कोई उपकरण नहीं मिला",
      tryAdjusting: "अपने खोज शब्दों को समायोजित करने का प्रयास करें",
      browseAll: "सभी उपकरण ब्राउज़ करें",
      startSearching: "खोज शुरू करें",
      searchBy: "नाम, श्रेणी या कीवर्ड द्वारा किसी भी उपकरण को खोजें",
      found: "मिला",
      results: "परिणाम",
      result: "परिणाम",
      for: "के लिए",
      viewAll: "सभी परिणाम देखें"
    },
    common: {
      loading: "लोड हो रहा है...",
      error: "कुछ गलत हो गया",
      tryAgain: "पुनः प्रयास करें",
      back: "वापस",
      viewAll: "सभी देखें",
      showMore: "और दिखाएं",
      showLess: "कम दिखाएं"
    }
  },
  // ... add other languages here (es, fr, de, etc.)
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState(translationsData['en']);

  useEffect(() => {
    // Load saved language preference
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && translationsData[savedLang]) {
      setLanguage(savedLang);
      setTranslations(translationsData[savedLang]);
    } else {
      // Detect browser language
      try {
        const browserLang = navigator.language.split('-')[0] as Language;
        if (translationsData[browserLang]) {
          setLanguage(browserLang);
          setTranslations(translationsData[browserLang]);
        }
      } catch {
        // Use default English
      }
    }
  }, []);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return the key if translation not found
      }
    }
    return typeof value === 'string' ? value : key;
  };

  const changeLanguage = (lang: Language) => {
    if (translationsData[lang]) {
      setLanguage(lang);
      setTranslations(translationsData[lang]);
      localStorage.setItem('language', lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
