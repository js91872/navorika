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
  
  es: {
    nav: {
      tools: "Herramientas",
      categories: "Categorías",
      guides: "Guías",
      about: "Acerca de",
      signIn: "Iniciar sesión",
      getStarted: "Comenzar",
      search: "Buscar herramientas..."
    },
    home: {
      title: "Tu Kit de Herramientas Inteligente para la Era Digital",
      subtitle: "Calculadoras en línea gratuitas, herramientas PDF, utilidades de imágenes y más — diseñadas con elegancia, súper rápidas y siempre gratuitas.",
      searchPlaceholder: "Buscar herramientas... (ej. PDF, EMI, Inflación)",
      searchButton: "Buscar",
      trusted: "Confiable por 50,000+ usuarios",
      responseTime: "1s de respuesta promedio",
      activeUsers: "50K+ usuarios activos",
      rating: "Calificación 4.9/5"
    },
    hero: {
      badge: "Confiado por 10,000+ usuarios",
      title: "Herramientas Inteligentes para",
      subtitle: "Profesionales Modernos",
      description: "Accede a 40+ calculadoras y utilidades premium diseñadas para aumentar la productividad, simplificar tareas complejas y ahorrarte tiempo.",
      search_placeholder: "Buscar cualquier herramienta...",
      search_button: "Buscar",
      fast: "Rápido y Gratuito",
      secure: "Seguro y Privado",
      users: "10K+ Usuarios"
    },
    stats: {
      calculators: "Calculadoras",
      pdf_tools: "Herramientas PDF",
      image_tools: "Herramientas de Imagen",
      active_users: "Usuarios Activos"
    },
    categories: {
      title: "Categorías",
      heading: "Explora Nuestras",
      subheading: "Categorías de Herramientas",
      description: "Encuentra la herramienta perfecta para tus necesidades en 7 categorías especializadas",
      finance: "Finanzas",
      pdf_tools: "Herramientas PDF",
      image_tools: "Herramientas de Imagen",
      health: "Salud",
      productivity: "Productividad",
      developer: "Desarrollador",
      construction: "Construcción",
      back: "Volver a Categorías",
      tools: "herramientas",
      tool: "herramienta"
    },
    tools: {
      featured: "Destacados",
      title: "Más Populares",
      subheading: "Herramientas Destacadas",
      description: "Herramientas seleccionadas que nuestros usuarios aman y usan todos los días",
      view_all: "Ver Todas las Herramientas"
    },
    features: {
      title: "¿Por Qué Elegir",
      subheading: "Navorika?",
      description: "Combinamos funcionalidad poderosa con una experiencia de usuario excepcional",
      lightning: "Ultra Rápido",
      lightning_desc: "Cálculos instantáneos sin demoras de carga",
      secure: "100% Seguro",
      secure_desc: "Todos los cálculos son del lado del cliente y privados",
      available: "Siempre Disponible",
      available_desc: "Acceso 24/7 desde cualquier dispositivo, en cualquier lugar",
      free: "Gratuito",
      free_desc: "Sin suscripciones, sin tarifas ocultas",
      users: "10K+ Usuarios",
      users_desc: "Confiado por profesionales en todo el mundo",
      design: "Diseño Hermoso",
      design_desc: "Interfaz limpia y moderna con modo oscuro"
    },
    cta: {
      title: "¿Listo para Aumentar Tu",
      subtitle: "Productividad?",
      description: "Únete a miles de usuarios que confían en Navorika para sus cálculos y conversiones diarias.",
      explore: "Explorar Todas las Herramientas",
      browse: "Explorar Categorías"
    },
    footer: {
      product: "Producto",
      company: "Compañía",
      resources: "Recursos",
      about: "Acerca de",
      contact: "Contacto",
      privacy: "Privacidad",
      blog: "Blog",
      help: "Ayuda",
      sitemap: "Mapa del sitio",
      rights: "Todos los derechos reservados"
    },
    search: {
      title: "Resultados de Búsqueda",
      placeholder: "Buscar herramientas...",
      noResults: "No se encontraron herramientas",
      tryAdjusting: "Intenta ajustar tus términos de búsqueda",
      browseAll: "Explorar todas las herramientas",
      startSearching: "Comenzar a buscar",
      searchBy: "Busca cualquier herramienta por nombre, categoría o palabra clave",
      found: "Encontrado",
      results: "resultados",
      result: "resultado",
      for: "para",
      viewAll: "Ver todos los resultados"
    },
    common: {
      loading: "Cargando...",
      error: "Algo salió mal",
      tryAgain: "Intentar de nuevo",
      back: "Volver",
      viewAll: "Ver todo",
      showMore: "Mostrar más",
      showLess: "Mostrar menos"
    }
  },
  
  fr: {
    nav: {
      tools: "Outils",
      categories: "Catégories",
      guides: "Guides",
      about: "À propos",
      signIn: "Se connecter",
      getStarted: "Commencer",
      search: "Rechercher des outils..."
    },
    home: {
      title: "Votre Kit d'Outils Intelligent pour l'Ère Numérique",
      subtitle: "Calculatrices en ligne gratuites, outils PDF, utilitaires d'images et plus — conçus avec élégance, ultra-rapides et toujours gratuits.",
      searchPlaceholder: "Rechercher des outils... (ex. PDF, EMI, Inflation)",
      searchButton: "Rechercher",
      trusted: "Approuvé par 50 000+ utilisateurs",
      responseTime: "1s de réponse moyenne",
      activeUsers: "50K+ utilisateurs actifs",
      rating: "Note de 4.9/5"
    },
    hero: {
      badge: "Approuvé par 10 000+ utilisateurs",
      title: "Des Outils Intelligents pour",
      subtitle: "Les Professionnels Modernes",
      description: "Accédez à 40+ calculatrices et utilitaires premium conçus pour booster la productivité, simplifier les tâches complexes et vous faire gagner du temps.",
      search_placeholder: "Rechercher un outil...",
      search_button: "Rechercher",
      fast: "Rapide et Gratuit",
      secure: "Sécurisé et Privé",
      users: "10K+ Utilisateurs"
    },
    stats: {
      calculators: "Calculatrices",
      pdf_tools: "Outils PDF",
      image_tools: "Outils d'Image",
      active_users: "Utilisateurs Actifs"
    },
    categories: {
      title: "Catégories",
      heading: "Explorez Nos",
      subheading: "Catégories d'Outils",
      description: "Trouvez l'outil parfait pour vos besoins dans 7 catégories spécialisées",
      finance: "Finance",
      pdf_tools: "Outils PDF",
      image_tools: "Outils d'Image",
      health: "Santé",
      productivity: "Productivité",
      developer: "Développeur",
      construction: "Construction",
      back: "Retour aux Catégories",
      tools: "outils",
      tool: "outil"
    },
    tools: {
      featured: "À la Une",
      title: "Les Plus Populaires",
      subheading: "Outils Vedettes",
      description: "Des outils sélectionnés que nos utilisateurs adorent et utilisent chaque jour",
      view_all: "Voir Tous les Outils"
    },
    features: {
      title: "Pourquoi Choisir",
      subheading: "Navorika?",
      description: "Nous combinons une fonctionnalité puissante avec une expérience utilisateur exceptionnelle",
      lightning: "Ultra Rapide",
      lightning_desc: "Calculs instantanés sans délai de chargement",
      secure: "100% Sécurisé",
      secure_desc: "Tous les calculs sont côté client et privés",
      available: "Toujours Disponible",
      available_desc: "Accès 24/7 depuis n'importe quel appareil, n'importe où",
      free: "Gratuit",
      free_desc: "Sans abonnement, sans frais cachés",
      users: "10K+ Utilisateurs",
      users_desc: "Approuvé par des professionnels du monde entier",
      design: "Design Élégant",
      design_desc: "Interface épurée et moderne avec mode sombre"
    },
    cta: {
      title: "Prêt à Booster Votre",
      subtitle: "Productivité?",
      description: "Rejoignez des milliers d'utilisateurs qui font confiance à Navorika pour leurs calculs et conversions quotidiens.",
      explore: "Explorer Tous les Outils",
      browse: "Parcourir les Catégories"
    },
    footer: {
      product: "Produit",
      company: "Entreprise",
      resources: "Ressources",
      about: "À propos",
      contact: "Contact",
      privacy: "Confidentialité",
      blog: "Blog",
      help: "Aide",
      sitemap: "Plan du site",
      rights: "Tous droits réservés"
    },
    search: {
      title: "Résultats de Recherche",
      placeholder: "Rechercher des outils...",
      noResults: "Aucun outil trouvé",
      tryAdjusting: "Essayez d'ajuster vos termes de recherche",
      browseAll: "Parcourir tous les outils",
      startSearching: "Commencer à chercher",
      searchBy: "Recherchez n'importe quel outil par nom, catégorie ou mot-clé",
      found: "Trouvé",
      results: "résultats",
      result: "résultat",
      for: "pour",
      viewAll: "Voir tous les résultats"
    },
    common: {
      loading: "Chargement...",
      error: "Quelque chose s'est mal passé",
      tryAgain: "Réessayer",
      back: "Retour",
      viewAll: "Voir tout",
      showMore: "Afficher plus",
      showLess: "Afficher moins"
    }
  },

  de: {
    nav: {
      tools: "Werkzeuge",
      categories: "Kategorien",
      guides: "Anleitungen",
      about: "Über uns",
      signIn: "Anmelden",
      getStarted: "Loslegen",
      search: "Werkzeuge suchen..."
    },
    home: {
      title: "Ihr Intelligentes Toolkit für das Digitale Zeitalter",
      subtitle: "Kostenlose Online-Rechner, PDF-Tools, Bildbearbeitung und mehr — wunderschön gestaltet, blitzschnell und immer kostenlos.",
      searchPlaceholder: "Werkzeuge suchen... (z.B. PDF, EMI, Inflation)",
      searchButton: "Suchen",
      trusted: "Vertrauenswürdig bei 50.000+ Nutzern",
      responseTime: "1s durchschnittliche Antwortzeit",
      activeUsers: "50K+ aktive Nutzer",
      rating: "4.9/5 Nutzerbewertung"
    },
    hero: {
      badge: "Vertrauenswürdig bei 10.000+ Nutzern",
      title: "Intelligente Werkzeuge für",
      subtitle: "Moderne Fachkräfte",
      description: "Greifen Sie auf 40+ Premium-Rechner und Dienstprogramme zu, die die Produktivität steigern, komplexe Aufgaben vereinfachen und Ihnen Zeit sparen sollen.",
      search_placeholder: "Nach einem Werkzeug suchen...",
      search_button: "Suchen",
      fast: "Schnell & Kostenlos",
      secure: "Sicher & Privat",
      users: "10K+ Nutzer"
    },
    stats: {
      calculators: "Rechner",
      pdf_tools: "PDF-Tools",
      image_tools: "Bild-Tools",
      active_users: "Aktive Nutzer"
    },
    categories: {
      title: "Kategorien",
      heading: "Entdecken Sie Unsere",
      subheading: "Werkzeugkategorien",
      description: "Finden Sie das perfekte Werkzeug für Ihre Bedürfnisse in 7 spezialisierten Kategorien",
      finance: "Finanzen",
      pdf_tools: "PDF-Tools",
      image_tools: "Bild-Tools",
      health: "Gesundheit",
      productivity: "Produktivität",
      developer: "Entwickler",
      construction: "Bauwesen",
      back: "Zurück zu Kategorien",
      tools: "Werkzeuge",
      tool: "Werkzeug"
    },
    tools: {
      featured: "Empfohlen",
      title: "Am Beliebtesten",
      subheading: "Ausgewählte Werkzeuge",
      description: "Handverlesene Werkzeuge, die unsere Nutzer lieben und täglich verwenden",
      view_all: "Alle Werkzeuge anzeigen"
    },
    features: {
      title: "Warum",
      subheading: "Navorika Wählen?",
      description: "Wir kombinieren leistungsstarke Funktionalität mit einem außergewöhnlichen Benutzererlebnis",
      lightning: "Blitzschnell",
      lightning_desc: "Sofortige Berechnungen ohne Ladeverzögerungen",
      secure: "100% Sicher",
      secure_desc: "Alle Berechnungen erfolgen clientseitig und privat",
      available: "Immer Verfügbar",
      available_desc: "24/7 Zugriff von jedem Gerät, überall",
      free: "Kostenlos",
      free_desc: "Keine Abonnements, keine versteckten Gebühren",
      users: "10K+ Nutzer",
      users_desc: "Vertrauenswürdig bei Fachleuten weltweit",
      design: "Wunderschönes Design",
      design_desc: "Saubere, moderne Oberfläche mit Dunkelmodus"
    },
    cta: {
      title: "Bereit, Ihre",
      subtitle: "Produktivität zu Steigern?",
      description: "Schließen Sie sich Tausenden von Nutzern an, die für ihre täglichen Berechnungen und Umrechnungen auf Navorika vertrauen.",
      explore: "Alle Werkzeuge Entdecken",
      browse: "Kategorien Durchsuchen"
    },
    footer: {
      product: "Produkt",
      company: "Unternehmen",
      resources: "Ressourcen",
      about: "Über uns",
      contact: "Kontakt",
      privacy: "Datenschutz",
      blog: "Blog",
      help: "Hilfe",
      sitemap: "Sitemap",
      rights: "Alle Rechte vorbehalten"
    },
    search: {
      title: "Suchergebnisse",
      placeholder: "Werkzeuge suchen...",
      noResults: "Keine Werkzeuge gefunden",
      tryAdjusting: "Passen Sie Ihre Suchbegriffe an",
      browseAll: "Alle Werkzeuge durchsuchen",
      startSearching: "Suche starten",
      searchBy: "Suchen Sie nach Werkzeugen nach Name, Kategorie oder Schlüsselwort",
      found: "Gefunden",
      results: "Ergebnisse",
      result: "Ergebnis",
      for: "für",
      viewAll: "Alle Ergebnisse anzeigen"
    },
    common: {
      loading: "Laden...",
      error: "Etwas ist schief gelaufen",
      tryAgain: "Erneut versuchen",
      back: "Zurück",
      viewAll: "Alle anzeigen",
      showMore: "Mehr anzeigen",
      showLess: "Weniger anzeigen"
    }
  },

  pt: {
    nav: {
      tools: "Ferramentas",
      categories: "Categorias",
      guides: "Guias",
      about: "Sobre",
      signIn: "Entrar",
      getStarted: "Começar",
      search: "Pesquisar ferramentas..."
    },
    home: {
      title: "Seu Kit de Ferramentas Inteligente para a Era Digital",
      subtitle: "Calculadoras online gratuitas, ferramentas PDF, utilitários de imagem e mais — lindamente projetados, rápidos e sempre gratuitos.",
      searchPlaceholder: "Pesquisar ferramentas... (ex. PDF, EMI, Inflação)",
      searchButton: "Pesquisar",
      trusted: "Confiado por 50.000+ usuários",
      responseTime: "1s de resposta média",
      activeUsers: "50K+ usuários ativos",
      rating: "Avaliação 4.9/5"
    },
    hero: {
      badge: "Confiado por 10.000+ usuários",
      title: "Ferramentas Inteligentes para",
      subtitle: "Profissionais Modernos",
      description: "Acesse 40+ calculadoras e utilitários premium projetados para aumentar a produtividade, simplificar tarefas complexas e economizar seu tempo.",
      search_placeholder: "Pesquisar qualquer ferramenta...",
      search_button: "Pesquisar",
      fast: "Rápido e Gratuito",
      secure: "Seguro e Privado",
      users: "10K+ Usuários"
    },
    stats: {
      calculators: "Calculadoras",
      pdf_tools: "Ferramentas PDF",
      image_tools: "Ferramentas de Imagem",
      active_users: "Usuários Ativos"
    },
    categories: {
      title: "Categorias",
      heading: "Explore Nossas",
      subheading: "Categorias de Ferramentas",
      description: "Encontre a ferramenta perfeita para suas necessidades em 7 categorias especializadas",
      finance: "Finanças",
      pdf_tools: "Ferramentas PDF",
      image_tools: "Ferramentas de Imagem",
      health: "Saúde",
      productivity: "Produtividade",
      developer: "Desenvolvedor",
      construction: "Construção",
      back: "Voltar às Categorias",
      tools: "ferramentas",
      tool: "ferramenta"
    },
    tools: {
      featured: "Destaque",
      title: "Mais Populares",
      subheading: "Ferramentas em Destaque",
      description: "Ferramentas selecionadas que nossos usuários amam e usam todos os dias",
      view_all: "Ver Todas as Ferramentas"
    },
    features: {
      title: "Por Que Escolher",
      subheading: "Navorika?",
      description: "Combinamos funcionalidade poderosa com uma experiência de usuário excepcional",
      lightning: "Rápido como um Raio",
      lightning_desc: "Cálculos instantâneos sem atrasos de carregamento",
      secure: "100% Seguro",
      secure_desc: "Todos os cálculos são no lado do cliente e privados",
      available: "Sempre Disponível",
      available_desc: "Acesso 24/7 de qualquer dispositivo, em qualquer lugar",
      free: "Gratuito",
      free_desc: "Sem assinaturas, sem taxas ocultas",
      users: "10K+ Usuários",
      users_desc: "Confiado por profissionais em todo o mundo",
      design: "Design Bonito",
      design_desc: "Interface limpa e moderna com modo escuro"
    },
    cta: {
      title: "Pronto para Aumentar Sua",
      subtitle: "Produtividade?",
      description: "Junte-se a milhares de usuários que confiam na Navorika para seus cálculos e conversões diárias.",
      explore: "Explorar Todas as Ferramentas",
      browse: "Navegar por Categorias"
    },
    footer: {
      product: "Produto",
      company: "Empresa",
      resources: "Recursos",
      about: "Sobre",
      contact: "Contato",
      privacy: "Privacidade",
      blog: "Blog",
      help: "Ajuda",
      sitemap: "Mapa do site",
      rights: "Todos os direitos reservados"
    },
    search: {
      title: "Resultados da Pesquisa",
      placeholder: "Pesquisar ferramentas...",
      noResults: "Nenhuma ferramenta encontrada",
      tryAdjusting: "Tente ajustar seus termos de pesquisa",
      browseAll: "Explorar todas as ferramentas",
      startSearching: "Começar a pesquisar",
      searchBy: "Pesquise qualquer ferramenta por nome, categoria ou palavra-chave",
      found: "Encontrado",
      results: "resultados",
      result: "resultado",
      for: "para",
      viewAll: "Ver todos os resultados"
    },
    common: {
      loading: "Carregando...",
      error: "Algo deu errado",
      tryAgain: "Tentar novamente",
      back: "Voltar",
      viewAll: "Ver tudo",
      showMore: "Mostrar mais",
      showLess: "Mostrar menos"
    }
  },

  it: {
    nav: {
      tools: "Strumenti",
      categories: "Categorie",
      guides: "Guide",
      about: "Chi siamo",
      signIn: "Accedi",
      getStarted: "Inizia",
      search: "Cerca strumenti..."
    },
    home: {
      title: "Il Tuo Kit di Strumenti Intelligenti per l'Età Digitale",
      subtitle: "Calcolatrici online gratuite, strumenti PDF, utilità per immagini e altro — splendidamente progettati, velocissimi e sempre gratuiti.",
      searchPlaceholder: "Cerca strumenti... (es. PDF, EMI, Inflazione)",
      searchButton: "Cerca",
      trusted: "Affidabile da 50.000+ utenti",
      responseTime: "1s di risposta media",
      activeUsers: "50K+ utenti attivi",
      rating: "Valutazione 4.9/5"
    },
    hero: {
      badge: "Affidabile da 10.000+ utenti",
      title: "Strumenti Intelligenti per",
      subtitle: "Professionisti Moderni",
      description: "Accedi a 40+ calcolatrici e utility premium progettate per aumentare la produttività, semplificare compiti complessi e farti risparmiare tempo.",
      search_placeholder: "Cerca qualsiasi strumento...",
      search_button: "Cerca",
      fast: "Veloce e Gratuito",
      secure: "Sicuro e Privato",
      users: "10K+ Utenti"
    },
    stats: {
      calculators: "Calcolatrici",
      pdf_tools: "Strumenti PDF",
      image_tools: "Strumenti Immagine",
      active_users: "Utenti Attivi"
    },
    categories: {
      title: "Categorie",
      heading: "Esplora le Nostre",
      subheading: "Categorie di Strumenti",
      description: "Trova lo strumento perfetto per le tue esigenze in 7 categorie specializzate",
      finance: "Finanza",
      pdf_tools: "Strumenti PDF",
      image_tools: "Strumenti Immagine",
      health: "Salute",
      productivity: "Produttività",
      developer: "Sviluppatore",
      construction: "Costruzione",
      back: "Torna alle Categorie",
      tools: "strumenti",
      tool: "strumento"
    },
    tools: {
      featured: "In Evidenza",
      title: "Più Popolari",
      subheading: "Strumenti in Vetrina",
      description: "Strumenti selezionati che i nostri utenti amano e usano ogni giorno",
      view_all: "Vedi Tutti gli Strumenti"
    },
    features: {
      title: "Perché Scegliere",
      subheading: "Navorika?",
      description: "Uniamo funzionalità potenti con un'esperienza utente eccezionale",
      lightning: "Veloce come un Lampo",
      lightning_desc: "Calcoli istantanei senza ritardi di caricamento",
      secure: "100% Sicuro",
      secure_desc: "Tutti i calcoli sono lato client e privati",
      available: "Sempre Disponibile",
      available_desc: "Accesso 24/7 da qualsiasi dispositivo, ovunque",
      free: "Gratuito",
      free_desc: "Nessun abbonamento, nessuna tassa nascosta",
      users: "10K+ Utenti",
      users_desc: "Affidabile da professionisti in tutto il mondo",
      design: "Design Elegante",
      design_desc: "Interfaccia pulita e moderna con modalità scura"
    },
    cta: {
      title: "Pronto a Aumentare la Tua",
      subtitle: "Produttività?",
      description: "Unisciti a migliaia di utenti che si affidano a Navorika per i loro calcoli e conversioni quotidiane.",
      explore: "Esplora Tutti gli Strumenti",
      browse: "Sfoglia le Categorie"
    },
    footer: {
      product: "Prodotto",
      company: "Azienda",
      resources: "Risorse",
      about: "Chi siamo",
      contact: "Contatto",
      privacy: "Privacy",
      blog: "Blog",
      help: "Aiuto",
      sitemap: "Mappa del sito",
      rights: "Tutti i diritti riservati"
    },
    search: {
      title: "Risultati della Ricerca",
      placeholder: "Cerca strumenti...",
      noResults: "Nessuno strumento trovato",
      tryAdjusting: "Prova a modificare i termini di ricerca",
      browseAll: "Esplora tutti gli strumenti",
      startSearching: "Inizia a cercare",
      searchBy: "Cerca qualsiasi strumento per nome, categoria o parola chiave",
      found: "Trovato",
      results: "risultati",
      result: "risultato",
      for: "per",
      viewAll: "Vedi tutti i risultati"
    },
    common: {
      loading: "Caricamento...",
      error: "Qualcosa è andato storto",
      tryAgain: "Riprova",
      back: "Indietro",
      viewAll: "Vedi tutto",
      showMore: "Mostra di più",
      showLess: "Mostra meno"
    }
  },

  ru: {
    nav: {
      tools: "Инструменты",
      categories: "Категории",
      guides: "Руководства",
      about: "О нас",
      signIn: "Войти",
      getStarted: "Начать",
      search: "Поиск инструментов..."
    },
    home: {
      title: "Ваш Умный Инструментарий для Цифровой Эры",
      subtitle: "Бесплатные онлайн-калькуляторы, PDF-инструменты, утилиты для изображений и многое другое — красиво оформленные, мгновенные и всегда бесплатные.",
      searchPlaceholder: "Поиск инструментов... (например, PDF, EMI, Инфляция)",
      searchButton: "Поиск",
      trusted: "Доверие 50 000+ пользователей",
      responseTime: "1с среднее время ответа",
      activeUsers: "50K+ активных пользователей",
      rating: "Рейтинг 4.9/5"
    },
    hero: {
      badge: "Доверие 10 000+ пользователей",
      title: "Умные Инструменты для",
      subtitle: "Современных Профессионалов",
      description: "Доступ к 40+ премиальным калькуляторам и утилитам, созданным для повышения производительности, упрощения сложных задач и экономии вашего времени.",
      search_placeholder: "Поиск любого инструмента...",
      search_button: "Поиск",
      fast: "Быстро и Бесплатно",
      secure: "Безопасно и Конфиденциально",
      users: "10K+ Пользователей"
    },
    stats: {
      calculators: "Калькуляторы",
      pdf_tools: "PDF-инструменты",
      image_tools: "Инструменты для изображений",
      active_users: "Активные пользователи"
    },
    categories: {
      title: "Категории",
      heading: "Изучите Наши",
      subheading: "Категории Инструментов",
      description: "Найдите идеальный инструмент для ваших нужд в 7 специализированных категориях",
      finance: "Финансы",
      pdf_tools: "PDF-инструменты",
      image_tools: "Инструменты для изображений",
      health: "Здоровье",
      productivity: "Продуктивность",
      developer: "Разработчик",
      construction: "Строительство",
      back: "Назад к Категориям",
      tools: "инструментов",
      tool: "инструмент"
    },
    tools: {
      featured: "Рекомендуемые",
      title: "Самые Популярные",
      subheading: "Рекомендуемые Инструменты",
      description: "Отобранные инструменты, которые наши пользователи любят и используют каждый день",
      view_all: "Просмотреть Все Инструменты"
    },
    features: {
      title: "Почему Выбирают",
      subheading: "Navorika?",
      description: "Мы сочетаем мощную функциональность с исключительным пользовательским опытом",
      lightning: "Мгновенный",
      lightning_desc: "Мгновенные расчеты без задержек загрузки",
      secure: "100% Безопасно",
      secure_desc: "Все вычисления выполняются на стороне клиента и являются частными",
      available: "Всегда Доступен",
      available_desc: "Доступ 24/7 с любого устройства, где угодно",
      free: "Бесплатно",
      free_desc: "Без подписок, без скрытых платежей",
      users: "10K+ Пользователей",
      users_desc: "Доверие профессионалов по всему миру",
      design: "Красивый Дизайн",
      design_desc: "Чистый, современный интерфейс с темным режимом"
    },
    cta: {
      title: "Готовы Повысить Свою",
      subtitle: "Продуктивность?",
      description: "Присоединяйтесь к тысячам пользователей, которые доверяют Navorika для своих ежедневных расчетов и конвертаций.",
      explore: "Изучить Все Инструменты",
      browse: "Просмотреть Категории"
    },
    footer: {
      product: "Продукт",
      company: "Компания",
      resources: "Ресурсы",
      about: "О нас",
      contact: "Контакты",
      privacy: "Конфиденциальность",
      blog: "Блог",
      help: "Помощь",
      sitemap: "Карта сайта",
      rights: "Все права защищены"
    },
    search: {
      title: "Результаты Поиска",
      placeholder: "Поиск инструментов...",
      noResults: "Инструменты не найдены",
      tryAdjusting: "Попробуйте изменить условия поиска",
      browseAll: "Просмотреть все инструменты",
      startSearching: "Начать поиск",
      searchBy: "Ищите любой инструмент по названию, категории или ключевому слову",
      found: "Найдено",
      results: "результатов",
      result: "результат",
      for: "для",
      viewAll: "Посмотреть все результаты"
    },
    common: {
      loading: "Загрузка...",
      error: "Что-то пошло не так",
      tryAgain: "Попробовать снова",
      back: "Назад",
      viewAll: "Показать все",
      showMore: "Показать больше",
      showLess: "Показать меньше"
    }
  },

  ja: {
    nav: {
      tools: "ツール",
      categories: "カテゴリ",
      guides: "ガイド",
      about: "について",
      signIn: "サインイン",
      getStarted: "始める",
      search: "ツールを検索..."
    },
    home: {
      title: "デジタル時代のためのスマートツールキット",
      subtitle: "無料のオンライン計算機、PDFツール、画像ユーティリティなど — 美しくデザインされ、超高速で常に無料。",
      searchPlaceholder: "ツールを検索... (例: PDF, EMI, インフレーション)",
      searchButton: "検索",
      trusted: "50,000+ ユーザーが信頼",
      responseTime: "平均応答時間 1秒",
      activeUsers: "50K+ アクティブユーザー",
      rating: "4.9/5 ユーザー評価"
    },
    hero: {
      badge: "10,000+ ユーザーが信頼",
      title: "モダンプロフェッショナルのための",
      subtitle: "スマートツール",
      description: "生産性を向上させ、複雑なタスクを簡素化し、時間を節約するために設計された40以上のプレミアム計算機とユーティリティにアクセスできます。",
      search_placeholder: "ツールを検索...",
      search_button: "検索",
      fast: "高速＆無料",
      secure: "安全＆プライベート",
      users: "10K+ ユーザー"
    },
    stats: {
      calculators: "計算機",
      pdf_tools: "PDFツール",
      image_tools: "画像ツール",
      active_users: "アクティブユーザー"
    },
    categories: {
      title: "カテゴリ",
      heading: "カテゴリから",
      subheading: "ツールを探す",
      description: "7つの専門カテゴリからニーズに合った完璧なツールを見つけてください",
      finance: "ファイナンス",
      pdf_tools: "PDFツール",
      image_tools: "画像ツール",
      health: "ヘルスケア",
      productivity: "生産性",
      developer: "開発者",
      construction: "建設",
      back: "カテゴリに戻る",
      tools: "ツール",
      tool: "ツール"
    },
    tools: {
      featured: "注目",
      title: "最も人気",
      subheading: "注目のツール",
      description: "ユーザーが愛用する厳選されたツール",
      view_all: "すべてのツールを見る"
    },
    features: {
      title: "Navorikaを選ぶ理由",
      subheading: "",
      description: "パワフルな機能と卓越したユーザー体験の融合",
      lightning: "超高速",
      lightning_desc: "読み込み待ち時間なしの即時計算",
      secure: "100% 安全",
      secure_desc: "すべての計算はクライアントサイドでプライベート",
      available: "24時間利用可能",
      available_desc: "どこでもどんなデバイスからでもアクセス可能",
      free: "無料",
      free_desc: "サブスクリプションなし、隠れた料金なし",
      users: "10K+ ユーザー",
      users_desc: "世界中のプロフェッショナルに信頼されています",
      design: "美しいデザイン",
      design_desc: "ダークモード対応のクリーンでモダンなインターフェース"
    },
    cta: {
      title: "生産性を向上させる",
      subtitle: "準備はできていますか？",
      description: "毎日の計算と変換にNavorikaを信頼する何千ものユーザーに参加してください。",
      explore: "すべてのツールを見る",
      browse: "カテゴリを閲覧"
    },
    footer: {
      product: "製品",
      company: "会社",
      resources: "リソース",
      about: "について",
      contact: "お問い合わせ",
      privacy: "プライバシー",
      blog: "ブログ",
      help: "ヘルプ",
      sitemap: "サイトマップ",
      rights: "すべての権利を保有"
    },
    search: {
      title: "検索結果",
      placeholder: "ツールを検索...",
      noResults: "ツールが見つかりません",
      tryAdjusting: "検索語を調整してみてください",
      browseAll: "すべてのツールを閲覧",
      startSearching: "検索を開始",
      searchBy: "名前、カテゴリ、キーワードでツールを検索",
      found: "見つかりました",
      results: "件",
      result: "件",
      for: "の",
      viewAll: "すべての結果を表示"
    },
    common: {
      loading: "読み込み中...",
      error: "エラーが発生しました",
      tryAgain: "再試行",
      back: "戻る",
      viewAll: "すべて表示",
      showMore: "もっと表示",
      showLess: "表示を減らす"
    }
  },

  ko: {
    nav: {
      tools: "도구",
      categories: "카테고리",
      guides: "가이드",
      about: "소개",
      signIn: "로그인",
      getStarted: "시작하기",
      search: "도구 검색..."
    },
    home: {
      title: "디지털 시대를 위한 스마트 도구 모음",
      subtitle: "무료 온라인 계산기, PDF 도구, 이미지 유틸리티 등 — 아름답게 디자인되고, 빠르며, 항상 무료입니다.",
      searchPlaceholder: "도구 검색... (예: PDF, EMI, 인플레이션)",
      searchButton: "검색",
      trusted: "50,000+ 사용자가 신뢰",
      responseTime: "평균 응답 시간 1초",
      activeUsers: "50K+ 활성 사용자",
      rating: "4.9/5 사용자 평점"
    },
    hero: {
      badge: "10,000+ 사용자가 신뢰",
      title: "현대 전문가를 위한",
      subtitle: "스마트 도구",
      description: "생산성을 높이고, 복잡한 작업을 간소화하며, 시간을 절약하기 위해 설계된 40개 이상의 프리미엄 계산기와 유틸리티에 액세스하세요.",
      search_placeholder: "도구 검색...",
      search_button: "검색",
      fast: "빠르고 무료",
      secure: "안전하고 비공개",
      users: "10K+ 사용자"
    },
    stats: {
      calculators: "계산기",
      pdf_tools: "PDF 도구",
      image_tools: "이미지 도구",
      active_users: "활성 사용자"
    },
    categories: {
      title: "카테고리",
      heading: "카테고리별",
      subheading: "도구 탐색",
      description: "7개의 전문 카테고리에서 필요에 맞는 완벽한 도구를 찾아보세요",
      finance: "금융",
      pdf_tools: "PDF 도구",
      image_tools: "이미지 도구",
      health: "건강",
      productivity: "생산성",
      developer: "개발자",
      construction: "건설",
      back: "카테고리로 돌아가기",
      tools: "도구",
      tool: "도구"
    },
    tools: {
      featured: "추천",
      title: "가장 인기 있는",
      subheading: "추천 도구",
      description: "사용자들이 사랑하고 매일 사용하는 엄선된 도구",
      view_all: "모든 도구 보기"
    },
    features: {
      title: "Navorika를 선택하는 이유",
      subheading: "",
      description: "강력한 기능과 탁월한 사용자 경험의 결합",
      lightning: "빠른 속도",
      lightning_desc: "로딩 지연 없는 즉시 계산",
      secure: "100% 안전",
      secure_desc: "모든 계산은 클라이언트 측에서 비공개로 처리",
      available: "항상 이용 가능",
      available_desc: "언제 어디서나 어떤 기기에서든 24/7 접근",
      free: "무료 사용",
      free_desc: "구독료 없음, 숨은 수수료 없음",
      users: "10K+ 사용자",
      users_desc: "전 세계 전문가들이 신뢰",
      design: "아름다운 디자인",
      design_desc: "다크 모드를 갖춘 깔끔하고 현대적인 인터페이스"
    },
    cta: {
      title: "생산성을 높일",
      subtitle: "준비가 되셨나요?",
      description: "일일 계산과 변환을 위해 Navorika를 신뢰하는 수천 명의 사용자들과 함께하세요.",
      explore: "모든 도구 탐색",
      browse: "카테고리 둘러보기"
    },
    footer: {
      product: "제품",
      company: "회사",
      resources: "리소스",
      about: "소개",
      contact: "연락처",
      privacy: "개인정보",
      blog: "블로그",
      help: "도움말",
      sitemap: "사이트맵",
      rights: "모든 권리 보유"
    },
    search: {
      title: "검색 결과",
      placeholder: "도구 검색...",
      noResults: "도구를 찾을 수 없습니다",
      tryAdjusting: "검색어를 조정해 보세요",
      browseAll: "모든 도구 보기",
      startSearching: "검색 시작",
      searchBy: "이름, 카테고리 또는 키워드로 도구 검색",
      found: "찾음",
      results: "개 결과",
      result: "개 결과",
      for: "의",
      viewAll: "모든 결과 보기"
    },
    common: {
      loading: "로딩 중...",
      error: "문제가 발생했습니다",
      tryAgain: "다시 시도",
      back: "뒤로",
      viewAll: "모두 보기",
      showMore: "더 보기",
      showLess: "간단히 보기"
    }
  },

  zh: {
    nav: {
      tools: "工具",
      categories: "分类",
      guides: "指南",
      about: "关于",
      signIn: "登录",
      getStarted: "开始",
      search: "搜索工具..."
    },
    home: {
      title: "您的数字时代智能工具包",
      subtitle: "免费在线计算器、PDF工具、图像工具等 — 设计精美、速度快且始终免费。",
      searchPlaceholder: "搜索工具... (例如: PDF, EMI, 通货膨胀)",
      searchButton: "搜索",
      trusted: "50,000+ 用户信赖",
      responseTime: "平均响应时间 1秒",
      activeUsers: "50K+ 活跃用户",
      rating: "4.9/5 用户评分"
    },
    hero: {
      badge: "10,000+ 用户信赖",
      title: "为现代专业人士打造的",
      subtitle: "智能工具",
      description: "访问40多个高级计算器和实用工具，旨在提高生产力、简化复杂任务并为您节省时间。",
      search_placeholder: "搜索任何工具...",
      search_button: "搜索",
      fast: "快速免费",
      secure: "安全私密",
      users: "10K+ 用户"
    },
    stats: {
      calculators: "计算器",
      pdf_tools: "PDF工具",
      image_tools: "图像工具",
      active_users: "活跃用户"
    },
    categories: {
      title: "分类",
      heading: "探索我们的",
      subheading: "工具分类",
      description: "在7个专业分类中找到适合您需求的完美工具",
      finance: "金融",
      pdf_tools: "PDF工具",
      image_tools: "图像工具",
      health: "健康",
      productivity: "生产力",
      developer: "开发者",
      construction: "建筑",
      back: "返回分类",
      tools: "工具",
      tool: "工具"
    },
    tools: {
      featured: "精选",
      title: "最受欢迎",
      subheading: "精选工具",
      description: "用户喜爱并每天使用的精选工具",
      view_all: "查看所有工具"
    },
    features: {
      title: "为什么选择",
      subheading: "Navorika?",
      description: "我们结合强大的功能与卓越的用户体验",
      lightning: "闪电般快速",
      lightning_desc: "即时计算，无加载延迟",
      secure: "100% 安全",
      secure_desc: "所有计算均在客户端进行，保护隐私",
      available: "随时可用",
      available_desc: "随时随地通过任何设备24/7访问",
      free: "免费使用",
      free_desc: "无订阅，无隐藏费用",
      users: "10K+ 用户",
      users_desc: "受到全球专业人士的信赖",
      design: "精美设计",
      design_desc: "简约现代界面，支持深色模式"
    },
    cta: {
      title: "准备好提升您的",
      subtitle: "生产力了吗？",
      description: "加入成千上万信赖Navorika进行日常计算和转换的用户。",
      explore: "探索所有工具",
      browse: "浏览分类"
    },
    footer: {
      product: "产品",
      company: "公司",
      resources: "资源",
      about: "关于",
      contact: "联系我们",
      privacy: "隐私政策",
      blog: "博客",
      help: "帮助",
      sitemap: "网站地图",
      rights: "版权所有"
    },
    search: {
      title: "搜索结果",
      placeholder: "搜索工具...",
      noResults: "未找到工具",
      tryAdjusting: "尝试调整搜索词",
      browseAll: "浏览所有工具",
      startSearching: "开始搜索",
      searchBy: "按名称、分类或关键字搜索任何工具",
      found: "找到",
      results: "个结果",
      result: "个结果",
      for: "的",
      viewAll: "查看所有结果"
    },
    common: {
      loading: "加载中...",
      error: "出了点问题",
      tryAgain: "重试",
      back: "返回",
      viewAll: "查看全部",
      showMore: "显示更多",
      showLess: "显示更少"
    }
  },

  ar: {
    nav: {
      tools: "الأدوات",
      categories: "الفئات",
      guides: "الأدلة",
      about: "حول",
      signIn: "تسجيل الدخول",
      getStarted: "ابدأ الآن",
      search: "ابحث عن أدوات..."
    },
    home: {
      title: "مجموعة الأدوات الذكية الخاصة بك للعصر الرقمي",
      subtitle: "آلات حاسبة مجانية عبر الإنترنت، أدوات PDF، أدوات الصور والمزيد — مصممة بشكل جميل، سريعة جدًا ومجانية دائمًا.",
      searchPlaceholder: "ابحث عن أدوات... (مثل: PDF، EMI، التضخم)",
      searchButton: "بحث",
      trusted: "موثوق من قبل 50,000+ مستخدم",
      responseTime: "متوسط وقت الاستجابة 1 ثانية",
      activeUsers: "50K+ مستخدم نشط",
      rating: "تقييم 4.9/5"
    },
    hero: {
      badge: "موثوق من قبل 10,000+ مستخدم",
      title: "أدوات ذكية",
      subtitle: "للمحترفين العصريين",
      description: "الوصول إلى 40+ آلة حاسبة وأدوات مميزة مصممة لتعزيز الإنتاجية، وتبسيط المهام المعقدة، وتوفير وقتك.",
      search_placeholder: "ابحث عن أي أداة...",
      search_button: "بحث",
      fast: "سريع ومجاني",
      secure: "آمن وخاص",
      users: "10K+ مستخدم"
    },
    stats: {
      calculators: "آلات حاسبة",
      pdf_tools: "أدوات PDF",
      image_tools: "أدوات الصور",
      active_users: "مستخدمين نشطين"
    },
    categories: {
      title: "الفئات",
      heading: "استكشف",
      subheading: "فئات الأدوات",
      description: "ابحث عن الأداة المثالية لاحتياجاتك في 7 فئات متخصصة",
      finance: "المالية",
      pdf_tools: "أدوات PDF",
      image_tools: "أدوات الصور",
      health: "الصحة",
      productivity: "الإنتاجية",
      developer: "المطورين",
      construction: "البناء",
      back: "العودة إلى الفئات",
      tools: "أدوات",
      tool: "أداة"
    },
    tools: {
      featured: "مميز",
      title: "الأكثر شهرة",
      subheading: "أدوات مميزة",
      description: "أدوات مختارة يحبها المستخدمون ويستخدمونها يوميًا",
      view_all: "عرض جميع الأدوات"
    },
    features: {
      title: "لماذا تختار",
      subheading: "Navorika؟",
      description: "نحن نجمع بين الوظائف القوية وتجربة مستخدم استثنائية",
      lightning: "سريع جدًا",
      lightning_desc: "حسابات فورية بدون تأخير في التحميل",
      secure: "آمن 100%",
      secure_desc: "جميع الحسابات تتم على جانب العميل وخاصة",
      available: "متاح دائمًا",
      available_desc: "الوصول 24/7 من أي جهاز، في أي مكان",
      free: "مجاني",
      free_desc: "بدون اشتراكات، بدون رسوم خفية",
      users: "10K+ مستخدم",
      users_desc: "موثوق من قبل المحترفين في جميع أنحاء العالم",
      design: "تصميم جميل",
      design_desc: "واجهة نظيفة وحديثة مع الوضع المظلم"
    },
    cta: {
      title: "هل أنت مستعد لتعزيز",
      subtitle: "إنتاجيتك؟",
      description: "انضم إلى آلاف المستخدمين الذين يثقون في Navorika لحساباتهم وتحويلاتهم اليومية.",
      explore: "استكشف جميع الأدوات",
      browse: "تصفح الفئات"
    },
    footer: {
      product: "المنتج",
      company: "الشركة",
      resources: "الموارد",
      about: "حول",
      contact: "اتصل بنا",
      privacy: "الخصوصية",
      blog: "المدونة",
      help: "المساعدة",
      sitemap: "خريطة الموقع",
      rights: "جميع الحقوق محفوظة"
    },
    search: {
      title: "نتائج البحث",
      placeholder: "ابحث عن أدوات...",
      noResults: "لم يتم العثور على أدوات",
      tryAdjusting: "حاول تعديل مصطلحات البحث",
      browseAll: "تصفح جميع الأدوات",
      startSearching: "ابدأ البحث",
      searchBy: "ابحث عن أي أداة بالاسم أو الفئة أو الكلمة المفتاحية",
      found: "تم العثور على",
      results: "نتائج",
      result: "نتيجة",
      for: "لـ",
      viewAll: "عرض جميع النتائج"
    },
    common: {
      loading: "جاري التحميل...",
      error: "حدث خطأ ما",
      tryAgain: "حاول مرة أخرى",
      back: "رجوع",
      viewAll: "عرض الكل",
      showMore: "عرض المزيد",
      showLess: "عرض أقل"
    }
  }
  
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