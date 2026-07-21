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
  categories: {
    title: "Browse Tools by Category",
    subtitle: "Find the perfect tool for your needs.",
    back: "Back to Categories",
    tools: "tools",
    tool: "tool"
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
    categories: {
      title: "श्रेणी के अनुसार उपकरण ब्राउज़ करें",
      subtitle: "अपनी आवश्यकताओं के लिए सही उपकरण खोजें।",
      back: "श्रेणियों पर वापस जाएं",
      tools: "उपकरण",
      tool: "उपकरण"
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
    categories: {
      title: "Explorar Herramientas por Categoría",
      subtitle: "Encuentra la herramienta perfecta para tus necesidades.",
      back: "Volver a Categorías",
      tools: "herramientas",
      tool: "herramienta"
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
    categories: {
      title: "Explorer les Outils par Catégorie",
      subtitle: "Trouvez l'outil parfait pour vos besoins.",
      back: "Retour aux Catégories",
      tools: "outils",
      tool: "outil"
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
    categories: {
      title: "Werkzeuge nach Kategorie Durchsuchen",
      subtitle: "Finden Sie das perfekte Werkzeug für Ihre Bedürfnisse.",
      back: "Zurück zu Kategorien",
      tools: "Werkzeuge",
      tool: "Werkzeug"
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
    categories: {
      title: "Explorar Ferramentas por Categoria",
      subtitle: "Encontre a ferramenta perfeita para suas necessidades.",
      back: "Voltar às Categorias",
      tools: "ferramentas",
      tool: "ferramenta"
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
    categories: {
      title: "Esplora Strumenti per Categoria",
      subtitle: "Trova lo strumento perfetto per le tue esigenze.",
      back: "Torna alle Categorie",
      tools: "strumenti",
      tool: "strumento"
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
    categories: {
      title: "Обзор Инструментов по Категориям",
      subtitle: "Найдите идеальный инструмент для ваших нужд.",
      back: "Назад к Категориям",
      tools: "инструментов",
      tool: "инструмент"
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
    categories: {
      title: "カテゴリ別ツール閲覧",
      subtitle: "ニーズに合った完璧なツールを見つけてください。",
      back: "カテゴリに戻る",
      tools: "ツール",
      tool: "ツール"
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
    categories: {
      title: "카테고리별 도구 찾아보기",
      subtitle: "필요에 맞는 완벽한 도구를 찾아보세요.",
      back: "카테고리로 돌아가기",
      tools: "도구",
      tool: "도구"
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
    categories: {
      title: "按分类浏览工具",
      subtitle: "找到适合您需求的完美工具。",
      back: "返回分类",
      tools: "工具",
      tool: "工具"
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
    categories: {
      title: "تصفح الأدوات حسب الفئة",
      subtitle: "ابحث عن الأداة المثالية لاحتياجاتك.",
      back: "العودة إلى الفئات",
      tools: "أدوات",
      tool: "أداة"
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
