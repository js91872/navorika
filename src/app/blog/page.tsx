import Link from "next/link";
import { PremiumHeading } from "@/components/ui/PremiumHeading";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { PremiumBadge } from "@/components/ui/PremiumBadge";
import { Sparkles, Calendar, Clock, Users, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Navorika Blog | Insights & Updates",
  description: "Stay updated with the latest insights, tips, and updates from Navorika.",
};

const blogPosts = [
  {
    slug: "top-10-productivity-tools",
    title: "Top 10 Productivity Tools for 2026",
    excerpt: "Discover the most powerful productivity tools that can transform your workflow and boost efficiency.",
    category: "Productivity",
    date: "July 23, 2026",
    readTime: "5 min read",
    author: "Navorika Team",
    image: "🚀",
  },
  {
    slug: "guide-to-financial-planning",
    title: "Complete Guide to Financial Planning in 2026",
    excerpt: "Learn how to plan your finances effectively with our comprehensive guide.",
    category: "Finance",
    date: "July 22, 2026",
    readTime: "8 min read",
    author: "Navorika Team",
    image: "💰",
  },
  {
    slug: "health-tech-trends",
    title: "Health Tech Trends to Watch in 2026",
    excerpt: "Explore the latest trends in health technology and how they're changing lives.",
    category: "Health",
    date: "July 21, 2026",
    readTime: "6 min read",
    author: "Navorika Team",
    image: "💪",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-premium bg-dots py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <PremiumBadge variant="gradient" className="mb-4" icon={<Sparkles className="h-3.5 w-3.5" />}>
            Insights & Updates
          </PremiumBadge>
          <PremiumHeading level="h1" gradient>
            Navorika Blog
          </PremiumHeading>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Stay updated with the latest insights, tips, and updates from Navorika.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <PremiumCard hover className="h-full transition-all duration-300 cursor-pointer group">
                <div className="flex flex-col h-full">
                  <div className="text-4xl mb-3">{post.image}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <PremiumBadge variant="gray" size="sm">{post.category}</PremiumBadge>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition text-lg">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-brand-600 dark:text-brand-400">
                      Read More
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition" />
                    </span>
                  </div>
                </div>
              </PremiumCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
