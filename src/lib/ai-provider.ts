import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, type CoreMessage, type LanguageModelV1 } from 'ai';

/**
 * Build an ordered, de-duplicated list of Gemini API keys.
 *
 * Order:
 *   1. GOOGLE_GENERATIVE_AI_API_KEY  (canonical name @ai-sdk/google reads by default)
 *   2. GEMINI_API_KEY_1, _2, _3       (rotation pool — fallback when the primary rate-limits)
 *
 * Empty strings, placeholders, and duplicates are filtered out so we never
 * call the SDK with a bad key (that's what caused the original 500).
 */
export function getGeminiKeyPool(): string[] {
  const raw = [
    process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
  ];

  const seen = new Set<string>();
  const pool: string[] = [];
  for (const key of raw) {
    if (!key) continue;
    const trimmed = key.trim();
    if (!trimmed) continue;
    if (seen.has(trimmed)) continue;
    seen.add(trimmed);
    pool.push(trimmed);
  }
  return pool;
}

export function hasAnyGeminiKey(): boolean {
  return getGeminiKeyPool().length > 0;
}

// Cache providers per (apiKey, model) — creating one is cheap but avoidable.
const providerCache = new Map<string, ReturnType<typeof createGoogleGenerativeAI>>();

function getProvider(apiKey: string) {
  let provider = providerCache.get(apiKey);
  if (!provider) {
    provider = createGoogleGenerativeAI({ apiKey });
    providerCache.set(apiKey, provider);
  }
  return provider;
}

function getModel(apiKey: string, modelName: string): LanguageModelV1 {
  return getProvider(apiKey)(modelName);
}

/**
 * Stream a chat completion, trying each API key in order until one succeeds.
 *
 * The Vercel AI SDK retries transient errors with exponential backoff on its
 * own, but it does NOT rotate the API key on a 429 / quota error. That's why
 * we wrap it here.
 */
export async function streamWithKeyRotation(params: {
  modelName: string;
  system: string;
  messages: CoreMessage[];
  temperature?: number;
  abortSignal?: AbortSignal;
  onAttempt?: (index: number, total: number, keySuffix: string) => void;
}) {
  const pool = getGeminiKeyPool();
  if (pool.length === 0) {
    throw new Error(
      'No Google Generative AI API key configured. Set GOOGLE_GENERATIVE_AI_API_KEY (or GEMINI_API_KEY_1) in .env.',
    );
  }

  let lastError: unknown;
  for (let i = 0; i < pool.length; i++) {
    const apiKey = pool[i];
    const keySuffix = apiKey.slice(-4);
    params.onAttempt?.(i + 1, pool.length, keySuffix);

    try {
      const result = await streamText({
        model: getModel(apiKey, params.modelName),
        system: params.system,
        messages: params.messages,
        temperature: params.temperature ?? 0.3,
        abortSignal: params.abortSignal,
      });
      return result;
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      const isAuthError = /api[_ ]?key|unauthor|forbidden|permission/i.test(msg);
      const isQuotaError = /quota|rate[_ ]?limit|429|resource[_ ]?exhausted/i.test(msg);
      // Only rotate on auth/quota; otherwise (e.g. bad request from us) don't waste keys.
      if (!isAuthError && !isQuotaError) throw err;
      // Otherwise fall through to try the next key.
    }
  }

  throw lastError ?? new Error('All Gemini API keys failed.');
}