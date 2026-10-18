import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CidrSubnetCalculator from '@/components/tools/CidrSubnetCalculator';

const faqs = [
  {
    question: 'What is a wildcard mask?',
    answer:
      'A wildcard mask is the inverse of a subnet mask. Cisco-style ACL configurations commonly use wildcard masks to identify which address bits must match.',
  },
  {
    question: 'What is the wildcard mask for /24?',
    answer:
      'A /24 subnet mask is 255.255.255.0, so the corresponding wildcard mask is 0.0.0.255.',
  },
  {
    question: 'How many usable hosts are in a /27?',
    answer:
      'A conventional IPv4 /27 contains 32 total addresses and normally provides 30 usable host addresses.',
  },
  {
    question: 'Does the calculator support /31 networks?',
    answer:
      'Yes. It treats a /31 as a two-address point-to-point network rather than subtracting network and broadcast addresses.',
  },
];

export default function CidrSubnetPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 pb-20 pt-24 text-[var(--foreground)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/categories/developer-tools"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:text-indigo-600"
        >
          <ArrowLeft className="size-4" />
          Back to Developer Tools
        </Link>

        <header className="mb-10 max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Network administration tool
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            CIDR, Subnet &amp; Wildcard Mask Calculator
          </h1>

          <p className="mt-4 text-lg leading-8 text-[var(--muted-foreground)]">
            Convert IPv4 CIDR notation into subnet masks, Cisco wildcard
            masks, network and broadcast addresses, host ranges and address
            counts instantly.
          </p>
        </header>

        <CidrSubnetCalculator />

        <article className="mx-auto mt-16 max-w-5xl space-y-12 text-[var(--muted-foreground)]">
          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              CIDR to Subnet and Wildcard Mask
            </h2>
            <p className="mt-4 leading-7">
              CIDR notation describes how many leading bits identify the
              network. A /24 uses 24 network bits. The subnet mask represents
              those bits as ones, while the wildcard mask inverts them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Network and Host Range
            </h2>
            <p className="mt-4 leading-7">
              The network address is obtained by applying the subnet mask to
              the IPv4 address. The broadcast address sets all host bits to
              one. Conventional subnets from /0 through /30 reserve the
              network and broadcast addresses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Cisco Wildcard Masks
            </h2>
            <p className="mt-4 leading-7">
              Wildcard masks are commonly used in Cisco access-control and
              routing configurations. For example, 192.168.1.0/24 corresponds
              to network 192.168.1.0 with wildcard mask 0.0.0.255.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Frequently Asked Questions
            </h2>

            <div className="mt-5 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--card)] px-6">
              {faqs.map(({ question, answer }) => (
                <details key={question} className="py-5">
                  <summary className="cursor-pointer font-semibold text-[var(--foreground)]">
                    {question}
                  </summary>
                  <p className="mt-3 text-sm leading-6">{answer}</p>
                </details>
              ))}
            </div>
          </section>

          <aside className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-sm leading-6">
            This calculator handles IPv4 networks only. Verify ACL, routing and
            device configuration before applying generated values to production
            infrastructure.
          </aside>
        </article>
      </div>
    </main>
  );
}
