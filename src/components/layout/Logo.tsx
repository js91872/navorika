import Link from "next/link";
import { Compass } from "lucide-react";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-md">
        <Compass size={22} strokeWidth={2.3} />
      </div>

      <div>
        <div className="text-xl font-bold tracking-tight">
          Navorika
        </div>

        <div className="text-xs text-muted-foreground">
          Smart Tools Platform
        </div>
      </div>
    </Link>
  );
}