"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PremiumButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gradient";
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
    primary: "bg-brand-600 text-white shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 hover:bg-brand-700 hover:-translate-y-0.5 active:scale-95 focus:ring-brand-500",
    secondary: "bg-slate-700 text-white shadow-lg shadow-slate-500/30 hover:shadow-xl hover:shadow-slate-500/40 hover:bg-slate-800 hover:-translate-y-0.5 active:scale-95 focus:ring-slate-500",
    outline: "border-2 border-slate-200 bg-transparent text-slate-700 hover:border-brand-500 hover:text-brand-600 hover:bg-brand-50/50 active:scale-95 focus:ring-brand-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-400 dark:hover:bg-brand-950/30",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-95 focus:ring-slate-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
    gradient: "bg-gradient-to-r from-brand-600 via-accent-500 to-brand-600 bg-[length:200%_auto] text-white shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 hover:-translate-y-0.5 active:scale-95 focus:ring-brand-500 hover:bg-[position:right_center] transition-all duration-500",
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
