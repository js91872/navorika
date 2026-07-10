import Container from "@/components/ui/Container";
import {
  Calculator,
  FileText,
  Image,
  Brain,
  Code2,
  Briefcase,
  ShieldCheck,
  Globe,
} from "lucide-react";

const categories = [
  {
    title: "Finance",
    description: "EMI, SIP, Tax, GST and investment calculators.",
    icon: Calculator,
    tools: "28 Tools",
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "PDF Tools",
    description: "Convert, merge, split and compress PDF files.",
    icon: FileText,
    tools: "32 Tools",
    color: "bg-red-50 text-red-600",
  },
  {
    title: "Image Tools",
    description: "Compress, resize, convert and optimize images.",
    icon: Image,
    tools: "24 Tools",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "AI Tools",
    description: "Modern AI powered productivity utilities.",
    icon: Brain,
    tools: "20 Tools",
    color: "bg-violet-50 text-violet-600",
  },
  {
    title: "Developer",
    description: "JSON, Base64, Regex and coding utilities.",
    icon: Code2,
    tools: "18 Tools",
    color: "bg-slate-100 text-slate-700",
  },
  {
    title: "Business",
    description: "Invoice, profit, margin and planning tools.",
    icon: Briefcase,
    tools: "16 Tools",
    color: "bg-amber-50 text-amber-600",
  },
  {
    title: "Security",
    description: "Password generators and security utilities.",
    icon: ShieldCheck,
    tools: "14 Tools",
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    title: "SEO & Web",
    description: "Meta tags, schema and SEO optimization tools.",
    icon: Globe,
    tools: "22 Tools",
    color: "bg-indigo-50 text-indigo-600",
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-28">
      <Container>
        <div className="mx-auto max-w-3xl text-center">

          <h2 className="text-5xl font-black tracking-tight">
            Explore Categories
          </h2>

          <p className="mt-6 text-xl text-slate-600">
            Everything you need, organized into powerful categories for
            productivity, finance, AI, PDFs and more.
          </p>

        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <div
                key={category.title}
                className="group cursor-pointer rounded-3xl border border-slate-200 bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div
                  className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${category.color}`}
                >
                  <Icon size={30} />
                </div>

                <h3 className="mt-8 text-2xl font-bold">
                  {category.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {category.description}
                </p>

                <div className="mt-8 inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                  {category.tools}
                </div>
              </div>
            );
          })}

        </div>
      </Container>
    </section>
  );
}