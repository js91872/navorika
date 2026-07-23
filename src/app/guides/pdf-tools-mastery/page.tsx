import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { PremiumHeading } from "@/components/ui/PremiumHeading";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { PremiumBadge } from "@/components/ui/PremiumBadge";

export const metadata = {
  title: "PDF Tools Mastery | Complete Guide to PDF Management",
  description: "Master PDF tools with our complete guide. Learn how to merge, split, compress, convert PDFs efficiently.",
};

export default function PDFToolsGuide() {
  return (
    <div className="min-h-screen bg-premium bg-dots py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/guides" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Guides
        </Link>

        <div className="mb-8">
          <PremiumBadge variant="gradient" className="mb-3">PDF Guide</PremiumBadge>
          <PremiumHeading level="h1">PDF Tools Mastery</PremiumHeading>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-3">
            Everything you need to manage PDFs like a pro
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
            <span>📅 July 22, 2026</span>
            <span>•</span>
            <span>⏱️ 7 min read</span>
            <span>•</span>
            <span>👤 Navorika Team</span>
          </div>
        </div>

        <div className="space-y-8">
          <PremiumCard>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2>📄 Why PDF Tools Matter</h2>
              <p>
                PDF (Portable Document Format) is the world's most popular document format. Mastering PDF tools can significantly improve your productivity and document management.
              </p>
            </div>
          </PremiumCard>

          <PremiumCard>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2>🔧 Essential PDF Tools</h2>
              <ul>
                <li><strong>📑 Merge PDF:</strong> Combine multiple PDF files into one</li>
                <li><strong>✂️ Split PDF:</strong> Extract specific pages from PDFs</li>
                <li><strong>📦 Compress PDF:</strong> Reduce file size while maintaining quality</li>
                <li><strong>📄 PDF to Word:</strong> Convert PDFs to editable Word documents</li>
              </ul>
            </div>
          </PremiumCard>

          <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 p-8 text-white text-center">
            <h3 className="text-2xl font-bold">Start Managing PDFs Like a Pro</h3>
            <p className="mt-2 text-white/80">Access our complete suite of free PDF tools</p>
            <Link 
              href="/tools"
              className="inline-flex items-center gap-2 mt-4 bg-white text-brand-600 px-6 py-3 rounded-xl font-semibold hover:bg-slate-100 transition"
            >
              Explore PDF Tools
              <FileText className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
