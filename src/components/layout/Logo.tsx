import Link from "next/link";
import { Compass } from "lucide-react";

export default function Logo() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-4"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg transition duration-300 group-hover:scale-105">

        <Compass size={24} strokeWidth={2.5} />

      </div>

      <div>

        <h1 className="text-2xl font-extrabold tracking-tight">
          Navorika
        </h1>

        <p className="-mt-1 text-xs tracking-wide text-muted-foreground uppercase">
          Smart Tools Platform
        </p>

      </div>

    </Link>
  );
}