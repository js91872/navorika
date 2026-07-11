import Link from "next/link";

const navigation = [
  { name: "Tools", href: "#" },
  { name: "Categories", href: "#" },
  { name: "Guides", href: "#" },
  { name: "About", href: "#" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">

        <Link
          href="/"
          className="text-2xl font-black tracking-tight"
        >
          <span className="text-blue-600">Navo</span>
          <span className="text-slate-900">rika</span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <button className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
          Explore Tools
        </button>

      </div>
    </header>
  );
}