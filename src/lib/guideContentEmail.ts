import type { GuideContent } from './guideContent';

export const emailGuideContent: Record<string, GuideContent> = {
  'how-to-convert-eml-to-pdf': {
    intro:
      'Convert saved EML messages to PDF using a free browser-based workflow. This guide explains the steps, what the output includes and what to check before you share it. An EML file is a saved email message. It can contain a sender, recipients, a subject, dates, message text, an HTML alternative and attachments inside a MIME structure. Converting that file changes how you can use its contents; it does not reconnect to the mailbox or retrieve missing messages. Start with a copy of the original EML and keep that source after conversion, especially when the message contains attachments or information you may need to check later.',
    sections: [
      {
        title: 'When EML to PDF is useful',
        content:
          'PDF is a practical choice when you want a document that people can open without an email application. Common uses include sharing a customer conversation, adding a message to a project folder or keeping a readable copy of a booking confirmation. The PDF represents the message information on pages; it is not an active email and cannot be replied to as though it were still inside a mailbox. Navorika creates a simple text layout with visible headers and attachment names. This favors readability over reproducing the original newsletter design. If the original contains important diagrams, signatures presented as images or attached documents, keep those separately or retain the EML as well.',
      },
      {
        title: 'Before you choose a file',
        content:
          'Locate the saved .eml message on your device. If your mail application offers a download or save-message command, use that to obtain the original message rather than copying the visible text into a renamed file. The command name depends on the application and version. A mailbox export such as MBOX or PST is different from an individual EML message and cannot be selected directly in these tools. For a first test, choose one ordinary message with a known subject and a short body. You can also use Try sample email to see how the tool works without selecting a private message. Compare the preview against a source you understand before processing a larger batch.',
      },
      {
        title: 'How to convert EML to PDF online',
        content:
          'Open the [Free EML to PDF Converter Online](/tools/eml-to-pdf). Choose or drop the saved messages and wait for the local parser to finish. Select a message in the preview list if you have added several files. Confirm that the subject, addresses and body are the ones you intended to convert, then click Convert & download PDF. One email produces one PDF. A batch produces a ZIP containing a separate PDF for each email, with numbered filenames to avoid overwriting messages that share the same source name. Extract the ZIP before opening or sharing individual documents. The selected file order controls the download order; the converter does not sort the messages by conversation or date.',
      },
      {
        title: 'Searchable text and languages',
        content:
          'For Western European text supported by the standard PDF font encoding, the output contains selectable text. Try searching for a distinctive phrase and copying a short paragraph into a text editor to confirm that the result works for your needs. Other scripts can use image rendering, which preserves a readable appearance but does not create searchable text or an OCR layer. A PDF that opens correctly is therefore not always suitable for automatic text indexing. If you need editable international text, consider [EML to Word](/tools/eml-to-word). For a spreadsheet index of subjects and senders, [EML to Excel](/tools/eml-to-excel) may be more useful than searching individual PDFs.',
      },
      {
        title: 'Attachments and visual differences',
        content:
          'The PDF lists attachment filenames, but does not embed the attachment bytes or convert the attached files into extra PDF pages. A listed invoice.pdf is still a reference to the source attachment, not a second PDF contained in your download. Email images, complex HTML tables and original styling are omitted from this readable text export. The safe HTML preview is useful for understanding the message but is not a pixel-for-pixel PDF preview. For basic HTML formatting use [EML to HTML](/tools/eml-to-html); for an email container that retains attachment files use [EML to MSG](/tools/eml-to-msg). Neither choice should lead you to discard the original before checking the result.',
      },
      {
        title: 'A practical project-record example',
        content:
          'Suppose a supplier sends a delivery confirmation with a short message and a drawing attached. Converting the email to PDF gives you a readable cover record showing the subject, sender and discussion. It does not give you the drawing itself. Store the original EML and the actual drawing in the same project folder, then use a clear filename for the derivative PDF. If the discussion spans several messages, export each relevant email and inspect the sequence. A quoted reply may repeat earlier text, so several exported PDFs can contain overlapping content. Avoid counting repeated quoted paragraphs as separate new instructions when reviewing a conversation.',
      },
      {
        title: 'Privacy and safe email previews',
        content:
          'Navorika reads the selected files inside your browser tab. The converter does not upload the source emails, connect to your account or ask for your mailbox password. Its safe preview removes active content, external links, sender styles and image sources. That prevents an email tracking image from being requested during preview. This is a conversion tool, not a scanner that declares an email trustworthy. A familiar display name does not authenticate a sender. Keep your browser up to date and treat attachments from unknown senders with care. Clear files removes the current selection from the tool; downloaded output remains on your device until you remove it.',
      },
      {
        title: 'Batch limits and troubleshooting',
        content:
          'The tools accept up to 50 EML files with a combined source size of 20 MB. Each message is limited to 500,000 combined text and HTML body characters and 200 attachments. A small text email and a message carrying photographs can consume very different amounts of memory. If a conversion fails, first retry one message rather than repeatedly submitting the entire batch. Check that the filename ends in .eml and that the contents really are an email. Renaming a PDF, MSG or mailbox archive does not change its format. An error names the message that could not be read. Encrypted email bodies need to be opened and decrypted using an authorized email application before an ordinary converter can read them.',
      },
      {
        title: 'Check the result before sharing',
        content:
          'Open the downloaded output in the application that will actually be used by its recipient. Check the subject, sender, recipient list and the date, then read the first and last paragraphs of the body. Look for accented characters, long lines, quoted replies and attachment names. A date copied from an email header is not proof of when a server received the message. A message converted successfully is also not proof that it is authentic. Keep your original EML alongside the derivative document when a complete record matters. If a workplace, archive or formal process specifies its own approved format, follow that requirement rather than assuming every converted document will be accepted.',
      },
    ],
    faqs: [
      {
        question: 'Does the PDF contain attachments?',
        answer:
          'No. It lists their filenames but does not embed the files or add their pages. Keep the EML or use MSG when the actual attachments must remain with the message.',
      },
      {
        question: 'Can I search all converted PDFs?',
        answer:
          'Western European text is searchable. Other scripts can be rendered as images and will not have a searchable text layer. Test the languages in your actual message before relying on indexing.',
      },
      {
        question: 'Can I convert multiple emails at once?',
        answer:
          'Yes. Select up to 50 EML files with no more than 20 MB combined. Excel creates one workbook; the other tools produce separate files in a ZIP.',
      },
      {
        question: 'Do I need to upload emails to Navorika?',
        answer:
          'No. File reading, safe preview and conversion run in your browser. You do not need to connect an email account or enter a mailbox password.',
      },
    ],
    summary:
      'Choose PDF when it matches the next task, check a sample output in the application you will use, and keep the original EML for a complete source copy. Review attachment handling and formatting limits before converting a larger batch.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'How to Convert EML to PDF: A Step-by-Step Guide',
      description:
        'A practical guide to converting EML to PDF, with batch steps, privacy details and output limitations.',
      author: {
        '@type': 'Organization',
        name: 'Navorika Team',
      },
      datePublished: '2026-11-11',
      dateModified: '2026-11-11',
    },
  },
  'how-to-convert-eml-to-msg': {
    intro:
      'Convert saved EML messages to MSG using a free browser-based workflow. This guide explains the steps, what the output includes and what to check before you share it. An EML file is a saved email message. It can contain a sender, recipients, a subject, dates, message text, an HTML alternative and attachments inside a MIME structure. Converting that file changes how you can use its contents; it does not reconnect to the mailbox or retrieve missing messages. Start with a copy of the original EML and keep that source after conversion, especially when the message contains attachments or information you may need to check later.',
    sections: [
      {
        title: 'EML and MSG are different formats',
        content:
          'EML is a MIME email message format widely used for saved messages. MSG is an Outlook item stored in a compound binary file with MAPI properties and separate recipient and attachment records. Changing report.eml to report.msg only changes the filename; it does not create those records. A real converter must parse the email and write the target structure. Navorika writes Unicode MSG output containing common message fields, a text body, safe HTML and attachment files. It is intended for saved-message interchange rather than recreating every feature of an Outlook mailbox. The result is a new representation of the source email, not the original native Outlook item.',
      },
      {
        title: 'Before you choose a file',
        content:
          'Locate the saved .eml message on your device. If your mail application offers a download or save-message command, use that to obtain the original message rather than copying the visible text into a renamed file. The command name depends on the application and version. A mailbox export such as MBOX or PST is different from an individual EML message and cannot be selected directly in these tools. For a first test, choose one ordinary message with a known subject and a short body. You can also use Try sample email to see how the tool works without selecting a private message. Compare the preview against a source you understand before processing a larger batch.',
      },
      {
        title: 'How to convert EML to MSG online',
        content:
          'Open the [Free EML to MSG Converter Online](/tools/eml-to-msg), then choose one saved EML or a batch. Review each message using the preview selector. Confirm the recipient list as well as the subject; Cc and Bcc may matter when a message is being kept as a record. Click Convert & download MSG for one email. Multiple selected messages produce separate MSG files inside a ZIP. Extract the ZIP and open a result in a compatible Outlook application or MSG reader. Product support for opening MSG varies by Outlook edition and platform, so test your actual recipient application before converting a large archive.',
      },
      {
        title: 'What is retained in the MSG',
        content:
          'The output includes available subject, sender, To, Cc, Bcc, date, message identifier and source header information. The converter uses Unicode properties for ordinary text and creates explicit recipient records rather than putting every address into one display string. Original attachment bytes are stored by value, with their filenames and content types. That includes a nested email attachment as a file rather than promoting it into the main message. Safe HTML is rebuilt without external images, links or active content. Message text is retained separately so a reader can use a plain-text view. Fields missing from the EML are not invented, and a Bcc field that was never present cannot be recovered.',
      },
      {
        title: 'What cannot be recreated',
        content:
          'An EML message does not necessarily contain the proprietary information used by Outlook for categories, flags, follow-up reminders, conversation grouping or calendar behavior. This converter does not reconstruct those features or promise that a meeting request will behave like a native Outlook appointment. It does not preserve a cryptographic signature as a valid signature over the rewritten message. Original signed or encrypted content needs its own appropriate verification workflow. For that reason, keep the original EML if authenticity, provenance or exact bytes matter. The MSG is useful for opening a message and its attachments in a compatible reader; it is not a substitute for a complete mailbox migration.',
      },
      {
        title: 'Attachments require a separate trust decision',
        content:
          'Because MSG output retains attachment bytes, an unsafe source attachment remains unsafe after conversion. The converter does not execute it or inspect it as a malware scanner would. Check the original sender and your organization’s normal attachment rules before opening downloaded attachments. A file extension shown in a friendly filename is not proof that the file is harmless. If your goal is only to share a readable copy of the discussion without carrying attached files, choose [EML to PDF](/tools/eml-to-pdf) or [EML to Word](/tools/eml-to-word) instead. Their output lists attachment names but does not contain the original attachment files.',
      },
      {
        title: 'Privacy and safe email previews',
        content:
          'Navorika reads the selected files inside your browser tab. The converter does not upload the source emails, connect to your account or ask for your mailbox password. Its safe preview removes active content, external links, sender styles and image sources. That prevents an email tracking image from being requested during preview. This is a conversion tool, not a scanner that declares an email trustworthy. A familiar display name does not authenticate a sender. Keep your browser up to date and treat attachments from unknown senders with care. Clear files removes the current selection from the tool; downloaded output remains on your device until you remove it.',
      },
      {
        title: 'Batch limits and troubleshooting',
        content:
          'The tools accept up to 50 EML files with a combined source size of 20 MB. Each message is limited to 500,000 combined text and HTML body characters and 200 attachments. A small text email and a message carrying photographs can consume very different amounts of memory. If a conversion fails, first retry one message rather than repeatedly submitting the entire batch. Check that the filename ends in .eml and that the contents really are an email. Renaming a PDF, MSG or mailbox archive does not change its format. An error names the message that could not be read. Encrypted email bodies need to be opened and decrypted using an authorized email application before an ordinary converter can read them.',
      },
      {
        title: 'Check the result before sharing',
        content:
          'Open the downloaded output in the application that will actually be used by its recipient. Check the subject, sender, recipient list and the date, then read the first and last paragraphs of the body. Look for accented characters, long lines, quoted replies and attachment names. A date copied from an email header is not proof of when a server received the message. A message converted successfully is also not proof that it is authentic. Keep your original EML alongside the derivative document when a complete record matters. If a workplace, archive or formal process specifies its own approved format, follow that requirement rather than assuming every converted document will be accepted.',
      },
    ],
    faqs: [
      {
        question: 'Is renaming EML to MSG enough?',
        answer:
          'No. MSG requires a compound binary container and MAPI records. The converter writes a new MSG structure from the parsed EML information.',
      },
      {
        question: 'Will it recreate Outlook categories and flags?',
        answer:
          'No. Proprietary Outlook metadata and calendar behavior are not reconstructed. Verify the result in the application you intend to use, and keep the original EML.',
      },
      {
        question: 'Can I convert multiple emails at once?',
        answer:
          'Yes. Select up to 50 EML files with no more than 20 MB combined. Excel creates one workbook; the other tools produce separate files in a ZIP.',
      },
      {
        question: 'Do I need to upload emails to Navorika?',
        answer:
          'No. File reading, safe preview and conversion run in your browser. You do not need to connect an email account or enter a mailbox password.',
      },
    ],
    summary:
      'Choose MSG when it matches the next task, check a sample output in the application you will use, and keep the original EML for a complete source copy. Review attachment handling and formatting limits before converting a larger batch.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'How to Convert EML to MSG: A Step-by-Step Guide',
      description:
        'A practical guide to converting EML to MSG, with batch steps, privacy details and output limitations.',
      author: {
        '@type': 'Organization',
        name: 'Navorika Team',
      },
      datePublished: '2026-11-11',
      dateModified: '2026-11-11',
    },
  },
  'how-to-convert-eml-to-html': {
    intro:
      'Convert saved EML messages to HTML using a free browser-based workflow. This guide explains the steps, what the output includes and what to check before you share it. An EML file is a saved email message. It can contain a sender, recipients, a subject, dates, message text, an HTML alternative and attachments inside a MIME structure. Converting that file changes how you can use its contents; it does not reconnect to the mailbox or retrieve missing messages. Start with a copy of the original EML and keep that source after conversion, especially when the message contains attachments or information you may need to check later.',
    sections: [
      {
        title: 'What an HTML email export contains',
        content:
          'HTML is useful when you want a browser-readable copy with basic structure rather than a fixed page layout. The export can retain paragraphs, emphasis, headings, lists and simple tables from the message body. Navorika adds the email headers at the top and an attachment-name list at the end. It removes sender styles, scripts, forms, links and images rather than trying to make an untrusted email behave like a complete website. The resulting document is self-contained and can be opened in a browser without connecting to the original sender’s website. It is a simplified document, so an elaborate marketing email can look different from the version in an email application.',
      },
      {
        title: 'Before you choose a file',
        content:
          'Locate the saved .eml message on your device. If your mail application offers a download or save-message command, use that to obtain the original message rather than copying the visible text into a renamed file. The command name depends on the application and version. A mailbox export such as MBOX or PST is different from an individual EML message and cannot be selected directly in these tools. For a first test, choose one ordinary message with a known subject and a short body. You can also use Try sample email to see how the tool works without selecting a private message. Compare the preview against a source you understand before processing a larger batch.',
      },
      {
        title: 'How to convert EML to HTML online',
        content:
          'Open the [Free EML to HTML Converter Online](/tools/eml-to-html) and select the saved .eml messages. Use the sample first if you only want to explore the layout. After reading the preview, click Convert & download HTML. One source message produces an .html file; a batch produces numbered HTML files inside a ZIP. Extract the ZIP, then open a file in your browser. Its title comes from the email subject, and visible headers help identify the message without relying only on the filename. Review the complete body before sending the HTML file to another person, especially when your source contains confidential quoted replies.',
      },
      {
        title: 'Why remote images and links disappear',
        content:
          'Emails can reference resources on a sender-controlled server. Loading a remote image can reveal that a message was opened, and active links can lead to pages unrelated to your conversion task. The safe export removes these features, including CSS that could request external resources. It also includes a restrictive content policy to block resources if an unexpected reference remains. This means a logo, signature image or tracking pixel will not appear in the exported HTML. The missing image is an intentional limitation rather than an incomplete download. If an image contains essential information, obtain it from a trusted source and keep it separately; do not assume the simplified text export includes it.',
      },
      {
        title: 'HTML export versus a website template',
        content:
          'Converting an existing EML into HTML does not create a reusable marketing campaign template. Email templates often contain client-specific layout rules, hosted assets and responsive CSS. Those styles are removed in this privacy-focused export. The result suits reading, reviewing and copying ordinary content, but it is not designed to be imported into a newsletter platform as a finished campaign. If you plan to reuse any message content, check that you have permission and remove private addresses and conversation history. Do not place a converted private email on a public web server simply because it now has an HTML extension. The format changes; the sensitivity of the content does not.',
      },
      {
        title: 'Choosing between HTML, PDF and Word',
        content:
          'Choose HTML when a basic table or list should remain recognizable in a browser and fixed page breaks are unnecessary. Choose [EML to PDF](/tools/eml-to-pdf) for a document intended to be read as pages. Choose [EML to Word](/tools/eml-to-word) when you need editable message text in a DOCX file. The PDF and Word converters use a text layout and do not reproduce HTML images or styling. Choose [EML to Excel](/tools/eml-to-excel) for an index of many messages. All of these outputs list attachment names; use the original EML or MSG output when the actual attachments need to travel with the message.',
      },
      {
        title: 'Privacy and safe email previews',
        content:
          'Navorika reads the selected files inside your browser tab. The converter does not upload the source emails, connect to your account or ask for your mailbox password. Its safe preview removes active content, external links, sender styles and image sources. That prevents an email tracking image from being requested during preview. This is a conversion tool, not a scanner that declares an email trustworthy. A familiar display name does not authenticate a sender. Keep your browser up to date and treat attachments from unknown senders with care. Clear files removes the current selection from the tool; downloaded output remains on your device until you remove it.',
      },
      {
        title: 'Batch limits and troubleshooting',
        content:
          'The tools accept up to 50 EML files with a combined source size of 20 MB. Each message is limited to 500,000 combined text and HTML body characters and 200 attachments. A small text email and a message carrying photographs can consume very different amounts of memory. If a conversion fails, first retry one message rather than repeatedly submitting the entire batch. Check that the filename ends in .eml and that the contents really are an email. Renaming a PDF, MSG or mailbox archive does not change its format. An error names the message that could not be read. Encrypted email bodies need to be opened and decrypted using an authorized email application before an ordinary converter can read them.',
      },
      {
        title: 'Check the result before sharing',
        content:
          'Open the downloaded output in the application that will actually be used by its recipient. Check the subject, sender, recipient list and the date, then read the first and last paragraphs of the body. Look for accented characters, long lines, quoted replies and attachment names. A date copied from an email header is not proof of when a server received the message. A message converted successfully is also not proof that it is authentic. Keep your original EML alongside the derivative document when a complete record matters. If a workplace, archive or formal process specifies its own approved format, follow that requirement rather than assuming every converted document will be accepted.',
      },
    ],
    faqs: [
      {
        question: 'Can the exported HTML load a tracking image?',
        answer:
          'The converter removes image sources and active content and includes a restrictive resource policy. Original email images and hosted styles are not reproduced.',
      },
      {
        question: 'Can I use the result as a newsletter template?',
        answer:
          'It is designed as a readable document, not a production email template. Sender CSS, hosted assets and active links are removed, so campaign layouts are not preserved.',
      },
      {
        question: 'Can I convert multiple emails at once?',
        answer:
          'Yes. Select up to 50 EML files with no more than 20 MB combined. Excel creates one workbook; the other tools produce separate files in a ZIP.',
      },
      {
        question: 'Do I need to upload emails to Navorika?',
        answer:
          'No. File reading, safe preview and conversion run in your browser. You do not need to connect an email account or enter a mailbox password.',
      },
    ],
    summary:
      'Choose HTML when it matches the next task, check a sample output in the application you will use, and keep the original EML for a complete source copy. Review attachment handling and formatting limits before converting a larger batch.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'How to Convert EML to HTML: A Step-by-Step Guide',
      description:
        'A practical guide to converting EML to HTML, with batch steps, privacy details and output limitations.',
      author: {
        '@type': 'Organization',
        name: 'Navorika Team',
      },
      datePublished: '2026-11-11',
      dateModified: '2026-11-11',
    },
  },
  'how-to-convert-eml-to-excel': {
    intro:
      'Convert saved EML messages to Excel using a free browser-based workflow. This guide explains the steps, what the output includes and what to check before you share it. An EML file is a saved email message. It can contain a sender, recipients, a subject, dates, message text, an HTML alternative and attachments inside a MIME structure. Converting that file changes how you can use its contents; it does not reconnect to the mailbox or retrieve missing messages. Start with a copy of the original EML and keep that source after conversion, especially when the message contains attachments or information you may need to check later.',
    sections: [
      {
        title: 'What EML to Excel means',
        content:
          'An Excel export turns each email into a row that you can sort, filter or review alongside other messages. It is useful for a small correspondence index, a customer-support review or a list of supplier responses. It does not turn the contents of an attached invoice into accounting entries, and it does not read a spreadsheet attachment and merge that attachment’s rows into your workbook. Navorika creates an actual XLSX package rather than an HTML table renamed with an Excel extension. The workbook contains text columns for the original filename, subject, addresses, date, message identifier, body and attachment names, plus an explicit body-truncation indicator.',
      },
      {
        title: 'Before you choose a file',
        content:
          'Locate the saved .eml message on your device. If your mail application offers a download or save-message command, use that to obtain the original message rather than copying the visible text into a renamed file. The command name depends on the application and version. A mailbox export such as MBOX or PST is different from an individual EML message and cannot be selected directly in these tools. For a first test, choose one ordinary message with a known subject and a short body. You can also use Try sample email to see how the tool works without selecting a private message. Compare the preview against a source you understand before processing a larger batch.',
      },
      {
        title: 'How to convert EML to Excel online',
        content:
          'Open the [Free EML to Excel Converter Online](/tools/eml-to-excel). Select the messages you want to include, within the 50-file and 20 MB combined limit. Review a few subjects and sender addresses in the preview, then click Convert & download XLSX. The output is one workbook containing one email per row. Open it in Excel or another XLSX-compatible application and use the header filters to narrow the list. The source filename helps you return to the original message when you need to inspect a particular record. Keep a copy of the workbook before making edits, particularly if several people will annotate or categorize the rows.',
      },
      {
        title: 'Understanding the spreadsheet columns',
        content:
          'Subject, From, To, Cc and Bcc contain the corresponding available message values. Multiple recipients are shown in the same field with separators, not expanded into separate rows. Date is stored as text so that Excel does not silently reinterpret it using regional date settings. Message-ID can help distinguish messages that share the same subject, although it should not be treated as verified proof of authenticity. Body contains readable message text, including quoted replies when present. Attachment Names is a list of filenames, not clickable embedded files. Source file records the input filename. Body truncated tells you whether the full text was too long for a single Excel cell.',
      },
      {
        title: 'Cell limits and formula safety',
        content:
          'Excel permits at most 32,767 characters in one cell. The converter shortens a longer body to this limit and marks the Body truncated column. Other unusually long fields are also capped at the cell limit. Use [EML to Word](/tools/eml-to-word) or keep the original source when full message text is important. Every value is written as a literal string rather than a formula. A subject beginning with an equals sign therefore remains subject text in the XLSX. If you later export the workbook to CSV, be aware that another application may interpret text differently when that CSV is reopened. Recheck your workflow before distributing data from unknown senders.',
      },
      {
        title: 'Filtering and reviewing a small email batch',
        content:
          'For example, select twenty saved supplier replies and create a workbook. Filter the From column to review a specific supplier, then search the Subject column for a project reference. Add your own review-status column in Excel instead of changing the source message text. Dates remain strings, so a true chronological sort may require a separate normalized date column in your spreadsheet application. Duplicate filenames or subjects do not mean the messages are duplicates. Compare source files, message identifiers and bodies before deleting anything. This tool does not deduplicate, categorize or infer commitments from the email text; those decisions remain part of your review.',
      },
      {
        title: 'Privacy and safe email previews',
        content:
          'Navorika reads the selected files inside your browser tab. The converter does not upload the source emails, connect to your account or ask for your mailbox password. Its safe preview removes active content, external links, sender styles and image sources. That prevents an email tracking image from being requested during preview. This is a conversion tool, not a scanner that declares an email trustworthy. A familiar display name does not authenticate a sender. Keep your browser up to date and treat attachments from unknown senders with care. Clear files removes the current selection from the tool; downloaded output remains on your device until you remove it.',
      },
      {
        title: 'Batch limits and troubleshooting',
        content:
          'The tools accept up to 50 EML files with a combined source size of 20 MB. Each message is limited to 500,000 combined text and HTML body characters and 200 attachments. A small text email and a message carrying photographs can consume very different amounts of memory. If a conversion fails, first retry one message rather than repeatedly submitting the entire batch. Check that the filename ends in .eml and that the contents really are an email. Renaming a PDF, MSG or mailbox archive does not change its format. An error names the message that could not be read. Encrypted email bodies need to be opened and decrypted using an authorized email application before an ordinary converter can read them.',
      },
      {
        title: 'Check the result before sharing',
        content:
          'Open the downloaded output in the application that will actually be used by its recipient. Check the subject, sender, recipient list and the date, then read the first and last paragraphs of the body. Look for accented characters, long lines, quoted replies and attachment names. A date copied from an email header is not proof of when a server received the message. A message converted successfully is also not proof that it is authentic. Keep your original EML alongside the derivative document when a complete record matters. If a workplace, archive or formal process specifies its own approved format, follow that requirement rather than assuming every converted document will be accepted.',
      },
    ],
    faqs: [
      {
        question: 'Does the tool convert attached spreadsheets?',
        answer:
          'No. It exports message fields into rows. Attachment names appear in a text column; attachment contents are not imported.',
      },
      {
        question: 'Why is a body marked as truncated?',
        answer:
          'The body exceeds the 32,767-character Excel cell limit. Use DOCX or the original EML when you need the full text, and check the explicit truncation indicator before reviewing a batch.',
      },
      {
        question: 'Can I convert multiple emails at once?',
        answer:
          'Yes. Select up to 50 EML files with no more than 20 MB combined. Excel creates one workbook; the other tools produce separate files in a ZIP.',
      },
      {
        question: 'Do I need to upload emails to Navorika?',
        answer:
          'No. File reading, safe preview and conversion run in your browser. You do not need to connect an email account or enter a mailbox password.',
      },
    ],
    summary:
      'Choose Excel when it matches the next task, check a sample output in the application you will use, and keep the original EML for a complete source copy. Review attachment handling and formatting limits before converting a larger batch.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'How to Convert EML to Excel: A Step-by-Step Guide',
      description:
        'A practical guide to converting EML to Excel, with batch steps, privacy details and output limitations.',
      author: {
        '@type': 'Organization',
        name: 'Navorika Team',
      },
      datePublished: '2026-11-11',
      dateModified: '2026-11-11',
    },
  },
  'how-to-convert-eml-to-word': {
    intro:
      'Convert saved EML messages to Word using a free browser-based workflow. This guide explains the steps, what the output includes and what to check before you share it. An EML file is a saved email message. It can contain a sender, recipients, a subject, dates, message text, an HTML alternative and attachments inside a MIME structure. Converting that file changes how you can use its contents; it does not reconnect to the mailbox or retrieve missing messages. Start with a copy of the original EML and keep that source after conversion, especially when the message contains attachments or information you may need to check later.',
    sections: [
      {
        title: 'Why convert EML to Word',
        content:
          'Word is useful when the next step involves editing or adding commentary rather than preserving a fixed visual copy. You might want to quote a customer’s message in a report, prepare meeting notes or assemble a readable draft from saved correspondence. Navorika creates a real DOCX file with editable message text and email headers. It does not create the older binary DOC format or merely rename an HTML file. Because the export is editable, it should not be presented as an unchanged original message after someone has modified it. Keep the EML source and clearly separate original correspondence from later annotations or rewritten extracts.',
      },
      {
        title: 'Before you choose a file',
        content:
          'Locate the saved .eml message on your device. If your mail application offers a download or save-message command, use that to obtain the original message rather than copying the visible text into a renamed file. The command name depends on the application and version. A mailbox export such as MBOX or PST is different from an individual EML message and cannot be selected directly in these tools. For a first test, choose one ordinary message with a known subject and a short body. You can also use Try sample email to see how the tool works without selecting a private message. Compare the preview against a source you understand before processing a larger batch.',
      },
      {
        title: 'How to convert EML to Word online',
        content:
          'Open the [Free EML to Word Converter Online](/tools/eml-to-word). Choose one saved message or a batch, then use the preview selector to check the subject and message contents. Click Convert & download DOCX. One email downloads directly as a Word document; a batch becomes a ZIP of separate numbered DOCX files. Extract the ZIP before opening the documents. Use Microsoft Word or another DOCX-compatible editor to inspect a result before distributing it. Check the final paragraphs as well as the beginning, because long quoted conversations can extend across several pages and are easy to overlook when reviewing only the preview window.',
      },
      {
        title: 'What remains editable in DOCX',
        content:
          'The converter writes the subject and available address and date fields as text, followed by the readable message body and an attachment-name list. The output uses ordinary paragraphs and text runs, so you can select a sentence, change wording or add notes using a compatible editor. The original sender’s HTML styling is not recreated. A rich email table can become readable text, and inline images are not inserted. Font appearance and page breaks can vary between editors. If preserving basic table structure is more important than editing in Word, try [EML to HTML](/tools/eml-to-html) and check whether its simplified HTML output meets your needs.',
      },
      {
        title: 'Attachments are references, not embedded documents',
        content:
          'A message may mention a document in its body and also carry that document as a separate MIME attachment. The Word output lists the attachment filename but does not insert its pages or file bytes into the DOCX. Converting an EML with contract.pdf attached therefore does not convert the contract itself to editable Word text. Export or save that attachment using a trusted email application if you need it separately, and choose a tool appropriate to the attachment’s actual format. Use [EML to MSG](/tools/eml-to-msg) when the requirement is to keep attachments inside a compatible saved-message container rather than to create a report document.',
      },
      {
        title: 'A practical editing workflow',
        content:
          'Suppose you are preparing a service-review report using a saved distributor email. Convert the message to DOCX, retain an untouched copy of that export and make a second working copy for the report. Remove unrelated quoted replies and personal addresses from the working copy only when they are unnecessary for its purpose. Mark your own observations clearly instead of blending them into the sender’s wording. Before sharing the report, check that edits have not changed a date, quantity or instruction. A convenient editable format can make accidental changes harder to notice, so return to the original EML whenever an exact statement or attachment reference needs confirmation.',
      },
      {
        title: 'Privacy and safe email previews',
        content:
          'Navorika reads the selected files inside your browser tab. The converter does not upload the source emails, connect to your account or ask for your mailbox password. Its safe preview removes active content, external links, sender styles and image sources. That prevents an email tracking image from being requested during preview. This is a conversion tool, not a scanner that declares an email trustworthy. A familiar display name does not authenticate a sender. Keep your browser up to date and treat attachments from unknown senders with care. Clear files removes the current selection from the tool; downloaded output remains on your device until you remove it.',
      },
      {
        title: 'Batch limits and troubleshooting',
        content:
          'The tools accept up to 50 EML files with a combined source size of 20 MB. Each message is limited to 500,000 combined text and HTML body characters and 200 attachments. A small text email and a message carrying photographs can consume very different amounts of memory. If a conversion fails, first retry one message rather than repeatedly submitting the entire batch. Check that the filename ends in .eml and that the contents really are an email. Renaming a PDF, MSG or mailbox archive does not change its format. An error names the message that could not be read. Encrypted email bodies need to be opened and decrypted using an authorized email application before an ordinary converter can read them.',
      },
      {
        title: 'Check the result before sharing',
        content:
          'Open the downloaded output in the application that will actually be used by its recipient. Check the subject, sender, recipient list and the date, then read the first and last paragraphs of the body. Look for accented characters, long lines, quoted replies and attachment names. A date copied from an email header is not proof of when a server received the message. A message converted successfully is also not proof that it is authentic. Keep your original EML alongside the derivative document when a complete record matters. If a workplace, archive or formal process specifies its own approved format, follow that requirement rather than assuming every converted document will be accepted.',
      },
    ],
    faqs: [
      {
        question: 'Is the output DOC or DOCX?',
        answer:
          'It is a genuine DOCX package. The older binary DOC format is not produced.',
      },
      {
        question: 'Will it look exactly like the original email?',
        answer:
          'No. It creates an editable text layout. Email styling, images and attachment contents are omitted; review the output before using it in a report.',
      },
      {
        question: 'Can I convert multiple emails at once?',
        answer:
          'Yes. Select up to 50 EML files with no more than 20 MB combined. Excel creates one workbook; the other tools produce separate files in a ZIP.',
      },
      {
        question: 'Do I need to upload emails to Navorika?',
        answer:
          'No. File reading, safe preview and conversion run in your browser. You do not need to connect an email account or enter a mailbox password.',
      },
    ],
    summary:
      'Choose Word when it matches the next task, check a sample output in the application you will use, and keep the original EML for a complete source copy. Review attachment handling and formatting limits before converting a larger batch.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'How to Convert EML to Word: A Step-by-Step Guide',
      description:
        'A practical guide to converting EML to Word, with batch steps, privacy details and output limitations.',
      author: {
        '@type': 'Organization',
        name: 'Navorika Team',
      },
      datePublished: '2026-11-11',
      dateModified: '2026-11-11',
    },
  },
};
