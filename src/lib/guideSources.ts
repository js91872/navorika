export interface GuideSource { name: string; url: string }

const webImageFormats = { name: 'MDN Web Docs — Image file type and format guide', url: 'https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types' };
const pdfSpecification = { name: 'PDF Association — ISO 32000 (PDF specification)', url: 'https://pdfa.org/resource/iso-32000-pdf/' };

export const guideSources: Record<string, GuideSource[]> = {
  'video-editing-software-for-mac': [
    { name: 'Apple — iMovie for Mac', url: 'https://www.apple.com/imovie/' },
    { name: 'Apple — Final Cut Pro', url: 'https://www.apple.com/final-cut-pro/' },
    { name: 'Blackmagic Design — DaVinci Resolve', url: 'https://www.blackmagicdesign.com/products/davinciresolve' },
    { name: 'Adobe — Premiere Pro', url: 'https://www.adobe.com/products/premiere.html' },
  ],
  'free-video-editing-software-for-mac': [
    { name: 'Apple — iMovie for Mac', url: 'https://www.apple.com/imovie/' },
    { name: 'Blackmagic Design — DaVinci Resolve', url: 'https://www.blackmagicdesign.com/products/davinciresolve' },
    { name: 'Shotcut — Official site', url: 'https://shotcut.org/' },
    { name: 'Kdenlive — Official site', url: 'https://kdenlive.org/' },
  ],
  'professional-video-editing-software-for-mac': [
    { name: 'Apple — Final Cut Pro', url: 'https://www.apple.com/final-cut-pro/' },
    { name: 'Blackmagic Design — DaVinci Resolve', url: 'https://www.blackmagicdesign.com/products/davinciresolve' },
    { name: 'Adobe — Premiere Pro', url: 'https://www.adobe.com/products/premiere.html' },
  ],
  'easy-video-editing-software-for-mac': [
    { name: 'Apple — iMovie for Mac', url: 'https://www.apple.com/imovie/' },
    { name: 'Blackmagic Design — DaVinci Resolve', url: 'https://www.blackmagicdesign.com/products/davinciresolve' },
    { name: 'Apple Support — iMovie User Guide for Mac', url: 'https://support.apple.com/guide/imovie/welcome/mac' },
  ],
  'psd-to-html-conversion-guide': [
    { name: 'W3C — HTML Living Standard', url: 'https://html.spec.whatwg.org/' },
    { name: 'W3C — CSS Flexible Box Layout Module Level 1', url: 'https://www.w3.org/TR/css-flexbox-1/' },
    { name: 'MDN Web Docs — Responsive design basics', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design' },
    webImageFormats,
  ],
  'psd-to-html-email': [
    { name: 'Can I Email — Support tables for HTML and CSS in email', url: 'https://www.caniemail.com/' },
    { name: 'Microsoft Learn — Word HTML and CSS Rendering Capabilities in Outlook', url: 'https://learn.microsoft.com/en-us/previous-versions/office/developer/office-2007/aa338201(v=office.12)' },
  ],
  'psd-to-responsive-html': [
    { name: 'W3C — CSS Flexible Box Layout Module Level 1', url: 'https://www.w3.org/TR/css-flexbox-1/' },
    { name: 'W3C — CSS Grid Layout Module Level 2', url: 'https://www.w3.org/TR/css-grid-2/' },
    { name: 'MDN Web Docs — Responsive design basics', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design' },
    webImageFormats,
  ],
  'word-to-cdr-formatting-guide': [{ name: 'LibreOffice Help — PDF export', url: 'https://help.libreoffice.org/latest/en-US/text/shared/01/ref_pdf_export.html' }, { name: 'Unicode Consortium — Unicode Standard', url: 'https://www.unicode.org/standard/standard.html' }],
  'pdf-to-cdr-editing-guide': [
    pdfSpecification,
    { name: 'CorelDRAW Help — Importing PDF and EPS files', url: 'https://product.corel.com/help/CorelDRAW/' },
    { name: 'Adobe Acrobat — Prepress and PDF/X export standards', url: 'https://helpx.adobe.com/acrobat/using/pdf-x-pdf-a-pdf.html' },
  ],
  'raster-image-to-cdr-guide': [webImageFormats, { name: 'W3C — SVG 2 specification', url: 'https://www.w3.org/TR/SVG2/' }],
  'svg-vs-cdr-guide': [{ name: 'W3C — SVG 2 specification', url: 'https://www.w3.org/TR/SVG2/' }, { name: 'CorelDRAW Help', url: 'https://product.corel.com/help/CorelDRAW/' }],
  'open-cdr-without-coreldraw': [{ name: 'The Document Foundation — LibreOffice CorelDRAW import release notes', url: 'https://wiki.documentfoundation.org/ReleaseNotes/3.6#CorelDRAW_Import' }, { name: 'libcdr project', url: 'https://wiki.documentfoundation.org/DLP/Libraries/libcdr' }],
  'newer-cdr-older-coreldraw': [{ name: 'CorelDRAW Help', url: 'https://product.corel.com/help/CorelDRAW/' }, pdfSpecification],
  'best-coreldraw-print-format': [pdfSpecification, { name: 'W3C — SVG 2 specification', url: 'https://www.w3.org/TR/SVG2/' }],
  'preserve-fonts-coreldraw-conversion': [{ name: 'Unicode Consortium — Unicode Standard', url: 'https://www.unicode.org/standard/standard.html' }, pdfSpecification],
  'how-to-calculate-sip-returns': [{ name: 'SEBI Investor — Mutual fund investor education', url: 'https://investor.sebi.gov.in/' }],
  'how-to-calculate-emi': [{ name: 'Reserve Bank of India — Financial education', url: 'https://www.rbi.org.in/financialeducation/' }],
  'bmi-calculator-guide': [{ name: 'World Health Organization — Obesity and overweight', url: 'https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight' }],
  'bmr-tdee-guide': [{ name: 'NIDDK — Body Weight Planner', url: 'https://www.niddk.nih.gov/bwp' }],
  'pdf-compression-guide': [pdfSpecification],
  'how-to-merge-pdf-files': [pdfSpecification],
  'image-compression-guide': [webImageFormats],
  'how-to-resize-images': [webImageFormats],
  'gst-calculation-guide': [{ name: 'Central Board of Indirect Taxes and Customs — GST', url: 'https://cbic-gst.gov.in/' }],
  'pdf-security-guide': [pdfSpecification],
  'heart-rate-zones-guide': [{ name: 'American Heart Association — Target heart rates', url: 'https://www.heart.org/en/healthy-living/exercise-and-physical-activity/fitness-basics/target-heart-rates' }],
  'ppf-vs-fd-comparison': [{ name: 'India Post — Post Office saving schemes', url: 'https://www.indiapost.gov.in/Financial/Pages/Content/Post-Office-Saving-Schemes.aspx' }],
  'base64-encoding-guide': [{ name: 'IETF RFC 4648 — Base-N encodings', url: 'https://www.rfc-editor.org/rfc/rfc4648' }],
  'qr-code-guide': [{ name: 'ISO/IEC 18004 — QR Code specification', url: 'https://www.iso.org/standard/62021.html' }],
  'calorie-deficit-guide': [{ name: 'NIDDK — Body Weight Planner', url: 'https://www.niddk.nih.gov/bwp' }],
  'jwt-decoding-guide': [{ name: 'IETF RFC 7519 — JSON Web Token', url: 'https://www.rfc-editor.org/rfc/rfc7519' }],
  'tax-planning-guide-2026': [{ name: 'Income Tax Department — AY 2026–27 guidance', url: 'https://www.incometax.gov.in/iec/foportal/help/non-company/return-applicable-0' }],
  'macronutrients-guide': [{ name: 'World Health Organization — Healthy diet', url: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet' }],
  'json-formatting-guide': [{ name: 'IETF RFC 8259 — The JSON Data Interchange Format', url: 'https://www.rfc-editor.org/rfc/rfc8259' }],
  'image-formats-guide': [webImageFormats],
  'seo-tools-guide': [{ name: 'Google Search Central — SEO Starter Guide', url: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide' }, { name: 'Google Search Central — Structured data guidelines', url: 'https://developers.google.com/search/docs/appearance/structured-data/sd-policies' }],
  'house-construction-cost-guide': [
        {
            "name": "RICS \u2014 New Rules of Measurement",
            "url": "https://www.rics.org/profession-standards/rics-standards-and-guidance/sector-standards/construction-standards/nrm"
        },
        {
            "name": "ASPE \u2014 Standard Estimating Practice & Cost Models",
            "url": "https://www.aspenational.org/"
        },
        {
            "name": "RSMeans by Gordian \u2014 Building Construction Cost Data",
            "url": "https://www.rsmeans.com/"
        }
    ],
  'water-tank-size-capacity-guide': [
        {
            "name": "NIST \u2014 Guide for the Use of the International System of Units",
            "url": "https://www.nist.gov/pml/special-publication-811"
        },
        {
            "name": "AWWA \u2014 D100 Standard for Welded Carbon Steel Tanks for Water Storage",
            "url": "https://www.awwa.org/Publications/Standards"
        },
        {
            "name": "Bureau of Indian Standards \u2014 IS 1172 Code of Basic Requirements for Water Supply",
            "url": "https://standardsbis.bsbedge.com/"
        }
    ],
  'how-to-calculate-roof-area': [
        {
            "name": "OSHA \u2014 Fall Protection in Residential Construction (29 CFR 1926.501)",
            "url": "https://www.osha.gov/residential-fall-protection/guidance"
        },
        {
            "name": "NRCA \u2014 National Roofing Contractors Association Roofing Manual",
            "url": "https://www.nrca.net/technical"
        },
        {
            "name": "ICC \u2014 International Residential Code (IRC Section R905)",
            "url": "https://codes.iccsafe.org/"
        }
    ],
  'flooring-calculation-guide': [
        {
            "name": "NIST \u2014 SI Units for Area & Measurement Standards",
            "url": "https://www.nist.gov/pml/owm/metric-si/si-units-area"
        },
        {
            "name": "NWFA \u2014 Technical Guidelines for Wood Flooring Installation",
            "url": "https://www.nwfa.org/technical-guidelines/"
        },
        {
            "name": "TCNA \u2014 Handbook for Ceramic, Glass, and Stone Tile Installation",
            "url": "https://www.tcnatile.com/products-and-services/publications.html"
        }
    ],
  'asphalt-calculation-guide': [
        {
            "name": "Federal Highway Administration \u2014 Asphalt Pavement Technology Resources",
            "url": "https://www.fhwa.dot.gov/pavement/asphalt/"
        },
        {
            "name": "NAPA \u2014 National Asphalt Pavement Association Quality Guidelines",
            "url": "https://www.asphaltpavement.org/"
        },
        {
            "name": "Asphalt Institute \u2014 MS-4 The Asphalt Handbook",
            "url": "https://www.asphaltinstitute.org/"
        }
    ],
  'gravel-calculation-guide': [
        {
            "name": "Federal Highway Administration \u2014 Pavement & Aggregate Resources",
            "url": "https://www.fhwa.dot.gov/pavement/"
        },
        {
            "name": "ASTM International \u2014 ASTM C33 Standard Specification for Concrete Aggregates",
            "url": "https://www.astm.org/c0033_c0033m-18.html"
        },
        {
            "name": "AASHTO \u2014 Standard Specifications for Transportation Materials",
            "url": "https://www.transportation.org/"
        }
    ],
  'electricity-cost-calculation-guide': [
        {
            "name": "U.S. Energy Information Administration \u2014 Measuring & Understanding Electricity",
            "url": "https://www.eia.gov/energyexplained/electricity/measuring-electricity.php"
        },
        {
            "name": "U.S. Department of Energy \u2014 Estimating Appliance and Home Electronic Energy Use",
            "url": "https://www.energy.gov/energysaver/estimating-appliance-and-home-electronic-energy-use"
        },
        {
            "name": "AHRI \u2014 Standard 210/240 for Performance Rating of Unitary Air-Conditioning & Heat Pumps",
            "url": "https://www.ahrinet.org/"
        }
    ],
  'brick-calculation-guide': [
        {
            "name": "The Brick Industry Association \u2014 Technical Notes on Brick Construction",
            "url": "https://www.gobrick.com/resources/technical-notes"
        },
        {
            "name": "ASTM International \u2014 ASTM C216 Standard Specification for Facing Brick",
            "url": "https://www.astm.org/c0216-22.html"
        },
        {
            "name": "The Masonry Society \u2014 TMS 402/602 Building Code Requirements and Specification for Masonry Structures",
            "url": "https://masonrysociety.org/"
        }
    ],
  'dimensional-weight-guide': [
        {
            "name": "UPS \u2014 Package Dimensions, Size Limits and Weight Guide",
            "url": "https://www.ups.com/us/en/support/shipping-support/shipping-dimensions-weight"
        },
        {
            "name": "FedEx \u2014 Service Guide: How to Calculate Dimensional Weight",
            "url": "https://www.fedex.com/en-us/shipping/packaging/size-and-weight.html"
        },
        {
            "name": "IATA \u2014 Air Cargo Tariff and Rules (TACT) Volumetric Standards",
            "url": "https://www.iata.org/en/publications/tact/"
        }
    ],
  'construction-estimate-quote-guide': [
        {
            "name": "RICS \u2014 New Rules of Measurement (NRM)",
            "url": "https://www.rics.org/profession-standards/rics-standards-and-guidance/sector-standards/construction-standards/nrm"
        },
        {
            "name": "AACE International \u2014 Recommended Practice 17R-97 Cost Estimate Classification System",
            "url": "https://web.aacei.org/"
        },
        {
            "name": "American Institute of Architects \u2014 AIA Contract Documents Primer",
            "url": "https://www.aiacontracts.org/"
        }
    ],
  'step-to-3d-pdf-conversion-guide': [
    { name: 'ISO 10303-21 — STEP clear text encoding of the exchange structure', url: 'https://www.iso.org/standard/63141.html' },
    { name: 'ISO 14739-1 — Product representation compact (PRC) format', url: 'https://www.iso.org/standard/54948.html' },
    pdfSpecification,
    { name: 'Open CASCADE Technology — 3D data exchange documentation', url: 'https://dev.opencascade.org/doc/overview/html/index.html' },
    { name: 'Adobe Acrobat — Displaying 3D models in PDFs', url: 'https://helpx.adobe.com/acrobat/using/displaying-3d-models-pdfs.html' },
  ],
  'rgb-vs-cmyk-for-printing': [
    { name: 'International Color Consortium — Specification ICC.1:2010', url: 'https://www.color.org/specification/ICC1v43_2010-12.pdf' },
    { name: 'ISO 12647-2 — Process control for offset lithographic processes', url: 'https://www.iso.org/standard/63254.html' },
    { name: 'Adobe Systems — TIFF Revision 6.0 Specification', url: 'https://www.adobe.io/open/standards/TIFF.html' },
    { name: 'W3C — Portable Network Graphics (PNG) Specification', url: 'https://www.w3.org/TR/png/' },
    { name: 'Adobe Help — Color management and rendering intents', url: 'https://helpx.adobe.com/photoshop/using/color-settings.html' },
  ],
  'print-bleed-trim-safe-area-guide': [
    { name: 'ISO 32000-1 — PDF Page Boundaries (Section 14.11.2)', url: 'https://pdfa.org/resource/iso-32000-pdf/' },
    { name: 'Ghent Workgroup — Prepress specifications and PDF/X guidelines', url: 'https://gwg.org/' },
    { name: 'ISO 12647-2 — Process control for graphic technology', url: 'https://www.iso.org/standard/63254.html' },
  ],
  'eps-vs-cdr-guide': [
    { name: 'Adobe Systems — Encapsulated PostScript File Format Specification (Tech Note #5002)', url: 'https://www.adobe.com/content/dam/acom/en/devnet/actionscript/articles/5002.EPSF_Spec.pdf' },
    { name: 'CorelDRAW Help — File format import and export reference', url: 'https://product.corel.com/help/CorelDRAW/' },
    { name: 'Ghent Workgroup — Prepress workflow recommendations', url: 'https://gwg.org/' },
  ],
  'how-to-save-a-screenshot-as-a-pdf': [
    { name: 'Apple Support — Take a screenshot on iPhone', url: 'https://support.apple.com/en-in/102616' },
    { name: 'Apple Support — Export PDFs and images in Preview on iPhone', url: 'https://support.apple.com/en-by/guide/iphone/iph61c20afe1/ios' },
    { name: 'Apple Support — Take a screenshot on Mac', url: 'https://support.apple.com/en-in/102646' },
    { name: 'Apple Support — Save a document as a PDF on Mac', url: 'https://support.apple.com/en-gb/guide/mac-help/mchlp1531/mac' },
    { name: 'Google Chrome Help — Print from Chrome on Android', url: 'https://support.google.com/chrome/answer/1069693?co=GENIE.Platform%3DAndroid&hl=en' },
    { name: 'Google Android Help — Take a screenshot on Android', url: 'https://support.google.com/android/answer/9075928?hl=en' },
    { name: 'Google Chromebook Help — Open, save, or delete files on your Chromebook', url: 'https://support.google.com/chromebook/answer/1700055?hl=en' },
    { name: 'Microsoft Support — Use Snipping Tool to capture screenshots', url: 'https://support.microsoft.com/en-us/windows/apps/use-snipping-tool-to-capture-screenshots' },
  ],
};

export function getGuideSources(slug: string) {
  return guideSources[slug] ?? [];
}
