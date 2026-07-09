import Container from "@/components/ui/Container";
import CategoryCard from "./CategoryCard";

import {
  Calculator,
  Image,
  FileText,
  Wallet,
  Bot,
  Code,
  Globe,
  Shield,
  Palette,
  Type,
  RefreshCcw,
  Wrench,
} from "lucide-react";

const categories = [
  {
    title: "Finance",
    description: "EMI, SIP, GST, Tax and investment calculators.",
    icon: Wallet,
    tools: 30,
    href: "/categories/finance",
  },
  {
    title: "PDF Tools",
    description: "Merge, split, convert and compress PDF files.",
    icon: FileText,
    tools: 25,
    href: "/categories/pdf",
  },
  {
    title: "Image Tools",
    description: "Compress, resize and convert images instantly.",
    icon: Image,
    tools: 25,
    href: "/categories/image",
  },
  {
    title: "AI Tools",
    description: "Modern AI utilities for everyday productivity.",
    icon: Bot,
    tools: 20,
    href: "/categories/ai",
  },
  {
    title: "Calculators",
    description: "Hundreds of smart online calculators.",
    icon: Calculator,
    tools: 60,
    href: "/categories/calculators",
  },
  {
    title: "Developer",
    description: "JSON, Base64, UUID and coding utilities.",
    icon: Code,
    tools: 22,
    href: "/categories/developer",
  },
  {
    title: "SEO",
    description: "Meta tags, schema and optimization tools.",
    icon: Globe,
    tools: 20,
    href: "/categories/seo",
  },
  {
    title: "Security",
    description: "Hash generators and password utilities.",
    icon: Shield,
    tools: 18,
    href: "/categories/security",
  },
  {
    title: "Design",
    description: "Color palettes, gradients and design helpers.",
    icon: Palette,
    tools: 18,
    href: "/categories/design",
  },
  {
    title: "Text Tools",
    description: "Word counter, case converter and formatter.",
    icon: Type,
    tools: 24,
    href: "/categories/text",
  },
  {
    title: "Converters",
    description: "Unit, currency and measurement converters.",
    icon: RefreshCcw,
    tools: 35,
    href: "/categories/converters",
  },
  {
    title: "Utilities",
    description: "Daily-use online productivity tools.",
    icon: Wrench,
    tools: 40,
    href: "/categories/utilities",
  },
];

export default function Categories() {
  return (
    <section className="py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold">
            Explore Categories
          </h2>

          <p className="mt-5 text-lg text-muted-foreground">
            Discover hundreds of carefully designed online tools grouped into
            intuitive categories.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              {...category}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}