import React from "react";

interface ResultGridProps {
  children: React.ReactNode;
  cols?: number;
  className?: string;
}

export default function ResultGrid({ 
  children, 
  cols = 3,
  className = "" 
}: ResultGridProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cols} gap-3 ${className}`}>
      {children}
    </div>
  );
}
