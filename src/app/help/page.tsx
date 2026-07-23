import Link from "next/link";
import { PremiumHeading } from "@/components/ui/PremiumHeading";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { PremiumBadge } from "@/components/ui/PremiumBadge";
import { Sparkles, HelpCircle, BookOpen, MessageCircle, Search, FileText } from "lucide-react";

export const metadata = {
  title: "Help Center | Navorika Support",
  description: "Find help and support for using Navorika tools. Browse FAQs, guides, and tutorials.",
};

const helpTopics = [
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Getting Started",
    description: "Learn how to use Navorika tools effectively",
    link: "/guides",
  },
  {
    icon: <HelpCircle className="h-6 w-6" />,
    title: "FAQs",
    description: "Answers to common questions",
    link: "#faqs",
  },
  {
    icon: <Search className="h-6 w-6" />,
    title: "Using Search",
    description: "How to find the right tools quickly",
    link: "/tools",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Documentation",
    description: "Detailed guides and documentation",
    link: "/guides",
  },
  {
    icon: <MessageCircle className="h-6 w-6" />,
    title: "Contact Support",
    description: "Get help from our support team",
    link: "/contact",
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-premium bg-dots py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <PremiumBadge variant="gradient" className="mb-4" icon={<Sparkles className="h-3.5 w-3.5" />}>
            Support Center
          </PremiumBadge>
          <PremiumHeading level="h1" gradient>
            How Can We Help?
          </PremiumHeading>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Find answers, guides, and resources to get the most out of Navorika.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {helpTopics.map((topic, index) => (
            <Link key={index} href={topic.link}>
              <PremiumCard hover className="cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-brand-100 p-3 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">
                    {topic.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{topic.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{topic.description}</p>
                  </div>
                </div>
              </PremiumCard>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 p-8 text-white text-center">
          <h3 className="text-2xl font-bold">Still Need Help?</h3>
          <p className="mt-2 text-white/80">Our support team is here to assist you</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 mt-4 bg-white text-brand-600 px-6 py-3 rounded-xl font-semibold hover:bg-slate-100 transition"
          >
            Contact Support
            <MessageCircle className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
