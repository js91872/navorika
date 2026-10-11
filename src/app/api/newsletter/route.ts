import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';
import {
  appendNewsletterEvent,
  createUnsubscribeToken,
  NEWSLETTER_CONSENT_VERSION,
  readNewsletterEvents,
  withNewsletterLock,
} from '@/lib/newsletterStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
  const limit = rateLimit(`newsletter:${ip}`, 5, 10 * 60 * 1000);
  if (!limit.success) {
    return NextResponse.json({ error: 'Please wait a little before trying again.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    if (typeof body.website === 'string' && body.website.trim()) {
      return NextResponse.json({ success: true });
    }

    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (email.length > 254 || !emailPattern.test(email)) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
    }
    if (body.consent !== true) {
      return NextResponse.json({ error: 'Please confirm that you want to receive email updates.' }, { status: 400 });
    }

    await withNewsletterLock(async () => {
      const events = await readNewsletterEvents();
      const subscriptions = new Map<string, { token: string; active: boolean }>();
      const tokenEmails = new Map<string, string>();

      for (const event of events) {
        if (event.type === 'subscribe') {
          subscriptions.set(event.email, { token: event.token, active: true });
          tokenEmails.set(event.token, event.email);
        } else {
          const subscribedEmail = tokenEmails.get(event.token);
          if (subscribedEmail) subscriptions.get(subscribedEmail)!.active = false;
        }
      }

      if (subscriptions.get(email)?.active) return;

      await appendNewsletterEvent({
        type: 'subscribe',
        email,
        token: createUnsubscribeToken(),
        subscribedAt: new Date().toISOString(),
        consentVersion: NEWSLETTER_CONSENT_VERSION,
      });
    });

    return NextResponse.json({ success: true, message: 'You’re on the list. Thanks for subscribing.' });
  } catch (error) {
    console.error('Newsletter signup failed:', error);
    return NextResponse.json({ error: 'We could not save your signup. Please try again later.' }, { status: 500 });
  }
}
