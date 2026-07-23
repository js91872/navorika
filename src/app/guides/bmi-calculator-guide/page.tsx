import Link from "next/link";
import { ArrowLeft, Activity, Heart } from "lucide-react";
import { PremiumHeading } from "@/components/ui/PremiumHeading";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { PremiumBadge } from "@/components/ui/PremiumBadge";

export const metadata = {
  title: "BMI Calculator Guide | Complete Guide to Body Mass Index",
  description: "Learn everything about BMI - what it is, how to calculate it, what it means for your health, and how to maintain a healthy BMI.",
};

export default function BMIGuide() {
  return (
    <div className="min-h-screen bg-premium bg-dots py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/guides" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Guides
        </Link>

        <div className="mb-8">
          <PremiumBadge variant="gradient" className="mb-3">Health Guide</PremiumBadge>
          <PremiumHeading level="h1">BMI Calculator Guide</PremiumHeading>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-3">
            Understand your BMI and what it means for your health journey
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
            <span>📅 July 22, 2026</span>
            <span>•</span>
            <span>⏱️ 4 min read</span>
            <span>•</span>
            <span>👤 Navorika Team</span>
          </div>
        </div>

        <div className="space-y-8">
          <PremiumCard>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2>🏥 What is BMI?</h2>
              <p>
                <strong>Body Mass Index (BMI)</strong> is a screening tool that estimates body fat based on your height and weight. It's calculated by dividing your weight in kilograms by your height in meters squared.
              </p>
            </div>
          </PremiumCard>

          <PremiumCard>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2>📐 BMI Categories</h2>
              <div className="grid gap-4 my-4">
                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                  <p className="font-semibold text-blue-700 dark:text-blue-400">Underweight: Below 18.5</p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                  <p className="font-semibold text-emerald-700 dark:text-emerald-400">Normal Weight: 18.5 - 24.9</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-950/30 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
                  <p className="font-semibold text-orange-700 dark:text-orange-400">Overweight: 25 - 29.9</p>
                </div>
                <div className="bg-red-50 dark:bg-red-950/30 rounded-xl p-4 border border-red-200 dark:border-red-800">
                  <p className="font-semibold text-red-700 dark:text-red-400">Obese: 30 and above</p>
                </div>
              </div>
            </div>
          </PremiumCard>

          <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 p-8 text-white text-center">
            <h3 className="text-2xl font-bold">Check Your BMI Now</h3>
            <p className="mt-2 text-white/80">Use our free BMI calculator to assess your health</p>
            <Link 
              href="/tools/bmi-calculator"
              className="inline-flex items-center gap-2 mt-4 bg-white text-brand-600 px-6 py-3 rounded-xl font-semibold hover:bg-slate-100 transition"
            >
              Try BMI Calculator
              <Activity className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
