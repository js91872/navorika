import Link from 'next/link';
import './globals.css';
export default function GlobalNotFound() {
  return <html lang="en"><body className="bg-[var(--background)] text-[var(--foreground)]">
    <main className="mx-auto max-w-xl px-6 py-24">
      <h1 className="text-3xl font-bold">404 — Page not found</h1>
      <p className="my-5">This page does not exist. Choose an available tool or language from Navorika.</p>
      <Link href="/" className="text-indigo-600 underline">Navorika home</Link>
    </main>
  </body></html>;
}
