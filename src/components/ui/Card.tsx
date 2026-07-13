import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={`
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        transition-shadow
        hover:shadow-md
        ${className}
      `}
    >
      {children}
    </div>
  );
}