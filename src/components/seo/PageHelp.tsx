import { pageHelp } from '@/data/pageHelp';

/** Server-rendered support copy. Keep it below the page's primary task. */
export default function PageHelp({ path }: { path: string }) {
  const sections = pageHelp[path];
  if (!sections) return null;
  return (
    <article data-page-help={path} className="mx-auto my-12 max-w-4xl space-y-7 border-t border-[var(--border)] px-4 pt-8 sm:px-6">
      {sections.map(({ heading, body }) => (
        <section key={heading}>
          <h2 className="text-xl font-bold text-[var(--foreground)]">{heading}</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{body}</p>
        </section>
      ))}
    </article>
  );
}
