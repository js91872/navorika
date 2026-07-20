import Container from "@/components/ui/Container";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";
import { getAllTools } from "@/lib/toolRegistry";
import { Calculator, TrendingUp, Heart, FileText, Image, Code, Zap, Building2 } from "lucide-react";

const iconMap: Record<string, any> = {
  "Calculator": Calculator,
  "TrendingUp": TrendingUp,
  "Heart": Heart,
  "FileText": FileText,
  "Image": Image,
  "Code": Code,
  "Zap": Zap,
  "Building2": Building2,
};

export default async function ToolsPage() {
  const tools = getAllTools();

  return (
    <section className="py-12 lg:py-20">
      <Container>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
            All <span className="text-blue-600">Tools</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Browse all our free online tools. Find exactly what you need.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool) => {
            const IconComponent = iconMap[tool.icon as string] || Calculator;
            return (
              <Link key={tool.slug} href={`/tools/${tool.slug}`}>
                <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardHeader>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="mt-4">{tool.title}</CardTitle>
                    <CardDescription>{tool.shortDescription}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      {tool.category}
                    </span>
                  </CardContent>
                  <CardFooter>
                    <span className="text-sm font-medium text-blue-600">
                      Try Now →
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
