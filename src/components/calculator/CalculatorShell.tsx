"use client";

import { ReactNode } from "react";
import Container from "@/components/ui/Container";

interface CalculatorShellProps {
  children: ReactNode;
}

export default function CalculatorShell({
  children,
}: CalculatorShellProps) {
  return (
    <section className="py-16 lg:py-20">
      <Container>
        <div
          className="
            mx-auto
            max-w-7xl
            rounded-3xl
            border
            border-slate-200
            bg-white
            shadow-xl
          "
        >
          {children}
        </div>
      </Container>
    </section>
  );
}