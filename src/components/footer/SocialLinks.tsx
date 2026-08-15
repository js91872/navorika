'use client';

export default function SocialLinks() {
  return (
    <div className="flex items-center gap-4 mt-4">
      <a
        href="https://github.com/js91872/navorika"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full hover:bg-[var(--muted)] transition-all text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        aria-label="GitHub"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
        </svg>
      </a>
      <a
        href="https://twitter.com/navorika"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full hover:bg-[var(--muted)] transition-all text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        aria-label="Twitter (X)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4l11.733 16h4.267l-11.733 -16zM4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
        </svg>
      </a>
      <a
        href="https://linkedin.com/company/navorika"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full hover:bg-[var(--muted)] transition-all text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        aria-label="LinkedIn"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
          <rect x="2" y="9" width="4" height="12"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
      </a>
      <a
        href="https://youtube.com/@navorika"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full hover:bg-[var(--muted)] transition-all text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        aria-label="YouTube"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.56 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
          <polygon points="10 11 15 12 10 15 10 11"/>
        </svg>
      </a>
      <a
        href="mailto:admin@navorika.com"
        className="p-2 rounded-full hover:bg-[var(--muted)] transition-all text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        aria-label="Email"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      </a>
    </div>
  );
}
