import { additionalGuideContent } from './guideContentAdditional';
import { guideContentEnhancements } from './guideContentEnhancements';

export interface GuideSection {
  title: string;
  content: string;
}

export interface GuideFAQ {
  question: string;
  answer: string;
}

export interface GuideContent {
  intro: string;
  sections: GuideSection[];
  faqs: GuideFAQ[];
  summary: string;
  schema: {
    "@context": string;
    "@type": string;
    headline: string;
    description: string;
    author: { "@type": string; name: string };
    datePublished: string;
    dateModified: string;
  };
}

export const guideContent: Record<string, GuideContent> = {
  'how-to-calculate-sip-returns': {
    intro: 'Systematic Investment Plan (SIP) is one of the most effective ways to build wealth through mutual funds. Understanding how SIP returns are calculated helps you make better investment decisions and achieve your financial goals. This comprehensive guide covers everything you need to know about SIP returns calculation, including formulas, examples, and practical tips for maximizing your returns.',
    sections: [
      {
        title: 'What is a Systematic Investment Plan (SIP)?',
        content: 'A SIP is a method of investing in mutual funds where you invest a fixed amount regularly (monthly, quarterly, or weekly). This disciplined approach helps you build wealth over time through the power of compounding and rupee cost averaging.\n\nKey benefits of SIP:\n• Regular investing discipline\n• Lower average purchase cost through rupee cost averaging\n• Power of compounding over the long term\n• Flexibility to start with small amounts (as low as ₹500)\n• No need to time the market'
      },
      {
        title: 'The SIP Return Formula',
        content: 'SIP returns are calculated using the future value of an annuity formula:\n\nFV = P × [((1+r)^n - 1) / r] × (1+r)\n\nWhere:\n• P = Monthly investment amount\n• r = Monthly rate of return (annual return divided by 12)\n• n = Number of months\n\nThis formula accounts for the compounding of returns over the investment period. The (1+r) factor at the end represents the SIP being invested at the beginning of each month.'
      },
      {
        title: 'Understanding XIRR in SIP',
        content: 'XIRR (Extended Internal Rate of Return) is the most accurate method to calculate SIP returns. Unlike CAGR, XIRR considers the timing of each investment, making it ideal for SIP calculations.\n\nExample: If you invested ₹5,000 monthly for 10 years and your final value is ₹10,00,000, the XIRR would be approximately 12.5% per annum.'
      },
      {
        title: 'Factors Affecting SIP Returns',
        content: 'Several factors influence your SIP returns:\n\n1. Investment Amount: Higher monthly investments lead to larger corpus\n2. Investment Period: Longer durations allow more compounding\n3. Rate of Return: Market performance affects returns\n4. Frequency: Monthly SIPs are most common and effective\n5. Fund Selection: Choosing the right mutual fund is crucial'
      }
    ],
    faqs: [
      { question: 'How is SIP return calculated?', answer: 'SIP returns are calculated using the future value of annuity formula, which accounts for regular monthly investments and compounding. The XIRR method is also used for calculating SIP returns.' },
      { question: 'What is XIRR in SIP?', answer: 'XIRR (Extended Internal Rate of Return) is a method to calculate returns on investments with multiple cash flows, such as SIP. It considers the timing of each investment.' },
      { question: 'What return should I assume for a SIP projection?', answer: 'There is no universally reliable rate. Test a range of conservative and optimistic assumptions, and remember that market-linked returns are not guaranteed.' },
      { question: 'Can I change my SIP amount?', answer: 'Yes, most mutual funds allow you to increase or decrease your SIP amount, though terms vary by fund house.' }
    ],
    summary: 'SIP is a powerful wealth-building tool. Understanding SIP returns helps you set realistic expectations and make informed investment decisions. Use our SIP Calculator to plan your investments.',
    schema: { "@context": "https://schema.org", "@type": "Article", headline: "SIP Return Calculation Guide", description: "Learn how to calculate SIP returns with step-by-step examples.", author: { "@type": "Organization", name: "Navorika" }, datePublished: "2026-08-01", dateModified: "2026-08-11" }
  },
  'how-to-calculate-emi': {
    intro: 'Equated Monthly Installment (EMI) is the fixed amount you pay each month to repay a loan. Understanding how EMI is calculated helps you make informed borrowing decisions and plan your finances effectively.',
    sections: [
      {
        title: 'What is EMI and How Does It Work?',
        content: 'EMI stands for Equated Monthly Installment. It represents the fixed monthly payment you make to repay a loan, which includes both the principal amount and the interest charged by the lender. The EMI remains constant throughout the loan tenure.\n\nThe EMI consists of two components:\n• Principal Component: The portion that goes toward reducing the actual loan amount\n• Interest Component: The portion that covers the interest charged by the lender'
      },
      {
        title: 'The EMI Formula Explained',
        content: 'EMI = P × r × (1+r)^n / ((1+r)^n - 1)\n\nWhere:\n• P = Principal loan amount\n• r = Monthly interest rate (annual rate divided by 12)\n• n = Number of monthly installments\n\nExample: For a loan of ₹5,00,000 at 8.5% annual interest for 20 years, the EMI would be approximately ₹4,342 per month.'
      }
    ],
    faqs: [
      { question: 'What is the maximum EMI I can afford?', answer: 'Your EMI should not exceed 30-40% of your monthly income.' },
      { question: 'Can I change my EMI amount?', answer: 'Yes, through loan restructuring or prepayment.' },
      { question: 'Is it better to choose a shorter or longer tenure?', answer: 'Shorter tenures mean higher EMIs but lower total interest. Choose based on your budget.' }
    ],
    summary: 'Understanding EMI calculation is essential for making informed borrowing decisions. Use our EMI Calculator to plan your loan repayments.',
    schema: { "@context": "https://schema.org", "@type": "Article", headline: "EMI Calculation Guide", description: "Learn how EMI is calculated for home, car, and personal loans.", author: { "@type": "Organization", name: "Navorika" }, datePublished: "2026-08-01", dateModified: "2026-08-11" }
  },
  'bmi-calculator-guide': {
    intro: 'Body Mass Index (BMI) is a simple measure of body fat based on height and weight. It is widely used to screen for weight categories that may lead to health problems. This comprehensive guide explains everything you need to know about BMI, including how to calculate it, interpret results, and use it for health management.',
    sections: [
      {
        title: 'What is BMI?',
        content: 'BMI (Body Mass Index) is a measure that uses your height and weight to determine if you are at a healthy weight. It is calculated by dividing weight in kilograms by height in meters squared (kg/m²).\n\nBMI is widely used because it is simple, non-invasive, and provides a quick screening tool for weight categories. However, it is not a diagnostic tool and should be used alongside other health assessments.'
      },
      {
        title: 'BMI Categories and Health Implications',
        content: 'The World Health Organization (WHO) defines BMI categories as:\n\n• Underweight: Below 18.5 (increased risk of nutritional deficiency)\n• Normal weight: 18.5 – 24.9 (lowest health risk)\n• Overweight: 25.0 – 29.9 (increased risk of chronic diseases)\n• Obese Class I: 30.0 – 34.9 (moderate health risk)\n• Obese Class II: 35.0 – 39.9 (high health risk)\n• Obese Class III: 40.0 and above (very high health risk)'
      },
      {
        title: 'Limitations of BMI',
        content: 'BMI has several limitations:\n\n• Does not distinguish between muscle and fat mass\n• May misclassify athletes and bodybuilders as overweight\n• May not be accurate for older adults or pregnant women\n• Does not account for fat distribution\n• May not be suitable for certain ethnic groups\n\nFor these reasons, BMI should be used as a screening tool, not a diagnostic tool.'
      }
    ],
    faqs: [
      { question: 'Is BMI accurate for everyone?', answer: 'BMI may not be accurate for athletes, older adults, pregnant women, and people with high muscle mass.' },
      { question: 'What is a healthy BMI?', answer: 'A healthy BMI ranges from 18.5 to 24.9, which is associated with the lowest health risks.' },
      { question: 'Can I improve my BMI?', answer: 'Yes, through balanced nutrition, regular exercise, and healthy lifestyle changes.' }
    ],
    summary: 'BMI is a useful screening tool for weight categories. Use our BMI Calculator to check your BMI and get personalized health recommendations.',
    schema: { "@context": "https://schema.org", "@type": "Article", headline: "BMI Calculator Guide", description: "Learn how to interpret your BMI results and understand health categories.", author: { "@type": "Organization", name: "Navorika" }, datePublished: "2026-08-01", dateModified: "2026-08-11" }
  },
  'pdf-compression-guide': {
    intro: 'PDF compression is essential for reducing file sizes for email, web sharing, and storage. This guide covers everything you need to know about compressing PDF files, including methods, tools, and best practices for maintaining quality while reducing file size.',
    sections: [
      {
        title: 'Why Compress PDF Files?',
        content: 'Compressing PDF files offers several benefits:\n\n• Faster email sending and receiving\n• Reduced storage space requirements\n• Faster web loading times\n• Easier sharing on messaging platforms\n• Cost savings on cloud storage'
      },
      {
        title: 'How PDF Compression Works',
        content: 'PDF compression works by:\n\n• Removing redundant data\n• Compressing images (JPEG, JPEG2000, or JBIG2)\n• Optimizing font embedding\n• Reducing resolution of images\n• Removing metadata and unnecessary elements\n\nThe compression method affects both file size and output quality.'
      }
    ],
    faqs: [
      { question: 'How much can I compress a PDF?', answer: 'Compression rates vary from 20% to 90% depending on content and quality settings.' },
      { question: 'Does compression affect quality?', answer: 'It can. Rasterization or stronger image compression may reduce sharpness, searchability, accessibility, or colour fidelity, so compare the result with the original.' }
    ],
    summary: 'PDF compression helps you share and store documents efficiently. Use our PDF Compressor to reduce file sizes while maintaining quality.',
    schema: { "@context": "https://schema.org", "@type": "Article", headline: "PDF Compression Guide", description: "Learn how to compress PDF files effectively without losing quality.", author: { "@type": "Organization", name: "Navorika" }, datePublished: "2026-08-01", dateModified: "2026-08-11" }
  },
  'how-to-merge-pdf-files': {
    intro: 'Merging PDF files allows you to combine multiple documents into a single, organized file. Whether you are creating reports, presentations, or portfolios, this guide covers everything you need to know about merging PDF files effectively.',
    sections: [
      {
        title: 'Why Merge PDF Files?',
        content: 'Merging PDF files offers several benefits:\n\n• Organize multiple documents into one file\n• Simplify sharing and distribution\n• Create comprehensive reports\n• Combine related documents\n• Reduce file management overhead'
      },
      {
        title: 'How to Merge PDF Files',
        content: 'There are several ways to merge PDF files:\n\n1. Use our Merge PDF tool online\n2. Arrange files in the desired order\n3. Click merge and download the combined file\n\nOur tool processes files locally in your browser for complete privacy.'
      }
    ],
    faqs: [
      { question: 'How many PDFs can I merge?', answer: 'The practical limit depends on document complexity and the memory available to your browser. Merge in smaller batches if a large job becomes unstable.' },
      { question: 'Will the merged PDF maintain quality?', answer: 'Yes, we maintain original quality when merging PDF files.' }
    ],
    summary: 'Merging PDF files simplifies document management and sharing. Use our Merge PDF tool to combine multiple files into one.',
    schema: { "@context": "https://schema.org", "@type": "Article", headline: "How to Merge PDF Files", description: "Learn different methods to merge PDF files into one document.", author: { "@type": "Organization", name: "Navorika" }, datePublished: "2026-08-01", dateModified: "2026-08-11" }
  },
  'image-compression-guide': {
    intro: 'Image compression is essential for optimizing images for web use, reducing storage space, and speeding up loading times. This guide covers compression methods, tools, and best practices for maintaining quality while reducing file size.',
    sections: [
      {
        title: 'Understanding Image Compression',
        content: 'Image compression reduces file size by removing redundant data. There are two main types:\n\n• Lossy Compression: Removes some data to achieve smaller files (JPEG, WebP)\n• Lossless Compression: Preserves all data for perfect quality (PNG, GIF)\n\nChoose the right method based on your needs for quality vs. file size.'
      },
      {
        title: 'Best Practices for Image Compression',
        content: 'Follow these best practices:\n\n• Use the right format for your use case\n• Adjust quality settings based on needs\n• Consider resolution and dimensions\n• Test compressed images across devices\n• Use responsive images for web'
      }
    ],
    faqs: [
      { question: 'How much can I compress an image?', answer: 'Compression depends on content and format. Typical reductions are 30-80%.' },
      { question: 'Will compression affect image quality?', answer: 'Lossy compression can introduce artifacts. Compare the output at its intended display size and choose the lowest file size that still meets your visual requirement.' }
    ],
    summary: 'Image compression is essential for web optimization. Use our Image Compressor to reduce file sizes while maintaining quality.',
    schema: { "@context": "https://schema.org", "@type": "Article", headline: "Image Compression Guide", description: "Learn how to compress images for faster loading times and better performance.", author: { "@type": "Organization", name: "Navorika" }, datePublished: "2026-08-01", dateModified: "2026-08-11" }
  },
  'how-to-resize-images': {
    intro: 'Resizing images is essential for optimizing web performance, social media, and print applications. This guide covers everything you need to know about resizing images, including best practices, methods, and tools.',
    sections: [
      {
        title: 'Why Resize Images?',
        content: 'Resizing images offers several benefits:\n\n• Optimize for web and mobile devices\n• Reduce loading times\n• Meet platform requirements (social media, etc.)\n• Save storage space\n• Improve user experience'
      },
      {
        title: 'Image Resolution and Quality',
        content: 'Understanding resolution is key:\n\n• PPI (Pixels Per Inch): Affects print quality\n• DPI (Dots Per Inch): Affects print resolution\n• Image Dimensions: Width × Height in pixels\n• Aspect Ratio: Proportional relationship between width and height\n\nMaintaining proper resolution ensures images look good at any size.'
      }
    ],
    faqs: [
      { question: 'What resolution should I use for web?', answer: 'Choose pixel dimensions for the rendered layout and device density. A 72 DPI metadata label does not determine on-screen quality.' },
      { question: 'Does resizing affect image quality?', answer: 'Yes, especially when enlarging or repeatedly resampling. Keep a master and review each export at the intended display size.' }
    ],
    summary: 'Resizing images properly is crucial for web and print applications. Use our Image Resizer to resize images without losing quality.',
    schema: { "@context": "https://schema.org", "@type": "Article", headline: "How to Resize Images", description: "Learn how to resize images for web, print, and social media.", author: { "@type": "Organization", name: "Navorika" }, datePublished: "2026-08-01", dateModified: "2026-08-11" }
  },
  'gst-calculation-guide': {
    intro: 'Goods and Services Tax (GST) is a comprehensive indirect tax on the supply of goods and services in India. Understanding GST calculation is essential for businesses and individuals to comply with tax regulations and manage finances effectively.',
    sections: [
      {
        title: 'What is GST?',
        content: 'GST is a value-added tax levied on most goods and services sold for domestic consumption. It is a multi-stage, destination-based tax with the following components:\n\n• CGST (Central GST): Collected by the central government\n• SGST (State GST): Collected by state governments\n• IGST (Integrated GST): Collected on inter-state supplies'
      },
      {
        title: 'How to Calculate GST',
        content: 'GST is calculated as a percentage of the transaction value. The formula is:\n\nGST Amount = (Original Cost × GST Rate) / 100\n\nExample: If the original cost is ₹10,000 and GST rate is 18%, the GST amount is ₹1,800. The total price becomes ₹11,800.'
      }
    ],
    faqs: [
      { question: 'What are the GST rates in India?', answer: 'GST rates in India range from 0% to 28%, with standard rates of 5%, 12%, 18%, and 28%.' },
      { question: 'Is GST applicable on all goods and services?', answer: 'Most goods and services are covered under GST, with some exceptions like petroleum products and alcohol.' }
    ],
    summary: 'Understanding GST calculation is essential for business compliance. Use our GST Calculator to compute tax accurately.',
    schema: { "@context": "https://schema.org", "@type": "Article", headline: "GST Calculation Guide", description: "Learn how to calculate GST for your business in India.", author: { "@type": "Organization", name: "Navorika" }, datePublished: "2026-08-01", dateModified: "2026-08-11" }
  },
  'base64-encoding-guide': {
    intro: 'Base64 encoding is a method of converting binary data into ASCII text format, commonly used for transmitting data over text-based protocols. This guide explains everything you need to know about Base64 encoding, including how it works and when to use it.',
    sections: [
      {
        title: 'What is Base64 Encoding?',
        content: 'Base64 encoding converts binary data into a text format using 64 characters (A-Z, a-z, 0-9, +, /). It is commonly used for:\n\n• Embedding images in HTML/CSS\n• Sending binary data in JSON/XML\n• Storing binary data in databases\n• Transmitting files over email\n• Encoding authentication credentials'
      },
      {
        title: 'How Base64 Encoding Works',
        content: 'Base64 encoding works by:\n\n1. Taking binary data\n2. Grouping into 6-bit chunks\n3. Converting to Base64 characters\n4. Padding with = for completeness\n\nThe resulting text is about 33% larger than the original binary data.'
      }
    ],
    faqs: [
      { question: 'When should I use Base64 encoding?', answer: 'Use Base64 for embedding binary data in text formats, email attachments, and JSON/XML data.' },
      { question: 'Is Base64 encoding secure?', answer: 'Base64 is not encryption; it\'s encoding. It should not be used for securing sensitive data.' }
    ],
    summary: 'Base64 encoding is essential for transmitting binary data as text. Use our Base64 Encoder to encode and decode data easily.',
    schema: { "@context": "https://schema.org", "@type": "Article", headline: "Base64 Encoding Guide", description: "Learn what Base64 encoding is and how to use it effectively.", author: { "@type": "Organization", name: "Navorika" }, datePublished: "2026-08-01", dateModified: "2026-08-11" }
  },
  'qr-code-guide': {
    intro: 'QR codes are versatile tools for sharing information and connecting offline and online experiences. This guide covers everything you need to know about QR codes, including how they work, best practices, and how to create them.',
    sections: [
      {
        title: 'What are QR Codes?',
        content: 'QR (Quick Response) codes are two-dimensional barcodes that can store various types of data, including URLs, text, contact information, and more. They are widely used for:\n\n• Marketing campaigns\n• Product information\n• Contactless menus\n• Payment systems\n• Event check-ins'
      },
      {
        title: 'How QR Codes Work',
        content: 'QR codes work by using a grid of black and white squares to encode data. Key components include:\n\n• Position markers for scanning\n• Alignment and timing patterns\n• Data encoding area\n• Error correction capacity (L, M, Q, H levels)'
      }
    ],
    faqs: [
      { question: 'What types of data can QR codes store?', answer: 'QR codes can store URLs, text, contact information, WiFi credentials, and more.' },
      { question: 'Are QR codes secure?', answer: 'QR codes themselves are secure, but users should verify the destination before scanning.' }
    ],
    summary: 'QR codes are powerful tools for connecting offline and online experiences. Use our QR Code Generator to create custom QR codes.',
    schema: { "@context": "https://schema.org", "@type": "Article", headline: "QR Code Guide", description: "Learn everything you need to know about QR codes and how to create them.", author: { "@type": "Organization", name: "Navorika" }, datePublished: "2026-08-01", dateModified: "2026-08-11" }
  },
  'jwt-decoding-guide': {
    intro: 'JSON Web Tokens (JWT) are widely used for authentication and authorization in modern web applications. This guide explains how JWT works, its structure, and how to decode and verify tokens.',
    sections: [
      {
        title: 'What is JWT?',
        content: 'JWT is a compact, URL-safe way to represent claims between parties. It consists of three parts:\n\n• Header: Contains the algorithm and token type\n• Payload: Contains the claims (data)\n• Signature: Verifies the token integrity'
      },
      {
        title: 'How JWT Decoding Works',
        content: 'Decoding a JWT involves:\n\n1. Splitting the token into three parts\n2. Base64Url decoding the header and payload\n3. Reading the untrusted claims data\n4. Separately verifying the signature and application-specific claims before trusting the token'
      }
    ],
    faqs: [
      { question: 'What is JWT used for?', answer: 'JWT is commonly used for authentication, authorization, and secure data exchange between parties.' },
      { question: 'Is JWT decoding secure?', answer: 'Decoding a JWT is safe, but always verify the signature to ensure token integrity.' }
    ],
    summary: 'JWT decoding is essential for working with modern authentication. Use our JWT Decoder to inspect and verify JWT tokens.',
    schema: { "@context": "https://schema.org", "@type": "Article", headline: "JWT Decoding Guide", description: "Learn how JSON Web Tokens work and how to decode them.", author: { "@type": "Organization", name: "Navorika" }, datePublished: "2026-08-01", dateModified: "2026-08-11" }
  }
  // Additional guides will be added here
};

export function getGuideContent(slug: string): GuideContent | null {
  const content = guideContent[slug] || additionalGuideContent[slug];
  if (!content) return null;
  const enhancement = guideContentEnhancements[slug];
  return enhancement ? {
    ...content,
    sections: [...content.sections, ...enhancement.sections],
    faqs: [...content.faqs, ...enhancement.faqs],
  } : content;
}
