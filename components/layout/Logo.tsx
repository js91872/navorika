import Link from "next/link";
import { Compass } from "lucide-react";

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="Navorika Home"
      className="flex items-center gap-3 transition-opacity hover:opacity-90"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
        <Compass size={22} strokeWidth={2.2} />
      </div>

      <div className="flex flex-col leading-none">
        <span className="text-xl font-bold tracking-tight text-foreground">
          Navorika
        </span>

        <span className="text-xs text-muted-foreground">
          Smart Tools. Simplified.
        </span>
      </div>
    </Link>
  );
}