export type WebpPngGuideCopy = {
  title: string;
  description: string;
  keywords: string[];
  intro: string;
  sections: { title: string; paragraphs: string[] }[];
  stepsTitle: string;
  steps: string[];
  conclusion: string;
  summary: string;
  faqs: { question: string; answer: string }[];
  faqTitle: string;
  languageLabel: string;
  toolLabel: string;
  category: string;
  publishedDate: string;
  readTime: string;
};

export const webpPngGuideTranslations: Record<'en' | 'fr' | 'it' | 'pt' | 'es' | 'ar' | 'ru' | 'de', WebpPngGuideCopy> = {
  "en": {
    "title": "How to Convert WebP to PNG Online for Free",
    "description": "Learn how to convert WebP images to PNG, what happens to quality and transparency, and how to save a converted image safely in your browser.",
    "keywords": [
      "de webp a png",
      "webp to png",
      "convert webp to png online",
      "webp to png without losing quality"
    ],
    "intro": "If an image arrives as a WebP file but an app, document, or design workflow needs PNG, you can convert it in a few steps. The important detail is that conversion changes the file format; it cannot restore image detail that was already lost when the original WebP was compressed. This guide explains how to convert WebP to PNG, what to expect from transparency and file size, and how to check the result before you use it.",
    "sections": [
      {
        "title": "Why convert WebP to PNG?",
        "paragraphs": [
          "WebP is a modern image format designed to make images smaller on the web. It supports both lossy and lossless compression, and it can also store transparency. PNG is widely supported by image editors, office software, print workflows, and apps that do not accept WebP. PNG is lossless when saved, which makes it useful for graphics that need crisp edges, text, or transparency.",
          "A PNG export can make an image easier to place in a presentation, edit in older software, or use as a logo asset. It may also make the file much larger. PNG is not automatically better for every image: photographs often remain smaller as WebP or JPEG, while diagrams, screenshots, icons, and transparent graphics are common PNG use cases."
        ]
      },
      {
        "title": "Will converting WebP to PNG improve quality?",
        "paragraphs": [
          "No. A converter decodes the WebP pixels and writes them into a PNG file. If the WebP used lossy compression, the conversion preserves the pixels that remain; it does not reconstruct the original camera detail or remove compression artifacts. Saving those pixels in a lossless PNG prevents another lossy compression step, but it cannot reverse an earlier one.",
          "If you still have the original photograph, illustration, or design file, export a PNG from that source instead. If WebP is the only copy, choose the highest-quality version available before converting. Compare the output at the size where it will be used, especially around small text, thin lines, and sharp edges."
        ]
      },
      {
        "title": "What happens to transparency?",
        "paragraphs": [
          "WebP and PNG can both store transparent pixels. A converter can retain that transparency when the input contains it, but a transparent image may look like it has a white or black background in an app that does not show transparency. Check the PNG over both a light and a dark background if the clear areas matter.",
          "If the original WebP has no transparency, converting it to PNG will not remove its background. Background removal is a separate image-editing operation. Do not rely on the file extension alone; open the exported PNG or place it over a colored background to verify the result."
        ]
      },
      {
        "title": "Convert WebP to PNG with Navorika",
        "paragraphs": [
          "Open Navorika’s WebP to PNG converter and select the WebP image from your device. Wait for the conversion to finish, review the preview if one is shown, and download the PNG. Keep the original WebP until you have confirmed that the new file opens and looks right in the app where you plan to use it.",
          "For privacy, Navorika’s converter processes the image in your browser. The conversion does not require you to install desktop software or create an account. Avoid using a shared or public device for sensitive images, and remove downloaded copies from that device when you are finished."
        ]
      },
      {
        "title": "A quick checklist before you convert",
        "paragraphs": [
          "Check that the file is actually a still WebP image. Animated WebP files contain multiple frames; a PNG is a still-image format, so a conversion generally exports one frame rather than preserving the animation. If you need motion, use a format such as GIF or video instead.",
          "Confirm that you have enough storage for the PNG. A PNG can be several times larger than a compressed WebP because PNG favors exact pixel storage over small file size. Make sure the destination app accepts PNG and decide whether transparency is needed before converting."
        ]
      },
      {
        "title": "If the PNG looks different or will not open",
        "paragraphs": [
          "First, open the downloaded file in another image viewer. A preview problem in one application does not always mean the file is damaged. Check that the download completed and that the filename ends in .png; renaming a WebP file to .png does not convert its contents.",
          "If the image appears to have a background, test it on a different canvas to see whether the background is real or just how the app displays transparent pixels. If colors, text, or edges look rough, the source may already contain compression artifacts. Use the original source file when available rather than repeatedly converting the same image."
        ]
      },
      {
        "title": "Choose PNG only when it fits the job",
        "paragraphs": [
          "PNG is a practical choice for screenshots, interface elements, diagrams, logos, and images that need transparency or exact pixel values. It is also a useful compatibility format when a website, editor, or document tool rejects WebP.",
          "For a large photograph that will be uploaded to a website, PNG may create an unnecessarily heavy file. Keep WebP for web delivery when the receiving platform supports it. For print, check the required dimensions, color mode, and resolution separately; changing WebP to PNG does not increase resolution or make an image print-ready."
        ]
      }
    ],
    "stepsTitle": "Steps",
    "steps": [
      "Open the WebP to PNG converter.",
      "Choose a WebP image from your device.",
      "Review the converted image and confirm transparency if needed.",
      "Download the PNG and open it in the destination app."
    ],
    "conclusion": "Converting WebP to PNG changes compatibility and how the file is stored, not the image’s original detail. Use PNG when the next app needs it, keep the WebP or original source until you check the export, and choose a smaller web format when file size matters more.",
    "summary": "Use a WebP to PNG converter when an app requires PNG, when you need broad compatibility, or when you want a lossless PNG export of the pixels currently in the WebP. Conversion cannot recover detail lost in a lossy source, remove a background, or preserve animation in a still PNG. Check transparency, file size, and the downloaded file before relying on it.",
    "faqs": [
      {
        "question": "Can I convert WebP to PNG without losing quality?",
        "answer": "The PNG export itself is lossless, but conversion cannot restore detail already discarded by lossy WebP compression. It preserves the decoded pixels from the source."
      },
      {
        "question": "Does converting WebP to PNG keep a transparent background?",
        "answer": "It can keep transparency when the WebP contains transparent pixels and the converter supports preserving them. Check the result over a colored background."
      },
      {
        "question": "Will the PNG be smaller than the WebP?",
        "answer": "Usually not. PNG files are often larger because they store image pixels losslessly. The exact size depends on image content and compression."
      },
      {
        "question": "Can PNG keep an animated WebP animation?",
        "answer": "No. PNG is generally a still-image format. Converting an animated WebP to PNG normally exports a single frame."
      },
      {
        "question": "Does renaming .webp to .png convert the image?",
        "answer": "No. Renaming changes only the filename. Use a converter to decode the WebP image and create a real PNG file."
      }
    ],
    "languageLabel": "Read this guide in another language",
    "toolLabel": "Convert WebP to PNG",
    "category": "Image",
    "publishedDate": "November 2026",
    "readTime": "8 min read",
    "faqTitle": "Frequently asked questions"
  },
  "es": {
    "title": "Cómo convertir WebP a PNG online y gratis",
    "description": "Aprende a convertir imágenes WebP a PNG, conservar la transparencia y comprobar el archivo resultante antes de usarlo.",
    "keywords": [
      "de webp a png",
      "pasar de webp a png",
      "convertir de webp a png",
      "webp a png sin perder calidad"
    ],
    "intro": "Si recibes una imagen WebP y una aplicación, un documento o un diseño necesita PNG, puedes convertirla en unos pasos. La conversión cambia el formato del archivo, pero no recupera los detalles que se perdieron al comprimir el WebP original. Esta guía explica cómo pasar de WebP a PNG, qué ocurre con la calidad y la transparencia, y cómo revisar el resultado.",
    "sections": [
      {
        "title": "Por qué pasar una imagen WebP a PNG",
        "paragraphs": [
          "WebP reduce el tamaño de muchas imágenes web y admite compresión con pérdida o sin pérdida, además de transparencia. PNG es compatible con numerosos editores, documentos y aplicaciones que todavía no aceptan WebP. Al guardar en PNG no se aplica una nueva compresión con pérdida, por lo que puede ser práctico para capturas, logotipos, iconos y gráficos con bordes definidos.",
          "El PNG puede ocupar bastante más espacio. No es la mejor opción para todas las fotografías. Si una página web acepta WebP, mantener el formato original suele ayudar a reducir el peso de descarga."
        ]
      },
      {
        "title": "¿Se pierde calidad al convertir WebP a PNG?",
        "paragraphs": [
          "El archivo PNG guarda sin pérdida los píxeles que el conversor obtiene al leer el WebP. Si el WebP original se comprimió con pérdida, la conversión no reconstruye los detalles que ya no están ni elimina los artefactos. Solo evita aplicar otra compresión con pérdida al exportar.",
          "Si conservas la foto o el proyecto original, exporta el PNG desde ese archivo. Si solo tienes el WebP, convierte la versión de mayor calidad disponible y revisa el resultado ampliado, sobre todo en textos pequeños y líneas finas."
        ]
      },
      {
        "title": "Transparencia y fondo",
        "paragraphs": [
          "WebP y PNG pueden guardar píxeles transparentes. Si el archivo WebP tiene transparencia, el PNG puede conservarla si el conversor la mantiene. Algunas aplicaciones muestran las zonas transparentes como blancas o negras; comprueba el archivo sobre un fondo claro y otro oscuro.",
          "Convertir un WebP con fondo no elimina ese fondo. Para quitarlo hace falta una herramienta de edición distinta. Cambiar el nombre del archivo a .png tampoco convierte su contenido."
        ]
      },
      {
        "title": "Convertir WebP a PNG con Navorika",
        "paragraphs": [
          "Abre el conversor de WebP a PNG de Navorika, selecciona la imagen WebP de tu dispositivo y espera a que termine el proceso. Revisa la vista previa, si aparece, y descarga el PNG. Conserva el archivo original hasta confirmar que la nueva imagen se abre y se ve correctamente en la aplicación de destino.",
          "El conversor de Navorika procesa la imagen en el navegador, sin instalar un programa de escritorio ni crear una cuenta. Si usas un dispositivo público, elimina las copias descargadas cuando termines."
        ]
      },
      {
        "title": "Comprueba estos puntos antes de convertir",
        "paragraphs": [
          "Asegúrate de que el WebP sea una imagen fija. Un WebP animado contiene varios fotogramas y PNG normalmente es estático; la conversión suele guardar un único fotograma. Si necesitas conservar movimiento, elige GIF o un formato de vídeo.",
          "Comprueba el espacio disponible: un PNG suele pesar más que un WebP comprimido. Confirma también que el programa donde vas a usar la imagen acepta PNG y decide si necesitas transparencia."
        ]
      },
      {
        "title": "Si el PNG se ve distinto o no se abre",
        "paragraphs": [
          "Prueba a abrir la descarga con otro visor de imágenes. Comprueba que se descargó por completo y que termina en .png. Si el fondo parece blanco, colócala sobre un fondo de color para saber si es opaco o solo se muestra así en la aplicación.",
          "Los bordes ásperos o los bloques de color pueden proceder de la compresión del WebP original. Si tienes el archivo de origen, úsalo para exportar de nuevo en vez de convertir varias veces."
        ]
      },
      {
        "title": "Cuándo elegir PNG",
        "paragraphs": [
          "PNG resulta útil para capturas, gráficos, interfaces, logotipos y archivos con transparencia o píxeles que deben conservarse exactamente. También sirve para compatibilidad cuando una aplicación rechaza WebP.",
          "Para fotografías destinadas a una web, PNG puede generar archivos demasiado pesados. Para impresión, verifica aparte las dimensiones, la resolución y el modo de color: convertir el formato no aumenta la resolución ni prepara por sí solo la imagen para imprimir."
        ]
      }
    ],
    "stepsTitle": "Pasos",
    "steps": [
      "Abre el conversor de WebP a PNG.",
      "Elige una imagen WebP de tu dispositivo.",
      "Revisa la imagen convertida y la transparencia, si la necesitas.",
      "Descarga el PNG y ábrelo en la aplicación de destino."
    ],
    "conclusion": "Convertir WebP a PNG cambia la compatibilidad y la forma de guardar el archivo, no los detalles originales de la imagen. Usa PNG cuando la aplicación lo requiera, conserva el original hasta comprobar la exportación y elige WebP si el tamaño importa más.",
    "summary": "Usa un conversor de WebP a PNG cuando una aplicación necesite PNG o quieras compatibilidad amplia. La conversión no recupera detalles perdidos, no elimina fondos ni conserva la animación en un PNG estático. Comprueba la transparencia, el tamaño y el archivo descargado.",
    "faqs": [
      {
        "question": "¿Puedo convertir WebP a PNG sin perder calidad?",
        "answer": "El PNG exportado no añade compresión con pérdida, pero no recupera detalles que el WebP original ya perdió. Conserva los píxeles que el conversor puede leer."
      },
      {
        "question": "¿Se mantiene el fondo transparente?",
        "answer": "Puede mantenerse si el WebP tiene píxeles transparentes y el conversor los conserva. Comprueba el resultado sobre un fondo de color."
      },
      {
        "question": "¿El PNG ocupa menos que WebP?",
        "answer": "Normalmente ocupa más porque PNG guarda la imagen sin pérdida. El tamaño final depende del contenido."
      },
      {
        "question": "¿PNG conserva la animación de WebP?",
        "answer": "No. PNG suele ser estático, así que la conversión de un WebP animado normalmente exporta un solo fotograma."
      },
      {
        "question": "¿Basta con cambiar la extensión del archivo?",
        "answer": "No. Cambiar el nombre no convierte la imagen. Usa un conversor para crear un archivo PNG real."
      }
    ],
    "languageLabel": "Leer esta guía en otro idioma",
    "toolLabel": "Convertir WebP a PNG",
    "category": "Imagen",
    "publishedDate": "Noviembre de 2026",
    "readTime": "8 min de lectura",
    "faqTitle": "Preguntas frecuentes"
  },
  "fr": {
    "title": "Comment convertir une image WebP en PNG gratuitement",
    "description": "Découvrez comment convertir une image WebP en PNG, vérifier la transparence et contrôler le fichier avant de l’utiliser.",
    "keywords": [
      "convertir WebP en PNG",
      "passer de WebP à PNG",
      "WebP en PNG en ligne",
      "WebP en PNG sans perte de qualité"
    ],
    "intro": "Si une image est au format WebP alors qu’une application, un document ou un projet graphique exige un PNG, vous pouvez la convertir en quelques étapes. La conversion change le format du fichier, mais ne restaure pas les détails déjà perdus lors d’une compression WebP avec perte. Ce guide explique comment convertir un WebP en PNG et vérifier la qualité, la transparence et le fichier téléchargé.",
    "sections": [
      {
        "title": "Pourquoi convertir WebP en PNG ?",
        "paragraphs": [
          "WebP réduit souvent le poids des images sur le Web. Il prend en charge la compression avec ou sans perte ainsi que la transparence. Le PNG est reconnu par de nombreux éditeurs, documents et logiciels qui n’acceptent pas encore WebP. Il est utile pour les captures d’écran, les logos, les icônes et les graphiques aux contours nets.",
          "Un PNG peut toutefois être beaucoup plus volumineux. Pour une photographie publiée sur un site qui accepte WebP, conserver le format WebP peut réduire le temps de chargement."
        ]
      },
      {
        "title": "La conversion améliore-t-elle la qualité ?",
        "paragraphs": [
          "Non. Le convertisseur lit les pixels du WebP puis les enregistre dans un fichier PNG. Si la source a subi une compression avec perte, les détails supprimés ne réapparaissent pas et les artefacts restent visibles. Le PNG évite simplement une nouvelle compression avec perte lors de l’export.",
          "Si vous possédez le fichier photo ou graphique original, exportez un PNG à partir de celui-ci. Sinon, choisissez la version WebP de meilleure qualité et examinez le résultat à la taille d’utilisation, notamment les petits textes et les lignes fines."
        ]
      },
      {
        "title": "Que devient la transparence ?",
        "paragraphs": [
          "WebP et PNG peuvent tous deux contenir des pixels transparents. Le PNG peut conserver cette transparence si elle existe dans la source et si le convertisseur la préserve. Certaines applications affichent les zones transparentes en blanc ou en noir : testez l’image sur des fonds clairs et foncés.",
          "La conversion ne supprime pas un arrière-plan opaque. Pour cela, il faut un outil de retouche. Renommer un fichier en .png ne transforme pas son contenu."
        ]
      },
      {
        "title": "Convertir avec Navorika",
        "paragraphs": [
          "Ouvrez le convertisseur WebP vers PNG de Navorika, sélectionnez l’image sur votre appareil et attendez la fin du traitement. Vérifiez l’aperçu s’il est disponible, puis téléchargez le PNG. Gardez le WebP d’origine jusqu’à ce que vous ayez vérifié le nouveau fichier dans l’application cible.",
          "Le convertisseur Navorika traite l’image dans votre navigateur, sans logiciel à installer ni compte à créer. Sur un appareil partagé, pensez à supprimer les fichiers téléchargés après usage."
        ]
      },
      {
        "title": "Avant de lancer la conversion",
        "paragraphs": [
          "Vérifiez si le WebP est animé. Un WebP animé contient plusieurs images successives, tandis qu’un PNG est généralement une image fixe. La conversion exporte normalement une seule image. Pour conserver le mouvement, choisissez plutôt GIF ou un format vidéo.",
          "Prévoyez assez d’espace : un PNG est souvent plus lourd qu’un WebP compressé. Vérifiez aussi que le logiciel de destination accepte le PNG et que vous avez réellement besoin de la transparence."
        ]
      },
      {
        "title": "Si le PNG semble différent",
        "paragraphs": [
          "Ouvrez le téléchargement dans une autre visionneuse et confirmez que le fichier est complet et porte bien l’extension .png. Si l’arrière-plan semble blanc, placez l’image sur un fond coloré pour déterminer si les pixels sont opaques ou simplement affichés ainsi par l’application.",
          "Des contours irréguliers ou des blocs de couleur peuvent déjà être présents dans le WebP. Repartir du fichier original est préférable à plusieurs conversions successives."
        ]
      },
      {
        "title": "Quand choisir le PNG ?",
        "paragraphs": [
          "Le PNG convient aux captures, interfaces, diagrammes, logos et images qui nécessitent des contours nets ou une transparence. Il est aussi pratique lorsqu’un outil n’accepte pas WebP.",
          "Pour les photographies destinées au Web, le PNG peut être inutilement lourd. Pour l’impression, vérifiez séparément les dimensions, la résolution et le mode colorimétrique : la conversion ne crée pas de nouveaux détails et ne prépare pas automatiquement une image à l’impression."
        ]
      }
    ],
    "stepsTitle": "Étapes",
    "steps": [
      "Ouvrez le convertisseur WebP vers PNG.",
      "Sélectionnez une image WebP sur votre appareil.",
      "Vérifiez le résultat et la transparence si nécessaire.",
      "Téléchargez le PNG et ouvrez-le dans le logiciel souhaité."
    ],
    "conclusion": "La conversion en PNG améliore surtout la compatibilité et modifie la façon dont les pixels sont enregistrés. Elle ne récupère pas les détails perdus. Conservez l’original jusqu’à vérification et choisissez WebP lorsque la taille du fichier est prioritaire.",
    "summary": "Convertissez en PNG lorsqu’une application l’exige ou lorsque vous avez besoin d’une compatibilité étendue. La conversion ne restaure pas les détails, ne retire pas l’arrière-plan et ne conserve pas l’animation dans un PNG fixe. Vérifiez la transparence et la taille du fichier.",
    "faqs": [
      {
        "question": "Peut-on convertir WebP en PNG sans perte de qualité ?",
        "answer": "Le PNG n’ajoute pas de compression avec perte, mais il ne peut pas restaurer les détails déjà supprimés par une compression WebP avec perte."
      },
      {
        "question": "La transparence est-elle conservée ?",
        "answer": "Oui, si l’image WebP est transparente et si le convertisseur préserve ces pixels. Vérifiez le résultat sur un fond coloré."
      },
      {
        "question": "Le PNG est-il plus petit que le WebP ?",
        "answer": "Généralement non. Le PNG est souvent plus volumineux car il conserve les pixels sans perte."
      },
      {
        "question": "Le PNG peut-il conserver une animation WebP ?",
        "answer": "Non, le PNG est un format d’image fixe. La conversion exporte habituellement une seule image de l’animation."
      },
      {
        "question": "Renommer le fichier suffit-il ?",
        "answer": "Non. Il faut convertir les données de l’image ; changer uniquement l’extension ne crée pas un vrai PNG."
      }
    ],
    "languageLabel": "Lire ce guide dans une autre langue",
    "toolLabel": "Convertir WebP en PNG",
    "category": "Image",
    "publishedDate": "Novembre 2026",
    "readTime": "8 min de lecture",
    "faqTitle": "Questions fréquentes"
  },
  "it": {
    "title": "Come convertire WebP in PNG gratis online",
    "description": "Scopri come convertire immagini WebP in PNG, mantenere la trasparenza e verificare il file prima di usarlo.",
    "keywords": [
      "convertire WebP in PNG",
      "passare da WebP a PNG",
      "WebP in PNG online",
      "WebP in PNG senza perdere qualità"
    ],
    "intro": "Se un’immagine è in formato WebP ma un’app, un documento o un progetto grafico richiede PNG, puoi convertirla in pochi passaggi. La conversione cambia il formato del file, ma non recupera i dettagli persi durante una compressione WebP con perdita. Questa guida spiega come convertire WebP in PNG e controllare qualità, trasparenza e file scaricato.",
    "sections": [
      {
        "title": "Perché convertire WebP in PNG?",
        "paragraphs": [
          "WebP riduce spesso le dimensioni delle immagini sul web e supporta compressione con o senza perdita e trasparenza. PNG è accettato da molti editor, documenti e programmi che non supportano ancora WebP. È utile per schermate, loghi, icone e grafica con bordi definiti.",
          "Un PNG può però occupare molto più spazio. Per le fotografie pubblicate su un sito che supporta WebP, mantenere il formato originale può ridurre il tempo di caricamento."
        ]
      },
      {
        "title": "La conversione migliora la qualità?",
        "paragraphs": [
          "No. Il convertitore legge i pixel del WebP e li salva in un file PNG. Se la sorgente era stata compressa con perdita, i dettagli rimossi non ricompaiono e gli artefatti restano. Il PNG evita solo una nuova compressione con perdita durante l’esportazione.",
          "Se hai il file originale della foto o del progetto, esporta il PNG da quello. Altrimenti usa la versione WebP di qualità più alta e controlla il risultato alla dimensione finale, soprattutto per testo piccolo e linee sottili."
        ]
      },
      {
        "title": "Cosa succede alla trasparenza?",
        "paragraphs": [
          "Sia WebP sia PNG possono contenere pixel trasparenti. Il PNG può mantenere la trasparenza se è presente nel WebP e il convertitore la conserva. Alcune app mostrano le aree trasparenti in bianco o nero: prova l’immagine su sfondi chiari e scuri.",
          "La conversione non rimuove uno sfondo opaco; serve un’apposita funzione di modifica. Rinominare il file in .png non converte i dati dell’immagine."
        ]
      },
      {
        "title": "Convertire con Navorika",
        "paragraphs": [
          "Apri il convertitore WebP in PNG di Navorika, scegli l’immagine dal dispositivo e attendi il completamento. Controlla l’anteprima, se disponibile, e scarica il PNG. Conserva il WebP originale finché non hai verificato il nuovo file nell’app in cui ti serve.",
          "Il convertitore elabora l’immagine nel browser, senza installare software o creare un account. Su un dispositivo condiviso, elimina i file scaricati al termine."
        ]
      },
      {
        "title": "Controlli prima della conversione",
        "paragraphs": [
          "Verifica se il WebP è animato. Un WebP animato contiene più fotogrammi, mentre PNG è normalmente statico: la conversione esporta di solito un solo fotogramma. Per conservare il movimento, usa GIF o un formato video.",
          "Assicurati di avere spazio sufficiente, perché il PNG può essere più pesante del WebP. Controlla anche che il programma di destinazione supporti PNG e che la trasparenza sia necessaria."
        ]
      },
      {
        "title": "Se il PNG appare diverso",
        "paragraphs": [
          "Apri il file con un altro visualizzatore e verifica che il download sia completo e abbia estensione .png. Se lo sfondo sembra bianco, prova a posizionare l’immagine sopra un colore per distinguere i pixel opachi dalla visualizzazione dell’app.",
          "Bordi frastagliati o macchie possono provenire dal WebP originale. Se disponibile, riparti dal file sorgente invece di convertire più volte la stessa immagine."
        ]
      },
      {
        "title": "Quando scegliere PNG",
        "paragraphs": [
          "PNG è adatto a schermate, interfacce, diagrammi, loghi e immagini che richiedono trasparenza o bordi nitidi. È una scelta pratica anche quando un programma rifiuta WebP.",
          "Per fotografie destinate al web, PNG può essere inutilmente grande. Per la stampa, verifica separatamente dimensioni, risoluzione e modalità colore: convertire il formato non aumenta la risoluzione e non rende automaticamente l’immagine pronta per la stampa."
        ]
      }
    ],
    "stepsTitle": "Procedura",
    "steps": [
      "Apri il convertitore WebP in PNG.",
      "Seleziona un’immagine WebP dal dispositivo.",
      "Controlla il risultato e la trasparenza, se necessaria.",
      "Scarica il PNG e aprilo nell’app di destinazione."
    ],
    "conclusion": "La conversione in PNG cambia la compatibilità e il modo in cui i pixel vengono salvati, ma non recupera i dettagli persi. Conserva l’originale fino al controllo e usa WebP quando conta soprattutto ridurre le dimensioni.",
    "summary": "Converti in PNG quando un’app lo richiede o serve ampia compatibilità. La conversione non ripristina i dettagli, non rimuove lo sfondo e non conserva l’animazione in un PNG statico. Verifica trasparenza, dimensioni e file scaricato.",
    "faqs": [
      {
        "question": "Posso convertire WebP in PNG senza perdere qualità?",
        "answer": "Il PNG non aggiunge compressione con perdita, ma non recupera i dettagli già eliminati dal WebP originale."
      },
      {
        "question": "La trasparenza viene mantenuta?",
        "answer": "Può essere mantenuta se il WebP contiene trasparenza e il convertitore la conserva. Controlla il file su uno sfondo colorato."
      },
      {
        "question": "Il PNG è più piccolo del WebP?",
        "answer": "Di solito no. PNG spesso è più grande perché salva i pixel senza perdita."
      },
      {
        "question": "PNG mantiene un WebP animato?",
        "answer": "No. PNG è normalmente statico e l’esportazione crea un singolo fotogramma."
      },
      {
        "question": "Basta rinominare il file?",
        "answer": "No. Cambiare l’estensione non converte l’immagine; serve un vero convertitore."
      }
    ],
    "languageLabel": "Leggi questa guida in un’altra lingua",
    "toolLabel": "Converti WebP in PNG",
    "category": "Immagini",
    "publishedDate": "Novembre 2026",
    "readTime": "8 min di lettura",
    "faqTitle": "Domande frequenti"
  },
  "pt": {
    "title": "Como converter WebP para PNG grátis e online",
    "description": "Aprenda a converter imagens WebP para PNG, verificar a transparência e conferir o arquivo antes de usá-lo.",
    "keywords": [
      "converter WebP para PNG",
      "passar WebP para PNG",
      "WebP para PNG online",
      "WebP para PNG sem perder qualidade"
    ],
    "intro": "Se uma imagem está no formato WebP, mas um aplicativo, documento ou projeto precisa de PNG, você pode convertê-la em poucos passos. A conversão muda o formato do arquivo, mas não recupera detalhes que já foram perdidos na compressão com perda do WebP original. Este guia mostra como converter WebP para PNG e verificar a qualidade, a transparência e o arquivo baixado.",
    "sections": [
      {
        "title": "Por que converter WebP para PNG?",
        "paragraphs": [
          "WebP costuma reduzir o tamanho das imagens na internet e aceita compressão com ou sem perda, além de transparência. PNG funciona em muitos editores, documentos e aplicativos que ainda não aceitam WebP. É útil para capturas de tela, logotipos, ícones e gráficos com bordas nítidas.",
          "Um PNG pode ocupar bem mais espaço. Para fotografias publicadas em um site compatível com WebP, manter o formato original pode ajudar a carregar a página mais rápido."
        ]
      },
      {
        "title": "Converter melhora a qualidade?",
        "paragraphs": [
          "Não. O conversor lê os pixels do WebP e grava um arquivo PNG. Se a imagem original usou compressão com perda, os detalhes removidos não voltam e os artefatos continuam. O PNG apenas evita uma nova etapa de compressão com perda na exportação.",
          "Se você ainda tem a fotografia ou o projeto original, exporte o PNG a partir dele. Caso contrário, use a versão WebP de melhor qualidade e confira o resultado no tamanho em que será usado."
        ]
      },
      {
        "title": "O que acontece com a transparência?",
        "paragraphs": [
          "WebP e PNG podem armazenar pixels transparentes. O PNG pode manter essa transparência quando ela existe no WebP e o conversor a preserva. Alguns aplicativos mostram essas áreas em branco ou preto; teste a imagem em fundos claros e escuros.",
          "A conversão não remove um fundo opaco. Para isso, é necessário editar a imagem. Renomear o arquivo para .png também não converte seu conteúdo."
        ]
      },
      {
        "title": "Converter com a Navorika",
        "paragraphs": [
          "Abra o conversor de WebP para PNG da Navorika, selecione a imagem no dispositivo e aguarde o processamento. Confira a prévia, se disponível, e baixe o PNG. Guarde o WebP original até confirmar que o novo arquivo abre corretamente no aplicativo de destino.",
          "O conversor processa a imagem no navegador, sem instalar software ou criar uma conta. Em um dispositivo compartilhado, remova as cópias baixadas quando terminar."
        ]
      },
      {
        "title": "Antes de converter",
        "paragraphs": [
          "Verifique se o WebP é animado. Um WebP animado tem vários quadros, enquanto PNG geralmente é uma imagem estática; a conversão costuma exportar apenas um quadro. Para manter o movimento, use GIF ou um formato de vídeo.",
          "Reserve espaço suficiente, pois o PNG normalmente é maior do que um WebP comprimido. Confira também se o aplicativo de destino aceita PNG e se você precisa de transparência."
        ]
      },
      {
        "title": "Se o PNG parecer diferente",
        "paragraphs": [
          "Abra o download em outro visualizador e confirme que o arquivo terminou de baixar e tem extensão .png. Se o fundo parecer branco, coloque a imagem sobre uma cor para verificar se os pixels são opacos ou se o aplicativo apenas os exibe assim.",
          "Bordas irregulares podem estar na imagem WebP original. Se possível, exporte novamente a partir do arquivo original em vez de converter repetidamente."
        ]
      },
      {
        "title": "Quando escolher PNG",
        "paragraphs": [
          "PNG é uma boa opção para capturas, interfaces, diagramas, logotipos e imagens que precisam de transparência ou bordas nítidas. Também ajuda na compatibilidade com programas que rejeitam WebP.",
          "Para fotografias na web, PNG pode gerar um arquivo pesado sem necessidade. Para impressão, confira dimensões, resolução e modo de cor separadamente: converter o formato não aumenta a resolução nem prepara automaticamente a imagem para impressão."
        ]
      }
    ],
    "stepsTitle": "Etapas",
    "steps": [
      "Abra o conversor de WebP para PNG.",
      "Escolha uma imagem WebP do seu dispositivo.",
      "Confira a imagem convertida e a transparência, se necessário.",
      "Baixe o PNG e abra-o no aplicativo desejado."
    ],
    "conclusion": "Converter para PNG melhora a compatibilidade e muda a forma de salvar os pixels, mas não recupera detalhes perdidos. Guarde o original até conferir a exportação e prefira WebP quando o tamanho do arquivo for a prioridade.",
    "summary": "Converta para PNG quando um aplicativo exigir esse formato ou você precisar de ampla compatibilidade. A conversão não recupera detalhes, não remove fundos e não mantém animações em um PNG estático. Confira transparência e tamanho.",
    "faqs": [
      {
        "question": "Posso converter WebP para PNG sem perder qualidade?",
        "answer": "O PNG exportado não adiciona compressão com perda, mas não recupera detalhes já removidos do WebP."
      },
      {
        "question": "A transparência é mantida?",
        "answer": "Pode ser mantida se o WebP tiver pixels transparentes e o conversor os preservar. Confira sobre um fundo colorido."
      },
      {
        "question": "PNG fica menor que WebP?",
        "answer": "Geralmente não. PNG costuma ser maior porque salva os pixels sem perda."
      },
      {
        "question": "PNG mantém a animação de um WebP?",
        "answer": "Não. PNG normalmente é estático e a conversão exporta um único quadro."
      },
      {
        "question": "Só renomear o arquivo funciona?",
        "answer": "Não. Renomear muda apenas a extensão; use um conversor para criar um PNG válido."
      }
    ],
    "languageLabel": "Leia este guia em outro idioma",
    "toolLabel": "Converter WebP para PNG",
    "category": "Imagem",
    "publishedDate": "Novembro de 2026",
    "readTime": "8 min de leitura",
    "faqTitle": "Perguntas frequentes"
  },
  "de": {
    "title": "WebP kostenlos online in PNG umwandeln",
    "description": "Erfahren Sie, wie Sie WebP-Bilder in PNG umwandeln, Transparenz prüfen und die exportierte Datei kontrollieren.",
    "keywords": [
      "WebP in PNG umwandeln",
      "WebP zu PNG konvertieren",
      "WebP PNG online",
      "WebP in PNG ohne Qualitätsverlust"
    ],
    "intro": "Wenn ein Bild als WebP vorliegt, ein Programm, Dokument oder Designprojekt aber PNG benötigt, lässt es sich in wenigen Schritten umwandeln. Die Umwandlung ändert das Dateiformat, stellt jedoch keine Details wieder her, die bei einer verlustbehafteten WebP-Komprimierung verloren gingen. Diese Anleitung zeigt, wie Sie WebP in PNG umwandeln und Qualität, Transparenz sowie die heruntergeladene Datei prüfen.",
    "sections": [
      {
        "title": "Warum WebP in PNG umwandeln?",
        "paragraphs": [
          "WebP verringert häufig die Dateigröße von Webbildern und unterstützt verlustbehaftete und verlustfreie Komprimierung sowie Transparenz. PNG wird von vielen Bildbearbeitungsprogrammen, Dokumenten und älteren Anwendungen unterstützt, die WebP noch nicht öffnen. Es eignet sich für Screenshots, Logos, Symbole und Grafiken mit scharfen Kanten.",
          "Eine PNG-Datei kann jedoch deutlich größer sein. Für Fotos auf einer Website, die WebP unterstützt, ist das ursprüngliche Format oft die platzsparendere Wahl."
        ]
      },
      {
        "title": "Verbessert die Umwandlung die Bildqualität?",
        "paragraphs": [
          "Nein. Ein Konverter liest die Pixel aus der WebP-Datei und speichert sie als PNG. Wurde die Quelle verlustbehaftet komprimiert, bleiben entfernte Details und Kompressionsartefakte bestehen. PNG verhindert lediglich eine weitere verlustbehaftete Komprimierung beim Export.",
          "Wenn Sie noch die Originaldatei des Fotos oder Designs haben, exportieren Sie daraus ein PNG. Andernfalls verwenden Sie die WebP-Version mit der höchsten verfügbaren Qualität und prüfen Sie kleine Texte und feine Linien."
        ]
      },
      {
        "title": "Was passiert mit Transparenz?",
        "paragraphs": [
          "Sowohl WebP als auch PNG können transparente Pixel enthalten. PNG kann die Transparenz übernehmen, wenn sie in der WebP-Datei vorhanden ist und der Konverter sie erhält. Manche Anwendungen zeigen transparente Bereiche weiß oder schwarz an. Testen Sie die Datei daher auf hellem und dunklem Hintergrund.",
          "Ein undurchsichtiger Hintergrund wird bei der Umwandlung nicht entfernt. Dafür ist eine separate Bildbearbeitung nötig. Das Umbenennen der Datei in .png wandelt den Inhalt nicht um."
        ]
      },
      {
        "title": "Mit Navorika konvertieren",
        "paragraphs": [
          "Öffnen Sie den WebP-zu-PNG-Konverter von Navorika, wählen Sie das WebP-Bild auf Ihrem Gerät aus und warten Sie, bis die Umwandlung abgeschlossen ist. Prüfen Sie die Vorschau, falls sie angezeigt wird, und laden Sie das PNG herunter. Behalten Sie das Original, bis die neue Datei im Zielprogramm korrekt geöffnet wurde.",
          "Navorika verarbeitet das Bild im Browser; eine Installation oder ein Konto ist nicht erforderlich. Löschen Sie heruntergeladene Kopien von einem gemeinsam genutzten Gerät, wenn Sie fertig sind."
        ]
      },
      {
        "title": "Vor der Umwandlung prüfen",
        "paragraphs": [
          "Prüfen Sie, ob die WebP-Datei animiert ist. Animiertes WebP enthält mehrere Einzelbilder, PNG ist normalerweise ein Standbild. Bei der Umwandlung wird meist nur ein Einzelbild exportiert. Für Bewegung benötigen Sie GIF oder ein Videoformat.",
          "Planen Sie ausreichend Speicherplatz ein, denn PNG ist oft größer als komprimiertes WebP. Prüfen Sie auch, ob das Zielprogramm PNG akzeptiert und ob Sie Transparenz benötigen."
        ]
      },
      {
        "title": "Wenn das PNG anders aussieht",
        "paragraphs": [
          "Öffnen Sie den Download in einem zweiten Bildbetrachter und prüfen Sie, ob die Datei vollständig heruntergeladen wurde und auf .png endet. Wirkt der Hintergrund weiß, legen Sie das Bild auf eine farbige Fläche, um echte Hintergrundpixel von der Anzeige transparenter Bereiche zu unterscheiden.",
          "Unebene Kanten oder Farbblöcke können bereits in der WebP-Quelle vorhanden sein. Verwenden Sie möglichst die Originaldatei, statt dieselbe Grafik mehrfach umzuwandeln."
        ]
      },
      {
        "title": "Wann ist PNG die richtige Wahl?",
        "paragraphs": [
          "PNG ist praktisch für Screenshots, Benutzeroberflächen, Diagramme, Logos und Bilder mit Transparenz oder klaren Kanten. Es hilft außerdem bei der Kompatibilität mit Programmen, die WebP ablehnen.",
          "Für Webfotos kann PNG unnötig groß sein. Prüfen Sie für den Druck separat Abmessungen, Auflösung und Farbmodus. Die Umwandlung erhöht nicht die Auflösung und macht ein Bild nicht automatisch druckfertig."
        ]
      }
    ],
    "stepsTitle": "So geht’s",
    "steps": [
      "Öffnen Sie den WebP-zu-PNG-Konverter.",
      "Wählen Sie ein WebP-Bild von Ihrem Gerät aus.",
      "Prüfen Sie das Ergebnis und bei Bedarf die Transparenz.",
      "Laden Sie das PNG herunter und öffnen Sie es im Zielprogramm."
    ],
    "conclusion": "Die Umwandlung in PNG verbessert vor allem die Kompatibilität und ändert die Speicherung der Pixel. Verlorene Details werden nicht wiederhergestellt. Behalten Sie die Originaldatei bis zur Prüfung und verwenden Sie WebP, wenn die Dateigröße entscheidend ist.",
    "summary": "Wandeln Sie WebP in PNG um, wenn ein Programm PNG verlangt oder Sie breite Kompatibilität benötigen. Die Umwandlung stellt keine verlorenen Details wieder her, entfernt keinen Hintergrund und bewahrt Animationen nicht in einem Standbild. Prüfen Sie Transparenz und Dateigröße.",
    "faqs": [
      {
        "question": "Kann ich WebP ohne Qualitätsverlust in PNG umwandeln?",
        "answer": "Der PNG-Export fügt keine verlustbehaftete Komprimierung hinzu, stellt aber keine Details wieder her, die die WebP-Datei bereits verloren hat."
      },
      {
        "question": "Bleibt der transparente Hintergrund erhalten?",
        "answer": "Ja, wenn die WebP-Datei transparente Pixel enthält und der Konverter diese erhält. Prüfen Sie das Ergebnis auf einem farbigen Hintergrund."
      },
      {
        "question": "Ist PNG kleiner als WebP?",
        "answer": "Meistens nicht. PNG-Dateien sind oft größer, weil die Pixel verlustfrei gespeichert werden."
      },
      {
        "question": "Kann PNG eine WebP-Animation erhalten?",
        "answer": "Nein. PNG ist üblicherweise ein Standbildformat; meist wird ein Einzelbild exportiert."
      },
      {
        "question": "Reicht es, die Dateiendung umzubenennen?",
        "answer": "Nein. Das ändert nur den Namen, nicht den Dateiinhalt. Verwenden Sie einen Konverter."
      }
    ],
    "languageLabel": "Diese Anleitung in einer anderen Sprache lesen",
    "toolLabel": "WebP in PNG umwandeln",
    "category": "Bilder",
    "publishedDate": "November 2026",
    "readTime": "8 Min. Lesezeit",
    "faqTitle": "Häufig gestellte Fragen"
  },
  "ru": {
    "title": "Как бесплатно конвертировать WebP в PNG",
    "description": "Узнайте, как преобразовать WebP в PNG, проверить прозрачность и убедиться, что скачанный файл подходит для использования.",
    "keywords": [
      "конвертировать WebP в PNG",
      "WebP в PNG онлайн",
      "перевести WebP в PNG",
      "WebP в PNG без потери качества"
    ],
    "intro": "Если изображение сохранено в WebP, а приложение, документ или дизайн-проект требует PNG, его можно преобразовать за несколько шагов. Конвертация меняет формат файла, но не восстанавливает детали, уже потерянные при сжатии WebP с потерями. В этом руководстве описано, как преобразовать WebP в PNG и проверить качество, прозрачность и скачанный файл.",
    "sections": [
      {
        "title": "Зачем переводить WebP в PNG?",
        "paragraphs": [
          "WebP часто уменьшает размер изображений для интернета и поддерживает сжатие с потерями и без потерь, а также прозрачность. PNG открывается во многих редакторах, документах и приложениях, которые пока не поддерживают WebP. Он подходит для снимков экрана, логотипов, значков и графики с четкими краями.",
          "При этом PNG может занимать заметно больше места. Для фотографий на сайте, который принимает WebP, исходный формат часто удобнее из-за меньшего размера."
        ]
      },
      {
        "title": "Улучшится ли качество после конвертации?",
        "paragraphs": [
          "Нет. Конвертер считывает пиксели из WebP и сохраняет их в PNG. Если исходный файл был сжат с потерями, удаленные детали не появятся снова, а артефакты останутся. PNG лишь не добавляет еще один этап сжатия с потерями.",
          "Если у вас сохранился исходный файл фотографии или макета, экспортируйте PNG из него. В противном случае возьмите WebP в максимально доступном качестве и проверьте мелкий текст и тонкие линии."
        ]
      },
      {
        "title": "Сохранится ли прозрачность?",
        "paragraphs": [
          "И WebP, и PNG могут содержать прозрачные пиксели. PNG сохранит прозрачность, если она есть в исходном WebP и конвертер ее поддерживает. Некоторые программы показывают прозрачные области белыми или черными, поэтому проверьте изображение на светлом и темном фоне.",
          "Конвертация не удаляет непрозрачный фон. Для этого нужна отдельная обработка изображения. Переименование файла с расширением .webp в .png не меняет его формат."
        ]
      },
      {
        "title": "Конвертация в Navorika",
        "paragraphs": [
          "Откройте конвертер WebP в PNG на Navorika, выберите файл на устройстве и дождитесь завершения. Просмотрите результат, если доступен предварительный просмотр, и скачайте PNG. Сохраняйте исходный WebP, пока не убедитесь, что новый файл открывается в нужной программе.",
          "Navorika обрабатывает изображение в браузере, без установки программы и создания аккаунта. На общем устройстве удалите скачанные копии после использования."
        ]
      },
      {
        "title": "Что проверить перед конвертацией",
        "paragraphs": [
          "Уточните, не является ли WebP анимированным. В анимированном WebP несколько кадров, а PNG обычно статичен; при преобразовании чаще всего сохраняется только один кадр. Чтобы сохранить движение, выберите GIF или видеоформат.",
          "Убедитесь, что на устройстве достаточно свободного места: PNG обычно больше сжатого WebP. Также проверьте, что целевая программа принимает PNG и что вам действительно нужна прозрачность."
        ]
      },
      {
        "title": "Если PNG выглядит иначе",
        "paragraphs": [
          "Откройте скачанный файл в другой программе и проверьте, что загрузка завершилась и имя заканчивается на .png. Если фон кажется белым, поместите изображение на цветную подложку и проверьте, действительно ли пиксели непрозрачны.",
          "Неровные края и цветовые блоки могли быть в исходном WebP. Если есть исходный файл, используйте его вместо повторной конвертации уже преобразованного изображения."
        ]
      },
      {
        "title": "Когда выбрать PNG",
        "paragraphs": [
          "PNG удобен для снимков экрана, интерфейсов, схем, логотипов и изображений с прозрачностью или четкими краями. Он также помогает, если программа не принимает WebP.",
          "Для фотографий на сайте PNG может быть слишком тяжелым. Для печати отдельно проверьте размеры, разрешение и цветовой режим: смена формата не увеличивает разрешение и не делает изображение автоматически готовым к печати."
        ]
      }
    ],
    "stepsTitle": "Порядок действий",
    "steps": [
      "Откройте конвертер WebP в PNG.",
      "Выберите файл WebP на устройстве.",
      "Проверьте результат и прозрачность, если она нужна.",
      "Скачайте PNG и откройте его в нужной программе."
    ],
    "conclusion": "Преобразование в PNG меняет совместимость и способ хранения пикселей, но не возвращает потерянные детали. Сохраните исходник до проверки и оставьте WebP, если важен небольшой размер.",
    "summary": "Используйте конвертер WebP в PNG, когда приложение требует PNG или нужна широкая совместимость. Конвертация не восстановит детали, не удалит фон и не сохранит анимацию в статичном PNG. Проверьте прозрачность и размер файла.",
    "faqs": [
      {
        "question": "Можно ли конвертировать WebP в PNG без потери качества?",
        "answer": "PNG не добавит сжатие с потерями, но не восстановит детали, уже удаленные из WebP."
      },
      {
        "question": "Сохранится ли прозрачность?",
        "answer": "Да, если в WebP есть прозрачные пиксели и конвертер их сохраняет. Проверьте изображение на цветном фоне."
      },
      {
        "question": "PNG будет меньше WebP?",
        "answer": "Обычно нет. PNG часто больше, поскольку сохраняет пиксели без потерь."
      },
      {
        "question": "Сохранит ли PNG анимацию WebP?",
        "answer": "Нет. PNG обычно статичен, поэтому экспортируется один кадр."
      },
      {
        "question": "Достаточно ли переименовать файл?",
        "answer": "Нет. Переименование меняет только название. Для создания PNG требуется конвертация данных изображения."
      }
    ],
    "languageLabel": "Открыть это руководство на другом языке",
    "toolLabel": "Конвертировать WebP в PNG",
    "category": "Изображения",
    "publishedDate": "Ноябрь 2026",
    "readTime": "8 мин чтения",
    "faqTitle": "Частые вопросы"
  },
  "ar": {
    "title": "كيفية تحويل WebP إلى PNG مجانًا عبر الإنترنت",
    "description": "تعرّف على تحويل صور WebP إلى PNG والتحقق من الشفافية والملف الناتج قبل استخدامه.",
    "keywords": [
      "تحويل WebP إلى PNG",
      "WebP إلى PNG أونلاين",
      "تحويل صورة WebP إلى PNG",
      "WebP إلى PNG دون فقدان الجودة"
    ],
    "intro": "إذا كانت الصورة بصيغة WebP بينما يتطلب تطبيق أو مستند أو مشروع تصميم صيغة PNG، يمكنك تحويلها في خطوات قليلة. يغيّر التحويل صيغة الملف، لكنه لا يستعيد التفاصيل التي فُقدت سابقًا عند ضغط WebP بفقدان. يشرح هذا الدليل طريقة التحويل وما يحدث للجودة والشفافية وكيفية فحص الملف الناتج.",
    "sections": [
      {
        "title": "لماذا نحول WebP إلى PNG؟",
        "paragraphs": [
          "تساعد WebP على تقليل حجم الصور على الويب، وتدعم الضغط مع الفقد أو بدونه، كما تدعم الشفافية. تعمل PNG مع كثير من برامج التحرير والمستندات والتطبيقات التي لا تقبل WebP. وهي مناسبة لصور الشاشة والشعارات والأيقونات والرسومات ذات الحواف الدقيقة.",
          "قد يكون حجم PNG أكبر بكثير. إذا كان موقعك يقبل WebP، فقد يكون الاحتفاظ بالصورة بهذا التنسيق أفضل لتقليل حجم التنزيل."
        ]
      },
      {
        "title": "هل يؤدي التحويل إلى تحسين الجودة؟",
        "paragraphs": [
          "لا. يقرأ المحوّل بكسلات WebP ثم يحفظها في PNG. إذا استُخدم الضغط مع الفقد في الملف الأصلي، فلن تعود التفاصيل التي حُذفت ولن تختفي آثار الضغط. يمنع PNG فقط إضافة ضغط جديد مع الفقد أثناء التصدير.",
          "إذا كان الملف الأصلي للصورة أو التصميم متوفرًا، فصدّر PNG منه مباشرة. وإلا فاختر نسخة WebP الأعلى جودة وافحص النصوص الصغيرة والخطوط الرفيعة في الحجم الذي ستستخدمه."
        ]
      },
      {
        "title": "ماذا يحدث للشفافية؟",
        "paragraphs": [
          "يمكن لكل من WebP وPNG تخزين بكسلات شفافة. يستطيع PNG الاحتفاظ بالشفافية إذا كانت موجودة في WebP وكان المحوّل يحافظ عليها. قد تعرض بعض التطبيقات المناطق الشفافة باللون الأبيض أو الأسود؛ افحص الصورة فوق خلفية فاتحة وأخرى داكنة.",
          "لا يزيل التحويل خلفية معتمة. تحتاج إزالة الخلفية إلى أداة تحرير منفصلة. كما أن تغيير امتداد الملف إلى .png لا يحول بيانات الصورة."
        ]
      },
      {
        "title": "التحويل باستخدام Navorika",
        "paragraphs": [
          "افتح محوّل WebP إلى PNG في Navorika، واختر الصورة من جهازك وانتظر انتهاء المعالجة. راجع المعاينة إن ظهرت ثم نزّل PNG. احتفظ بملف WebP الأصلي حتى تتأكد من فتح الملف الجديد بشكل صحيح في التطبيق المطلوب.",
          "يعالج المحوّل الصورة في المتصفح دون تثبيت برنامج أو إنشاء حساب. عند استخدام جهاز مشترك، احذف النسخ التي نزلتها بعد الانتهاء."
        ]
      },
      {
        "title": "تحقّق قبل التحويل",
        "paragraphs": [
          "تأكد مما إذا كان WebP متحركًا. يحتوي WebP المتحرك على إطارات عدة، بينما تكون PNG عادة صورة ثابتة؛ لذلك غالبًا ما يحفظ التحويل إطارًا واحدًا فقط. إذا كنت تحتاج إلى الحركة، فاستخدم GIF أو صيغة فيديو.",
          "تأكد من توفر مساحة كافية، لأن PNG غالبًا أكبر من WebP المضغوط. وتحقق من دعم التطبيق المستهدف لصيغة PNG ومن حاجتك إلى الشفافية."
        ]
      },
      {
        "title": "إذا بدت صورة PNG مختلفة",
        "paragraphs": [
          "جرّب فتح الملف في عارض صور آخر، وتأكد من اكتمال التنزيل وأن اسم الملف ينتهي بـ .png. إذا بدت الخلفية بيضاء، ضع الصورة فوق لون مختلف لتعرف هل البكسلات معتمة أم أن التطبيق يعرض المناطق الشفافة بهذه الطريقة.",
          "قد تكون الحواف الخشنة أو مربعات الألوان موجودة في ملف WebP الأصلي. إن توفر المصدر، استخدمه للتصدير بدل تحويل الصورة نفسها مرارًا."
        ]
      },
      {
        "title": "متى تختار PNG؟",
        "paragraphs": [
          "تُعد PNG مناسبة لصور الشاشة والواجهات والمخططات والشعارات والصور التي تحتاج إلى شفافية أو حواف دقيقة. كما أنها خيار للتوافق مع البرامج التي ترفض WebP.",
          "قد تكون PNG كبيرة بلا داعٍ للصور الفوتوغرافية المنشورة على الويب. وللطباعة، افحص الأبعاد والدقة ونمط الألوان بشكل منفصل؛ فتغيير الصيغة لا يزيد الدقة ولا يجعل الصورة جاهزة للطباعة تلقائيًا."
        ]
      }
    ],
    "stepsTitle": "الخطوات",
    "steps": [
      "افتح محوّل WebP إلى PNG.",
      "اختر صورة WebP من جهازك.",
      "راجع الصورة الناتجة والشفافية عند الحاجة.",
      "نزّل PNG وافتحه في التطبيق المطلوب."
    ],
    "conclusion": "يغيّر التحويل إلى PNG التوافق وطريقة حفظ البكسلات، لكنه لا يعيد التفاصيل المفقودة. احتفظ بالملف الأصلي حتى تفحص النتيجة، واستخدم WebP عندما يكون حجم الملف أولوية.",
    "summary": "حوّل WebP إلى PNG عندما يتطلب التطبيق ذلك أو تحتاج إلى توافق واسع. لا يستعيد التحويل التفاصيل المفقودة ولا يزيل الخلفية ولا يحافظ على الحركة داخل صورة PNG ثابتة. افحص الشفافية وحجم الملف.",
    "faqs": [
      {
        "question": "هل يمكن تحويل WebP إلى PNG دون فقدان الجودة؟",
        "answer": "لا يضيف تصدير PNG ضغطًا مع فقدان، لكنه لا يستعيد التفاصيل التي فُقدت من WebP سابقًا."
      },
      {
        "question": "هل تبقى الخلفية الشفافة؟",
        "answer": "يمكن أن تبقى إذا احتوت WebP على بكسلات شفافة وحافظ عليها المحوّل. افحصها فوق خلفية ملونة."
      },
      {
        "question": "هل PNG أصغر من WebP؟",
        "answer": "غالبًا لا. عادة يكون PNG أكبر لأنه يحفظ البكسلات دون فقدان."
      },
      {
        "question": "هل يحتفظ PNG بحركة WebP؟",
        "answer": "لا. PNG ثابتة عادة، لذا يُصدَّر إطار واحد في الغالب."
      },
      {
        "question": "هل يكفي تغيير امتداد الملف؟",
        "answer": "لا. تغيير الاسم لا يحول بيانات الصورة. استخدم محوّلًا لإنشاء ملف PNG فعلي."
      }
    ],
    "languageLabel": "اقرأ هذا الدليل بلغة أخرى",
    "toolLabel": "تحويل WebP إلى PNG",
    "category": "الصور",
    "publishedDate": "نوفمبر 2026",
    "readTime": "8 دقائق للقراءة",
    "faqTitle": "الأسئلة الشائعة"
  }
};

export const webpPngGuideContent = {
  'webp-to-png-guide': {
    intro: webpPngGuideTranslations.en.intro,
    sections: webpPngGuideTranslations.en.sections.map((section) => ({ title: section.title, content: section.paragraphs.join('\n\n') })),
    faqs: webpPngGuideTranslations.en.faqs,
    summary: webpPngGuideTranslations.en.summary,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: webpPngGuideTranslations.en.title,
      description: webpPngGuideTranslations.en.description,
      author: { '@type': 'Organization', name: 'Navorika' },
      datePublished: '2026-11-13',
      dateModified: '2026-11-13',
    },
  },
};
