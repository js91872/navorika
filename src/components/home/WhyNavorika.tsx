"use client";

import { Zap, Shield, Monitor, CheckCircle } from "lucide-react";
import Container from "@/components/ui/Container";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Every tool is optimized to deliver results instantly with a smooth and responsive experience.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your files and data remain secure. Processing happens directly in your browser.",
  },
  {
    icon: Monitor,
    title: "Works Everywhere",
    description: "Built for desktop, tablet and mobile so you can access your tools from any device.",
  },
  {
    icon: CheckCircle,
    title: "Reliable Results",
    description: "Every calculator, converter and utility is carefully developed and tested for accuracy.",
  },
];

export default function WhyNavorika() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Why <span className="text-blue-400">Navorika</span>
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            Built for Speed, Accuracy & Trust
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                <feature.icon className="h-7 w-7 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
