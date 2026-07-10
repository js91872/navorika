"use client";

import Link from "next/link";
import { Menu, Search } from "lucide-react";

import Container from "@/components/ui/Container";
import Logo from "@/components/layout/Logo";
import { navigation } from "@/lib/navigation";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/70">
      <Container>
        <div className="flex h-20 items-center justify-between">

          {/* Logo */}

          <Logo />

          {/* Desktop Navigation */}

          <nav className="hidden items-center gap-10 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="relative text-[15px] font-medium text-muted-foreground transition-all duration-300 hover:text-foreground"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Right Side */}

          <div className="flex items-center gap-4">

            <button className="hidden h-11 items-center gap-2 rounded-2xl border border-border bg-card px-5 shadow-sm transition-all duration-300 hover:shadow-md md:flex">

              <Search size={17} />

              <span className="text-sm font-medium">
                Search
              </span>

            </button>

            <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md lg:hidden">

              <Menu size={20} />

            </button>

          </div>

        </div>
      </Container>
    </header>
  );
}