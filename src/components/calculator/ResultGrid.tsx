import React from "react";

interface ResultGridProps {
  children: React.ReactNode;
  cols?: number;
}

export default function ResultGrid({ children, cols = 3 }: ResultGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-4`}>
      {children}
    </div>
  );
}
