import {
  Wallet,
  FileText,
  Image as ImageIcon,
  Code,
  Wand2,
  Wrench,
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
    title: "PDF",
    description: "Merge, split, compress and convert PDF files.",
    icon: FileText,
  },
  {
    id: "image",
    title: "Images",
    description: "Compress, resize and convert images.",
    icon: ImageIcon,
  },
  {
    id: "developer",
    title: "Developer",
    description: "Developer productivity tools.",
    icon: Code,
  },
  {
    id: "ai",
    title: "AI",
    description: "AI-powered productivity tools.",
    icon: Wand2,
  },
  {
    id: "utility",
    title: "Utility",
    description: "Everyday utilities and converters.",
    icon: Wrench,
  },
];