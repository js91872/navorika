import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-12 md:grid-cols-4">

          <div>

            <h3 className="text-2xl font-black">
              <span className="text-blue-600">Navo</span>rika
            </h3>

            <p className="mt-4 text-slate-600">
              Fast, reliable and beautifully designed online tools for
              productivity, finance, PDFs, AI and more.
            </p>

          </div>

          <div>

            <h4 className="font-bold">Product</h4>

            <ul className="mt-4 space-y-3 text-slate-600">
              <li><Link href="#">Tools</Link></li>
              <li><Link href="#">Categories</Link></li>
              <li><Link href="#">Guides</Link></li>
            </ul>

          </div>

          <div>

            <h4 className="font-bold">Company</h4>

            <ul className="mt-4 space-y-3 text-slate-600">
              <li><Link href="#">About</Link></li>
              <li><Link href="#">Contact</Link></li>
              <li><Link href="#">Privacy</Link></li>
            </ul>

          </div>

          <div>

            <h4 className="font-bold">Resources</h4>

            <ul className="mt-4 space-y-3 text-slate-600">
              <li><Link href="#">Blog</Link></li>
              <li><Link href="#">Help</Link></li>
              <li><Link href="#">Sitemap</Link></li>
            </ul>

          </div>

        </div>

        <div className="mt-16 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Navorika. All rights reserved.
        </div>

      </div>
    </footer>
  );
}