/**
 * Normalize a user-submitted question so different phrasings collapse
 * to the same DB key. Keeps the cache effective without going all-in
 * on embeddings.
 */
export function normalizeQuestion(question: string): string {
  return question
    .toLowerCase()
    .trim()
    .replace(/[?!.,]/g, "")
    .replace(/\s+/g, " ");
}