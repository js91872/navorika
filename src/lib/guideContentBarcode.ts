import type { GuideContent } from './guideContent';

export const barcodeGuideContent: Record<string, GuideContent> = {
  "how-to-generate-barcodes-in-excel": {
    "intro": "Create barcode labels from Excel using a free CSV workflow. Learn how to preserve leading zeros, validate product codes and export bulk SVG files. This practical guide explains the workflow, common mistakes and the limits of barcode image generation. Use the [free Navorika Barcode Generator](/tools/barcode-generator) to try the steps in your own browser.",
    "sections": [
      {
        "title": "Can Excel generate barcodes?",
        "content": "Excel is useful for preparing barcode data, but a spreadsheet cell containing a number is not itself a barcode. Some workflows use barcode fonts, add-ins or macros; each introduces compatibility, encoding and printing considerations. A simple alternative is to prepare clean values in Excel, export them as CSV, then generate the barcode artwork with the [Navorika Barcode Generator](/tools/barcode-generator). This separates data management from symbol rendering and avoids relying on a specific font installed on every computer."
      },
      {
        "title": "Step 1: Prepare your spreadsheet",
        "content": "Create one row per item. Put the exact barcode value in column A, with an optional header such as barcode or SKU. Keep item descriptions, prices and stock counts in other columns for your own reference; the current generator reads the first column only. Set column A to Text *before* entering codes, especially for values that begin with zero. For example, the string 03600029145 must remain eleven characters. Excel may otherwise treat it as a number and remove the leading zero. Also check that formulas have resolved to their intended text values and that no invisible spaces remain."
      },
      {
        "title": "Step 2: Choose the correct barcode format",
        "content": "Use Code 128 for general inventory identifiers that mix letters and numbers. Code 39 works for uppercase alphanumeric labels where scanner compatibility requires it, but is usually wider. EAN-13 and UPC-A are intended for numeric retail identifiers, with specific lengths and check digits. Do not turn an arbitrary SKU into a retail UPC and assume it is valid for commercial distribution. Official GTIN identifiers should come from an authorized issuer such as GS1. When uncertain, ask the retailer, warehouse or scanner supplier which symbology is supported."
      },
      {
        "title": "Step 3: Export CSV from Excel",
        "content": "In Excel, choose File, Save As, and select CSV UTF-8 where available. Save a working copy of the original XLSX first, because CSV does not retain worksheets, formulas, cell formatting or multiple tabs. Open the CSV in a plain-text editor to verify that the first column contains the exact characters you expect. Check at least one leading-zero code and one value with punctuation. For a small batch you can also paste one code per line directly into the bulk field, avoiding the file export step."
      },
      {
        "title": "Step 4: Generate a batch and review the results",
        "content": "Open the [free bulk barcode generator](/tools/barcode-generator), select the desired format, upload the CSV and click Generate & download ZIP. The tool processes up to 1,000 rows per batch in your browser and creates a separate SVG file for each valid value. A results.csv report identifies rows that were rejected, such as invalid UPC check digits or unsupported Code 39 characters. Resolve those errors in your spreadsheet, export a corrected CSV and repeat the process. Do not interpret a successfully generated symbol as proof of a registered product number."
      },
      {
        "title": "Step 5: Print and test labels",
        "content": "SVG artwork stays crisp when resized, but barcode dimensions and quiet zones still matter. Place the exported artwork in your label layout software, preserve the white margin on each side, and avoid stretching it disproportionately. Print a small test sheet using the actual printer, label stock and scanner before producing hundreds of labels. Test difficult cases such as narrow labels, glossy stock and small fonts. For retail or regulated supply chains, follow the trading partner's formal print-quality and verification requirements."
      },
      {
        "title": "Common Excel barcode mistakes",
        "content": "The most common problem is losing a leading zero when Excel converts text to a number. Other issues include accidental scientific notation for long numeric identifiers, trailing spaces from copied data, incorrect symbology selection and a valid-length retail code with an invalid check digit. If you use a barcode font instead of an encoder, the font may not calculate checksums or start/stop patterns correctly. A preview that looks striped is not enough: confirm the decoded value with a scanner. Store the original SKU beside the exported label so mistakes can be traced."
      },
      {
        "title": "When should you use barcode fonts or add-ins?",
        "content": "A font-based workflow can be convenient when barcode symbols must appear directly inside Excel templates, but the font and encoder must match the symbology. Add-ins may offer live updates, templates and printer integrations, yet they can involve installation, licensing or macros. CSV-to-SVG is often better for occasional batches, privacy-sensitive data and teams using different operating systems. For high-volume manufacturing, dedicated label software with database connections and printer drivers may be more appropriate than either approach."
      }
    ],
    "faqs": [
      {
        "question": "Can I make barcodes in Excel without a font?",
        "answer": "Yes. Save the barcode values as CSV and use a browser-based barcode generator to create downloadable SVG artwork."
      },
      {
        "question": "Why did Excel remove the first zero?",
        "answer": "Excel interpreted the value as a number. Format the column as Text before entering or importing barcode identifiers."
      },
      {
        "question": "Can I upload an XLSX file directly?",
        "answer": "The current Navorika barcode tool accepts CSV, not XLSX. Save the spreadsheet as CSV UTF-8 first."
      },
      {
        "question": "Is a generated UPC automatically registered?",
        "answer": "No. Rendering a UPC-A symbol does not allocate or register a GTIN."
      }
    ],
    "summary": "Create barcode labels from Excel using a free CSV workflow. Learn how to preserve leading zeros, validate product codes and export bulk SVG files. Always validate the source data and test printed labels with your intended scanner.",
    "schema": {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "How to Generate Barcodes in Excel (Free CSV Method)",
      "description": "Create barcode labels from Excel using a free CSV workflow. Learn how to preserve leading zeros, validate product codes and export bulk SVG files.",
      "author": {
        "@type": "Organization",
        "name": "Navorika Team"
      },
      "datePublished": "2026-11-10",
      "dateModified": "2026-11-10"
    }
  },
  "code-128-vs-code-39": {
    "intro": "Compare Code 128 and Code 39 barcode formats for inventory, shipping and industrial labels, including character sets, density, scanners and printing. This practical guide explains the workflow, common mistakes and the limits of barcode image generation. Use the [free Navorika Barcode Generator](/tools/barcode-generator) to try the steps in your own browser.",
    "sections": [
      {
        "title": "Why Code 128 and Code 39 are often confused",
        "content": "Both are one-dimensional barcodes that represent data as vertical bars and spaces, and both appear on asset tags, cartons and inventory labels. They are not interchangeable encodings. The same visible text produces a different bar pattern in each standard, and a scanner must support the chosen symbology. Choosing the right format is mainly about character support, available label width, scanner configuration and any industry or customer requirement."
      },
      {
        "title": "Character sets and case sensitivity",
        "content": "Code 39's basic alphabet contains uppercase A–Z, digits 0–9, space and selected punctuation such as hyphen, period, dollar sign, slash, plus and percent. Lowercase letters are not directly represented in basic Code 39; an extended encoding scheme can represent more characters, but requires compatible software and scanner interpretation. Code 128 can represent the full ASCII character set through its symbol sets and switching mechanisms. The current Navorika generator's Code 128 implementation supports printable ASCII input and uses Code Set B, making it convenient for ordinary mixed-case identifiers."
      },
      {
        "title": "Barcode width and data density",
        "content": "Code 128 generally encodes the same alphanumeric data more compactly than Code 39. Code 39 uses relatively wide character patterns and inter-character gaps; long identifiers may therefore require wide labels or very narrow bars. Code 128 uses more efficient patterns and can switch to a numeric-pair set for especially compact long digit strings, although not every generator performs that optimization. If you print many characters on a narrow carton or rack label, Code 128 is often the practical starting point. Always check the final printed X-dimension and scanner distance."
      },
      {
        "title": "Start, stop and check characters",
        "content": "Code 39 normally uses an asterisk start/stop character around the encoded data. The asterisks are structural markers rather than part of the user's identifier. An optional Mod 43 check character can be used in some Code 39 systems, depending on application rules. Code 128 has mandatory start, checksum and stop symbols; its weighted checksum helps detect symbol errors. These are properties of the barcode encoding, not substitutes for checking whether an inventory record or SKU is correct."
      },
      {
        "title": "Which format is better for inventory labels?",
        "content": "For a new internal system with mixed-case item IDs and reasonably modern scanners, Code 128 is often a sensible default because it supports a wider character set and good density. Choose Code 39 when an existing asset-management process, older scanner configuration or customer specification explicitly requires it. If a partner specifies GS1-128, do not assume an ordinary Code 128 barcode is sufficient: GS1-128 adds application identifiers and formatting rules for structured business data."
      },
      {
        "title": "Printing and scanner compatibility",
        "content": "A barcode must have adequate bar width, contrast, height and clear quiet zones. The scanner must also enable the symbology and, where relevant, check-character handling. If a label scans on a phone but not on a warehouse scanner, verify the scanner configuration and print quality rather than repeatedly changing the text. Avoid low-resolution screenshots of barcodes. Export a vector SVG from the [free barcode generator](/tools/barcode-generator) and test with your actual printer and scanning hardware."
      },
      {
        "title": "How to generate a Code 128 or Code 39 barcode",
        "content": "Open the [Navorika Barcode Generator](/tools/barcode-generator), choose Code 128 or Code 39, and enter a sample value such as INV-2026-001. Confirm the live preview, then download an SVG or PNG. For Code 39, enter uppercase letters; the tool will reject unsupported characters instead of silently changing your identifier. For bulk work, paste values or upload a CSV and review the validation report in the ZIP. Scan the output and compare the decoded text against the source data."
      }
    ],
    "faqs": [
      {
        "question": "Is Code 128 the same as GS1-128?",
        "answer": "No. GS1-128 uses Code 128 symbology with additional GS1 application-identifier rules and data conventions."
      },
      {
        "question": "Can Code 39 encode lowercase letters?",
        "answer": "Basic Code 39 cannot directly encode lowercase letters. Extended Code 39 requires a compatible encoding and decoding workflow."
      },
      {
        "question": "Does Code 128 need a check digit?",
        "answer": "Yes, Code 128 includes a mandatory calculated checksum symbol. The generator handles this as part of encoding."
      },
      {
        "question": "Which barcode is shorter?",
        "answer": "Code 128 is generally more compact for the same alphanumeric value, although exact width depends on the chosen code set and data."
      }
    ],
    "summary": "Compare Code 128 and Code 39 barcode formats for inventory, shipping and industrial labels, including character sets, density, scanners and printing. Always validate the source data and test printed labels with your intended scanner.",
    "schema": {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Code 128 vs Code 39: Differences, Examples and When to Use Each",
      "description": "Compare Code 128 and Code 39 barcode formats for inventory, shipping and industrial labels, including character sets, density, scanners and printing.",
      "author": {
        "@type": "Organization",
        "name": "Navorika Team"
      },
      "datePublished": "2026-11-10",
      "dateModified": "2026-11-10"
    }
  },
  "upc-vs-ean-barcode": {
    "intro": "Understand UPC-A versus EAN-13 barcodes, GTIN length, check digits, leading zeros, retail registration and how to make a scannable symbol. This practical guide explains the workflow, common mistakes and the limits of barcode image generation. Use the [free Navorika Barcode Generator](/tools/barcode-generator) to try the steps in your own browser.",
    "sections": [
      {
        "title": "UPC and EAN are related retail barcode formats",
        "content": "UPC-A and EAN-13 are familiar linear barcodes on consumer product packaging. UPC-A commonly carries a twelve-digit GTIN-12, while EAN-13 carries a thirteen-digit GTIN-13. Both encode digits and include a final check digit calculated from the preceding digits. EAN-13 can represent a UPC-A number with a leading zero in the appropriate context, but the identifier length, system rules and partner requirements should still be handled carefully. A barcode image is only the printed representation of the underlying identifier."
      },
      {
        "title": "How many digits do you need?",
        "content": "UPC-A contains twelve digits in total: eleven data digits and one check digit. EAN-13 contains thirteen: twelve data digits and one check digit. Some tools let you enter only the data portion and calculate the last digit automatically. Navorika's [barcode generator](/tools/barcode-generator) accepts either form and checks a supplied final digit. Preserve leading zeros in spreadsheets and databases, because these are identifiers rather than quantities. A missing leading zero can change the code's meaning and make the barcode invalid."
      },
      {
        "title": "How the Modulo 10 check digit works",
        "content": "Both formats use a weighted Modulo 10 check calculation. Starting at the rightmost data digit, multiply alternating digits by three and one, add the products, then choose the digit that makes the total divisible by ten. For the eleven-digit UPC-A example 03600029145, the check digit is 2, giving 036000291452. This verifies a mathematical property of the digits, not that a product exists, belongs to a particular company or is registered. An incorrect check digit is a useful warning that the input may have been mistyped."
      },
      {
        "title": "Does a barcode generator give you a new UPC?",
        "content": "No. A barcode generator converts a supplied identifier into a machine-readable image. It does not issue a unique company prefix, register a GTIN, guarantee retail acceptance or establish product ownership. If you need identifiers for retail distribution, consult [GS1's GTIN guidance](https://www.gs1.org/standards/id-keys/gtin) and your retailer or marketplace requirements. Avoid purchasing arbitrary numbers from unverified sources merely because a barcode image can be generated for them."
      },
      {
        "title": "UPC-A versus EAN-13 for international selling",
        "content": "The two formats are widely supported by retail point-of-sale systems, but acceptance depends on the destination marketplace, the assigned GTIN and the partner's data standards. Do not select EAN-13 only because a product will be sold outside the United States, or UPC-A only because it will be sold within it. Ask the retailer which GTIN and symbol formats they accept, confirm packaging specifications and ensure product records match the encoded digits."
      },
      {
        "title": "Generate a UPC-A or EAN-13 barcode online",
        "content": "Choose UPC-A or EAN-13 in the [free barcode generator](/tools/barcode-generator). Enter the appropriate number of digits, including or excluding the final check digit. The tool calculates a missing check digit or rejects an incorrect one. Download the barcode as SVG for label layout or PNG for a simple document. Keep the quiet zones clear and test a printed sample with the intended scanner. The generator does not provide GS1 registration or print-grade verification."
      },
      {
        "title": "Common mistakes with retail barcode labels",
        "content": "Typical problems include losing leading zeros in Excel, accidentally using a store SKU instead of an assigned GTIN, typing an incorrect check digit, cropping the quiet zone, shrinking the bars too much, or printing on a reflective background. Another mistake is confusing a UPC-A symbol with a shipping label or GS1-128 logistics barcode; those formats serve different purposes. Check the retailer's requirements and validate the final print, not just the preview."
      }
    ],
    "faqs": [
      {
        "question": "Can UPC-A be converted to EAN-13?",
        "answer": "A UPC-A number can commonly be represented in EAN-13 with a leading zero, but verify how the receiving system expects the GTIN."
      },
      {
        "question": "What is the UPC check digit?",
        "answer": "It is the final digit calculated using alternating weights of three and one, so the weighted total is divisible by ten."
      },
      {
        "question": "Can I create a UPC for free?",
        "answer": "You can render a barcode image for a UPC number you already have, but obtaining an authorized GTIN may involve registration or fees."
      },
      {
        "question": "Why is my EAN-13 code rejected?",
        "answer": "Check the digit count, leading zeros and the final check digit. A supplied incorrect check digit will be rejected."
      }
    ],
    "summary": "Understand UPC-A versus EAN-13 barcodes, GTIN length, check digits, leading zeros, retail registration and how to make a scannable symbol. Always validate the source data and test printed labels with your intended scanner.",
    "schema": {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "UPC vs EAN Barcodes: UPC-A, EAN-13 and Check Digits Explained",
      "description": "Understand UPC-A versus EAN-13 barcodes, GTIN length, check digits, leading zeros, retail registration and how to make a scannable symbol.",
      "author": {
        "@type": "Organization",
        "name": "Navorika Team"
      },
      "datePublished": "2026-11-10",
      "dateModified": "2026-11-10"
    }
  }
};
