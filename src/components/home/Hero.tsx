"use client";

import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white dark:from-slate-900 dark:to-slate-800 py-20 md:py-28">
      <Container>
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Free Online Tools for{" "}
            <span className="bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent">
              Everyone
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8">
            Discover 40+ powerful tools for finance, PDFs, images, health, and more.
          </p>
          
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search for tools..."
              className="w-full px-6 py-4 pl-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent shadow-lg"
            />
            <Button className="mt-4 w-full md:w-auto md:absolute md:right-2 md:top-1/2 md:-translate-y-1/2">
              Search
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
