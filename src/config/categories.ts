export interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const categories: Category[] = [
  {
    id: "finance",
    title: "Finance",
    description:
      "EMI, SIP, FD, GST and investment calculators.",
    icon: "💰",
  },

  {
    id: "pdf",
    title: "PDF",
    description:
      "Merge, split, compress and convert PDF files.",
    icon: "📄",
  },

  {
    id: "image",
    title: "Images",
    description:
      "Compress, resize and convert images.",
    icon: "🖼️",
  },

  {
    id: "developer",
    title: "Developer",
    description:
      "Developer productivity tools.",
    icon: "💻",
  },

  {
    id: "ai",
    title: "AI",
    description:
      "AI-powered productivity tools.",
    icon: "🤖",
  },

  {
    id: "utility",
    title: "Utility",
    description:
      "Everyday utilities and converters.",
    icon: "🛠️",
  },
];