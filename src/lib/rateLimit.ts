// Simple in-memory rate limiting (for API routes)

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

const store: RateLimitStore = {};
const DEFAULT_LIMIT = 100;
const DEFAULT_WINDOW = 60 * 1000; // 1 minute

export function rateLimit(
  identifier: string,
  limit: number = DEFAULT_LIMIT,
  windowMs: number = DEFAULT_WINDOW
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = store[identifier] || { count: 0, resetAt: now + windowMs };
  
  // Reset if window expired
  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + windowMs;
  }
  
  record.count++;
  store[identifier] = record;
  
  return {
    success: record.count <= limit,
    remaining: Math.max(0, limit - record.count),
    resetAt: record.resetAt,
  };
}

export function clearRateLimit(identifier: string): void {
  delete store[identifier];
}
