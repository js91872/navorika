"use client";

import Link from "next/link";
import { Search, Menu } from "lucide-react";

import Container from "@/components/ui/Container";
import Logo from "@/components/layout/Logo";
import { navigation } from "@/lib/navigation";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <Container>
        <div className="flex h-20 items-center justify-between">

          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-primary"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">

            <button
              className="hidden h-11 items-center gap-2 rounded-xl border border-border px-4 transition hover:bg-muted md:flex"
            >
              <Search size={18} />
              <span className="text-sm">Search</span>
            </button>

            <button
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-border transition hover:bg-muted lg:hidden"
            >
              <Menu size={20} />
            </button>

          </div>

        </div>
      </Container>
    </header>
  );
}