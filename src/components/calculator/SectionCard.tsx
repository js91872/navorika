"use client";

import { ReactNode } from "react";

interface SectionCardProps {
  title?: string;
  children: ReactNode;
}

export default function SectionCard({
  title,
  children,
}: SectionCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      {title && (
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          {title}
        </h2>
      )}

      {children}

    </div>
  );
}