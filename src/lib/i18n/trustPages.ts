import type { Locale } from './config';

export interface TrustPageContent {
  title: string;
  description: string;
  eyebrow?: string;
  heroTitle: string;
  heroDescription: string;
  lastUpdated?: string;
  sections: Array<{
    title: string;
    content: string;
    points?: string[];
  }>;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface GlossaryPageContent {
  title: string;
  description: string;
  heroTitle: string;
  heroDescription: string;
  terms: GlossaryTerm[];
}

export const aboutContent: Record<Locale | 'en', TrustPageContent> = {
  en: {
    title: 'About Navorika – Free Client-Side Calculators & Utilities',
    description: 'Learn about Navorika, our local-first browser computation architecture, privacy guarantees, and verified tools.',
    eyebrow: 'About Navorika',
    heroTitle: 'Reliable, Private Tools That Run Directly in Your Browser',
    heroDescription: 'Navorika is an independent platform of free web calculators, converters, document utilities, and developer tools designed with client-first privacy.',
    sections: [
      {
        title: 'Browser-First Computation',
        content: 'Calculators and file utilities execute their logic locally using standard web technologies. Your sensitive data, financial inputs, and private documents stay on your machine rather than being transmitted to cloud servers.',
      },
      {
        title: 'Verifiable Mathematical Precision',
        content: 'Every formula, financial amortization schedule, geometry calculation, and unit transformation is built on rigorous published engineering and financial standards.',
      },
      {
        title: 'Zero Account Requirement',
        content: 'All tools are accessible freely without registration, paywalls, subscriptions, or intrusive personal data harvesting.',
      },
    ],
  },
  fr: {
    title: 'À propos de Navorika – Outils et calculateurs gratuits',
    description: 'Découvrez Navorika, notre architecture de calcul local dans le navigateur, nos garanties de confidentialité et nos outils vérifiés.',
    eyebrow: 'À propos de Navorika',
    heroTitle: 'Des outils fiables et privés qui s\'exécutent dans votre navigateur',
    heroDescription: 'Navorika est une plateforme indépendante de calculateurs, convertisseurs et utilitaires gratuits conçus pour préserver votre vie privée.',
    sections: [
      {
        title: 'Traitement local dans le navigateur',
        content: 'Les calculateurs et utilitaires de fichiers exécutent leur logique directement sur votre appareil. Vos données financières et documents privés restent chez vous.',
      },
      {
        title: 'Précision mathématique vérifiable',
        content: 'Chaque formule, tableau d\'amortissement et conversion géométrique s\'appuie sur des standards financiers et scientifiques reconnus.',
      },
      {
        title: 'Sans inscription ni abonnement',
        content: 'Tous nos outils sont accessibles gratuitement sans compte utilisateur, sans frais cachés et sans collecte de données personnelles.',
      },
    ],
  },
  it: {
    title: 'Chi siamo – Navorika Calcolatori e Strumenti Gratuiti',
    description: 'Scopri Navorika, la nostra architettura di calcolo locale nel browser, le garanzie sulla privacy e gli strumenti verificati.',
    eyebrow: 'Chi siamo',
    heroTitle: 'Strumenti affidabili e privati eseguiti direttamente nel browser',
    heroDescription: 'Navorika è una piattaforma indipendente di calcolatori gratuiti, convertitori di file e utilità per sviluppatori orientata alla privacy.',
    sections: [
      {
        title: 'Elaborazione locale nel browser',
        content: 'I calcolatori e le utilità eseguono i calcoli direttamente sul tuo dispositivo. I tuoi dati sensibili e file non vengono inviati a server esterni.',
      },
      {
        title: 'Accuratezza matematica certificata',
        content: 'Ogni algoritmo finanziario, formula geometrica e conversione di unità si basa su standard scientifici e ingegneristici verificati.',
      },
      {
        title: 'Nessun account richiesto',
        content: 'Tutti gli strumenti sono gratuiti e immediatamente disponibili senza registrazione né abbonamenti.',
      },
    ],
  },
  pt: {
    title: 'Sobre a Navorika – Calculadoras e Ferramentas Gratuitas',
    description: 'Conheça a Navorika, a nossa arquitetura de computação local no navegador, garantias de privacidade e ferramentas verificadas.',
    eyebrow: 'Sobre a Navorika',
    heroTitle: 'Ferramentas seguras e privadas que funcionam no seu navegador',
    heroDescription: 'A Navorika é uma plataforma independente de calculadoras, conversores e utilitários concebida para respeitar a privacidade.',
    sections: [
      {
        title: 'Processamento direto no dispositivo',
        content: 'As calculadoras e ferramentas processam as informações localmente no seu navegador. Os seus ficheiros e cálculos não saem do seu computador.',
      },
      {
        title: 'Rigor matemático comprovado',
        content: 'Todas as fórmulas financeiras, cálculos de engenharia e conversões seguem especificações técnicas e normas transparentes.',
      },
      {
        title: 'Utilização livre e sem registo',
        content: 'Acesso imediato a todas as funcionalidades sem necessidade de criar conta ou pagar subscrições.',
      },
    ],
  },
  es: {
    title: 'Sobre Navorika – Calculadoras y Herramientas Gratuitas',
    description: 'Conozca Navorika, nuestra arquitectura de cálculo local en el navegador, garantías de privacidad y herramientas verificadas.',
    eyebrow: 'Sobre Navorika',
    heroTitle: 'Herramientas fiables y privadas que se ejecutan en su navegador',
    heroDescription: 'Navorika es una plataforma independiente de calculadoras, conversores y utilidades web creadas con enfoque prioritario en la privacidad.',
    sections: [
      {
        title: 'Cálculo directo en el navegador',
        content: 'Las calculadoras y utilidades procesan la información de forma local en su dispositivo. Sus documentos y datos personales permanecen seguros.',
      },
      {
        title: 'Precisión matemática verificable',
        content: 'Cada modelo financiero, cálculo estructural y conversión técnica cumple con fórmulas matemáticas comprobadas.',
      },
      {
        title: 'Sin registro ni costes',
        content: 'Disfrute de todas las funciones sin crear cuentas, sin suscripciones y sin tarifas ocultas.',
      },
    ],
  },
  de: {
    title: 'Über Navorika – Kostenlose Online-Rechner & Werkzeuge',
    description: 'Erfahren Sie mehr über Navorika, unsere lokale Browser-Berechnungsarchitektur, Datenschutzgarantien und verifizierte Tools.',
    eyebrow: 'Über Navorika',
    heroTitle: 'Zuverlässige, private Werkzeuge direkt in Ihrem Browser',
    heroDescription: 'Navorika ist eine unabhängige Plattform für kostenlose Rechner, Konverter und Entwickler-Tools mit Fokus auf Datensicherheit.',
    sections: [
      {
        title: 'Lokale Ausführung im Browser',
        content: 'Rechner und Dateiwerkzeuge verarbeiten Eingaben direkt auf Ihrem Endgerät. Vertrauliche Daten und Dateien werden nicht unbefugt übertragen.',
      },
      {
        title: 'Nachprüfbare mathematische Präzision',
        content: 'Alle finanzmathematischen und technischen Berechnungen basieren auf anerkannten mathematischen Standards.',
      },
      {
        title: 'Kostenfrei ohne Anmeldung',
        content: 'Sämtliche Werkzeuge stehen ohne Registrierung, Benutzerkonto oder Abonnements zur freien Verfügung.',
      },
    ],
  },
  ru: {
    title: 'О проекте Navorika – Бесплатные онлайн-калькуляторы и утилиты',
    description: 'Узнайте о Navorika, локальных вычислениях в браузере, гарантиях конфиденциальности и надежных инструментах.',
    eyebrow: 'О проекте',
    heroTitle: 'Надежные и конфиденциальные инструменты прямо в браузере',
    heroDescription: 'Navorika — независимая веб-платформа бесплатных калькуляторов, конвертеров и утилит с локальной обработкой данных.',
    sections: [
      {
        title: 'Локальные вычисления в браузере',
        content: 'Все расчеты и преобразования файлов происходят прямо на вашем устройстве, обеспечивая максимальную сохранность конфиденциальных данных.',
      },
      {
        title: 'Проверенная точность формул',
        content: 'Каждый финансовый график, геометрический расчет и конвертер единиц построены на признанных математических стандартах.',
      },
      {
        title: 'Без регистрации и подписок',
        content: 'Все утилиты доступны бесплатно без создания учетных записей и без скрытых платежей.',
      },
    ],
  },
  ar: {
    title: 'حول نافوريكا – حاسبات وأدوات مجانية تعمل في المتصفح',
    description: 'تعرف على منصة نافوريكا، وهندسة المعالجة المحلية داخل المتصفح، وضمانات الخصوصية، والأدوات الدقيقة.',
    eyebrow: 'حول نافوريكا',
    heroTitle: 'أدوات موثوقة وخاصة تعمل مباشرة داخل متصفحك',
    heroDescription: 'نافوريكا منصة مستقلة توفر حاسبات ومحولات ملفات وأدوات تقنية مجانية مصممة بأعلى معايير الخصوصية.',
    sections: [
      {
        title: 'معالجة محلية داخل المتصفح',
        content: 'تُنفذ الحاسبات وأدوات الملفات عملياتها محليًا على جهازك دون إرسال بياناتك المالية أو مستنداتك الخاصة إلى خوادم خارجية.',
      },
      {
        title: 'دقة حسابية وهندسية موثقة',
        content: 'تعتمد جميع جداول السداد والعمليات الحسابية والتحويلات الهندسية على معادلات قياسية معتمدة ودقيقة.',
      },
      {
        title: 'استخدام مجاني دون تسجيل',
        content: 'جميع الأدوات متاحة للجميع مجانًا دون الحاجة إلى إنشاء حساب أو دفع أي رسوم اشتراك.',
      },
    ],
  },
};

export const contactContent: Record<Locale | 'en', TrustPageContent> = {
  en: {
    title: 'Contact Navorika – Support, Feedback & Inquiries',
    description: 'Get in touch with the Navorika team for tool feedback, bug reports, feature suggestions, or general inquiries.',
    eyebrow: 'Get in Touch',
    heroTitle: 'Contact Navorika Support & Feedback',
    heroDescription: 'Have a question about a calculation, found an unexpected result, or have an idea for a new tool? We value your feedback.',
    sections: [
      {
        title: 'Direct Communication',
        content: 'You can contact our team directly via email. We read every inquiry and prioritize bug reports, calculation verification requests, and accessibility improvements.',
        points: ['General Inquiries & Feedback: contact@navorika.com', 'Technical & Bug Reports: support@navorika.com'],
      },
      {
        title: 'Bug Reports & Calculation Feedback',
        content: 'When reporting an issue with a calculator or tool, including your input values, expected results, and browser details helps us inspect and resolve the problem quickly.',
      },
    ],
  },
  fr: {
    title: 'Contactez Navorika – Assistance, Retours & Questions',
    description: 'Prenez contact avec l\'équipe Navorika pour signaler un bug, suggérer un outil ou poser une question.',
    eyebrow: 'Nous contacter',
    heroTitle: 'Contact et Assistance Navorika',
    heroDescription: 'Une remarque sur un calcul, un comportement inattendu ou une idée de nouvelle fonctionnalité ? Écrivez-nous.',
    sections: [
      {
        title: 'Échange direct',
        content: 'Contactez notre équipe par courrier électronique. Nous traitons en priorité les signalements d\'anomalies et les demandes de précision.',
        points: ['Courriel général : contact@navorika.com', 'Support technique : support@navorika.com'],
      },
      {
        title: 'Signalement d\'anomalies',
        content: 'Pour nous aider à corriger rapidement un problème, merci de préciser les valeurs saisies, le résultat attendu et votre navigateur.',
      },
    ],
  },
  it: {
    title: 'Contatti Navorika – Assistenza e Suggerimenti',
    description: 'Contatta il team di Navorika per segnalare errori, richiedere chiarimenti o proporre nuovi strumenti.',
    eyebrow: 'Mettiti in contatto',
    heroTitle: 'Contatti e Supporto Navorika',
    heroDescription: 'Hai una domanda su un calcolo o vuoi suggerire una nuova funzione? Siamo sempre aperti ai tuoi riscontri.',
    sections: [
      {
        title: 'Canale Diretto',
        content: 'Scrivi direttamente al nostro team via email. Rispondiamo con tempestività a verifiche di calcolo e segnalazioni tecniche.',
        points: ['Email generale: contact@navorika.com', 'Assistenza tecnica: support@navorika.com'],
      },
      {
        title: 'Segnalazione Problemi',
        content: 'In caso di anomalie nei calcolatori, indica i dati immessi, il risultato previsto e il browser utilizzato.',
      },
    ],
  },
  pt: {
    title: 'Contacto Navorika – Suporte e Sugestões',
    description: 'Entre em contacto com a equipa da Navorika para tirar dúvidas, reportar falhas ou propor melhorias.',
    eyebrow: 'Contacte-nos',
    heroTitle: 'Apoio e Contacto Navorika',
    heroDescription: 'Encontrou algum resultado inesperado ou tem sugestões para novas ferramentas? A sua opinião é fundamental.',
    sections: [
      {
        title: 'Comunicação Direta',
        content: 'Envie-nos uma mensagem por correio eletrónico. Acompanhamos atentamente cada mensagem recebida.',
        points: ['Contacto geral: contact@navorika.com', 'Suporte técnico: support@navorika.com'],
      },
      {
        title: 'Relatório de Erros',
        content: 'Ao comunicar uma divergência de cálculo, mencione os valores utilizados e o resultado esperado para podermos averiguar.',
      },
    ],
  },
  es: {
    title: 'Contacto Navorika – Asistencia y Sugerencias',
    description: 'Contacte con el equipo de Navorika para informar sobre errores, resolver dudas o sugerir nuevas herramientas.',
    eyebrow: 'Póngase en contacto',
    heroTitle: 'Contacto y Asistencia Navorika',
    heroDescription: '¿Tiene preguntas sobre un resultado o una propuesta para una nueva utilidad? Le escuchamos atentamente.',
    sections: [
      {
        title: 'Atención Directa',
        content: 'Escríbanos a través de correo electrónico. Revisamos cada mensaje para mejorar la precisión y accesibilidad de la web.',
        points: ['Correo general: contact@navorika.com', 'Soporte técnico: support@navorika.com'],
      },
      {
        title: 'Aviso de Incidencias',
        content: 'Si detecta un fallo, incluya los valores de entrada y el resultado esperado para facilitar una rápida verificación.',
      },
    ],
  },
  de: {
    title: 'Kontakt Navorika – Support, Feedback & Anfragen',
    description: 'Kontaktieren Sie das Navorika-Team für Fragen, Feedback zu Berechnungen oder Vorschläge für neue Tools.',
    eyebrow: 'Kontakt',
    heroTitle: 'Navorika Support & Rückmeldungen',
    heroDescription: 'Haben Sie Fragen zu Berechnungen oder möchten Sie eine Anregung mitteilen? Wir freuen uns über Ihr Feedback.',
    sections: [
      {
        title: 'Direkter Kontakt',
        content: 'Sie erreichen unser Team per E-Mail. Wir prüfen technische Rückfragen und Verbesserungsvorschläge sorgfältig.',
        points: ['Allgemeine Anfragen: contact@navorika.com', 'Technischer Support: support@navorika.com'],
      },
      {
        title: 'Fehlermeldungen',
        content: 'Bitte nennen Sie bei Hinweisen zu Rechenergebnissen Ihre Eingabewerte und das erwartete Ergebnis.',
      },
    ],
  },
  ru: {
    title: 'Контакты Navorika – Поддержка и обратная связь',
    description: 'Свяжитесь с командой Navorika для сообщения об ошибках, предложений новых инструментов и общих вопросов.',
    eyebrow: 'Связаться с нами',
    heroTitle: 'Поддержка и связь с Navorika',
    heroDescription: 'Возникли вопросы по расчетам или хотите предложить новый калькулятор? Мы внимательно изучаем каждый отзыв.',
    sections: [
      {
        title: 'Электронная почта',
        content: 'Вы можете отправить письмо напрямую нашей команде. Мы оперативно реагируем на сообщения о проверке точности алгоритмов.',
        points: ['Общие вопросы: contact@navorika.com', 'Техническая поддержка: support@navorika.com'],
      },
      {
        title: 'Сообщение об ошибке',
        content: 'Для быстрой проверки укажите введенные параметры, полученный результат и версию вашего браузера.',
      },
    ],
  },
  ar: {
    title: 'اتصل بنا – نافوريكا للدعم والملاحظات',
    description: 'تواصل مع فريق منصة نافوريكا لطرح الاستفسارات، الإبلاغ عن أخطاء، أو اقتراح أدوات حسابية جديدة.',
    eyebrow: 'تواصل معنا',
    heroTitle: 'الدعم الفني والملاحظات في نافوريكا',
    heroDescription: 'هل لديك استفسار حول عملية حسابية أو فكرة لأداة مفيدة جديدة؟ نحن نرحب بجميع رسائلكم وملاحظاتكم.',
    sections: [
      {
        title: 'التواصل المباشر',
        content: 'يمكنكم مراسلة فريقنا مباشرة عبر البريد الإلكتروني. نقوم بمراجعة كافة التقارير الفنية بدقة.',
        points: ['البريد العام: contact@navorika.com', 'الدعم الفني: support@navorika.com'],
      },
      {
        title: 'الإبلاغ عن الملاحظات',
        content: 'عند الإبلاغ عن نتيجة غير متوقعة، يرجى تزويدنا بالقيم المدخلة والنتيجة المتوقعة لتسهيل الفحص السريع.',
      },
    ],
  },
};

export const privacyContent: Record<Locale | 'en', TrustPageContent> = {
  en: {
    title: 'Privacy Policy – Navorika Local-First Processing',
    description: 'Read Navorika\'s privacy commitment. Learn how our browser-local processing safeguards your data without tracking or storage.',
    eyebrow: 'Privacy Commitment',
    heroTitle: 'How Navorika Protects Your Privacy & Data',
    heroDescription: 'Our default engineering principle is simple: your data stays on your machine. We do not store your files or sell personal information.',
    lastUpdated: 'October 27, 2026',
    sections: [
      {
        title: '1. Local Browser-Based Processing',
        content: 'The vast majority of Navorika tools operate entirely within your web browser using HTML5, WebAssembly, Canvas, and client-side JavaScript. When you resize an image, convert PDF files, or compute loan schedules, the calculations execute on your computer.',
      },
      {
        title: '2. Isolated Temporary Server Tasks',
        content: 'For specialized conversions that require native engines (such as CAD STEP to 3D PDF or CorelDRAW CDR filtering), files are transferred securely via HTTPS, processed inside isolated temporary workspaces, and deleted immediately once completed.',
      },
      {
        title: '3. No User Profiling or Personal Data Resale',
        content: 'Navorika does not build advertising profiles, does not require personal logins, and never sells user information to data brokers.',
      },
    ],
  },
  fr: {
    title: 'Politique de Confidentialité – Navorika',
    description: 'Découvrez notre engagement de confidentialité. Le traitement local dans le navigateur protège vos données sans suivi.',
    eyebrow: 'Confidentialité',
    heroTitle: 'Comment Navorika protège vos données privées',
    heroDescription: 'Notre principe est clair : vos données restent sur votre appareil. Nous ne stockons pas vos fichiers et ne vendons aucune donnée.',
    lastUpdated: '27 octobre 2026',
    sections: [
      {
        title: '1. Traitement local dans le navigateur',
        content: 'La grande majorité des utilitaires Navorika s\'exécutent localement grâce aux technologies web modernes. Vos fichiers et saisies ne transitent pas par nos serveurs.',
      },
      {
        title: '2. Tâches de conversion temporaires et isolées',
        content: 'Pour certains formats industriels spécifiques (comme la CAO STEP ou certains filtres CorelDRAW), les fichiers sont traités dans des environnements éphémères puis détruits immédiatement.',
      },
      {
        title: '3. Aucune revente de données',
        content: 'Navorika ne crée pas de profils publicitaires, n\'impose pas de compte et ne commercialise aucune donnée personnelle.',
      },
    ],
  },
  it: {
    title: 'Informativa sulla Privacy – Navorika',
    description: 'La nostra politica sulla riservatezza: elaborazione locale nel browser, massima protezione dei dati e zero tracciamento invasivo.',
    eyebrow: 'Riservatezza',
    heroTitle: 'Protezione dei dati personali su Navorika',
    heroDescription: 'I tuoi dati appartengono a te e rimangono sul tuo dispositivo. Nessun archivio permanente e nessuna vendita di informazioni.',
    lastUpdated: '27 ottobre 2026',
    sections: [
      {
        title: '1. Elaborazione sul tuo dispositivo',
        content: 'La quasi totalità degli strumenti funziona internamente nel browser attraverso script locali. Le immagini e i documenti non lasciano il tuo computer.',
      },
      {
        title: '2. Conversioni server temporanee e protette',
        content: 'Alcune conversioni tecniche complesse vengono gestite in ambienti isolati con cancellazione automatica immediata al termine dell\'operazione.',
      },
      {
        title: '3. Nessuna profilazione commerciale',
        content: 'Non raccogliamo dati per finalità di marketing né cediamo alcuna informazione a terze parti.',
      },
    ],
  },
  pt: {
    title: 'Política de Privacidade – Navorika',
    description: 'Compromisso de privacidade da Navorika: processamento local no navegador, proteção dos seus ficheiros e sem registo de dados.',
    eyebrow: 'Privacidade',
    heroTitle: 'Como a Navorika protege as suas informações',
    heroDescription: 'Os seus dados permanecem no seu computador. Não guardamos os seus ficheiros nem comercializamos informações pessoais.',
    lastUpdated: '27 de outubro de 2026',
    sections: [
      {
        title: '1. Processamento no seu navegador',
        content: 'A maior parte dos conversores e calculadoras funciona diretamente no seu browser, garantindo que os seus documentos não saem da sua máquina.',
      },
      {
        title: '2. Tarefas de conversão em áreas temporárias',
        content: 'Ferramentas técnicas que necessitam de suporte de servidor utilizam espaços isolados com eliminação automática assim que o processamento termina.',
      },
      {
        title: '3. Respeito total pela privacidade',
        content: 'Não vendemos dados de utilizadores nem criamos perfis para publicidade direcionada.',
      },
    ],
  },
  es: {
    title: 'Política de Privacidad – Navorika',
    description: 'Conozca la política de privacidad de Navorika: computación local en el navegador, seguridad de archivos y cero cesión de datos.',
    eyebrow: 'Privacidad',
    heroTitle: 'Protección de sus datos y privacidad en Navorika',
    heroDescription: 'Sus archivos y datos se quedan en su dispositivo. No almacenamos copias ni compartimos datos con terceros.',
    lastUpdated: '27 de octubre de 2026',
    sections: [
      {
        title: '1. Procesamiento local en el navegador',
        content: 'Casi todas nuestras utilidades se ejecutan directamente en su navegador web. Sus datos privados no se transmiten a servidores externos.',
      },
      {
        title: '2. Conversiones temporales y seguras',
        content: 'Las herramientas avanzadas que requieren procesamiento en servidor operan en entornos aislados y eliminan los archivos al concluir.',
      },
      {
        title: '3. Sin venta de datos personales',
        content: 'Navorika no genera perfiles publicitarios ni comercializa información de navegación con empresas de publicidad.',
      },
    ],
  },
  de: {
    title: 'Datenschutzerklärung – Navorika',
    description: 'Datenschutz bei Navorika: Lokale Browser-Verarbeitung, Schutz Ihrer Dateien und keine Weitergabe persönlicher Daten.',
    eyebrow: 'Datenschutz',
    heroTitle: 'Schutz Ihrer Daten bei Navorika',
    heroDescription: 'Ihre Dateien bleiben auf Ihrem Gerät. Wir speichern keine Dokumente dauerhaft und verkaufen keine Nutzerdaten.',
    lastUpdated: '27. Oktober 2026',
    sections: [
      {
        title: '1. Lokale Verarbeitung im Browser',
        content: 'Die meisten Rechner und Werkzeuge arbeiten vollständig lokal im Browser des Nutzers. Sensible Daten verlassen Ihr Endgerät nicht.',
      },
      {
        title: '2. Isolierte temporäre Server-Verarbeitung',
        content: 'Spezialisierte Konvertierungen, die Serverunterstützung erfordern, laufen in isolierten Umgebungen und werden nach Abschluss sofort gelöscht.',
      },
      {
        title: '3. Kein Verkauf von Daten',
        content: 'Navorika erstellt keine Tracking-Profile und gibt keine persönlichen Daten an Werbenetzwerke weiter.',
      },
    ],
  },
  ru: {
    title: 'Политика конфиденциальности – Navorika',
    description: 'Обязательства Navorika по защите данных: локальная обработка в браузере, безопасность файлов и отсутствие слежки.',
    eyebrow: 'Конфиденциальность',
    heroTitle: 'Защита ваших данных на платформе Navorika',
    heroDescription: 'Ваши данные остаются на вашем устройстве. Мы не храним ваши файлы и не передаем персональные данные третьим лицам.',
    lastUpdated: '27 октября 2026 г.',
    sections: [
      {
        title: '1. Локальная обработка в браузере',
        content: 'Подавляющее большинство утилит Navorika работает непосредственно в браузере, не отправляя исходные файлы на серверы.',
      },
      {
        title: '2. Изолированная временная обработка',
        content: 'Специализированные задачи, требующие серверов, выполняются в изолированных временных папках с немедленным удалением после выгрузки.',
      },
      {
        title: '3. Отсутствие продажи данных',
        content: 'Navorika не формирует рекламных профилей и не продает информацию пользователей брокерам данных.',
      },
    ],
  },
  ar: {
    title: 'سياسة الخصوصية – منصة نافوريكا',
    description: 'التزام نافوريكا بالخصوصية: معالجة محلية داخل المتصفح، حماية كاملة للملفات، ودون تتبع أو تخزين للبيانات.',
    eyebrow: 'الخصوصية والأمان',
    heroTitle: 'كيف تحمي نافوريكا بياناتك وخصوصيتك',
    heroDescription: 'بياناتك ومستنداتك تبقى على جهازك دائمًا. نحن لا نحتفظ بملفاتك ولا نقوم ببيع أو مشاركة أي بيانات شخصية.',
    lastUpdated: '27 أكتوبر 2026',
    sections: [
      {
        title: '1. معالجة محلية بالكامل داخل المتصفح',
        content: 'تعمل الغالبية العظمى من أدوات نافوريكا مباشرة على جهاز المستخدم باستخدام تقنيات الويب الحديثة، مما يضمن عدم رفع ملفاتك إلى خوادم خارجية.',
      },
      {
        title: '2. بيئة معالجة مؤقتة ومعزولة',
        content: 'التحويلات الخاصة التي تتطلب خادمًا تُجرى داخل بيئات معزولة مؤقتة ويتم حذف الملفات فور الانتهاء من الطلب.',
      },
      {
        title: '3. عدم بيع أو استغلال البيانات',
        content: 'لا تقوم نافوريكا ببناء ملفات تتبع إعلانية ولا تبيع أي بيانات لمزودي الإعلانات.',
      },
    ],
  },
};

export const termsContent: Record<Locale | 'en', TrustPageContent> = {
  en: {
    title: 'Terms of Service – Navorika User Agreement',
    description: 'Read the terms of service governing the use of Navorika\'s online tools, calculators, and file conversion services.',
    eyebrow: 'Terms of Service',
    heroTitle: 'Terms of Service & Usage Guidelines',
    heroDescription: 'By using Navorika, you agree to these clear and fair terms. We provide free web utilities for personal and business use.',
    lastUpdated: 'October 27, 2026',
    sections: [
      {
        title: '1. Free Access & Educational Purpose',
        content: 'Navorika provides free online calculators and file tools for informational, educational, and workflow productivity purposes.',
      },
      {
        title: '2. User Ownership of Processed Content',
        content: 'You retain full intellectual property ownership of all files, text, images, and data processed with Navorika. We claim no rights over your content.',
      },
      {
        title: '3. Disclaimer of Warranties',
        content: 'Tools are provided on an "as is" and "as available" basis without warranties of any kind. Users should verify critical calculations and preflight files prior to production.',
      },
    ],
  },
  fr: {
    title: 'Conditions d\'Utilisation – Navorika',
    description: 'Consultez les conditions régissant l\'utilisation des outils et calculateurs de la plateforme Navorika.',
    eyebrow: 'Conditions d\'utilisation',
    heroTitle: 'Conditions Générales d\'Utilisation',
    heroDescription: 'En utilisant Navorika, vous acceptez nos conditions d\'utilisation simples et transparentes.',
    lastUpdated: '27 octobre 2026',
    sections: [
      {
        title: '1. Accès libre et gratuit',
        content: 'Navorika met à disposition des calculateurs et utilitaires gratuits à des fins d\'information et de productivité.',
      },
      {
        title: '2. Propriété de vos contenus',
        content: 'Vous conservez l\'entière propriété intellectuelle des fichiers et données que vous traitez sur notre site.',
      },
      {
        title: '3. Vérification des résultats',
        content: 'Les outils sont fournis en l\'état. Il appartient à l\'utilisateur de vérifier les résultats avant toute décision financière ou industrielle.',
      },
    ],
  },
  it: {
    title: 'Termini di Servizio – Navorika',
    description: 'Termini e condizioni d\'uso dei calcolatori e delle utilità online fornite da Navorika.',
    eyebrow: 'Termini di Servizio',
    heroTitle: 'Termini e Condizioni di Utilizzo',
    heroDescription: 'L\'utilizzo di Navorika implica l\'accettazione di questi termini trasparenti e a tutela dell\'utente.',
    lastUpdated: '27 ottobre 2026',
    sections: [
      {
        title: '1. Accesso Gratuito',
        content: 'Gli strumenti sono forniti gratuitamente per scopi informativi, didattici e di produttività.',
      },
      {
        title: '2. Proprietà dei Contenuti',
        content: 'Mantieni tutti i diritti di proprietà intellettuale sui file, testi e immagini elaborati tramite Navorika.',
      },
      {
        title: '3. Verifica Indipendente',
        content: 'I servizi sono offerti "così come sono". Si consiglia di verificare i calcoli critici prima di prendere decisioni definitive.',
      },
    ],
  },
  pt: {
    title: 'Termos de Serviço – Navorika',
    description: 'Leia os termos de serviço que regulam a utilização das calculadoras e conversores da Navorika.',
    eyebrow: 'Termos de Serviço',
    heroTitle: 'Termos e Condições de Utilização',
    heroDescription: 'Ao utilizar a Navorika, concorda com estes termos justos concebidos para utilização pessoal e profissional.',
    lastUpdated: '27 de outubro de 2026',
    sections: [
      {
        title: '1. Utilização Gratuita',
        content: 'A Navorika disponibiliza calculadoras e ferramentas para finalidades de apoio ao cálculo e produtividade.',
      },
      {
        title: '2. Direitos sobre os Ficheiros',
        content: 'Os utilizadores mantêm a propriedade exclusiva de todos os documentos e imagens processados.',
      },
      {
        title: '3. Isenção de Responsabilidade',
        content: 'As ferramentas são disponibilizadas sem garantias implícitas. Recomenda-se a conferência prévia de cálculos sensíveis.',
      },
    ],
  },
  es: {
    title: 'Términos de Servicio – Navorika',
    description: 'Consulte los términos de uso que rigen el funcionamiento de las herramientas y servicios de Navorika.',
    eyebrow: 'Términos de Servicio',
    heroTitle: 'Términos y Condiciones de Uso',
    heroDescription: 'El uso de Navorika supone la aceptación de estas condiciones claras y orientadas al usuario.',
    lastUpdated: '27 de octubre de 2026',
    sections: [
      {
        title: '1. Acceso Libre y Gratuito',
        content: 'Navorika ofrece utilidades y calculadoras de acceso libre para tareas informativas y laborales cotidianas.',
      },
      {
        title: '2. Titularidad del Usuario',
        content: 'Usted conserva todos los derechos sobre los archivos, datos e imágenes procesados en la plataforma.',
      },
      {
        title: '3. Verificación de Cálculos',
        content: 'Las herramientas se proporcionan tal cual están. Verifique los datos esenciales antes de proyectos de obra o financieros.',
      },
    ],
  },
  de: {
    title: 'Nutzungsbedingungen – Navorika',
    description: 'Allgemeine Nutzungsbedingungen für die Online-Rechner und Konvertierungswerkzeuge von Navorika.',
    eyebrow: 'Nutzungsbedingungen',
    heroTitle: 'Allgemeine Geschäfts- & Nutzungsbedingungen',
    heroDescription: 'Mit der Nutzung von Navorika erklären Sie sich mit diesen fairen Nutzungsregeln einverstanden.',
    lastUpdated: '27. Oktober 2026',
    sections: [
      {
        title: '1. Kostenfreie Nutzung',
        content: 'Navorika stellt Werkzeuge zu Informations- und Produktivitätszwecken ohne Nutzungsgebühren bereit.',
      },
      {
        title: '2. Rechte an Inhalten',
        content: 'Sie behalten das uneingeschränkte Eigentum an allen verarbeiteten Dateien, Texten und Grafiken.',
      },
      {
        title: '3. Eigenverantwortliche Prüfung',
        content: 'Die Bereitstellung erfolgt ohne Gewähr. Prüfen Sie kritische Berechnungen vor deren Anwendung.',
      },
    ],
  },
  ru: {
    title: 'Условия использования – Navorika',
    description: 'Ознакомьтесь с условиями использования бесплатных онлайн-инструментов и калькуляторов Navorika.',
    eyebrow: 'Условия использования',
    heroTitle: 'Пользовательское соглашение и условия',
    heroDescription: 'Использование Navorika означает согласие с данными понятными и открытыми правилами.',
    lastUpdated: '27 октября 2026 г.',
    sections: [
      {
        title: '1. Бесплатный доступ',
        content: 'Сервис предоставляет калькуляторы и утилиты для информационных целей и решения практических задач.',
      },
      {
        title: '2. Права на материалы',
        content: 'Все права на обрабатываемые файлы, тексты и изображения остаются исключительно за пользователем.',
      },
      {
        title: '3. Ограничение ответственности',
        content: 'Инструменты предоставляются по принципу «как есть». Рекомендуется перепроверять ответственные расчеты.',
      },
    ],
  },
  ar: {
    title: 'شروط الاستخدام – منصة نافوريكا',
    description: 'شروط وأحكام استخدام الأدوات والحاسبات الإلكترونية المجانية على منصة نافوريكا.',
    eyebrow: 'شروط الخدمة',
    heroTitle: 'شروط وأحكام الاستخدام',
    heroDescription: 'باستخدامك لمنصة نافوريكا، فإنك توافق على هذه الشروط العادلة والواضحة المصممة لحماية المستخدمين.',
    lastUpdated: '27 أكتوبر 2026',
    sections: [
      {
        title: '1. الوصول المجاني للأدوات',
        content: 'توفر نافوريكا أدوات وحاسبات إلكترونية لأغراض إرشادية وتسهيل إنجاز المهام اليومية مجانًا.',
      },
      {
        title: '2. ملكية المستخدم للملفات',
        content: 'يحتفظ المستخدم بكامل حقوق الملكية الفكرية لملفاته ومستنداته وبياناته المعالجة.',
      },
      {
        title: '3. إخلاء المسؤولية والتحقق',
        content: 'تُقدم الأدوات كما هي دون ضمانات صريحة، ويُنصح دائمًا بالتحقق من الحسابات المالية والإنشائية الهامة.',
      },
    ],
  },
};

export const disclaimerContent: Record<Locale | 'en', TrustPageContent> = {
  en: {
    title: 'Disclaimer – Estimation & Planning Disclosures | Navorika',
    description: 'Read Navorika\'s general disclaimers regarding financial estimates, construction quantities, and fitness calculations.',
    eyebrow: 'Disclaimers',
    heroTitle: 'Planning Estimates & Professional Advice Disclaimers',
    heroDescription: 'Navorika tools provide general planning calculations. They do not constitute certified professional financial, engineering, tax, or medical advice.',
    lastUpdated: 'October 27, 2026',
    sections: [
      {
        title: 'Financial & Investment Calculations',
        content: 'Results generated by financial calculators are planning estimates based on mathematical compounding models. They do not predict market performance, guarantee investment yields, or account for future tax changes.',
      },
      {
        title: 'Construction & Material Estimates',
        content: 'Quantities for concrete, roofing, joists, and masonry are approximations based on theoretical dimensions. Material loss, site tolerances, and local building codes require on-site contractor confirmation.',
      },
      {
        title: 'Health & Fitness Metrics',
        content: 'Biometric formulas (BMI, BMR, TDEE) are statistical screening tools and are not a substitute for clinical diagnosis or medical guidance.',
      },
    ],
  },
  fr: {
    title: 'Avertissement Légal – Navorika',
    description: 'Informations légales et avertissements concernant les estimations financières, de construction et de santé sur Navorika.',
    eyebrow: 'Avertissements',
    heroTitle: 'Estimations indicatives et conseils professionnels',
    heroDescription: 'Les outils de Navorika fournissent des estimations indicatives et ne remplacent pas les conseils de professionnels agréés.',
    lastUpdated: '27 octobre 2026',
    sections: [
      {
        title: 'Calculs financiers et investissements',
        content: 'Les calculs sont des simulations théoriques. Ils ne constituent pas des conseils financiers, fiscaux ou juridiques.',
      },
      {
        title: 'Estimations de matériaux et chantier',
        content: 'Les quantités estimées pour le béton, la toiture ou la maçonnerie doivent être vérifiées sur place par un professionnel qualifié.',
      },
      {
        title: 'Indicateurs de bien-être',
        content: 'Les formules biométriques (IMC, MB) sont des indicateurs statistiques qui ne remplacent aucun avis médical.',
      },
    ],
  },
  it: {
    title: 'Disclaimer Legale – Navorika',
    description: 'Dichiarazioni di non responsabilità relative alle stime finanziarie, edili e sanitarie fornite da Navorika.',
    eyebrow: 'Disclaimer',
    heroTitle: 'Stime Orientative e Pareri Professionali',
    heroDescription: 'Gli strumenti forniscono calcoli a scopo indicativo e non costituiscono consulenza finanziaria, legale o medica.',
    lastUpdated: '27 ottobre 2026',
    sections: [
      {
        title: 'Calcolatori Finanziari',
        content: 'Le simulazioni finanziarie sono stime di pianificazione e non garantiscono rendimenti effettivi né considerano variazioni fiscali future.',
      },
      {
        title: 'Calcoli di Cantiere e Costruzioni',
        content: 'I fabbisogni di calcestruzzo, mattoni o legname devono essere convalidati da tecnici abilitati sul cantiere.',
      },
      {
        title: 'Valutazioni Biometriche',
        content: 'I parametri fisici (BMI, BMR) hanno valore puramente statistico e non sostituiscono un consulto medico.',
      },
    ],
  },
  pt: {
    title: 'Aviso Legal – Navorika',
    description: 'Avisos e esclarecimentos sobre estimativas financeiras, de construção e saúde na plataforma Navorika.',
    eyebrow: 'Aviso Legal',
    heroTitle: 'Estimativas de Planeamento e Apoio Técnico',
    heroDescription: 'Os resultados gerados são estimativas informativas que não dispensam o aconselhamento de peritos qualificados.',
    lastUpdated: '27 de outubro de 2026',
    sections: [
      {
        title: 'Cálculos Financeiros',
        content: 'As projeções de empréstimos e investimentos são simulações teóricas e não constituem recomendação financeira ou fiscal.',
      },
      {
        title: 'Estimativas de Obras',
        content: 'O cálculo de materiais para betão ou coberturas requer validação por profissionais da construção civil no local.',
      },
      {
        title: 'Métricas de Saúde',
        content: 'Os índices biométricos servem de referência geral e não devem ser interpretados como diagnósticos clínicos.',
      },
    ],
  },
  es: {
    title: 'Aviso Legal – Navorika',
    description: 'Descargo de responsabilidad sobre estimaciones financieras, de construcción y biométricas en Navorika.',
    eyebrow: 'Aviso Legal',
    heroTitle: 'Estimaciones Orientativas y Asesoramiento Técnico',
    heroDescription: 'Las calculadoras proporcionan estimaciones generales que no sustituyen el criterio de profesionales titulados.',
    lastUpdated: '27 de octubre de 2026',
    sections: [
      {
        title: 'Cálculos de Finanzas',
        content: 'Las simulaciones de préstamos y rentabilidad no constituyen asesoramiento financiero, tributario o legal vinculante.',
      },
      {
        title: 'Estimaciones de Construcción',
        content: 'El consumo de hormigón, ladrillos o vigas debe ser supervisado por personal técnico competente en la obra.',
      },
      {
        title: 'Indicadores Biométricos',
        content: 'Los índices de masa corporal y gasto calórico son referencias estadísticas y no recomendaciones médicas.',
      },
    ],
  },
  de: {
    title: 'Haftungsausschluss – Navorika',
    description: 'Rechtliche Hinweise und Haftungsausschlüsse zu Finanz-, Bau- und Gesundheitsberechnungen auf Navorika.',
    eyebrow: 'Haftungsausschluss',
    heroTitle: 'Hinweise zu Planungswerten & Fachberatung',
    heroDescription: 'Die Rechner liefern Orientierungswerte und ersetzen keine individuelle fachliche Beratung durch Experten.',
    lastUpdated: '27. Oktober 2026',
    sections: [
      {
        title: 'Finanzberechnungen',
        content: 'Ergebnisse zu Krediten oder Geldanlagen sind Modellrechnungen und stellen keine Anlage-, Steuer- oder Rechtsberatung dar.',
      },
      {
        title: 'Bau- und Materialmengen',
        content: 'Mengenangaben zu Beton oder Baustoffen sind Schätzwerte und müssen vor Ort von Fachleuten geprüft werden.',
      },
      {
        title: 'Gesundheitswerte',
        content: 'Biometrische Werte wie der BMI dienen der Orientierung und sind keine medizinischen Diagnosen.',
      },
    ],
  },
  ru: {
    title: 'Отказ от ответственности – Navorika',
    description: 'Уведомления и ограничения ответственности по финансовым, строительным и биометрическим расчетам на Navorika.',
    eyebrow: 'Отказ от ответственности',
    heroTitle: 'Ориентировочные расчеты и профессиональные консультации',
    heroDescription: 'Инструменты Navorika предоставляют оценочные данные и не заменяют консультаций квалифицированных специалистов.',
    lastUpdated: '27 октября 2026 г.',
    sections: [
      {
        title: 'Финансовые расчеты',
        content: 'Результаты расчетов кредитов и инвестиций носят ознакомительный характер и не являются финансовыми рекомендациями.',
      },
      {
        title: 'Строительные расчеты',
        content: 'Расчет расхода бетона, кирпича и пиломатериалов требует подтверждения строительными специалистами на объекте.',
      },
      {
        title: 'Показатели здоровья',
        content: 'Биометрические индексы (ИМТ и калории) представляют собой статистические данные и не заменяют осмотра врача.',
      },
    ],
  },
  ar: {
    title: 'إخلاء المسؤولية – منصة نافوريكا',
    description: 'توضيحات وإخلاء مسؤولية بشأن التقديرات المالية والإنشائية والصحية المقدمة عبر منصة نافوريكا.',
    eyebrow: 'إخلاء المسؤولية',
    heroTitle: 'تقديرات تخطيطية وإرشادات عامة',
    heroDescription: 'تقدم أدوات نافوريكا تقديرات حسابية استرشادية ولا تُعد بديلاً عن الاستشارات المهنية المتخصصة.',
    lastUpdated: '27 أكتوبر 2026',
    sections: [
      {
        title: 'الحسابات المالية والاستثمارية',
        content: 'تعتبر نتائج حاسبات القروض والادخار تقديرات حسابية مبسطة ولا تشكل استشارة مالية أو ضريبية معتمدة.',
      },
      {
        title: 'تقديرات مواد البناء والإنشاءات',
        content: 'تخضع كميات الخرسانة والطوب والحديد للظروف الميدانية ويجب اعتمادها من قبل مهندس مختص.',
      },
      {
        title: 'المؤشرات الحيوية والصحية',
        content: 'مؤشرات كتلة الجسم والسعرات الحرارية هي أدوات إحصائية عامة ولا تغني عن الاستشارة الطبية السريرية.',
      },
    ],
  },
};

export const methodologyContent: Record<Locale | 'en', TrustPageContent> = {
  en: {
    title: 'Calculation Methodology – Navorika Computational Standards',
    description: 'Explore the mathematical formulas, compounding models, unit conversions, and validation protocols behind Navorika.',
    eyebrow: 'Methodology',
    heroTitle: 'Transparent Engineering & Computational Standards',
    heroDescription: 'We believe transparency is the foundation of trust. Here is how our calculations, algorithms, and conversion pipelines work.',
    lastUpdated: 'October 27, 2026',
    sections: [
      {
        title: '1. Standardized Compounding & Amortization',
        content: 'Our loan, mortgage, and investment tools apply industry-standard annuity formulas. Compound interest uses exact periodic compounding intervals with boundary validation.',
      },
      {
        title: '2. Unit Standards & Conversions',
        content: 'Metric and imperial conversions adhere strictly to international standards (NIST and ISO standards). Unit factors are immutable constants to prevent drift.',
      },
      {
        title: '3. Image & Vector Geometry Processing',
        content: 'Raster operations utilize native OffscreenCanvas and WebAssembly graphics pipelines. Vector processing preserves aspect ratios and coordinates without loss.',
      },
    ],
  },
  fr: {
    title: 'Méthodologie de Calcul – Standards Navorika',
    description: 'Consultez les formules mathématiques, modèles d\'amortissement et protocoles de vérification appliqués par Navorika.',
    eyebrow: 'Méthodologie',
    heroTitle: 'Transparence Technique et Standards de Calcul',
    heroDescription: 'La confiance repose sur la clarté. Découvrez comment nos algorithmes et formules sont rigoureusement conçus.',
    lastUpdated: '27 octobre 2026',
    sections: [
      {
        title: '1. Amortissements et intérêts composés',
        content: 'Nos calculateurs de prêts et d\'épargne appliquent les formules actuarielles reconnues avec des fréquences de composition exactes.',
      },
      {
        title: '2. Conversions d\'unités normalisées',
        content: 'Toutes les conversions d\'unités de mesure s\'appuient sur les normes internationales officielles du système métrique et impérial.',
      },
      {
        title: '3. Traitement graphique et vectoriel',
        content: 'Les calculs d\'images et de tracés vectoriels respectent scrupuleusement les proportions géométriques sans déformation.',
      },
    ],
  },
  it: {
    title: 'Metodologia di Calcolo – Standard Navorika',
    description: 'Le formule matematiche, i modelli di ammortamento e le procedure di calcolo utilizzate da Navorika.',
    eyebrow: 'Metodologia',
    heroTitle: 'Trasparenza degli Algoritmi e Standard di Calcolo',
    heroDescription: 'La precisione richiede trasparenza. Ecco i fondamenti matematici su cui poggiano i nostri strumenti.',
    lastUpdated: '27 ottobre 2026',
    sections: [
      {
        title: '1. Modelli Finanziari Standard',
        content: 'I calcolatori finanziari adottano le formule classiche di attualizzazione e piani di ammortamento precisi per periodo.',
      },
      {
        title: '2. Costanti di Conversione Verificate',
        content: 'Le tabelle di conversione metrica e imperiale impiegano coefficienti costanti conformi alle norme internazionali ISO.',
      },
      {
        title: '3. Precisione Geometrica',
        content: 'La manipolazione di file grafici preserva proporzioni, risoluzione e coordinate vettoriali in modo fedele.',
      },
    ],
  },
  pt: {
    title: 'Metodologia de Cálculo – Padrões Navorika',
    description: 'Fórmulas matemáticas, métodos de amortização e critérios de conversão adotados nas ferramentas da Navorika.',
    eyebrow: 'Metodologia',
    heroTitle: 'Critérios de Engenharia e Rigor nos Cálculos',
    heroDescription: 'Explicamos com total transparência os princípios matemáticos e algoritmos integrados nas nossas ferramentas.',
    lastUpdated: '27 de outubro de 2026',
    sections: [
      {
        title: '1. Fórmulas de Amortização Verificadas',
        content: 'Os simuladores financeiros utilizam formulações matemáticas padrão para regimes de juros compostos e anuidades periódicas.',
      },
      {
        title: '2. Fatores de Conversão Rígidos',
        content: 'Todas as conversões métricas e imperiais recorrem a fatores fixos estabelecidos pelas normas metrológicas internacionais.',
      },
      {
        title: '3. Processamento Vetorial Exato',
        content: 'As ferramentas gráficas mantêm a integridade dimensional e geométrica dos vetores sem distorções no resultado final.',
      },
    ],
  },
  es: {
    title: 'Metodología de Cálculo – Estándares Navorika',
    description: 'Conozca las fórmulas matemáticas, algoritmos financieros y protocolos de comprobación de Navorika.',
    eyebrow: 'Metodología',
    heroTitle: 'Transparencia Técnica y Métodos de Cálculo',
    heroDescription: 'La precisión se basa en la claridad de los métodos. Presentamos la lógica detrás de nuestros algoritmos.',
    lastUpdated: '27 de octubre de 2026',
    sections: [
      {
        title: '1. Modelos Financieros Precisos',
        content: 'Nuestras calculadoras de préstamos aplican fórmulas de anualidades compuestas con intervalos exactos de amortización.',
      },
      {
        title: '2. Conversión Homologada de Unidades',
        content: 'Las equivalencias métricas e imperiales cumplen con los estándares internacionales de calibración y metrología.',
      },
      {
        title: '3. Tratamiento de Geometría Vectorial',
        content: 'Las utilidades gráficas respetan las proporciones exactas y preservan la fidelidad de las coordenadas originales.',
      },
    ],
  },
  de: {
    title: 'Berechnungsmethodik – Standards von Navorika',
    description: 'Mathematische Formeln, Zinseszinsmodelle und Prüfverfahren hinter den Rechnern von Navorika.',
    eyebrow: 'Methodik',
    heroTitle: 'Transparente mathematische & technische Standards',
    heroDescription: 'Vertrauen entsteht durch Transparenz. So funktionieren die Berechnungslogiken und Algorithmen unserer Plattform.',
    lastUpdated: '27. Oktober 2026',
    sections: [
      {
        title: '1. Finanzmathematische Standardformeln',
        content: 'Kredit- und Zinsrechner nutzen bewährte Annuitätenformeln mit exakter periodischer Zinsverrechnung.',
      },
      {
        title: '2. Exakte Einheitenumrechnung',
        content: 'Umrechnungen zwischen metrischen und angloamerikanischen Maßeinheiten basieren auf unveränderlichen ISO-Normwerten.',
      },
      {
        title: '3. Geometrisch exakte Vektorverarbeitung',
        content: 'Grafikwerkzeuge wahren Seitenverhältnisse und Koordinaten ohne Informationsverlust.',
      },
    ],
  },
  ru: {
    title: 'Методология расчетов – Стандарты Navorika',
    description: 'Математические формулы, алгоритмы начисления процентов и правила конвертации на платформе Navorika.',
    eyebrow: 'Методология',
    heroTitle: 'Открытые математические и технические стандарты',
    heroDescription: 'Точность расчетов требует полной прозрачности. Рассказываем о принципах работы наших вычислительных алгоритмов.',
    lastUpdated: '27 октября 2026 г.',
    sections: [
      {
        title: '1. Финансовые формулы и аннуитеты',
        content: 'Калькуляторы займов и накоплений используют стандартные формулы сложных процентов с точным разбиением по периодам.',
      },
      {
        title: '2. Стандартизированная конвертация единиц',
        content: 'Все соотношения метрических и имперских единиц строго соответствуют международным метрологическим стандартам ISO.',
      },
      {
        title: '3. Геометрическая точность векторных данных',
        content: 'Обработка изображений и векторных контуров сохраняет пропорции без искажения пространственных координат.',
      },
    ],
  },
  ar: {
    title: 'منهجية الحسابات – المعايير التقنية في نافوريكا',
    description: 'تعرف على المعادلات الرياضية، ونماذج الفائدة المركبة، ومعايير التحويل الدقيقة المعتمدة في منصة نافوريكا.',
    eyebrow: 'منهجية العمل',
    heroTitle: 'معايير هندسية وحسابية قائمة على الشفافية',
    heroDescription: 'نؤمن بأن الشفافية هي أساس الثقة. إليك كيفية عمل الخوارزميات والمعادلات الحسابية المعتمدة في نافوريكا.',
    lastUpdated: '27 أكتوبر 2026',
    sections: [
      {
        title: '1. معادلات الاستهلاك والفائدة المعيارية',
        content: 'تطبق حاسبات القروض والتمويل معادلات الدفعات الدورية القياسية مع التحقق الدقيق من الفترات الزمنية.',
      },
      {
        title: '2. معاملات تحويل قياسية وثابتة',
        content: 'تعتمد جميع تحويلات القياس المترية والإنجليزية على ثوابت قياسية دولية متوافقة مع مواصفات ISO.',
      },
      {
        title: '3. دقة المعالجة الهندسية للرسومات المتجهة',
        content: 'تضمن معالجة الرسوم المتجهة الحفاظ الكامل على النسب الأصلية والإحداثيات دون أي تشويه في المخرجات.',
      },
    ],
  },
};

export const glossaryContent: Record<Locale | 'en', GlossaryPageContent> = {
  en: {
    title: 'Financial, Technical & Converter Glossary | Navorika',
    description: 'Quick definitions and plain explanations for common terms across finance, construction, PDF, image, and developer tools.',
    heroTitle: 'Tool Terms, Finance & Technical Glossary',
    heroDescription: 'Clear, concise explanations of essential concepts used across Navorika\'s calculators and converters.',
    terms: [
      { term: 'APR', definition: 'Annual Percentage Rate – the yearly cost of borrowing, including interest and certain loan fees.' },
      { term: 'APY', definition: 'Annual Percentage Yield – the real compound annual return earned on a savings balance or investment.' },
      { term: 'Principal', definition: 'The initial sum of money borrowed in a loan or committed into an investment before interest accumulates.' },
      { term: 'Mortgage', definition: 'A long-term secured loan utilized to purchase real property, repaid through regular principal and interest installments.' },
      { term: 'ROI', definition: 'Return on Investment – a profitability metric expressing net financial gain as a percentage of initial outlay.' },
      { term: 'CAGR', definition: 'Compound Annual Growth Rate – the smoothed annualized rate of return over a multi-year period assuming reinvestment.' },
      { term: 'Net Worth', definition: 'The total economic value of an individual\'s assets minus all outstanding financial liabilities and debts.' },
      { term: 'BMI', definition: 'Body Mass Index – an introductory biometric screening ratio comparing body weight against height squared.' },
      { term: 'BMR', definition: 'Basal Metabolic Rate – the baseline caloric energy expenditure required to sustain vital bodily functions at rest.' },
      { term: 'TDEE', definition: 'Total Daily Energy Expenditure – total estimated daily calories burned across basal metabolic rate and physical exertion.' },
      { term: 'PPI', definition: 'Pixels Per Inch – the pixel density measurement of a digital display raster or digital image output.' },
      { term: 'DPI', definition: 'Dots Per Inch – the physical output resolution density produced by printing presses and digital printers.' },
      { term: 'PDF', definition: 'Portable Document Format – an ISO-standardized document file specification preserving fixed vector and typography layout.' },
      { term: 'JSON', definition: 'JavaScript Object Notation – a lightweight, human-readable structured data interchange standard.' },
      { term: 'JWT', definition: 'JSON Web Token – a compact, cryptographically signed token format for secure claims verification between systems.' },
      { term: 'Base64', definition: 'A radix-64 encoding scheme representing binary data streams as ASCII character strings.' },
      { term: 'QR Code', definition: 'Quick Response Code – a high-capacity two-dimensional matrix barcode holding text, URLs, or structured payloads.' },
      { term: 'EMI', definition: 'Equated Monthly Installment – an equal monthly payment covering interest and principal reduction over a fixed loan tenure.' },
      { term: 'SIP', definition: 'Systematic Investment Plan – a structured disciplined strategy investing fixed periodic sums into mutual funds over time.' },
    ],
  },
  fr: {
    title: 'Glossaire Financier, Technique et Pratique | Navorika',
    description: 'Définitions claires des termes clés de la finance, du bâtiment, de l\'image et du développement web sur Navorika.',
    heroTitle: 'Glossaire des Concepts et Outils Navorika',
    heroDescription: 'Retrouvez les explications simples des notions essentielles utilisées dans nos calculateurs et convertisseurs.',
    terms: [
      { term: 'TAEG', definition: 'Taux Annuel Effectif Global – le coût total d\'un crédit incluant les intérêts et frais obligatoires.' },
      { term: 'Rendement composé', definition: 'Le taux annuel réel perçu sur une épargne après réinvestissement systématique des intérêts.' },
      { term: 'Capital', definition: 'Le montant initial emprunté ou investi avant toute accumulation d\'intérêts.' },
      { term: 'Prêt immobilier', definition: 'Un crédit à long terme accordé pour financer l\'acquisition d\'un bien foncier.' },
      { term: 'Retour sur investissement (ROI)', definition: 'Le ratio de rentabilité mesurant le gain financier net par rapport à l\'investissement initial.' },
      { term: 'TCAM', definition: 'Taux de Croissance Annuel Moyen – le taux de progression annuel moyen d\'un placement sur plusieurs années.' },
      { term: 'Patrimoine net', definition: 'La valeur totale des actifs possédés déduction faite de l\'ensemble des dettes.' },
      { term: 'IMC', definition: 'Indice de Masse Corporelle – un indicateur morphologique statistique basé sur le poids et la taille.' },
      { term: 'Métabolisme de base', definition: 'La quantité minimale d\'énergie nécessaire à l\'organisme pour maintenir ses fonctions vitales au repos.' },
      { term: 'Dépense énergétique quotidienne', definition: 'Le volume total de calories brûlées au cours d\'une journée, activité physique comprise.' },
      { term: 'Pixels par pouce (PPP)', definition: 'La densité de pixels affichés par pouce sur un écran numérique.' },
      { term: 'Points par pouce (DPI)', definition: 'La mesure de la résolution d\'impression physique exprimée en points d\'encre par pouce.' },
      { term: 'PDF', definition: 'Format de document universel préservant la mise en page et les polices de caractères sur tous les écrans.' },
      { term: 'JSON', definition: 'Format textuel léger de données structurées largement utilisé pour l\'échange d\'informations sur le web.' },
      { term: 'JWT', definition: 'Jeton sécurisé signé numériquement permettant d\'authentifier les échanges entre applications.' },
      { term: 'Base64', definition: 'Algorithme d\'encodage permettant de convertir des données binaires en caractères texte.' },
      { term: 'Code QR', definition: 'Code-barres bidimensionnel capable d\'encoder des liens ou des informations directement lisibles par smartphone.' },
      { term: 'Échéance constante', definition: 'Mensualité fixe remboursant conjointement les intérêts et le capital d\'un emprunt.' },
      { term: 'Versement programmé', definition: 'Méthode d\'investissement régulier consistant à placer un montant fixe à intervalles constants.' },
    ],
  },
  it: {
    title: 'Glossario Finanziario e Tecnico | Navorika',
    description: 'Definizioni rapide e spiegazioni semplici per i termini utilizzati nei calcolatori e convertitori di Navorika.',
    heroTitle: 'Glossario dei Termini e delle Definizioni',
    heroDescription: 'Spiegazioni essenziali per orientarsi nei concetti finanziari, tecnici e digitali presenti sul nostro sito.',
    terms: [
      { term: 'TAEG', definition: 'Tasso Annuo Effettivo Globale – il costo complessivo di un finanziamento espresso su base annua.' },
      { term: 'Rendimento effettivo', definition: 'Il guadagno reale annuo generato da un investimento considerando l\'interesse composto.' },
      { term: 'Capitale iniziale', definition: 'La somma originariamente presa in prestito o investita prima del computo degli interessi.' },
      { term: 'Mutuo', definition: 'Un prestito a lungo termine destinato all\'acquisto o ristrutturazione di un immobile.' },
      { term: 'ROI', definition: 'Ritorno sull\'investimento – misura percentuale del profitto ottenuto rispetto al capitale impiegato.' },
      { term: 'CAGR', definition: 'Tasso annuo di crescita composto – la crescita annuale media di un capitale su un orizzonte pluriennale.' },
      { term: 'Patrimonio netto', definition: 'Il valore di tutte le attività possedute al netto di debiti e obbligazioni in essere.' },
      { term: 'BMI', definition: 'Indice di Massa Corporea – rapporto statistico tra il peso corporeo e il quadrato dell\'altezza.' },
      { term: 'Metabolismo basale', definition: 'Le calorie minime consumate dal corpo per mantenere le funzioni vitali a riposo.' },
      { term: 'TDEE', definition: 'Fabbisogno calorico giornaliero totale comprensivo delle attività motorie e lavorative.' },
      { term: 'PPI', definition: 'Pixel per pollice – la misura della densità di punti digitali su uno schermo.' },
      { term: 'DPI', definition: 'Punti per pollice – la densità di stampa fisica su carta o altro supporto.' },
      { term: 'PDF', definition: 'Formato universale che mantiene immutata la struttura visiva del documento su ogni dispositivo.' },
      { term: 'JSON', definition: 'Standard di testo compatto per la memorizzazione e l\'interscambio di dati tra sistemi software.' },
      { term: 'JWT', definition: 'Formato standard compatto per trasmettere in sicurezza attestazioni firmate tra parti.' },
      { term: 'Base64', definition: 'Codifica utilizzata per rappresentare dati binari mediante stringhe di testo leggibili.' },
      { term: 'QR Code', definition: 'Codice a barre bidimensionale leggibile rapidamente da fotocamere per accedere a link o dati.' },
      { term: 'Rata mensile', definition: 'Importo periodico costante versato per estinguere progressivamente un debito bancario.' },
      { term: 'Piano di accumulo', definition: 'Strategia di risparmio che prevede investimenti periodici regolari nel tempo.' },
    ],
  },
  pt: {
    title: 'Glossário Financeiro e Tecnológico | Navorika',
    description: 'Definições simples e objetivas dos termos utilizados nas calculadoras financeiras, de construção e formatos digitais.',
    heroTitle: 'Glossário de Conceitos e Ferramentas Navorika',
    heroDescription: 'Compreenda com clareza os termos práticos que encontra nas calculadoras e utilitários da plataforma.',
    terms: [
      { term: 'TAEG', definition: 'Taxa Anual de Encargos Efetiva Global – o custo total do crédito para o consumidor por ano.' },
      { term: 'Taxa efetiva', definition: 'O rendimento anual verdadeiro de uma poupança após a capitalização periódica dos juros.' },
      { term: 'Capital inicial', definition: 'O valor inicial financiado ou depositado antes da incidência de quaisquer juros.' },
      { term: 'Crédito habitação', definition: 'Empréstimo concedido para aquisição ou construção de imóveis com garantia real.' },
      { term: 'Retorno (ROI)', definition: 'Medida percentual do ganho ou perda financeira em relação ao valor investido.' },
      { term: 'CAGR', definition: 'Taxa de crescimento anual composta – a evolução anual ponderada de um ativo ao longo de vários anos.' },
      { term: 'Património líquido', definition: 'A soma de todos os bens e recursos financeiros subtraindo as dívidas totais.' },
      { term: 'IMC', definition: 'Índice de Massa Corporal – cálculo de referência que relaciona o peso e a altura do indivíduo.' },
      { term: 'Taxa metabólica basal', definition: 'O gasto calórico indispensável para assegurar as funções vitais do organismo em repouso.' },
      { term: 'Gasto calórico total', definition: 'A quantidade de calorias que o corpo queima ao longo de um dia com esforço físico.' },
      { term: 'PPI', definition: 'Píxeis por polegada – a densidade de pontos luminosos que compõem uma imagem num ecrã.' },
      { term: 'DPI', definition: 'Pontos por polegada – o índice de resolução utilizado por impressoras para definir a nitidez física.' },
      { term: 'PDF', definition: 'Padrão digital internacional concebido para preservar o aspeto exato de um documento.' },
      { term: 'JSON', definition: 'Estrutura leve em formato de texto para troca eficiente de dados entre aplicações informáticas.' },
      { term: 'JWT', definition: 'Mecanismo compacto para transmissão segura de credenciais e permissões de acesso.' },
      { term: 'Base64', definition: 'Método de codificação que converte ficheiros binários em caracteres alfanuméricos.' },
      { term: 'Código QR', definition: 'Matriz bidimensional que armazena hiperligações ou dados facilmente legíveis por dispositivos móveis.' },
      { term: 'Prestação mensal', definition: 'Pagamento periódico fixo que amortiza parcelas de capital e cobre juros de um financiamento.' },
      { term: 'Plano de entregas', definition: 'Método que aplica parcelas fixas regulares em fundos para atenuar as oscilações de mercado.' },
    ],
  },
  es: {
    title: 'Glosario Financiero, Técnico y de Herramientas | Navorika',
    description: 'Definiciones sencillas y precisas de los términos habituales en calculadoras de finanzas, construcción y formatos de archivo.',
    heroTitle: 'Glosario de Términos y Conceptos Navorika',
    heroDescription: 'Respuestas rápidas para comprender los términos que aparecen en nuestros conversores y calculadoras.',
    terms: [
      { term: 'TAE', definition: 'Tasa Anual Equivalente – el coste o rendimiento efectivo anual de un producto financiero con gastos incluidos.' },
      { term: 'Rendimiento compuesto', definition: 'El beneficio anual real obtenido al acumular y reinvertir periódicamente los intereses generados.' },
      { term: 'Capital principal', definition: 'La suma inicial solicitada en préstamo o colocada en una inversión previa a los intereses.' },
      { term: 'Hipoteca', definition: 'Préstamo a largo plazo garantizado con un bien inmueble que se amortiza mediante cuotas regulares.' },
      { term: 'ROI', definition: 'Retorno de la inversión – indicador que mide el beneficio porcentual obtenido respecto al capital invertido.' },
      { term: 'CAGR', definition: 'Tasa de crecimiento anual compuesta – el ritmo constante medio de crecimiento de una inversión a varios años.' },
      { term: 'Patrimonio neto', definition: 'El valor total de los bienes y derechos económicos de una persona tras restar sus deudas.' },
      { term: 'IMC', definition: 'Índice de Masa Corporal – fórmula estadística que relaciona el peso y la estatura para orientación física.' },
      { term: 'Metabolismo basal', definition: 'La cantidad mínima de energía calórica que consume el organismo para mantenerse vivo en reposo.' },
      { term: 'Gasto calórico diario', definition: 'El consumo calórico total en 24 horas teniendo en cuenta el ejercicio y la actividad diaria.' },
      { term: 'Píxeles por pulgada (PPI)', definition: 'La concentración de píxeles digitales por pulgada visible en pantallas.' },
      { term: 'Puntos por pulgada (DPI)', definition: 'La medida de resolución física empleada en impresión sobre papel u otros soportes.' },
      { term: 'PDF', definition: 'Formato estándar universal que asegura que un documento se vea exactamente igual en cualquier visor.' },
      { term: 'JSON', definition: 'Formato de texto abierto y sencillo para almacenar e intercambiar información estructurada entre sistemas.' },
      { term: 'JWT', definition: 'Token firmado digitalmente que permite validar identidades y datos de forma segura y compacta.' },
      { term: 'Base64', definition: 'Sistema de codificación que transforma información binaria en cadenas de texto estándar.' },
      { term: 'Código QR', definition: 'Código bidimensional que permite acceder a enlaces web o información con la cámara del teléfono.' },
      { term: 'Cuota mensual', definition: 'Pago periódico periódico que incluye una fracción de amortización del capital y los intereses devengados.' },
      { term: 'Plan de aportaciones periódicas', definition: 'Estrategia de inversión que consiste en aportar importes constantes a intervalos regulares.' },
    ],
  },
  de: {
    title: 'Glossar für Finanzen, Technik & Rechner | Navorika',
    description: 'Verständliche Begriffserklärungen zu Finanzen, Bauwesen, Bildformaten und Entwickler-Tools auf Navorika.',
    heroTitle: 'Fachglossar der Navorika-Werkzeuge',
    heroDescription: 'Kompakte und präzise Erläuterungen der Fachbegriffe aus unseren Rechnern und Konvertern.',
    terms: [
      { term: 'Effektiver Jahreszins', definition: 'Die Gesamtkosten eines Kredits pro Jahr, ausgedrückt in Prozent inklusive aller Nebenkosten.' },
      { term: 'Zinseszinseffekt', definition: 'Der Zuwachs des Kapitals durch die fortlaufende Wiederverzinsung bereits erhaltener Erträge.' },
      { term: 'Kreditbetrag', definition: 'Der ursprünglich geliehene oder angelegte Geldbetrag vor Anfall der Zinsen.' },
      { term: 'Immobiliendarlehen', definition: 'Ein langfristiger, grundpfandrechtlich gesicherter Kredit zur Finanzierung von Immobilien.' },
      { term: 'Kapitalrendite (ROI)', definition: 'Das prozentuale Verhältnis zwischen dem erzielten Reingewinn und dem eingesetzten Kapital.' },
      { term: 'CAGR', definition: 'Jährliche Wachstumsrate – das durchschnittliche jährliche Wachstum einer Geldanlage über mehrere Jahre.' },
      { term: 'Nettovermögen', definition: 'Der Gesamtwert aller vorhandenen Vermögenswerte abzüglich sämtlicher Verbindlichkeiten.' },
      { term: 'BMI', definition: 'Body-Mass-Index – statistische Maßzahl zur groben Einordnung des Körpergewichts im Verhältnis zur Größe.' },
      { term: 'Grundumsatz', definition: 'Der tägliche Kalorienverbrauch, den der menschliche Körper im Ruhezustand zur Lebenserhaltung benötigt.' },
      { term: 'Gesamtenergiebedarf', definition: 'Der tägliche Gesamtverbrauch an Kalorien unter Berücksichtigung körperlicher Aktivitäten.' },
      { term: 'PPI', definition: 'Pixel pro Zoll – die Pixeldichte digitaler Displays oder digitaler Bilddateien.' },
      { term: 'DPI', definition: 'Punkte pro Zoll – die physikalische Punktdichte bei der Ausgabe auf Druckern.' },
      { term: 'PDF', definition: 'Plattformunabhängiges Dateiformat, das Schrift und grafische Anordnung originalgetreu bewahrt.' },
      { term: 'JSON', definition: 'Weit verbreitetes, leicht lesbares Textformat zum standardisierten Austausch strukturierter Daten.' },
      { term: 'JWT', definition: 'Kompaktes, kryptografisch signiertes Datenformat zur sicheren Übertragung von Authentifizierungsdaten.' },
      { term: 'Base64', definition: 'Verfahren zur Umwandlung beliebiger Binärdaten in eine ASCII-Zeichenfolge.' },
      { term: 'QR-Code', definition: 'Zweidimensionaler Matrix-Code zur schnellen maschinellen Erfassung von Webadressen und Texten.' },
      { term: 'Monatsrate', definition: 'Gleichbleibender monatlicher Betrag, der aus Zins- und Tilgungsanteil eines Kredits besteht.' },
      { term: 'Sparplan', definition: 'Disziplinierte Anlageform mit regelmäßigen festen Einzahlungen zum langfristigen Vermögensaufbau.' },
    ],
  },
  ru: {
    title: 'Глоссарий терминов и понятий | Navorika',
    description: 'Понятные определения финансовых, строительных и технических терминов, используемых в калькуляторах Navorika.',
    heroTitle: 'Словарь понятий и терминов Navorika',
    heroDescription: 'Краткие и точные пояснения к терминам, встречающимся в наших калькуляторах и конвертерах.',
    terms: [
      { term: 'Полная стоимость кредита', definition: 'Общая сумма выплат по займу с учетом процентной ставки и всех сопутствующих комиссий в годовом выражении.' },
      { term: 'Сложный процент', definition: 'Начисление процентов на исходную сумму и на проценты, начисленные за предыдущие периоды.' },
      { term: 'Основной долг', definition: 'Исходная сумма займа или инвестиций без учета начисленных процентных выплат.' },
      { term: 'Ипотека', definition: 'Долгосрочный целевой кредит под залог приобретаемой или имеющейся недвижимости.' },
      { term: 'Окупаемость (ROI)', definition: 'Отношение чистой прибыли к сумме исходных инвестиций, выраженное в процентах.' },
      { term: 'CAGR', definition: 'Совокупный среднегодовой темп роста инвестиций за расчетный период с учетом реинвестирования.' },
      { term: 'Чистые активы', definition: 'Реальная стоимость имущества физического лица или компании за вычетом всех обязательств и долгов.' },
      { term: 'ИМТ', definition: 'Индекс массы тела – вспомогательный параметр, оценивающий соотношение веса и роста человека.' },
      { term: 'Базовый метаболизм', definition: 'Минимальное количество энергии в калориях, необходимое организму для поддержания жизни в покое.' },
      { term: 'Суточный расход калорий', definition: 'Суммарный расход энергии за 24 часа с учетом базового обмена и физических нагрузок.' },
      { term: 'PPI', definition: 'Пикселей на дюйм – плотность точек на цифровом дисплее или в растровом изображении.' },
      { term: 'DPI', definition: 'Точек на дюйм – разрешающая способность физического печатного устройства.' },
      { term: 'PDF', definition: 'Стандартизированный формат документов, сохраняющий шрифты и графическую структуру на всех устройствах.' },
      { term: 'JSON', definition: 'Текстовый формат обмена данными, оптимизированный для чтения человеком и обработки программами.' },
      { term: 'JWT', definition: 'Компактный веб-токен с криптографической подписью для безопасной передачи прав и данных.' },
      { term: 'Base64', definition: 'Метод кодирования двоичных данных в последовательность печатных символов ASCII.' },
      { term: 'QR-код', definition: 'Двумерный штрихкод, позволяющий мгновенно считывать ссылки и структурированную информацию камерой.' },
      { term: 'Аннуитетный платеж', definition: 'Ежемесячный фиксированный платеж по кредиту, включающий погашение части основного долга и проценты.' },
      { term: 'Регулярные инвестиции', definition: 'Стратегия периодического внесения фиксированной суммы для сглаживания рыночных колебаний.' },
    ],
  },
  ar: {
    title: 'قاموس المصطلحات المالية والتقنية | نافوريكا',
    description: 'شروحات مبسطة للمصطلحات الشائعة في الحاسبات المالية، وأدوات البناء، ومعالجة ملفات PDF والصور في نافوريكا.',
    heroTitle: 'قاموس مصطلحات وأدوات نافوريكا',
    heroDescription: 'توضيحات سريعة وموجزة لأهم المفاهيم المستخدمة في حاسبات ومحولات منصة نافوريكا.',
    terms: [
      { term: 'معدل النسبة السنوي (APR)', definition: 'التكلفة الإجمالية للاقتراض سنوياً متضمنة الفائدة والرسوم المقررة.' },
      { term: 'العائد السنوي المركب', definition: 'العائد الحقيقي المحقق على المدخرات باحتساب إعادة استثمار الأرباح الدورية.' },
      { term: 'أصل المبلغ', definition: 'المبلغ الأساسي المقترض أو المستثمر قبل احتساب أي أرباح أو فوائد تراكمية.' },
      { term: 'التمويل العقاري', definition: 'قرض طويل الأجل مخصص لشراء عقار بضمانات محددة وسداد على دفعات منتظمة.' },
      { term: 'العائد على الاستثمار (ROI)', definition: 'مؤشر ربحية يقيس صافي المكاسب المالية مقارنة بإجمالي رأس المال المستثمر.' },
      { term: 'معدل النمو السنوي المركب (CAGR)', definition: 'متوسط نسبة النمو السنوي للاستثمار على مدى عدة سنوات مع التراكم.' },
      { term: 'صافي الثروة', definition: 'القيمة المالية لجميع الأصول والممتلكات بعد خصم الالتزامات والديون المستحقة.' },
      { term: 'مؤشر كتلة الجسم (BMI)', definition: 'مقياس إحصائي تقريبي يقارن وزن الجسم بمربع الطول لتقييم الوزن.' },
      { term: 'معدل الأيض الأساسي (BMR)', definition: 'كمية السعرات الحرارية الضرورية لدعم وظائف الجسم الحيوية أثناء الراحة التامة.' },
      { term: 'إجمالي استهلاك الطاقة اليومي (TDEE)', definition: 'مجموع السعرات الحرارية التي يستهلكها الجسم يومياً بالأنشطة البدنية والحيوية.' },
      { term: 'بكسل لكل بوصة (PPI)', definition: 'كثافة النقاط الرقمية المعروضة في البوصة الواحدة على الشاشات الرقمية.' },
      { term: 'نقطة لكل بوصة (DPI)', definition: 'كثافة النقاط الفيزيائية التي تنتجها الطابعات الورقية لتحديد دقة الطباعة.' },
      { term: 'مستند PDF', definition: 'معيار رقمي دولي يحافظ على التصميم وتنسيق الخطوط عبر مختلف الأجهزة.' },
      { term: 'صيغة JSON', definition: 'تنسيق نصي خفيف وسهل القراءة لتخزين وتبادل البيانات المنظمة بين الأنظمة البرمجية.' },
      { term: 'رمز JWT', definition: 'رمز إلكتروني مشفر وموقع رقمياً لنقل بيانات التحقق والمصادقة بأمان بين الخوادم.' },
      { term: 'ترميز Base64', definition: 'طريقة لتحويل البيانات الثنائية غير النصية إلى سلسلة نصية قابلة للتداول بأمان.' },
      { term: 'رمز الاستجابة السريعة (QR)', definition: 'باركود ثنائي الأبعاد يُقرأ بسرعة عبر كاميرا الهاتف لفتح الروابط أو البيانات.' },
      { term: 'القسط الشهري المتساوي (EMI)', definition: 'دفعة شهرية ثابتة تشمل سداد جزء من أصل الدين مع تكلفة التمويل الدورية.' },
      { term: 'خطة الاستثمار المنتظم (SIP)', definition: 'استراتيجية استثمارية تقوم على استقطاع مبالغ دورية ثابتة لتنمية رأس المال تدريجياً.' },
    ],
  },
};
