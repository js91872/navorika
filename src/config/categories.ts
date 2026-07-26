import {
  Wallet,
  FileText,
  Image as ImageIcon,
  Code,
  Wand2,
  Wrench,
  Heart,
  Rocket,
  Building2,
  LucideIcon
} from "lucide-react";

export interface Category {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const categories: Category[] = [
  {
    id: "finance",
    title: "Finance",
    description: "EMI, SIP, FD, GST and investment calculators.",
    icon: Wallet,
  },
  {
    id: "pdf",
    title: "PDF Tools",
    description: "Merge, split, compress and convert PDF files.",
    icon: FileText,
  },
  {
    id: "image",
    title: "Image Tools",
    description: "Compress, resize and convert images.",
    icon: ImageIcon,
  },
  {
    id: "health",
    title: "Health",
    description: "Fitness, nutrition and wellness calculators.",
    icon: Heart,
  },
  {
    id: "productivity",
    title: "Productivity",
    description: "Calculate, generate and more.",
    icon: Rocket,
  },
  {
    id: "developer",
    title: "Developer Tools",
    description: "Developer productivity tools.",
    icon: Code,
  },
  {
    id: "construction",
    title: "Construction",
    description: "Construction calculators for concrete, paint and more.",
    icon: Building2,
  },
];
