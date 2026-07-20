"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  TrendingUp, 
  FileText, 
  Image, 
  Zap, 
  Heart, 
  Code, 
  Building2, 
  Users
} from "lucide-react";
import Container from "@/components/ui/Container";

const categories = [
  { name: "Finance", icon: TrendingUp, count: 8, href: "/categories/finance", color: "from-blue-500 to-blue-600" },
  { name: "PDF Tools", icon: FileText, count: 6, href: "/categories/pdf", color: "from-red-500 to-red-600" },
  { name: "Image Tools", icon: Image, count: 5, href: "/categories/image", color: "from-purple-500 to-purple-600" },
  { name: "Productivity", icon: Zap, count: 5, href: "/categories/productivity", color: "from-yellow-500 to-yellow-600" },
  { name: "Health", icon: Heart, count: 5, href: "/categories/health", color: "from-green-500 to-green-600" },
  { name: "Developer", icon: Code, count: 4, href: "/categories/developer", color: "from-indigo-500 to-indigo-600" },
  { name: "Construction", icon: Building2, count: 2, href: "/categories/construction", color: "from-orange-500 to-orange-600" },
  { name: "India Tools", icon: Users, count: 3, href: "/categories/india", color: "from-emerald-500 to-emerald-600" },
];

export default function CategoryGrid() {
  return (
    <section className="py-20 bg-slate-50">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Everything You Need, <span className="text-blue-600">All in One Place</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Explore 40+ powerful tools organized into intuitive categories.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={category.href}
                className="group relative block overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 transition-opacity group-hover:opacity-5`} />
                
                <div className="relative">
                  <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-3">
                    <category.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-900">
                    {category.name}
                  </h3>
                  
                  <p className="mt-1 text-sm text-slate-500">
                    {category.count} tools
                  </p>

                  <div className="mt-4 flex items-center text-sm font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                    Explore
                    <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
