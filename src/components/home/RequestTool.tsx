"use client";

import { useState } from "react";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { Sparkles, Mail, ArrowRight } from "lucide-react";

export default function RequestTool() {
  const [email, setEmail] = useState("");
  const [toolRequest, setToolRequest] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, send this to an API
    console.log({ email, toolRequest });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
      setToolRequest("");
    }, 3000);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-brand-50 via-white to-accent-50 dark:from-brand-950/30 dark:via-slate-900 dark:to-accent-950/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PremiumCard hover={false} glass className="p-8 sm:p-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-gradient-to-br from-brand-500 to-accent-500 p-3">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Need a Custom Tool?
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Tell us what tool you need and we might build it for you!
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:text-slate-200"
              required
            />
            <textarea
              placeholder="Describe the tool you need..."
              value={toolRequest}
              onChange={(e) => setToolRequest(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:text-slate-200"
              required
            />
            <PremiumButton type="submit" variant="gradient" className="w-full">
              {submitted ? (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Request Sent!
                </>
              ) : (
                <>
                  Request a Tool
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </PremiumButton>
          </form>

          {submitted && (
            <p className="mt-4 text-sm text-success-600 dark:text-success-400">
              ✅ Thanks! We'll review your request and get back to you.
            </p>
          )}
        </PremiumCard>
      </div>
    </section>
  );
}
