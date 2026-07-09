import Container from "@/components/ui/Container";
import FeatureCard from "./FeatureCard";

import {
  Zap,
  ShieldCheck,
  Lock,
  BadgeCheck,
} from "lucide-react";

const features = [
  {
    title: "Lightning Fast",
    description:
      "Every tool is optimized for speed so you get instant results without waiting.",
    icon: Zap,
  },
  {
    title: "Privacy First",
    description:
      "Most processing happens in your browser. Your files stay private whenever possible.",
    icon: Lock,
  },
  {
    title: "Secure & Trusted",
    description:
      "Built using modern web technologies with a strong focus on security and reliability.",
    icon: ShieldCheck,
  },
  {
    title: "Always Free",
    description:
      "Core tools will remain free, fast, and accessible without mandatory sign-up.",
    icon: BadgeCheck,
  },
];

export default function WhyNavorika() {
  return (
    <section className="py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold">
            Why Choose Navorika?
          </h2>

          <p className="mt-5 text-lg text-muted-foreground">
            Designed to be fast, secure, simple, and genuinely useful every day.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              {...feature}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}