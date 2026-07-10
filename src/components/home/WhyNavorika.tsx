import Container from "@/components/ui/Container";
import {
  Zap,
  Shield,
  Globe,
  BadgeCheck,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Every tool is optimized to deliver results instantly with a smooth and responsive experience.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your files and data remain secure. Wherever possible, processing happens directly in your browser.",
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    description:
      "Built for desktop, tablet and mobile so you can access your favorite tools from any device.",
  },
  {
    icon: BadgeCheck,
    title: "Reliable Results",
    description:
      "Every calculator, converter and utility is carefully developed and tested for accuracy.",
  },
];

export default function WhyNavorika() {
  return (
    <section className="bg-white py-28">
      <Container>
        <div className="mx-auto max-w-3xl text-center">

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Why Navorika
          </span>

          <h2 className="mt-6 text-5xl font-black tracking-tight text-slate-900">
            Built for Speed, Accuracy & Trust
          </h2>

          <p className="mt-6 text-xl leading-8 text-slate-600">
            Navorika is more than a collection of online tools. It is a
            thoughtfully designed platform focused on delivering fast,
            reliable and privacy-friendly experiences for everyone.
          </p>

        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <Icon size={30} />
                </div>

                <h3 className="mt-8 text-2xl font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {feature.description}
                </p>
              </div>
            );
          })}

        </div>
      </Container>
    </section>
  );
}