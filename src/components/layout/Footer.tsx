import Link from "next/link";
import Container from "@/components/ui/Container";

const productLinks = [
  { name: "Tools", href: "/tools" },
  { name: "Categories", href: "/categories" },
  { name: "Guides", href: "/guides" },
];

const companyLinks = [
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Privacy", href: "/privacy" },
];

const resourceLinks = [
  { name: "Blog", href: "/blog" },
  { name: "Help", href: "/help" },
  { name: "Sitemap", href: "/sitemap" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <Container>
        <div className="py-12 lg:py-16">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Navo<span className="text-blue-600">rika</span>
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-500 max-w-xs">
                Fast, reliable and beautifully designed online tools for productivity, finance, PDFs, AI and more.
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Product</h3>
              <ul className="mt-3 space-y-2">
                {productLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-slate-500 hover:text-blue-600 transition">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Company</h3>
              <ul className="mt-3 space-y-2">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-slate-500 hover:text-blue-600 transition">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Resources</h3>
              <ul className="mt-3 space-y-2">
                {resourceLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-slate-500 hover:text-blue-600 transition">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
            <p>© {new Date().getFullYear()} Navorika. All rights reserved.</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
