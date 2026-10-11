import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const directory = process.env.NAVORIKA_NEWSLETTER_DATA_DIR || '/var/lib/navorika';
const file = join(directory, 'newsletter.jsonl');
const baseUrl = (process.env.NAVORIKA_SITE_URL || 'https://navorika.com').replace(/\/$/, '');

const csv = (value) => {
  const text = String(value);
  const safe = /^[\u0000-\u0020]*[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
};

let source;
try {
  source = await readFile(file, 'utf8');
} catch (error) {
  if (error.code === 'ENOENT') {
    console.error(`No newsletter data file found at ${file}`);
    process.exit(1);
  }
  throw error;
}

const subscribers = new Map();
for (const line of source.split('\n').filter(Boolean)) {
  const event = JSON.parse(line);
  if (event.type === 'subscribe') subscribers.set(event.token, { ...event, active: true });
  if (event.type === 'unsubscribe' && subscribers.has(event.token)) {
    subscribers.get(event.token).active = false;
  }
}

console.log(['email', 'subscribed_at', 'consent_version', 'unsubscribe_url', 'one_click_unsubscribe_url'].map(csv).join(','));
for (const subscriber of subscribers.values()) {
  if (!subscriber.active) continue;
  const unsubscribeUrl = `${baseUrl}/newsletter/unsubscribe?token=${encodeURIComponent(subscriber.token)}`;
  const oneClickUrl = `${baseUrl}/api/newsletter/unsubscribe?token=${encodeURIComponent(subscriber.token)}`;
  console.log([subscriber.email, subscriber.subscribedAt, subscriber.consentVersion, unsubscribeUrl, oneClickUrl].map(csv).join(','));
}
