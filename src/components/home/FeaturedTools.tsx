import Container from "@/components/ui/Container";
import ToolCard from "./ToolCard";

import {
  Receipt,
  Calculator,
  Landmark,
  FileText,
  Image,
  ScanSearch,
  QrCode,
  Clock,
} from "lucide-react";

const tools = [
  {
    title: "GST Calculator",
    description: "Calculate GST instantly for inclusive and exclusive prices.",
    icon: Receipt,
    href: "/tools/gst-calculator",
  },
  {
    title: "EMI Calculator",
    description: "Calculate monthly loan EMI with detailed breakup.",
    icon: Calculator,
    href: "/tools/emi-calculator",
  },
  {
    title: "SIP Calculator",
    description: "Estimate future wealth from your SIP investments.",
    icon: Landmark,
    href: "/tools/sip-calculator",
  },
  {
    title: "PDF to Word",
    description: "Convert PDF documents into editable Word files.",
    icon: FileText,
    href: "/tools/pdf-to-word",
  },
  {
    title: "Image Compressor",
    description: "Reduce image size without noticeable quality loss.",
    icon: Image,
    href: "/tools/image-compressor",
  },
  {
    title: "QR Generator",
    description: "Generate beautiful QR codes in seconds.",
    icon: QrCode,
    href: "/tools/qr-generator",
  },
  {
    title: "Age Calculator",
    description: "Calculate exact age in years, months and days.",
    icon: Clock,
    href: "/tools/age-calculator",
  },
  {
    title: "Image to Text",
    description: "Extract text from images using OCR.",
    icon: ScanSearch,
    href: "/tools/image-to-text",
  },
];

export default function FeaturedTools() {
  return (
    <section className="py-24 bg-muted/30">
      <Container>

        <div className="mx-auto max-w-3xl text-center">

          <h2 className="text-4xl font-bold">
            Most Popular Tools
          </h2>

          <p className="mt-5 text-lg text-muted-foreground">
            Start with our most frequently used online tools.
          </p>

        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {tools.map((tool) => (
            <ToolCard
              key={tool.title}
              {...tool}
            />
          ))}

        </div>

      </Container>
    </section>
  );
}