"use client";

import Link from "next/link";
import { Menu, Search } from "lucide-react";

import Container from "@/components/ui/Container";
import Logo from "@/components/layout/Logo";
import { navigation } from "@/lib/navigation";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <Container>
        <div className="flex h-18 items-center justify-between">

          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label="Main Navigation"
          >
            {navigation.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">

            {/* Search */}

            <button
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border transition-colors hover:bg-muted"
            >
              <Search size={18} />
            </button>

            {/* Mobile Menu */}

            <button
              aria-label="Open Menu"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border transition-colors hover:bg-muted lg:hidden"
            >
              <Menu size={20} />
            </button>

          </div>
        </div>
      </Container>
    </header>
  );
}