import Container from "@/components/ui/Container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";
import { 
  TrendingUp, FileText, Image, Zap, Heart, Code, Building2, Users 
} from "lucide-react";

const categories = [
  { 
    name: "Finance", 
    icon: TrendingUp, 
    count: 8, 
    href: "/categories/finance", 
    description: "EMI, Income Tax, EPF, FD, SIP, Loan, Inflation, Currency Converter",
    color: "from-blue-500 to-blue-600"
  },
  { 
    name: "PDF Tools", 
    icon: FileText, 
    count: 6, 
    href: "/categories/pdf", 
    description: "Merge, Split, Compress, PDF to Word, Word to PDF, JPG to PDF",
    color: "from-red-500 to-red-600"
  },
  { 
    name: "Image Tools", 
    icon: Image, 
    count: 5, 
    href: "/categories/image", 
    description: "Compressor, Resizer, Converter, Crop, Background Remover",
    color: "from-purple-500 to-purple-600"
  },
  { 
    name: "Productivity", 
    icon: Zap, 
    count: 5, 
    href: "/categories/productivity", 
    description: "Age, Date, Percentage, QR Code, Password Generator",
    color: "from-yellow-500 to-yellow-600"
  },
  { 
    name: "Health", 
    icon: Heart, 
    count: 5, 
    href: "/categories/health", 
    description: "BMI, BMR, Calorie, Water Intake, Protein Intake",
    color: "from-green-500 to-green-600"
  },
  { 
    name: "Developer", 
    icon: Code, 
    count: 4, 
    href: "/categories/developer", 
    description: "JSON Formatter, Base64, UUID, URL Encoder",
    color: "from-indigo-500 to-indigo-600"
  },
  { 
    name: "Construction", 
    icon: Building2, 
    count: 2, 
    href: "/categories/construction", 
    description: "Concrete, Paint Calculator",
    color: "from-orange-500 to-orange-600"
  },
  { 
    name: "India Tools", 
    icon: Users, 
    count: 3, 
    href: "/categories/india", 
    description: "Income Tax, EPF, PPF Calculator",
    color: "from-emerald-500 to-emerald-600"
  },
];

export default function CategoriesPage() {
  return (
    <section className="py-12 lg:py-20">
      <Container>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
            All <span className="text-blue-600">Categories</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Explore tools organized by category. Find exactly what you need for your task.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.name} href={category.href}>
              <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${category.color} text-white`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="mt-4">{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500">
                    {category.count} tools available
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
