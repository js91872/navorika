import type { Language } from './config';
export interface ActionMessages {
  group: string; working: string; copied: string; printOpened: string; noResult: string;
  downloadReady: string; failed: string; print: string;
}
export const resultActionMessages: Record<Language, ActionMessages> = {
  en: { group: 'Result actions', working: 'Working…', copied: 'Result copied.', printOpened: 'Print dialog opened.', noResult: 'There is no result to use yet.', downloadReady: 'Download ready.', failed: 'The result action failed.', print: 'Print / Save PDF' },
  fr: { group: 'Actions sur le résultat', working: 'Traitement…', copied: 'Résultat copié.', printOpened: 'Fenêtre d’impression ouverte.', noResult: 'Aucun résultat disponible pour le moment.', downloadReady: 'Téléchargement prêt.', failed: 'L’action a échoué. Réessayez ou copiez le résultat manuellement.', print: 'Imprimer / Enregistrer en PDF' },
  it: { group: 'Azioni sul risultato', working: 'Elaborazione…', copied: 'Risultato copiato.', printOpened: 'Finestra di stampa aperta.', noResult: 'Nessun risultato ancora disponibile.', downloadReady: 'Scaricamento pronto.', failed: 'Operazione non riuscita. Riprova o copia il risultato manualmente.', print: 'Stampa / Salva PDF' },
  pt: { group: 'Ações do resultado', working: 'Processando…', copied: 'Resultado copiado.', printOpened: 'Janela de impressão aberta.', noResult: 'Ainda não há resultado disponível.', downloadReady: 'Download pronto.', failed: 'A ação falhou. Tente novamente ou copie o resultado manualmente.', print: 'Imprimir / Salvar PDF' },
  es: { group: 'Acciones del resultado', working: 'Procesando…', copied: 'Resultado copiado.', printOpened: 'Ventana de impresión abierta.', noResult: 'Todavía no hay un resultado disponible.', downloadReady: 'Descarga lista.', failed: 'La acción ha fallado. Inténtalo de nuevo o copia el resultado manualmente.', print: 'Imprimir / Guardar PDF' },
  ar: { group: 'إجراءات النتيجة', working: 'جارٍ التنفيذ…', copied: 'تم نسخ النتيجة.', printOpened: 'تم فتح نافذة الطباعة.', noResult: 'لا توجد نتيجة متاحة بعد.', downloadReady: 'التنزيل جاهز.', failed: 'تعذر تنفيذ الإجراء. أعد المحاولة أو انسخ النتيجة يدويًا.', print: 'طباعة / حفظ PDF' },
  ru: { group: 'Действия с результатом', working: 'Обработка…', copied: 'Результат скопирован.', printOpened: 'Окно печати открыто.', noResult: 'Результат пока недоступен.', downloadReady: 'Загрузка готова.', failed: 'Не удалось выполнить действие. Повторите попытку или скопируйте результат вручную.', print: 'Печать / Сохранить PDF' },
  de: { group: 'Ergebnisaktionen', working: 'Wird verarbeitet…', copied: 'Ergebnis kopiert.', printOpened: 'Druckdialog geöffnet.', noResult: 'Es ist noch kein Ergebnis verfügbar.', downloadReady: 'Download bereit.', failed: 'Die Aktion ist fehlgeschlagen. Versuchen Sie es erneut oder kopieren Sie das Ergebnis manuell.', print: 'Drucken / Als PDF speichern' },
};

/** Localized interfaces never expose raw browser/provider errors to visitors. */
export function resultActionError(error: unknown, messages?: ActionMessages) {
  return messages ? messages.failed : error instanceof Error ? error.message : resultActionMessages.en.failed;
}
