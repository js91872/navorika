import { PremiumHeading } from "@/components/ui/PremiumHeading";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { PremiumBadge } from "@/components/ui/PremiumBadge";
import { Sparkles, Mail, MessageSquare, Users, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-premium bg-dots py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <PremiumBadge variant="gradient" className="mb-4" icon={<Sparkles className="h-3.5 w-3.5" />}>
            Get in Touch
          </PremiumBadge>
          <PremiumHeading level="h1" gradient>
            Contact Us
          </PremiumHeading>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Have questions, feedback, or suggestions? We'd love to hear from you!
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <PremiumCard hover>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-brand-100 p-3 dark:bg-brand-900/30">
                <Mail className="h-6 w-6 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Email</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  support@navorika.com
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  We'll respond within 24 hours
                </p>
              </div>
            </div>
          </PremiumCard>

          <PremiumCard hover>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-accent-100 p-3 dark:bg-accent-900/30">
                <MessageSquare className="h-6 w-6 text-accent-600 dark:text-accent-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Feedback</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Share your thoughts and suggestions
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  Help us improve
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
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Community</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Join our growing community
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  Connect with other users
                </p>
              </div>
            </div>
          </PremiumCard>

          <PremiumCard hover>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-warning-100 p-3 dark:bg-warning-900/30">
                <Clock className="h-6 w-6 text-warning-600 dark:text-warning-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Response Time</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Fast response guaranteed
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  Usually within a few hours
                </p>
              </div>
            </div>
          </PremiumCard>
        </div>
      </div>
    </div>
  );
}
