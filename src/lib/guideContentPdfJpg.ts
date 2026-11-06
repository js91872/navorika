import type { GuideContent } from './guideContent';

export const pdfJpgGuideContent: Record<string, GuideContent> = {
  'how-to-convert-pdf-to-jpg': {
    intro: 'Need a JPG from a PDF for a website, slide, email, online form, or listing? A PDF can hold text, vector drawings, and multiple pages, while a JPG is a single rectangular image. Converting means rendering a chosen page into pixels and encoding those pixels as a JPEG image. This guide explains practical workflows, correct resolution settings, when a ZIP of all pages makes sense, and how to avoid blurred text, enormous files, missing pages, or accidental sharing of confidential documents. Use [PDF to JPG](/tools/pdf-to-jpg) for one selected page or [PDF to JPG – All Pages](/tools/pdf-to-jpg-all-pages) for a ZIP containing separate images.',
    sections: [
      {title:'How to convert one PDF page to JPG online',content:`First, open [Navorika PDF to JPG](/tools/pdf-to-jpg). Choose the PDF from your device. The browser reads the document and identifies its page count. Enter the page number you want to convert, select a rendering resolution, and set JPEG quality. Render the page and inspect the preview before downloading.

This is useful when an online application asks for a JPG rather than a PDF, or when only a diagram or cover page is needed. A twenty-page PDF is not one JPG: each PDF page requires a separate image. Do not assume a converter has exported all pages unless it explicitly tells you so.

For an important document, check the output edges, small print, dates, stamps, and any faint signature. Never replace your only original PDF with the flattened JPG.`},
      {title:'How to convert every PDF page to a ZIP of JPG images',content:`Use [PDF to JPG – All Pages](/tools/pdf-to-jpg-all-pages) when you need every page as an individual image. Choose a PDF of no more than 40 pages and 40 MB, select scale and JPEG quality, then download the resulting ZIP. The images are named in page order (page-001.jpg, page-002.jpg, and so on). Unzip the file on Windows, macOS, or your phone.

A ZIP is an archive, not a single combined image. This avoids creating an extremely tall JPG with unreadable text. For a client who only wants to see the first page, use the single-page tool instead. For a PDF with more than 40 pages, split it first and export smaller parts; limits protect browsers from running out of memory.`},
      {title:'Choose output resolution and DPI carefully',content:`PDF pages are typically specified in points, with 72 points per inch. A US Letter page is 612 by 792 points; at a 1× rendering scale that creates roughly 612 × 792 pixels. At 2× it creates about 1224 × 1584 pixels, because each axis doubles, and total pixel count rises fourfold.

The scale is an image-rendering control, not a guarantee of print-ready 300 DPI. For a standard 8.5 × 11 inch print at 300 pixels per inch, the target is approximately 2550 × 3300 pixels. An ordinary 2× render does not reach that. For email attachments and web previews, 1.5× can be practical. For small type or line drawings, try a larger output when the browser supports it.

Inspect the actual pixel dimensions and intended display size rather than relying on a DPI label alone. Higher pixel counts increase download size and memory usage.`},
      {title:'JPEG quality versus sharpness: what each setting controls',content:`Rendering scale determines how many pixels the page is drawn into. JPEG quality controls how aggressively those pixels are compressed. They are different controls: raising JPEG quality does not recover fine text that was rendered at too few pixels. Equally, a very large rendering can still show compression halos around tiny letters at low quality.

For photo-heavy pages, experiment with JPEG quality around 80–90 and compare the preview. For small text, engineering drawings, tables, and line art, PNG may preserve hard edges more accurately because it uses lossless compression. Use [PDF to Image](/tools/pdf-to-image) and choose PNG for that case.

JPG always uses lossy compression. White margins can be cropped or filled, but a JPG cannot preserve PDF selectable text, live links, layers, searchable structure, or interactive forms.`},
      {title:'PDF to JPG on Windows, Mac, iPhone, and Android',content:`The browser method works without installing software on devices that support modern JavaScript and canvas rendering. On Windows, select the PDF from File Explorer; on macOS, select it from Finder; on Android or iPhone, pick the file from Files or your file provider. The controls and download behavior may differ between browsers, particularly when saving a ZIP.

On macOS, Preview can export a selected PDF page as JPEG using File > Export when the correct page is selected. For Windows and mobile, use a trusted converter, and confirm whether it exports the selected page or a complete batch. Never upload private contracts or identity documents to an unknown site merely to change the format.`},
      {title:'Troubleshooting blurry output, black backgrounds, and large PDFs',content:`**Blurry JPG:** Raise rendering scale before increasing JPEG quality. Zoom in and inspect text after saving.

**Black or strange background:** JPEG cannot contain transparency; render against white. This tool uses an opaque white background.

**Very large ZIP:** Lower scale or JPEG quality; split the PDF into smaller sections. Photographic and scanned pages can produce larger images than vector-based documents.

**Password-protected file:** The browser might be unable to open an encrypted PDF. Unlock it using authorized software before conversion.

**Pages out of order:** Check filenames. Numbered ZIP entries retain original page order.

**Text not selectable:** Expected. The output is a raster image, not an OCR or editable-text document.`},
      {title:'Which format should you use instead of JPG?',content:`Choose **JPG** for photographic previews, website imagery, and applications requiring JPEG. Choose **PNG** for logos, screenshots of text, diagrams, crisp line art, or when exact pixel fidelity matters. Keep **PDF** when you need searchable selectable text, accessible structure, signatures, links, multipage printing, or document review. Choose separate images in a **ZIP** when you need the complete PDF as individual JPG files.

For a website that needs only the cover, exporting every page is wasteful. For a customer requiring all ten pages as JPG files, exporting only the first page is incomplete. Match the workflow to the recipient’s actual requirements.`},
    ],
    faqs: [
      {question:'Can I convert a PDF to JPG without uploading it?',answer:'Yes. Navorika renders the selected PDF in your browser using PDF.js and canvas. No PDF upload is required by the conversion workflow.'},
      {question:'Can I convert all pages of a PDF to JPG?',answer:'Yes. Use the separate all-pages exporter to receive individual JPG images inside a ZIP file, within its stated limits.'},
      {question:'Is PDF to JPG the same as PDF to JPEG?',answer:'Yes. JPG and JPEG describe the same JPEG image format; the filename extensions differ.'},
      {question:'Why is my PDF-to-JPG output blurry?',answer:'The page may be rendered at too few pixels or compressed too aggressively. Increase rendering scale first and inspect quality.'},
      {question:'Does JPG preserve links and selectable text?',answer:'No. The PDF page becomes pixels. Keep the original PDF for text, links, accessibility, or digital signatures.'},
      {question:'Can a single JPG contain multiple PDF pages?',answer:'A JPG is a single image. To export all pages without stitching, create one JPG per page and package them in a ZIP.'}
    ],
    summary:'Use one-page PDF to JPG for a specific image and PDF to JPG – All Pages for a numbered ZIP. Choose scale based on pixel dimensions, check small text, and keep your source PDF.',
    schema:{'@context':'https://schema.org','@type':'Article',headline:'How to Convert PDF to JPG: Single Page and All Pages',description:'Convert PDF pages to JPEG with browser-based tools. Learn page selection, ZIP export, resolution, quality and troubleshooting.',author:{'@type':'Organization',name:'Navorika Team'},datePublished:'2026-11-04',dateModified:'2026-11-04'}
  },
  'jpeg-vs-jpg': {
    intro:'A JPEG file and a JPG file use the same image compression format. The shorter .jpg extension became common when older Windows and DOS systems preferred three-character file extensions. Today most image programs treat .jpeg and .jpg alike. You can frequently change the filename extension without converting the image data at all. This guide explains when a rename is safe, when you really need re-encoding, how file sizes and metadata change, and why changing the letters cannot improve photo quality. Try [JPEG to JPG](/tools/jpeg-to-jpg) for a browser-local extension change or optional JPEG re-encode.',
    sections:[
      {title:'JPEG vs JPG: are they the same?',content:`**Yes.** JPEG is both the name of the image compression standard and a common filename extension; JPG is an alternative extension for that same format. A genuine .jpeg and a genuine .jpg file can carry equivalent compressed image data. Renaming a photo from holiday.jpeg to holiday.jpg does not by itself resize, decode, compress, or improve the image.

JPEG is usually appropriate for photographs and continuous-tone images. It does not support transparency and it uses lossy compression. For sharp interface screenshots, transparent logos, or tiny text, PNG may work better. Changing .jpeg to .jpg does not turn the image into a new algorithm.`},
      {title:'Why do both .jpeg and .jpg extensions exist?',content:`Older file systems historically imposed short extension conventions, so .jpg became common alongside .jpeg. Modern Windows, macOS, Linux, Android, and iOS can generally recognize both extensions. Many web services accept either name, but some upload forms validate extensions narrowly and insist on .jpg.

If a form refuses .jpeg while saying it accepts JPG, a filename-extension change may resolve the issue without any image quality loss. Always confirm that the source really is JPEG rather than renaming an unrelated file such as PNG or HEIC.`},
      {title:'Convert JPEG to JPG without losing image quality',content:`Open [JPEG to JPG](/tools/jpeg-to-jpg), select your JPEG file, and choose **Change extension only**. The utility downloads the same file bytes under a .jpg filename. The pixel data, encoded quality, EXIF data, original ICC profile, and file size remain unchanged because no recompression occurs.

If the receiving application requires a freshly encoded JPEG stream, choose **Re-encode JPEG**. This decodes the original image and writes a new JPEG using the browser canvas. That process is not lossless: fine details can change, the output may become larger or smaller, and metadata may be stripped. Keep the source file.`},
      {title:'Renaming versus re-encoding: a quick decision table',content:`| Requirement | Better method | What happens |
| --- | --- | --- |
| Upload form wants a .jpg name | Rename extension | Identical file bytes |
| Keep original camera metadata | Rename extension | Metadata preserved |
| Reduce file size | Re-encode or compress | Quality/file size can change |
| Remove common image metadata | Re-encode | Browser canvas generally strips metadata |
| Convert a PNG to JPG | Real conversion | Pixels decoded and written as JPEG |
| Convert an HEIC photo to JPG | Real conversion | HEIC decoder and JPEG encoder needed |

Renaming a PNG file to .jpg does not create a JPEG. A browser, photo editor, or upload service may reject it after checking the actual file signature.`},
      {title:'Does JPEG to JPG reduce the file size?',content:`Changing only the extension does not change file size: a 2.4 MB .jpeg remains a 2.4 MB .jpg. Re-encoding might reduce the bytes, but it can also increase the output size if the original was already efficiently compressed. Image dimensions and content heavily influence the result.

For a smaller attachment, use an actual [JPG compressor](/tools/compress-jpg) or [image resizer](/tools/resize-image). Compare the generated output visually at 100% zoom. Repeated JPEG saves can progressively introduce compression artifacts.`},
      {title:'How to identify a real JPEG file',content:`A filename extension is only a label. A JPEG usually begins with an FF D8 file signature, followed by JPEG marker segments. Apps commonly rely on both file signatures and browser MIME detection rather than the extension alone. A mislabeled file may look like a JPEG in File Explorer but fail during an upload.

If you received an image from a messaging app or camera, inspect its file type and properties before renaming. Image formats such as HEIC, WebP, AVIF, and PNG require actual conversion to JPEG, not a filename edit.`},
      {title:'Where JPG and JPEG are commonly used',content:`E-commerce stores, email clients, customer-service portals, school applications, and government upload forms commonly ask for JPEG photos. Requirements such as “JPG under 200 KB” contain two separate constraints: file format and file size. First ensure the file is a real JPEG; then resize or compress it to meet the maximum-size limit.

For web graphics, choose the format that suits the content rather than assuming JPEG is always smaller. Modern WebP and AVIF may be efficient alternatives where supported. For a transparent graphic, use PNG or WebP rather than JPG.`}
    ],
    faqs:[
      {question:'Is JPG lower quality than JPEG?',answer:'No. Both extensions refer to the same image format. Quality depends on how the image was encoded, not the number of letters in its extension.'},
      {question:'Can I rename .jpeg to .jpg?',answer:'Yes, provided the file is genuinely encoded as JPEG. Renaming changes only the name, not the image bytes.'},
      {question:'Does converting JPEG to JPG lose quality?',answer:'An extension-only rename does not. Re-encoding can introduce JPEG compression loss.'},
      {question:'Will a renamed JPEG work on an upload form?',answer:'Often, but not always. Some forms validate the MIME type, size, image dimensions, or other rules in addition to the filename extension.'},
      {question:'Can I change HEIC or PNG to JPG just by renaming?',answer:'No. Different formats require actual image conversion using a decoder and JPEG encoder.'},
      {question:'Is JPEG to JPG conversion private?',answer:'The Navorika tool processes the selected image in your browser and does not require an image upload.'}
    ],
    summary:'JPG and JPEG are interchangeable extensions for the same format. Rename without re-encoding to preserve the original bytes; use conversion only when changing image format or compression.',
    schema:{'@context':'https://schema.org','@type':'Article',headline:'JPEG vs JPG: What Is the Difference and How to Convert?',description:'Learn why JPG and JPEG are the same format, how to rename safely and when real image re-encoding is needed.',author:{'@type':'Organization',name:'Navorika Team'},datePublished:'2026-11-04',dateModified:'2026-11-04'}
  }
};
