import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';
import {
  appendNewsletterEvent,
  readNewsletterEvents,
  withNewsletterLock,
} from '@/lib/newsletterStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function unsubscribe(token: string) {
  if (!/^[A-Za-z0-9_-]{40,60}$/.test(token)) return;

  await withNewsletterLock(async () => {
    const events = await readNewsletterEvents();
    let active = false;
    for (const event of events) {
      if (event.type === 'subscribe' && event.token === token) active = true;
      if (event.type === 'unsubscribe' && event.token === token) active = false;
    }
    if (active) {
      await appendNewsletterEvent({
        type: 'unsubscribe',
        token,
        unsubscribedAt: new Date().toISOString(),
      });
    }
  });
}

export async function POST(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
  const limit = rateLimit(`newsletter-unsubscribe:${ip}`, 20, 10 * 60 * 1000);
  if (!limit.success) {
    return NextResponse.json({ error: 'Please try again in a few minutes.' }, { status: 429 });
  }

  try {
    const url = new URL(request.url);
    const contentType = request.headers.get('content-type') || '';
    let token = url.searchParams.get('token') || '';

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const form = new URLSearchParams(await request.text());
      if (form.get('List-Unsubscribe') !== 'One-Click') {
        return NextResponse.json({ error: 'Invalid unsubscribe request.' }, { status: 400 });
      }
    } else {
      const body = await request.json();
      token = typeof body.token === 'string' ? body.token : token;
    }

    if (!token) return NextResponse.json({ error: 'Unsubscribe link is incomplete.' }, { status: 400 });
    await unsubscribe(token);
    return NextResponse.json({ success: true, message: 'You have been unsubscribed from Navorika email updates.' });
  } catch (error) {
    console.error('Newsletter unsubscribe failed:', error);
    return NextResponse.json({ error: 'We could not process this request. Please try again later.' }, { status: 500 });
  }
}
