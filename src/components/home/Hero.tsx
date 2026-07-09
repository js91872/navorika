import Container from "@/components/ui/Container";
import { Search, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <Container>
        <div className="mx-auto flex min-h-[85vh] max-w-6xl flex-col items-center justify-center text-center">

          {/* Badge */}

          <div className="mb-8 rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-medium text-blue-700">
            🚀 200+ Free Online Tools • No Signup Required
          </div>

          {/* Heading */}

          <h1 className="max-w-5xl text-5xl font-extrabold leading-tight tracking-tight text-foreground md:text-7xl">
            One Platform.
            <br />
            Every Tool You Need.
          </h1>

          {/* Description */}

          <p className="mt-8 max-w-3xl text-xl leading-9 text-muted-foreground">
            Free online calculators, PDF tools, image tools, AI utilities,
            converters and productivity apps — beautifully designed and
            lightning fast.
          </p>

          {/* Search */}

          <div className="mt-12 flex w-full max-w-3xl items-center rounded-2xl border bg-card shadow-lg">

            <Search className="ml-6 text-muted-foreground" size={22} />

            <input
              type="text"
              placeholder="Search for any tool..."
              className="flex-1 bg-transparent px-5 py-5 text-lg outline-none"
            />

            <button className="m-2 flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-semibold text-white transition hover:opacity-90">
              Search
              <ArrowRight size={18} />
            </button>

          </div>

          {/* Trending */}

          <div className="mt-8 flex flex-wrap justify-center gap-3">

            {[
              "EMI Calculator",
              "GST Calculator",
              "Age Calculator",
              "PDF to Word",
              "Image Compressor",
              "QR Generator",
            ].map((item) => (
              <button
                key={item}
                className="rounded-full border bg-white px-5 py-2 text-sm transition hover:bg-primary hover:text-white"
              >
                {item}
              </button>
            ))}

          </div>

          {/* Stats */}

          <div className="mt-20 grid w-full max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">

            <Stat number="200+" label="Tools" />

            <Stat number="100%" label="Free" />

            <Stat number="<1s" label="Fast Results" />

            <Stat number="24×7" label="Available" />

          </div>

        </div>
      </Container>
    </section>
  );
}

function Stat({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div className="rounded-3xl border bg-card p-8 shadow-sm">
      <div className="text-4xl font-bold text-primary">{number}</div>
      <div className="mt-2 text-muted-foreground">{label}</div>
    </div>
  );
}