'use client';

import { useState, useEffect, useRef } from 'react';
import { UploadCloud, FileText, Download, RotateCcw, LoaderCircle, CheckCircle2, Box } from 'lucide-react';
import {
  CadPrivacyNotice,
  CadViewerNotice,
  CadBackendUnavailableNotice,
  CadErrorNotice,
} from './CadNotices';
import type { StepCapabilities } from '@/lib/converters/step-3dpdf/types';
import type { Locale } from '@/lib/i18n/config';

interface ConversionResult {
  url: string;
  name: string;
  sizeBytes: number;
  solids?: string;
  faces?: string;
  triangles?: string;
}

const cadTranslations: Record<Locale | 'en', {
  privacyTitle: string;
  privacyDesc: string;
  viewerTitle: string;
  viewerDesc: string;
  backendUnavailableTitle: string;
  backendUnavailableDesc: string;
  errorTitle: string;
  errorInvalidExt: string;
  errorEmpty: string;
  errorTooLarge: string;
  errorConversion: string;
  dropPrompt: string;
  browse: string;
  formatHelp: string;
  readyTitle: string;
  solids: string;
  faces: string;
  triangles: string;
  download: string;
  reset: string;
  btnConvert: string;
  statusUploading: string;
  statusProcessing: string;
  statusGenerating: string;
}> = {
  en: {
    privacyTitle: 'CAD Privacy & Temporary Processing',
    privacyDesc: 'Your CAD file is processed temporarily in an isolated workspace for conversion and is deleted automatically when the task finishes. It is not stored permanently or shared.',
    viewerTitle: 'Adobe Acrobat Reader Desktop Recommended for 3D Interaction',
    viewerDesc: 'For interactive 3D viewing, open the downloaded PDF in Adobe Acrobat Reader desktop or another compatible 3D PDF viewer. Built-in web browser PDF viewers (Chrome, Edge, Firefox, Safari) do not support 3D PRC interaction and may display only the preview image.',
    backendUnavailableTitle: 'Server Conversion Backend Unavailable',
    backendUnavailableDesc: 'The native Open CASCADE or Asymptote conversion backend is not configured on this host. Conversions are disabled to prevent generating corrupt or simulated files.',
    errorTitle: 'Conversion Error',
    errorInvalidExt: 'Please select a valid CAD file with a .step or .stp extension.',
    errorEmpty: 'The selected file is empty.',
    errorTooLarge: 'File exceeds the 25 MB upload limit.',
    errorConversion: 'Conversion failed safely. Please verify the CAD file and try again.',
    dropPrompt: 'Drop your STEP or STP file here, or',
    browse: 'browse',
    formatHelp: 'Supports ISO-10303-21 CAD models (.step, .stp) up to 25 MB',
    readyTitle: '3D PDF Ready for Download',
    solids: 'Solids',
    faces: 'Faces',
    triangles: 'Triangles',
    download: 'Download 3D PDF',
    reset: 'Convert Another File',
    btnConvert: 'Convert STEP to 3D PDF',
    statusUploading: 'Uploading CAD file…',
    statusProcessing: 'Parsing B-Rep topology & tessellating mesh…',
    statusGenerating: 'Embedding 3D PRC structures into PDF…',
  },
  fr: {
    privacyTitle: 'Confidentialité CAO & Traitement temporaire',
    privacyDesc: 'Votre fichier CAO est traité temporairement dans un espace de travail isolé pour la conversion et est supprimé automatiquement une fois la tâche terminée. Il n\'est pas stocké de façon permanente ni partagé.',
    viewerTitle: 'Adobe Acrobat Reader Desktop recommandé pour l\'interaction 3D',
    viewerDesc: 'Pour une visualisation 3D interactive, ouvrez le PDF téléchargé dans Adobe Acrobat Reader sur ordinateur ou un autre visualiseur 3D compatible. Les visualiseurs PDF intégrés aux navigateurs ne prennent pas en charge l\'interaction 3D PRC.',
    backendUnavailableTitle: 'Moteur de conversion serveur non disponible',
    backendUnavailableDesc: 'Le moteur de conversion natif Open CASCADE ou Asymptote n\'est pas configuré sur cet hôte. Les conversions sont désactivées pour éviter de générer des fichiers corrompus.',
    errorTitle: 'Erreur de conversion',
    errorInvalidExt: 'Veuillez sélectionner un fichier CAO valide avec une extension .step ou .stp.',
    errorEmpty: 'Le fichier sélectionné est vide.',
    errorTooLarge: 'Le fichier dépasse la limite d\'envoi de 25 Mo.',
    errorConversion: 'La conversion a échoué en toute sécurité. Veuillez vérifier le fichier CAO et réessayer.',
    dropPrompt: 'Déposez votre fichier STEP ou STP ici, ou',
    browse: 'parcourir',
    formatHelp: 'Prend en charge les modèles CAO ISO-10303-21 (.step, .stp) jusqu\'à 25 Mo',
    readyTitle: 'PDF 3D prêt pour le téléchargement',
    solids: 'Solides',
    faces: 'Faces',
    triangles: 'Triangles',
    download: 'Télécharger le PDF 3D',
    reset: 'Convertir un autre fichier',
    btnConvert: 'Convertir STEP en PDF 3D',
    statusUploading: 'Téléversement du fichier CAO…',
    statusProcessing: 'Analyse de la topologie B-Rep & maillage…',
    statusGenerating: 'Intégration des structures PRC 3D dans le PDF…',
  },
  it: {
    privacyTitle: 'Privacy CAD & Elaborazione temporanea',
    privacyDesc: 'Il file CAD viene elaborato temporaneamente in uno spazio di lavoro isolato per la conversione e viene eliminato automaticamente al termine dell\'operazione. Non viene memorizzato in modo permanente né condiviso.',
    viewerTitle: 'Adobe Acrobat Reader Desktop consigliato per l\'interazione 3D',
    viewerDesc: 'Per la visualizzazione 3D interattiva, apri il PDF scaricato in Adobe Acrobat Reader per desktop o un altro visualizzatore 3D compatibile. I visualizzatori PDF integrati nei browser non supportano l\'interazione 3D PRC.',
    backendUnavailableTitle: 'Motore di conversione server non disponibile',
    backendUnavailableDesc: 'Il motore di conversione nativo Open CASCADE o Asymptote non è configurato su questo host. Le conversioni sono disabilitate per evitare la generazione di file corrotti.',
    errorTitle: 'Errore di conversione',
    errorInvalidExt: 'Seleziona un file CAD valido con estensione .step o .stp.',
    errorEmpty: 'Il file selezionato è vuoto.',
    errorTooLarge: 'Il file supera il limite di caricamento di 25 MB.',
    errorConversion: 'Conversione non riuscita in sicurezza. Verifica il file CAD e riprova.',
    dropPrompt: 'Trascina qui il tuo file STEP o STP, oppure',
    browse: 'sfoglia',
    formatHelp: 'Supporta modelli CAD ISO-10303-21 (.step, .stp) fino a 25 MB',
    readyTitle: 'PDF 3D pronto per il download',
    solids: 'Solidi',
    faces: 'Facce',
    triangles: 'Triangoli',
    download: 'Scarica PDF 3D',
    reset: 'Converti un altro file',
    btnConvert: 'Converti STEP in PDF 3D',
    statusUploading: 'Caricamento del file CAD…',
    statusProcessing: 'Analisi della topologia B-Rep & tassellatura…',
    statusGenerating: 'Incorporamento delle strutture 3D PRC nel PDF…',
  },
  pt: {
    privacyTitle: 'Privacidade CAD & Processamento temporário',
    privacyDesc: 'O seu ficheiro CAD é processado temporariamente num espaço de trabalho isolado para conversão e é eliminado automaticamente após a conclusão da tarefa. Não é armazenado permanentemente nem partilhado.',
    viewerTitle: 'Adobe Acrobat Reader Desktop recomendado para interação 3D',
    viewerDesc: 'Para visualização 3D interativa, abra o PDF descarregado no Adobe Acrobat Reader para computador ou outro visualizador 3D compatível. Os visualizadores PDF integrados no navegador não suportam interação 3D PRC.',
    backendUnavailableTitle: 'Motor de conversão do servidor indisponível',
    backendUnavailableDesc: 'O motor de conversão nativo Open CASCADE ou Asymptote não está configurado neste servidor. As conversões estão desativadas para evitar ficheiros corrompidos.',
    errorTitle: 'Erro de conversão',
    errorInvalidExt: 'Selecione um ficheiro CAD válido com extensão .step ou .stp.',
    errorEmpty: 'O ficheiro selecionado está vazio.',
    errorTooLarge: 'O ficheiro excede o limite de envio de 25 MB.',
    errorConversion: 'A conversão falhou com segurança. Verifique o ficheiro CAD e tente novamente.',
    dropPrompt: 'Arraste o seu ficheiro STEP ou STP para aqui, ou',
    browse: 'procure',
    formatHelp: 'Suporta modelos CAD ISO-10303-21 (.step, .stp) até 25 MB',
    readyTitle: 'PDF 3D pronto para descarregar',
    solids: 'Sólidos',
    faces: 'Faces',
    triangles: 'Triângulos',
    download: 'Descarregar PDF 3D',
    reset: 'Converter outro ficheiro',
    btnConvert: 'Converter STEP para PDF 3D',
    statusUploading: 'A enviar ficheiro CAD…',
    statusProcessing: 'A analisar topologia B-Rep & malha…',
    statusGenerating: 'A incorporar estruturas 3D PRC no PDF…',
  },
  es: {
    privacyTitle: 'Privacidad CAD & Procesamiento temporal',
    privacyDesc: 'Su archivo CAD se procesa temporalmente en un espacio de trabajo aislado para la conversión y se elimina automáticamente al finalizar la tarea. No se almacena permanentemente ni se comparte.',
    viewerTitle: 'Adobe Acrobat Reader Desktop recomendado para interacción 3D',
    viewerDesc: 'Para una visualización 3D interactiva, abra el PDF descargado en Adobe Acrobat Reader para escritorio u otro visor 3D compatible. Los visores PDF integrados en navegadores no admiten interacción 3D PRC.',
    backendUnavailableTitle: 'Motor de conversión del servidor no disponible',
    backendUnavailableDesc: 'El motor de conversión nativo Open CASCADE o Asymptote no está configurado en este servidor. Las conversiones están deshabilitadas para evitar archivos dañados.',
    errorTitle: 'Error de conversión',
    errorInvalidExt: 'Seleccione un archivo CAD válido con extensión .step o .stp.',
    errorEmpty: 'El archivo seleccionado está vacío.',
    errorTooLarge: 'El archivo supera el límite de subida de 25 MB.',
    errorConversion: 'La conversión falló de forma segura. Verifique el archivo CAD y vuelva a intentarlo.',
    dropPrompt: 'Suelte su archivo STEP o STP aquí, o',
    browse: 'examinar',
    formatHelp: 'Admite modelos CAD ISO-10303-21 (.step, .stp) hasta 25 MB',
    readyTitle: 'PDF 3D listo para descargar',
    solids: 'Sólidos',
    faces: 'Caras',
    triangles: 'Triángulos',
    download: 'Descargar PDF 3D',
    reset: 'Convertir otro archivo',
    btnConvert: 'Convertir STEP a PDF 3D',
    statusUploading: 'Subiendo archivo CAD…',
    statusProcessing: 'Analizando topología B-Rep & malla…',
    statusGenerating: 'Incrustando estructuras 3D PRC en el PDF…',
  },
  de: {
    privacyTitle: 'CAD-Datenschutz & Temporäre Verarbeitung',
    privacyDesc: 'Ihre CAD-Datei wird für die Konvertierung vorübergehend in einem isolierten Arbeitsbereich verarbeitet und nach Abschluss der Aufgabe automatisch gelöscht. Sie wird weder dauerhaft gespeichert noch weitergegeben.',
    viewerTitle: 'Adobe Acrobat Reader Desktop für 3D-Interaktion empfohlen',
    viewerDesc: 'Öffnen Sie das heruntergeladene PDF für die interaktive 3D-Anzeige im Adobe Acrobat Reader auf dem Desktop oder einem anderen kompatiblen 3D-PDF-Betrachter. Integrierte Browser-PDF-Betrachter unterstützen keine 3D-PRC-Interaktion.',
    backendUnavailableTitle: 'Server-Konvertierungs-Backend nicht verfügbar',
    backendUnavailableDesc: 'Das native Open CASCADE- oder Asymptote-Backend ist auf diesem Host nicht konfiguriert. Konvertierungen sind deaktiviert, um beschädigte Dateien zu vermeiden.',
    errorTitle: 'Konvertierungsfehler',
    errorInvalidExt: 'Bitte wählen Sie eine gültige CAD-Datei mit der Endung .step oder .stp.',
    errorEmpty: 'Die ausgewählte Datei ist leer.',
    errorTooLarge: 'Die Datei überschreitet die Upload-Grenze von 25 MB.',
    errorConversion: 'Die Konvertierung ist sicher fehlgeschlagen. Bitte überprüfen Sie die CAD-Datei und versuchen Sie es erneut.',
    dropPrompt: 'STEP- oder STP-Datei hier ablegen oder',
    browse: 'durchsuchen',
    formatHelp: 'Unterstützt ISO-10303-21 CAD-Modelle (.step, .stp) bis zu 25 MB',
    readyTitle: '3D-PDF zum Download bereit',
    solids: 'Körper',
    faces: 'Flächen',
    triangles: 'Dreiecke',
    download: '3D-PDF herunterladen',
    reset: 'Weitere Datei konvertieren',
    btnConvert: 'STEP in 3D-PDF konvertieren',
    statusUploading: 'CAD-Datei wird hochgeladen…',
    statusProcessing: 'B-Rep-Topologie wird analysiert & Netz generiert…',
    statusGenerating: '3D-PRC-Strukturen werden in PDF eingebettet…',
  },
  ru: {
    privacyTitle: 'Конфиденциальность CAD & Временная обработка',
    privacyDesc: 'Ваш CAD-файл временно обрабатывается в изолированной среде для конвертации и удаляется автоматически после завершения задачи. Он не сохраняется и не передается третьим лицам.',
    viewerTitle: 'Adobe Acrobat Reader Desktop рекомендуется для работы с 3D',
    viewerDesc: 'Для интерактивного просмотра 3D откройте скачанный PDF в приложении Adobe Acrobat Reader для компьютера или другой совместимой программе. Встроенные средства просмотра браузеров не поддерживают интерактивность 3D PRC.',
    backendUnavailableTitle: 'Серверный модуль конвертации недоступен',
    backendUnavailableDesc: 'Исходный модуль Open CASCADE или Asymptote не настроен на сервере. Конвертация отключена во избежание создания поврежденных файлов.',
    errorTitle: 'Ошибка конвертации',
    errorInvalidExt: 'Пожалуйста, выберите корректный CAD-файл с расширением .step или .stp.',
    errorEmpty: 'Выбранный файл пуст.',
    errorTooLarge: 'Размер файла превышает ограничение загрузки в 25 МБ.',
    errorConversion: 'Безопасное завершение конвертации с ошибкой. Проверьте CAD-файл и повторите попытку.',
    dropPrompt: 'Перетащите файл STEP или STP сюда или',
    browse: 'выберите файл',
    formatHelp: 'Поддерживаются CAD-модели ISO-10303-21 (.step, .stp) до 25 МБ',
    readyTitle: '3D PDF готов к скачиванию',
    solids: 'Тела',
    faces: 'Грани',
    triangles: 'Треугольники',
    download: 'Скачать 3D PDF',
    reset: 'Конвертировать другой файл',
    btnConvert: 'Конвертировать STEP в 3D PDF',
    statusUploading: 'Загрузка CAD-файла…',
    statusProcessing: 'Анализ топологии B-Rep & триангуляция…',
    statusGenerating: 'Встраивание структур 3D PRC в PDF…',
  },
  ar: {
    privacyTitle: 'خصوصية ملفات CAD والمعالجة المؤقتة',
    privacyDesc: 'تتم معالجة ملف CAD الخاص بك مؤقتًا في مساحة عمل معزولة للتحويل ويتم حذفه تلقائيًا بعد اكتمال المهمة. لا يتم تخزينه نهائيًا أو مشاركته.',
    viewerTitle: 'يُوصى باستخدام Adobe Acrobat Reader للحاسوب للتفاعل ثلاثي الأبعاد',
    viewerDesc: 'للعرض التفاعلي ثلاثي الأبعاد، افتح ملف PDF المُحمّل في برنامج Adobe Acrobat Reader على سطح المكتب. لا تدعم عوارض PDF المدمجة في المتصفحات التفاعل مع PRC ثلاثي الأبعاد.',
    backendUnavailableTitle: 'خادم التحويل غير متاح حاليًا',
    backendUnavailableDesc: 'محرك التحويل الأصلي Open CASCADE أو Asymptote غير مهيأ على هذا الخادم. تم تعطيل التحويلات لتجنب إنشاء ملفات تالفة.',
    errorTitle: 'خطأ في التحويل',
    errorInvalidExt: 'يُرجى اختيار ملف CAD صالح بامتداد .step أو .stp.',
    errorEmpty: 'الملف المحدد فارغ.',
    errorTooLarge: 'يتجاوز حجم الملف الحد الأقصى للرفع البالغ 25 ميغابايت.',
    errorConversion: 'فشل التحويل بأمان. يُرجى التحقق من ملف CAD والمحاولة مرة أخرى.',
    dropPrompt: 'أسقط ملف STEP أو STP هنا، أو',
    browse: 'تصفح',
    formatHelp: 'يدعم نماذج CAD القياسية ISO-10303-21 (.step, .stp) حتى 25 ميغابايت',
    readyTitle: 'ملف 3D PDF جاهز للتنزيل',
    solids: 'المجسمات',
    faces: 'الأسطح',
    triangles: 'المثلثات',
    download: 'تنزيل 3D PDF',
    reset: 'تحويل ملف آخر',
    btnConvert: 'تحويل STEP إلى 3D PDF',
    statusUploading: 'جارٍ رفع ملف CAD…',
    statusProcessing: 'تحليل طوبولوجيا B-Rep وتوليد الشبكة…',
    statusGenerating: 'تضمين هياكل PRC ثلاثية الأبعاد في PDF…',
  },
};

export default function StepTo3dPdfTool({ locale = 'en' }: { locale?: Locale | 'en' } = {}) {
  const m = cadTranslations[locale] ?? cadTranslations.en;
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [capabilities, setCapabilities] = useState<StepCapabilities | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'generating' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState<ConversionResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/step-to-3d-pdf/capabilities', {
      signal: controller.signal,
      cache: 'no-store',
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: StepCapabilities | null) => setCapabilities(data))
      .catch(() => undefined);

    return () => controller.abort();
  }, []);

  useEffect(() => {
    return () => {
      if (result?.url) {
        URL.revokeObjectURL(result.url);
      }
    };
  }, [result]);

  const validateAndSelectFile = (candidate: File) => {
    setErrorMsg('');
    setResult(null);

    const ext = candidate.name.toLowerCase().split('.').pop();
    if (ext !== 'step' && ext !== 'stp') {
      setErrorMsg(m.errorInvalidExt);
      return;
    }

    if (candidate.size === 0) {
      setErrorMsg(m.errorEmpty);
      return;
    }

    const maxBytes = capabilities?.maxUploadBytes ?? 25 * 1024 * 1024;
    if (candidate.size > maxBytes) {
      setErrorMsg(m.errorTooLarge);
      return;
    }

    setFile(candidate);
    setStatus('idle');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleConvert = async () => {
    if (!file) return;

    setStatus('uploading');
    setErrorMsg('');
    if (result?.url) {
      URL.revokeObjectURL(result.url);
      setResult(null);
    }

    try {
      const formData = new FormData();
      formData.set('file', file);

      setTimeout(() => {
        setStatus((curr) => (curr === 'uploading' ? 'processing' : curr));
      }, 800);

      setTimeout(() => {
        setStatus((curr) => (curr === 'processing' ? 'generating' : curr));
      }, 3000);

      const response = await fetch('/api/step-to-3d-pdf/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('CONVERSION_FAILED');
      }

      const blob = await response.blob();
      const disposition = response.headers.get('content-disposition') ?? '';
      const filenameMatch = disposition.match(/filename="([^"]+)"/);
      const name = filenameMatch ? filenameMatch[1] : `${file.name.replace(/\.[^.]+$/, '')}-3d.pdf`;

      const solids = response.headers.get('x-cad-solids') ?? undefined;
      const faces = response.headers.get('x-cad-faces') ?? undefined;
      const triangles = response.headers.get('x-cad-triangles') ?? undefined;

      setResult({
        url: URL.createObjectURL(blob),
        name,
        sizeBytes: blob.size,
        solids,
        faces,
        triangles,
      });
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMsg(m.errorConversion);
    }
  };

  const handleReset = () => {
    if (result?.url) {
      URL.revokeObjectURL(result.url);
    }
    setFile(null);
    setResult(null);
    setErrorMsg('');
    setStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const isBackendDisabled = capabilities ? !capabilities.available : false;
  const isBusy = status === 'uploading' || status === 'processing' || status === 'generating';

  return (
    <section className="mx-auto max-w-4xl min-w-0 space-y-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-8" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <CadPrivacyNotice title={m.privacyTitle} desc={m.privacyDesc} />
      <CadViewerNotice title={m.viewerTitle} desc={m.viewerDesc} />

      {isBackendDisabled && <CadBackendUnavailableNotice title={m.backendUnavailableTitle} desc={m.backendUnavailableDesc} />}

      {/* Upload Dropzone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isBusy && fileInputRef.current?.click()}
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
          dragOver
            ? 'border-indigo-500 bg-indigo-50/50 dark:border-indigo-400 dark:bg-indigo-950/20'
            : 'border-slate-300 bg-slate-50/60 hover:border-indigo-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950/50 dark:hover:border-slate-600'
        } ${isBusy ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".step,.stp,.STEP,.STP"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              validateAndSelectFile(e.target.files[0]);
            }
          }}
          className="hidden"
        />

        <div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
          <UploadCloud className="size-7" />
        </div>

        <p className="mt-4 text-base font-bold text-slate-800 dark:text-slate-100">
          {m.dropPrompt}{' '}
          <span className="text-indigo-600 underline dark:text-indigo-400">{m.browse}</span>
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {m.formatHelp}
        </p>

        {file && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50/80 px-4 py-2 text-sm text-indigo-950 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200">
            <Box className="size-4 text-indigo-600 dark:text-indigo-400" />
            <span className="font-semibold">{file.name}</span>
            <span className="text-xs text-indigo-700 dark:text-indigo-300">
              ({formatBytes(file.size)})
            </span>
          </div>
        )}
      </div>

      {errorMsg && <CadErrorNotice title={m.errorTitle} message={errorMsg} />}

      {/* Action / State Area */}
      {status === 'success' && result ? (
        <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/30">
          <div className="flex items-center gap-3 text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="size-6 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="font-black text-slate-900 dark:text-white">
                {m.readyTitle}
              </p>
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                {result.name} ({formatBytes(result.sizeBytes)})
              </p>
            </div>
          </div>

          {result.faces && result.triangles && (
            <div className="grid grid-cols-3 gap-2 rounded-xl border border-emerald-200/60 bg-white/60 p-3 text-center text-xs dark:border-emerald-900/40 dark:bg-slate-900/40">
              <div>
                <span className="block font-bold text-slate-700 dark:text-slate-300">{m.solids}</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400">{result.solids ?? '1'}</span>
              </div>
              <div>
                <span className="block font-bold text-slate-700 dark:text-slate-300">{m.faces}</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400">{result.faces}</span>
              </div>
              <div>
                <span className="block font-bold text-slate-700 dark:text-slate-300">{m.triangles}</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400">{result.triangles}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={result.url}
              download={result.name}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white shadow-md hover:bg-emerald-700 transition"
            >
              <Download className="size-5" /> {m.download}
            </a>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-750 transition"
            >
              <RotateCcw className="size-4" /> {m.reset}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleConvert}
          disabled={!file || isBusy || isBackendDisabled}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-black text-white shadow-md hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 transition"
        >
          {isBusy && <LoaderCircle className="size-5 animate-spin" />}
          {status === 'uploading'
            ? m.statusUploading
            : status === 'processing'
            ? m.statusProcessing
            : status === 'generating'
            ? m.statusGenerating
            : m.btnConvert}
        </button>
      )}
    </section>
  );
}
