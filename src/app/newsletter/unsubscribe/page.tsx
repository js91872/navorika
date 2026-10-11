import type { Metadata } from 'next';
import UnsubscribeForm from '@/components/newsletter/UnsubscribeForm';

export const metadata: Metadata = {
  title: 'Unsubscribe from Email Updates',
  robots: { index: false, follow: false },
};

export default async function NewsletterUnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = '' } = await searchParams;

  return (
    <div className="mx-auto max-w-xl py-12 sm:py-16">
      <p className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Navorika email preferences</p>
      <UnsubscribeForm token={token} />
    </div>
  );
}
