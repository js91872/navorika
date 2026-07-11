"use client";

interface CalculatorHeaderProps {
  title: string;
  description: string;
}

export default function CalculatorHeader({
  title,
  description,
}: CalculatorHeaderProps) {
  return (
    <div className="border-b border-slate-200 px-8 py-10 lg:px-12">

      <h1 className="text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl">
        {title}
      </h1>

      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
        {description}
      </p>

    </div>
  );
}