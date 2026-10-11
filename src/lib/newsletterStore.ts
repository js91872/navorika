import { randomBytes } from 'node:crypto';
import { chmod, mkdir, open, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

export const NEWSLETTER_CONSENT_VERSION = '2026-10-11';

export type NewsletterEvent =
  | {
      type: 'subscribe';
      email: string;
      token: string;
      subscribedAt: string;
      consentVersion: string;
    }
  | {
      type: 'unsubscribe';
      token: string;
      unsubscribedAt: string;
    };

let writeQueue: Promise<void> = Promise.resolve();

export function withNewsletterLock<T>(operation: () => Promise<T>): Promise<T> {
  const result = writeQueue.then(operation, operation);
  writeQueue = result.then(() => undefined, () => undefined);
  return result;
}

export function getNewsletterFilePath(): string {
  const directory = process.env.NAVORIKA_NEWSLETTER_DATA_DIR || '/var/lib/navorika';
  return join(directory, 'newsletter.jsonl');
}

export async function readNewsletterEvents(): Promise<NewsletterEvent[]> {
  try {
    const source = await readFile(getNewsletterFilePath(), 'utf8');
    return source
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line) as NewsletterEvent);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

export async function appendNewsletterEvent(event: NewsletterEvent): Promise<void> {
  const filePath = getNewsletterFilePath();
  await mkdir(dirname(filePath), { recursive: true, mode: 0o700 });
  const file = await open(filePath, 'a', 0o600);
  try {
    await file.writeFile(`${JSON.stringify(event)}\n`, 'utf8');
  } finally {
    await file.close();
  }
  await chmod(filePath, 0o600);
}

export function createUnsubscribeToken(): string {
  return randomBytes(32).toString('base64url');
}
