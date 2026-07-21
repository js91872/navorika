"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PremiumButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

export function PremiumButton({
  children,
  variant = "primary",
  size = "md",
  className,
  onClick,
  disabled = false,
  icon,
  iconPosition = "left",
}: PremiumButtonProps) {
  const baseStyles = "relative inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:scale-95 focus:ring-blue-500",
    secondary: "bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-lg shadow-slate-500/30 hover:shadow-xl hover:shadow-slate-500/40 hover:-translate-y-0.5 active:scale-95 focus:ring-slate-500",
    outline: "border-2 border-slate-200 bg-transparent text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 active:scale-95 focus:ring-blue-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-400 dark:hover:text-blue-400 dark:hover:bg-blue-950/30",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-95 focus:ring-slate-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
  };

  const sizes = {
    sm: "px-3.5 py-2 text-sm gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-base gap-2.5",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
    >
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </button>
  );
}
