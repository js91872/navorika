"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  TrendingUp,
  FileText,
  Image,
  Heart,
  Rocket,
  Code,
  Building2,
  ArrowRight,
  Sparkles
} from "lucide-react";

// ... rest of the imports and code ...

export function CategoryCard({ category, className }: CategoryCardProps) {
  // ... existing code ...

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Link href={`/categories/${category.slug}`} className="block">
        {/* ... rest of the card content ... */}
      </Link>
    </motion.div>
  );
}
