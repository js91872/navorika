"use client";

import { Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";

interface CalculatorHeaderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  updatedOn?: string;
  accuracy?: string;
  toolSlug?: string;
}

export default function CalculatorHeader({
  title,
  description,
  icon,
  updatedOn = "July 2026",
  accuracy = "Accurate as per standard formulas",
  toolSlug,
}: CalculatorHeaderProps) {
  const handleBookmark = () => {
    toast.success("Bookmarked! Find it in your saved tools.", {
      duration: 3000,
      icon: "🔖",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!", {
        duration: 3000,
        icon: "📋",
      });
    }
  };

  return (
    <div className="relative border-b border-slate-200 px-6 py-8 sm:px-8 lg:px-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {icon && (
            <div className="hidden sm:flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 text-2xl">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              {title}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-600 sm:text-base">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-500 hover:text-blue-600"
            onClick={handleBookmark}
          >
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:inline">Bookmark</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-500 hover:text-blue-600"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 ring-1 ring-green-200">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          {accuracy}
        </span>
        <span className="text-xs text-slate-500">
          Last Updated: {updatedOn}
        </span>
      </div>
    </div>
  );
}
