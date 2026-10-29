import type { Locale } from './config';

export interface TrustPageSection {
  title: string;
  badge?: string;
  badgeColor?: string;
  content: string;
  points?: string[];
  icon?: string;
}

export interface TrustPageContent {
  title: string;
  description: string;
  eyebrow?: string;
  heroTitle: string;
  heroDescription: string;
  lastUpdatedLabel?: string;
  lastUpdated?: string;
  banner?: {
    text: string;
    variant?: 'emerald' | 'amber' | 'indigo';
  };
  sections?: TrustPageSection[];
  footerNote?: {
    text: string;
    linkText?: string;
    linkHref?: string;
    secondLinkText?: string;
    secondLinkHref?: string;
  };
  contactCards?: {
    general: {
      title: string;
      description: string;
      email: string;
      buttonText: string;
    };
    privacy: {
      title: string;
      description: string;
      email: string;
      buttonText: string;
    };
  };
  bugReport?: {
    title: string;
    intro: string;
    items: Array<{ label: string; text: string }>;
  };
  operationalNote?: {
    text: string;
    linkText: string;
    linkHref: string;
  };
  buttons?: {
    primaryText: string;
    primaryHref: string;
    secondaryText: string;
    secondaryHref: string;
  };
  corePrinciplesTitle?: string;
  corePrinciples?: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  toolCategoriesTitle?: string;
  toolCategories?: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  howWeBuildTitle?: string;
  howWeBuildParagraphs?: string[];
  howWeBuildLink?: {
    text: string;
    href: string;
  };
  limitationsTitle?: string;
  limitationsParagraphs?: string[];
  limitationsLink?: {
    text: string;
    href: string;
  };
  quickLinksTitle?: string;
  quickLinks?: Array<{
    text: string;
    href: string;
  }>;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface GlossaryPageContent {
  title: string;
  description: string;
  eyebrow?: string;
  heroTitle: string;
  heroDescription: string;
  terms: GlossaryTerm[];
}

export const aboutContent: Record<Locale | 'en', TrustPageContent> = {
  "en": {
    "title": "About Navorika – Free Online Tools & Calculators",
    "description": "Learn about Navorika’s privacy-first calculators, PDF editors, image converters, and developer utilities. Most tools process locally, with no signup required.",
    "eyebrow": "About Navorika",
    "heroTitle": "Free Online Calculators & Tools",
    "heroDescription": "Navorika is an independent website with over 319 free calculators and online tools for files, images, money, health, construction, everyday tasks, and web development. Most tools run directly in your browser.",
    "buttons": {
      "primaryText": "Browse Free Tools",
      "primaryHref": "/tools",
      "secondaryText": "How Our Calculators Work",
      "secondaryHref": "/methodology"
    },
    "corePrinciplesTitle": "What You Can Expect",
    "corePrinciples": [
      {
        "icon": "lock",
        "title": "Your Files Usually Stay on Your Device",
        "description": "Most Navorika tools run directly in your browser, so the files and values you enter usually stay on your device instead of being uploaded to Navorika."
      },
      {
        "icon": "shield",
        "title": "Clear About How Each Tool Works",
        "description": "If a tool needs live data or server processing, the page explains that. We do not want a browser-based tool to look private when it actually needs a server."
      },
      {
        "icon": "zap",
        "title": "No Account Required",
        "description": "Open a tool and use it. Navorika does not require an account, email address, subscription, or software installation."
      },
      {
        "icon": "cpu",
        "title": "Calculations Are Checked",
        "description": "Calculator formulas are based on documented methods and are checked with automated tests using normal values, limits, and unusual inputs."
      }
    ],
    "toolCategoriesTitle": "What You Can Do on Navorika",
    "toolCategories": [
      {
        "icon": "calculator",
        "title": "Money & Planning Calculators",
        "description": "Calculators for loans, savings, investing, taxes, mortgages, budgets, business numbers, and property planning."
      },
      {
        "icon": "layers",
        "title": "Construction & Home Project Calculators",
        "description": "Estimate concrete, bricks, flooring, roofing, stairs, materials, project costs, and other common construction quantities."
      },
      {
        "icon": "fileText",
        "title": "Document & PDF Utilities",
        "description": "Merge, split, reorder, compress, sign, convert, and extract text from PDF files using simple online tools."
      },
      {
        "icon": "image",
        "title": "Image & Media Tools",
        "description": "Convert, resize, compress, crop, inspect, and prepare common image formats such as JPG, PNG, WebP, HEIC, and SVG."
      },
      {
        "icon": "code",
        "title": "Developer & Web Tools",
        "description": "Tools for JSON, YAML, Base64, JWT, cron schedules, code formatting, networking, timestamps, and common web-development tasks."
      }
    ],
    "howWeBuildTitle": "How We Build and Check Our Tools",
    "howWeBuildParagraphs": [
      "We build calculators from documented formulas, official rules where relevant, and established industry methods. For example, loan tools use standard payment formulas, tax tools use published tax rules, and construction tools use common measurement and material calculations.",
      "We use automated tests to check calculator results for normal examples, zero values, limits, and unexpected inputs. We also review tools when formulas, rules, or software dependencies change.",
      "For more detail on formulas, sources, and testing, read How Our Calculators Work & Standards document."
    ],
    "howWeBuildLink": {
      "text": "How Our Calculators Work & Standards",
      "href": "/methodology"
    },
    "limitationsTitle": "What to Know Before You Use a Result",
    "limitationsParagraphs": [
      "Browser-based tools still have limits. Very large PDFs, images, or other files can use a lot of memory, and some jobs may run more slowly on phones or older computers.",
      "Calculators are useful for estimates and planning, but important legal, tax, medical, safety, or structural decisions may need advice from a qualified professional. Please review our Legal & Calculation Disclaimer for category-specific caveats."
    ],
    "limitationsLink": {
      "text": "Legal & Calculation Disclaimer",
      "href": "/disclaimer"
    },
    "quickLinksTitle": "Policies and Helpful Information",
    "quickLinks": [
      {
        "text": "How Calculators Work",
        "href": "/methodology"
      },
      {
        "text": "Legal Disclaimer",
        "href": "/disclaimer"
      },
      {
        "text": "Privacy Policy",
        "href": "/privacy"
      },
      {
        "text": "Terms of Service",
        "href": "/terms"
      },
      {
        "text": "Contact Us",
        "href": "/contact"
      }
    ]
  },
  "fr": {
    "title": "À Propos de Navorika – Calculateurs et Outils en Ligne Gratuits",
    "description": "Découvrez Navorika, notre architecture orientée traitement local dans le navigateur, nos garanties de confidentialité et nos outils vérifiés.",
    "eyebrow": "À Propos de Navorika",
    "heroTitle": "Calculateurs et Outils en Ligne Gratuits",
    "heroDescription": "Navorika est une plateforme indépendante regroupant plus de 319 calculateurs gratuits et outils en ligne pour vos fichiers, images, calculs financiers, projets de bâtiment et développement web. La plupart s'exécutent directement dans votre navigateur.",
    "buttons": {
      "primaryText": "Explorer les Outils Gratuits",
      "primaryHref": "/tools",
      "secondaryText": "Fonctionnement des Calculateurs",
      "secondaryHref": "/methodology"
    },
    "corePrinciplesTitle": "Nos Principes Fondamentaux",
    "corePrinciples": [
      {
        "icon": "lock",
        "title": "Vos fichiers restent sur votre appareil",
        "description": "La majorité des utilitaires Navorika s'exécutent localement dans votre navigateur ; vos fichiers et données personnelles ne sont pas envoyés sur nos serveurs."
      },
      {
        "icon": "shield",
        "title": "Transparence totale sur l'exécution",
        "description": "Lorsqu'un outil nécessite des données en temps réel ou un serveur distant, cela est expressément indiqué. Nous ne masquons jamais l'usage d'un serveur."
      },
      {
        "icon": "zap",
        "title": "Aucune création de compte requise",
        "description": "Accédez directement à vos outils. Navorika n'exige aucune inscription, aucun abonnement, aucune adresse électronique ni installation de logiciel."
      },
      {
        "icon": "cpu",
        "title": "Formules vérifiées par des tests",
        "description": "Nos calculateurs reposent sur des formules reconnues et documentées, testées automatiquement sur des cas réels, des limites et des entrées atypiques."
      }
    ],
    "toolCategoriesTitle": "Ce que vous pouvez réaliser sur Navorika",
    "toolCategories": [
      {
        "icon": "calculator",
        "title": "Calculateurs Financiers et Budget",
        "description": "Simulateurs pour emprunts, épargne, investissements, impôts, amortissements, mensualités et gestion de trésorerie."
      },
      {
        "icon": "layers",
        "title": "Calculateurs Bâtiment et Travaux",
        "description": "Métrés pour béton, briques, carrelage, toitures, escaliers, matériaux de chantier et estimations de coûts de rénovation."
      },
      {
        "icon": "fileText",
        "title": "Utilitaires Documentaires et PDF",
        "description": "Fusionnez, découpez, compressez, réorganisez, signez, convertissez et extrayez le texte de vos fichiers PDF en toute simplicité."
      },
      {
        "icon": "image",
        "title": "Outils Graphiques et Médias",
        "description": "Convertissez, redimensionnez, compressez, recadrez et optimisez vos images aux formats JPG, PNG, WebP, HEIC et SVG."
      },
      {
        "icon": "code",
        "title": "Outils Web et Développeurs",
        "description": "Formatage JSON, YAML, encodage Base64, décodeur JWT, planificateurs cron, horodatages et utilitaires réseau."
      }
    ],
    "howWeBuildTitle": "Conception et Contrôle de nos Outils",
    "howWeBuildParagraphs": [
      "Nous développons nos calculateurs à partir de formules mathématiques publiées, de règles officielles et des pratiques reconnues des professionnels. Les outils de crédit appliquent les normes bancaires standard, les simulateurs fiscaux intègrent les barèmes officiels et les outils de chantier s'appuient sur les règles de calcul géométrique des matériaux.",
      "Nous utilisons des batteries de tests automatisés pour éprouver chaque algorithme sur des cas concrets, des valeurs nulles et des saisies extrêmes. Nous réexaminons les outils lors de toute mise à jour des barèmes réglementaires.",
      "Pour en savoir plus sur nos sources et protocoles de test, consultez notre document Méthodologie et Normes."
    ],
    "howWeBuildLink": {
      "text": "Méthodologie et Normes des Calculateurs",
      "href": "/methodology"
    },
    "limitationsTitle": "Informations Importantes Avant Utilisation",
    "limitationsParagraphs": [
      "Les outils s'exécutant dans le navigateur ont des limites inhérentes. Les fichiers PDF ou images très volumineux peuvent consommer une quantité importante de mémoire et ralentir sur mobile.",
      "Nos calculateurs fournissent des estimations d'aide à la décision. Les choix juridiques, fiscaux, médicaux ou de structure du bâtiment nécessitent l'avis d'un professionnel qualifié. Veuillez consulter notre Avertissement Légal."
    ],
    "limitationsLink": {
      "text": "Avertissement Légal et Calculs",
      "href": "/disclaimer"
    },
    "quickLinksTitle": "Informations Utiles et Politiques",
    "quickLinks": [
      {
        "text": "Méthodologie des calculs",
        "href": "/methodology"
      },
      {
        "text": "Avertissement légal",
        "href": "/disclaimer"
      },
      {
        "text": "Politique de confidentialité",
        "href": "/privacy"
      },
      {
        "text": "Conditions d'utilisation",
        "href": "/terms"
      },
      {
        "text": "Contactez-nous",
        "href": "/contact"
      }
    ]
  },
  "it": {
    "title": "Chi Siamo – Navorika Calcolatori e Utilità Online Gratuite",
    "description": "Scopri Navorika, la nostra architettura di calcolo locale nel browser, le garanzie sulla privacy e gli oltre 319 strumenti verificati.",
    "eyebrow": "Informazioni su Navorika",
    "heroTitle": "Calcolatori e Strumenti Online Gratuiti",
    "heroDescription": "Navorika è una piattaforma indipendente con oltre 319 calcolatori e utilità gratuite per documenti, immagini, finanza, salute, edilizia, programmazione e calcoli quotidiani. La maggior parte funziona interamente nel tuo browser.",
    "buttons": {
      "primaryText": "Esplora gli Strumenti Gratuiti",
      "primaryHref": "/tools",
      "secondaryText": "Come Funzionano i Calcolatori",
      "secondaryHref": "/methodology"
    },
    "corePrinciplesTitle": "I Nostri Principi Fondamentali",
    "corePrinciples": [
      {
        "icon": "lock",
        "title": "I tuoi file restano sul tuo dispositivo",
        "description": "La maggioranza degli strumenti Navorika funziona internamente nel browser: i tuoi documenti non vengono caricati sui nostri server."
      },
      {
        "icon": "shield",
        "title": "Trasparenza su server ed elaborazione",
        "description": "Se uno strumento necessita di dati esterni o di elaborazione remota, la pagina lo dichiara esplicitamente. Nessuna sorpresa sulla privacy."
      },
      {
        "icon": "zap",
        "title": "Nessun account richiesto",
        "description": "Apri uno strumento e usalo all'istante. Navorika non richiede registrazioni, indirizzi email, carte di credito né installazioni."
      },
      {
        "icon": "cpu",
        "title": "Formule verificate con test automatici",
        "description": "Tutte le formule matematiche si basano su standard documentati e vengono validate continuamente mediante test automatizzati su casi limite."
      }
    ],
    "toolCategoriesTitle": "Cosa puoi fare su Navorika",
    "toolCategories": [
      {
        "icon": "calculator",
        "title": "Calcolatori Finanziari e di Budget",
        "description": "Utility per mutui, prestiti, rendimenti, investimenti, imposte, piani di accumulo e contabilità aziendale."
      },
      {
        "icon": "layers",
        "title": "Calcolatori per Edilizia e Fai-da-te",
        "description": "Stima quantitativi di calcestruzzo, mattoni, pavimenti, scale, pendenze tetto, materiali e costi operativi."
      },
      {
        "icon": "fileText",
        "title": "Utilità per Documenti e PDF",
        "description": "Unisci, dividi, comprimi, ruota, firma, converti ed estrai testo da file PDF con strumenti rapidi nel browser."
      },
      {
        "icon": "image",
        "title": "Elaborazione Immagini e Media",
        "description": "Converti, ridimensiona, comprimi, ritaglia e ispeziona formati grafici come JPG, PNG, WebP, HEIC e SVG."
      },
      {
        "icon": "code",
        "title": "Strumenti per Sviluppatori e Web",
        "description": "Convertitori JSON, YAML, codifica Base64, decodifica JWT, espressioni cron, formattatori e utilità di rete."
      }
    ],
    "howWeBuildTitle": "Come Progettiamo e Controlliamo gli Strumenti",
    "howWeBuildParagraphs": [
      "Realizziamo i nostri calcolatori adottando formule matematiche documentate, indicazioni normative e prassi consolidate. Gli strumenti di credito usano piani di ammortamento standard, le tabelle fiscali rispecchiano le normative pubblicate e i moduli di cantiere applicano formule geometriche e percentuali di sfrido realistiche.",
      "Impieghiamo test automatici continui per convalidare i risultati su valori ordinari, zeri, soglie minime e ingressi anomali. Riesaminiamo gli algoritmi ad ogni variazione dei parametri normativi.",
      "Per un approfondimento sui metodi di calcolo e sulle formule, consulta la nostra Metodologia di Calcolo."
    ],
    "howWeBuildLink": {
      "text": "Metodologia di Calcolo e Standard",
      "href": "/methodology"
    },
    "limitationsTitle": "Cosa Sapere Prima di Usare i Risultati",
    "limitationsParagraphs": [
      "L'elaborazione locale nel browser comporta vincoli fisiologici. Documenti PDF o immagini molto pesanti possono impegnare molta memoria su dispositivi datati.",
      "I calcolatori forniscono stime utili per la pianificazione. Decisioni rilevanti in ambito strutturale, fiscale, legale o medico richiedono sempre il parere di un professionista abilitato. Consulta le nostre Note Legali."
    ],
    "limitationsLink": {
      "text": "Note Legali ed Esclusione di Responsabilità",
      "href": "/disclaimer"
    },
    "quickLinksTitle": "Informazioni e Documentazione Legale",
    "quickLinks": [
      {
        "text": "Metodologia dei calcoli",
        "href": "/methodology"
      },
      {
        "text": "Note legali e disclaimer",
        "href": "/disclaimer"
      },
      {
        "text": "Informativa sulla privacy",
        "href": "/privacy"
      },
      {
        "text": "Termini di servizio",
        "href": "/terms"
      },
      {
        "text": "Contattaci",
        "href": "/contact"
      }
    ]
  },
  "pt": {
    "title": "Sobre a Navorika – Calculadoras e Ferramentas Online Gratuitas",
    "description": "Conheça a Navorika, a nossa arquitetura de processamento local no navegador, garantias de privacidade e mais de 319 ferramentas verificadas.",
    "eyebrow": "Sobre a Navorika",
    "heroTitle": "Calculadoras e Ferramentas Online Gratuitas",
    "heroDescription": "A Navorika é uma plataforma independente com mais de 319 calculadoras e ferramentas online gratuitas para ficheiros, imagens, finanças, saúde, construção, desenvolvimento web e tarefas diárias. A maioria executa diretamente no seu navegador.",
    "buttons": {
      "primaryText": "Explorar Ferramentas Gratuitas",
      "primaryHref": "/tools",
      "secondaryText": "Como Funcionam as Calculadoras",
      "secondaryHref": "/methodology"
    },
    "corePrinciplesTitle": "O Que Pode Esperar",
    "corePrinciples": [
      {
        "icon": "lock",
        "title": "Os seus ficheiros ficam no seu dispositivo",
        "description": "A maior parte dos utilitários Navorika funciona internamente no navegador; os seus ficheiros e cálculos não são enviados para os nossos servidores."
      },
      {
        "icon": "shield",
        "title": "Clareza sobre tarefas em servidor",
        "description": "Se uma ferramenta necessitar de dados externos ou de servidor, a página explica isso claramente. Não camuflamos o uso de servidores."
      },
      {
        "icon": "zap",
        "title": "Sem necessidade de registo",
        "description": "Abra a ferramenta e use-a imediatamente. A Navorika não exige conta, email, subscrições nem instalação de software."
      },
      {
        "icon": "cpu",
        "title": "Fórmulas matemáticas testadas",
        "description": "As fórmulas das calculadoras baseiam-se em métodos documentados e são validadas por testes automáticos em valores reais e extremos."
      }
    ],
    "toolCategoriesTitle": "O que pode fazer na Navorika",
    "toolCategories": [
      {
        "icon": "calculator",
        "title": "Calculadoras Financeiras e de Orçamento",
        "description": "Calculadoras para empréstimos, poupanças, investimentos, impostos, amortizações e planeamento patrimonial."
      },
      {
        "icon": "layers",
        "title": "Calculadoras de Construção e Reformas",
        "description": "Estime betão, tijolos, pisos, telhados, escadas, materiais e orçamentos gerais de obras."
      },
      {
        "icon": "fileText",
        "title": "Utilitários de Documentos e PDF",
        "description": "Junte, divida, reordene, comprima, assine, converta e extraia texto de ficheiros PDF no navegador."
      },
      {
        "icon": "image",
        "title": "Ferramentas de Imagem e Multimédia",
        "description": "Converta, redimensione, comprima, corte e prepare formatos comuns como JPG, PNG, WebP, HEIC e SVG."
      },
      {
        "icon": "code",
        "title": "Ferramentas para Programadores e Web",
        "description": "Utilitários para JSON, YAML, Base64, JWT, expressões cron, formatação de código e redes."
      }
    ],
    "howWeBuildTitle": "Como Desenvolvemos e Testamos as Ferramentas",
    "howWeBuildParagraphs": [
      "Desenvolvemos calculadoras com base em fórmulas documentadas, regulamentos vigentes e boas práticas do setor. As ferramentas de crédito aplicam sistemas padronizados de amortização, as ferramentas fiscais seguem tabelas oficiais e os utilitários de obras utilizam cubagens geométricas e margens de perda aceites.",
      "Recorremos a testes automatizados contínuos para aferir os resultados com casos reais, limites e entradas improváveis. Revemos os módulos sempre que as normas ou bibliotecas de código se alteram.",
      "Para obter mais detalhes sobre fórmulas e validação técnica, leia o nosso documento Metodologia de Cálculo."
    ],
    "howWeBuildLink": {
      "text": "Metodologia de Cálculo e Normas",
      "href": "/methodology"
    },
    "limitationsTitle": "O Que Deve Saber Antes de Usar um Resultado",
    "limitationsParagraphs": [
      "O processamento no navegador possui limites físicos. Ficheiros PDF ou imagens muito pesados podem consumir bastante memória RAM em telemóveis ou computadores mais antigos.",
      "As calculadoras são excelentes para planeamento e estimativas. Decisões estruturais, fiscais, de saúde ou legais importantes devem contar com o parecer de profissionais habilitados. Consulte o nosso Aviso Legal."
    ],
    "limitationsLink": {
      "text": "Aviso Legal e Limitações",
      "href": "/disclaimer"
    },
    "quickLinksTitle": "Políticas e Informações Úteis",
    "quickLinks": [
      {
        "text": "Metodologia das calculadoras",
        "href": "/methodology"
      },
      {
        "text": "Aviso legal",
        "href": "/disclaimer"
      },
      {
        "text": "Política de privacidade",
        "href": "/privacy"
      },
      {
        "text": "Termos de serviço",
        "href": "/terms"
      },
      {
        "text": "Fale connosco",
        "href": "/contact"
      }
    ]
  },
  "es": {
    "title": "Acerca de Navorika – Calculadoras y Herramientas Online Gratuitas",
    "description": "Conozca Navorika, nuestra arquitectura de cómputo local en el navegador, garantías de privacidad y más de 319 utilidades verificadas.",
    "eyebrow": "Acerca de Navorika",
    "heroTitle": "Calculadoras y Herramientas Online Gratuitas",
    "heroDescription": "Navorika es una plataforma web independiente con más de 319 calculadoras y herramientas gratuitas para documentos, imágenes, finanzas, salud, construcción, tareas cotidianas y desarrollo web. La gran mayoría se ejecutan directamente en su navegador.",
    "buttons": {
      "primaryText": "Explorar Herramientas Gratuitas",
      "primaryHref": "/tools",
      "secondaryText": "Cómo Funcionan las Calculadoras",
      "secondaryHref": "/methodology"
    },
    "corePrinciplesTitle": "Lo Que Puede Esperar",
    "corePrinciples": [
      {
        "icon": "lock",
        "title": "Sus archivos permanecen en su dispositivo",
        "description": "La gran mayoría de utilidades de Navorika operan localmente en su navegador, evitando la subida de sus documentos a servidores externos."
      },
      {
        "icon": "shield",
        "title": "Claridad absoluta sobre el procesamiento",
        "description": "Si una herramienta requiere datos en vivo o asistencia de servidor, la página lo explica con total transparencia."
      },
      {
        "icon": "zap",
        "title": "Sin registro de cuentas",
        "description": "Abra la herramienta y comience a usarla. Navorika no solicita cuentas, direcciones de correo, suscripciones ni descargas de software."
      },
      {
        "icon": "cpu",
        "title": "Cálculos matemáticos auditados",
        "description": "Las fórmulas numéricas se sustentan en manuales técnicos contrastados y se comprueban mediante baterías automáticas de ensayo."
      }
    ],
    "toolCategoriesTitle": "Qué puede resolver en Navorika",
    "toolCategories": [
      {
        "icon": "calculator",
        "title": "Calculadoras Financieras y de Planificación",
        "description": "Herramientas para préstamos, ahorro, inversiones, impuestos, hipotecas, márgenes comerciales y presupuestos."
      },
      {
        "icon": "layers",
        "title": "Calculadoras de Construcción y Reformas",
        "description": "Estime hormigón, ladrillos, tarima, cubiertas, escaleras, materiales y costes generales de obra."
      },
      {
        "icon": "fileText",
        "title": "Utilidades de Documentos y PDF",
        "description": "Combine, divida, reordene, comprima, firme, convierta y extraiga texto de archivos PDF con facilidad."
      },
      {
        "icon": "image",
        "title": "Herramientas de Imagen y Medios",
        "description": "Convierta, redimensione, comprima, recorte y prepare formatos frecuentes como JPG, PNG, WebP, HEIC y SVG."
      },
      {
        "icon": "code",
        "title": "Herramientas para Desarrolladores Web",
        "description": "Utilidades para JSON, YAML, Base64, JWT, expresiones cron, formato de código y redes informáticas."
      }
    ],
    "howWeBuildTitle": "Cómo Creamos y Auditamos las Herramientas",
    "howWeBuildParagraphs": [
      "Desarrollamos nuestras calculadoras a partir de fórmulas publicadas, directrices oficiales y prácticas profesionales aceptadas. Las herramientas de crédito emplean métodos estandarizados de amortización, las utilidades tributarias integran baremos públicos y los módulos de obra aplican fórmulas de cubicación con mermas de material realistas.",
      "Utilizamos pruebas automatizadas continuas para confrontar los cálculos con ejemplos reales, valores nulos y situaciones atípicas. Revisamos las herramientas cuando se producen cambios normativos o actualizaciones de librerías.",
      "Para conocer al detalle nuestras fuentes y métodos de ensayo, consulte nuestra Metodología de Cálculo."
    ],
    "howWeBuildLink": {
      "text": "Metodología de Cálculo y Estándares",
      "href": "/methodology"
    },
    "limitationsTitle": "Qué Debe Considerar Antes de Usar un Resultado",
    "limitationsParagraphs": [
      "Las herramientas en navegador tienen límites de rendimiento. Los documentos PDF o imágenes de gran tamaño pueden consumir abundante memoria y ralentizarse en teléfonos.",
      "Las calculadoras son útiles para estimaciones y planificación. Cualquier decisión sustancial de carácter médico, legal, fiscal o estructural debe ser supervisada por un profesional cualificado. Consulte nuestro Descargo de Responsabilidad."
    ],
    "limitationsLink": {
      "text": "Descargo de Responsabilidad y Límites",
      "href": "/disclaimer"
    },
    "quickLinksTitle": "Políticas e Información Legal",
    "quickLinks": [
      {
        "text": "Metodología de cálculo",
        "href": "/methodology"
      },
      {
        "text": "Descargo de responsabilidad",
        "href": "/disclaimer"
      },
      {
        "text": "Política de privacidad",
        "href": "/privacy"
      },
      {
        "text": "Términos del servicio",
        "href": "/terms"
      },
      {
        "text": "Contacte con nosotros",
        "href": "/contact"
      }
    ]
  },
  "de": {
    "title": "Über Navorika – Kostenlose Online-Rechner & Werkzeuge",
    "description": "Erfahren Sie mehr über Navorika, unsere datenschutzorientierte Browser-Architektur und über 319 verifizierte Online-Werkzeuge.",
    "eyebrow": "Über Navorika",
    "heroTitle": "Kostenlose Online-Rechner & Werkzeuge",
    "heroDescription": "Navorika ist eine unabhängige Plattform mit über 319 kostenlosen Rechnern und Online-Tools für Dokumente, Bilder, Finanzen, Gesundheit, Bauvorhaben, Entwicklungsaufgaben und den Alltag. Fast alle Werkzeuge laufen direkt in Ihrem Browser.",
    "buttons": {
      "primaryText": "Kostenlose Werkzeuge Entdecken",
      "primaryHref": "/tools",
      "secondaryText": "Funktionsweise der Rechner",
      "secondaryHref": "/methodology"
    },
    "corePrinciplesTitle": "Was Sie Erwarten Können",
    "corePrinciples": [
      {
        "icon": "lock",
        "title": "Ihre Dateien bleiben auf Ihrem Gerät",
        "description": "Die meisten Navorika-Werkzeuge arbeiten lokal im Browser. Dateien und Eingabedaten werden nicht auf Navorika-Server übertragen."
      },
      {
        "icon": "shield",
        "title": "Klare Transparenz bei Serveraufgaben",
        "description": "Wenn ein Werkzeug Live-Daten oder Serververarbeitung benötigt, wird dies auf der Seite deutlich deklariert."
      },
      {
        "icon": "zap",
        "title": "Keine Benutzerregistrierung erforderlich",
        "description": "Öffnen Sie ein Werkzeug und legen Sie direkt los. Navorika verlangt weder ein Konto, E-Mail-Adressen noch Installationen."
      },
      {
        "icon": "cpu",
        "title": "Geprüfte mathematische Formeln",
        "description": "Unsere Rechner stützen sich auf anerkannte Methoden und werden über automatisierte Testsuiten gründlich verifiziert."
      }
    ],
    "toolCategoriesTitle": "Was Sie auf Navorika tun können",
    "toolCategories": [
      {
        "icon": "calculator",
        "title": "Finanz- und Budgetrechner",
        "description": "Rechner für Kredite, Zinseszins, Geldanlagen, Steuern, Baufinanzierung und betriebswirtschaftliche Kennzahlen."
      },
      {
        "icon": "layers",
        "title": "Bau- und Heimwerkerrechner",
        "description": "Mengenermittlung für Beton, Mauerwerk, Bodenbeläge, Dachneigungen, Treppen und Projektkosten."
      },
      {
        "icon": "fileText",
        "title": "Dokumenten- und PDF-Werkzeuge",
        "description": "PDFs zusammenfügen, trennen, komprimieren, unterschreiben, umwandeln und Text extrahieren."
      },
      {
        "icon": "image",
        "title": "Bildbearbeitung und Medien",
        "description": "Konvertieren, skalieren, komprimieren, zuschneiden und prüfen gängiger Formate wie JPG, PNG, WebP, HEIC und SVG."
      },
      {
        "icon": "code",
        "title": "Entwickler- und Webwerkzeuge",
        "description": "Hilfsmittel für JSON, YAML, Base64, JWT, Cron-Syntax, Codeformatierung und Netzwerkabfragen."
      }
    ],
    "howWeBuildTitle": "Wie Wir Unsere Werkzeuge Entwickeln und Prüfen",
    "howWeBuildParagraphs": [
      "Wir entwickeln unsere Rechner auf Basis dokumentierter Formeln, offizieller Tabellen und anerkannter Branchenstandards. Kreditwerkzeuge nutzen Standard-Tilgungsformeln, Steuerwerkzeuge amtliche Vorgaben und Baurechner anerkannte geometrische Formeln inklusive realistischer Verschnittzuschläge.",
      "Wir setzen automatisierte Tests ein, um Rechenergebnisse bei Standardfällen, Grenzwerten und Fehleingaben abzusichern. Bei Änderungen von Gesetzen oder Softwarebibliotheken werden die Tools umgehend angepasst.",
      "Ausführliche Informationen zu unseren Quellen und Prüfstandards finden Sie in unserer Berechnungsmethodik."
    ],
    "howWeBuildLink": {
      "text": "Berechnungsmethodik und Standards",
      "href": "/methodology"
    },
    "limitationsTitle": "Wichtige Hinweise Vor Der Nutzung",
    "limitationsParagraphs": [
      "Browserbasierte Werkzeuge unterliegen Systemgrenzen. Sehr große PDF-Dokumente oder Grafiken können viel Arbeitsspeicher beanspruchen und ältere Geräte verlangsamen.",
      "Rechner sind wertvolle Planungshilfen. Wesentliche rechtliche, steuerliche, medizinische oder statische Entscheidungen erfordern stets die Beratung durch einen qualifizierten Fachexperten. Bitte beachten Sie unseren Haftungsausschluss."
    ],
    "limitationsLink": {
      "text": "Rechtliche Hinweise und Haftungsausschluss",
      "href": "/disclaimer"
    },
    "quickLinksTitle": "Richtlinien und Nützliche Informationen",
    "quickLinks": [
      {
        "text": "Berechnungsmethodik",
        "href": "/methodology"
      },
      {
        "text": "Haftungsausschluss",
        "href": "/disclaimer"
      },
      {
        "text": "Datenschutzerklärung",
        "href": "/privacy"
      },
      {
        "text": "Nutzungsbedingungen",
        "href": "/terms"
      },
      {
        "text": "Kontakt",
        "href": "/contact"
      }
    ]
  },
  "ru": {
    "title": "О проекте Navorika – Бесплатные онлайн-калькуляторы и инструменты",
    "description": "Узнайте о Navorika, клиентской архитектуре в браузере, стандартах приватности и более чем 319 проверенных веб-инструментах.",
    "eyebrow": "О сервисе Navorika",
    "heroTitle": "Бесплатные онлайн-калькуляторы и инструменты",
    "heroDescription": "Navorika — это независимый веб-ресурс, объединяющий более 319 бесплатных калькуляторов и онлайн-инструментов для работы с файлами, графикой, финансами, строительными расчетами, разработкой и повседневными задачами. Почти все операции выполняются прямо в вашем браузере.",
    "buttons": {
      "primaryText": "Все бесплатные инструменты",
      "primaryHref": "/tools",
      "secondaryText": "Как работают калькуляторы",
      "secondaryHref": "/methodology"
    },
    "corePrinciplesTitle": "Наши Ключевые Принципы",
    "corePrinciples": [
      {
        "icon": "lock",
        "title": "Ваши файлы остаются на вашем устройстве",
        "description": "Большинство инструментов Navorika работают локально в браузере. Ваши файлы и вычисления не загружаются на серверы Navorika."
      },
      {
        "icon": "shield",
        "title": "Полная прозрачность обработки данных",
        "description": "Если инструменту требуются внешние API или временный сервер, это открыто указано на странице сервиса."
      },
      {
        "icon": "zap",
        "title": "Без обязательной регистрации",
        "description": "Открывайте инструмент и используйте его сразу. Navorika не требует аккаунтов, подписок, email или установки программ."
      },
      {
        "icon": "cpu",
        "title": "Проверенные математические алгоритмы",
        "description": "Формулы калькуляторов опираются на открытые стандарты и постоянно проверяются автоматическими тестами на граничные значения."
      }
    ],
    "toolCategoriesTitle": "Возможности платформы Navorika",
    "toolCategories": [
      {
        "icon": "calculator",
        "title": "Финансовые калькуляторы и расчет бюджета",
        "description": "Расчет кредитов, сложных процентов, инвестиций, налогов, ипотеки и бизнес-показателей."
      },
      {
        "icon": "layers",
        "title": "Строительные калькуляторы и ремонт",
        "description": "Расчет расхода бетона, кирпича, напольных покрытий, кровли, лестниц и сметы материалов."
      },
      {
        "icon": "fileText",
        "title": "Работа с документами и PDF",
        "description": "Объединяйте, разделяйте, сжимайте, подписывайте, конвертируйте и извлекайте текст из файлов PDF."
      },
      {
        "icon": "image",
        "title": "Обработка изображений и медиа",
        "description": "Конвертация, сжатие, изменение размера, обрезка и проверка форматов JPG, PNG, WebP, HEIC и SVG."
      },
      {
        "icon": "code",
        "title": "Инструменты для веб-разработчиков",
        "description": "Форматирование JSON, YAML, кодирование Base64, расшифровка JWT, синтаксис cron и работа с сетями."
      }
    ],
    "howWeBuildTitle": "Как Мы Разрабатываем и Тестируем Инструменты",
    "howWeBuildParagraphs": [
      "Мы проектируем калькуляторы на основе математических справочников, утвержденных нормативов и принятых отраслевых методик. Кредитные калькуляторы рассчитывают аннуитетные платежи по стандарту, налоговые алгоритмы используют актуальные сетки ставок, а строительные модули учитывают реальные технологические припуски.",
      "Мы применяем автоматизированные тесты для проверки результатов на стандартных числах, нулевых значениях и экстремальных входных данных. Алгоритмы пересматриваются при обновлении законодательства.",
      "Подробнее об источниках формул и методиках читайте в документе Методология расчетов."
    ],
    "howWeBuildLink": {
      "text": "Методология расчетов и стандарты",
      "href": "/methodology"
    },
    "limitationsTitle": "Что Важно Знать Перед Использованием",
    "limitationsParagraphs": [
      "Браузерная обработка имеет аппаратные рамки. Очень тяжелые PDF-документы или большие изображения могут потребовать значительный объем оперативной памяти.",
      "Калькуляторы служат для расчетов и планирования. Ответственные строительные, финансовые, медицинские или юридические решения требуют консультации сертифицированного специалиста. Ознакомьтесь с Отказом от ответственности."
    ],
    "limitationsLink": {
      "text": "Отказ от ответственности и ограничения",
      "href": "/disclaimer"
    },
    "quickLinksTitle": "Полезная Информация и Правила",
    "quickLinks": [
      {
        "text": "Методология расчетов",
        "href": "/methodology"
      },
      {
        "text": "Отказ от ответственности",
        "href": "/disclaimer"
      },
      {
        "text": "Политика конфиденциальности",
        "href": "/privacy"
      },
      {
        "text": "Условия обслуживания",
        "href": "/terms"
      },
      {
        "text": "Связаться с нами",
        "href": "/contact"
      }
    ]
  },
  "ar": {
    "title": "حول Navorika – آلات حاسبة وأدوات مجانية عبر الإنترنت",
    "description": "تعرف على منصة Navorika، ومعمارية المعالجة المحلية في المتصفح، وضمانات الخصوصية، وأكثر من 319 أداة وحاسبة موثقة.",
    "eyebrow": "حول منصة Navorika",
    "heroTitle": "آلات حاسبة وأدوات مجانية عبر الإنترنت",
    "heroDescription": "منصة Navorika موقع إلكتروني مستقل يضم أكثر من 319 آلة حاسبة وأداة رقمية مجانية للتعامل مع الملفات، والصور، والحسابات المالية، والمقاولات، ومهام البرمجة والعمل اليومي. تعمل معظم الأدوات مباشرة ومحلياً داخل متصفحك.",
    "buttons": {
      "primaryText": "استعراض الأدوات المجانية",
      "primaryHref": "/tools",
      "secondaryText": "كيف تعمل حاسباتنا",
      "secondaryHref": "/methodology"
    },
    "corePrinciplesTitle": "ما يمكنك توقعه من منصتنا",
    "corePrinciples": [
      {
        "icon": "lock",
        "title": "ملفاتك تبقى دائماً على جهازك",
        "description": "تعمل غالبية أدوات Navorika محلياً داخل متصفحك، مما يضمن عدم رفع ملفاتك أو بياناتك الحسابية إلى خوادم خارجية."
      },
      {
        "icon": "shield",
        "title": "شفافية مطلقة في المعالجة",
        "description": "إذا تطلبت أداة معينة بيانات مباشرة أو معالجة عبر خادم، فإن الصفحة توضح ذلك بالتفصيل ودون أي غموض."
      },
      {
        "icon": "zap",
        "title": "لا يتطلب تسجيل أي حساب",
        "description": "افتح الأداة واستخدمها فوراً. لا تطلب Navorika إنشاء حساب، أو إدخال بريد إلكتروني، أو دفع اشتراكات، أو تثبيت برامج."
      },
      {
        "icon": "cpu",
        "title": "معادلات حسابية مختبرة وموثقة",
        "description": "تستند صيغ الآلات الحاسبة إلى أساليب رياضية وعلمية موثقة، ويتم اختبارها آلياً على قيم قياسية وقيم حدية للتأكد من سلامتها."
      }
    ],
    "toolCategoriesTitle": "ما يمكنك إنجازه عبر Navorika",
    "toolCategories": [
      {
        "icon": "calculator",
        "title": "حاسبات المال والميزانية",
        "description": "أدوات لحساب القروض، والادخار، والاستثمار، والضرائب، والرهن العقاري، وتخطيط الميزانيات."
      },
      {
        "icon": "layers",
        "title": "حاسبات البناء والمقاولات",
        "description": "تقدير كميات الخرسانة، والطوب، والأرضيات، والأسقف، والسلالم، وتكاليف المواد الإنشائية."
      },
      {
        "icon": "fileText",
        "title": "أدوات المستندات وملفات PDF",
        "description": "دمج، وتقسيم، وضغط، وتوقيع، وتحويل، واستخراج النصوص من ملفات PDF بكل سهولة وأمان."
      },
      {
        "icon": "image",
        "title": "أدوات الصور والوسائط",
        "description": "تحويل، وتغيير حجم، وضغط، واقتصاص، وفحص الصور بتنسيقات JPG, PNG, WebP, HEIC, SVG."
      },
      {
        "icon": "code",
        "title": "أدوات المطورين والويب",
        "description": "أدوات معالجة تنسيقات JSON, YAML, Base64, JWT، وتوقيت cron، وتنسيق الأكواد البرمجية."
      }
    ],
    "howWeBuildTitle": "كيف نبني ونختبر أدواتنا",
    "howWeBuildParagraphs": [
      "نطور الآلات الحاسبة بالاعتماد على معادلات رياضية موثقة، وقوانين رسمية منشورة، وممارسات معتمدة. تطبق حاسبات القروض معادلات الاستهلاك المصرفية المعيارية، وتستند حاسبات الضرائب إلى اللوائح الحكومية المعلنة، وتعتمد حاسبات البناء على الهندسة الحجمية مع احتساب نسب الهدر الواقعية.",
      "نعتمد على حزم اختبارات برمجية مؤتمتة ومستمرة لفحص النتائج على مدخلات حقيقية، وقيم صفرية، وحدود قصوى. كما نقوم بمراجعة الأدوات فور حدوث أي تحديثات في القوانين أو المكتبات البرمجية.",
      "للاطلاع على تفاصيل المعادلات ومصادر البيانات، يرجى مراجعة وثيقة منهجية عمل الحاسبات."
    ],
    "howWeBuildLink": {
      "text": "منهجية عمل الحاسبات والمعايير",
      "href": "/methodology"
    },
    "limitationsTitle": "ما يجب معرفته قبل استخدام النتائج",
    "limitationsParagraphs": [
      "تخضع الأدوات العاملة داخل المتصفح لحدود الموارد المتاحة للجهاز. قد تستهلك ملفات PDF أو الصور الكبيرة جداً قدراً كبيراً من الذاكرة وتؤدي إلى بطء في الهواتف القديمة.",
      "تعتبر الآلات الحاسبة أدوات ممتازة للمحاكاة والتخطيط. ولكن القرارات الهندسية أو الطبية أو القانونية أو الضريبية الجوهرية تتطلب دائماً استشارة خبير مهني مرخص. يرجى مراجعة إخلاء المسؤولية القانونية."
    ],
    "limitationsLink": {
      "text": "إخلاء المسؤولية القانونية والحسابية",
      "href": "/disclaimer"
    },
    "quickLinksTitle": "معلومات مفيدة والسياسات",
    "quickLinks": [
      {
        "text": "منهجية عمل الحاسبات",
        "href": "/methodology"
      },
      {
        "text": "إخلاء المسؤولية",
        "href": "/disclaimer"
      },
      {
        "text": "سياسة الخصوصية",
        "href": "/privacy"
      },
      {
        "text": "شروط الخدمة",
        "href": "/terms"
      },
      {
        "text": "تواصل معنا",
        "href": "/contact"
      }
    ]
  }
};

export const contactContent: Record<Locale | 'en', TrustPageContent> = {
  "en": {
    "title": "Contact Navorika – Tool Help, Feedback & Bug Reports",
    "description": "Contact Navorika about a calculator, file tool, incorrect result, privacy question, bug report, or suggestion for a new online tool.",
    "eyebrow": "Get in Touch",
    "heroTitle": "Contact Navorika",
    "heroDescription": "Need help with a calculator or file tool, found a wrong result, or have an idea for a new tool? Send us an email.",
    "contactCards": {
      "general": {
        "title": "General Help & Feedback",
        "description": "For tool help, feedback, calculation questions, bug reports, or general inquiries.",
        "email": "admin@navorika.com",
        "buttonText": "Email Support"
      },
      "privacy": {
        "title": "Privacy & Data Inquiries",
        "description": "For questions regarding data processing, advertising disclosures, or our privacy policy.",
        "email": "privacy@navorika.com",
        "buttonText": "Email Privacy Team"
      }
    },
    "bugReport": {
      "title": "Report a Wrong Result or Tool Problem",
      "intro": "If a calculator result, file conversion, or page is not working as expected, these details help us check the problem:",
      "items": [
        {
          "label": "Tool URL",
          "text": "The exact page where the issue occurred (e.g., /tools/roof-pitch-calculator)."
        },
        {
          "label": "What You Entered",
          "text": "The specific numerical values, file types, or options selected."
        },
        {
          "label": "What You Expected",
          "text": "What result you expected based on reference standards vs. what was displayed."
        },
        {
          "label": "Browser & Device",
          "text": "Your web browser (Chrome, Firefox, Safari, Edge) and device type (Desktop, Mobile)."
        }
      ]
    },
    "operationalNote": {
      "text": "Navorika is an independent online tool website. Email is our main support channel. To learn how calculator formulas and testing are handled, see",
      "linkText": "How Our Calculators Work",
      "linkHref": "/methodology"
    }
  },
  "fr": {
    "title": "Contactez Navorika – Support, Retours et Signalements",
    "description": "Contactez l'équipe de Navorika pour une aide sur un outil, signaler un résultat inexact, poser une question de confidentialité ou proposer un nouvel utilitaire.",
    "eyebrow": "Nous Contacter",
    "heroTitle": "Contacter Navorika",
    "heroDescription": "Besoin d'aide sur une calculatrice ou un outil de conversion, constat d'un résultat erroné ou idée d'utilitaire ? Envoyez-nous un courriel.",
    "contactCards": {
      "general": {
        "title": "Aide Générale et Retours",
        "description": "Pour toute demande d'assistance sur un outil, question de calcul, rapport de bogue ou suggestion générale.",
        "email": "admin@navorika.com",
        "buttonText": "Écrire au Support"
      },
      "privacy": {
        "title": "Confidentialité et Données Personnelles",
        "description": "Pour toute question relative au traitement des données, aux mentions publicitaires ou à notre politique de confidentialité.",
        "email": "privacy@navorika.com",
        "buttonText": "Écrire à l'Équipe Données"
      }
    },
    "bugReport": {
      "title": "Signaler une Anomalie ou un Résultat Incorrect",
      "intro": "Si un calcul, une conversion de document ou une page ne fonctionne pas comme prévu, ces précisions nous aident à vérifier le problème :",
      "items": [
        {
          "label": "URL de l'outil",
          "text": "La page exacte sur laquelle le problème est survenu (ex. : /tools/roof-pitch-calculator)."
        },
        {
          "label": "Valeurs saisies",
          "text": "Les valeurs numériques précises, le format de fichier ou les options sélectionnées."
        },
        {
          "label": "Résultat attendu",
          "text": "Le résultat que vous attendiez selon les formules standard par rapport au résultat affiché."
        },
        {
          "label": "Navigateur et appareil",
          "text": "Votre navigateur web (Chrome, Firefox, Safari, Edge) et type d'appareil (Ordinateur, Mobile)."
        }
      ]
    },
    "operationalNote": {
      "text": "Navorika est une plateforme indépendante d'outils en ligne. Le courriel est notre canal de contact principal. Pour en savoir plus sur nos méthodes de calcul, consultez",
      "linkText": "Comment fonctionnent nos calculateurs",
      "linkHref": "/methodology"
    }
  },
  "it": {
    "title": "Contatta Navorika – Supporto, Feedback e Segnalazioni",
    "description": "Contatta Navorika per assistenza sugli strumenti, segnalazione di risultati incongruenti, chiarimenti sulla privacy o suggerimenti per nuove funzioni.",
    "eyebrow": "Mettiti in Contatto",
    "heroTitle": "Contatta Navorika",
    "heroDescription": "Hai bisogno di supporto con una utility o un convertitore, hai individuato un risultato impreciso o vuoi proporre un nuovo strumento? Scrivici un'email.",
    "contactCards": {
      "general": {
        "title": "Assistenza Generale e Feedback",
        "description": "Per supporto sull'uso degli strumenti, chiarimenti sulle formule, segnalazione di bug o domande generali.",
        "email": "admin@navorika.com",
        "buttonText": "Scrivi all'Assistenza"
      },
      "privacy": {
        "title": "Privacy e Trattamento Dati",
        "description": "Per quesiti riguardanti il trattamento dei dati, i consensi pubblicitari o l'informativa sulla privacy.",
        "email": "privacy@navorika.com",
        "buttonText": "Scrivi al Team Privacy"
      }
    },
    "bugReport": {
      "title": "Segnala un Risultato Errato o un Problema Tecnico",
      "intro": "Se un calcolo, una conversione di file o una funzionalità mostra un comportamento anomalo, questi dettagli ci consentono di verificare rapidamente:",
      "items": [
        {
          "label": "URL dello strumento",
          "text": "La pagina esatta in cui si è verificata l'anomalia (es.: /tools/roof-pitch-calculator)."
        },
        {
          "label": "Dati immessi",
          "text": "I valori numerici specifici, i formati di file o le impostazioni selezionate."
        },
        {
          "label": "Risultato atteso",
          "text": "Il valore corretto che ti aspettavi in base alle norme o formule rispetto a quanto visualizzato."
        },
        {
          "label": "Browser e dispositivo",
          "text": "Il browser utilizzato (Chrome, Firefox, Safari, Edge) e il dispositivo (Computer, Smartphone)."
        }
      ]
    },
    "operationalNote": {
      "text": "Navorika è una piattaforma indipendente di utilità online. La posta elettronica è il nostro canale di supporto principale. Per approfondire come validiamo i calcoli, consulta",
      "linkText": "Come funzionano i nostri calcolatori",
      "linkHref": "/methodology"
    }
  },
  "pt": {
    "title": "Contacto Navorika – Apoio, Sugestões e Comunicação de Erros",
    "description": "Contacte a Navorika para obter ajuda sobre calculadoras, reportar resultados incorretos, questões de privacidade ou sugerir novas ferramentas.",
    "eyebrow": "Fale Connosco",
    "heroTitle": "Contactar a Navorika",
    "heroDescription": "Precisa de ajuda com uma calculadora ou conversor, detetou um cálculo incorreto ou quer propor um novo utilitário? Envie-nos um email.",
    "contactCards": {
      "general": {
        "title": "Apoio Geral e Sugestões",
        "description": "Para dúvidas sobre o funcionamento das ferramentas, questões de cálculo, relato de erros ou informações gerais.",
        "email": "admin@navorika.com",
        "buttonText": "Contactar o Apoio"
      },
      "privacy": {
        "title": "Privacidade e Proteção de Dados",
        "description": "Para esclarecimentos sobre privacidade, gestão de cookies, publicidade ou a nossa política de dados.",
        "email": "privacy@navorika.com",
        "buttonText": "Contactar a Equipa de Privacidade"
      }
    },
    "bugReport": {
      "title": "Comunicar um Resultado Incorreto ou Falha Técnica",
      "intro": "Se o resultado de uma calculadora ou uma conversão de ficheiro não funcionar como esperado, estas informações ajudam-nos a verificar a situação:",
      "items": [
        {
          "label": "URL da ferramenta",
          "text": "A página exata onde ocorreu o problema (por exemplo, /tools/roof-pitch-calculator)."
        },
        {
          "label": "Valores introduzidos",
          "text": "Os valores numéricos específicos, tipos de ficheiros ou opções escolhidas."
        },
        {
          "label": "Resultado esperado",
          "text": "O valor que esperava obter com base nas normas de referência versus o valor apresentado."
        },
        {
          "label": "Navegador e dispositivo",
          "text": "O seu navegador web (Chrome, Firefox, Safari, Edge) e tipo de aparelho (Computador, Telemóvel)."
        }
      ]
    },
    "operationalNote": {
      "text": "A Navorika é uma plataforma independente de utilitários online. O correio eletrónico é o nosso canal principal. Para conhecer a nossa metodologia técnica, veja",
      "linkText": "Como funcionam as nossas calculadoras",
      "linkHref": "/methodology"
    }
  },
  "es": {
    "title": "Contacto Navorika – Soporte, Sugerencias e Incidencias",
    "description": "Contacte con Navorika para recibir soporte técnico, comunicar resultados erróneos, dudas de privacidad o proponer nuevas herramientas web.",
    "eyebrow": "Contacto",
    "heroTitle": "Contactar con Navorika",
    "heroDescription": "¿Necesita asistencia con una calculadora, ha detectado un resultado anómalo o desea proponer una nueva herramienta? Envíenos un correo electrónico.",
    "contactCards": {
      "general": {
        "title": "Soporte General y Consultas",
        "description": "Para consultas de uso, resolución de dudas numéricas, incidencias técnicas o sugerencias generales.",
        "email": "admin@navorika.com",
        "buttonText": "Escribir al Soporte"
      },
      "privacy": {
        "title": "Privacidad y Tratamiento de Datos",
        "description": "Para cuestiones vinculadas al tratamiento de información, preferencias de cookies o nuestra política de privacidad.",
        "email": "privacy@navorika.com",
        "buttonText": "Escribir a Privacidad"
      }
    },
    "bugReport": {
      "title": "Informar sobre un Error de Cálculo o Fallo Técnico",
      "intro": "Si el resultado de una calculadora, una conversión o una página no funciona según lo esperado, estos datos nos ayudan a diagnosticar el problema:",
      "items": [
        {
          "label": "URL de la herramienta",
          "text": "La dirección web exacta donde se originó el error (ej.: /tools/roof-pitch-calculator)."
        },
        {
          "label": "Valores introducidos",
          "text": "Los parámetros numéricos concretos, formato de archivo u opciones seleccionadas."
        },
        {
          "label": "Resultado esperado",
          "text": "La cantidad que esperaba obtener conforme a los manuales o normas frente a la mostrada."
        },
        {
          "label": "Navegador y equipo",
          "text": "El navegador utilizado (Chrome, Firefox, Safari, Edge) y el dispositivo (Ordenador, Móvil)."
        }
      ]
    },
    "operationalNote": {
      "text": "Navorika es una plataforma independiente de aplicaciones web gratuitas. El correo electrónico es nuestro canal de contacto principal. Para conocer cómo validamos los cálculos, consulte",
      "linkText": "Cómo funcionan nuestras calculadoras",
      "linkHref": "/methodology"
    }
  },
  "de": {
    "title": "Kontakt zu Navorika – Support, Feedback & Fehlerberichte",
    "description": "Kontaktieren Sie Navorika bei Fragen zu Rechnern, Dateitools, Berechnungsfehlern, Datenschutzanfragen oder Vorschlägen für neue Werkzeuge.",
    "eyebrow": "Kontakt Aufnehmen",
    "heroTitle": "Kontakt zu Navorika",
    "heroDescription": "Benötigen Sie Hilfe zu einem Werkzeug, haben Sie eine Rechenabweichung festgestellt oder möchten Sie ein neues Tool vorschlagen? Schreiben Sie uns eine E-Mail.",
    "contactCards": {
      "general": {
        "title": "Allgemeine Hilfe & Feedback",
        "description": "Für Werkzeughilfe, Feedback, Fragen zu Berechnungsformeln, Fehlerberichte oder allgemeine Anfragen.",
        "email": "admin@navorika.com",
        "buttonText": "Support-E-Mail senden"
      },
      "privacy": {
        "title": "Datenschutz & Datenanfragen",
        "description": "Für Fragen zur Datenverarbeitung, zu Werberichtlinien oder zu unserer Datenschutzerklärung.",
        "email": "privacy@navorika.com",
        "buttonText": "Datenschutz-Team kontaktieren"
      }
    },
    "bugReport": {
      "title": "Berechnungsfehler oder technisches Problem melden",
      "intro": "Sollte ein Rechenergebnis, eine Dateikonvertierung oder eine Werkzeugseite nicht wie erwartet funktionieren, helfen uns folgende Angaben bei der Prüfung:",
      "items": [
        {
          "label": "Werkzeug-URL",
          "text": "Die genaue Seitenadresse, auf der das Problem auftrat (z. B. /tools/roof-pitch-calculator)."
        },
        {
          "label": "Eingegebene Werte",
          "text": "Die konkreten numerischen Eingaben, Dateiformate oder ausgewählten Optionen."
        },
        {
          "label": "Erwartetes Ergebnis",
          "text": "Welches Ergebnis Sie anhand von Referenzstandards erwartet haben im Vergleich zum angezeigten Wert."
        },
        {
          "label": "Browser & Gerät",
          "text": "Ihr Webbrowser (Chrome, Firefox, Safari, Edge) und Gerätetyp (Desktop, Smartphone)."
        }
      ]
    },
    "operationalNote": {
      "text": "Navorika ist eine unabhängige Plattform für Online-Werkzeuge. E-Mail ist unser primärer Supportkanal. Erfahren Sie mehr über unsere Prüfstandards in",
      "linkText": "So funktionieren unsere Rechner",
      "linkHref": "/methodology"
    }
  },
  "ru": {
    "title": "Связаться с Navorika – Поддержка, отзывы и сообщения об ошибках",
    "description": "Свяжитесь с Navorika по вопросам работы калькуляторов, неточных результатов, конфиденциальности или с идеями новых онлайн-инструментов.",
    "eyebrow": "Обратная связь",
    "heroTitle": "Контакты Navorika",
    "heroDescription": "Нужна помощь по калькулятору или конвертеру файлов, заметили ошибку в вычислениях или есть идея нового инструмента? Напишите нам письмо.",
    "contactCards": {
      "general": {
        "title": "Общая поддержка и предложения",
        "description": "По вопросам работы инструментов, расчетных формул, сообщений об ошибках и общих предложений.",
        "email": "admin@navorika.com",
        "buttonText": "Написать в службу поддержки"
      },
      "privacy": {
        "title": "Вопросы конфиденциальности данных",
        "description": "По вопросам обработки информации, рекламных уведомлений или нашей политики конфиденциальности.",
        "email": "privacy@navorika.com",
        "buttonText": "Написать по вопросам данных"
      }
    },
    "bugReport": {
      "title": "Сообщить о неточном расчете или технической проблеме",
      "intro": "Если результат калькулятора, конвертация файла или страница работают некорректно, следующие детали помогут нам быстро устранить проблему:",
      "items": [
        {
          "label": "URL инструмента",
          "text": "Точный адрес страницы, на которой возникла неполадка (например, /tools/roof-pitch-calculator)."
        },
        {
          "label": "Введенные данные",
          "text": "Конкретные числовые параметры, выбранные опции или типы обрабатываемых файлов."
        },
        {
          "label": "Ожидаемый результат",
          "text": "Какое значение вы ожидали получить по формулам или стандартам в сравнении с отображенным."
        },
        {
          "label": "Браузер и устройство",
          "text": "Ваш веб-браузер (Chrome, Firefox, Safari, Edge) и тип устройства (ПК, планшет, телефон)."
        }
      ]
    },
    "operationalNote": {
      "text": "Navorika — независимый онлайн-сервис инструментов. Электронная почта является нашим основным каналом связи. Узнать о принципах тестирования можно в документе",
      "linkText": "Как работают наши калькуляторы",
      "linkHref": "/methodology"
    }
  },
  "ar": {
    "title": "الاتصال بـ Navorika – الدعم الفني والملاحظات وبلاغات الأخطاء",
    "description": "تواصل مع فريق Navorika للحصول على مساعدة في استخدام الأدوات، أو الإبلاغ عن نتيجة غير دقيقة، أو استفسارات الخصوصية، أو اقتراح أدوات جديدة.",
    "eyebrow": "تواصل معنا",
    "heroTitle": "الاتصال بفريق Navorika",
    "heroDescription": "هل تحتاج إلى مساعدة في استخدام إحدى الآلات الحاسبة، أو لاحظت نتيجة حسابية غير دقيقة، أو لديك فكرة لأداة جديدة؟ يسعدنا تواصلك معنا عبر البريد الإلكتروني.",
    "contactCards": {
      "general": {
        "title": "الدعم العام والملاحظات",
        "description": "للمساعدة في استخدام الأدوات، والاستفسارات الحسابية، والإبلاغ عن الأخطاء البرمجية، والاقتراحات العامة.",
        "email": "admin@navorika.com",
        "buttonText": "مراسلة الدعم الفني"
      },
      "privacy": {
        "title": "استفسارات الخصوصية والبيانات",
        "description": "للأسئلة المتعلقة بمعالجة البيانات، أو الإفصاحات الإعلانية، أو سياسة الخصوصية الخاصة بنا.",
        "email": "privacy@navorika.com",
        "buttonText": "مراسلة فريق الخصوصية"
      }
    },
    "bugReport": {
      "title": "الإبلاغ عن خطأ في الحسابات أو مشكلة تقنية",
      "intro": "إذا كانت إحدى الآلات الحاسبة أو أدوات التحويل لا تعمل بالشكل المتوقع، فإن هذه التفاصيل تساعدنا في التحقق السريع من المشكلة وحلها:",
      "items": [
        {
          "label": "رابط الأداة",
          "text": "عنوان الصفحة الدقيق الذي ظهرت فيه المشكلة (مثال: /tools/roof-pitch-calculator)."
        },
        {
          "label": "القيم المدخلة",
          "text": "القيم الرقمية المحددة، أو نوع الملف، أو الخيارات التي قمت بتحديدها."
        },
        {
          "label": "النتيجة المتوقعة",
          "text": "النتيجة التي كنت تتوقع الحصول عليها بناءً على المعايير المرجعية مقارنة بما ظهر على الشاشة."
        },
        {
          "label": "المتصفح ونوع الجهاز",
          "text": "متصفح الإنترنت المستخدم (Chrome, Firefox, Safari, Edge) ونوع جهازك (كمبيوتر مكتبي، هاتف)."
        }
      ]
    },
    "operationalNote": {
      "text": "منصة Navorika موقع مستقل للأدوات والحاسبات المجانية. البريد الإلكتروني هو قناة الدعم الأساسية لدينا. للتعرف على معايير الاختبار الحسابي، راجع",
      "linkText": "منهجية عمل حاسباتنا",
      "linkHref": "/methodology"
    }
  }
};

export const privacyContent: Record<Locale | 'en', TrustPageContent> = {
  "en": {
    "title": "Privacy Policy – Navorika",
    "description": "How Navorika handles local tool processing, live external data, contact submissions, advertising, analytics, and browser preferences.",
    "eyebrow": "Privacy Commitment",
    "heroTitle": "Privacy Policy",
    "heroDescription": "Our default engineering principle is simple: your data stays on your machine. We do not store your files or sell personal information.",
    "lastUpdatedLabel": "Last updated",
    "lastUpdated": "September 27, 2026",
    "banner": {
      "variant": "emerald",
      "text": "Most tools run in your browser. Tools that need a server or outside data say so on the page."
    },
    "sections": [
      {
        "icon": "shield",
        "title": "How Navorika Handles Your Data",
        "content": "Most Navorika tools process files and calculator inputs directly in your browser. When a tool needs live external data or temporary server processing, the page explains that."
      },
      {
        "icon": "lock",
        "title": "Tool Inputs and Files",
        "content": "For tools designated as browser-local processing, your files and inputs are never uploaded to Navorika servers. Where server processing or external data is required, it is explicitly disclosed:",
        "points": [
          "Browser-local tools process the file or values on your device",
          "Some specialized converters, such as STEP to 3D PDF or certain CorelDRAW-related tools, use temporary server processing. Files are handled in isolated temporary folders and removed after the request finishes",
          "Tools that need current information, such as currency rates, may request data from an external provider identified on the page",
          "Direct correspondence sent via email is processed solely to respond to your inquiry"
        ]
      },
      {
        "icon": "eye",
        "title": "What Happens When You Use a Tool",
        "content": "For tools marked as browser-local:",
        "points": [
          "Files are processed in your browser using normal web technologies",
          "Temporary data stays in browser memory and is cleared when the page or tab is closed or reset",
          "Downloaded results are saved to your device",
          "We do not maintain account databases, user tracking profiles, or persistent server logs of your file contents"
        ]
      },
      {
        "icon": "database",
        "title": "How Browser-Based Processing Works",
        "content": "Different tools use different browser technologies depending on the job:",
        "points": [
          "PDF tools may use browser-based PDF libraries such as pdf-lib and pdf.js",
          "Image tools may use Canvas, ImageData, or WebAssembly in your browser",
          "Calculators run their formulas directly in your browser",
          "Security-related tools may use the browser’s built-in Web Crypto API"
        ]
      },
      {
        "icon": "cookie",
        "title": "Advertising and Cookies",
        "content": "Navorika partners with third-party advertising networks to support our free tools:",
        "points": [
          "Google AdSense: Third-party vendors, including Google, use cookies to serve ads based on a user’s prior visits to this website or other websites on the Internet",
          "Personalized Advertising: Google’s use of advertising cookies enables it and its partners to serve ads to users based on their visits to our site and/or other sites across the web",
          "Opt-Out Choices: You may opt out of personalized advertising by visiting Google Ads Settings (https://www.google.com/settings/ads) or through third-party opt-out services such as www.aboutads.info/choices/",
          "Analytics: Aggregated, anonymized traffic analytics help us understand site usage and improve tool performance without identifying individual users",
          "Local Storage: Browser localStorage is used strictly to remember your preferences (such as light or dark display mode) and does not contain personal identifying information"
        ]
      }
    ],
    "footerNote": {
      "text": "Questions about our privacy policy? Use the",
      "linkText": "contact page",
      "linkHref": "/contact"
    }
  },
  "fr": {
    "title": "Politique de Confidentialité – Navorika",
    "description": "Découvrez comment Navorika gère le traitement local, les données externes, la publicité, les cookies, les outils de mesure d'audience et vos préférences.",
    "eyebrow": "Engagement de Confidentialité",
    "heroTitle": "Politique de Confidentialité",
    "heroDescription": "Notre principe d'ingénierie est clair : vos données restent sur votre appareil. Nous ne stockons pas vos fichiers et ne commercialisons aucune donnée personnelle.",
    "lastUpdatedLabel": "Dernière mise à jour",
    "lastUpdated": "27 septembre 2026",
    "banner": {
      "variant": "emerald",
      "text": "La plupart des outils s'exécutent dans votre navigateur. Les outils nécessitant un serveur ou des données externes le précisent sur la page."
    },
    "sections": [
      {
        "icon": "shield",
        "title": "Traitement de vos données par Navorika",
        "content": "La quasi-totalité des outils Navorika traitent vos fichiers et données de calcul directement dans votre navigateur. Lorsqu'un outil fait appel à des données externes ou à un traitement temporaire sur serveur, cela est clairement mentionné sur la page."
      },
      {
        "icon": "lock",
        "title": "Fichiers et données saisies dans les outils",
        "content": "Pour les outils identifiés comme fonctionnant en local dans le navigateur, vos fichiers et valeurs saisies ne sont jamais transférés vers les serveurs de Navorika. Lorsqu'un traitement sur serveur ou des données distantes sont nécessaires, nous l'indiquons sans ambiguïté :",
        "points": [
          "Les outils locaux traitent les fichiers et les paramètres directement sur votre appareil",
          "Certains convertisseurs spécialisés (comme la conversion CAO STEP vers PDF 3D ou certains filtres CorelDRAW) utilisent un traitement temporaire sur serveur. Les fichiers sont manipulés dans des espaces éphémères isolés et supprimés dès l'achèvement de la requête",
          "Les outils nécessitant des données en temps réel, tels que les convertisseurs de devises, peuvent interroger un prestataire externe identifié sur la page",
          "Les correspondances directes envoyées par courriel sont traitées uniquement dans le but de répondre à votre demande"
        ]
      },
      {
        "icon": "eye",
        "title": "Déroulement de l'utilisation d'un outil",
        "content": "Pour les outils conçus pour une exécution locale dans le navigateur :",
        "points": [
          "Les fichiers sont traités dans votre navigateur au moyen des standards web actuels",
          "Les données temporaires résident exclusivement dans la mémoire vive du navigateur et disparaissent à la fermeture ou réinitialisation de l'onglet",
          "Les fichiers convertis ou générés sont téléchargés directement sur votre support de stockage",
          "Nous ne maintenons aucune base de données de comptes, aucun profil de traçage individuel et aucun journal serveur de vos documents"
        ]
      },
      {
        "icon": "database",
        "title": "Fonctionnement technique dans le navigateur",
        "content": "Nos différents outils mobilisent les technologies adaptées à chaque type d'opération :",
        "points": [
          "Les utilitaires PDF exploitent des bibliothèques JavaScript locales telles que pdf-lib et pdf.js",
          "Les outils graphiques s'appuient sur l'élément Canvas, ImageData ou WebAssembly au sein de votre navigateur",
          "Les calculateurs exécutent l'ensemble de leurs formules mathématiques directement sur votre processeur",
          "Les modules cryptographiques et d'identifiants utilisent l'API Web Cryptography native du navigateur"
        ]
      },
      {
        "icon": "cookie",
        "title": "Publicité, témoins (cookies) et stockage local",
        "content": "Navorika collabore avec des régies publicitaires partenaires pour maintenir la gratuité de l'ensemble de ses outils :",
        "points": [
          "Google AdSense : des fournisseurs tiers, dont Google, emploient des cookies pour diffuser des annonces publicitaires adaptées selon les visites antérieures des internautes sur ce site ou d'autres sites web",
          "Publicité personnalisée : l'utilisation de témoins publicitaires permet à Google et à ses partenaires de proposer des annonces ciblées selon la navigation effectuée sur notre plateforme et sur le réseau internet",
          "Options de désactivation (Opt-Out) : vous pouvez désactiver les annonces personnalisées dans les paramètres Google Ads (https://www.google.com/settings/ads) ou par le biais de plateformes d'exclusion sectorielles telles que www.aboutads.info/choices/",
          "Outils d'analyse d'audience : des statistiques globales et anonymisées nous aident à appréhender la fréquentation globale et à perfectionner la fiabilité technique, sans identifier d'utilisateurs particuliers",
          "Stockage local (LocalStorage) : le stockage local de votre navigateur sert exclusivement à conserver vos préférences d'interface (mode clair ou sombre) et ne contient aucune information personnelle nominative"
        ]
      }
    ],
    "footerNote": {
      "text": "Vous avez des questions concernant notre politique de confidentialité ? Consultez notre",
      "linkText": "page de contact",
      "linkHref": "/contact"
    }
  },
  "it": {
    "title": "Informativa sulla Privacy – Navorika",
    "description": "Come Navorika gestisce l'elaborazione locale, i dati esterni, le inserzioni pubblicitarie, i cookie, le statistiche anonime e le preferenze del browser.",
    "eyebrow": "Tutela della Riservatezza",
    "heroTitle": "Informativa sulla Privacy",
    "heroDescription": "Il nostro principio cardine è semplice: i tuoi dati restano sul tuo dispositivo. Non memorizziamo i tuoi file né cediamo informazioni personali a terzi.",
    "lastUpdatedLabel": "Ultimo aggiornamento",
    "lastUpdated": "27 settembre 2026",
    "banner": {
      "variant": "emerald",
      "text": "La maggior parte degli strumenti funziona nel tuo browser. Le utility che richiedono un server o dati esterni lo specificano chiaramente."
    },
    "sections": [
      {
        "icon": "shield",
        "title": "Come Navorika gestisce i tuoi dati",
        "content": "La stragrande maggioranza degli strumenti di Navorika elabora documenti, immagini e valori direttamente all'interno del tuo browser. Qualora un'operazione richieda dati esterni o elaborazione temporanea su server, la pagina lo dichiara esplicitamente."
      },
      {
        "icon": "lock",
        "title": "File e input inseriti nelle utility",
        "content": "Per gli strumenti definiti con elaborazione locale, i tuoi file e i tuoi dati non vengono mai caricati sui server di Navorika. Nei rari casi in cui è necessario l'intervento del server, ciò viene chiarito:",
        "points": [
          "Gli strumenti locali elaborano file e valori numerici direttamente sulla tua macchina",
          "Alcuni convertitori specializzati (come la conversione CAD STEP in PDF 3D o determinati filtri CorelDRAW) si avvalgono di un'elaborazione temporanea su server. I file vengono gestiti in cartelle temporanee isolate e distrutti appena conclusa l'operazione",
          "Gli strumenti che necessitano di informazioni in tempo reale (come i tassi di cambio valutario) interrogano fornitori esterni esplicitamente indicati nella pagina",
          "Le comunicazioni inviate tramite posta elettronica sono trattate unicamente per rispondere ai tuoi quesiti"
        ]
      },
      {
        "icon": "eye",
        "title": "Cosa avviene quando utilizzi uno strumento",
        "content": "Per tutti gli strumenti contrassegnati con elaborazione locale nel browser:",
        "points": [
          "I file vengono manipolati nel browser mediante tecnologie web standard e sicure",
          "I dati di calcolo risiedono temporaneamente nella memoria RAM del browser e vengono cancellati chiudendo la scheda o ricaricando la pagina",
          "I risultati esportati e scaricati vengono salvati unicamente sul tuo disco locale",
          "Non gestiamo database di utenti, profili comportamentali né registri persistenti dei contenuti elaborati"
        ]
      },
      {
        "icon": "database",
        "title": "Funzionamento dell'elaborazione nel browser",
        "content": "I nostri strumenti impiegano componenti client-side dedicati alla specifica funzione richiesta:",
        "points": [
          "Le utility PDF utilizzano librerie JavaScript locali come pdf-lib e pdf.js",
          "Gli strumenti grafici impiegano elementi Canvas, ImageData e WebAssembly direttamente nel browser",
          "I calcolatori finanziari e tecnici eseguono le formule interamente sul tuo processore",
          "Gli strumenti di sicurezza informatica utilizzano l'API crittografica Web Crypto integrata nel browser"
        ]
      },
      {
        "icon": "cookie",
        "title": "Pubblicità, cookie e memorizzazione locale",
        "content": "Navorika collabora con circuiti pubblicitari terzi per sostenere la gratuità e l'accessibilità dei propri strumenti:",
        "points": [
          "Google AdSense: fornitori terzi, tra cui Google, utilizzano cookie per pubblicare annunci basati sulle precedenti visite dell'utente su questo o su altri siti web",
          "Pubblicità personalizzata: l'uso dei cookie pubblicitari consente a Google e ai suoi partner di mostrare annunci pertinenti in base alla navigazione sui nostri contenuti e sul web",
          "Disattivazione (Opt-Out): puoi disattivare la personalizzazione degli annunci visitando le Impostazioni annunci di Google (https://www.google.com/settings/ads) o mediante portali di settore come www.aboutads.info/choices/",
          "Dati statistici (Analytics): utilizziamo metriche aggregate e anonime per monitorare l'efficienza della piattaforma e il carico dei server senza identificare i singoli utenti",
          "Archiviazione locale (LocalStorage): la memoria localStorage del browser viene impiegata esclusivamente per memorizzare le preferenze dell'interfaccia (come il tema chiaro o scuro) e non contiene dati identificativi"
        ]
      }
    ],
    "footerNote": {
      "text": "Hai domande sulla nostra politica di riservatezza? Utilizza la",
      "linkText": "pagina dei contatti",
      "linkHref": "/contact"
    }
  },
  "pt": {
    "title": "Política de Privacidade – Navorika",
    "description": "Como a Navorika lida com processamento local, dados externos, publicidade, cookies, métricas de tráfego e armazenamento de preferências.",
    "eyebrow": "Compromisso de Privacidade",
    "heroTitle": "Política de Privacidade",
    "heroDescription": "O nosso princípio arquitetural é direto: os seus dados permanecem no seu computador. Não guardamos os seus ficheiros nem comercializamos informações pessoais.",
    "lastUpdatedLabel": "Última atualização",
    "lastUpdated": "27 de setembro de 2026",
    "banner": {
      "variant": "emerald",
      "text": "A maioria das ferramentas executa no seu navegador. Os utilitários que requerem servidor ou dados externos indicam-no na página."
    },
    "sections": [
      {
        "icon": "shield",
        "title": "Como a Navorika gere os seus dados",
        "content": "A quase totalidade das calculadoras e conversores da Navorika processa ficheiros e parâmetros diretamente no seu navegador. Caso uma ferramenta dependa de dados externos em tempo real ou de processamento temporário num servidor, a página explica detalhadamente esse funcionamento."
      },
      {
        "icon": "lock",
        "title": "Ficheiros e entradas nas ferramentas",
        "content": "Nas ferramentas indicadas como locais no navegador, os seus ficheiros e cálculos nunca são enviados para os servidores da Navorika. Onde for indispensável processamento remoto ou consulta de dados externos, isso é formalmente informado:",
        "points": [
          "As ferramentas locais manipulam ficheiros e valores diretamente no seu dispositivo",
          "Alguns conversores técnicos avançados (como STEP para PDF 3D ou determinados filtros CorelDRAW) utilizam processamento temporário em servidor. Os ficheiros são acolhidos em diretórios efémeros isolados e eliminados assim que a operação termina",
          "Ferramentas que necessitam de cotações atualizadas, como conversores de moedas, consultam serviços externos identificados na interface",
          "Mensagens enviadas diretamente por correio eletrónico são utilizadas estritamente para responder à sua questão"
        ]
      },
      {
        "icon": "eye",
        "title": "O que acontece ao usar uma ferramenta",
        "content": "Para as ferramentas concebidas com processamento local no navegador:",
        "points": [
          "Os ficheiros são tratados no seu navegador com tecnologias padronizadas da web moderna",
          "A informação temporária permanece apenas na memória volátil do navegador e é apagada ao fechar ou atualizar o separador",
          "Os ficheiros resultantes descarregados são gravados diretamente no seu disco",
          "Não mantemos registos de contas de utilizador, perfis de monitorização comportamental nem arquivos persistentes dos seus documentos"
        ]
      },
      {
        "icon": "database",
        "title": "Como funciona o processamento no navegador",
        "content": "Diferentes ferramentas mobilizam os recursos adequados do ambiente web:",
        "points": [
          "As ferramentas de PDF utilizam bibliotecas executadas no navegador, tais como pdf-lib e pdf.js",
          "Os utilitários de imagem recorrem a Canvas, ImageData ou WebAssembly localmente",
          "As calculadoras processam todas as fórmulas diretamente no seu processador",
          "Utilitários criptográficos utilizam a API nativa Web Cryptography integrada no navegador"
        ]
      },
      {
        "icon": "cookie",
        "title": "Publicidade, cookies e armazenamento local",
        "content": "A Navorika colabora com redes de publicidade de terceiros para garantir a gratuitidade de todas as ferramentas:",
        "points": [
          "Google AdSense: fornecedores terceiros, incluindo a Google, utilizam cookies para veicular anúncios com base nas visitas anteriores do utilizador a este ou a outros websites",
          "Publicidade personalizada: a utilização de cookies de publicidade permite à Google e aos seus parceiros apresentar anúncios direcionados com base na navegação no nosso site e noutros sítios da web",
          "Opções de desativação (Opt-Out): pode desativar anúncios personalizados acedendo às Definições de Anúncios Google (https://www.google.com/settings/ads) ou através de serviços setoriais como www.aboutads.info/choices/",
          "Análise estatística (Analytics): métricas de tráfego agregadas e anónimas ajudam-nos a compreender a utilização da plataforma e a otimizar a velocidade dos utilitários sem identificar utilizadores individuais",
          "Armazenamento local (LocalStorage): o recurso localStorage do navegador é empregue unicamente para memorizar as suas preferências visuais (como o modo claro ou escuro), não contendo quaisquer dados pessoais"
        ]
      }
    ],
    "footerNote": {
      "text": "Dúvidas sobre a nossa política de privacidade? Consulte a",
      "linkText": "página de contacto",
      "linkHref": "/contact"
    }
  },
  "es": {
    "title": "Política de Privacidad – Navorika",
    "description": "Conozca cómo Navorika gestiona el procesamiento local en el navegador, datos externos, publicidad, cookies, analítica y preferencias de usuario.",
    "eyebrow": "Compromiso de Privacidad",
    "heroTitle": "Política de Privacidad",
    "heroDescription": "Nuestro principio de diseño es fundamental: sus datos permanecen en su propio dispositivo. No almacenamos sus archivos ni vendemos información personal.",
    "lastUpdatedLabel": "Última actualización",
    "lastUpdated": "27 de septiembre de 2026",
    "banner": {
      "variant": "emerald",
      "text": "La mayoría de herramientas se ejecutan en su navegador. Las que requieren servidor o datos externos lo especifican en la página."
    },
    "sections": [
      {
        "icon": "shield",
        "title": "Cómo gestiona Navorika sus datos",
        "content": "La gran mayoría de las calculadoras y utilidades de Navorika procesan sus archivos y valores numéricos directamente en su navegador web. Cuando una herramienta necesita datos externos o procesamiento temporal en servidor, la página lo advierte con claridad."
      },
      {
        "icon": "lock",
        "title": "Archivos y datos introducidos en las herramientas",
        "content": "En las herramientas marcadas para procesamiento local en el navegador, sus archivos y entradas nunca se transfieren a los servidores de Navorika. Cuando resulta indispensable recurrir a procesamiento en servidor o fuentes externas, se explica detalladamente:",
        "points": [
          "Las herramientas locales procesan el archivo o los valores exclusivamente en su equipo",
          "Ciertos conversores especializados (como STEP a PDF 3D o filtros de CorelDRAW) emplean procesamiento temporal en servidor. Los archivos se gestionan en carpetas temporales aisladas y se borran inmediatamente tras finalizar la solicitud",
          "Las utilidades que precisan datos actualizados, como los tipos de cambio de divisas, pueden solicitar información a un proveedor externo identificado en la interfaz",
          "Las consultas enviadas por correo electrónico se procesan con el único propósito de responder a su solicitud"
        ]
      },
      {
        "icon": "eye",
        "title": "Qué sucede al utilizar una herramienta",
        "content": "Para las herramientas diseñadas para ejecución local en el navegador:",
        "points": [
          "Los documentos se procesan en su navegador mediante estándares abiertos de la web",
          "Los datos temporales se mantienen en la memoria RAM del navegador y se eliminan al cerrar o recargar la pestaña",
          "Los resultados descargados se guardan directamente en el almacenamiento de su ordenador o teléfono",
          "No disponemos de bases de datos de cuentas, perfiles de seguimiento ni registros permanentes del contenido de sus archivos"
        ]
      },
      {
        "icon": "database",
        "title": "Cómo funciona el procesamiento en el navegador",
        "content": "Nuestras utilidades emplean diferentes tecnologías según la naturaleza de la tarea:",
        "points": [
          "Las herramientas PDF utilizan bibliotecas JavaScript que operan localmente, tales como pdf-lib y pdf.js",
          "Los conversores gráficos aprovechan elementos Canvas, ImageData o WebAssembly directamente en su navegador",
          "Las calculadoras financieras y técnicas calculan sus resultados en el procesador de su dispositivo",
          "Las funciones de seguridad y claves criptográficas utilizan la API Web Cryptography incorporada en el navegador"
        ]
      },
      {
        "icon": "cookie",
        "title": "Publicidad, cookies y almacenamiento local",
        "content": "Navorika colabora con redes publicitarias de terceros para mantener el acceso gratuito a todas sus herramientas:",
        "points": [
          "Google AdSense: proveedores externos, incluido Google, utilizan cookies para mostrar anuncios basados en las visitas previas del usuario a este u otros sitios web",
          "Publicidad personalizada: el uso de cookies publicitarias permite a Google y a sus socios presentar anuncios orientados en función de la navegación en nuestro sitio y en internet",
          "Opciones de exclusión (Opt-Out): puede inhabilitar la publicidad personalizada en la Configuración de anuncios de Google (https://www.google.com/settings/ads) o a través de servicios sectoriales como www.aboutads.info/choices/",
          "Analítica y métricas de uso: recopilamos estadísticas de tráfico anónimas y agregadas que nos permiten supervisar el rendimiento técnico sin identificar a usuarios particulares",
          "Almacenamiento local (LocalStorage): la memoria localStorage del navegador se usa únicamente para recordar preferencias de interfaz (como el tema claro u oscuro) y no almacena información de identificación personal"
        ]
      }
    ],
    "footerNote": {
      "text": "¿Preguntas sobre nuestra política de privacidad? Visite la",
      "linkText": "página de contacto",
      "linkHref": "/contact"
    }
  },
  "de": {
    "title": "Datenschutzerklärung – Navorika",
    "description": "Erfahren Sie, wie Navorika lokale Browser-Verarbeitung, externe Schnittstellen, Werbung, Cookies, Analysedaten und Benutzereinstellungen handhabt.",
    "eyebrow": "Datenschutzverpflichtung",
    "heroTitle": "Datenschutzerklärung",
    "heroDescription": "Unser grundlegendes Entwicklungsprinzip ist einfach: Ihre Daten verbleiben auf Ihrem Gerät. Wir speichern keine Ihrer Dateien und verkaufen keine personenbezogenen Informationen.",
    "lastUpdatedLabel": "Zuletzt aktualisiert",
    "lastUpdated": "27. September 2026",
    "banner": {
      "variant": "emerald",
      "text": "Die meisten Werkzeuge laufen direkt in Ihrem Browser. Werkzeuge, die einen Server oder externe Daten benötigen, weisen darauf hin."
    },
    "sections": [
      {
        "icon": "shield",
        "title": "Wie Navorika mit Ihren Daten umgeht",
        "content": "Die überwiegende Mehrheit der Navorika-Werkzeuge verarbeitet Dateien und Berechnungseingaben unmittelbar in Ihrem Webbrowser. Falls ein Werkzeug auf externe Live-Daten oder temporäre Serververarbeitung angewiesen ist, wird dies auf der jeweiligen Seite explizit erläutert."
      },
      {
        "icon": "lock",
        "title": "Dateien und Eingabewerte in den Werkzeugen",
        "content": "Bei Werkzeugen mit lokaler Browser-Verarbeitung werden Ihre Dokumente und Eingaben niemals auf Navorika-Server hochgeladen. Wo serverseitige Aufgaben oder externe Abfragen unvermeidlich sind, wird dies transparent offengelegt:",
        "points": [
          "Lokale Browser-Werkzeuge verarbeiten die Datei oder Werte vollständig auf Ihrem Endgerät",
          "Einzelne Spezialkonverter (wie STEP zu 3D-PDF oder bestimmte CorelDRAW-Filter) nutzen eine temporäre Serververarbeitung. Dateien werden in isolierten temporären Verzeichnissen gehalten und unmittelbar nach Beendigung der Anfrage gelöscht",
          "Werkzeuge mit aktuellem Informationsbedarf (wie Währungsumrechner) können Daten bei einem auf der Seite benannten externen Anbieter anfordern",
          "E-Mails, die Sie direkt an uns senden, werden ausschließlich zur Beantwortung Ihres Anliegens verarbeitet"
        ]
      },
      {
        "icon": "eye",
        "title": "Was bei der Nutzung eines Werkzeugs geschieht",
        "content": "Für Werkzeuge mit lokaler Browser-Verarbeitung gilt:",
        "points": [
          "Dateien werden im Browser über moderne Webtechnologien verarbeitet",
          "Temporäre Daten verbleiben im flüchtigen Arbeitsspeicher des Browsers und werden beim Schließen oder Zurücksetzen des Tabs vollständig gelöscht",
          "Heruntergeladene Ergebnisse werden direkt auf Ihrem Endgerät gesichert",
          "Wir führen keine Benutzerdatenbanken, keine Nutzertracking-Profile und keine dauerhaften Server-Protokolle Ihrer Dateiinhalte"
        ]
      },
      {
        "icon": "database",
        "title": "Funktionsweise der browserbasierten Verarbeitung",
        "content": "Je nach Aufgabengebiet kommen spezialisierte Browser-Technologien zum Einsatz:",
        "points": [
          "PDF-Werkzeuge nutzen clientseitige Bibliotheken wie pdf-lib und pdf.js",
          "Bildwerkzeuge verarbeiten Bilddaten mittels Canvas, ImageData oder WebAssembly direkt im Browser",
          "Rechner führen mathematische Formeln unmittelbar auf Ihrem Prozessor aus",
          "Sicherheits- und Kryptowerkzeuge nutzen die integrierte Web Cryptography API des Browsers"
        ]
      },
      {
        "icon": "cookie",
        "title": "Werbung, Cookies und lokaler Speicher",
        "content": "Navorika kooperiert mit externen Werbenetzwerken, um die kostenlose Bereitstellung aller Werkzeuge zu finanzieren:",
        "points": [
          "Google AdSense: Drittanbieter einschließlich Google verwenden Cookies zur Schaltung von Anzeigen auf Grundlage vorheriger Besuche auf dieser oder anderen Websites",
          "Personalisierte Werbung: Durch den Einsatz von Werbe-Cookies können Google und seine Partner zielgerichtete Werbeanzeigen anhand des Surfverhaltens auf unseren und anderen Internetseiten einblenden",
          "Opt-Out-Möglichkeiten: Sie können personalisierte Werbung in den Google-Anzeigeneinstellungen (https://www.google.com/settings/ads) oder über branchenweite Deaktivierungsdienste wie www.aboutads.info/choices/ abschalten",
          "Reichweitenanalyse: Aggregierte, anonymisierte Verkehrsdaten helfen uns, die Auslastung der Plattform zu analysieren und die Werkzeuge zu verbessern, ohne Rückschlüsse auf Einzelpersonen zu ziehen",
          "Lokaler Speicher (LocalStorage): Der Browserspeicher localStorage wird ausschließlich zur Speicherung Ihrer Oberflächenpräferenzen (helles oder dunkles Design) genutzt und enthält keine personenidentifizierbaren Daten"
        ]
      }
    ],
    "footerNote": {
      "text": "Haben Sie Fragen zu unseren Datenschutzrichtlinien? Nutzen Sie unsere",
      "linkText": "Kontaktseite",
      "linkHref": "/contact"
    }
  },
  "ru": {
    "title": "Политика конфиденциальности – Navorika",
    "description": "Как Navorika обрабатывает данные в браузере, использует внешние API, отображает рекламу, применяет файлы cookie, аналитику и локальное хранилище.",
    "eyebrow": "Защита данных",
    "heroTitle": "Политика конфиденциальности",
    "heroDescription": "Наш инженерный принцип прост: ваши данные остаются на вашем устройстве. Мы не сохраняем ваши файлы на серверах и не продаем персональную информацию.",
    "lastUpdatedLabel": "Последнее обновление",
    "lastUpdated": "27 сентября 2026 г.",
    "banner": {
      "variant": "emerald",
      "text": "Большинство инструментов работают в вашем браузере. Если инструменту требуется сервер или внешние данные, это указано на странице."
    },
    "sections": [
      {
        "icon": "shield",
        "title": "Как Navorika обрабатывает ваши данные",
        "content": "Подавляющее большинство онлайн-инструментов и калькуляторов Navorika обрабатывают файлы и числовые значения непосредственно в вашем веб-браузере. Если для задачи требуются внешние данные или временная серверная обработка, об этом открыто сообщается на странице инструмента."
      },
      {
        "icon": "lock",
        "title": "Входные данные и файлы в инструментах",
        "content": "Для инструментов с локальной обработкой в браузере ваши документы и данные никогда не загружаются на серверы Navorika. В тех случаях, когда требуется серверное преобразование или внешние источники, это прямо указывается:",
        "points": [
          "Локальные инструменты обрабатывают файл или параметры строго на вашем устройстве",
          "Некоторые специализированные конвертеры (например, STEP в 3D PDF или ряд фильтров CorelDRAW) задействуют временную серверную обработку. Файлы помещаются в изолированные временные папки и удаляются сразу после завершения запроса",
          "Инструменты, требующие свежих данных (например, конвертер валют), запрашивают информацию у внешнего поставщика, указанного на странице",
          "Прямые сообщения, отправленные по электронной почте, обрабатываются исключительно для ответа на ваше обращение"
        ]
      },
      {
        "icon": "eye",
        "title": "Что происходит при использовании инструмента",
        "content": "Для всех инструментов, выполняемых локально в браузере:",
        "points": [
          "Файлы обрабатываются в веб-браузере с использованием стандартных безопасных веб-технологий",
          "Временные данные хранятся только в оперативной памяти браузера и очищаются при закрытии или перезагрузке вкладки",
          "Загружаемые результаты сохраняются непосредственно на диск вашего устройства",
          "Мы не ведем базы пользовательских аккаунтов, не создаем профилей слежения и не сохраняем постоянных серверных логов содержимого файлов"
        ]
      },
      {
        "icon": "database",
        "title": "Как устроена обработка данных в браузере",
        "content": "Разные инструменты используют специализированные клиентские технологии в зависимости от задачи:",
        "points": [
          "Инструменты для работы с PDF используют клиентские библиотеки, такие как pdf-lib и pdf.js",
          "Графические редакторы задействуют Canvas, ImageData или модули WebAssembly на вашем устройстве",
          "Калькуляторы выполняют вычисления математических формул непосредственно на вашем процессоре",
          "Утилиты информационной безопасности применяют встроенный стандартный интерфейс браузера Web Cryptography API"
        ]
      },
      {
        "icon": "cookie",
        "title": "Реклама, файлы cookie и локальное хранилище",
        "content": "Navorika сотрудничает со сторонними рекламными сетями для поддержания бесплатного доступа ко всем онлайн-сервисам:",
        "points": [
          "Google AdSense: сторонние поставщики, включая Google, используют файлы cookie для показа объявлений с учетом предыдущих посещений этого или других сайтов в сети",
          "Персонализированная реклама: рекламные файлы cookie позволяют Google и партнерам показывать релевантные объявления на основе истории переходов на нашем ресурсе и в интернете",
          "Отказ от персонализации (Opt-Out): вы можете отключить персонализированный показ рекламы в настройках рекламных предпочтений Google (https://www.google.com/settings/ads) или через сервис www.aboutads.info/choices/",
          "Веб-аналитика: агрегированные и обезличенные данные о посещаемости помогают нам отслеживать техническую стабильность и нагрузку без идентификации конкретных пользователей",
          "Локальное хранилище (LocalStorage): хранилище localStorage в браузере используется исключительно для запоминания параметров интерфейса (светлая или темная тема) и не содержит персональных идентификаторов"
        ]
      }
    ],
    "footerNote": {
      "text": "Остались вопросы по нашей политике конфиденциальности? Перейдите на",
      "linkText": "страницу контактов",
      "linkHref": "/contact"
    }
  },
  "ar": {
    "title": "سياسة الخصوصية – Navorika",
    "description": "تعرف على كيفية تعامل Navorika مع المعالجة المحلية في المتصفح، والبيانات الخارجية، والإعلانات، وملفات تعريف الارتباط، والتحليلات وتفضيلات العرض.",
    "eyebrow": "التزام الخصوصية",
    "heroTitle": "سياسة الخصوصية",
    "heroDescription": "مبدأنا الهندسي الأساسي واضح وبسيط: بياناتك تبقى على جهازك. نحن لا نخزن ملفاتك ولا نبيع معلوماتك الشخصية لأي طرف ثالث.",
    "lastUpdatedLabel": "آخر تحديث",
    "lastUpdated": "27 سبتمبر 2026",
    "banner": {
      "variant": "emerald",
      "text": "معظم الأدوات تعمل مباشرة داخل متصفحك. الأدوات التي تحتاج إلى خادم أو بيانات خارجية توضح ذلك في الصفحة."
    },
    "sections": [
      {
        "icon": "shield",
        "title": "كيف تتعامل Navorika مع بياناتك",
        "content": "تتم معالجة الغالبية العظمى من ملفاتك ومدخلاتك الحسابية محلياً داخل متصفح الإنترنت الخاص بك. عندما تتطلب أداة معينة بيانات خارجية حية أو معالجة مؤقتة عبر خادم، يتم توضيح ذلك بوضوح تام على الصفحة."
      },
      {
        "icon": "lock",
        "title": "ملفاتك ومدخلاتك في الأدوات",
        "content": "بالنسبة للأدوات المصنفة كمعالجة محلية، لا يتم رفع ملفاتك أو قيمك إلى خوادم Navorika على الإطلاق. وعندما يتطلب الأمر معالجة عبر خادم أو بيانات خارجية، يتم الإفصاح عن ذلك بالتفصيل:",
        "points": [
          "الأدوات المحلية تعالج الملفات أو القيم بالكامل على جهازك الشخصي",
          "تستخدم بعض المحولات المتخصصة (مثل تحويل STEP إلى PDF ثلاثي الأبعاد أو بعض مرشحات CorelDRAW) معالجة مؤقتة على الخادم. يتم التعامل مع الملفات داخل مجلدات مؤقتة معزولة وتُحذف فور اكتمال الطلب",
          "الأدوات التي تتطلب معلومات حية ومحدثة، مثل أسعار صرف العملات، قد تطلب البيانات من مزود خارجي موضح في الصفحة",
          "المراسلات المباشرة عبر البريد الإلكتروني تتم معالجتها فقط للرد على استفسارك ومساعدتك"
        ]
      },
      {
        "icon": "eye",
        "title": "ماذا يحدث عند استخدامك لأي أداة",
        "content": "بالنسبة للأدوات التي تعمل محلياً داخل المتصفح:",
        "points": [
          "تتم معالجة الملفات في متصفحك باستخدام تقنيات الويب القياسية والآمنة",
          "تبقى البيانات المؤقتة في ذاكرة المتصفح العشوائية وتُمحى بالكامل بمجرد إغلاق علامة التبويب أو إعادة تعيينها",
          "النتائج التي تقوم بتنزيلها تُحفظ مباشرة على القرص المحلي لجهازك",
          "نحن لا نحتفظ بقواعد بيانات للمستخدمين، ولا ننشئ ملفات تتبع شخصية، ولا نحتفظ بسجلات خادم دائمة لمحتويات ملفاتك"
        ]
      },
      {
        "icon": "database",
        "title": "كيف تعمل المعالجة داخل المتصفح",
        "content": "تعتمد الأدوات المختلفة على تقنيات متصفح متقدمة وفقاً لنوع المهمة:",
        "points": [
          "تستخدم أدوات المستندات مكتبات برمجية تعمل داخل المتصفح مثل pdf-lib وpdf.js",
          "تستخدم أدوات الصور تقنيات Canvas وImageData أو تجميع WebAssembly على جهازك",
          "تنفذ الآلات الحاسبة معادلاتها الحسابية مباشرة على معالج جهازك",
          "تعتمد أدوات الأمان والمفاتيح البرمجية على واجهة Web Cryptography API المدمجة أصلاً في المتصفح"
        ]
      },
      {
        "icon": "cookie",
        "title": "الإعلانات، ملفات تعريف الارتباط والتخزين المحلي",
        "content": "شراكتنا مع شبكات إعلانية موثوقة تتيح لنا تقديم جميع أدوات الموقع مجاناً لجميع المستخدمين:",
        "points": [
          "Google AdSense: يستخدم موردو الجهات الخارجية، بما في ذلك Google، ملفات تعريف الارتباط لعرض الإعلانات بناءً على زيارات المستخدم السابقة لهذا الموقع أو لمواقع أخرى على الإنترنت",
          "الإعلانات المخصصة: يتيح استخدام ملفات تعريف الارتباط الإعلانية لشركة Google وشركائها تقديم إعلانات ملائمة للمستخدمين بناءً على تصفحهم لموقعنا ومواقع أخرى عبر الويب",
          "خيارات إلغاء الاشتراك (Opt-Out): يمكنك إلغاء الاشتراك في الإعلانات المخصصة عبر زيارة إعدادات إعلانات Google (https://www.google.com/settings/ads) أو عبر خدمات مثل www.aboutads.info/choices/",
          "تحليلات الاستخدام: تساعدنا الإحصائيات المجمعة ومجهولة المصدر في فهم أداء الموقع وتحسين سرعة الأدوات دون تحديد هوية أي مستخدم",
          "التخزين المحلي (LocalStorage): يُستخدم التخزين المحلي في المتصفح حصرياً لتذكر تفضيلات العرض (مثل الوضع الداكن أو الفاتح) ولا يحتوي على أي بيانات تعريف شخصية"
        ]
      }
    ],
    "footerNote": {
      "text": "هل لديك استفسارات حول سياسة الخصوصية الخاصة بنا؟ يرجى استخدام",
      "linkText": "صفحة الاتصال بنا",
      "linkHref": "/contact"
    }
  }
};

export const termsContent: Record<Locale | 'en', TrustPageContent> = {
  "en": {
    "title": "Terms of Service – Navorika",
    "description": "Terms and conditions governing the use of Navorika calculators, document utilities, and browser-based software tools.",
    "eyebrow": "Legal Terms",
    "heroTitle": "Terms of Service",
    "heroDescription": "Please review the terms and conditions that govern your access to and use of the Navorika platform and online utilities.",
    "lastUpdatedLabel": "Last updated",
    "lastUpdated": "September 27, 2026",
    "banner": {
      "variant": "indigo",
      "text": "Navorika tools are free to use. These terms explain ownership, acceptable use, and important limitations."
    },
    "sections": [
      {
        "icon": "scale",
        "title": "1. Agreement to Terms",
        "content": "By accessing or using Navorika (navorika.com), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site."
      },
      {
        "icon": "fileText",
        "title": "2. Description of Service",
        "content": "Navorika provides free online calculators, file tools, converters, and developer utilities. Most tools run directly in your browser. A small number of specialized conversions use temporary server processing."
      },
      {
        "icon": "shield",
        "title": "3. Intellectual Property and User Files",
        "content": "You keep ownership of the files, text, images, and data you process with Navorika. We do not claim ownership of your files. Browser-local tools keep processing on your device. Server-assisted tools use temporary processing and remove files after the request finishes."
      },
      {
        "icon": "checkCircle",
        "title": "4. Acceptable Use",
        "content": "You agree to use Navorika only for lawful purposes. You agree not to:",
        "points": [
          "Attempt to bypass security controls or interfere with protected parts of the service",
          "Use bots, scrapers, or automated requests in a way that disrupts the site for other users",
          "Upload or process files containing malicious software, viruses, or harmful computer code",
          "Present calculator results as certified engineering, medical, legal, or tax documents when they are not"
        ]
      },
      {
        "icon": "alertTriangle",
        "title": "5. Disclaimer of Warranties",
        "content": "Navorika, its tools, calculators, guides, and services are provided on an \"as is\" and \"as available\" basis. We work to make results useful and accurate, but we do not guarantee uninterrupted service, error-free results, or compliance with every law, code, standard, or professional requirement. Review the Disclaimer and Methodology pages for more detail."
      },
      {
        "icon": "scale",
        "title": "6. Limitation of Liability",
        "content": "In no event shall Navorika, its operators, or contributors be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of your access to or use of the tools, including but not limited to loss of data, calculation errors, construction cost variances, financial decisions, or business interruption."
      },
      {
        "icon": "helpCircle",
        "title": "7. Modifications and Inquiries",
        "content": "We reserve the right to revise these Terms of Service at any time without prior notice. By continuing to use the platform after revisions are published, you agree to be bound by the updated terms."
      }
    ],
    "footerNote": {
      "text": "Questions regarding our Terms of Service? Use the",
      "linkText": "contact page",
      "linkHref": "/contact"
    }
  },
  "fr": {
    "title": "Conditions Générales d'Utilisation – Navorika",
    "description": "Conditions générales régissant l'utilisation des calculateurs, convertisseurs et utilitaires logiciels en ligne de Navorika.",
    "eyebrow": "Cadre Juridique",
    "heroTitle": "Conditions d'Utilisation",
    "heroDescription": "Veuillez consulter les règles et conditions encadrant l'accès et l'usage de la plateforme indépendante Navorika et de ses outils.",
    "lastUpdatedLabel": "Dernière mise à jour",
    "lastUpdated": "27 septembre 2026",
    "banner": {
      "variant": "indigo",
      "text": "Les outils Navorika sont gratuits. Ces conditions précisent la propriété intellectuelle, les règles d'usage et les limites de responsabilité."
    },
    "sections": [
      {
        "icon": "scale",
        "title": "1. Acceptation des conditions",
        "content": "En accédant au site Navorika (navorika.com) ou en utilisant ses services, vous acceptez d'être lié par les présentes conditions d'utilisation ainsi que par toutes les lois et réglementations applicables. Si vous êtes en désaccord avec l'une de ces clauses, l'accès au site et son utilisation vous sont interdits."
      },
      {
        "icon": "fileText",
        "title": "2. Description du service",
        "content": "Navorika met à disposition des calculateurs en ligne, des outils de conversion de documents, des utilitaires pour développeurs et des modules graphiques. La majorité s'exécute directement dans votre navigateur ; un petit nombre d'opérations techniques requiert un traitement éphémère sur serveur."
      },
      {
        "icon": "shield",
        "title": "3. Propriété intellectuelle et fichiers des utilisateurs",
        "content": "Vous conservez l'entière propriété et les droits sur les fichiers, textes, graphiques et données que vous traitez avec Navorika. Nous ne revendiquons aucun droit de propriété sur vos contenus. Les outils locaux conservent les données sur votre machine, tandis que les outils assistés par serveur détruisent les fichiers immédiatement après traitement."
      },
      {
        "icon": "checkCircle",
        "title": "4. Règles d'usage acceptable",
        "content": "Vous vous engagez à n'utiliser la plateforme qu'à des fins conformes à la loi. Il est formellement interdit de :",
        "points": [
          "Tenter de contourner les mécanismes de sécurité ou d'interférer avec les segments protégés du service",
          "Employer des robots d'aspiration, collecteurs automatisés ou scripts massifs susceptibles d'altérer la disponibilité du service pour autrui",
          "Transmettre ou soumettre des fichiers renfermant des logiciels malveillants, virus ou fragments de code informatique nuisibles",
          "Présenter les estimations ou données calculées comme des certifications professionnelles d'ingénierie, médicales, juridiques ou fiscales lorsqu'elles n'en ont pas la valeur"
        ]
      },
      {
        "icon": "alertTriangle",
        "title": "5. Exclusion de garanties",
        "content": "Navorika, ses outils, guides et calculateurs sont fournis « en l'état » et « selon disponibilité ». Nous consacrons d'importants efforts à assurer l'exactitude des calculs, mais nous ne garantissons pas l'absence d'erreurs, l'ininterruption du service ni la conformité systématique avec toutes les normes professionnelles locales. Consultez nos pages Avertissement et Méthodologie."
      },
      {
        "icon": "scale",
        "title": "6. Limitation de responsabilité",
        "content": "En aucun cas Navorika, ses administrateurs ou contributeurs ne pourront être tenus responsables de tout dommage direct, indirect, consécutif, spécial ou punitif découlant de l'accès ou de l'incapacité à utiliser les outils, incluant la perte de données, les écarts de coûts de construction, les décisions financières ou les interruptions d'activité."
      },
      {
        "icon": "helpCircle",
        "title": "7. Révisions et demandes d'information",
        "content": "Nous nous réservons le droit d'amender les présentes conditions d'utilisation à tout moment et sans préavis. Votre utilisation continue du site après publication des modifications vaut acceptation sans réserve des nouvelles dispositions."
      }
    ],
    "footerNote": {
      "text": "Des questions concernant nos conditions de service ? Utilisez notre",
      "linkText": "page de contact",
      "linkHref": "/contact"
    }
  },
  "it": {
    "title": "Termini di Servizio – Navorika",
    "description": "Condizioni generali che regolano l'utilizzo dei calcolatori, convertitori e strumenti digitali gratuiti della piattaforma Navorika.",
    "eyebrow": "Quadro Giuridico",
    "heroTitle": "Termini di Servizio",
    "heroDescription": "Ti invitiamo a leggere attentamente le condizioni che disciplinano l'accesso e l'uso degli strumenti offerti da Navorika.",
    "lastUpdatedLabel": "Ultimo aggiornamento",
    "lastUpdated": "27 settembre 2026",
    "banner": {
      "variant": "indigo",
      "text": "Gli strumenti Navorika sono gratuiti. Questi termini descrivono la proprietà dei file, l'uso corretto e i limiti di responsabilità."
    },
    "sections": [
      {
        "icon": "scale",
        "title": "1. Accettazione dei termini",
        "content": "Accedendo al sito web Navorika (navorika.com) e utilizzando i suoi servizi, accetti di essere vincolato dai presenti Termini di Servizio e da tutte le normative applicabili. Se non intendi accettare queste condizioni nella loro interezza, ti è precluso l'accesso o l'uso del sito."
      },
      {
        "icon": "fileText",
        "title": "2. Descrizione del servizio",
        "content": "Navorika fornisce calcolatori gratuiti, convertitori di documenti, strumenti di elaborazione immagini e utilità di programmazione. Quasi tutte le funzioni operano nel browser dell'utente, mentre un numero limitato di conversioni avanzate impiega un'elaborazione temporanea su server."
      },
      {
        "icon": "shield",
        "title": "3. Proprietà intellettuale e file dell'utente",
        "content": "Mantieni la piena ed esclusiva proprietà dei documenti, testi, file grafici e dati inseriti in Navorika. Non rivendichiamo alcun diritto sui tuoi contenuti. Gli strumenti locali mantengono i dati sul tuo dispositivo, mentre le conversioni temporanee su server cancellano i dati subito dopo la risposta."
      },
      {
        "icon": "checkCircle",
        "title": "4. Condotta e uso consentito",
        "content": "L'utente accetta di impiegare la piattaforma esclusivamente per scopi leciti. È rigorosamente vietato:",
        "points": [
          "Tentare di aggirare le protezioni di sicurezza o manomettere sezioni protette dell'infrastruttura",
          "Impiegare bot, scraper o script ad alta frequenza che possano compromettere la disponibilità o le prestazioni del sito per altri utenti",
          "Caricare o trasmettere file contenenti malware, virus o codice software potenzialmente lesivo",
          "Presentare i valori stimati o le risultanze numeriche come perizie tecniche asseverate, atti legali o consulenze fiscali ufficiali"
        ]
      },
      {
        "icon": "alertTriangle",
        "title": "5. Esclusione di garanzie",
        "content": "Navorika, i relativi calcolatori, convertitori e guide sono resi disponibili nello stato di fatto e di diritto in cui si trovano («as is»). Pur impegnandoci per garantire la massima accuratezza, non forniamo garanzie di servizio continuativo, assenza totale di refusi o conformità a qualsiasi standard normativo specifico. Consulta le pagine Note Legali e Metodologia."
      },
      {
        "icon": "scale",
        "title": "6. Limitazione di responsabilità",
        "content": "In nessun caso Navorika, i suoi gestori o collaboratori potranno essere ritenuti responsabili per danni diretti, indiretti, incidentali o consequenziali derivanti dall'accesso o dall'uso dei calcolatori, inclusi perdite di dati, scostamenti nei computi metrici edili, investimenti o interruzioni di attività."
      },
      {
        "icon": "helpCircle",
        "title": "7. Modifiche e chiarimenti",
        "content": "Ci riserviamo la facoltà di aggiornare i presenti Termini di Servizio in ogni momento senza obbligo di preavviso. La prosecuzione dell'utilizzo della piattaforma in seguito alla pubblicazione dei termini aggiornati costituisce accettazione integrale delle modifiche."
      }
    ],
    "footerNote": {
      "text": "Domande relative ai nostri Termini di Servizio? Visita la nostra",
      "linkText": "pagina dei contatti",
      "linkHref": "/contact"
    }
  },
  "pt": {
    "title": "Termos de Serviço – Navorika",
    "description": "Condições e diretrizes que regem o acesso e a utilização das ferramentas gratuitas, calculadoras e conversores da Navorika.",
    "eyebrow": "Enquadramento Legal",
    "heroTitle": "Termos de Serviço",
    "heroDescription": "Por favor, leia atentamente as cláusulas que disciplinam a utilização e o acesso à plataforma Navorika e aos seus serviços.",
    "lastUpdatedLabel": "Última atualização",
    "lastUpdated": "27 de setembro de 2026",
    "banner": {
      "variant": "indigo",
      "text": "As ferramentas Navorika são gratuitas. Estes termos esclarecem a titularidade dos ficheiros, uso legítimo e limites de responsabilidade."
    },
    "sections": [
      {
        "icon": "scale",
        "title": "1. Adesão aos termos",
        "content": "Ao aceder ou utilizar o portal Navorika (navorika.com), concorda em cumprir e vincular-se a estes Termos de Serviço e a toda a legislação aplicável. Caso não concorde com qualquer uma das condições estabelecidas, fica impedido de aceder ou usar este website."
      },
      {
        "icon": "fileText",
        "title": "2. Descrição dos serviços",
        "content": "A Navorika oferece calculadoras gratuitas, utilitários para documentos e PDF, conversores de formatos e ferramentas para programadores. A grande maioria executa diretamente no seu navegador, existindo apenas um número reduzido de tarefas que recorre a processamento transitório em servidor."
      },
      {
        "icon": "shield",
        "title": "3. Propriedade intelectual e ficheiros do utilizador",
        "content": "O utilizador preserva a titularidade e todos os direitos sobre os ficheiros, imagens, dados e códigos que processa na Navorika. Não reivindicamos qualquer propriedade sobre os seus ficheiros. As ferramentas locais mantêm os dados no seu dispositivo e as tarefas de servidor eliminam os dados imediatamente após a resposta."
      },
      {
        "icon": "checkCircle",
        "title": "4. Condições de uso legítimo",
        "content": "O utilizador compromete-se a usar a Navorika estritamente para finalidades legais. É expressamente vedado:",
        "points": [
          "Tentar contornar mecanismos de proteção ou interferir com áreas restritas dos sistemas da plataforma",
          "Empregar raspadores automáticos (scrapers), robôs ou pedidos em massa que sobrecarreguem ou prejudiquem outros utilizadores",
          "Enviar ou submeter ficheiros que contenham programas maliciosos, vírus ou código informático perigoso",
          "Apresentar estimativas numéricas ou relatórios das ferramentas como laudos periciais de engenharia, medicina ou documentos tributários certificados"
        ]
      },
      {
        "icon": "alertTriangle",
        "title": "5. Isenção de garantias",
        "content": "A plataforma Navorika e os seus respetivos utilitários são disponibilizados na base «tal como se encontram» («as is») e «conforme disponíveis». Embora envidemos esforços contínuos para garantir cálculos rigorosos, não prestamos garantias de funcionamento ininterrupto, ausência absoluta de falhas ou adequação jurídica a códigos municipais específicos."
      },
      {
        "icon": "scale",
        "title": "6. Limitação de responsabilidade",
        "content": "Em circunstância alguma a Navorika, os seus responsáveis ou desenvolvedores poderão ser responsabilizados por quaisquer danos diretos, indiretos, incidentais ou punitivos decorrentes do uso das calculadoras, incluindo perda de dados, variações orçamentais em obras, decisões de investimento ou quebras de negócio."
      },
      {
        "icon": "helpCircle",
        "title": "7. Revisões e esclarecimentos",
        "content": "Reservamo-nos o direito de alterar estes Termos de Serviço a qualquer altura, sem aviso prévio. A continuidade da utilização da plataforma após a disponibilização dos termos atualizados implica a sua aceitação sem reservas."
      }
    ],
    "footerNote": {
      "text": "Tem alguma dúvida relativamente aos nossos Termos de Serviço? Utilize a",
      "linkText": "página de contacto",
      "linkHref": "/contact"
    }
  },
  "es": {
    "title": "Términos del Servicio – Navorika",
    "description": "Condiciones y normas que rigen el acceso y uso de las calculadoras, conversores y herramientas web gratuitas de Navorika.",
    "eyebrow": "Marco Legal",
    "heroTitle": "Términos del Servicio",
    "heroDescription": "Le rogamos que revise detenidamente las cláusulas que regulan el uso de la plataforma Navorika y de sus aplicaciones en línea.",
    "lastUpdatedLabel": "Última actualización",
    "lastUpdated": "27 de septiembre de 2026",
    "banner": {
      "variant": "indigo",
      "text": "Las herramientas de Navorika son gratuitas. Estos términos definen la propiedad de sus archivos, el uso correcto y los límites de responsabilidad."
    },
    "sections": [
      {
        "icon": "scale",
        "title": "1. Aceptación de los términos",
        "content": "Al acceder o utilizar Navorika (navorika.com), usted acepta quedar vinculado por estos Términos del Servicio y por la legislación y regulaciones vigentes. Si no está de acuerdo con cualquiera de estas disposiciones, tiene prohibido acceder o hacer uso de este sitio."
      },
      {
        "icon": "fileText",
        "title": "2. Descripción del servicio",
        "content": "Navorika pone a su disposición calculadoras en línea gratuitas, herramientas de documentos y PDF, conversores de formato y aplicaciones para desarrolladores. La gran mayoría se ejecutan directamente en su navegador; un grupo selecto de conversiones especializadas emplea procesamiento temporal en servidor."
      },
      {
        "icon": "shield",
        "title": "3. Propiedad intelectual y archivos de los usuarios",
        "content": "Usted conserva íntegramente la propiedad y los derechos de autor de los archivos, textos, imágenes y datos que procesa mediante Navorika. No reclamamos titularidad alguna sobre sus documentos. Las herramientas locales mantienen el procesamiento en su equipo y los procesos asistidos por servidor destruyen los archivos al terminar la solicitud."
      },
      {
        "icon": "checkCircle",
        "title": "4. Uso aceptable y prohibiciones",
        "content": "Usted se compromete a utilizar Navorika únicamente con fines lícitos. Queda terminantemente prohibido:",
        "points": [
          "Intentar eludir controles de seguridad o interferir con componentes protegidos de la infraestructura",
          "Utilizar rastreadores automáticos (scrapers), bots o peticiones desmedidas que degraden el rendimiento del sitio para otros usuarios",
          "Subir o procesar archivos que alberguen malware, virus o cualquier código informático dañino",
          "Presentar resultados de las calculadoras como dictámenes periciales certificados de ingeniería, medicina, derecho o tributación"
        ]
      },
      {
        "icon": "alertTriangle",
        "title": "5. Exclusión de garantías",
        "content": "Navorika, sus herramientas, conversores y guías se facilitan «tal cual» y «según disponibilidad». Trabajamos rigurosamente para ofrecer cálculos certeros, pero no garantizamos la disponibilidad ininterrumpida, la ausencia de erratas o el cumplimiento estricto de cualquier normativa profesional o código local de edificación. Revise las páginas de Descargo y Metodología."
      },
      {
        "icon": "scale",
        "title": "6. Limitación de responsabilidad",
        "content": "En ningún supuesto Navorika, sus administradores o colaboradores responderán por daños directos, indirectos, consecuentes, especiales o punitivos derivados del acceso o uso de las herramientas, incluyendo pérdida de información, errores de cómputo en obra, decisiones financieras o interrupción de negocios."
      },
      {
        "icon": "helpCircle",
        "title": "7. Modificaciones y consultas",
        "content": "Nos reservamos el derecho de modificar estos Términos del Servicio en cualquier momento y sin previo aviso. El uso continuado del sitio tras la publicación de revisiones constituye su plena conformidad con las cláusulas vigentes."
      }
    ],
    "footerNote": {
      "text": "¿Tiene preguntas sobre nuestros Términos del Servicio? Consulte la",
      "linkText": "página de contacto",
      "linkHref": "/contact"
    }
  },
  "de": {
    "title": "Nutzungsbedingungen – Navorika",
    "description": "Allgemeine Nutzungsbedingungen für die kostenfreien Online-Rechner, Dateikonverter und Software-Werkzeuge von Navorika.",
    "eyebrow": "Rechtlicher Rahmen",
    "heroTitle": "Nutzungsbedingungen",
    "heroDescription": "Bitte lesen Sie die nachfolgenden Bedingungen sorgfältig durch, die den Zugriff auf und die Nutzung der Plattform Navorika regeln.",
    "lastUpdatedLabel": "Zuletzt aktualisiert",
    "lastUpdated": "27. September 2026",
    "banner": {
      "variant": "indigo",
      "text": "Navorika-Werkzeuge sind kostenlos. Diese Bedingungen regeln Dateieigentum, zulässige Nutzung und wichtige Haftungsausschlüsse."
    },
    "sections": [
      {
        "icon": "scale",
        "title": "1. Zustimmung zu den Bedingungen",
        "content": "Mit dem Zugriff auf oder der Nutzung von Navorika (navorika.com) erklären Sie sich mit diesen Nutzungsbedingungen sowie sämtlichen geltenden gesetzlichen Bestimmungen einverstanden. Sofern Sie diesen Bestimmungen nicht zustimmen, ist Ihnen der Zugriff auf diese Website untersagt."
      },
      {
        "icon": "fileText",
        "title": "2. Leistungsbeschreibung",
        "content": "Navorika stellt kostenlose browserbasierte Rechner, Dokument- und PDF-Werkzeuge, Dateikonverter sowie Entwickler-Dienstprogramme bereit. Der überwiegende Teil läuft direkt in Ihrem Browser; vereinzelte Spezialkonvertierungen erfordern eine temporäre serverseitige Verarbeitung."
      },
      {
        "icon": "shield",
        "title": "3. Geistiges Eigentum und Nutzerdateien",
        "content": "Sie behalten das uneingeschränkte Eigentum und sämtliche Rechte an den Dateien, Texten, Grafiken und Daten, die Sie mit Navorika bearbeiten. Wir erheben keinerlei Eigentumsansprüche auf Ihre Inhalte. Lokale Werkzeuge verarbeiten Daten auf Ihrem Rechner; serverseitige Prozesse löschen Dateien sofort nach Bearbeitung."
      },
      {
        "icon": "checkCircle",
        "title": "4. Zulässige Nutzung",
        "content": "Sie verpflichten sich, Navorika ausschließlich für rechtmäßige Zwecke einzusetzen. Folgende Handlungen sind ausdrücklich untersagt:",
        "points": [
          "Versuche, Sicherheitsmechanismen zu umgehen oder geschützte Systemkomponenten anzugreifen",
          "Einsatz von Scraping-Bots, automatisierten Abfragen oder Skripten, welche die Plattform für andere Nutzer beeinträchtigen",
          "Übermittlung oder Bearbeitung von Dateien, die Schadsoftware, Viren oder schädlichen Programmcode enthalten",
          "Ausgabe von Rechnerergebnissen als amtlich zertifizierte ingenieurtechnische, medizinische, juristische oder steuerliche Gutachten"
        ]
      },
      {
        "icon": "alertTriangle",
        "title": "5. Gewährleistungsausschluss",
        "content": "Navorika und alle bereitgestellten Rechner, Konverter und Leitfäden werden im aktuellen Zustand („wie besehen“ und „nach Verfügbarkeit“) zur Verfügung gestellt. Obwohl wir größte Sorgfalt auf die Korrektheit der Formeln legen, übernehmen wir keine Garantie für ununterbrochene Verfügbarkeit, Fehlerfreiheit oder Konformität mit lokalen Bauordnungen oder Berufsstandards."
      },
      {
        "icon": "scale",
        "title": "6. Haftungsbeschränkung",
        "content": "In keinem Fall haften Navorika, seine Betreiber oder Mitwirkenden für direkte, indirekte, zufällige oder Folgeschäden, die aus der Nutzung der Werkzeuge entstehen, insbesondere Datenverlust, Abweichungen bei Baukalkulationen, finanzielle Fehldispositionen oder Betriebsunterbrechungen."
      },
      {
        "icon": "helpCircle",
        "title": "7. Änderungen und Anfragen",
        "content": "Wir behalten uns das Recht vor, diese Nutzungsbedingungen jederzeit ohne vorherige Ankündigung anzupassen. Durch die fortgesetzte Nutzung der Website nach Veröffentlichung geänderter Bedingungen erklären Sie sich mit der jeweils gültigen Fassung einverstanden."
      }
    ],
    "footerNote": {
      "text": "Haben Sie Fragen zu unseren Nutzungsbedingungen? Besuchen Sie unsere",
      "linkText": "Kontaktseite",
      "linkHref": "/contact"
    }
  },
  "ru": {
    "title": "Условия обслуживания – Navorika",
    "description": "Условия и правила, регулирующие использование бесплатных онлайн-калькуляторов, конвертеров и веб-инструментов платформы Navorika.",
    "eyebrow": "Правовые основы",
    "heroTitle": "Условия использования",
    "heroDescription": "Пожалуйста, ознакомьтесь с условиями и положениями, регулирующими доступ к сервисам Navorika и их использование.",
    "lastUpdatedLabel": "Последнее обновление",
    "lastUpdated": "27 сентября 2026 г.",
    "banner": {
      "variant": "indigo",
      "text": "Инструменты Navorika бесплатны. Эти условия определяют права на файлы, правила допустимого использования и ограничения ответственности."
    },
    "sections": [
      {
        "icon": "scale",
        "title": "1. Согласие с условиями",
        "content": "Получая доступ к сайту Navorika (navorika.com) или используя его сервисы, вы соглашаетесь соблюдать настоящие Условия обслуживания и все применимые законы и правила. Если вы не согласны с какими-либо из этих положений, вам запрещается использовать данный ресурс."
      },
      {
        "icon": "fileText",
        "title": "2. Описание предоставляемых услуг",
        "content": "Navorika предоставляет бесплатные онлайн-калькуляторы, утилиты для работы с PDF и документами, графические конвертеры и инструменты разработчика. Почти все они функционируют в браузере; небольшое число специфических задач использует кратковременную серверную обработку."
      },
      {
        "icon": "shield",
        "title": "3. Интеллектуальная собственность и файлы пользователей",
        "content": "Вы сохраняете полное право собственности на все файлы, текст, изображения и числовые данные, обрабатываемые в Navorika. Мы не претендуем на владение вашим контентом. Локальные утилиты хранят данные только на вашем компьютере, а серверные задачи уничтожают файлы сразу после ответа."
      },
      {
        "icon": "checkCircle",
        "title": "4. Правила допустимого использования",
        "content": "Вы обязуетесь использовать сервисы Navorika исключительно в законных целях. Запрещается:",
        "points": [
          "Предпринимать попытки обойти механизмы защиты или вмешиваться в работу защищенных компонентов сервиса",
          "Использовать ботов, парсеры или автоматизированные скрипты с чрезмерной частотой запросов, создающие помехи для других пользователей",
          "Загружать или отправлять на обработку файлы, содержащие вредоносное ПО, вирусы или деструктивный код",
          "Выдавать расчетные результаты онлайн-инструментов за сертифицированные инженерные проекты, медицинские заключения или аудиторские отчеты"
        ]
      },
      {
        "icon": "alertTriangle",
        "title": "5. Отказ от предоставления гарантий",
        "content": "Платформа Navorika и все входящие в нее инструменты предоставляются на условиях «как есть» («as is») и «по мере доступности». Мы прикладываем серьезные усилия для верификации формул, но не гарантируем абсолютную безошибочность, непрерывность работы или строгое соответствие региональным строительным нормам."
      },
      {
        "icon": "scale",
        "title": "6. Ограничение ответственности",
        "content": "Ни при каких обстоятельствах Navorika, ее администраторы или контрибьюторы не несут ответственности за прямой или косвенный ущерб, возникший в результате использования инструментов, включая потерю данных, расхождения в сметах, финансовые убытки или простой бизнеса."
      },
      {
        "icon": "helpCircle",
        "title": "7. Изменения и обращения",
        "content": "Мы оставляем за собой право вносить изменения в настоящие Условия обслуживания в любое время без предварительного уведомления. Дальнейшее использование платформы означает ваше согласие с обновленной редакцией условий."
      }
    ],
    "footerNote": {
      "text": "Вопросы по условиям использования сервиса? Перейдите на нашу",
      "linkText": "страницу контактов",
      "linkHref": "/contact"
    }
  },
  "ar": {
    "title": "شروط الخدمة – Navorika",
    "description": "الشروط والأحكام القانونية التي تحكم استخدامك للآلات الحاسبة والمحولات وأدوات الويب المجانية المقدمة من Navorika.",
    "eyebrow": "الإطار القانوني",
    "heroTitle": "شروط الخدمة",
    "heroDescription": "يرجى قراءة الشروط والأحكام التي تضبط وتحدد استخدامك لمنصة Navorika وخدماتها الرقمية المجانية بعناية.",
    "lastUpdatedLabel": "آخر تحديث",
    "lastUpdated": "27 سبتمبر 2026",
    "banner": {
      "variant": "indigo",
      "text": "أدوات Navorika مجانية تماماً. توضح هذه الشروط ملكية الملفات، والاستخدام المقبول، وحدود المسؤولية القانونية."
    },
    "sections": [
      {
        "icon": "scale",
        "title": "1. الموافقة على الشروط",
        "content": "من خلال دخولك إلى منصة Navorika (navorika.com) أو استخدام أدواتها، فإنك توافق على الالتزام بشروط الخدمة هذه وبجميع القوانين واللوائح المعمول بها. إذا كنت لا توافق على أي من هذه الشروط، فيحظر عليك استخدام هذا الموقع أو الوصول إليه."
      },
      {
        "icon": "fileText",
        "title": "2. وصف الخدمات المقدمة",
        "content": "توفر Navorika آلات حاسبة مجانية عبر الإنترنت، وأدوات لمعالجة مستندات PDF، ومحولات تنسيقات، وأدوات للمطورين والمصممين. تعمل معظم الأدوات محلياً داخل متصفحك، وتعتمد قلة محدودة من التحويلات المعقدة على معالجة مؤقتة على الخادم."
      },
      {
        "icon": "shield",
        "title": "3. الملكية الفكرية وملفات المستخدم",
        "content": "أنت تحتفظ بكامل حقوق الملكية على جميع الملفات والنصوص والتصاميم والبيانات التي تقوم بمعالجتها عبر Navorika. نحن لا ندعي أي ملكية على ملفاتك. الأدوات المحلية تبقي معالجتك على جهازك، وعمليات الخادم المؤقتة تتخلص من الملفات فور إتمام طلبك."
      },
      {
        "icon": "checkCircle",
        "title": "4. الاستخدام المقبول والمحظورات",
        "content": "أنت توافق على استخدام Navorika للأغراض المشروعة والقانونية فقط. ويحظر عليك صراحة ما يلي:",
        "points": [
          "محاولة تجاوز ضوابط الأمان أو التدخل في الأجزاء المحمية من الخدمة والأنظمة البرمجية",
          "استخدام برامج الزحف الآلي (Scrapers) أو الروبوتات أو الطلبات الآلية المكثفة التي تعطل الموقع للمستخدمين الآخرين",
          "رفع أو معالجة أي ملفات تحتوي على برمجيات خبيثة أو فيروسات أو أكواد برمجية ضارة",
          "تقديم نتائج الحسابات كتقارير هندسية معتمدة، أو تشخيصات طبية، أو وثائق قانونية أو استشارات ضريبية رسمية"
        ]
      },
      {
        "icon": "alertTriangle",
        "title": "5. إخلاء المسؤولية عن الضمانات",
        "content": "يتم تقديم Navorika وجميع أدواتها وحاسباتها ودلائلها على أساس «كما هي» («as is») و«حسب التوفر». نحن نعمل بجدية لضمان دقة النتائج، لكننا لا نضمن عدم انقطاع الخدمة أو خلوها من الأخطاء العرضية أو مطابقتها لجميع معايير البناء أو الأنظمة المهنية المحلية. يرجى مراجعة صفحتي إخلاء المسؤولية والمنهجية."
      },
      {
        "icon": "scale",
        "title": "6. حدود المسؤولية القانونية",
        "content": "لا تتحمل Navorika أو مشغلوها أو المساهمون فيها بأي حال من الأحوال أي مسؤولية عن أي أضرار مباشرة أو غير مباشرة أو عرضية أو تبعية ناشئة عن استخدامك للأدوات، بما في ذلك فقدان البيانات، أو تباين تكاليف البناء، أو القرارات المالية، أو توقف الأعمال."
      },
      {
        "icon": "helpCircle",
        "title": "7. التعديلات والاستفسارات",
        "content": "نحتفظ بالحق في مراجعة وتعديل شروط الخدمة هذه في أي وقت دون إشعار مسبق. يعتبر استمرارك في استخدام المنصة بعد نشر أي تحديثات بمثابة موافقة كاملة منك على الشروط المعدلة."
      }
    ],
    "footerNote": {
      "text": "هل لديك أي استفسار حول شروط الخدمة؟ تفضل بزيارة",
      "linkText": "صفحة الاتصال بنا",
      "linkHref": "/contact"
    }
  }
};

export const disclaimerContent: Record<Locale | 'en', TrustPageContent> = {
  "en": {
    "title": "Legal & Calculation Disclaimer – Navorika",
    "description": "Legal and calculation disclaimers for Navorika financial, health, construction, and document utility tools.",
    "eyebrow": "Legal Disclaimer",
    "heroTitle": "Legal & Calculation Disclaimer",
    "heroDescription": "All calculations, converters, and guidelines provided on Navorika are intended for informational, planning, and educational purposes only.",
    "lastUpdatedLabel": "Last updated",
    "lastUpdated": "September 27, 2026",
    "banner": {
      "variant": "amber",
      "text": "All Navorika calculations, tools, and guides are provided for informational and educational purposes only. They are not professional advice."
    },
    "sections": [
      {
        "icon": "trendingUp",
        "title": "Financial & Investment Calculators",
        "badge": "Planning Estimates Only",
        "badgeColor": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
        "content": "Finance calculators are planning tools. They can help compare loans, savings, investments, budgets, taxes, and retirement scenarios, but they do not predict or guarantee real financial outcomes.",
        "points": [
          "Not Financial Advice: Results generated by our calculators do not constitute financial, investment, legal, accounting, or tax advice.",
          "Rates and Rules Change: Interest rates, investment returns, inflation, taxes, fees, and financial rules can change and affect the real result.",
          "Important Decisions: Check current rates, rules, and provider terms. Consider professional financial or tax advice when the decision is significant."
        ]
      },
      {
        "icon": "heartPulse",
        "title": "Health, Fitness & Biometrics Calculators",
        "badge": "Not Medical Advice",
        "badgeColor": "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
        "content": "Health and fitness calculators use published formulas to estimate values such as BMI, calorie needs, heart-rate zones, and body measurements. They are general estimates, not a diagnosis.",
        "points": [
          "Screening Aids Only: These calculations are generalized statistical formulas intended solely for self-tracking and fitness education. They do not diagnose, treat, cure, or prevent any disease or medical condition.",
          "People Differ: General formulas cannot fully account for muscle mass, body composition, pregnancy, medications, medical conditions, or individual metabolism.",
          "Medical Consultation: Always consult a licensed medical doctor, registered dietitian, or qualified healthcare professional before undertaking calorie restriction, intensive exercise programs, or nutritional changes."
        ]
      },
      {
        "icon": "hammer",
        "title": "Construction & Engineering Calculators",
        "badge": "Field Estimates Only",
        "badgeColor": "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
        "content": "Construction calculators can help estimate materials, dimensions, quantities, costs, roof or stair geometry, and some electrical or structural planning values. They are starting estimates, not approved plans.",
        "points": [
          "Not Certified Engineering: Calculations do not substitute for stamped architectural drawings, certified structural calculations, or licensed engineering evaluations.",
          "Code Compliance: Building requirements vary by municipality and jurisdiction. All load-bearing spans, concrete mixes, electrical runs, and safety clearances must comply with local building codes (such as IBC, IRC, NEC, or local municipal bylaws).",
          "Site Conditions Matter: Waste, soil, compaction, material grade, weather, layout, and site conditions can change real quantities and performance. Verify important work on site."
        ]
      },
      {
        "icon": "wrench",
        "title": "General Utilities & Document Tools",
        "badge": "As-Is Operation",
        "badgeColor": "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
        "content": "PDF tools, image converters, and developer utilities are provided on an \"as-is\" and \"as-available\" basis. Keep an original copy of important files before converting or editing them.",
        "points": [
          "Browser Limits: Even browser-local tools can fail because of memory limits, very large files, unsupported formats, or a browser crash.",
          "Keep Originals: Save a backup copy of important files, documents, images, and code before editing or converting them.",
          "Interchange Formats: Specific specialized tools (such as vector CorelDRAW converters) produce compatible open interchange formats (PDF, EPS, SVG) rather than native proprietary files, as disclosed on the relevant tool pages."
        ]
      }
    ],
    "footerNote": {
      "text": "For technical details on how our formulas and tools are validated, see our Calculation Methodology. If you notice any calculation discrepancy, please use our contact page.",
      "linkText": "Calculation Methodology",
      "linkHref": "/methodology",
      "secondLinkText": "contact page",
      "secondLinkHref": "/contact"
    }
  },
  "fr": {
    "title": "Avertissement Légal et Limites des Calculs – Navorika",
    "description": "Limites de responsabilité et avertissements concernant les calculateurs financiers, de santé, de bâtiment et les utilitaires Navorika.",
    "eyebrow": "Avertissement Légal",
    "heroTitle": "Avertissement Légal et Calculs",
    "heroDescription": "L'ensemble des calculs, conversions et guides de Navorika sont fournis exclusivement à des fins informatives, de simulation et d'éducation.",
    "lastUpdatedLabel": "Dernière mise à jour",
    "lastUpdated": "27 septembre 2026",
    "banner": {
      "variant": "amber",
      "text": "Tous les calculs, outils et guides Navorika sont fournis à des fins purement informatives et éducatives. Ils ne constituent pas des conseils professionnels."
    },
    "sections": [
      {
        "icon": "trendingUp",
        "title": "Calculateurs Financiers et d'Investissement",
        "badge": "Estimations de Simulation",
        "badgeColor": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
        "content": "Les calculateurs de finances sont des outils de modélisation. Ils permettent de comparer des emprunts, des plans d'épargne, des scénarios fiscaux ou des rendements, mais ne sauraient prédire ni garantir des résultats réels sur les marchés.",
        "points": [
          "Absence de conseil financier : les résultats obtenus ne constituent en aucun cas des recommandations d'investissement, des conseils juridiques, comptables ou fiscaux agréés.",
          "Évolution des barèmes : les taux d'intérêt, les rendements, l'inflation, la fiscalité et les réglementations changent régulièrement et modifient les montants effectifs.",
          "Décisions importantes : vérifiez toujours les barèmes officiels et consultez un conseiller financier ou fiscal certifié avant toute opération patrimoniale majeure."
        ]
      },
      {
        "icon": "heartPulse",
        "title": "Calculateurs de Santé, Forme et Biométrie",
        "badge": "Non Médical",
        "badgeColor": "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
        "content": "Les calculateurs de santé appliquent des formules reconnues pour évaluer l'IMC, les besoins caloriques ou la fréquence cardiaque. Ce sont des indicateurs statistiques généraux et non des diagnostics médicaux.",
        "points": [
          "Outils de suivi personnel : ces équations visent l'information sportive et le suivi personnel. Elles ne permettent pas de diagnostiquer, soigner ou prévenir une pathologie.",
          "Variabilité individuelle : les formules moyennes ne prennent pas en compte la composition corporelle précise, les grossesses, les pathologies ou les spécificités métaboliques.",
          "Avis médical obligatoire : consultez impérativement un médecin ou un nutritionniste diplômé avant d'entreprendre un régime restrictif ou un entraînement intensif."
        ]
      },
      {
        "icon": "hammer",
        "title": "Calculateurs de Chantier et d'Ingénierie",
        "badge": "Estimations Pratiques",
        "badgeColor": "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
        "content": "Les outils de construction vous aident à quantifier les volumes de béton, les briques, les revêtements ou les pentes d'escalier. Il s'agit d'estimations préliminaires et non de plans d'exécution certifiés.",
        "points": [
          "Absence de certification d'ingénierie : les résultats ne remplacent pas les calculs de structure certifiés par un bureau d'études ou un architecte qualifié.",
          "Conformité aux normes locales : les règles de construction varient selon les régions et les DTU. Les portées, dosages et sécurités doivent respecter les codes du bâtiment en vigueur.",
          "Facteurs réels de chantier : les chutes de découpe, la compaction du sol, la météo et la qualité des matériaux influencent les quantités réelles. Vérifiez toujours sur site."
        ]
      },
      {
        "icon": "wrench",
        "title": "Utilitaires Généraux et Outils Documentaires",
        "badge": "Fourni en l'état",
        "badgeColor": "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
        "content": "Les utilitaires PDF, les convertisseurs graphiques et les outils pour développeurs sont fournis « en l'état ». Conservez toujours une copie de sauvegarde de vos documents originaux.",
        "points": [
          "Limites techniques du navigateur : les outils locaux peuvent rencontrer des limites de mémoire ou interrompre le traitement sur des fichiers volumineux.",
          "Sauvegarde des originaux : conservez toujours une copie originale de vos fichiers, images et codes sources avant toute conversion.",
          "Formats d'échange ouverts : certains outils industriels (comme les modules CorelDRAW) génèrent des formats ouverts compatibles (PDF, EPS, SVG) plutôt que des fichiers natifs propriétaires, comme indiqué sur les pages dédiées."
        ]
      }
    ],
    "footerNote": {
      "text": "Pour comprendre les méthodes et formules de nos outils, consultez notre Méthodologie. En cas de constat d'anomalie, utilisez notre page de contact.",
      "linkText": "Méthodologie",
      "linkHref": "/methodology",
      "secondLinkText": "page de contact",
      "secondLinkHref": "/contact"
    }
  },
  "it": {
    "title": "Note Legali ed Esclusione di Responsabilità – Navorika",
    "description": "Limiti di responsabilità per calcolatori finanziari, biometrici, di cantiere ed elaborazione documenti su Navorika.",
    "eyebrow": "Note Legali",
    "heroTitle": "Esclusione di Responsabilità",
    "heroDescription": "Tutti i calcolatori, le conversioni e le indicazioni presenti su Navorika hanno finalità puramente informative, stime indicative e scopi educativi.",
    "lastUpdatedLabel": "Ultimo aggiornamento",
    "lastUpdated": "27 settembre 2026",
    "banner": {
      "variant": "amber",
      "text": "Tutti i calcoli, gli strumenti e le guide di Navorika sono forniti esclusivamente per scopi informativi ed educativi. Non costituiscono consulenza professionale."
    },
    "sections": [
      {
        "icon": "trendingUp",
        "title": "Calcolatori Finanziari e di Rendimento",
        "badge": "Stime Indicative",
        "badgeColor": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
        "content": "I calcolatori finanziari sono strumenti di pianificazione per confrontare mutui, prestiti, rendimenti o imposte. Non prevedono né garantiscono gli esiti economici reali.",
        "points": [
          "Nessuna consulenza professionale: le simulazioni prodotte non costituiscono consulenza finanziaria, previdenziale, fiscale o legale asseverata.",
          "Variabilità dei parametri: tassi di interesse, inflazione, commissioni bancarie e aliquote tributarie possono mutare e modificare le cifre reali.",
          "Decisioni rilevanti: verifica sempre le condizioni contrattuali con la banca e rivolgiti a un commercialista o consulente abilitato per operazioni importanti."
        ]
      },
      {
        "icon": "heartPulse",
        "title": "Calcolatori di Salute, Nutrizione e Biometria",
        "badge": "Non Medico",
        "badgeColor": "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
        "content": "I moduli per BMI, fabbisogno calorico e frequenza cardiaca applicano formule scientifiche statistiche. Rappresentano stime medie e non diagnosi cliniche.",
        "points": [
          "Scopo informativo: le equazioni biometriche servono come orientamento per l'allenamento personale. Non curano né diagnosticano alcuna patologia.",
          "Specificità individuale: le formule generali non considerano massa muscolare, patologie pregresse, gravidanza o terapie farmacologiche.",
          "Consulto medico: chiedi sempre il parere di un medico curante o di un biologo nutrizionista prima di iniziare diete ipocaloriche o carichi sportivi pesanti."
        ]
      },
      {
        "icon": "hammer",
        "title": "Calcolatori per Edilizia e Ingegneria",
        "badge": "Stime di Cantiere",
        "badgeColor": "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
        "content": "Le utility di cantiere calcolano quantità stimate di calcestruzzo, laterizi, pendenze o armature. Sono stime operative preliminari, non progetti strutturali approvati.",
        "points": [
          "Nessuna perizia asseverata: i calcoli non sostituiscono i computi metrici e i dimensionamenti firmati da ingegneri o geometri abilitati.",
          "Norme tecniche: le disposizioni costruttive variano in base alle zone sismiche e ai regolamenti edilizi locali. Rispetta sempre le normative vigenti.",
          "Variabili in opera: sfridi di taglio, umidità, compattazione e qualità dei materiali alterano i quantitativi reali. Esegui sempre riscontri in cantiere."
        ]
      },
      {
        "icon": "wrench",
        "title": "Utilità di Sistema e Gestione Documenti",
        "badge": "Così com'è",
        "badgeColor": "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
        "content": "Gli strumenti per PDF, conversioni grafiche e codice sono messi a disposizione «così come sono». Custodisci sempre un duplicato dei file originali.",
        "points": [
          "Vincoli di memoria: i file di dimensioni eccezionali possono saturare la memoria del browser o arrestare il processo.",
          "Conserva gli originali: mantieni copie di sicurezza intatte prima di avviare qualsiasi conversione o modifica.",
          "Formati aperti: strumenti dedicati a CorelDRAW esportano formati aperti interoperabili (PDF, EPS, SVG) e non file proprietari non autorizzati, come esposto chiaramente nelle schede."
        ]
      }
    ],
    "footerNote": {
      "text": "Per dettagli sulle formule e sui metodi di verifica, consulta la nostra Metodologia. Per segnalare discrepanze numeriche, visita la nostra pagina dei contatti.",
      "linkText": "Metodologia",
      "linkHref": "/methodology",
      "secondLinkText": "pagina dei contatti",
      "secondLinkHref": "/contact"
    }
  },
  "pt": {
    "title": "Aviso Legal e Limitações de Cálculo – Navorika",
    "description": "Ressalvas de responsabilidade sobre calculadoras financeiras, de saúde, construção civil e utilitários da Navorika.",
    "eyebrow": "Aviso Legal",
    "heroTitle": "Aviso Legal e Limitações",
    "heroDescription": "Todos os cálculos, conversores e conteúdos da Navorika destinam-se exclusivamente a fins de planeamento, simulação e educação.",
    "lastUpdatedLabel": "Última atualização",
    "lastUpdated": "27 de setembro de 2026",
    "banner": {
      "variant": "amber",
      "text": "Todos os cálculos, ferramentas e guias da Navorika são disponibilizados para fins puramente informativos e educativos. Não constituem aconselhamento profissional."
    },
    "sections": [
      {
        "icon": "trendingUp",
        "title": "Calculadoras Financeiras e de Investimento",
        "badge": "Apenas Estimativas",
        "badgeColor": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
        "content": "As calculadoras financeiras são instrumentos de planeamento. Ajudam a projetar empréstimos, poupanças e impostos, mas não preveem nem garantem resultados reais de mercado.",
        "points": [
          "Não constitui consultoria: os resultados apresentados não substituem o aconselhamento financeiro, legal, contabilístico ou fiscal credenciado.",
          "Alteração de taxas e regras: juros bancários, taxas de inflação, tabelas fiscais e encargos contratuais sofrem alterações que afetam o resultado final.",
          "Decisões ponderadas: confirme sempre as condições em vigor e recorra a um contabilista ou consultor financeiro antes de compromissos importantes."
        ]
      },
      {
        "icon": "heartPulse",
        "title": "Calculadoras de Saúde e Condição Física",
        "badge": "Não Médico",
        "badgeColor": "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
        "content": "As ferramentas de IMC, queima calórica e zonas cardíacas aplicam fórmulas populacionais padronizadas. Fornecem apenas estimativas de referência e não um diagnóstico.",
        "points": [
          "Finalidade educativa: as equações servem de apoio à monitorização pessoal e não diagnosticam, tratam ou curam estados patológicos.",
          "Diferenças individuais: fórmulas estatísticas não refletem densidade óssea, composição muscular, gravidez ou particularidades do metabolismo.",
          "Acompanhamento profissional: consulte sempre um médico ou nutricionista habilitado antes de aderir a dietas rígidas ou planos de treino pesados."
        ]
      },
      {
        "icon": "hammer",
        "title": "Calculadoras de Obra e Engenharia",
        "badge": "Estimativas de Campo",
        "badgeColor": "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
        "content": "Os utilitários de construção civil apoiam o cálculo aproximado de materiais, betão, tijolos e escadas. São estimativas preliminares e não projetos de engenharia.",
        "points": [
          "Não substitui projeto técnico: os números não dispensam o dimensionamento e a validação assinada por engenheiro civil ou arquiteto responsável.",
          "Regulamentos municipais: as exigências de construção variam conforme o município e normas técnicas. Todas as cargas e estruturas devem respeitar o código em vigor.",
          "Condições reais do terreno: desperdícios de corte, compactação do solo e intempéries afetam os consumos reais. Faça sempre a conferência em obra."
        ]
      },
      {
        "icon": "wrench",
        "title": "Utilitários Gerais e Ficheiros",
        "badge": "Operação Tal Como Está",
        "badgeColor": "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
        "content": "As ferramentas de PDF, conversão de imagens e código são disponibilizadas «tal como estão». Guarde sempre um ficheiro original de segurança.",
        "points": [
          "Limites de processamento: ficheiros de grande dimensão podem esgotar a memória do navegador ou provocar o fecho do processo.",
          "Cópia de segurança: mantenha os documentos originais guardados antes de qualquer operação de conversão ou compressão.",
          "Formatos abertos de intercâmbio: os conversores de CorelDRAW produzem ficheiros abertos universais (PDF, EPS, SVG) e não ficheiros nativos fechados, como esclarecido nas páginas respetivas."
        ]
      }
    ],
    "footerNote": {
      "text": "Para conhecer os métodos científicos e critérios de teste, consulte a nossa Metodologia. Se detetar qualquer incongruência numérica, utilize a página de contacto.",
      "linkText": "Metodologia",
      "linkHref": "/methodology",
      "secondLinkText": "página de contacto",
      "secondLinkHref": "/contact"
    }
  },
  "es": {
    "title": "Descargo de Responsabilidad y Límites de Cálculo – Navorika",
    "description": "Avisos legales sobre calculadoras de finanzas, salud, construcción y utilidades de software en Navorika.",
    "eyebrow": "Aviso Legal",
    "heroTitle": "Descargo de Responsabilidad",
    "heroDescription": "Todos los cálculos, herramientas y contenidos de Navorika se facilitan con carácter informativo, de orientación y fines formativos.",
    "lastUpdatedLabel": "Última actualización",
    "lastUpdated": "27 de septiembre de 2026",
    "banner": {
      "variant": "amber",
      "text": "Todos los cálculos, herramientas y guías de Navorika se ofrecen con fines informativos y educativos. No constituyen asesoramiento profesional."
    },
    "sections": [
      {
        "icon": "trendingUp",
        "title": "Calculadoras Financieras y de Inversión",
        "badge": "Estimaciones Orientativas",
        "badgeColor": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
        "content": "Las herramientas financieras sirven para modelar presupuestos, comparar hipotecas, ahorro o impuestos. No aseguran ni anticipan resultados financieros reales.",
        "points": [
          "Sin asesoramiento vinculante: los resultados no constituyen asesoría financiera, legal, tributaria ni contable colegiada.",
          "Variación de condiciones: los tipos de interés, las comisiones bancarias, la inflación y las tablas fiscales cambian y condicionan las cantidades reales.",
          "Decisiones importantes: contraste las tarifas de su entidad y asesórese con un gestor o asesor financiero profesional ante decisiones sustanciales."
        ]
      },
      {
        "icon": "heartPulse",
        "title": "Calculadoras de Salud, Nutrición y Biometría",
        "badge": "No Médico",
        "badgeColor": "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
        "content": "Las fórmulas para calcular el IMC, el consumo calórico o la frecuencia cardíaca proceden de publicaciones científicas. Son estimaciones estadísticas, no diagnósticos.",
        "points": [
          "Orientación personal: estas herramientas están concebidas para el seguimiento de la forma física. No diagnostican ni previenen patologías.",
          "Diversidad biológica: las ecuaciones estándar no contemplan porcentaje graso exacto, masa magra, embarazo o patologías metabólicas.",
          "Supervisión médica: consulte a un médico colegiado o nutricionista acreditado antes de iniciar planes de entrenamiento exigentes o restricciones calóricas."
        ]
      },
      {
        "icon": "hammer",
        "title": "Calculadoras de Construcción y Replanteo",
        "badge": "Estimaciones de Obra",
        "badgeColor": "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
        "content": "Las calculadoras de edificación facilitan la estimación de hormigón, ladrillos, tarima o peldaños. Son mediciones orientativas, no proyectos de ejecución visados.",
        "points": [
          "Sin certificación técnica: los cálculos no sustituyen los proyectos y cálculos de estructuras firmados por un arquitecto o ingeniero cualificado.",
          "Normativa urbanística y técnica: las ordenanzas municipales y el Código Técnico de la Edificación fijan requisitos de obligado cumplimiento en obra.",
          "Variables reales de campo: las mermas de corte, la compactación del terreno y el clima alteran las cantidades reales. Verifique siempre en obra."
        ]
      },
      {
        "icon": "wrench",
        "title": "Utilidades Generales y Documentos",
        "badge": "Uso Tal Cual",
        "badgeColor": "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
        "content": "Las aplicaciones para archivos PDF, imágenes y código se suministran «tal cual». Conserve una copia original íntegra antes de convertir o editar archivos.",
        "points": [
          "Capacidad del navegador: documentos de gran tamaño pueden sobrepasar los recursos de memoria del navegador o detener el proceso.",
          "Copia de seguridad: guarde copias de respaldo de sus archivos antes de someterlos a transformaciones digitales.",
          "Formatos de intercambio estándar: las herramientas de CorelDRAW generan formatos universales (PDF, EPS, SVG) y no ficheros cerrados no verificados, tal como se detalla en sus páginas."
        ]
      }
    ],
    "footerNote": {
      "text": "Para conocer los fundamentos de nuestras fórmulas, revise nuestra Metodología. Si observa alguna discrepancia en los cálculos, comuníquenoslo en la página de contacto.",
      "linkText": "Metodología",
      "linkHref": "/methodology",
      "secondLinkText": "página de contacto",
      "secondLinkHref": "/contact"
    }
  },
  "de": {
    "title": "Haftungsausschluss und Berechnungshinweise – Navorika",
    "description": "Rechtliche Hinweise und Haftungsausschlüsse für Finanz-, Gesundheits-, Bau- und Dokumentenwerkzeuge von Navorika.",
    "eyebrow": "Rechtlicher Hinweis",
    "heroTitle": "Haftungsausschluss",
    "heroDescription": "Alle Berechnungen, Umrechnungsergebnisse und Hilfestellungen auf Navorika dienen ausschließlich Informations-, Orientierungs- und Lernzwecken.",
    "lastUpdatedLabel": "Zuletzt aktualisiert",
    "lastUpdated": "27. September 2026",
    "banner": {
      "variant": "amber",
      "text": "Alle Berechnungen, Werkzeuge und Leitfäden von Navorika dienen ausschließlich Informations- und Bildungszwecken. Sie stellen keine professionelle Beratung dar."
    },
    "sections": [
      {
        "icon": "trendingUp",
        "title": "Finanz- und Investitionsrechner",
        "badge": "Nur Planungsschätzungen",
        "badgeColor": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
        "content": "Finanzrechner sind Orientierungshilfen. Sie ermöglichen den Vergleich von Krediten, Sparplänen, Zinsen und Steuern, garantieren jedoch keine realen Marktergebnisse.",
        "points": [
          "Keine Finanzberatung: Die Resultate stellen keine Anlageberatung, rechtliche Würdigung oder steuerliche Gutachten dar.",
          "Dynamische Zinssätze und Gesetze: Zinssätze, Renditen, Freibeträge und Gesetze ändern sich kontinuierlich und beeinflussen das Endergebnis.",
          "Wichtige Entscheidungen: Prüfen Sie Originalkonditionen der Banken und konsultieren Sie bei wesentlichen Investitionen einen zertifizierten Steuer- oder Finanzberater."
        ]
      },
      {
        "icon": "heartPulse",
        "title": "Gesundheits- und Fitnessrechner",
        "badge": "Kein Medizinprodukt",
        "badgeColor": "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
        "content": "Module für BMI, Kalorienbedarf und Pulsbereiche nutzen etablierte Formeln. Sie liefern allgemeine statistische Richtwerte, keine medizinische Diagnose.",
        "points": [
          "Selbstkontrolle und Information: Diese Rechner dienen der persönlichen Trainingsplanung und können keine Krankheiten feststellen oder heilen.",
          "Individuelle Faktoren: Standardgleichungen erfassen Muskelmasse, Körperbau, Schwangerschaften oder Stoffwechselstörungen nur unzureichend.",
          "Ärztliche Abklärung: Sprechen Sie mit einem approbierten Arzt oder Ernährungswissenschaftler, bevor Sie intensive Diäten oder extremes Training aufnehmen."
        ]
      },
      {
        "icon": "hammer",
        "title": "Bau- und Konstruktionsrechner",
        "badge": "Praxisschätzungen",
        "badgeColor": "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
        "content": "Baurrechner schätzen Mengen für Beton, Mauerwerk, Treppenmaße oder Dämmung. Sie liefern Orientierungswerte, ersetzen jedoch keine geprüfte Statik.",
        "points": [
          "Keine baurechtliche Statik: Die Berechnungen ersetzen keine geprüften Ausführungspläne oder Nachweise von Statikern und Architekten.",
          "Bauvorschriften: Bauordnungen und DIN-Normen weisen regionale Unterschiede auf. Sämtliche Tragwerke müssen den lokalen Baugesetzen entsprechen.",
          "Praxisabweichungen: Verschnitt, Bodendichte, Witterung und Materialtoleranzen beeinflussen den tatsächlichen Materialbedarf. Stets vor Ort abgleichen."
        ]
      },
      {
        "icon": "wrench",
        "title": "Allgemeine Dienstprogramme und Dateitools",
        "badge": "Ohne Mängelgewähr",
        "badgeColor": "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
        "content": "PDF-Werkzeuge, Bildkonverter und Programmierer-Tools werden „wie besehen“ bereitgestellt. Bewahren Sie vor jeder Konvertierung eine Originalkopie auf.",
        "points": [
          "Browser-Grenzen: Sehr große Dateien können den Arbeitsspeicher des Browsers überlasten und zum Abbruch führen.",
          "Sicherungskopien: Halten Sie stets unberührte Originaldateien bereit, bevor Sie diese bearbeiten oder konvertieren.",
          "Offene Austauschformate: Spezifische CorelDRAW-Werkzeuge erstellen offene Standardformate (PDF, EPS, SVG) und keine unsicheren proprietären Dateien, wie auf den Seiten beschrieben."
        ]
      }
    ],
    "footerNote": {
      "text": "Technische Details zur Validierung der Formeln finden Sie in unserer Methodik. Bei Berechnungsfehlern nutzen Sie bitte unsere Kontaktseite.",
      "linkText": "Methodik",
      "linkHref": "/methodology",
      "secondLinkText": "Kontaktseite",
      "secondLinkHref": "/contact"
    }
  },
  "ru": {
    "title": "Отказ от ответственности и ограничения расчетов – Navorika",
    "description": "Правовые оговорки и ограничения для финансовых, медицинских, строительных и программных калькуляторов Navorika.",
    "eyebrow": "Правовые оговорки",
    "heroTitle": "Отказ от ответственности",
    "heroDescription": "Все расчеты, алгоритмы и инструкции на сайте Navorika предоставляются исключительно для ознакомительных, расчетных и образовательных целей.",
    "lastUpdatedLabel": "Последнее обновление",
    "lastUpdated": "27 сентября 2026 г.",
    "banner": {
      "variant": "amber",
      "text": "Все расчеты, инструменты и руководства Navorika предназначены только для информационных и образовательных целей. Они не являются профессиональными консультациями."
    },
    "sections": [
      {
        "icon": "trendingUp",
        "title": "Финансовые и инвестиционные калькуляторы",
        "badge": "Ориентировочные расчеты",
        "badgeColor": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
        "content": "Финансовые калькуляторы предназначены для сравнительного планирования кредитов, ипотеки, накоплений и налогов. Они не гарантируют фактическую доходность.",
        "points": [
          "Не является финансовой консультацией: результаты вычислений не являются юридическими, аудиторскими, налоговыми или инвестиционными рекомендациями.",
          "Изменение тарифов и правил: процентные ставки, инфляция, комиссии и налоговое законодательство меняются и влияют на реальные суммы выплат.",
          "Ответственные решения: уточняйте действующие условия в финансовых организациях и обращайтесь к сертифицированным экспертам перед крупными сделками."
        ]
      },
      {
        "icon": "heartPulse",
        "title": "Медицинские и спортивные калькуляторы",
        "badge": "Не является диагнозом",
        "badgeColor": "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
        "content": "Калькуляторы ИМТ, расхода калорий и зон пульса используют признанные математические формулы. Они отражают средние статистические оценки, а не клинический диагноз.",
        "points": [
          "Для самоконтроля: формулы служат для образовательных целей и контроля тренировок, но не предназначены для диагностики и лечения заболеваний.",
          "Индивидуальные особенности: общие формулы не учитывают точный состав тканей, объем мышц, беременность или хронические нарушения обмена веществ.",
          "Врачебная консультация: всегда консультируйтесь с квалифицированным врачом или диетологом перед началом строгих диет или интенсивных тренировок."
        ]
      },
      {
        "icon": "hammer",
        "title": "Строительные и инженерные калькуляторы",
        "badge": "Полевые расчеты",
        "badgeColor": "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
        "content": "Строительные калькуляторы помогают оценить объемы бетона, кирпича, пиломатериалов и геометрию конструкций. Это предварительные прикидки, а не проектная документация.",
        "points": [
          "Не заменяет инженерный проект: расчеты не могут заменять заверенные чертежи и расчеты несущих конструкций лицензированными инженерами.",
          "Строительные нормы и правила: требования СНиП, ГОСТ и местных регламентов обязательны к исполнению. Все нагрузки должны проверяться специалистами.",
          "Факторы реальной площадки: отходы при резке, усадка грунта, марка материалов и погода влияют на реальный расход. Всегда перепроверяйте объемы на объекте."
        ]
      },
      {
        "icon": "wrench",
        "title": "Утилиты для файлов и документов",
        "badge": "Без гарантий",
        "badgeColor": "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
        "content": "Инструменты для PDF, графики и текстовых файлов предоставляются по принципу «как есть». Обязательно сохраняйте резервную копию перед обработкой.",
        "points": [
          "Ограничения браузера: файлы очень большого объема могут исчерпать оперативную память браузера и привести к сбою вкладки.",
          "Резервное копирование: держите исходные файлы в сохранности перед проведением любых преобразований.",
          "Открытые форматы: конвертеры CorelDRAW создают совместимые открытые форматы (PDF, EPS, SVG), а не закрытые нативные файлы, что прямо указано на страницах."
        ]
      }
    ],
    "footerNote": {
      "text": "С подробным описанием формул и тестов можно ознакомиться на странице Методология. Если вы заметили ошибку в расчетах, напишите нам через страницу контактов.",
      "linkText": "Методология",
      "linkHref": "/methodology",
      "secondLinkText": "страницу контактов",
      "secondLinkHref": "/contact"
    }
  },
  "ar": {
    "title": "إخلاء المسؤولية القانونية والحسابية – Navorika",
    "description": "إخلاء المسؤولية عن الحسابات المالية والصحية والإنشائية وأدوات المستندات على منصة Navorika.",
    "eyebrow": "إخلاء المسؤولية",
    "heroTitle": "إخلاء المسؤولية القانونية",
    "heroDescription": "جميع الحسابات والمحولات والإرشادات المتوفرة على Navorika مقدمة لأغراض التخطيط والاسترشاد والتعليم فقط.",
    "lastUpdatedLabel": "آخر تحديث",
    "lastUpdated": "27 سبتمبر 2026",
    "banner": {
      "variant": "amber",
      "text": "جميع حسابات وأدوات ودلائل Navorika مقدمة لأغراض إعلامية وتعليمية فقط، ولا تمثل بأي حال استشارات مهنية معتمدة."
    },
    "sections": [
      {
        "icon": "trendingUp",
        "title": "حاسبات المال والاستثمار",
        "badge": "تقديرات تخطيطية فقط",
        "badgeColor": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
        "content": "الآلات الحاسبة المالية هي أدوات تخطيطية لمقارنة القروض والمدخرات والضرائب. وهي لا تتنبأ بالنتائج المالية الحقيقية ولا تضمنها.",
        "points": [
          "ليست مشورة مالية: النتائج الصادرة لا تشكل مشورة استثمارية أو قانونية أو محاسبية أو ضريبية معتمدة.",
          "تغير الأسعار واللوائح: أسعار الفائدة وعوائد الاستثمار والضرائب والرسوم تتغير باستمرار وتؤثر في النتائج الفعلية.",
          "القرارات المصيرية: تحقق من الأسعار والشروط المصرفية الحالية، واستشر مستشاراً مالياً مؤهلاً قبل اتخاذ أي قرارات مالية كبرى."
        ]
      },
      {
        "icon": "heartPulse",
        "title": "حاسبات الصحة واللياقة البدنية",
        "badge": "ليست مشورة طبية",
        "badgeColor": "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
        "content": "تعتمد أدوات مؤشر كتلة الجسم واحتياج السعرات على معادلات علمية عامة. إنها تقديرات إحصائية استرشادية وليست تشخيصاً طبياً.",
        "points": [
          "للمتابعة الذاتية فقط: هذه الحسابات مخصصة للتثقيف الرياضي ومتابعة التمارين، ولا تعالج أو تقي من أي أمراض.",
          "اختلاف الأجسام: المعادلات العامة لا تأخذ في الحسبان الكتلة العضلية الدقيقة، أو الحمل، أو الأدوية، أو الحالات الصحية الفردية.",
          "استشارة الطبيب: استشر دائماً طبيباً مرخصاً أو أخصائي تغذية معتمداً قبل الشروع في حميات غذائية قاسية أو تمارين شاقة."
        ]
      },
      {
        "icon": "hammer",
        "title": "حاسبات البناء والأعمال الإنشائية",
        "badge": "تقديرات ميدانية فقط",
        "badgeColor": "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
        "content": "تساعد حاسبات البناء في تقدير كميات الخرسانة، والطوب، والأرضيات، والسلالم. وهي تقديرات مبدئية ولا تمثل مخططات معتمدة للتنفيذ.",
        "points": [
          "ليست بديلاً عن الهندسة المعتمدة: لا تغني هذه الحسابات عن المخططات المعمارية والحسابات الإنشائية المعتمدة من مهندس مرخص.",
          "الامتثال لكود البناء: تختلف متطلبات البناء حسب الدولة والبلدية. يجب أن تتوافق جميع الأحمال والتسليح مع كود البناء المعتمد.",
          "ظروف الموقع الواقعية: الهدر أثناء القص ونوعية التربة والمناخ تؤثر في الكميات المستهلكة. تحقق دائماً من القياسات في الموقع."
        ]
      },
      {
        "icon": "wrench",
        "title": "الأدوات العامة ومعالجة الملفات",
        "badge": "على حالتها الراهنة",
        "badgeColor": "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
        "content": "أدوات PDF ومحولات الصور والرموز البرمجية مقدمة على حالتها دون أي ضمانات. احتفظ دائماً بنسخة أصلية من ملفاتك قبل معالجتها.",
        "points": [
          "حدود المتصفح: قد تواجه الملفات الضخمة حدوداً في ذاكرة المتصفح مما قد يؤدي إلى بطء المعالجة أو توقف الصفحة.",
          "احفظ النسخ الأصلية: احرص دائماً على أخذ نسخة احتياطية من ملفاتك وصورك ومستنداتك قبل البدء بالتحويل.",
          "تنسيقات تبادل مفتوحة: أدوات CorelDRAW المتخصصة تنتج ملفات قياسية مفتوحة (PDF, EPS, SVG) لتسهيل الاستيراد وليس ملفات مغلقة مجهولة، كما هو موضح في صفحاتها."
        ]
      }
    ],
    "footerNote": {
      "text": "للاطلاع على الأسس العلمية والمعايير الرياضية، راجع صفحة المنهجية. إذا لاحظت أي تفاوت في النتائج، يرجى إبلاغنا عبر صفحة الاتصال بنا.",
      "linkText": "المنهجية",
      "linkHref": "/methodology",
      "secondLinkText": "صفحة الاتصال بنا",
      "secondLinkHref": "/contact"
    }
  }
};

export const methodologyContent: Record<Locale | 'en', TrustPageContent> = {
  "en": {
    "title": "How Our Calculators Work – Formulas, Sources & Testing – Navorika",
    "description": "Learn how Navorika chooses calculator formulas, uses data sources, handles files, tests results, and explains important tool limitations.",
    "eyebrow": "Engineering Standards",
    "heroTitle": "How Navorika Calculators & Tools Work",
    "heroDescription": "How we choose formulas, handle files and data, test results, and explain the limits of our tools.",
    "lastUpdatedLabel": "Last updated",
    "lastUpdated": "September 27, 2026",
    "banner": {
      "variant": "indigo",
      "text": "How we choose formulas, handle files and data, test results, and explain the limits of our tools."
    },
    "sections": [
      {
        "icon": "cpu",
        "title": "1. How Browser-Based Tools Handle Your Data",
        "content": "Most tools run in your browser so your files and inputs can stay on your device.",
        "points": [
          "Most tools run in your browser: PDF tools, image converters, calculators, and many developer utilities use browser technology such as JavaScript, WebAssembly, and built-in browser APIs.",
          "Files usually stay on your device: when a tool is marked as browser-local, files and entered values are processed in your browser memory and are not uploaded to or stored on Navorika servers.",
          "Technical details: document tools may use libraries such as pdf-lib and pdf.js, image tools may use HTML Canvas, and security-related tools may use the browser’s Web Cryptography API."
        ]
      },
      {
        "icon": "server",
        "title": "2. When a Tool Needs Our Server",
        "content": "A small number of specialized conversions need temporary server processing.",
        "points": [
          "Some formats need server software: specialized conversions such as STEP CAD to 3D PDF and some CorelDRAW-related conversions cannot be completed entirely inside a normal web browser.",
          "Temporary processing: server-assisted conversions run in a temporary isolated workspace created for the request.",
          "Files are not kept as a library: input and output files are removed after the conversion finishes or fails. Navorika does not offer permanent document storage for these conversions."
        ]
      },
      {
        "icon": "calculator",
        "title": "3. How Calculator Formulas Are Chosen",
        "content": "We use documented formulas, official rules, and recognized reference methods where they apply.",
        "points": [
          "Money calculators: loan-payment tools use standard amortization formulas. Savings and investment tools use standard growth formulas. Tax calculators use the published rules and thresholds described on the relevant tool pages.",
          "Health and fitness calculators: tools use published equations such as Mifflin-St Jeor for BMR and established activity or heart-rate methods where appropriate. These are estimates, not medical diagnoses.",
          "Construction calculators: quantity tools use measurements such as length × width × depth, along with stated material assumptions. Where a tool refers to a building-code rule or structural limit, the relevant source or limitation should be shown on the page."
        ]
      },
      {
        "icon": "globe",
        "title": "4. When a Tool Uses Live Data",
        "content": "Tools that need current information clearly identify the outside data source they use.",
        "points": [
          "Currency converter: the tool uses published reference exchange-rate data and shows the date or time of the rate used when that information is available.",
          "Only the information needed for the request is sent to the data source; the calculation history is not intentionally included as part of the rate lookup."
        ]
      },
      {
        "icon": "checkCircle2",
        "title": "5. How We Test Calculators and Converters",
        "content": "Automated tests help catch wrong results, broken conversions, and unusual input problems.",
        "points": [
          "Calculation tests: automated tests check common examples, zero values, limits, and invalid inputs so mistakes can be found before deployment.",
          "Rounding checks: calculator outputs are rounded in controlled ways so normal computer math does not show distracting values such as 0.30000000000000004.",
          "Security checks: tools that handle HTML or other active content are tested to reduce unsafe scripts, links, or other active behavior before rendering."
        ]
      },
      {
        "icon": "alertCircle",
        "title": "6. Limits You Should Know About",
        "content": "Browser tools and automated estimates have practical limits that can affect results.",
        "points": [
          "Very large files: huge PDFs or images can use more memory than a browser tab or mobile device can handle, which may cause a tool to slow down or fail.",
          "Very large images: browsers place limits on the image sizes they can process in memory. A tool may need to reduce or reject an image that exceeds those browser limits.",
          "Image metadata: converting or re-encoding an image can remove camera EXIF data, GPS information, or color profiles unless a tool specifically preserves them.",
          "CorelDRAW conversions: some tools prepare PDF, SVG, or EPS files that CorelDRAW can import rather than creating a native CDR file. Each affected tool explains the actual output."
        ]
      },
      {
        "icon": "refreshCw",
        "title": "7. How We Review and Update Tools",
        "content": "We review formulas, rules, dependencies, and reported problems as tools are maintained.",
        "points": [
          "Rules that change: tax and retirement tools are reviewed when relevant published rules or annual thresholds change.",
          "Software maintenance: third-party libraries and browser dependencies are updated as needed for security fixes and compatibility.",
          "Report a problem: users can contact us when a result, formula, or tool behavior looks wrong so it can be reviewed."
        ]
      }
    ],
    "footerNote": {
      "text": "Review our Legal Disclaimer for important limitations. To report a wrong result or tool problem, use the contact page.",
      "linkText": "Legal Disclaimer",
      "linkHref": "/disclaimer",
      "secondLinkText": "contact page",
      "secondLinkHref": "/contact"
    }
  },
  "fr": {
    "title": "Méthodologie et Conception des Calculateurs – Navorika",
    "description": "Comprenez le choix des formules mathématiques, le traitement local des données, les tests automatisés et les limites techniques sur Navorika.",
    "eyebrow": "Normes d'Ingénierie",
    "heroTitle": "Méthodologie des Outils Navorika",
    "heroDescription": "Découvrez comment nous sélectionnons les formules, gérons vos données, vérifions les résultats et documentons les limites techniques.",
    "lastUpdatedLabel": "Dernière mise à jour",
    "lastUpdated": "27 septembre 2026",
    "banner": {
      "variant": "indigo",
      "text": "Comment nous choisissons les formules, traitons les fichiers, testons les résultats et expliquons les limites de nos outils."
    },
    "sections": [
      {
        "icon": "cpu",
        "title": "1. Traitement des données dans le navigateur",
        "content": "La plupart des outils s'exécutent localement afin que vos fichiers et saisies demeurent sur votre appareil.",
        "points": [
          "Exécution locale : les utilitaires PDF, convertisseurs d'images, calculatrices et outils de développement s'appuient sur les standards web (JavaScript, WebAssembly, API HTML5).",
          "Préservation de la confidentialité : lorsque l'outil est marqué « traitement local », les calculs s'opèrent dans la mémoire vive de votre navigateur sans aucun transfert vers nos serveurs.",
          "Détails techniques : les documents PDF sont manipulés par des librairies clientes comme pdf-lib et pdf.js, les images via Canvas, et les fonctions cryptographiques via la Web Cryptography API."
        ]
      },
      {
        "icon": "server",
        "title": "2. Quand un outil requiert notre serveur",
        "content": "Un nombre restreint de conversions industrielles complexes nécessite un traitement éphémère sur serveur.",
        "points": [
          "Formats exigeant des logiciels serveurs : les conversions avancées (comme la CAO STEP vers 3D PDF ou certains filtres CorelDRAW) ne peuvent pas être finalisées dans un navigateur ordinaire.",
          "Environnements éphémères : ces tâches s'exécutent dans un espace de travail temporaire et strictement isolé créé pour chaque requête.",
          "Destruction immédiate : les fichiers d'entrée et de sortie sont purgés dès la fin de l'opération. Navorika n'assure aucun stockage de fichiers."
        ]
      },
      {
        "icon": "calculator",
        "title": "3. Choix des formules de calcul",
        "content": "Nous employons des formules documentées, des règles institutionnelles et les normes reconnues de chaque discipline.",
        "points": [
          "Finances : les calculs de prêt appliquent les formules d'amortissement standard. L'épargne suit les règles de composition d'intérêts et les simulateurs fiscaux intègrent les barèmes officiels publiés.",
          "Santé et forme : les besoins énergétiques exploitent des équations scientifiques établies (ex. Mifflin-St Jeor). Il s'agit d'estimations biométriques et non de diagnostics médicaux.",
          "Bâtiment et chantier : les métrés s'appuient sur les calculs de volumes (L × l × h) assortis d'hypothèses de foisonnement et de chutes usuelles de la profession."
        ]
      },
      {
        "icon": "globe",
        "title": "4. Utilisation de données en direct",
        "content": "Les outils dépendant d'informations en temps réel identifient clairement la source externe sollicitée.",
        "points": [
          "Convertisseur de devises : l'outil interroge des cours de référence publiés et affiche la date ou l'heure de la cotation retenue.",
          "Seules les données indispensables à la requête de conversion sont transmises, sans journaliser votre historique de navigation."
        ]
      },
      {
        "icon": "checkCircle2",
        "title": "5. Protocoles de test et de validation",
        "content": "Des suites de tests automatisés détectent les anomalies mathématiques, les régressions et les cas limites.",
        "points": [
          "Tests unitaires : nous vérifions des exemples réels, des valeurs nulles, des limites géométriques et des saisies atypiques avant tout déploiement.",
          "Gestion des arrondis : les résultats numériques sont arrondis avec précision pour éviter les anomalies de calcul flottant (ex. 0,30000000000000004).",
          "Sécurité du code : les outils traitant du code ou du HTML sont éprouvés pour éliminer les scripts malveillants avant tout affichage."
        ]
      },
      {
        "icon": "alertCircle",
        "title": "6. Limites techniques à connaître",
        "content": "Les technologies clientes et les estimations statistiques comportent des limites pratiques réelles.",
        "points": [
          "Fichiers volumineux : des PDF ou images de taille exceptionnelle peuvent dépasser la mémoire allouée à l'onglet du navigateur.",
          "Dimensions d'images extrêmes : les navigateurs imposent des plafonds stricts en pixels pour les manipulations sur Canvas en mémoire.",
          "Métadonnées graphiques : certaines réencodages d'images retirent les métadonnées EXIF ou GPS, sauf lorsque l'outil est spécifiquement conçu pour les préserver.",
          "Conversions CorelDRAW : nos outils préparent des fichiers vectoriels universels (PDF, SVG, EPS) prêts pour l'import dans CorelDRAW plutôt que des fichiers natifs CDR instables."
        ]
      },
      {
        "icon": "refreshCw",
        "title": "7. Révision et maintenance continue",
        "content": "Nous actualisons nos formules, nos barèmes et nos dépendances techniques au fil des évolutions réglementaires.",
        "points": [
          "Évolutions légales : les calculs fiscaux et de retraite sont réexaminés lors de la parution des barèmes annuels officiels.",
          "Maintenance logicielle : les librairies open-source et les dépendances du navigateur sont mises à jour pour combler les failles de sécurité.",
          "Signalement d'erreurs : les retours de nos utilisateurs permettent de corriger rapidement toute ambiguïté ou divergence de calcul."
        ]
      }
    ],
    "footerNote": {
      "text": "Consultez notre Avertissement Légal pour connaître les limites de responsabilité. Pour signaler un problème de calcul, utilisez notre page de contact.",
      "linkText": "Avertissement Légal",
      "linkHref": "/disclaimer",
      "secondLinkText": "page de contact",
      "secondLinkHref": "/contact"
    }
  },
  "it": {
    "title": "Metodologia dei Calcoli e Standard di Test – Navorika",
    "description": "Come Navorika seleziona le formule, gestisce l'elaborazione locale, esegue test automatizzati e documenta i limiti dei calcolatori.",
    "eyebrow": "Standard di Ingegneria",
    "heroTitle": "Metodologia degli Strumenti Navorika",
    "heroDescription": "La trasparenza delle nostre formule matematiche, la gestione protetta dei dati e i criteri di test automatizzati.",
    "lastUpdatedLabel": "Ultimo aggiornamento",
    "lastUpdated": "27 settembre 2026",
    "banner": {
      "variant": "indigo",
      "text": "Come scegliamo le formule, trattiamo i dati, collaudiamo i risultati e spieghiamo i limiti dei nostri strumenti."
    },
    "sections": [
      {
        "icon": "cpu",
        "title": "1. Elaborazione locale nel browser",
        "content": "La maggior parte degli strumenti viene eseguita interamente sul tuo dispositivo per proteggere i tuoi file.",
        "points": [
          "Elaborazione sul client: convertitori di file, calcolatori e utilità web sfruttano le funzionalità avanzate del browser (JavaScript, WebAssembly e API DOM).",
          "Nessun trasferimento dati: con l'elaborazione locale i file restano nella memoria temporanea del computer e non raggiungono i nostri server.",
          "Tecnologie applicate: i PDF sono gestiti con librerie come pdf-lib e pdf.js, le immagini tramite Canvas HTML5 e la sicurezza con la Web Cryptography API."
        ]
      },
      {
        "icon": "server",
        "title": "2. Quando è necessario il server",
        "content": "Un numero limitato di conversioni grafiche avanzate fa ricorso a un passaggio server temporaneo.",
        "points": [
          "Esigenze software: conversioni specialistiche (come i file CAD STEP verso PDF 3D o filtri CorelDRAW) non possono operare solo nel browser.",
          "Aree di memoria isolate: l'operazione avviene in ambienti temporanei ed ermetici creati ad hoc per il singolo comando.",
          "Cancellazione rapida: i documenti caricati e generati vengono cancellati subito al termine del processo. Nessun archivio viene conservato."
        ]
      },
      {
        "icon": "calculator",
        "title": "3. Criteri di scelta delle formule",
        "content": "Applichiamo equazioni scientifiche verificate, prassi di settore e formule matematiche consolidate.",
        "points": [
          "Calcoli finanziari: per prestiti e mutui utilizziamo l'ammortamento alla francese; per investimenti e imposte usiamo le tabelle di riferimento ufficiali.",
          "Salute e nutrizione: calcoliamo il dispendio energetico basale tramite equazioni note (Mifflin-St Jeor), fornendo stime orientative.",
          "Edilizia: i calcoli volumetrici per calcestruzzo e muratura includono fattori di sfrido e percentuali di riserva standard di cantiere."
        ]
      },
      {
        "icon": "globe",
        "title": "4. Strumenti con dati esterni in tempo reale",
        "content": "Le utility che richiedono dati dinamici indicano sempre l'origine dei flussi informativi.",
        "points": [
          "Convertitore di valuta: utilizza tassi di cambio pubblicati da fonti primarie e riporta la data dell'ultimo aggiornamento disponibile.",
          "La richiesta al servizio esterno trasmette esclusivamente la coppia di valute senza alcuna cronologia associata."
        ]
      },
      {
        "icon": "checkCircle2",
        "title": "5. Collaudo e verifica del software",
        "content": "Batterie di test automatici monitorano l'accuratezza dei risultati numerici e prevengono anomalie.",
        "points": [
          "Test di regressione: verifichiamo casi limite, valori nulli e parametri estremi prima di ogni pubblicazione in produzione.",
          "Arrotondamenti controllati: applichiamo filtri per evitare artefatti del calcolo in virgola mobile (es. 0.30000000000000004).",
          "Sanitizzazione del codice: tutti i contenuti attivi e il markup HTML vengono bonificati per escludere script pericolosi."
        ]
      },
      {
        "icon": "alertCircle",
        "title": "6. Limiti tecnici operativi",
        "content": "L'elaborazione locale e le stime automatiche comportano vincoli oggettivi da tenere in considerazione.",
        "points": [
          "File molto pesanti: documenti di grande mole possono saturare la memoria del browser provocando rallentamenti.",
          "Risoluzioni elevate: i browser applicano restrizioni sul numero massimo di pixel gestibili contemporaneamente su Canvas.",
          "Metadati fotografici: la ricodifica di immagini può comportare la rimozione dei profili colore o dei dati EXIF originali.",
          "Compatibilità CorelDRAW: prepariamo file di interscambio aperti (PDF, EPS, SVG) pronti per l'importazione, evitando file proprietari CDR нестаbili."
        ]
      },
      {
        "icon": "refreshCw",
        "title": "7. Aggiornamento e manutenzione",
        "content": "Rivediamo costantemente le logiche di calcolo e i componenti di sistema per garantire affidabilità.",
        "points": [
          "Adeguamento normativo: le formule fiscali vengono ricalibrate all'aggiornamento dei parametri annuali.",
          "Manutenzione dipendenze: aggiorniamo i moduli di terze parti per garantire la massima sicurezza crittografica.",
          "Feedback degli utenti: esaminiamo prontamente le segnalazioni per perfezionare le utility."
        ]
      }
    ],
    "footerNote": {
      "text": "Consulta le nostre Note Legali per i dettagli di responsabilità. Per segnalare discrepanze o proporre miglioramenti, visita la pagina dei contatti.",
      "linkText": "Note Legali",
      "linkHref": "/disclaimer",
      "secondLinkText": "pagina dei contatti",
      "secondLinkHref": "/contact"
    }
  },
  "pt": {
    "title": "Metodologia e Validação de Cálculos – Navorika",
    "description": "Como a Navorika seleciona fórmulas, executa processamento local no navegador, conduz testes e define limitações práticas.",
    "eyebrow": "Critérios de Engenharia",
    "heroTitle": "Metodologia das Ferramentas Navorika",
    "heroDescription": "Conheça como definimos fórmulas, tratamos os ficheiros com segurança, testamos os resultados e esclarecemos as limitações.",
    "lastUpdatedLabel": "Última atualização",
    "lastUpdated": "27 de setembro de 2026",
    "banner": {
      "variant": "indigo",
      "text": "Como escolhemos as fórmulas, tratamos ficheiros e dados, testamos os resultados e explicamos os limites práticos das ferramentas."
    },
    "sections": [
      {
        "icon": "cpu",
        "title": "1. Processamento de dados no navegador",
        "content": "A generalidade das ferramentas funciona localmente no seu computador para garantir privacidade total.",
        "points": [
          "Execução local no cliente: utilitários de PDF, conversores de formatos gráficos e calculadoras tiram partido de JavaScript e WebAssembly.",
          "Dados seguros na sua máquina: nas ferramentas com processamento local, os ficheiros nunca são descarregados para servidores externos.",
          "Bibliotecas integradas: utilizamos pdf-lib e pdf.js para documentos, Canvas para gráficos e a Web Cryptography API para funções de segurança."
        ]
      },
      {
        "icon": "server",
        "title": "2. Tarefas que exigem o servidor",
        "content": "Um número estrito de conversões com formatos avançados necessita de apoio transitório no servidor.",
        "points": [
          "Formatos proprietários complexos: conversões de CAD STEP em PDF 3D ou rotinas CorelDRAW requerem ferramentas que não correm nativamente no browser.",
          "Processamento efémero: os ficheiros são acolhidos em espaços isolados criados exclusivamente para responder ao pedido.",
          "Eliminação sistemática: tanto os originais como os ficheiros convertidos são eliminados assim que a operação finda."
        ]
      },
      {
        "icon": "calculator",
        "title": "3. Seleção de fórmulas de cálculo",
        "content": "Aplicamos metodologias documentadas, regulamentos vigentes e normas padronizadas.",
        "points": [
          "Cálculos financeiros: utilizamos amortização padrão em empréstimos e fórmulas de juros compostos com base nas tabelas legais vigentes.",
          "Saúde e métricas físicas: baseamo-nos em equações científicas amplamente citadas (ex.: Mifflin-St Jeor) com fins estritamente informativos.",
          "Construção civil: os volumes consideram cubagens geométricas (comprimento × largura × altura) e margens típicas de desperdício em obra."
        ]
      },
      {
        "icon": "globe",
        "title": "4. Ferramentas dependentes de dados em tempo real",
        "content": "Os utilitários que requerem indicadores atualizados identificam a entidade de dados externa.",
        "points": [
          "Conversor de moedas: consulta taxas de câmbio de referência e apresenta o momento exato da cotação aplicada.",
          "Apenas os dados estritamente necessários ao cálculo cambial são enviados na requisição, sem associação a dados pessoais."
        ]
      },
      {
        "icon": "checkCircle2",
        "title": "5. Protocolos de teste e aferição",
        "content": "Conjuntos abrangentes de testes automáticos validam a precisão das equações e previnem erros.",
        "points": [
          "Testes exaustivos: avaliamos exemplos práticos, valores nulos e entradas de limite antes de cada nova publicação de código.",
          "Precisão de arredondamento: aplicamos tratamento numérico específico para evitar discrepâncias em vírgula flutuante (ex.: 0.30000000000000004).",
          "Sanitização de segurança: todo o conteúdo gerado é higienizado para eliminar a injeção inadvertida de scripts."
        ]
      },
      {
        "icon": "alertCircle",
        "title": "6. Limitações técnicas objetivas",
        "content": "As capacidades do navegador e as estimativas automáticas possuem limites que devem ser compreendidos.",
        "points": [
          "Ficheiros pesados: documentos PDF ou imagens com dezenas de megabytes podem esgotar a memória do navegador no telemóvel.",
          "Dimensões gráficas: os motores dos navegadores colocam limites na área máxima de píxeis manuseada em Canvas.",
          "Metadados de imagem: a conversão entre formatos pode remover etiquetas EXIF ou perfis de cor caso o formato não os suporte.",
          "Compatibilidade CorelDRAW: criamos ficheiros de intercâmbio de normas abertas (PDF, SVG, EPS) que o CorelDRAW importa diretamente, evitando ficheiros CDR adulterados."
        ]
      },
      {
        "icon": "refreshCw",
        "title": "7. Revisão e atualização sistemática",
        "content": "Acompanhamos a evolução normativa e mantemos os nossos algoritmos alinhados com as melhores práticas.",
        "points": [
          "Adaptação a regras fiscais: ajustamos limites e deduções fiscais anualmente com a divulgação dos orçamentos.",
          "Segurança tecnológica: atualizamos bibliotecas externas de software com regularidade para prevenir vulnerabilidades.",
          "Comunicação de incongruências: os utilizadores podem indicar qualquer divergência detetada para análise e correção imediata."
        ]
      }
    ],
    "footerNote": {
      "text": "Leia o nosso Aviso Legal para conhecer os limites de responsabilidade. Para comunicar alguma discrepância matemática, contacte-nos através da página de contacto.",
      "linkText": "Aviso Legal",
      "linkHref": "/disclaimer",
      "secondLinkText": "página de contacto",
      "secondLinkHref": "/contact"
    }
  },
  "es": {
    "title": "Metodología de Cálculo y Estándares de Validación – Navorika",
    "description": "Conozca cómo selecciona Navorika las fórmulas, cómo opera la computación local en navegador, los ensayos de software y sus límites.",
    "eyebrow": "Normas de Ingeniería",
    "heroTitle": "Metodología de las Herramientas Navorika",
    "heroDescription": "Detalles técnicos sobre la elección de algoritmos, la protección de archivos, los ensayos automatizados y los límites funcionales.",
    "lastUpdatedLabel": "Última actualización",
    "lastUpdated": "27 de septiembre de 2026",
    "banner": {
      "variant": "indigo",
      "text": "Cómo elegimos las fórmulas, procesamos los archivos y datos, evaluamos los resultados y explicamos los límites de nuestras herramientas."
    },
    "sections": [
      {
        "icon": "cpu",
        "title": "1. Procesamiento local en el navegador",
        "content": "La mayoría de herramientas se ejecutan en su navegador para que sus archivos no salgan de su equipo.",
        "points": [
          "Ejecución en cliente: las herramientas de documentos, conversores gráficos y calculadoras se basan en tecnologías nativas (JavaScript, WebAssembly, Canvas).",
          "Privacidad efectiva: con el modo local, los archivos se procesan en la memoria de su navegador y nunca se cargan en los servidores de Navorika.",
          "Herramientas especializadas: los PDF se manipulan con pdf-lib y pdf.js, las imágenes con Canvas y las funciones de cifrado con la Web Cryptography API."
        ]
      },
      {
        "icon": "server",
        "title": "2. Cuándo se requiere procesamiento en servidor",
        "content": "Un reducido número de conversiones de formatos gráficos complejos precisa de un servidor temporal.",
        "points": [
          "Formatos propietarios específicos: operaciones como CAD STEP a PDF 3D o filtros de CorelDRAW requieren software no reproducible íntegramente en el navegador.",
          "Áreas de trabajo temporales: el proceso se ejecuta en un directorio transitorio y estrictamente aislado para atender la solicitud.",
          "Borrado automático inmediato: los archivos de origen y los convertidos se eliminan en cuanto concluye la operación."
        ]
      },
      {
        "icon": "calculator",
        "title": "3. Elección de las fórmulas matemáticas",
        "content": "Adoptamos ecuaciones estandarizadas, referencias técnicas reconocidas y baremos oficiales.",
        "points": [
          "Área financiera: las hipotecas aplican el sistema de amortización estándar y los ahorros se calculan con fórmulas de interés compuesto y reglas fiscales públicas.",
          "Salud y condición física: empleamos ecuaciones biométricas documentadas (como Mifflin-St Jeor), aclarando su carácter puramente estimativo.",
          "Construcción y obras: los cómputos métricos integran dimensiones reales (largo × ancho × alto) y mermas razonables aceptadas en el sector."
        ]
      },
      {
        "icon": "globe",
        "title": "4. Herramientas con fuentes de datos en vivo",
        "content": "Las calculadoras que necesitan datos de mercado en tiempo real identifican la fuente suministradora.",
        "points": [
          "Conversor de monedas: toma tipos de cambio de referencia consolidados y muestra la fecha y hora de la última cotización.",
          "La solicitud a la API externa únicamente transmite las divisas a convertir, sin vincular historial ni identificadores personales."
        ]
      },
      {
        "icon": "checkCircle2",
        "title": "5. Protocolos de prueba y ensayos automáticos",
        "content": "Pruebas de regresión sistemáticas verifican la exactitud de cada algoritmo antes de su despliegue.",
        "points": [
          "Baterías de pruebas: evaluamos valores cero, límites máximos de escala y entradas incorrectas para garantizar la solidez de los cálculos.",
          "Control de redondeo: estandarizamos el tratamiento numérico para neutralizar imprecisiones derivadas de la coma flotante (ej.: 0.30000000000000004).",
          "Filtros de seguridad: todos los datos en pantalla se desinfectan para imposibilitar la inyección de secuencias de comandos no seguras."
        ]
      },
      {
        "icon": "alertCircle",
        "title": "6. Límites prácticos que debe considerar",
        "content": "El entorno del navegador y las fórmulas estadísticas imponen condicionantes objetivos.",
        "points": [
          "Archivos de gran volumen: PDFs o imágenes muy densas pueden superar la memoria RAM asignada a la pestaña de su navegador.",
          "Dimensiones de imagen extremas: los navegadores imponen topes estrictos a los píxeles que pueden gestionarse simultáneamente.",
          "Metadatos: transformar formatos de imagen puede prescindir de datos EXIF o etiquetas GPS si el estándar de destino no los admite.",
          "Formatos de CorelDRAW: preparamos archivos vectoriales abiertos (PDF, SVG, EPS) plenamente compatibles con la importación en CorelDRAW en lugar de ficheros nativos problemáticos."
        ]
      },
      {
        "icon": "refreshCw",
        "title": "7. Revisión y actualización continua",
        "content": "Auditamos periódicamente nuestros algoritmos y dependencias para mantenerlos siempre al día.",
        "points": [
          "Cambios en la legislación: las herramientas fiscales y de jubilación se actualizan con la publicación de nuevos baremos oficiales.",
          "Actualización de librerías: renovamos periódicamente los componentes de código abierto para preservar la máxima seguridad.",
          "Notificación de erratas: invitamos a los usuarios a comunicarnos cualquier discrepancia detectada para su pronta revisión."
        ]
      }
    ],
    "footerNote": {
      "text": "Revise nuestro Descargo de Responsabilidad para conocer las limitaciones jurídicas. Para comunicar un error de cálculo, utilice la página de contacto.",
      "linkText": "Descargo de Responsabilidad",
      "linkHref": "/disclaimer",
      "secondLinkText": "página de contacto",
      "secondLinkHref": "/contact"
    }
  },
  "de": {
    "title": "Berechnungsmethodik und Prüfstandards – Navorika",
    "description": "Erfahren Sie, wie Navorika Berechnungsformeln festlegt, lokale Browser-Ausführung gewährleistet, automatisierte Tests durchführt und Leistungsgrenzen dokumentiert.",
    "eyebrow": "Technische Standards",
    "heroTitle": "Methodik der Navorika-Werkzeuge",
    "heroDescription": "Transparenz über unsere mathematischen Modelle, die lokale Datenverarbeitung, Prüfroutinen und praktische Grenzen.",
    "lastUpdatedLabel": "Zuletzt aktualisiert",
    "lastUpdated": "27. September 2026",
    "banner": {
      "variant": "indigo",
      "text": "Wie wir Formeln auswählen, Dateien und Daten behandeln, Rechenergebnisse testen und praktische Werkzeuggrenzen offenlegen."
    },
    "sections": [
      {
        "icon": "cpu",
        "title": "1. Datenverarbeitung im Browser",
        "content": "Die meisten Werkzeuge laufen lokal auf Ihrem Endgerät, damit Ihre Dokumente privat bleiben.",
        "points": [
          "Lokale Ausführung: PDF-Werkzeuge, Bildkonverter und Rechner nutzen native Browsertechnologien wie JavaScript, Canvas und WebAssembly.",
          "Vollständige Datensicherheit: Bei lokal arbeitenden Werkzeugen werden Ihre Dokumente und Eingabewerte niemals an Navorika-Server gesendet.",
          "Eingesetzte Komponenten: Für PDF-Aufgaben nutzen wir Bibliotheken wie pdf-lib und pdf.js, für Sicherheitsprüfungen die Web Cryptography API."
        ]
      },
      {
        "icon": "server",
        "title": "2. Wann Serverunterstützung erforderlich ist",
        "content": "Ein kleiner Teil anspruchsvoller Konvertierungen benötigt eine temporäre serverseitige Verarbeitung.",
        "points": [
          "Komplexe Industrieformate: Umwandlungen wie CAD STEP in 3D-PDF oder spezielle CorelDRAW-Filter lassen sich nicht vollständig im Browser realisieren.",
          "Isolierte Arbeitsbereiche: Serverseitige Konvertierungen laufen in temporären, strikt isolierten Verzeichnissen.",
          "Sofortige Löschung: Hochgeladene und generierte Dateien werden nach Abschluss der Anfrage sofort rückstandslos gelöscht."
        ]
      },
      {
        "icon": "calculator",
        "title": "3. Auswahl der Berechnungsformeln",
        "content": "Wir stützen uns auf dokumentierte mathematische Standards, DIN-Vorgaben und offizielle Richtlinien.",
        "points": [
          "Finanzrechner: Kreditrechner nutzen standardisierte Annuitätenformeln, Sparrechner Zinseszinsformeln und Steuerrechner amtliche Steuertarife.",
          "Gesundheit und Fitness: Wir wenden bewährte physiologische Modelle an (wie die Mifflin-St. Jeor-Gleichung) und kennzeichnen diese als Richtwerte.",
          "Bau- und Handwerksrechner: Mengenermittlungen basieren auf geometrischen Berechnungen unter Berücksichtigung branchenüblicher Materialzuschläge."
        ]
      },
      {
        "icon": "globe",
        "title": "4. Werkzeuge mit externen Live-Daten",
        "content": "Werkzeuge, die auf tagesaktuelle Marktinformationen angewiesen sind, benennen die jeweilige Quelle.",
        "points": [
          "Währungsrechner: Er ruft anerkannte Referenzkurse ab und zeigt das Datum bzw. den Zeitstempel des verwendeten Kurses an.",
          "Es werden ausschließlich die für den Währungsumtausch erforderlichen Daten übermittelt; ein Abrufverlauf wird nicht gespeichert."
        ]
      },
      {
        "icon": "checkCircle2",
        "title": "5. Automatisierte Testverfahren",
        "content": "Systematische Softwaretests stellen die mathematische Präzision sicher und verhindern Berechnungsfehler.",
        "points": [
          "Unit-Tests: Wir prüfen Rechner mit Standardbeispielen, Grenzwerten, Nullwerten und fehlerhaften Eingaben vor jeder Freigabe.",
          "Rundungsgenauigkeit: Numerische Ausgaben werden kontrolliert gerundet, um Gleitkomma-Ungenauigkeiten (z. B. 0.30000000000000004) zu vermeiden.",
          "Sicherheitsfilter: Inhalte werden vor der Anzeige im Browser gefiltert, um die Ausführung von Schadcode auszuschließen."
        ]
      },
      {
        "icon": "alertCircle",
        "title": "6. Praktische Leistungsgrenzen",
        "content": "Browserbasierte Tools und mathematische Schätzungen unterliegen technischen Rahmenbedingungen.",
        "points": [
          "Dateigrößen: Sehr große PDF-Dokumente oder hochauflösende Grafiken können den Arbeitsspeicher des Browser-Tabs erschöpfen.",
          "Bildauflösung: Webbrowser setzen Obergrenzen für die maximale Pixelanzahl, die gleichzeitig im Speicher gehalten werden kann.",
          "Metadaten: Bei der Umwandlung von Bildformaten können EXIF-Daten oder Farbprofile verloren gehen, sofern das Zielformat diese nicht vorsieht.",
          "CorelDRAW-Formate: Unsere Werkzeuge erstellen universelle offene Vektorformate (PDF, SVG, EPS) für den sauberen Import in CorelDRAW statt fehleranfälliger nativer CDR-Dateien."
        ]
      },
      {
        "icon": "refreshCw",
        "title": "7. Kontinuierliche Pflege und Aktualisierung",
        "content": "Wir überprüfen Formeln und Bibliotheken regelmäßig auf Aktualität und gesetzliche Änderungen.",
        "points": [
          "Gesetzesänderungen: Steuer- und Rentenrechner werden angepasst, sobald neue amtliche Tabellen und Freibeträge in Kraft treten.",
          "Softwarepflege: Externe Bibliotheken werden laufend aktualisiert, um Kompatibilität und Sicherheit zu gewährleisten.",
          "Fehlermeldungen: Nutzerhinweise auf Rechenabweichungen werden zeitnah geprüft und behoben."
        ]
      }
    ],
    "footerNote": {
      "text": "Beachten Sie unseren Haftungsausschluss für rechtliche Hinweise. Um Rechenabweichungen zu melden, nutzen Sie bitte unsere Kontaktseite.",
      "linkText": "Haftungsausschluss",
      "linkHref": "/disclaimer",
      "secondLinkText": "Kontaktseite",
      "secondLinkHref": "/contact"
    }
  },
  "ru": {
    "title": "Методология расчетов и стандарты тестирования – Navorika",
    "description": "Как Navorika выбирает формулы, организует локальную обработку в браузере, тестирует алгоритмы и описывает технические ограничения.",
    "eyebrow": "Инженерные стандарты",
    "heroTitle": "Методология инструментов Navorika",
    "heroDescription": "Подробно о том, как мы подбираем расчетные формулы, защищаем ваши файлы, верифицируем код и описываем технические рамки.",
    "lastUpdatedLabel": "Последнее обновление",
    "lastUpdated": "27 сентября 2026 г.",
    "banner": {
      "variant": "indigo",
      "text": "Как мы выбираем формулы, обрабатываем файлы и данные, тестируем результаты и описываем пределы возможностей наших инструментов."
    },
    "sections": [
      {
        "icon": "cpu",
        "title": "1. Обработка данных внутри браузера",
        "content": "Большинство утилит работают локально на вашем компьютере, гарантируя безопасность файлов.",
        "points": [
          "Клиентские технологии: калькуляторы, конвертеры изображений и работа с PDF используют штатные возможности браузера (JavaScript, Canvas, WebAssembly).",
          "Полная конфиденциальность: в локальных инструментах файлы и числа обрабатываются в оперативной памяти устройства и не загружаются на серверы Navorika.",
          "Библиотеки и компоненты: документы PDF обрабатываются с помощью pdf-lib и pdf.js, а криптографические операции выполняются через Web Cryptography API."
        ]
      },
      {
        "icon": "server",
        "title": "2. Когда задействуется наш сервер",
        "content": "Небольшая группа специализированных задач требует кратковременной серверной поддержки.",
        "points": [
          "Сложные форматы: такие операции, как конвертация CAD STEP в 3D PDF или некоторые фильтры CorelDRAW, невозможно выполнить средствами одного лишь браузера.",
          "Изолированные среды: серверная обработка происходит во временных виртуальных папках, создаваемых под конкретный запрос.",
          "Мгновенное удаление: исходные и полученные файлы удаляются сразу же после завершения передачи результата."
        ]
      },
      {
        "icon": "calculator",
        "title": "3. Как выбираются расчетные формулы",
        "content": "Мы применяем проверенные математические алгоритмы, нормативы и справочные стандарты.",
        "points": [
          "Финансы: кредитные инструменты используют классическую формулу аннуитета, накопления — сложные проценты, а налоги — официальные действующие ставки.",
          "Здоровье и фитнес: применяются признанные уравнения (например, формула Миффлина-Сан Жеора для базового обмена), имеющие оценочный характер.",
          "Строительство: материальные расчеты строятся на формулах объема и площади с учетом стандартных строительных коэффициентов запаса и расхода."
        ]
      },
      {
        "icon": "globe",
        "title": "4. Использование внешних источников данных",
        "content": "Инструменты, требующие оперативной рыночной информации, открыто указывают поставщика данных.",
        "points": [
          "Конвертер валют: использует проверенные биржевые и межбанковские курсы с указанием даты и времени фиксации котировки.",
          "Во внешний запрос передаются только коды валют, без истории предыдущих операций или личных идентификаторов."
        ]
      },
      {
        "icon": "checkCircle2",
        "title": "5. Методы тестирования и контроль качества",
        "content": "Автоматизированное тестирование контролирует точность формул и предотвращает появление ошибок.",
        "points": [
          "Модульные тесты: мы проверяем типовые сценарии, нулевые значения и крайние границы диапазонов перед каждой сборкой проекта.",
          "Контроль округления: результаты форматируются с заданной точностью, исключая паразитные артефакты плавающей запятой (например, 0.30000000000000004).",
          "Безопасность интерфейса: весь обрабатываемый HTML-код обезвреживается для блокировки небезопасных скриптов."
        ]
      },
      {
        "icon": "alertCircle",
        "title": "6. Технические ограничения платформы",
        "content": "Работа в браузере и статистические методы имеют свои объективные границы.",
        "points": [
          "Объем файлов: очень большие файлы PDF или несжатые изображения могут исчерпать доступную оперативную память вкладки.",
          "Разрешение графики: браузеры устанавливают верхний предел на размеры объектов Canvas в пикселях.",
          "Метаданные: смена формата графического файла может приводить к удалению данных EXIF или геометок.",
          "Преобразование CorelDRAW: наши инструменты готовят открытые векторные файлы (PDF, SVG, EPS), пригодные для чистого импорта в CorelDRAW, вместо нестабильных файлов CDR."
        ]
      },
      {
        "icon": "refreshCw",
        "title": "7. Регулярная актуализация и поддержка",
        "content": "Мы следим за изменениями правил и обновляем программные модули по мере необходимости.",
        "points": [
          "Законодательные изменения: налоговые формулы обновляются после публикации новых официальных ставок и порогов.",
          "Безопасность библиотек: модули с открытым исходным кодом своевременно обновляются для закрытия уязвимостей.",
          "Обратная связь: сообщения пользователей об ошибках позволяют оперативно проверять и корректировать алгоритмы."
        ]
      }
    ],
    "footerNote": {
      "text": "Ознакомьтесь с нашим Отказом от ответственности для понимания правовых рамок. Чтобы сообщить об ошибке в расчетах, используйте страницу контактов.",
      "linkText": "Отказом от ответственности",
      "linkHref": "/disclaimer",
      "secondLinkText": "страницу контактов",
      "secondLinkHref": "/contact"
    }
  },
  "ar": {
    "title": "منهجية الحسابات ومعايير الاختبار – Navorika",
    "description": "تعرف على كيفية اختيار Navorika للمعادلات، وتنظيم المعالجة المحلية، وإجراء الاختبارات التلقائية، وتوضيح حدود الأدوات.",
    "eyebrow": "المعايير الهندسية",
    "heroTitle": "منهجية عمل أدوات Navorika",
    "heroDescription": "كيف نختار المعادلات الرياضية، ونتعامل مع ملفاتك بأمان، ونختبر النتائج، ونوضح الحدود العملية لأدواتنا.",
    "lastUpdatedLabel": "آخر تحديث",
    "lastUpdated": "27 سبتمبر 2026",
    "banner": {
      "variant": "indigo",
      "text": "كيف نختار المعادلات الحسابية، ونتعامل مع الملفات والبيانات، ونختبر النتائج، ونوضح الحدود التقنية لأدواتنا."
    },
    "sections": [
      {
        "icon": "cpu",
        "title": "1. معالجة البيانات داخل المتصفح",
        "content": "تعمل معظم الأدوات محلياً داخل جهازك لضمان بقاء ملفاتك ومدخلاتك في حوزتك الخاصة.",
        "points": [
          "تنفيذ محلي كامل: تعتمد حاسبات الموقع وأدوات الصور وملفات PDF على تقنيات المتصفح المتقدمة مثل JavaScript وWebAssembly وCanvas.",
          "خصوصية تامة: في الأدوات المصنفة كمعالجة محلية، لا تُرفع ملفاتك أو أرقامك إلى خوادم Navorika مطلقاً.",
          "مكتبات برمجية متخصصة: تستخدم أدوات المستندات مكتبات مثل pdf-lib وpdf.js، بينما تستخدم أدوات الأمان واجهة Web Cryptography API."
        ]
      },
      {
        "icon": "server",
        "title": "2. متى تحتاج الأداة إلى خادمنا",
        "content": "تتطلب فئة محدودة من التحويلات المتخصصة معالجة مؤقتة على الخادم.",
        "points": [
          "تنسيقات تتطلب برمجيات خاصة: مثل تحويل ملفات STEP الهندسية إلى PDF ثلاثي الأبعاد أو بعض مرشحات CorelDRAW.",
          "بيئات معزولة ومؤقتة: يتم تنفيذ المعالجة في مساحة عمل مؤقتة ومستقلة تماماً تُنشأ خصيصاً لكل طلب.",
          "حذف فوري للبيانات: يتم مسح الملفات المرفوعة والناتجة نهائياً فور انتهاء عملية التحويل وتنزيل النتيجة."
        ]
      },
      {
        "icon": "calculator",
        "title": "3. كيفية اختيار المعادلات الحسابية",
        "content": "نعتمد على معادلات علمية موثقة، وقوانين رسمية، وأساليب مرجعية معتمدة.",
        "points": [
          "الحاسبات المالية: تطبق أدوات القروض جداول الاستهلاك القياسية، وحسابات الادخار معادلات الفائدة المركبة، مع اتباع اللوائح الرسمية المنشورة.",
          "حاسبات الصحة والرشاقة: تعتمد على معادلات فسيولوجية منشورة (مثل معادلة ميفلين-سانت جور لمعدل الأيض الأساسي)، مع توضيح أنها تقديرات استرشادية.",
          "حاسبات البناء: تستند إلى حسابات هندسية دقيقة (الطول × العرض × الارتفاع) مع إضافة نسب الهدر المتعارف عليها في قطاع المقاولات."
        ]
      },
      {
        "icon": "globe",
        "title": "4. استخدام البيانات الحية والمباشرة",
        "content": "الأدوات التي تتطلب معلومات سوقية آنية تفصح بوضوح عن مصدر البيانات الخارجي المستخدم.",
        "points": [
          "محول العملات: يعتمد على أسعار الصرف المرجعية المنشورة مع إيضاح تاريخ وتوقيت السعر المستخدم.",
          "يقتصر الاتصال بمصدر البيانات على القيم الضرورية لعملية التحويل فقط، دون إرسال أي سجلات شخصية."
        ]
      },
      {
        "icon": "checkCircle2",
        "title": "5. أساليب الاختبار وضمان الجودة",
        "content": "تساعد مجموعات الاختبارات البرمجية التلقائية في رصد وتفادي الأخطاء الحسابية قبل النشر.",
        "points": [
          "اختبارات برمجية شاملة: نختبر الأمثلة الواقعية، والقيم الصفرية، والحدود القصوى، والمدخلات الخاطئة في كل إصدار برمجي.",
          "ضبط التقريب الرياضي: نضبط عمليات التقريب لمنع ظهور القيم العشرية المزعجة الناتجة عن الحوسبة العشرية (مثل 0.30000000000000004).",
          "فحص الأمان البرمجي: يتم تعقيم وتنقية جميع مخرجات HTML لمنع أي أكواد أو نصوص غير آمنة."
        ]
      },
      {
        "icon": "alertCircle",
        "title": "6. الحدود التقنية الواجب معرفتها",
        "content": "تنطوي أدوات المتصفح والتقديرات الإحصائية على حدود عملية تؤثر على النتائج.",
        "points": [
          "الملفات الكبيرة جداً: قد تستهلك ملفات PDF أو الصور فائقة الدقة ذاكرة المتصفح وتؤدي إلى بطء الاستجابة.",
          "أبعاد الصور العالية: تفرض المتصفحات قيوداً على أقصى أبعاد للصور التي يمكن معالجتها في الذاكرة عبر Canvas.",
          "البيانات الوصفية للصور: قد يؤدي تغيير التنسيق إلى حذف بيانات EXIF للكاميرا أو بيانات الموقع الجغرافي.",
          "تحويلات CorelDRAW: تقوم أدواتنا بإنشاء ملفات متجهة قياسية مفتوحة (PDF, SVG, EPS) مهيأة للاستيراد المباشر في CorelDRAW بدلاً من إنشاء ملفات CDR أصلية غير مستقرة."
        ]
      },
      {
        "icon": "refreshCw",
        "title": "7. المراجعة والتحديث المستمر",
        "content": "نراجع المعادلات والتبعيات البرمجية بشكل منتظم لمواكبة التغيرات والتحديثات.",
        "points": [
          "مواكبة التغيرات: تتم مراجعة حاسبات الضرائب والتقاعد سنوياً عند صدور الجداول واللوائح الرسمية الجديدة.",
          "الصيانة البرمجية: يتم تحديث مكتبات المصادر المفتوحة باستمرار لمعالجة الثغرات الأمنية وتحسين التوافق.",
          "استقبال الملاحظات: نرحب بملاحظات المستخدمين ونراجع أي تقارير حول دقة الحسابات لمعالجتها على الفور."
        ]
      }
    ],
    "footerNote": {
      "text": "يرجى مراجعة صفحة إخلاء المسؤولية القانونية لمعرفة حدود الاستخدام. وللإبلاغ عن أي خطأ حسابي، استخدم صفحة الاتصال بنا.",
      "linkText": "إخلاء المسؤولية القانونية",
      "linkHref": "/disclaimer",
      "secondLinkText": "صفحة الاتصال بنا",
      "secondLinkHref": "/contact"
    }
  }
};

export const glossaryContent: Record<Locale | 'en', GlossaryPageContent> = {
  "en": {
    "title": "Online Tool & Calculator Glossary – Navorika",
    "description": "Plain-English definitions of common calculator, finance, health, PDF, web, and technology terms used across Navorika tools and guides.",
    "heroTitle": "Glossary",
    "heroDescription": "21 plain-English terms used in calculators, file tools, and guides",
    "terms": [
      {
        "term": "APR",
        "definition": "Annual Percentage Rate – the yearly cost of borrowing, including interest and sometimes certain fees."
      },
      {
        "term": "APY",
        "definition": "Annual Percentage Yield – the effective yearly return on savings or an investment after compounding."
      },
      {
        "term": "Principal",
        "definition": "The original amount borrowed, invested, or deposited before interest and returns."
      },
      {
        "term": "Mortgage",
        "definition": "A loan used to buy or refinance real estate, usually repaid with monthly principal and interest payments."
      },
      {
        "term": "ROI",
        "definition": "Return on Investment – the percentage gain or loss compared with the amount invested."
      },
      {
        "term": "CAGR",
        "definition": "Compound Annual Growth Rate – the average annual growth rate over a period, assuming steady compounding."
      },
      {
        "term": "Net Worth",
        "definition": "The value of your assets minus your debts and other liabilities."
      },
      {
        "term": "BMI",
        "definition": "Body Mass Index – a screening measure based on height and weight. It is not a direct measurement of body fat."
      },
      {
        "term": "BMR",
        "definition": "Basal Metabolic Rate – an estimate of the calories your body uses at rest."
      },
      {
        "term": "TDEE",
        "definition": "Total Daily Energy Expenditure – an estimate of the calories you use in a full day including activity."
      },
      {
        "term": "PPI",
        "definition": "Pixels Per Inch – the number of image pixels used per inch when displaying or printing an image."
      },
      {
        "term": "DPI",
        "definition": "Dots Per Inch – a printing term that describes printer dot density. It is often used loosely when discussing image print resolution."
      },
      {
        "term": "PDF",
        "definition": "Portable Document Format – a file format designed to preserve document layout across devices and software."
      },
      {
        "term": "JSON",
        "definition": "JavaScript Object Notation – a common text format used to store and exchange structured data."
      },
      {
        "term": "JWT",
        "definition": "JSON Web Token – a compact token format commonly used for authentication and data exchange between systems."
      },
      {
        "term": "Base64",
        "definition": "A way to represent binary data as text so it can be stored or transmitted in text-based systems."
      },
      {
        "term": "QR Code",
        "definition": "Quick Response code – a two-dimensional barcode that can store a link, text, contact information, or other data."
      },
      {
        "term": "EMI",
        "definition": "Equated Monthly Installment – a fixed recurring loan payment term commonly used in India and some other countries."
      },
      {
        "term": "SIP",
        "definition": "Systematic Investment Plan – a common Indian term for investing a fixed amount into a mutual fund at regular intervals."
      },
      {
        "term": "GST",
        "definition": "Goods and Services Tax – an indirect tax used in India and several other countries. Navorika India-specific tools identify the rules they model."
      },
      {
        "term": "PPF",
        "definition": "Public Provident Fund – a long-term savings scheme specific to India."
      }
    ]
  },
  "fr": {
    "title": "Glossaire des Termes et Outils – Navorika",
    "description": "Définitions claires des termes clés de la finance, du bâtiment, de la santé, du PDF et du développement web sur Navorika.",
    "heroTitle": "Glossaire",
    "heroDescription": "21 définitions claires des concepts utilisés dans nos calculateurs, outils documentaires et guides",
    "terms": [
      {
        "term": "TAEG",
        "definition": "Taux Annuel Effectif Global – le coût total d'un crédit accordé, incluant les intérêts bancaires et l'ensemble des frais obligatoires."
      },
      {
        "term": "Rendement composé (APY)",
        "definition": "Le taux annuel effectif perçu sur une épargne ou un investissement après capitalisation périodique des intérêts."
      },
      {
        "term": "Capital initial",
        "definition": "Le montant originel emprunté, placé ou déposé avant tout calcul d'intérêts ou de plus-values."
      },
      {
        "term": "Prêt immobilier",
        "definition": "Un emprunt destiné à acquérir ou refinancer un bien immobilier, remboursé par mensualités de capital et d'intérêts."
      },
      {
        "term": "Retour sur investissement (ROI)",
        "definition": "Le pourcentage de gain ou de perte financière mesuré par rapport au capital initialement engagé."
      },
      {
        "term": "TCAM (CAGR)",
        "definition": "Taux de Croissance Annuel Moyen – le taux de progression annuel moyen d'un investissement sur une période pluriannuelle."
      },
      {
        "term": "Patrimoine net",
        "definition": "La valeur vénale totale de l'ensemble de vos actifs déduction faite de vos dettes et emprunts."
      },
      {
        "term": "IMC (Indice de Masse Corporelle)",
        "definition": "Un indicateur morphologique basé sur le ratio poids/taille au carré. Il ne mesure pas directement la masse grasse."
      },
      {
        "term": "Métabolisme de base (MB / BMR)",
        "definition": "L'estimation du volume d'énergie et de calories brûlées par votre organisme au repos complet."
      },
      {
        "term": "Dépense énergétique quotidienne (DEJ / TDEE)",
        "definition": "L'estimation du total de calories dépensées sur 24 heures en intégrant votre activité physique."
      },
      {
        "term": "Pixels par pouce (PPP / PPI)",
        "definition": "La densité de pixels affichés par pouce linéaire sur un écran d'ordinateur ou de smartphone."
      },
      {
        "term": "Points par pouce (DPI)",
        "definition": "La densité de points physiques d'encre déposés par une imprimante par pouce lors du tirage papier."
      },
      {
        "term": "PDF (Portable Document Format)",
        "definition": "Un format de document normalisé conçu pour préserver la typographie et la mise en page sur tous les écrans."
      },
      {
        "term": "JSON",
        "definition": "JavaScript Object Notation – un format textuel léger et universel pour stocker et échanger des données structurées."
      },
      {
        "term": "JWT (JSON Web Token)",
        "definition": "Un jeton sécurisé signé numériquement servant à authentifier les échanges d'informations entre applications web."
      },
      {
        "term": "Base64",
        "definition": "Un algorithme d'encodage transformant des données binaires en chaîne de caractères ASCII standard pour le web."
      },
      {
        "term": "Code QR",
        "definition": "Un code-barres bidimensionnel capable d'encoder des adresses web, du texte brut ou des informations de contact."
      },
      {
        "term": "Échéance constante (EMI)",
        "definition": "Une mensualité fixe et récurrente combinant amortissement du capital et intérêts sur un prêt bancaire."
      },
      {
        "term": "Versement programmé (SIP)",
        "definition": "Une stratégie d'épargne consistant à placer un montant fixe à intervalles réguliers dans un fonds d'investissement."
      },
      {
        "term": "TVA / GST",
        "definition": "Taxe sur la valeur ajoutée ou sur les biens et services applicable lors des transactions commerciales selon les pays."
      },
      {
        "term": "Fonds de prévoyance public (PPF)",
        "definition": "Un plan d'épargne et de retraite de long terme à fiscalité avantageuse utilisé notamment en Inde."
      }
    ]
  },
  "it": {
    "title": "Glossario dei Termini e delle Definizioni – Navorika",
    "description": "Definizioni chiare dei termini utilizzati nei calcolatori finanziari, edili, biometrici e negli strumenti tecnici di Navorika.",
    "heroTitle": "Glossario",
    "heroDescription": "21 spiegazioni chiare per comprendere i concetti presenti nei nostri calcolatori e convertitori",
    "terms": [
      {
        "term": "TAEG",
        "definition": "Tasso Annuo Effettivo Globale – il costo complessivo di un prestito espresso su base percentuale annua, inclusi oneri e spese."
      },
      {
        "term": "Rendimento effettivo (APY)",
        "definition": "Il guadagno percentuale effettivo annuo generato da un conto deposito o investimento considerando l'interesse composto."
      },
      {
        "term": "Capitale iniziale",
        "definition": "La somma originariamente presa in prestito, depositata o investita prima del computo degli interessi."
      },
      {
        "term": "Mutuo",
        "definition": "Un finanziamento a lungo termine destinato all'acquisto di un immobile, rimborsato tramite rate periodiche di capitale e interessi."
      },
      {
        "term": "Ritorno sull'investimento (ROI)",
        "definition": "La percentuale di profitto o perdita ottenuta rispetto al capitale originariamente impiegato."
      },
      {
        "term": "Tasso annuo composto (CAGR)",
        "definition": "Il tasso medio di crescita annuale di un capitale su un orizzonte pluriennale, ipotizzando reinvestimento costante."
      },
      {
        "term": "Patrimonio netto",
        "definition": "Il valore complessivo di tutte le attività possedute al netto dei debiti e delle passività finanziarie."
      },
      {
        "term": "Indice di Massa Corporea (BMI)",
        "definition": "Un indicatore di screening statistico tra peso e altezza. Non misura direttamente la percentuale di grasso corporeo."
      },
      {
        "term": "Metabolismo basale (BMR)",
        "definition": "La stima dell'energia calorica consumata dal corpo a riposo per sostenere le funzioni vitali."
      },
      {
        "term": "Fabbisogno calorico totale (TDEE)",
        "definition": "La stima del consumo energetico giornaliero complessivo, comprensivo del lavoro e dell'attività motoria."
      },
      {
        "term": "Pixel per pollice (PPI)",
        "definition": "La densità di punti digitali presenti in un pollice lineare su uno schermo o in un file grafico raster."
      },
      {
        "term": "Punti per pollice (DPI)",
        "definition": "La misura della densità di stampa fisica di gocce d'inchiostro su carta effettuata da una stampante."
      },
      {
        "term": "PDF",
        "definition": "Formato standard che conserva inalterata la struttura grafica, i vettori e i font su ogni piattaforma software."
      },
      {
        "term": "JSON",
        "definition": "Standard di testo aperto e compatto largamente utilizzato per lo scambio di dati strutturati tra sistemi web."
      },
      {
        "term": "JWT",
        "definition": "Jeton compatto crittograficamente firmato utilizzato per l'autenticazione sicura delle sessioni di lavoro."
      },
      {
        "term": "Base64",
        "definition": "Codifica che converte sequenze di byte binari in stringhe di caratteri di testo compatibili con il protocollo HTTP."
      },
      {
        "term": "Codice QR",
        "definition": "Codice a barre a matrice bidimensionale scansionabile per accedere a collegamenti web o dati di testo."
      },
      {
        "term": "Rata costante (EMI)",
        "definition": "Importo periodico fisso versato per estinguere progressivamente quota capitale e quota interessi di un prestito."
      },
      {
        "term": "Piano di accumulo (SIP)",
        "definition": "Strategia di investimento programmato che prevede il versamento periodico di quote fisse in fondi comuni."
      },
      {
        "term": "Imposta su beni e servizi (GST / IVA)",
        "definition": "Imposta indiretta sul valore aggiunto applicata a prodotti e prestazioni secondo le norme fiscali vigenti."
      },
      {
        "term": "Fondo previdenziale pubblico (PPF)",
        "definition": "Schema pensionistico e di risparmio a lungo termine con agevolazioni fiscali, diffuso ad esempio in India."
      }
    ]
  },
  "pt": {
    "title": "Glossário de Conceitos e Ferramentas – Navorika",
    "description": "Definições acessíveis dos termos práticos utilizados nas calculadoras financeiras, de obras, formatos digitais e utilitários da Navorika.",
    "heroTitle": "Glossário",
    "heroDescription": "21 termos práticos explicados de forma simples para apoiar o uso dos conversores e calculadoras",
    "terms": [
      {
        "term": "TAEG / APR",
        "definition": "Taxa Anual Efetiva Global – o encargo total anual de um financiamento, incluindo juros remuneratórios e comissões associadas."
      },
      {
        "term": "Rendimento anual efetivo (APY)",
        "definition": "A rentabilidade percentual líquida obtida numa poupança ou aplicação financeira após a capitalização periódica dos juros."
      },
      {
        "term": "Capital principal",
        "definition": "O valor nominal inicial concedido em empréstimo, aplicado ou depositado, antes da incidência de juros."
      },
      {
        "term": "Crédito habitação / Hipoteca",
        "definition": "Financiamento de longo prazo contratado para aquisição imobiliária, amortizado por prestações regulares."
      },
      {
        "term": "Retorno sobre investimento (ROI)",
        "definition": "Métrica de rentabilidade que expressa o ganho financeiro obtido relativamente ao montante inicialmente investido."
      },
      {
        "term": "Taxa de crescimento anual composta (CAGR)",
        "definition": "A taxa anual média de evolução de um património ao longo de vários períodos com capitalização contínua."
      },
      {
        "term": "Património líquido",
        "definition": "O valor patrimonial global somando todos os ativos detidos e subtraindo a totalidade das dívidas e obrigações."
      },
      {
        "term": "Índice de Massa Corporal (IMC)",
        "definition": "Indicador estatístico derivado da relação entre peso e altura ao quadrado. Não traduz diretamente a gordura corporal."
      },
      {
        "term": "Taxa metabólica basal (BMR)",
        "definition": "A estimativa da quantidade de calorias que o organismo queima em repouso absoluto para manter os sinais vitais."
      },
      {
        "term": "Gasto energético diário total (TDEE)",
        "definition": "A estimativa do consumo calórico integral diário, considerando o metabolismo basal e as atividades físicas."
      },
      {
        "term": "Píxeis por polegada (PPI)",
        "definition": "A densidade linear de píxeis presentes por polegada no ecrã de um dispositivo ou ficheiro de imagem."
      },
      {
        "term": "Pontos por polegada (DPI)",
        "definition": "A resolução de impressão física dada pela densidade de pontos microscópicos de tinta depositados no papel."
      },
      {
        "term": "PDF",
        "definition": "Formato universal desenvolvido para assegurar a fidelidade exata de paginação, tipografia e curvas em qualquer ecrã."
      },
      {
        "term": "JSON",
        "definition": "Padrão de dados estruturados em texto simples amplamente adotado em serviços web e APIs modernas."
      },
      {
        "term": "JWT",
        "definition": "Token compacto com assinatura digital utilizado para verificar a identidade em comunicações entre servidores."
      },
      {
        "term": "Base64",
        "definition": "Algoritmo de codificação que converte ficheiros binários em texto seguro para envio em protocolos web."
      },
      {
        "term": "Código QR",
        "definition": "Código bidimensional legível por câmara que armazena endereços de internet, dados de contacto ou texto."
      },
      {
        "term": "Prestação fixa constante (EMI)",
        "definition": "Pagamento mensal fixo que reparte o pagamento de capital e encargos de juros até à quitação de um empréstimo."
      },
      {
        "term": "Plano de investimento sistemático (SIP)",
        "definition": "Método disciplinado de investimento de quantias fixas regulares ao longo do tempo em fundos de investimento."
      },
      {
        "term": "Imposto sobre bens e serviços (GST / IVA)",
        "definition": "Tributo indireto cobrado sobre o consumo de mercadorias e serviços de acordo com as leis locais."
      },
      {
        "term": "Fundo público de previdência (PPF)",
        "definition": "Plano de aforro e reforma de longo prazo com benefícios fiscais característico de jurisdições como a Índia."
      }
    ]
  },
  "es": {
    "title": "Glosario de Términos y Calculadoras – Navorika",
    "description": "Definiciones claras y rigurosas de conceptos financieros, constructivos, gráficos y de programación usados en Navorika.",
    "eyebrow": "Glosario Técnico",
    "heroTitle": "Glosario",
    "heroDescription": "21 definiciones claras para comprender las variables de nuestras calculadoras, conversores y guías",
    "terms": [
      {
        "term": "TAE / APR",
        "definition": "Tasa Anual Equivalente – el coste total de un préstamo expresado en porcentaje anual, contemplando comisiones y gastos."
      },
      {
        "term": "Rendimiento anual efectivo (APY)",
        "definition": "La ganancia porcentual real devengada en una cuenta de ahorro o inversión tras la acumulación periódica de intereses."
      },
      {
        "term": "Capital principal",
        "definition": "El importe bruto originalmente financiado, invertido o ingresado antes de computar los intereses y retornos."
      },
      {
        "term": "Hipoteca / Préstamo hipotecario",
        "definition": "Contrato de crédito con garantía real para adquisición inmobiliaria, devuelto en cuotas mensuales de amortización e interés."
      },
      {
        "term": "Retorno de inversión (ROI)",
        "definition": "El porcentaje neto de beneficio o pérdida obtenido en comparación directa con el capital desembolsado."
      },
      {
        "term": "Tasa de crecimiento anual compuesto (CAGR)",
        "definition": "La rentabilidad media interanual de un fondo o activo a lo largo de un ciclo plurianual continuado."
      },
      {
        "term": "Patrimonio neto",
        "definition": "La valoración económica de todos sus activos y derechos tras deducir las deudas y obligaciones bancarias."
      },
      {
        "term": "Índice de Masa Corporal (IMC)",
        "definition": "Parámetro biométrico orientativo basado en la correlación entre peso y estatura. No evalúa directamente la grasa corporal."
      },
      {
        "term": "Metabolismo basal (TMB / BMR)",
        "definition": "La estimación del consumo calórico mínimo que el cuerpo necesita en reposo para conservar las funciones vitales."
      },
      {
        "term": "Gasto energético diario total (GET / TDEE)",
        "definition": "La suma estimada de calorías consumidas en una jornada completa, incluyendo la actividad profesional y física."
      },
      {
        "term": "Píxeles por pulgada (PPP / PPI)",
        "definition": "La densidad física de píxeles contenida en una pulgada de longitud en paneles de visualización digital."
      },
      {
        "term": "Puntos por pulgada (DPI)",
        "definition": "La resolución de impresión expresada en número de gotas de tinta microscópicas depositadas por pulgada de papel."
      },
      {
        "term": "PDF",
        "definition": "Formato de documento universal que preserva de forma invariable la tipografía, tablas y vectorización en cualquier sistema."
      },
      {
        "term": "JSON",
        "definition": "Formato ligero de intercambio de datos basado en texto plano, estándar en la arquitectura web contemporánea."
      },
      {
        "term": "JWT",
        "definition": "Token compacto con firma criptográfica que permite la validación fiable de credenciales y autorizaciones entre servicios."
      },
      {
        "term": "Base64",
        "definition": "Esquema de codificación que transforma información binaria en caracteres alfanuméricos ASCII para transporte web."
      },
      {
        "term": "Código QR",
        "definition": "Código de matriz bidimensional de alta capacidad capaz de almacenar hipervínculos, credenciales o texto legible por móvil."
      },
      {
        "term": "Cuota periódica constante (EMI)",
        "definition": "Mensualidad fija que liquida conjuntamente el capital amortizado y los intereses de una operación de préstamo."
      },
      {
        "term": "Plan de inversión sistemática (SIP)",
        "definition": "Técnica de aportación monetaria periódica y constante en fondos de inversión para promediar costes en el tiempo."
      },
      {
        "term": "Impuesto sobre bienes y servicios (IVA / GST)",
        "definition": "Tributación indirecta sobre el consumo aplicada al intercambio comercial de artículos y servicios según la normativa."
      },
      {
        "term": "Fondo público de previsión (PPF)",
        "definition": "Mecanismo oficial de ahorro e inversión a largo plazo con ventajas tributarias presente en marcos como el de la India."
      }
    ]
  },
  "de": {
    "title": "Glossar der Fachbegriffe und Werkzeuge – Navorika",
    "description": "Verständliche Definitionen der mathematischen, finanziellen, bautechnischen und digitalen Fachbegriffe auf Navorika.",
    "heroTitle": "Glossar",
    "heroDescription": "21 verständliche Begriffserklärungen für Rechner, Dokumenten-Werkzeuge und Leitfäden",
    "terms": [
      {
        "term": "Effektiver Jahreszins (APR)",
        "definition": "Die jährlichen Gesamtkosten eines Kredits einschließlich Sollzinsen, Bearbeitungsgebühren und Nebenkosten."
      },
      {
        "term": "Effektive Jahresrendite (APY)",
        "definition": "Der tatsächliche Jahresertrag einer Kapitalanlage unter Berücksichtigung des Zinseszinseffekts bei Wiederanlage."
      },
      {
        "term": "Tilgungsbetrag / Ursprungskapital",
        "definition": "Der ursprünglich geliehene, hinterlegte oder investierte Betrag vor dem Anfall von Zinsen oder Erträgen."
      },
      {
        "term": "Hypothek / Baudarlehen",
        "definition": "Ein grundpfandrechtlich besichertes Darlehen zum Erwerb einer Immobilie mit monatlicher Zins- und Tilgungsrate."
      },
      {
        "term": "Kapitalrendite (ROI)",
        "definition": "Die prozentuale Kennzahl für Gewinn oder Verlust im Verhältnis zum ursprünglich eingesetzten Kapital."
      },
      {
        "term": "Jährliche Wachstumsrate (CAGR)",
        "definition": "Die durchschnittliche jährliche Wachstumsrate einer Investition über einen Mehrjahreszeitraum mit Zinseszins."
      },
      {
        "term": "Nettovermögen",
        "definition": "Der finanzielle Gesamtwert aller Vermögenswerte abzüglich sämtlicher Verbindlichkeiten und Schulden."
      },
      {
        "term": "Body-Mass-Index (BMI)",
        "definition": "Ein statistischer Richtwert aus Körpergewicht geteilt durch Körpergröße im Quadrat. Keine Fettmessung."
      },
      {
        "term": "Grundumsatz (BMR)",
        "definition": "Die geschätzte Kalorienmenge, die der menschliche Körper in völliger Ruhe zur Aufrechterhaltung der Organfunktionen benötigt."
      },
      {
        "term": "Gesamtenergiebedarf (TDEE)",
        "definition": "Der geschätzte Gesamttagesbedarf an Kalorien unter Einbeziehung körperlicher Arbeit und sportlicher Bewegung."
      },
      {
        "term": "Pixel pro Zoll (PPI)",
        "definition": "Die Punktdichte von Displayanzeigen und Rastergrafiken ausgedrückt in Bildpunkten pro Zoll."
      },
      {
        "term": "Punkte pro Zoll (DPI)",
        "definition": "Die physikalische Druckauflösung beziffert durch die Anzahl gesetzter Druckpunkte pro linearem Zoll auf Papier."
      },
      {
        "term": "PDF",
        "definition": "Plattformunabhängiges Dateiformat, das Layout, Vektorgrafiken und Schriftsätze geräteübergreifend unverändert abbildet."
      },
      {
        "term": "JSON",
        "definition": "Strukturiertes Datenformat auf Textbasis, das weltweit für den effizienten Datenaustausch zwischen Webdiensten dient."
      },
      {
        "term": "JWT",
        "definition": "Kompaktes, kryptografisch signiertes Token-Format zur sicheren Übermittlung von Authentifizierungsdaten."
      },
      {
        "term": "Base64",
        "definition": "Kodierungsverfahren, das Binärdaten in eine standardisierte Folge lesbarer ASCII-Zeichen umwandelt."
      },
      {
        "term": "QR-Code",
        "definition": "Zweidimensionaler Matrix-Strichcode zur optischen Übertragung von Weblinks, Texten oder Kontaktdaten an Kameras."
      },
      {
        "term": "Gleichbleibende Monatsrate (EMI)",
        "definition": "Feste monatliche Tilgungs- und Zinsrate zur kontinuierlichen Rückzahlung von Bankdarlehen."
      },
      {
        "term": "Systematischer Sparplan (SIP)",
        "definition": "Regelmäßige Anlage fester Beträge in Investmentfonds zur Nutzung des Durchschnittskosteneffekts über Zeit."
      },
      {
        "term": "Waren- und Dienstleistungssteuer (GST / MwSt.)",
        "definition": "Indirekte Verbrauchssteuer auf gewerbliche Umsätze gemäß den jeweils gültigen steuerlichen Rechtsvorschriften."
      },
      {
        "term": "Öffentlicher Vorsorgefonds (PPF)",
        "definition": "Staatlich gefördertes, langfristiges Spar- und Altersvorsorgeinstrument mit Steuervorteilen, verbreitet in Indien."
      }
    ]
  },
  "ru": {
    "title": "Глоссарий терминов и калькуляторов – Navorika",
    "description": "Понятные и точные определения финансовых, строительных, медицинских и IT-терминов, используемых в инструментах Navorika.",
    "heroTitle": "Глоссарий",
    "heroDescription": "21 понятное определение ключевых терминов, используемых в калькуляторах, конвертерах и руководствах",
    "terms": [
      {
        "term": "Годовая процентная ставка (APR)",
        "definition": "Полная стоимость заемных средств за год в процентах, включающая проценты и сопутствующие банковские комиссии."
      },
      {
        "term": "Эффективная годовая доходность (APY)",
        "definition": "Реальная процентная ставка дохода по вкладу с учетом регулярной капитализации начисленных процентов."
      },
      {
        "term": "Основной долг (Тело кредита)",
        "definition": "Изначальная сумма займа или инвестиции до начисления процентов и инвестиционной прибыли."
      },
      {
        "term": "Ипотека",
        "definition": "Долгосрочный целевой заем под залог недвижимости, погашаемый регулярными платежами из основного долга и процентов."
      },
      {
        "term": "Рентабельность инвестиций (ROI)",
        "definition": "Финансовый коэффициент окупаемости, отражающий процентную прибыль или убыток относительно вложенного капитала."
      },
      {
        "term": "Совокупный среднегодовой темп роста (CAGR)",
        "definition": "Средняя геометрическая доходность актива за многолетний период в предположении реинвестирования."
      },
      {
        "term": "Чистая стоимость активов (Net Worth)",
        "definition": "Совокупная стоимость всех активов физического лица или компании за вычетом всех обязательств и долгов."
      },
      {
        "term": "Индекс массы тела (ИМТ / BMI)",
        "definition": "Ориентировочный статистический показатель соотношения массы и роста. Не измеряет долю жировой ткани напрямую."
      },
      {
        "term": "Базовый метаболизм (BMR)",
        "definition": "Оценка расхода калорий организмом в состоянии полного физического и эмоционального покоя для поддержания жизни."
      },
      {
        "term": "Суточный расход энергии (TDEE)",
        "definition": "Оценка полного ежедневного расхода калорий с учетом профессиональной и спортивной физической активности."
      },
      {
        "term": "Пикселей на дюйм (PPI)",
        "definition": "Плотность размещения цифровых пикселей на один линейный дюйм экранной матрицы или растрового изображения."
      },
      {
        "term": "Точек на дюйм (DPI)",
        "definition": "Плотность нанесения микроскопических точек красителя печатающим устройством на линейный дюйм бумаги."
      },
      {
        "term": "PDF (Portable Document Format)",
        "definition": "Универсальный стандарт электронных документов, сохраняющий шрифты, верстку и векторную графику на любых системах."
      },
      {
        "term": "JSON",
        "definition": "Текстовый формат структурирования данных, общепринятый стандарт для межпрограммного обмена информацией в вебе."
      },
      {
        "term": "JWT (JSON Web Token)",
        "definition": "Компактный токен с цифровой подписью для безопасной аутентификации пользователей между веб-серверами."
      },
      {
        "term": "Base64",
        "definition": "Алгоритм кодирования бинарных данных последовательностью печатных символов ASCII для безопасной передачи по сети."
      },
      {
        "term": "QR-код",
        "definition": "Двумерный матричный штрихкод, оптимизированный для быстрого распознавания камерой ссылок или произвольного текста."
      },
      {
        "term": "Аннуитетный платеж (EMI)",
        "definition": "Фиксированная ежемесячная выплата по кредиту, включающая как часть основного долга, так и начисленные проценты."
      },
      {
        "term": "Систематический инвестплан (SIP)",
        "definition": "Стратегия регулярного инвестирования фиксированных сумм в инвестиционные фонды через равные промежутки времени."
      },
      {
        "term": "Налог на товары и услуги (GST / НДС)",
        "definition": "Косвенный налог на добавленную стоимость, взимаемый при реализации продукции и услуг в соответствии с законами."
      },
      {
        "term": "Государственный накопительный фонд (PPF)",
        "definition": "Долгосрочная пенсионно-сберегательная программа со специальными налоговыми льготами, распространенная в Индии."
      }
    ]
  },
  "ar": {
    "title": "معجم المصطلحات والحاسبات الرقمية – Navorika",
    "description": "تعريفات دقيقة ومبسطة للمصطلحات المالية والإنشائية والتقنية والصحية المستخدمة في أدوات وحاسبات Navorika.",
    "heroTitle": "المعجم",
    "heroDescription": "21 مصطلحاً عملياً مفسراً بأسلوب مبسط لشرح مفاهيم الآلات الحاسبة وأدوات الملفات",
    "terms": [
      {
        "term": "معدل النسبة السنوية (APR)",
        "definition": "التكلفة السنوية الإجمالية للاقتراض معبراً عنها بنسبة مئوية سنوية تشمل الفائدة وأي رسوم إدارية مصاحبة."
      },
      {
        "term": "العائد السنوي الفعلي (APY)",
        "definition": "العائد الحقيقي المحقق سنوياً على المدخرات أو الاستثمارات بعد احتساب أثر الفائدة المركبة."
      },
      {
        "term": "أصل المبلغ (Principal)",
        "definition": "المبلغ الأصلي المقترض أو المودع أو المستثمر قبل إضافة أي أرباح أو احتساب الفوائد."
      },
      {
        "term": "التمويل العقاري / الرهن العقاري",
        "definition": "قرض طويل الأجل مخصص لشراء أو تمويل العقارات، يُسدد عبر أقساط دورية تجمع بين أصل الدين والفوائد."
      },
      {
        "term": "العائد على الاستثمار (ROI)",
        "definition": "مقياس الربحية المعبر عن نسبة صافي الربح أو الخسارة مقارنة برأس المال المستثمر في البداية."
      },
      {
        "term": "معدل النمو السنوي المركب (CAGR)",
        "definition": "متوسط وتيرة النمو السنوي لرأس المال عبر فترة متعددة السنوات بافتراض إعادة استثمار العوائد دورياً."
      },
      {
        "term": "صافي الثروة (Net Worth)",
        "definition": "القيمة النقدية الإجمالية لجميع الأصول والممتلكات الشخصية بعد خصم كافة الديون والالتزامات المالية."
      },
      {
        "term": "مؤشر كتلة الجسم (BMI)",
        "definition": "مقياس استرشادي يعتمد على قسمة الوزن على مربع الطول، ولا يقيس نسبة الدهون في الجسم بشكل مباشر."
      },
      {
        "term": "معدل الأيض الأساسي (BMR)",
        "definition": "تقدير لكمية السعرات الحرارية التي يحرقها الجسم في وضع الراحة التامة للمحافظة على الوظائف الحيوية."
      },
      {
        "term": "إجمالي استهلاك الطاقة اليومي (TDEE)",
        "definition": "تقدير لمجموع السعرات الحرارية التي يستهلكها الإنسان طوال اليوم مع احتساب الحركة والنشاط الرياضي."
      },
      {
        "term": "بكسل لكل بوصة (PPI)",
        "definition": "كثافة النقاط الضوئية الرقمية في البوصة الواحدة على شاشات الأجهزة الرقمية وفي ملفات الصور النقطية."
      },
      {
        "term": "نقطة لكل بوصة (DPI)",
        "definition": "كثافة نقاط الحبر الفعلية المطبوعة على الورق بالبوصة، وتحدد جودة ووضوح الطباعة الورقية."
      },
      {
        "term": "ملف PDF",
        "definition": "تنسيق مستندات قياسي مفتوح مصمم لحفظ الخطوط والتخطيط والتصاميم بدقة على جميع أنظمة التشغيل."
      },
      {
        "term": "تنسيق JSON",
        "definition": "تنسيق نصي قياسي خفيف وسهل القراءة لتخزين وتبادل البيانات المنظمة بين خوادم وتطبيقات الويب."
      },
      {
        "term": "رمز JWT",
        "definition": "رمز نصي مدمج وموقع رقمياً يُستخدم لتوثيق الجلسات والتحقق الآمن من الصلاحيات بين الأنظمة البرمجية."
      },
      {
        "term": "ترميز Base64",
        "definition": "خوارزمية لتحويل البيانات الثنائية (كالصور والملفات) إلى نصوص ASCII آمنة للإرسال عبر بروتوكولات الإنترنت."
      },
      {
        "term": "رمز الاستجابة السريعة (QR Code)",
        "definition": "رمز شريطي ثنائي الأبعاد يمكن مسحه بكاميرات الهواتف الذكية للوصول إلى روابط الإنترنت أو النصوص المخزنة."
      },
      {
        "term": "القسط الشهري المتساوي (EMI)",
        "definition": "دفعة شهرية ثابتة تُدفع لسداد قرض مصرفي، وتجمع بين سداد جزء من أصل القرض والفوائد المستحقة."
      },
      {
        "term": "خطة الاستثمار المنهجي (SIP)",
        "definition": "استراتيجية مالية تعتمد على استثمار مبالغ ثابتة بانتظام في صناديق استثمارية لتوزيع المخاطر عبر الزمن."
      },
      {
        "term": "ضريبة السلع والخدمات (GST / ضريبة القيمة المضافة)",
        "definition": "ضريبة غير مباشرة تُفرض على الاستهلاك المحلي للمنتجات والخدمات وفقاً للتشريعات القانونية."
      },
      {
        "term": "صندوق الادخار العام (PPF)",
        "definition": "برنامج ادخار وتقاعد حكومي طويل الأجل يتميز بإعفاءات ضريبية خاصة، وهو شائع الاستخدام في الهند."
      }
    ]
  }
};
