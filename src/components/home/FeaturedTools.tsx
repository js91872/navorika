"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp, Calculator, FileText, Image, Heart } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import Container from "@/components/ui/Container";

const featuredTools = [
  {
    slug: "emi-calculator",
    name: "EMI Calculator",
    description: "Calculate monthly loan EMI instantly.",
    icon: Calculator,
    category: "Finance",
    usage: "10K+",
  },
  {
    slug: "income-tax-calculator",
    name: "Income Tax Calculator",
    description: "Calculate your income tax for FY 2026-27.",
    icon: TrendingUp,
    category: "Finance",
    usage: "8K+",
  },
  {
    slug: "water-intake-calculator",
    name: "Water Intake Calculator",
    description: "Calculate your daily water intake needs.",
    icon: Heart,
    category: "Health",
    usage: "5K+",
  },
];

export default function FeaturedTools() {
  return (
    <section className="py-20">
      <Container>
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Featured <span className="text-blue-600">Tools</span>
            </h2>
            <p className="mt-2 text-lg text-slate-600">
              Most popular and highly-rated tools on Navorika.
            </p>
          </div>
          <Link
            href="/tools"
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTools.map((tool) => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`}>
              <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
                    <tool.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="mt-4">{tool.name}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      {tool.category}
                    </span>
                    <span>{tool.usage} users</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <span className="text-sm font-medium text-blue-600">
                    Try Now →
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
