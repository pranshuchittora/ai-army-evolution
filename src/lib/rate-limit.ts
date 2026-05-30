// In-memory sliding-window rate limiter (no external deps).
// NOTE: module-level Map — resets on dev hot-reload and is per-process
// (not shared across serverless instances). Adequate as a basic safeguard.

type Bucket = {
  // Timestamps (ms) of requests still inside the current window.
  hits: number[];
};

const store = new Map<string, Bucket>();

// Opportunistic cleanup bookkeeping so the Map doesn't grow unbounded.
let lastSweep = 0;
const SWEEP_INTERVAL_MS = 60_000;

export interface RateLimitOptions {
  /** Max requests allowed within the window. Default 20. */
  limit?: number;
  /** Window length in milliseconds. Default 60000 (60s). */
  windowMs?: number;
}

export interface RateLimitResult {
  /** Whether this request is allowed. */
  ok: boolean;
  /** Remaining requests in the current window (never negative). */
  remaining: number;
  /** Seconds the caller should wait before retrying (0 when ok). */
  retryAfter: number;
}

function sweep(now: number, windowMs: number): void {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  for (const [key, bucket] of store) {
    const cutoff = now - windowMs;
    bucket.hits = bucket.hits.filter((t) => t > cutoff);
    if (bucket.hits.length === 0) {
      store.delete(key);
    }
  }
}

/**
 * Sliding-window rate limit, keyed by an arbitrary string (typically client IP).
 */
export function rateLimit(
  key: string,
  opts: RateLimitOptions = {},
): RateLimitResult {
  const limit = opts.limit ?? 20;
  const windowMs = opts.windowMs ?? 60_000;
  const now = Date.now();
  const cutoff = now - windowMs;

  sweep(now, windowMs);

  let bucket = store.get(key);
  if (!bucket) {
    bucket = { hits: [] };
    store.set(key, bucket);
  }

  // Drop timestamps that have aged out of the window.
  bucket.hits = bucket.hits.filter((t) => t > cutoff);

  if (bucket.hits.length >= limit) {
    // Oldest in-window hit determines when a slot frees up.
    const oldest = bucket.hits[0];
    const retryAfterMs = oldest + windowMs - now;
    return {
      ok: false,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil(retryAfterMs / 1000)),
    };
  }

  bucket.hits.push(now);
  return {
    ok: true,
    remaining: Math.max(0, limit - bucket.hits.length),
    retryAfter: 0,
  };
}
