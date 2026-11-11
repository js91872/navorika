export type PageHelpSection = { heading: string; body: string };

export const pageHelp: Record<string, PageHelpSection[]> = {
  "/categories": [
    {
      "heading": "Find a category by the result you need",
      "body": "Choose a category from the kind of work you want to finish, rather than the name of a file or formula alone. PDF tools organize documents; image tools change picture formats and dimensions. Finance, health, construction, and everyday calculators turn entered measurements into estimates. Developer tools work with code, structured text, and technical values. Each category groups related tasks so you can compare the available options before opening a tool."
    },
    {
      "heading": "When a toolkit or guide is more useful",
      "body": "A category is useful when you know the subject but have not chosen an exact tool. A toolkit is useful when a job has several steps, such as preparing a document for sharing or comparing borrowing costs. Guides explain the decisions behind those steps. Start with the category cards above, then follow the relevant collection or explanation if you need help choosing settings or interpreting an unfamiliar result."
    },
    {
      "heading": "Check the details on the tool page",
      "body": "Read the accepted inputs, units, and limitations on the individual page before starting. An image converter may preserve dimensions without reducing file size, and a calculator may omit costs that matter to your situation. Processing information is also specific to each tool: many tasks run in the browser, while some specialized conversions use temporary server processing. Keep your original files and verify important outputs before sharing or relying on them."
    }
  ],
  "/tools": [
    {
      "heading": "Search by action, input, or output",
      "body": "Try a short task such as compress PDF, resize image, or calculate loan payment. If you cannot remember a tool name, search for the file type or quantity you have, then compare the descriptions. A converter changes the format of a file, a checker reports its properties, and an editor changes its contents or layout. Choosing the correct action avoids unnecessary conversions and helps preserve the original quality."
    },
    {
      "heading": "Plan a short workflow",
      "body": "Some tasks need more than one tool. For example, prepare a photo by checking its dimensions, resizing it, and then compressing the final copy. For a document, put pages in order before producing the version you intend to share. Open related tools only when the next step serves your goal. Keep the original separately so you can restart without repeatedly editing an already compressed file."
    },
    {
      "heading": "Verify the final result",
      "body": "Open downloaded files in the application where they will be used. Check page order, orientation, image sharpness, text, and file size as appropriate. With calculators, replace sample inputs and confirm that percentages, periods, and units match your source information. Estimates are useful for comparing scenarios, but they do not automatically include every real-world condition. The individual tool page explains its supported features and any important processing limits."
    }
  ],
  "/guides": [
    {
      "heading": "Choose a guide for the decision you face",
      "body": "Use a guide when you want to understand a setting, compare file formats, or learn why a calculation produces a particular result. Start with the subject that matches your task, then read the description before opening an article. A file conversion guide explains what can change during export; a calculator guide explains inputs and assumptions. The most useful article is the one that answers your immediate question."
    },
    {
      "heading": "Use the explanation alongside the tool",
      "body": "Read the practical steps first, then try the linked tool with a copy of your file or a simple set of sample values. Compare the output with the explanation before processing a larger batch or using your own detailed figures. Worked examples help you check that the units and options are correct. If an output looks unexpected, return to the section about limitations or common mistakes."
    },
    {
      "heading": "Turn the steps into a repeatable check",
      "body": "For documents and images, make a note of the required format, dimensions, and quality before starting. For estimates, record the assumptions so you can compare later scenarios fairly. A guide can explain a method, but your printer, recipient, lender, or other destination may have additional requirements. Use those requirements to review the final output, and keep the source file or original figures available for revisions."
    }
  ],
  "/toolkits": [
    {
      "heading": "Start with a complete job",
      "body": "Toolkits collect separate tools around an outcome, such as preparing images for a website or organizing a PDF document. They are helpful when you know the end goal but are unsure which operation comes first. Browse the collection descriptions and choose the closest match. You can use a single tool from the collection or follow several steps, depending on what your source file or calculation needs."
    },
    {
      "heading": "Keep control of each step",
      "body": "Moving through a toolkit does not mean that files or calculator inputs automatically pass between tools. Download or note each result and use it as the next input when appropriate. Check the output before continuing, particularly after lossy compression or a format change. This makes it easier to locate the cause of a problem and prevents a small error from being repeated through the rest of the workflow."
    },
    {
      "heading": "Know when to stop",
      "body": "Use only the operations that meet the destination requirements. If a PDF is already the correct size and its pages are in order, additional conversion may be unnecessary. If a financial comparison already uses consistent inputs, changing unrelated assumptions can make it harder to interpret. Read the notes on each tool and finish by checking the final file or estimate against the original goal you set."
    }
  ],
  "/categories/pdf-tools": [
    {
      "heading": "Choose the PDF operation before converting",
      "body": "Use merge to combine documents, split or extract to keep selected pages, and reorder or rotate to correct their sequence and orientation. Compression targets file size; conversion changes the format. These operations solve different problems. If the recipient accepts PDF already, editing or organizing the existing document can avoid an unnecessary round trip through another format that might change fonts, page breaks, or image quality."
    },
    {
      "heading": "A practical document preparation sequence",
      "body": "Keep an untouched source copy. First remove unwanted pages and put the remaining pages in order. Next review orientation and page dimensions, especially when combining scans from different sources. Apply compression only if you need a smaller delivery file, then check that small text and diagrams are still readable. Open the downloaded document in a PDF viewer before attaching it to an application or sending it onward."
    },
    {
      "heading": "Text, scans, and interactive features",
      "body": "A PDF can contain selectable text, scanned page images, form fields, annotations, and signatures. A text extractor cannot recover text from every scan without OCR, and flattening can affect interactive features. Read the tool description to see what is preserved. Password restrictions, damaged files, and large page images may prevent processing. Check the specific page for privacy and browser requirements before working with a sensitive document."
    }
  ],
  "/categories/image-tools": [
    {
      "heading": "Match the operation to the image problem",
      "body": "Resize changes pixel dimensions, compression targets storage size, cropping changes the visible frame, and conversion changes the file format. These actions are related but are not interchangeable. For example, converting a small JPEG to PNG does not restore detail already lost in compression. Start from the best original you have and decide whether the destination needs a certain width, file type, or maximum number of kilobytes."
    },
    {
      "heading": "Choose a format for the destination",
      "body": "JPEG is commonly used for photographs, while PNG is useful for graphics that need transparency. WebP and AVIF can be useful for web delivery when the destination supports them. SVG artwork has different properties from a raster image, and exporting it to pixels fixes its resolution. Check the target website, printer, or application requirements before selecting a converter, particularly when transparency or animation matters."
    },
    {
      "heading": "Check more than the filename",
      "body": "After downloading, inspect the dimensions, visible sharpness, transparency, and orientation. A different extension does not guarantee a smaller file or better quality. Small icons need a readable silhouette, while print images need enough pixels for their intended physical size. Metadata removal is a separate task from hiding visible information in a photograph. Keep source files so you can create another export without repeatedly reducing quality."
    }
  ],
  "/categories/finance-calculators": [
    {
      "heading": "Pick a calculator for one money question",
      "body": "Start with the question you want to compare: a monthly loan payment, a savings balance, a household budget, or an investment return. These outputs describe different things. Total return is not the same as an annual growth rate, and a loan payment is not the full cost of owning a home or vehicle. Read the input labels so that the calculator matches the figures you have available."
    },
    {
      "heading": "Keep comparisons consistent",
      "body": "Use the same currency and time period across each scenario. A yearly salary and a monthly expense cannot be compared directly without conversion. When comparing loans, hold the borrowed amount constant while changing the rate or term. When comparing savings assumptions, change one input at a time. This makes it easier to see which factor affects the result rather than combining several changes into an unclear comparison."
    },
    {
      "heading": "Read estimates with their assumptions",
      "body": "The pages explain what their formulas include and omit. Fees, changing rates, taxes, irregular contributions, and market fluctuations can change an actual outcome. Sample values are illustrations rather than recommended rates or targets. Record the assumptions with the result, then compare relevant figures with your own statements or product documents. A calculator is a way to explore numbers; it does not determine which financial product suits your circumstances."
    }
  ],
  "/categories/health-calculators": [
    {
      "heading": "Choose the estimate that matches your question",
      "body": "The tools in this category use entered measurements to calculate body, energy, activity, and fitness estimates. A body-size index, an estimated daily energy need, and an exercise heart-rate range describe different aspects of a person. Choose the specific quantity you want to understand and read how the page defines it. Avoid treating several estimates as if they were interchangeable measures of overall health."
    },
    {
      "heading": "Enter measurements consistently",
      "body": "Check whether the tool expects kilograms or pounds, centimeters or feet and inches, and minutes or hours. Use a recent measurement rather than a guess when possible, and follow the instructions for any circumference measurements. A small input mistake can produce a large difference in the result. If you compare calculations over time, use the same method and units so that the comparison remains meaningful."
    },
    {
      "heading": "Understand what a formula cannot show",
      "body": "A calculated result does not examine symptoms, review a medical history, or measure body composition directly. Individual circumstances can fall outside a formula’s assumptions. Read the limitations on the tool page and use the output as educational information. If a number appears unexpected, check the inputs first and discuss questions about its personal significance with a qualified healthcare professional rather than using the estimate to diagnose yourself."
    }
  ],
  "/categories/everyday-calculators": [
    {
      "heading": "Start with the quantity you have",
      "body": "Everyday calculations often begin with a price, distance, weight, date, or duration. Choose the tool whose inputs match that starting information and whose result matches the decision you need to make. A unit converter is useful when two measurements use different scales; a cost calculator is useful when quantities must be combined with a rate. Read the labels before copying figures from a bill or product listing."
    },
    {
      "heading": "Watch units, periods, and rounding",
      "body": "Use one consistent set of units within a calculation. Check whether a price is per item, per kilogram, per hour, or for a complete package. A small rounding difference can become noticeable when multiplied across a large quantity. Keep full input precision when possible and round the final result only as needed. For time calculations, confirm dates and whether the interval crosses midnight or a calendar boundary."
    },
    {
      "heading": "Use a simple example as a check",
      "body": "Before entering a complicated case, try values whose answer you can estimate mentally. Doubling a quantity at the same unit price should double the basic cost before fixed charges. If the result differs from your expectation, review the assumptions and fields rather than adjusting numbers to force a preferred answer. Save the original information so you can update the calculation when the price, distance, or requirement changes."
    }
  ],
  "/toolkits/image-optimization-tools": [
    {
      "heading": "Set an image delivery target",
      "body": "Start with the destination’s required width, accepted formats, and file-size limit. A website thumbnail, a product photograph, and a print graphic need different exports. Check the original dimensions before editing: enlarging an undersized image cannot recreate missing detail. Keep a high-quality master and make delivery copies from it, so each new export starts with the best available source rather than an already compressed copy."
    },
    {
      "heading": "Resize before final compression",
      "body": "Crop to the intended composition, resize to the required pixel dimensions, then choose a supported format and compression setting. Inspect the export at the size viewers will actually see. Fine text, hair, foliage, and transparent edges can reveal quality loss that is easy to miss in a small preview. Compare both visual quality and file size; the smallest possible file is not always the most useful result."
    },
    {
      "heading": "Finish with a compatibility check",
      "body": "Open the final image in its destination application or upload preview. Check orientation, transparency, and any animation you need to preserve. Converting between formats can change these features, and metadata cleaning does not hide visible identifying details. If the file exceeds a limit, adjust dimensions or quality deliberately and compare again. Keep a record of useful settings for future images with the same delivery requirements."
    }
  ],
  "/toolkits/pdf-document-workflows": [
    {
      "heading": "Prepare the pages before the final export",
      "body": "Begin with a copy of the source documents and identify the pages the recipient needs. Remove duplicates, arrange the remaining pages, and correct sideways scans before combining the final set. Check for mixed paper sizes and blank pages. A simple page review at this stage can prevent repeated merging and compression later, especially when several people have contributed documents created with different applications."
    },
    {
      "heading": "Choose compression or conversion carefully",
      "body": "Compression is useful when a document exceeds an attachment or upload limit. Conversion is useful when the recipient needs another format. Neither operation is a substitute for checking the contents. Scanned text can become difficult to read after aggressive image compression, and form fields or annotations may behave differently after flattening. Read the limitations of the selected tool before processing the only copy of a completed form."
    },
    {
      "heading": "Review the delivered document",
      "body": "Open the downloaded PDF in a viewer and inspect the first, middle, and last pages, then check any pages containing tables, small print, or signatures. Confirm the page count and sequence against the original requirements. Searchable text, bookmarks, form behavior, and digital signatures need their own checks when relevant. Keep the original and final files separately, using clear names so that the intended delivery version is easy to identify."
    }
  ],
  "/toolkits/loan-and-budget-calculators": [
    {
      "heading": "Build a comparison from actual inputs",
      "body": "Begin with your own income, regular expenses, proposed borrowing amount, and quoted loan terms. Use monthly figures for a monthly budget and distinguish after-tax income from gross salary. A loan payment calculation needs the financed balance rather than the purchase price if a deposit has already reduced the borrowing. Keep fees and other recurring ownership costs visible separately when the selected calculator does not include them."
    },
    {
      "heading": "Change one assumption at a time",
      "body": "Compare the same borrowing amount at different terms or rates, then examine how both the payment and total interest change. For a budget, compare the calculated allocation with your actual categories rather than assuming a percentage split describes your household. Record each scenario so the figures remain comparable. A lower monthly payment can come with a longer repayment period, so review the complete output rather than one headline number."
    },
    {
      "heading": "Connect the estimates without double counting",
      "body": "A monthly loan payment may form part of a household budget, but it should be included only once. Emergency savings use a separate set of essential expenses and an entered coverage period. Check that transfers, debt payments, and savings contributions are consistently classified. These tools illustrate the arithmetic behind a plan; real account terms and your personal circumstances determine the final amounts and decisions."
    }
  ],
  "/paper-sizes/a3": [
    {
      "heading": "Printing an A3 document at its intended size",
      "body": "Choose A3 in both the document settings and the printer dialog. A file can have an A3 page boundary while the printer is set to A4 or Letter, which may trigger automatic scaling. Use actual size when physical measurements matter, and check that your printer supports the sheet. Print a test page before producing multiple copies, especially for drawings, templates, or forms."
    },
    {
      "heading": "How A3 relates to A4",
      "body": "An A3 sheet is 297 mm wide and 420 mm high in portrait orientation. Cutting across its longer side produces two A4 sheets of 210 × 297 mm. The area doubles from A4 to A3, but the linear enlargement is approximately 141%, not 200%. To reduce A3 artwork to A4, the corresponding linear scale is approximately 71%, subject to printable margins."
    },
    {
      "heading": "Choosing pixels and margins",
      "body": "Pixel dimensions depend on the intended resolution, not just the paper name. Calculate each edge as millimeters divided by 25.4, multiplied by pixels per inch, then round to a whole pixel. Print shops may also request bleed outside the trimmed page and a safe area inside it. Ask for those specifications separately; adding bleed changes the supplied artwork dimensions without changing the final A3 trim size."
    }
  ],
  "/paper-sizes/a4": [
    {
      "heading": "Set the document and printer to A4",
      "body": "A4 describes the finished page dimensions of 210 × 297 mm. Selecting A4 in the document editor does not guarantee that the printer will use the same setting. Check the print dialog, tray selection, and scaling option before printing. If the application automatically fits the page to another paper size, text and diagrams can become smaller and the original margins can change."
    },
    {
      "heading": "A4, Letter, and page orientation",
      "body": "US Letter is 8.5 × 11 inches, so it is wider and shorter than A4. A document designed for one can wrap or scale differently on the other. Landscape orientation swaps the width and height of A4 without changing its area. When combining documents or preparing a form, check the actual page dimensions rather than relying only on how the page appears on screen."
    },
    {
      "heading": "Prepare an A4 image or scan",
      "body": "For a raster image, choose the intended print resolution before calculating pixels. At 300 pixels per inch, A4 is approximately 2480 × 3508 pixels. This is a rounded conversion; changing a resolution tag alone does not create additional image detail. Keep important text inside the printable area, and ask the print provider about bleed if artwork must extend all the way to the trimmed edge."
    }
  ],
  "/tools/avif-to-png": [
    {
      "heading": "When PNG is a useful output",
      "body": "Convert an AVIF image when a document editor, upload form, or image application accepts PNG but cannot read AVIF. The conversion creates a raster copy that is easier to use in those destinations. PNG uses lossless compression for its stored pixels, but it cannot recover detail already missing from the source AVIF. Keep the original if you may need to create another export later."
    },
    {
      "heading": "What to check after conversion",
      "body": "Compare the downloaded image with the source at full size. Check fine detail, transparent edges, and colors in the application where the PNG will be used. PNG files can be substantially larger than AVIF files, especially for photographs. A larger output does not mean that additional detail was created. If your destination has a size limit, consider resizing the image after choosing suitable dimensions."
    },
    {
      "heading": "If an AVIF file will not open",
      "body": "This converter depends on the browser being able to decode the input. Try a current compatible browser if decoding fails, and confirm that the source file opens elsewhere. This page limits uploads to 15 MB and decoded images to 25 megapixels. Renaming another format to .avif does not make it valid AVIF. Use a smaller source copy if browser memory is insufficient."
    }
  ],
  "/tools/heic-to-pdf": [
    {
      "heading": "Use a PDF when the recipient needs a document",
      "body": "HEIC photos are common on Apple devices, while a recipient may prefer a PDF attachment for a form, record, or reference image. This conversion places the decoded photo on a PDF page. It does not recognize text or turn a photographed document into editable paragraphs. Keep the original photo if you also need its camera information or a different image export."
    },
    {
      "heading": "Review orientation and page dimensions",
      "body": "Open the downloaded PDF and check that the photo is upright and that no important edge is missing. The page follows the image dimensions used by this converter; it is not automatically an A4 or Letter document with standard margins. If you intend to print it, inspect the viewer’s paper-size and scaling settings. A small source photo may look soft when enlarged onto a large sheet."
    },
    {
      "heading": "Troubleshooting a HEIC export",
      "body": "Use a file within the 15 MB upload limit and allow time for the browser to load the image decoder. The decoded image must also fit the tool’s 25-megapixel limit. Some HEIC files contain multiple images or features that the decoder may not preserve; this converter uses the first decoded image. Check the result before sharing, particularly when the source is a multi-image capture."
    }
  ],
  "/tools/jfif-to-png": [
    {
      "heading": "Why a JFIF file may need conversion",
      "body": "JFIF is associated with JPEG image data, but some upload forms reject the .jfif extension even when an image viewer opens it. Converting to PNG can help when PNG is an accepted destination format. The tool decodes the image and exports fresh PNG pixels rather than merely renaming the file. Use the original as your reference when checking dimensions, colors, and sharpness."
    },
    {
      "heading": "Understand what PNG preserves",
      "body": "PNG can store the decoded image without adding another JPEG compression step. It does not reverse block artifacts, blur, or detail loss already present in the original photograph. The output can be larger than the JFIF input because photographs often compress more efficiently as JPEG. Choose PNG for compatibility or an editing workflow, rather than expecting a smaller file simply from changing the extension."
    },
    {
      "heading": "Review and troubleshoot the download",
      "body": "Open the PNG in the destination application and compare its orientation and dimensions with the original. This converter uses the browser’s image decoder and supports images up to 25 megapixels. A corrupted file or an unsupported encoding can fail even when its extension looks correct. Try opening the input in another viewer and export a valid copy if necessary; changing its name alone cannot repair image data."
    }
  ],
  "/tools/svg-to-ico": [
    {
      "heading": "Prepare artwork for a small icon",
      "body": "A favicon has very little room for detail. Start with a simple symbol, strong contrast, and some clear space around the shape. Long words and thin lines can disappear when the image is displayed in a browser tab. Preview the artwork at a small size before converting it. A square SVG viewBox usually makes it easier to judge the final composition and padding."
    },
    {
      "heading": "What this ICO export contains",
      "body": "This converter renders the SVG into a 64 × 64 pixel canvas and places the resulting PNG image inside an ICO container. The artwork is scaled proportionally and centered, so a wide or tall source may have empty space on two sides. The export is a raster icon, not a scalable SVG. It does not automatically produce a complete collection of platform-specific app icon sizes."
    },
    {
      "heading": "Check the icon in its destination",
      "body": "Use a self-contained SVG with artwork that does not depend on unavailable fonts or external images. Open the ICO in a compatible viewer and test it against both light and dark backgrounds. After replacing a website favicon, browsers may continue displaying a cached version; verify the served file as well as the tab icon. Keep the SVG source so future sizes can be exported cleanly."
    }
  ],
  "/tools/webp-to-ico": [
    {
      "heading": "Choose a readable source image",
      "body": "A favicon works best as a recognizable mark rather than a detailed photograph. Start with a WebP image that has a clear subject and enough surrounding space to remain legible at small sizes. Fine text and low-contrast detail may disappear in a browser tab. If you need to crop the composition, prepare a square source before converting and keep the original image separately."
    },
    {
      "heading": "How the 64 pixel icon is made",
      "body": "The tool scales the decoded image proportionally to fit a 64 × 64 pixel canvas and centers it within that square. It then stores a PNG image in an ICO file. The result contains one icon size; it is not a multi-resolution Windows icon bundle. A rectangular source is fitted rather than stretched, so padding around two sides is expected."
    },
    {
      "heading": "Test the result before replacing a favicon",
      "body": "Open the downloaded ICO in a compatible application, then test the website icon on light and dark tab backgrounds. Check whether transparency and the edge shape look correct. Animated source artwork does not become an animated favicon through this export. If the website still shows the previous icon, check the linked file and browser cache. Keep a larger source for any future app or social icon exports."
    }
  ],
  "/tools/webp-to-gif": [
    {
      "heading": "Choose GIF for a compatibility requirement",
      "body": "GIF can be useful when an application accepts GIF but does not accept WebP. Conversion may increase file size and reduce color detail because GIF uses a limited palette. For a still photograph, a PNG or JPEG export may be more suitable if the destination accepts it. Choose the output based on where it will be used rather than assuming older formats are smaller."
    },
    {
      "heading": "This export creates a still GIF",
      "body": "The converter draws the decoded WebP onto a single canvas and exports that frame as a GIF. It does not preserve animation frames, timing, or loop settings from an animated WebP. If motion is essential, use a workflow designed for animated conversion instead. Preview the output to check which frame was captured, and compare colors and transparent edges with the original image."
    },
    {
      "heading": "Review palette and file-size changes",
      "body": "GIF uses a limited color palette, so gradients and photographs can look different after conversion. Open the download at full size and check fine details before sharing it. The source file must meet the 15 MB upload limit. If decoding fails, test with a smaller valid WebP and a current browser. Retain the original in case a different output format better meets the destination requirements."
    }
  ],
  "/tools/markdown-to-pdf": [
    {
      "heading": "Prepare Markdown for a simple document",
      "body": "Use this export for readable headings and text from notes, short instructions, or a draft. Paste the Markdown or select a text file, then review the downloaded PDF. The lightweight renderer supports a limited set of formatting rather than a complete publishing layout. If your document depends on complex tables, embedded images, or exact page design, check those requirements before choosing this converter."
    },
    {
      "heading": "Review the page breaks and text",
      "body": "Open the PDF and inspect heading placement, line wrapping, and the last page. A plain-text source does not specify all the layout choices that a word processor would, so the export may differ from a Markdown preview in another application. Test a short sample containing your typical punctuation and headings first. Keep the editable Markdown separately because the PDF is intended as a delivery copy."
    },
    {
      "heading": "If the output differs from your editor",
      "body": "Different Markdown applications support different extensions. Features such as HTML blocks, elaborate tables, and external artwork may not have an equivalent in this export. Simplify the source to basic headings and paragraphs when possible. Check the visible limitations near the download control and compare the result in a PDF viewer. For a precise branded document, use an authoring application that exposes page and typography settings."
    }
  ],
  "/tools/xml-to-csv": [
    {
      "heading": "Use a flat record structure",
      "body": "This converter expects repeated record elements whose immediate child elements are individual fields. For example, each product record could contain a name and a price. Those field names become CSV column headings. Nested objects, repeated fields within one record, and information stored only as attributes require a different mapping process. Decide how those structures should become rows and columns before attempting a more complex export."
    },
    {
      "heading": "A small example to check the mapping",
      "body": "For two product elements containing name and price fields, expect one header row and two data rows. A field missing from one record becomes an empty cell in that record’s row. The converter chooses the most numerous group of sibling record elements, so unrelated groups should be separated before conversion. Test a small representative sample and check that the expected records and columns are present."
    },
    {
      "heading": "Open the CSV carefully in a spreadsheet",
      "body": "CSV stores text values and separators rather than spreadsheet types or formatting. A spreadsheet may automatically change leading zeros, long identifiers, or dates when it opens the file. Import those columns as text when their exact representation matters. Review untrusted values before opening them in an application that interprets formulas. Keep the XML source because the CSV cannot preserve the complete original document structure."
    }
  ],
  "/tools/txt-to-image": [
    {
      "heading": "Create a readable text graphic",
      "body": "Use this tool for a short quotation, announcement, label, or text snippet that you want to share as a PNG. Enter the text, choose the available font-size and background settings, and export a copy. This is text rendering, not an AI illustration generator. The downloaded picture contains the visible words as pixels rather than editable text layers or a searchable document."
    },
    {
      "heading": "Check wrapping and contrast before sharing",
      "body": "Long lines can be clipped, so insert manual line breaks and keep the message short enough for the canvas. Review the exported image at the size your audience will see, especially on a phone. Choose a font size and background that make the text easy to read. Verify spelling and punctuation before downloading, because changing a PNG later is less convenient than correcting the source text."
    },
    {
      "heading": "Keep an accessible text version",
      "body": "An image of text does not automatically provide an equivalent experience for screen readers or people who enlarge and reflow text. When publishing the graphic, include the words in the accompanying caption or appropriate alternative text. Keep the original wording separately for future edits. If you need a longer report, selectable text, or multiple pages, a document or PDF workflow is usually more suitable than one large image."
    }
  ],
  "/tools/exif-metadata-remover": [
    {
      "heading": "Choose what information needs protection",
      "body": "Photo metadata can include capture settings, timestamps, and location information, depending on the camera and file. Re-encoding removes common embedded metadata, but visible content is a separate issue. A street sign, reflection, document, or recognizable face can still identify a place or person. Review both the file properties and the picture itself before deciding whether a cleaned image is ready to share."
    },
    {
      "heading": "A careful batch-cleaning workflow",
      "body": "Keep the originals in a separate location and select only the images you intend to distribute. Download the cleaned ZIP, extract it, and open representative files to check orientation, color, and readability. Re-encoding can change the file size and appearance, so compare important images with the source. Use a metadata inspection application to verify the downloaded copy independently when removal of a particular tag matters."
    },
    {
      "heading": "Understand the format limitations",
      "body": "This tool handles supported still JPEG, PNG, and WebP images. It is not a metadata cleaner for RAW photographs, animated images, or SVG documents. A fresh canvas export may also change color profiles and compression, so it should not replace an archival master. Cleaning the new export does not modify copies already stored elsewhere or remove information from the original filename you use when sharing it."
    }
  ],
  "/tools/cashflow-budget-architect/budget-planner": [
    {
      "heading": "Use income that is available to spend",
      "body": "The 50/30/20 split starts with monthly after-tax income, rather than an annual headline salary. Enter the amount you want to allocate, using the same currency throughout. The displayed percentages divide that income into needs, wants, and savings or extra debt payments. The tool applies the split mechanically; it does not inspect your bank transactions or decide which expenses belong in each category."
    },
    {
      "heading": "Worked example: an income of 4,000",
      "body": "Entering 4,000 produces 2,000 for needs, 1,200 for wants, and 800 for savings or additional debt repayment. Those three amounts add back to the entered income. Compare each amount with your own expense list to see where your actual spending differs. A percentage allocation can organize a comparison, but it does not make essential expenses smaller or automatically account for irregular annual bills."
    },
    {
      "heading": "Make the comparison useful",
      "body": "List the bills included in each category and avoid counting a transfer twice. If income varies, run several scenarios with clearly labeled assumptions. This calculator shows one budgeting framework, not a personalized spending prescription. Revisit the inputs when income or costs change, and keep separate notes for one-off expenses so that the monthly allocation is not mistaken for a complete forecast."
    }
  ],
  "/tools/cashflow-budget-architect/emergency-fund-calculator": [
    {
      "heading": "Define the expenses you want covered",
      "body": "The input is essential monthly spending, which may differ from your income or normal total spending. Add the recurring costs you want the reserve to cover and use one consistent currency. Enter the number of months you want to model separately. The calculator multiplies those figures; it does not choose a coverage period or evaluate how secure your income is."
    },
    {
      "heading": "Worked example: changing the coverage period",
      "body": "At 2,000 of essential expenses per month, three months gives a target of 6,000 and six months gives 12,000. The larger result reflects a longer entered coverage period, not a prediction that an emergency will cost that amount. You can also change the expense input to see how a different set of essential costs affects the total."
    },
    {
      "heading": "Separate a target from an existing balance",
      "body": "The displayed amount is the reserve target for your assumptions. It is not automatically reduced by savings you already hold, and it does not calculate how long it will take to reach the target. Compare the output with a separately recorded current balance if you want to identify a gap. Interest, access conditions, inflation, and account protection are outside this simple multiplication."
    }
  ],
  "/tools/cashflow-budget-architect/credit-card-payoff": [
    {
      "heading": "Use the current balance and a fixed payment",
      "body": "Enter the balance you want to model, an annual percentage rate, and the monthly amount paid. The projection assumes the entered rate and payment stay constant and that no new purchases are added. It applies interest using APR divided by twelve, followed by the payment. Actual statements may calculate interest using daily balances and include fees or different rates for separate balance types."
    },
    {
      "heading": "Understand the interest warning",
      "body": "If a payment does not exceed the first month’s modeled interest, it cannot reduce the balance under these assumptions. For example, a 1,000 balance at 12% APR has 10 of modeled monthly interest at the start. A payment of 10 leaves that balance unchanged in this simplified model. A payment above 10 can begin reducing principal, provided no new charges are added."
    },
    {
      "heading": "Compare the estimate with statements",
      "body": "Use the month count as an illustration and check actual account terms for payment dates, fees, promotions, and minimum-payment rules. The simulation has a 600-month calculation cap, so a result reaching that cap should not be treated as proof of full payoff. Changing the payment is a useful comparison, but this tool does not assess affordability or recommend a debt product."
    }
  ],
  "/tools/investment-return-profiler/cagr-calculator": [
    {
      "heading": "Use comparable beginning and ending values",
      "body": "CAGR describes the constant annual compound rate connecting a starting value to an ending value over an entered number of years. Use values in the same currency and a positive duration. The calculation does not reconstruct the journey between those dates. It can summarize endpoint growth, but it cannot show the volatility, temporary losses, or changing returns that occurred during the period."
    },
    {
      "heading": "Worked example: two years of growth",
      "body": "A starting value of 10,000 and ending value of 12,100 over two years gives a CAGR of 10%. The relationship is 10,000 multiplied by 1.10 twice, producing 12,100. The total gain is 21%, which is different from the annual compound rate. Changing the number of years while holding those values fixed changes the annualized result."
    },
    {
      "heading": "When the endpoint method is insufficient",
      "body": "Additional deposits or withdrawals can change an account balance without representing investment performance. This calculator does not model the timing of those cash flows, and it does not automatically deduct taxes or fees. For a meaningful comparison, use consistent periods and account for those differences separately. A historical CAGR is a description of entered endpoints, not a forecast of future returns."
    }
  ],
  "/tools/investment-return-profiler/roi-calculator": [
    {
      "heading": "Distinguish returned value from profit",
      "body": "Enter the amount invested and the total value returned, including the recovered starting amount where applicable. The formula subtracts the investment from the returned value, divides by the investment, and expresses the result as a percentage. Entering profit alone in the returned-value field would subtract the original investment a second time and give a misleading result."
    },
    {
      "heading": "Worked example: a total return",
      "body": "An investment of 1,000 with 1,250 returned has a gain of 250 and an ROI of 25%. If only 800 is returned, the result is a loss of 200, or negative 20%. These percentages describe the entire entered transaction. They do not state how quickly the gain or loss occurred, because this calculator has no holding-period input."
    },
    {
      "heading": "Use consistent cost boundaries",
      "body": "Decide whether your input amounts include transaction costs, fees, and any distributions, then use the same approach for every comparison. The tool does not automatically look up those amounts or adjust for taxes and inflation. A short project and a long project can have the same total ROI despite very different timing. Use an annualized method when a comparable yearly rate is the question."
    }
  ],
  "/tools/investment-return-profiler/stock-average-calculator": [
    {
      "heading": "Enter share quantities as well as prices",
      "body": "An average purchase price must account for the number of shares bought at each price. Enter the first purchase price and quantity, then the second purchase price and quantity. The calculator adds both purchase costs and divides by the combined quantity. Use the same currency and compatible share units, particularly if historical purchases were affected by a split or another corporate action."
    },
    {
      "heading": "Worked example: unequal purchases",
      "body": "Buying 10 shares at 100 costs 1,000. Buying another 20 shares at 80 costs 1,600. The combined cost is 2,600 for 30 shares, giving an average of approximately 86.67 per share. Simply averaging the two prices would give 90 and ignore the larger second purchase. The weighted average is the relevant arithmetic for this two-purchase example."
    },
    {
      "heading": "Understand what the average does not show",
      "body": "The displayed average is not the current market price, a forecast, or a recommendation to make another purchase. Brokerage fees, tax-lot rules, sales, dividends, and corporate actions are not automatically included. Keep transaction records and reconcile the total quantity with your own holdings. A lower average purchase price does not by itself indicate lower risk or a future gain."
    }
  ],
  "/tools/investment-return-profiler/swp-calculator": [
    {
      "heading": "Understand the withdrawal sequence",
      "body": "This calculator starts with an account balance, applies a monthly rate derived from the entered annual assumption, and subtracts the monthly withdrawal. It repeats that sequence for the entered number of years or until the balance reaches zero. The return is constant in this model. It does not simulate market prices or the different order in which positive and negative returns might occur."
    },
    {
      "heading": "Worked example with no growth",
      "body": "With a starting balance of 12,000, a withdrawal of 500 per month, a zero return, and one year, the ending balance is 6,000. Increasing the withdrawal to 1,000 uses the full starting balance over twelve months under those assumptions. A positive rate changes the result because each withdrawal follows the month’s modeled growth rather than being removed from a static balance."
    },
    {
      "heading": "Treat the balance as one scenario",
      "body": "An ending balance is not a guaranteed withdrawal income or evidence that a plan will remain sustainable. Taxes, charges, inflation, changing withdrawals, and variable returns can materially affect actual outcomes. Compare several clearly labeled assumptions and retain the starting figures with the result. The tool reports a modeled ending balance; it does not select an investment or evaluate your personal retirement needs."
    }
  ],
  "/tools/loan-amortization-suite/home-loan-emi": [
    {
      "heading": "Separate the mortgage from other housing costs",
      "body": "Use the amount borrowed after the deposit, the annual interest rate, and the term in years. The monthly figure covers principal and interest in the fixed-rate model. Property taxes, insurance, maintenance, association charges, and lender fees can add to the overall cost but are not automatically included in the payment. Keep those amounts separate when comparing the output with a household budget."
    },
    {
      "heading": "A simple payment example",
      "body": "For a 120,000 loan at 0% interest over ten years, the principal-only monthly payment is 1,000. At a positive rate, the modeled payment is higher because interest is included. This simple zero-rate example checks that the borrowed amount and number of monthly payments are entered consistently. It is an illustration of arithmetic rather than an available mortgage offer."
    },
    {
      "heading": "Read the schedule and the actual agreement",
      "body": "The amortization schedule separates each modeled payment into interest and principal. Early payments usually contain more interest than later ones when a positive rate applies to a declining balance. Payment dates, rounding, variable rates, fees, and contract rules can produce different actual figures. Check a lender’s repayment schedule and agreement for a real offer, and label any extra-payment assumptions used in your comparison."
    }
  ],
  "/tools/loan-amortization-suite/car-loan-emi": [
    {
      "heading": "Use the financed balance",
      "body": "Start with the amount actually financed after any deposit or trade-in. Include financed fees in that amount only if they are part of the borrowing you want to model. Enter the annual rate and loan duration consistently. The estimate describes a fixed monthly principal-and-interest payment, not the complete monthly cost of running a vehicle. Insurance, fuel, maintenance, and separately paid charges remain outside it."
    },
    {
      "heading": "A simple payment example",
      "body": "A 24,000 balance at 0% interest over four years gives 48 payments of 500 before any separate costs. Adding interest increases the modeled payment. Keeping the balance and rate constant while changing the term shows the payment and interest trade-off more clearly than comparing offers that also use different deposits. The example is a calculation check, not a financing quote."
    },
    {
      "heading": "Read the schedule and the actual agreement",
      "body": "The amortization schedule separates each modeled payment into interest and principal. Early payments usually contain more interest than later ones when a positive rate applies to a declining balance. Payment dates, rounding, variable rates, fees, and contract rules can produce different actual figures. Check a lender’s repayment schedule and agreement for a real offer, and label any extra-payment assumptions used in your comparison."
    }
  ],
  "/tools/loan-amortization-suite/personal-loan-emi": [
    {
      "heading": "Compare like-for-like loan terms",
      "body": "Enter the loan principal, annual rate, and repayment term. If an origination charge is deducted from the money you receive, distinguish that received amount from the balance used to calculate payments. The model uses fixed monthly payments and a constant rate. It does not automatically determine a lender’s effective borrowing cost or include charges that are absent from the entered principal."
    },
    {
      "heading": "A simple payment example",
      "body": "A 12,000 principal at 0% interest over two years gives a monthly principal payment of 500. A positive rate increases the monthly payment and total repayment. When comparing terms, keep the principal constant so you can see the effect of rate or duration. Use the schedule to review the modeled balance reduction rather than interpreting the headline payment as a complete affordability assessment."
    },
    {
      "heading": "Read the schedule and the actual agreement",
      "body": "The amortization schedule separates each modeled payment into interest and principal. Early payments usually contain more interest than later ones when a positive rate applies to a declining balance. Payment dates, rounding, variable rates, fees, and contract rules can produce different actual figures. Check a lender’s repayment schedule and agreement for a real offer, and label any extra-payment assumptions used in your comparison."
    }
  ],
  "/tools/loan-amortization-suite/prepayment-calculator": [
    {
      "heading": "Model an extra monthly principal payment",
      "body": "The extra-payment input represents an additional amount paid each month on top of the modeled regular payment. It is different from a single lump-sum payment made on a particular date. Keep the loan principal, rate, and original term consistent when comparing the base and extra-payment scenarios. The calculation assumes the additional money reduces the balance according to the model rather than being held for future installments."
    },
    {
      "heading": "Worked example without interest",
      "body": "A 12,000 balance over two years at 0% has a regular payment of 500. Adding 100 each month raises the total monthly payment to 600 and repays that balance in twenty months. With interest, the comparison also reflects reduced interest on the declining balance. The exact final payment may be smaller than a full regular payment when only a small amount remains."
    },
    {
      "heading": "Check the contract before using the scenario",
      "body": "Actual lenders can have different rules for allocating overpayments, changing the payment amount, or shortening the term. Fees or limits may also apply. This calculator does not read your loan agreement or determine whether an overpayment is permitted. Compare its result with a lender-provided quote for the same dates and amounts. Use the savings figure as a modeled comparison rather than a guaranteed settlement amount."
    }
  ],
  "/tools/wealth-inflation-matrix/compound-interest-calculator": [
    {
      "heading": "Understand the annual compounding model",
      "body": "The tool grows one starting amount using the entered annual percentage rate for the specified number of years. Interest becomes part of the balance used in the next year’s calculation. It does not include regular additional deposits, withdrawals, fees, or automatic tax deductions. Use one consistent currency and distinguish an annual rate from a monthly rate before entering the figures."
    },
    {
      "heading": "Worked example: interest earning interest",
      "body": "Starting with 1,000 at 10% for two years gives 1,100 after the first year and 1,210 after the second. The second year adds 110 because the rate applies to the increased balance. Total growth is 210 rather than the 200 produced by applying the rate only to the original amount twice. The example describes the formula, not a promised investment rate."
    },
    {
      "heading": "Keep comparisons consistent",
      "body": "Change one assumption at a time to see the effect of the rate, period, or initial amount. The entered rate remains constant throughout this projection, which can differ from a real account or market-linked investment. Inflation affects purchasing power separately from the nominal balance shown here. Keep the assumptions with the output and use actual product information when checking a specific account’s compounding method."
    }
  ],
  "/tools/wealth-inflation-matrix/inflation-calculator": [
    {
      "heading": "Project a future price from today’s cost",
      "body": "Enter a current cost, an assumed annual inflation percentage, and a future period in years. The calculator compounds that percentage to estimate a future nominal cost. It does not retrieve a historical price index or predict future official inflation. The same item can change in price differently from a broad inflation measure, so label the rate as an assumption in any comparison."
    },
    {
      "heading": "Worked example: a repeated percentage increase",
      "body": "A current cost of 100 at an assumed 5% annual increase becomes 105 after one year and 110.25 after two years, before the display rounds the result. The second increase applies to 105 rather than the original 100. This is why a ten-year projection differs from simply multiplying the annual percentage by ten and adding that percentage once."
    },
    {
      "heading": "Distinguish cost from investment growth",
      "body": "The output estimates the future price of the entered item or expense under the chosen assumption. It is not the interest earned by an account and does not say whether income or savings will keep pace. Taxes, exchange rates, and changes in the item itself are not modeled. Compare several assumptions if you want to see how sensitive the arithmetic is to the chosen percentage."
    }
  ],
  "/tools/wealth-inflation-matrix/net-worth-calculator": [
    {
      "heading": "Take a consistent snapshot",
      "body": "Net worth is total assets minus total debts at a particular time. Use values in the same currency and from a consistent date. Assets may include cash and other items you own, while liabilities are amounts owed. Avoid counting the same asset twice, such as including an account within a portfolio total and again as a separate balance. Keep notes explaining your valuation method."
    },
    {
      "heading": "Worked example: assets and liabilities",
      "body": "With assets of 100,000 and debts of 35,000, the result is 65,000. If the debt figure rises to 110,000 while assets stay the same, net worth is negative 10,000. The difference describes the entered balance sheet. It does not mean that every asset can be sold immediately for the value entered or that all debts are due at once."
    },
    {
      "heading": "Use the result with its limits",
      "body": "A net-worth total does not measure monthly cash flow, available emergency cash, or the cost of selling an asset. Estimated property values and investment balances can change, while sale fees or taxes may reduce proceeds. For comparisons over time, apply the same categories and valuation approach. This calculator performs the subtraction; it does not value assets, verify ownership, or retrieve balances from financial accounts."
    }
  ],
  "/tools/wealth-inflation-matrix/salary-calculator": [
    {
      "heading": "Use matching annual and monthly inputs",
      "body": "The tool combines annual gross salary and annual bonus, divides that total by twelve, and subtracts the entered monthly deductions. It is a simple monthly average rather than a country-specific payroll or income-tax engine. Put annual amounts in the annual fields and monthly amounts in the deduction field. Mixing these periods can create a large error even when each source figure is correct."
    },
    {
      "heading": "Worked example: an averaged bonus",
      "body": "An annual salary of 60,000 plus an annual bonus of 12,000 gives an average gross monthly amount of 6,000. Subtracting 1,000 in monthly deductions gives an estimated 5,000. The bonus is spread across all twelve months in this arithmetic, even if an employer pays it once a year. A normal payslip may therefore differ from the average displayed here."
    },
    {
      "heading": "Compare with actual payroll information",
      "body": "The calculator does not determine tax bands, social contributions, allowances, or local employment rules. Enter deductions from information you already have and compare the result with payroll records. Payment frequency and variable bonuses can also change cash received in a particular month. If deductions exceed the calculated average gross amount, the displayed take-home estimate is floored at zero rather than modeling a negative payslip."
    }
  ],
  "/tools/savings-retirement-hub/gratuity-calculator": [
    {
      "heading": "Identify the salary basis before entering a value",
      "body": "This tool uses the entered last-drawn basic salary plus dearness allowance and years of service in its stated simplified formula. That salary basis is different from total compensation, annual salary, or take-home pay. Check the field labels and the basis used in your employment records. The calculator cannot determine coverage, eligibility, qualifying service, or which legal or contractual provisions apply to an individual settlement."
    },
    {
      "heading": "Illustration of the displayed formula",
      "body": "With a salary basis of 26,000 and ten entered years, the formula 15 × salary × years ÷ 26 gives 150,000. This example demonstrates the tool’s multiplication and division only. It does not establish an entitlement or account for a statutory ceiling, service-rounding rule, tax treatment, or an employer’s specific policy. Use the same salary period and service basis when checking the arithmetic."
    },
    {
      "heading": "Reconcile with an employer calculation",
      "body": "Keep the underlying salary record, joining and leaving dates, and the employer’s settlement explanation available for comparison. A difference can arise from service treatment or the salary definition rather than from arithmetic. The page is an educational estimate and does not automatically apply every current rule. Confirm the applicable basis and any legal or policy limits with the employer or a qualified professional before relying on a payout amount."
    }
  ],
  "/fr/tools/jwt-decoder": [
    {
      "heading": "Lire les différentes parties du jeton",
      "body": "Un JWT contient généralement un en-tête, une charge utile et une signature, séparés par des points. Le décodeur permet de lire les deux premières parties quand elles utilisent le format attendu. Les champs peuvent indiquer un émetteur, un destinataire ou une date d’expiration. Leur présence ne prouve pas que le jeton est authentique : une personne peut fabriquer un contenu lisible sans posséder la clé de signature."
    },
    {
      "heading": "Décodage et validation sont deux opérations distinctes",
      "body": "Le décodage transforme une représentation encodée en données lisibles. La validation vérifie notamment la signature avec une clé appropriée et contrôle les règles de l’application. Ne considérez donc pas le résultat affiché comme une autorisation d’accès. Pour comprendre une erreur, comparez les champs attendus par votre application avec le contenu du jeton, puis utilisez votre système d’authentification pour effectuer la vérification complète."
    },
    {
      "heading": "Protéger les informations du jeton",
      "body": "Un jeton peut contenir des identifiants, des informations personnelles ou des droits d’accès. Utilisez de préférence un exemple de test lorsque vous expliquez un problème et évitez de publier un jeton actif dans une capture d’écran. Les valeurs temporelles peuvent être exprimées en secondes Unix : vérifiez les unités avant de comparer une expiration à une date locale. Conservez les règles de sécurité dans votre application, indépendamment de cet outil de lecture."
    }
  ],
  "/fr/tools/webp-to-pdf": [
    {
      "heading": "Préparer une image pour un document",
      "body": "Cette conversion est utile lorsqu’un destinataire demande un PDF alors que votre image est au format WebP. Le PDF contient une représentation de l’image ; il ne transforme pas automatiquement le texte photographié en texte sélectionnable. Gardez le fichier source pour d’autres usages et vérifiez que l’image contient bien tous les éléments nécessaires avant de créer la copie destinée au partage."
    },
    {
      "heading": "Contrôler le résultat dans un lecteur PDF",
      "body": "Ouvrez le téléchargement et vérifiez l’orientation, les bords et la netteté. La taille apparente dans un lecteur ne suffit pas à connaître les dimensions d’impression. Avant de lancer une impression, contrôlez le papier choisi et l’option de mise à l’échelle. Une petite image peut sembler nette à l’écran mais devenir floue lorsqu’elle est agrandie sur une feuille entière."
    },
    {
      "heading": "Comprendre les limites du changement de format",
      "body": "Un export PDF ne restaure pas les détails perdus dans l’image d’origine et ne garantit pas un fichier plus léger. Une animation WebP ne doit pas être considérée comme préservée dans une page PDF statique. Si le destinataire demande une page A4, des marges ou une résolution précise, vérifiez ces critères dans le fichier final plutôt que de vous fier uniquement à son extension."
    }
  ],
  "/it/tools/extract-pdf-pages": [
    {
      "heading": "Scegliere le pagine prima di esportare",
      "body": "L’estrazione crea un documento con le pagine selezionate, senza richiedere di condividere l’intero PDF originale. Annota prima quali pagine servono e controlla la numerazione mostrata dal visualizzatore. Un documento può avere una copertina o pagine preliminari che non corrispondono ai numeri stampati nel testo. Usa la posizione effettiva della pagina nel file per evitare di includere una sezione diversa da quella desiderata."
    },
    {
      "heading": "Verificare ordine e completezza",
      "body": "Apri il PDF scaricato e confronta la prima e l’ultima pagina con la selezione prevista. Controlla anche tabelle o capitoli che continuano nella pagina successiva: estrarre una sola pagina può lasciare fuori una nota importante. Conserva il documento completo separatamente. La copia estratta è utile per inviare un allegato mirato, ma deve mantenere abbastanza contesto per essere comprensibile al destinatario."
    },
    {
      "heading": "Cosa non viene eliminato automaticamente",
      "body": "Estrarre pagine non equivale a oscurare informazioni riservate all’interno delle pagine conservate. Testo, immagini e altri contenuti visibili possono rimanere nel risultato. Se il file contiene firme digitali o funzioni interattive, verifica il loro comportamento dopo la modifica. Prima di condividere il documento, controlla la copia esportata in un lettore PDF e assicurati che contenga soltanto il materiale che intendevi inviare."
    }
  ],
  "/it/tools/extract-pdf-text": [
    {
      "heading": "Distinguere testo selezionabile e scansioni",
      "body": "Un PDF può contenere testo vero oppure immagini di pagine stampate. L’estrazione legge il testo disponibile nel documento; non deve essere confusa con il riconoscimento ottico dei caratteri di una scansione. Se il risultato è vuoto, prova a selezionare una parola nel visualizzatore del PDF originale. Una pagina composta soltanto da un’immagine richiede un processo OCR per ottenere parole ricercabili."
    },
    {
      "heading": "Controllare la sequenza delle parole",
      "body": "L’ordine interno del testo può differire dall’ordine visivo della pagina. Colonne, intestazioni, note a piè di pagina e tabelle possono essere estratte in una sequenza inattesa. Confronta un campione con l’originale prima di riutilizzare il testo. Un elenco di valori separati da spazi non conserva necessariamente le relazioni tra righe e colonne presenti in una tabella impaginata."
    },
    {
      "heading": "Usare il testo con una copia di riferimento",
      "body": "Mantieni il PDF originale insieme all’esportazione quando precisione e contesto sono importanti. Verifica accenti, simboli, numeri e interruzioni di riga, soprattutto nei documenti tecnici. L’estrazione non corregge errori già presenti nel file e non ricrea automaticamente immagini o grafici. Se devi citare una sezione, controlla le parole sulla pagina originale e annota il riferimento della pagina corretta."
    }
  ],
  "/it/tools/flatten-pdf": [
    {
      "heading": "Capire lo scopo dell’appiattimento",
      "body": "L’appiattimento serve a rendere statici alcuni elementi che prima potevano essere interattivi, come campi o annotazioni, secondo le funzioni supportate dallo strumento. È utile quando vuoi distribuire una copia con l’aspetto finale del documento. Conserva sempre una versione modificabile separata: una copia appiattita può non consentire le stesse correzioni o la compilazione dei campi presenti nel file originale."
    },
    {
      "heading": "Controllare moduli e annotazioni",
      "body": "Prima dell’esportazione, verifica che i campi siano compilati e che i commenti o segni necessari siano visibili. Dopo il download, apri il risultato in un lettore PDF e confrontalo pagina per pagina nelle sezioni importanti. Testo piccolo, caselle di controllo e campi lunghi meritano attenzione. L’obiettivo è controllare l’aspetto effettivo della copia, non soltanto ottenere un file con un nome diverso."
    },
    {
      "heading": "Non confondere appiattimento e protezione",
      "body": "Un documento statico non è automaticamente protetto da copia, modifica o recupero delle informazioni. L’appiattimento non sostituisce una corretta oscurazione dei dati riservati e può influire sulle firme digitali. Se il destinatario richiede ancora campi compilabili, invia una versione adatta a quel compito. Verifica il comportamento del risultato e conserva il sorgente prima di usare l’esportazione come versione definitiva."
    }
  ],
  "/it/tools/heic-to-pdf": [
    {
      "heading": "Trasformare una foto in un allegato PDF",
      "body": "Una foto HEIC può essere difficile da aprire in alcune applicazioni, mentre un destinatario potrebbe richiedere un documento PDF. La conversione inserisce l’immagine decodificata in una pagina. Non riconosce automaticamente le parole di una ricevuta o di un modulo fotografato e non crea testo modificabile. Conserva la foto originale se ti servono anche un’esportazione immagine o le informazioni della fotocamera."
    },
    {
      "heading": "Verificare orientamento e stampa",
      "body": "Apri il PDF ottenuto e controlla che la foto sia orientata correttamente e che i bordi importanti siano presenti. Una pagina creata da un’immagine non deve essere considerata automaticamente una pagina A4 con margini standard. Se vuoi stamparla, verifica il formato della carta e il ridimensionamento nel lettore. L’ingrandimento di una foto piccola può ridurre la nitidezza del testo e dei particolari."
    },
    {
      "heading": "Se il file non viene convertito",
      "body": "Attendi il caricamento del componente necessario alla decodifica e utilizza un browser aggiornato. Un file HEIC può contenere più immagini o funzioni che non vengono mantenute nell’esportazione; controlla quale immagine compare nel PDF. Un errore può dipendere da dati danneggiati o da limiti di memoria. Prova prima una foto più piccola e confronta sempre il risultato con il file sorgente."
    }
  ],
  "/it/tools/image-to-pdf": [
    {
      "heading": "Organizzare le immagini per un documento",
      "body": "La conversione in PDF è utile per preparare una copia da inviare quando il destinatario richiede un documento anziché singole fotografie. Prima di iniziare, controlla che le immagini siano leggibili e orientate correttamente. Un PDF può contenere foto, ma non rende automaticamente selezionabile il testo fotografato. Mantieni gli originali per eventuali modifiche, ritagli o esportazioni in altri formati."
    },
    {
      "heading": "Controllare dimensioni e margini",
      "body": "Apri il risultato e verifica i bordi, la disposizione e la nitidezza delle immagini. Se devi rispettare un formato preciso, controlla le dimensioni effettive della pagina nel visualizzatore. Il formato dell’immagine e quello del foglio sono due cose diverse. Prima della stampa, verifica anche se il programma adatta la pagina alla carta o mantiene la dimensione originale del documento."
    },
    {
      "heading": "Preparare una copia facile da leggere",
      "body": "Per ricevute e documenti fotografati, controlla soprattutto date, importi e scritte piccole. La conversione non corregge automaticamente una foto sfocata, riflessi o una prospettiva molto inclinata. Quando condividi il PDF, verifica anche il peso del file rispetto al limite dell’allegato. Conserva una versione di qualità sufficiente invece di ridurre il documento fino a rendere difficile la lettura."
    }
  ],
  "/it/tools/jpg-to-pdf": [
    {
      "heading": "Usare una foto JPG come pagina PDF",
      "body": "Questo passaggio è utile per allegare una fotografia o una scansione quando un modulo accetta PDF. L’immagine viene inserita nel documento, ma non diventa automaticamente testo ricercabile. Controlla prima il JPG originale: dettagli mancanti, compressione evidente o parti tagliate non vengono riparati cambiando formato. Tieni il sorgente separato per poter produrre un’altra copia se necessario."
    },
    {
      "heading": "Controllare la qualità alla dimensione finale",
      "body": "Una fotografia può sembrare nitida in una piccola anteprima e risultare sfocata quando occupa un’intera pagina stampata. Apri il PDF, ingrandisci il testo o i dettagli importanti e verifica il risultato. Se devi stampare, controlla formato carta e scala nel programma utilizzato. Il numero di pixel della foto resta importante anche quando l’immagine viene confezionata in un documento PDF."
    },
    {
      "heading": "PDF non significa un file più piccolo",
      "body": "Il peso finale dipende dall’immagine e dal modo in cui viene inserita nel documento. Non aspettarti che ogni conversione riduca le dimensioni rispetto al JPG originale. Se esiste un limite di caricamento, confronta peso e leggibilità della copia finale. Verifica inoltre orientamento e contenuto prima dell’invio, soprattutto quando una ricevuta o una firma deve essere completamente visibile."
    }
  ],
  "/it/tools/webp-to-pdf": [
    {
      "heading": "Quando serve una copia PDF di un WebP",
      "body": "Un’immagine WebP può essere adatta a una pagina web, mentre un destinatario può richiedere un PDF come allegato. Il cambiamento di formato crea un documento contenente l’immagine, senza aggiungere dettagli mancanti o riconoscere automaticamente il testo. Prima della conversione, controlla che il contenuto da condividere sia completo e conserva l’originale per eventuali esportazioni successive."
    },
    {
      "heading": "Verificare immagini statiche e animazioni",
      "body": "Una pagina PDF statica non deve essere considerata un modo per conservare un’animazione WebP. Controlla quale rappresentazione dell’immagine compare nel documento scaricato e confrontala con il sorgente. Se il movimento è parte essenziale del messaggio, scegli un formato di consegna che lo supporti. Anche trasparenza, bordi e colori vanno verificati nel lettore utilizzato dal destinatario."
    },
    {
      "heading": "Preparare il file per stampa o invio",
      "body": "Apri il risultato e verifica orientamento, nitidezza e dimensioni della pagina. Un PDF non è automaticamente A4 e non garantisce un peso inferiore all’immagine WebP. Se devi rispettare un limite di allegato o una misura di stampa, controlla entrambi sul file esportato. Le opzioni di adattamento del visualizzatore possono modificare la dimensione stampata senza cambiare il contenuto originale."
    }
  ],
  "/it/tools/pdf-page-size-checker": [
    {
      "heading": "Leggere le dimensioni del documento",
      "body": "Il controllo delle dimensioni serve a capire quanto misura una pagina PDF, non quanti pixel contiene un’immagine al suo interno. Un documento può avere pagine di misure diverse anche se le anteprime sembrano simili. Esamina le pagine rilevanti prima di stampare, unire documenti o inviare un file a una tipografia. La dimensione visualizzata sullo schermo dipende anche dallo zoom e non è una misura fisica affidabile."
    },
    {
      "heading": "Confrontare il risultato con il formato richiesto",
      "body": "A4 misura 210 × 297 mm, mentre A3 misura 297 × 420 mm. In orientamento orizzontale larghezza e altezza si scambiano. Piccole differenze possono derivare dagli arrotondamenti delle unità, ma un formato Letter non coincide con A4. Se il destinatario richiede una misura precisa, confronta entrambe le dimensioni e controlla se il file contiene pagine fuori formato."
    },
    {
      "heading": "Dimensione pagina e qualità sono distinte",
      "body": "Una pagina delle dimensioni corrette può comunque contenere una scansione poco nitida. Questo controllo non aumenta la risoluzione e non certifica margini, abbondanza o qualità di stampa. Verifica separatamente i requisiti della tipografia e le impostazioni del programma di stampa. Prima di produrre molte copie, usa una prova per controllare che il ridimensionamento automatico non alteri le misure previste."
    }
  ],
  "/it/tools/pdf-word-counter": [
    {
      "heading": "Capire quali parole possono essere contate",
      "body": "Il conteggio dipende dal testo che il PDF rende disponibile. Una scansione composta da immagini può avere molte parole visibili ma nessun testo estraibile, mentre un documento con OCR può contenere uno strato di testo riconosciuto. Controlla una pagina rappresentativa prima di interpretare il totale. Questo strumento non deve essere considerato un riconoscitore automatico del testo nelle fotografie o nelle scansioni prive di OCR."
    },
    {
      "heading": "Perché due conteggi possono differire",
      "body": "Programmi diversi possono separare le parole in modi differenti quando incontrano apostrofi, trattini, numeri o interruzioni di riga. Intestazioni, note e testo ripetuto possono influire sul totale estratto. Per un limite editoriale o accademico, usa il metodo richiesto dal destinatario e chiarisci quali parti del documento devono essere incluse. Un conteggio automatico è utile solo insieme a una definizione coerente del testo da misurare."
    },
    {
      "heading": "Verificare un risultato inatteso",
      "body": "Se il numero è molto basso, prova a selezionare e copiare una frase dal PDF originale. Se il testo copiato manca o è confuso, anche il conteggio può esserlo. Controlla un campione di pagine con tabelle, colonne e simboli. Conserva il documento sorgente quando disponibile e confronta il risultato prima di usarlo per dichiarare la lunghezza definitiva di un manoscritto."
    }
  ],
  "/it/tools/unix-timestamp-converter": [
    {
      "heading": "Distinguere secondi e millisecondi",
      "body": "Un timestamp Unix rappresenta un intervallo rispetto all’inizio dell’epoca Unix. Molti sistemi usano secondi, mentre altri usano millisecondi. Una differenza di unità può portare a una data completamente diversa da quella prevista. Controlla la documentazione della sorgente prima di convertire un valore. La lunghezza del numero può essere un indizio, ma non sostituisce la conoscenza dell’unità effettivamente utilizzata dal sistema."
    },
    {
      "heading": "Confrontare UTC e ora locale",
      "body": "Lo stesso istante può essere mostrato con orari diversi a seconda del fuso. Quando confronti un log, una risposta API e l’orologio del computer, verifica quale rappresentazione stai leggendo. UTC non cambia con l’ora legale, mentre un fuso locale può avere uno scostamento diverso in date differenti. Annota il fuso insieme alla data convertita per evitare ambiguità nelle comunicazioni o nei controlli tecnici."
    },
    {
      "heading": "Fare una prova con un valore noto",
      "body": "Prima di convertire molti dati, usa un timestamp di cui conosci la data attesa e confronta il risultato con il sistema sorgente. Evita di confondere una durata con una data assoluta: entrambe possono essere numeri di secondi, ma hanno significati diversi. Se i risultati sono spostati di ore, controlla il fuso; se sono lontani di anni, verifica unità, segno e formato del valore."
    }
  ]
};
