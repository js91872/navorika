import { writeFileSync, mkdirSync } from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';
import sharp from 'sharp';
import { convertMarkdownToPdf } from '../src/lib/pdf/markdownToPdf.js';

const artifactDir = process.env.ARTIFACT_DIR || '/home/jaspal/.gemini/antigravity-cli/brain/f769bac1-9b1d-4769-8db9-746a3b1b6d5e/samples';
const publicDir = 'public/samples';
mkdirSync(artifactDir, { recursive: true });
mkdirSync(publicDir, { recursive: true });

const nodeCanvasCreator = (w, h) => {
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');
  return {
    canvas,
    ctx,
    toPngBytes: async () => new Uint8Array(canvas.toBuffer('image/png')),
  };
};

const russianMd = `# Руководство по инженерным расчетам и спецификациям Navorika

## 1. Введение в архитектуру платформы
Платформа Navorika предоставляет набор автономных вычислительных инструментов для инженерных, полиграфических и веб-разработок. Архитектура ориентирована на максимальную конфиденциальность: все критические вычисления выполняются локально в пользовательской среде без передачи исходных данных на сторонние серверы.

### 1.1. Ключевые возможности системы
- Высокоточный расчет геометрических пропорций, коэффициентов сжатия и полиграфических параметров
- Комплексная валидация предпечатной подготовки (Preflight) с автоматическим контролем зон вылета и цветовых профилей
- Экспорт инженерных отчетов и спецификаций в стандартные форматы PDF, SVG, JSON и CSV
- Поддержка стандартов международной организации по стандартизации ISO 216 (A4, A3, A5)

## 2. Методология предпечатного контроля и вылетов под обрез
Для офсетной и цифровой полиграфии соблюдение параметров обрезного поля является обязательным техническим требованием. Нарушение правил приводит к появлению белых полос по краям готового тиража.

### 2.1. Технические требования к макетам
- Минимальный вылет под обрез (Bleed) должен составлять ровно 3 мм со всех четырех сторон документа
- Безопасная внутренняя зона (Safety Margin) должна быть не менее 5 мм от линии предполагаемого среза
- Растровые изображения обязаны иметь эффективное оптическое разрешение не менее 300 DPI
- Все шрифтовые гарнитуры должны быть внедрены в структуру документа либо преобразованы в векторные кривые

### 2.2. Управление цветом и профилирование
Цветовое пространство CMYK обеспечивает предсказуемость полиграфического тиража. Все внедренные RGB-изображения должны проходить контролируемую конвертацию с учетом целевого растискивания точки (Dot Gain) и плотности красок.

## 3. Вычислительные алгоритмы и обработка исключений
Все математические формулы реализованы на базе строгой типизации TypeScript с контролем деления на ноль, проверкой отрицательных величин и округлением в соответствии с финансовыми и метрическими стандартами.

- При вводе недопустимых значений система моментально выводит информативное предупреждение
- Промежуточные результаты сохраняются в локальном хранилище браузера (LocalStorage)
- Полная автономность работы гарантирует сохранность коммерческой тайны и персональных данных

## 4. Заключение и эксплуатационные рекомендации
Регулярное использование автоматизированных инструментов предпечатной подготовки Navorika позволяет минимизировать технический брак, сократить издержки на производство и повысить общее качество полиграфической продукции.
`;

const arabicMd = `# دليل الحسابات الهندسية ومواصفات الطباعة من نافوريكا

## ١. مقدمة في معمارية المنصة الرقمية
توفر منصة نافوريكا مجموعة متكاملة من الأدوات التقنية المتطورة لإجراء الحسابات الهندسية والتحضير للطباعة الرقمية والأوفست بدقة فائقة. تعتمد معمارية المنصة مبدأ الخصوصية أولاً، حيث تُجرى كافة المعالجات والتحليلات محلياً داخل بيئة المتصفح دون نقل بيانات المستخدمين الحساسة إلى خوادم وسيطة.

### ١.١. المزايا التقنية الأساسية للمنصة
- حسابات هندسية فورية تشمل نسب الأبعاد ومقاييس الكثافة النقطية وتدرجات التكبير
- فحص آلي شامل لجاهزية ملفات الطباعة والتحقق الصارم من هوامش القص ومسارات القطع
- تصدير تقارير المواصفات الفنية بصيغ معيارية معتمدة تشمل مستندات PDF ورسومات المتجهات والجداول
- التوافق الكامل مع معايير القياس الدولية ISO 216 للورق ودقة الطباعة الفائقة ٣٠٠ نقطة في البوصة

## ٢. منهجية إعداد هوامش الأمان وهوامش القص
تُعد هوامش القص عنصراً جوهرياً في إنتاج المطبوعات الورقية لضمان عدم ظهور حواف بيضاء غير مرغوبة بعد مرحلة التشذيب الآلي بالمقصات الصناعية.

### ٢.١. الاشتراطات الفنية للمصممين ومسؤولي ما قبل الطباعة
- تحديد هامش قص لا يقل عن ٣ ملم من كافة أطراف التصميم لضمان سلامة المحتوى
- ترك مسافة أمان داخلية لا تقل عن ٥ ملم من خط القطع الافتراضي للعناصر النصية والشعارات
- ضبط الدقة الفعالة للصور النقطية على ٣٠٠ بكسل لكل بوصة لتجنب التشويه البصري
- تحويل كافة النصوص إلى خطوط خارجية منحنية أو التأكد من دمج الخطوط بالكامل داخل الملف

### ٢.٢. إدارة الألوان ونماذج الطباعة المعتمدة
يضمن استخدام الفضاء اللوني CMYK مطابقة دقيقة للألوان المنتجة على الورق مقارنة بما يظهر على شاشات العرض الرقمية، مع مراعاة نسب امتصاص الحبر ونوعية الورق المستخدم.

## ٣. خوارزميات التدقيق ومعالجة البيانات الاستثنائية
تعتمد المنصة على خوارزميات برمجية رصينة بلغة TypeScript تمنع الأخطاء الحسابية مثل القسمة على الصفر أو القيم السالبة غير المنطقية، مع تقديم توجيهات تشخيصية واضحة باللغة العربية.

- في حال إدخال أرقام غير متوافقة، يظهر تنبيه فوري يوضح المعيار الصحيح بدقة
- تُحفظ التفضيلات التشغيلية داخل مساحة التخزين المؤقت للمتصفح دون تتبع
- العمل دون الحاجة لاتصال مستمر بالإنترنت يضمن استمرارية الإنتاجية وأمان البيانات

## ٤. التوصيات النهائية وخاتمة الدليل
يساهم الاعتماد على أدوات نافوريكا المؤتمتة في رفع كفاءة سير العمل الهندسي وتفادي تكاليف إعادة الطباعة الناجمة عن أخطاء الإعداد اليدوي التقليدي.
`;

async function renderPdfToScreenshots(pdfBytes, prefix) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const doc = await pdfjs.getDocument({ data: pdfBytes }).promise;
  console.log(`[${prefix}] Generated PDF with ${doc.numPages} page(s).`);

  const pagesInfo = [];
  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = createCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext('2d');

    await page.render({
      canvasContext: ctx,
      viewport,
    }).promise;

    const pngBuffer = canvas.toBuffer('image/png');
    writeFileSync(`${artifactDir}/${prefix}-page-${pageNum}.png`, pngBuffer);
    writeFileSync(`${publicDir}/${prefix}-page-${pageNum}.png`, pngBuffer);

    // Analyze rendered pixels
    const img = sharp(pngBuffer);
    const meta = await img.metadata();
    const { data } = await img.raw().toBuffer({ resolveWithObject: true });

    let darkPixels = 0;
    let leftHalfDark = 0;
    let rightHalfDark = 0;

    for (let y = 100; y < meta.height - 100; y++) {
      for (let x = 100; x < meta.width - 100; x++) {
        const idx = (y * meta.width + x) * meta.channels;
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];
        if (r < 100 && g < 100 && b < 100) {
          darkPixels++;
          if (x < meta.width / 2) leftHalfDark++;
          else rightHalfDark++;
        }
      }
    }

    pagesInfo.push({
      pageNum,
      width: meta.width,
      height: meta.height,
      pngPath: outPngPath,
      darkPixels,
      leftHalfDark,
      rightHalfDark,
      densityRatio: (rightHalfDark / (leftHalfDark + 0.001)).toFixed(2),
    });
    console.log(`[${prefix}] Page ${pageNum}: ${meta.width}x${meta.height}, darkPixels: ${darkPixels}, left: ${leftHalfDark}, right: ${rightHalfDark}`);
  }
  return { numPages: doc.numPages, pagesInfo };
}

async function main() {
  console.log('--- Generating Russian Markdown-to-PDF sample ---');
  const ruPdfBytes = await convertMarkdownToPdf(russianMd, {
    title: 'Руководство по инженерным расчетам Navorika',
    author: 'Navorika Engineering',
  }, nodeCanvasCreator);
  const ruPdfPath = `${artifactDir}/sample-russian.pdf`;
  writeFileSync(ruPdfPath, ruPdfBytes);
  writeFileSync(`${publicDir}/sample-russian.pdf`, ruPdfBytes);
  const ruAnalysis = await renderPdfToScreenshots(ruPdfBytes, 'russian');

  console.log('--- Generating Arabic Markdown-to-PDF sample ---');
  const arPdfBytes = await convertMarkdownToPdf(arabicMd, {
    title: 'دليل الحسابات الهندسية من نافوريكا',
    author: 'نافوريكا للحلول الهندسية',
  }, nodeCanvasCreator);
  const arPdfPath = `${artifactDir}/sample-arabic.pdf`;
  writeFileSync(arPdfPath, arPdfBytes);
  writeFileSync(`${publicDir}/sample-arabic.pdf`, arPdfBytes);
  const arAnalysis = await renderPdfToScreenshots(arPdfBytes, 'arabic');

  console.log('\n--- Summary of PDF Sample Generation ---');
  console.log('Russian PDF:', ruPdfPath, `(${ruPdfBytes.length} bytes, ${ruAnalysis.numPages} pages)`);
  console.log('Arabic PDF:', arPdfPath, `(${arPdfBytes.length} bytes, ${arAnalysis.numPages} pages)`);
}

main().catch((err) => {
  console.error('Fatal error generating PDF samples:', err);
  process.exit(1);
});
