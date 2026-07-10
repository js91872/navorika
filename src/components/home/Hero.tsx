import Container from "@/components/ui/Container";
import { ArrowRight, Search, Sparkles } from "lucide-react";

const trendingTools = [
  "EMI Calculator",
  "GST Calculator",
  "Age Calculator",
  "PDF to Word",
  "Image Compressor",
  "QR Generator",
];

const stats = [
  { number: "200+", label: "Powerful Tools" },
  { number: "100%", label: "Free Forever" },
  { number: "<1 Sec", label: "Fast Results" },
  { number: "24×7", label: "Available" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">

      {/* Background */}

      <div className="absolute inset-0 -z-10">

        <div className="absolute left-1/2 top-[-220px] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute right-0 top-32 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-slate-300/20 blur-3xl" />

      </div>

      <Container>

        <div className="mx-auto flex min-h-[88vh] max-w-6xl flex-col items-center justify-center text-center">

          {/* Badge */}

          <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-6 py-2 shadow-sm backdrop-blur">

            <Sparkles
              size={16}
              className="text-blue-600"
            />

            <span className="text-sm font-semibold text-blue-700">
              200+ Free Online Tools • No Signup Required
            </span>

          </div>

          {/* Heading */}

          <h1 className="max-w-5xl text-6xl font-black leading-[1.02] tracking-tight text-slate-900 md:text-8xl">

            One Platform.

            <br />

            Every Tool You Need.

          </h1>

          {/* Description */}

          <p className="mt-8 max-w-3xl text-xl leading-9 text-slate-600 md:text-2xl">

            Free online calculators, PDF tools, image tools,
            AI utilities, converters and productivity apps —
            beautifully designed, lightning fast and always free.

          </p>

          {/* Search */}

          <div className="mt-14 flex w-full max-w-3xl items-center rounded-3xl border border-slate-200 bg-white p-2 shadow-xl">

            <Search
              size={22}
              className="ml-5 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search any tool..."
              className="flex-1 bg-transparent px-5 py-5 text-lg outline-none placeholder:text-slate-400"
            />

            <button className="flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-blue-700 hover:shadow-lg">

              Search

              <ArrowRight size={18} />

            </button>

          </div>

          {/* Trending */}

          <div className="mt-10 flex flex-wrap justify-center gap-3">

            {trendingTools.map((tool) => (
              <button
                key={tool}
                className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-600 hover:text-blue-600 hover:shadow-md"
              >
                {tool}
              </button>
            ))}

          </div>

          {/* Statistics */}

          <div className="mt-24 grid w-full max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">

            {stats.map((item) => (
              <Stat
                key={item.label}
                number={item.number}
                label={item.label}
              />
            ))}

          </div>

        </div>

      </Container>

    </section>
  );
}

interface StatProps {
  number: string;
  label: string;
}

function Stat({
  number,
  label,
}: StatProps) {
  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

      <div className="text-4xl font-black text-blue-600">

        {number}

      </div>

      <div className="mt-3 text-sm font-medium tracking-wide text-slate-500">

        {label}

      </div>

    </div>
  );
}