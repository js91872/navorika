"use client";

import { ReactNode } from "react";

interface ResultGridProps {
  children: ReactNode;
}

export default function ResultGrid({
  children,
}: ResultGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {children}
    </div>
  );
}