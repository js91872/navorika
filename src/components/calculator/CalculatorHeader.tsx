"use client";

interface CalculatorHeaderProps {
  title: string;
  description: string;
  updatedOn?: string;
  accuracy?: string;
}

export default function CalculatorHeader({
  title,
  description,
  updatedOn = "July 2026",
  accuracy = "Accurate as per standard financial formulas",
}: CalculatorHeaderProps) {
  return (
    <div className="border-b border-slate-200 px-8 py-10 lg:px-12">

      <div className="flex flex-wrap items-center gap-3">

        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
          ✓ {accuracy}
        </span>

        <span className="text-sm text-slate-500">
          Last Updated: {updatedOn}
        </span>

      </div>

      <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl">
        {title}
      </h1>

      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
        {description}
      </p>

    </div>
  );
}