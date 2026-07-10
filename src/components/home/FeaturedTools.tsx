import Container from "@/components/ui/Container";
import ToolCard from "./ToolCard";

const featuredTools = [
  {
    title: "EMI Calculator",
    description:
      "Calculate monthly EMI, total interest and repayment instantly.",
    category: "Finance",
    badge: "Popular",
  },
  {
    title: "GST Calculator",
    description:
      "Calculate inclusive and exclusive GST in one click.",
    category: "Finance",
    badge: "Trending",
  },
  {
    title: "Age Calculator",
    description:
      "Find exact age in years, months and days instantly.",
    category: "Utility",
  },
  {
    title: "PDF to Word",
    description:
      "Convert PDF documents into editable Word files.",
    category: "PDF",
  },
  {
    title: "Image Compressor",
    description:
      "Reduce image size while maintaining excellent quality.",
    category: "Images",
  },
  {
    title: "QR Code Generator",
    description:
      "Generate beautiful QR codes for URLs, text and more.",
    category: "Utility",
  },
];

export default function FeaturedTools() {
  return (
    <section className="py-28 bg-slate-50">

      <Container>

        <div className="mx-auto max-w-3xl text-center">

          <h2 className="text-5xl font-black tracking-tight">
            Featured Tools
          </h2>

          <p className="mt-6 text-xl text-slate-600">
            Discover the tools people use the most every day.
          </p>

        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {featuredTools.map((tool) => (
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