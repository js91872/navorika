import type { ToolPageContent } from '@/lib/seo/toolPage';

export const emailToolPages: Record<string, ToolPageContent> = {
  'eml-to-pdf': {
    slug: 'eml-to-pdf',
    name: 'Free EML to PDF Converter Online',
    category: 'Developer Tools',
    applicationCategory: 'UtilitiesApplication',
    description:
      'Create a readable PDF with email headers, message text and attachment names. Western European text is searchable; other scripts may render as images.',
    longTailKeywords: [
      'eml to pdf',
      'convert eml to pdf',
      'eml to pdf online',
      'free eml to pdf converter',
      'batch eml to pdf',
    ],
    intro: [
      'Use this free EML to PDF converter online to turn saved email messages into a practical format for your next task. You do not need an email account connection or a desktop mail application to process an existing EML file.',
      'Create a readable PDF with email headers, message text and attachment names. Western European text is searchable; other scripts may render as images.',
      'Reading, preview and conversion take place locally in your browser. Your selected messages are not uploaded to Navorika. The preview removes sender-controlled links, images, scripts and styles before displaying the message.',
    ],
    formula: [
      {
        title: 'Read and decode the email',
        body: 'The MIME parser separates message headers, body parts and attachments, decoding common transfer encodings and declared character sets. EML stores email structure; a target document requires a separate representation.',
      },
      {
        title: 'Build the PDF output',
        body: 'Create a readable PDF with email headers, message text and attachment names. Western European text is searchable; other scripts may render as images.',
      },
    ],
    steps: [
      'Choose or drop 1–50 .eml files, no more than 20 MB combined. You can try the sample email first.',
      'Review the sender, recipients, date and safe email preview. Use the selector to inspect each message in a batch.',
      'Click Convert & download. A single email downloads as PDF; multiple emails download as separate files in a ZIP.',
      'Open the downloaded output and verify the message text and attachment handling before sharing. Keep the original EML for a complete source copy.',
    ],
    interpretation: [
      'Create a readable PDF with email headers, message text and attachment names. Western European text is searchable; other scripts may render as images.',
      'The displayed date is the date available in the source message, not a verified delivery record. Missing headers remain blank and are not invented.',
      'Batch output follows the selected file order. ZIP entries have numbered names to avoid overwriting messages with the same filename. Excel retains the source filename in its first column.',
    ],
    examples: [
      {
        title: 'Try a saved message',
        input:
          'An EML containing a subject, sender, recipient, date and meeting notes.',
        result: 'A PDF output containing readable email information.',
        note: 'Use Try sample email to test the workflow without selecting a personal file.',
      },
    ],
    limitations: [
      'At most 50 emails, 20 MB of source files per batch, 500,000 combined body characters and 200 attachments per email. Very large messages or batches can exceed available device memory.',
      'PDF output is a readable text layout, not a screenshot of the original message. Email images and attachment files are not embedded.',
      'Western European text is selectable and searchable. Scripts outside the PDF font encoding use image rendering and are not searchable.',
      'The tool does not recover deleted emails, convert an entire mailbox or accept Outlook MSG as input. Password-protected or encrypted message content must be decrypted in an authorized mail application first.',
    ],
    faqs: [
      {
        question: 'Is this EML to PDF converter free?',
        answer:
          'Yes. You can use the converter without an account or payment, within the displayed batch and file-size limits.',
      },
      {
        question: 'Are my emails uploaded?',
        answer:
          'No. Selected EML files are parsed and converted in this browser tab. Clear files to remove the selected messages from the tool, or close the tab.',
      },
      {
        question: 'Can I convert multiple EML files to PDF?',
        answer:
          'Yes. Select up to 50 emails, with no more than 20 MB combined. Each message becomes a separate output file in one ZIP download.',
      },
      {
        question: 'What happens to attachments?',
        answer:
          'Only attachment names are included. To retain the actual attachment files in an email container, use EML to MSG or keep the original EML.',
      },
      {
        question: 'Will the output look exactly like the original email?',
        answer:
          'PDF output is a readable text layout, not a screenshot of the original message. Email images and attachment files are not embedded.',
      },
    ],
    relatedTools: [
      { slug: 'eml-to-msg', name: 'EML to MSG' },
      { slug: 'eml-to-html', name: 'EML to HTML' },
      { slug: 'eml-to-excel', name: 'EML to Excel' },
      { slug: 'eml-to-word', name: 'EML to Word' },
    ],
    relatedGuides: ['how-to-convert-eml-to-pdf'],
  },
  'eml-to-msg': {
    slug: 'eml-to-msg',
    name: 'Free EML to MSG Converter Online',
    category: 'Developer Tools',
    applicationCategory: 'UtilitiesApplication',
    description:
      'Create a Unicode Outlook MSG with sender, recipients, date, message text, safe HTML and original attachment files.',
    longTailKeywords: [
      'eml to msg',
      'convert eml to msg',
      'eml to msg online',
      'free eml to msg converter',
      'batch eml to msg',
    ],
    intro: [
      'Use this free EML to MSG converter online to turn saved email messages into a practical format for your next task. You do not need an email account connection or a desktop mail application to process an existing EML file.',
      'Create a Unicode Outlook MSG with sender, recipients, date, message text, safe HTML and original attachment files.',
      'Reading, preview and conversion take place locally in your browser. Your selected messages are not uploaded to Navorika. The preview removes sender-controlled links, images, scripts and styles before displaying the message.',
    ],
    formula: [
      {
        title: 'Read and decode the email',
        body: 'The MIME parser separates message headers, body parts and attachments, decoding common transfer encodings and declared character sets. EML stores email structure; a target document requires a separate representation.',
      },
      {
        title: 'Build the MSG output',
        body: 'Create a Unicode Outlook MSG with sender, recipients, date, message text, safe HTML and original attachment files.',
      },
    ],
    steps: [
      'Choose or drop 1–50 .eml files, no more than 20 MB combined. You can try the sample email first.',
      'Review the sender, recipients, date and safe email preview. Use the selector to inspect each message in a batch.',
      'Click Convert & download. A single email downloads as MSG; multiple emails download as separate files in a ZIP.',
      'Open the downloaded output and verify the message text and attachment handling before sharing. Keep the original EML for a complete source copy.',
    ],
    interpretation: [
      'Create a Unicode Outlook MSG with sender, recipients, date, message text, safe HTML and original attachment files.',
      'The displayed date is the date available in the source message, not a verified delivery record. Missing headers remain blank and are not invented.',
      'Batch output follows the selected file order. ZIP entries have numbered names to avoid overwriting messages with the same filename. Excel retains the source filename in its first column.',
    ],
    examples: [
      {
        title: 'Try a saved message',
        input:
          'An EML containing a subject, sender, recipient, date and meeting notes.',
        result: 'A MSG output containing readable email information.',
        note: 'Use Try sample email to test the workflow without selecting a personal file.',
      },
    ],
    limitations: [
      'At most 50 emails, 20 MB of source files per batch, 500,000 combined body characters and 200 attachments per email. Very large messages or batches can exceed available device memory.',
      'MSG output is rebuilt from the available EML fields; proprietary Outlook fields, signatures and calendar behavior are not recreated.',
      'Attachments are stored by value, including nested email attachments as files. This converter does not verify senders, signatures or attachment safety.',
      'The tool does not recover deleted emails, convert an entire mailbox or accept Outlook MSG as input. Password-protected or encrypted message content must be decrypted in an authorized mail application first.',
    ],
    faqs: [
      {
        question: 'Is this EML to MSG converter free?',
        answer:
          'Yes. You can use the converter without an account or payment, within the displayed batch and file-size limits.',
      },
      {
        question: 'Are my emails uploaded?',
        answer:
          'No. Selected EML files are parsed and converted in this browser tab. Clear files to remove the selected messages from the tool, or close the tab.',
      },
      {
        question: 'Can I convert multiple EML files to MSG?',
        answer:
          'Yes. Select up to 50 emails, with no more than 20 MB combined. Each message becomes a separate output file in one ZIP download.',
      },
      {
        question: 'What happens to attachments?',
        answer:
          'Original attachment bytes are embedded in the MSG output. Open them only if you trust the source.',
      },
      {
        question: 'Will the output look exactly like the original email?',
        answer:
          'MSG output is rebuilt from the available EML fields; proprietary Outlook fields, signatures and calendar behavior are not recreated.',
      },
    ],
    relatedTools: [
      { slug: 'eml-to-pdf', name: 'EML to PDF' },
      { slug: 'eml-to-html', name: 'EML to HTML' },
      { slug: 'eml-to-excel', name: 'EML to Excel' },
      { slug: 'eml-to-word', name: 'EML to Word' },
    ],
    relatedGuides: ['how-to-convert-eml-to-msg'],
  },
  'eml-to-html': {
    slug: 'eml-to-html',
    name: 'Free EML to HTML Converter Online',
    category: 'Developer Tools',
    applicationCategory: 'UtilitiesApplication',
    description:
      'Save a standalone HTML document with email headers, basic message formatting and an attachment list. Remote content and images are removed.',
    longTailKeywords: [
      'eml to html',
      'convert eml to html',
      'eml to html online',
      'free eml to html converter',
      'batch eml to html',
    ],
    intro: [
      'Use this free EML to HTML converter online to turn saved email messages into a practical format for your next task. You do not need an email account connection or a desktop mail application to process an existing EML file.',
      'Save a standalone HTML document with email headers, basic message formatting and an attachment list. Remote content and images are removed.',
      'Reading, preview and conversion take place locally in your browser. Your selected messages are not uploaded to Navorika. The preview removes sender-controlled links, images, scripts and styles before displaying the message.',
    ],
    formula: [
      {
        title: 'Read and decode the email',
        body: 'The MIME parser separates message headers, body parts and attachments, decoding common transfer encodings and declared character sets. EML stores email structure; a target document requires a separate representation.',
      },
      {
        title: 'Build the HTML output',
        body: 'Save a standalone HTML document with email headers, basic message formatting and an attachment list. Remote content and images are removed.',
      },
    ],
    steps: [
      'Choose or drop 1–50 .eml files, no more than 20 MB combined. You can try the sample email first.',
      'Review the sender, recipients, date and safe email preview. Use the selector to inspect each message in a batch.',
      'Click Convert & download. A single email downloads as HTML; multiple emails download as separate files in a ZIP.',
      'Open the downloaded output and verify the message text and attachment handling before sharing. Keep the original EML for a complete source copy.',
    ],
    interpretation: [
      'Save a standalone HTML document with email headers, basic message formatting and an attachment list. Remote content and images are removed.',
      'The displayed date is the date available in the source message, not a verified delivery record. Missing headers remain blank and are not invented.',
      'Batch output follows the selected file order. ZIP entries have numbered names to avoid overwriting messages with the same filename. Excel retains the source filename in its first column.',
    ],
    examples: [
      {
        title: 'Try a saved message',
        input:
          'An EML containing a subject, sender, recipient, date and meeting notes.',
        result: 'A HTML output containing readable email information.',
        note: 'Use Try sample email to test the workflow without selecting a personal file.',
      },
    ],
    limitations: [
      'At most 50 emails, 20 MB of source files per batch, 500,000 combined body characters and 200 attachments per email. Very large messages or batches can exceed available device memory.',
      'Basic tables, lists, headings and emphasis are retained. Sender CSS, links, forms, scripts, images and remote resources are removed.',
      'Attachment names are listed for reference; the attachment files themselves are not embedded in the HTML.',
      'The tool does not recover deleted emails, convert an entire mailbox or accept Outlook MSG as input. Password-protected or encrypted message content must be decrypted in an authorized mail application first.',
    ],
    faqs: [
      {
        question: 'Is this EML to HTML converter free?',
        answer:
          'Yes. You can use the converter without an account or payment, within the displayed batch and file-size limits.',
      },
      {
        question: 'Are my emails uploaded?',
        answer:
          'No. Selected EML files are parsed and converted in this browser tab. Clear files to remove the selected messages from the tool, or close the tab.',
      },
      {
        question: 'Can I convert multiple EML files to HTML?',
        answer:
          'Yes. Select up to 50 emails, with no more than 20 MB combined. Each message becomes a separate output file in one ZIP download.',
      },
      {
        question: 'What happens to attachments?',
        answer:
          'Only attachment names are included. To retain the actual attachment files in an email container, use EML to MSG or keep the original EML.',
      },
      {
        question: 'Will the output look exactly like the original email?',
        answer:
          'Basic tables, lists, headings and emphasis are retained. Sender CSS, links, forms, scripts, images and remote resources are removed.',
      },
    ],
    relatedTools: [
      { slug: 'eml-to-pdf', name: 'EML to PDF' },
      { slug: 'eml-to-msg', name: 'EML to MSG' },
      { slug: 'eml-to-excel', name: 'EML to Excel' },
      { slug: 'eml-to-word', name: 'EML to Word' },
    ],
    relatedGuides: ['how-to-convert-eml-to-html'],
  },
  'eml-to-excel': {
    slug: 'eml-to-excel',
    name: 'Free EML to Excel Converter Online',
    category: 'Developer Tools',
    applicationCategory: 'UtilitiesApplication',
    description:
      'Create a genuine XLSX workbook with one email per row, filterable headers, message text and attachment names. No formulas are generated.',
    longTailKeywords: [
      'eml to excel',
      'convert eml to excel',
      'eml to excel online',
      'free eml to excel converter',
      'batch eml to excel',
    ],
    intro: [
      'Use this free EML to Excel converter online to turn saved email messages into a practical format for your next task. You do not need an email account connection or a desktop mail application to process an existing EML file.',
      'Create a genuine XLSX workbook with one email per row, filterable headers, message text and attachment names. No formulas are generated.',
      'Reading, preview and conversion take place locally in your browser. Your selected messages are not uploaded to Navorika. The preview removes sender-controlled links, images, scripts and styles before displaying the message.',
    ],
    formula: [
      {
        title: 'Read and decode the email',
        body: 'The MIME parser separates message headers, body parts and attachments, decoding common transfer encodings and declared character sets. EML stores email structure; a target document requires a separate representation.',
      },
      {
        title: 'Build the Excel output',
        body: 'Create a genuine XLSX workbook with one email per row, filterable headers, message text and attachment names. No formulas are generated.',
      },
    ],
    steps: [
      'Choose or drop 1–50 .eml files, no more than 20 MB combined. You can try the sample email first.',
      'Review the sender, recipients, date and safe email preview. Use the selector to inspect each message in a batch.',
      'Click Convert & download. Excel combines all selected emails into one XLSX workbook.',
      'Open the downloaded output and verify the message text and attachment handling before sharing. Keep the original EML for a complete source copy.',
    ],
    interpretation: [
      'Create a genuine XLSX workbook with one email per row, filterable headers, message text and attachment names. No formulas are generated.',
      'The displayed date is the date available in the source message, not a verified delivery record. Missing headers remain blank and are not invented.',
      'Batch output follows the selected file order. ZIP entries have numbered names to avoid overwriting messages with the same filename. Excel retains the source filename in its first column.',
    ],
    examples: [
      {
        title: 'Try a saved message',
        input:
          'An EML containing a subject, sender, recipient, date and meeting notes.',
        result: 'A Excel output containing readable email information.',
        note: 'Use Try sample email to test the workflow without selecting a personal file.',
      },
    ],
    limitations: [
      'At most 50 emails, 20 MB of source files per batch, 500,000 combined body characters and 200 attachments per email. Very large messages or batches can exceed available device memory.',
      'Excel limits a cell to 32,767 characters. Longer bodies are shortened and explicitly flagged in the Body truncated column. Other long fields are also limited to that cell size.',
      'Message text is exported without images or rich formatting. Attachments appear as names, not embedded files.',
      'The tool does not recover deleted emails, convert an entire mailbox or accept Outlook MSG as input. Password-protected or encrypted message content must be decrypted in an authorized mail application first.',
    ],
    faqs: [
      {
        question: 'Is this EML to Excel converter free?',
        answer:
          'Yes. You can use the converter without an account or payment, within the displayed batch and file-size limits.',
      },
      {
        question: 'Are my emails uploaded?',
        answer:
          'No. Selected EML files are parsed and converted in this browser tab. Clear files to remove the selected messages from the tool, or close the tab.',
      },
      {
        question: 'Can I convert multiple EML files to Excel?',
        answer:
          'Yes. Select up to 50 emails, with no more than 20 MB combined. They become rows in one XLSX workbook.',
      },
      {
        question: 'What happens to attachments?',
        answer:
          'Only attachment names are included. To retain the actual attachment files in an email container, use EML to MSG or keep the original EML.',
      },
      {
        question: 'Will the output look exactly like the original email?',
        answer:
          'Excel limits a cell to 32,767 characters. Longer bodies are shortened and explicitly flagged in the Body truncated column. Other long fields are also limited to that cell size.',
      },
    ],
    relatedTools: [
      { slug: 'eml-to-pdf', name: 'EML to PDF' },
      { slug: 'eml-to-msg', name: 'EML to MSG' },
      { slug: 'eml-to-html', name: 'EML to HTML' },
      { slug: 'eml-to-word', name: 'EML to Word' },
    ],
    relatedGuides: ['how-to-convert-eml-to-excel'],
  },
  'eml-to-word': {
    slug: 'eml-to-word',
    name: 'Free EML to Word Converter Online',
    category: 'Developer Tools',
    applicationCategory: 'UtilitiesApplication',
    description:
      'Create an editable DOCX document with email headers, readable message text and attachment names. Original email styling and images are omitted.',
    longTailKeywords: [
      'eml to word',
      'convert eml to word',
      'eml to word online',
      'free eml to word converter',
      'batch eml to word',
    ],
    intro: [
      'Use this free EML to Word converter online to turn saved email messages into a practical format for your next task. You do not need an email account connection or a desktop mail application to process an existing EML file.',
      'Create an editable DOCX document with email headers, readable message text and attachment names. Original email styling and images are omitted.',
      'Reading, preview and conversion take place locally in your browser. Your selected messages are not uploaded to Navorika. The preview removes sender-controlled links, images, scripts and styles before displaying the message.',
    ],
    formula: [
      {
        title: 'Read and decode the email',
        body: 'The MIME parser separates message headers, body parts and attachments, decoding common transfer encodings and declared character sets. EML stores email structure; a target document requires a separate representation.',
      },
      {
        title: 'Build the Word output',
        body: 'Create an editable DOCX document with email headers, readable message text and attachment names. Original email styling and images are omitted.',
      },
    ],
    steps: [
      'Choose or drop 1–50 .eml files, no more than 20 MB combined. You can try the sample email first.',
      'Review the sender, recipients, date and safe email preview. Use the selector to inspect each message in a batch.',
      'Click Convert & download. A single email downloads as Word; multiple emails download as separate files in a ZIP.',
      'Open the downloaded output and verify the message text and attachment handling before sharing. Keep the original EML for a complete source copy.',
    ],
    interpretation: [
      'Create an editable DOCX document with email headers, readable message text and attachment names. Original email styling and images are omitted.',
      'The displayed date is the date available in the source message, not a verified delivery record. Missing headers remain blank and are not invented.',
      'Batch output follows the selected file order. ZIP entries have numbered names to avoid overwriting messages with the same filename. Excel retains the source filename in its first column.',
    ],
    examples: [
      {
        title: 'Try a saved message',
        input:
          'An EML containing a subject, sender, recipient, date and meeting notes.',
        result: 'A Word output containing readable email information.',
        note: 'Use Try sample email to test the workflow without selecting a personal file.',
      },
    ],
    limitations: [
      'At most 50 emails, 20 MB of source files per batch, 500,000 combined body characters and 200 attachments per email. Very large messages or batches can exceed available device memory.',
      'DOCX contains editable text, not the original HTML design. Tables become readable text and images are omitted.',
      'Attachments are listed by name. Their file contents, macros, digital signatures and executable behavior are not inserted into the document.',
      'The tool does not recover deleted emails, convert an entire mailbox or accept Outlook MSG as input. Password-protected or encrypted message content must be decrypted in an authorized mail application first.',
    ],
    faqs: [
      {
        question: 'Is this EML to Word converter free?',
        answer:
          'Yes. You can use the converter without an account or payment, within the displayed batch and file-size limits.',
      },
      {
        question: 'Are my emails uploaded?',
        answer:
          'No. Selected EML files are parsed and converted in this browser tab. Clear files to remove the selected messages from the tool, or close the tab.',
      },
      {
        question: 'Can I convert multiple EML files to Word?',
        answer:
          'Yes. Select up to 50 emails, with no more than 20 MB combined. Each message becomes a separate output file in one ZIP download.',
      },
      {
        question: 'What happens to attachments?',
        answer:
          'Only attachment names are included. To retain the actual attachment files in an email container, use EML to MSG or keep the original EML.',
      },
      {
        question: 'Will the output look exactly like the original email?',
        answer:
          'DOCX contains editable text, not the original HTML design. Tables become readable text and images are omitted.',
      },
    ],
    relatedTools: [
      { slug: 'eml-to-pdf', name: 'EML to PDF' },
      { slug: 'eml-to-msg', name: 'EML to MSG' },
      { slug: 'eml-to-html', name: 'EML to HTML' },
      { slug: 'eml-to-excel', name: 'EML to Excel' },
    ],
    relatedGuides: ['how-to-convert-eml-to-word'],
  },
};
