import { PremiumHeading } from "@/components/ui/PremiumHeading";
import { PremiumBadge } from "@/components/ui/PremiumBadge";
import { Sparkles, Shield, Eye, Lock, Server, User } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-premium bg-dots py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <PremiumBadge variant="gradient" className="mb-4" icon={<Sparkles className="h-3.5 w-3.5" />}>
            Privacy Policy
          </PremiumBadge>
          <PremiumHeading level="h1" gradient>
            Your Privacy Matters
          </PremiumHeading>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            We believe in transparency and protecting your data.
          </p>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-brand-100 p-2 dark:bg-brand-900/30">
                <Shield className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Data Protection</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  All calculations and file processing happen directly in your browser. We don't store or transmit your data to any server.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-success-100 p-2 dark:bg-success-900/30">
                <Eye className="h-5 w-5 text-success-600 dark:text-success-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">No Tracking</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  We don't use cookies for tracking. Your browsing history and tool usage remain private.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-accent-100 p-2 dark:bg-accent-900/30">
                <Lock className="h-5 w-5 text-accent-600 dark:text-accent-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Secure Processing</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  All tools process data locally. We never have access to your inputs or files.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-warning-100 p-2 dark:bg-warning-900/30">
                <Server className="h-5 w-5 text-warning-600 dark:text-warning-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">No Data Storage</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  We don't store any user data. Everything you do on Navorika stays private.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-pink-100 p-2 dark:bg-pink-900/30">
                <User className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Anonymous Usage</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  No account is required. Use all tools anonymously without any registration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
