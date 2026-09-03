import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import ResizeImage1000x1000Tool from "@/components/tools/ResizeImage1000x1000Tool";

const title =
  "Resize Image to 1000×1000 Pixels Online – Free Image Converter";

const description =
  "Resize an image to exactly 1000×1000 pixels online for free. Crop, fit, or stretch your photo and download it as JPG, PNG, or WebP. Images are processed locally in your browser.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/tools/resize-image-to-1000x1000",
  },
  openGraph: {
    title,
    description,
    url: "/tools/resize-image-to-1000x1000",
    type: "website",
  },
};

const faq = [
  {
    question: "How do I resize an image to 1000 × 1000 pixels?",
    answer:
      "Upload your image, choose Crop, Fit, or Stretch, select JPG, PNG, or WebP, and click Resize to 1000 × 1000. The downloaded image will have an exact 1000 by 1000 pixel canvas.",
  },
  {
    question: "Will resizing to 1000 × 1000 distort my photo?",
    answer:
      "Not when you use Crop or Fit. Crop preserves the aspect ratio and trims excess edges, while Fit preserves the whole image and adds padding when needed. Stretch forces the original into a square and can cause distortion.",
  },
  {
    question: "Can I make a 1000 × 1000 image without cropping it?",
    answer:
      "Yes. Select Fit entire image with padding. The complete original image is fitted inside a 1000 × 1000 square and any unused space is filled with your selected background color.",
  },
  {
    question: "Can I convert the resized image to JPG, PNG, or WebP?",
    answer:
      "Yes. You can export the 1000 × 1000 image as JPG, PNG, or WebP.",
  },
  {
    question: "Is my image uploaded to Navorika?",
    answer:
      "No. The resizing operation is performed locally in your browser using browser image and canvas capabilities.",
  },
];

export default function ResizeImage1000x1000Page() {
  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "1000 x 1000 Image Converter",
    url: "https://navorika.com/tools/resize-image-to-1000x1000",
    description,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript and a modern web browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Resize images to exactly 1000 × 1000 pixels",
      "Crop to fill",
      "Fit with padding",
      "Stretch resize",
      "JPG output",
      "PNG output",
      "WebP output",
      "Local browser processing",
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://navorika.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Image Tools",
        item: "https://navorika.com/categories/image-tools",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "1000 x 1000 Image Converter",
        item: "https://navorika.com/tools/resize-image-to-1000x1000",
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <main className="bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplicationSchema).replace(/</g, "\\u003c"),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Link
          href="/categories/image-tools"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Image Tools
        </Link>

        <header className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
            Free Image Resizer
          </p>

          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            1000 × 1000 Image Converter
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Resize any compatible image to exactly 1000 × 1000 pixels.
            Crop to fill, fit the entire photo with padding, or stretch it
            to a square, then download as JPG, PNG, or WebP.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Exact 1000 × 1000 output
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              No signup
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Browser processing
            </span>
          </div>
        </header>

        <ResizeImage1000x1000Tool />

        <article className="mt-12 space-y-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
          <section>
            <h2 className="text-2xl font-bold text-slate-950">
              Resize an image to 1000 × 1000 pixels
            </h2>

            <div className="mt-4 space-y-4 text-base leading-7 text-slate-600">
              <p>
                A 1000 × 1000 image is a square image with the same width
                and height. This converter creates an exact 1000-pixel-wide
                by 1000-pixel-high output while giving you control over how
                a rectangular source photo is placed inside that square.
              </p>

              <p>
                Use Crop to Fill when you want the square completely filled
                without stretching. Use Fit when keeping the full original
                image is more important than filling every edge. Stretch
                should normally be used only when changing the original
                proportions is acceptable.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950">
              Crop vs fit vs stretch
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-5">
                <h3 className="font-bold text-slate-900">
                  Crop to fill
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Preserves the original proportions and fills the entire
                  square. Parts of the longer dimension may be cropped.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <h3 className="font-bold text-slate-900">
                  Fit with padding
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Keeps the whole image visible and fills any remaining
                  space with your chosen background color.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <h3 className="font-bold text-slate-900">
                  Stretch
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Forces the source image to exactly 1000 × 1000 without
                  cropping, which can alter its proportions.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950">
              How to convert an image to 1000 × 1000 pixels
            </h2>

            <ol className="mt-5 space-y-3 text-slate-600">
              {[
                "Upload or drag and drop your image.",
                "Choose Crop, Fit, or Stretch.",
                "Select JPG, PNG, or WebP as the output format.",
                "Adjust quality or the padding background if required.",
                "Click Resize to 1000 × 1000.",
                "Preview and download the converted image.",
              ].map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950">
              Frequently asked questions
            </h2>

            <div className="mt-5 divide-y divide-slate-200">
              {faq.map((item) => (
                <div key={item.question} className="py-5 first:pt-0">
                  <h3 className="font-bold text-slate-900">
                    {item.question}
                  </h3>
                  <p className="mt-2 leading-7 text-slate-600">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
