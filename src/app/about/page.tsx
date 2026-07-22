import { PremiumHeading } from "@/components/ui/PremiumHeading";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { PremiumBadge } from "@/components/ui/PremiumBadge";
import { Sparkles, Users, Shield, Zap, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-premium bg-dots py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <PremiumBadge variant="gradient" className="mb-4" icon={<Sparkles className="h-3.5 w-3.5" />}>
            About Navorika
          </PremiumBadge>
          <PremiumHeading level="h1" gradient>
            Building Tools for Everyone
          </PremiumHeading>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            We believe in making complex tasks simple, accessible, and free for everyone.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <PremiumCard hover>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-brand-100 p-3 dark:bg-brand-900/30">
                <Heart className="h-6 w-6 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Our Mission</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  To provide free, reliable, and beautifully designed tools that make people's lives easier.
                </p>
              </div>
            </div>
          </PremiumCard>

          <PremiumCard hover>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-success-100 p-3 dark:bg-success-900/30">
                <Users className="h-6 w-6 text-success-600 dark:text-success-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Our Users</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Trusted by thousands of users worldwide for accurate and instant calculations.
                </p>
              </div>
            </div>
          </PremiumCard>

          <PremiumCard hover>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-accent-100 p-3 dark:bg-accent-900/30">
                <Shield className="h-6 w-6 text-accent-600 dark:text-accent-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Privacy First</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Your data stays in your browser. We don't store or share your information.
                </p>
              </div>
            </div>
          </PremiumCard>

          <PremiumCard hover>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-warning-100 p-3 dark:bg-warning-900/30">
                <Zap className="h-6 w-6 text-warning-600 dark:text-warning-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Lightning Fast</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Every tool is optimized for speed, delivering instant results every time.
                </p>
              </div>
            </div>
          </PremiumCard>
        </div>
      </div>
    </div>
  );
}
