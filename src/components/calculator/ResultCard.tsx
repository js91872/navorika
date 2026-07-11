"use client";

interface ResultCardProps {
  label: string;
  value: string;
  highlight?: boolean;
}

export default function ResultCard({
  label,
  value,
  highlight = false,
}: ResultCardProps) {
  return (
    <div
      className={`
        rounded-2xl
        border
        p-6
        transition-all
        duration-200
        hover:shadow-md
        ${
          highlight
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card"
        }
      `}
    >
      <p
        className={`text-sm ${
          highlight
            ? "text-primary-foreground/80"
            : "text-muted-foreground"
        }`}
      >
        {label}
      </p>

      <h3 className="mt-3 break-words text-2xl font-bold lg:text-3xl">
        {value}
      </h3>
    </div>
  );
}