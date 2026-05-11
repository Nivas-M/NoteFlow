/**
 * Levenshtein Distance — implemented from scratch.
 *
 * Computes the minimum number of single-character edits
 * (insertions, deletions, substitutions) required to transform
 * string `a` into string `b`.
 *
 * Uses the classic Wagner-Fischer dynamic-programming algorithm
 * with an O(m*n) time complexity and O(min(m,n)) space optimisation.
 */
function levenshtein(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();

  const lenA = a.length;
  const lenB = b.length;

  // Edge cases
  if (lenA === 0) return lenB;
  if (lenB === 0) return lenA;

  // We keep only two rows of the matrix at a time (space optimisation)
  let prev = Array.from({ length: lenB + 1 }, (_, i) => i);
  let curr = new Array(lenB + 1).fill(0);

  for (let i = 1; i <= lenA; i++) {
    curr[0] = i;
    for (let j = 1; j <= lenB; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,       // deletion
        curr[j - 1] + 1,   // insertion
        prev[j - 1] + cost // substitution
      );
    }
    // Swap rows for next iteration
    [prev, curr] = [curr, prev];
  }

  return prev[lenB];
}

/**
 * Checks whether `query` is a fuzzy match against `target`.
 *
 * Strategy:
 *  1. Exact substring match (distance = 0) → immediate pass.
 *  2. Sliding-window scan: compute Levenshtein between `query` and
 *     every same-length window inside `target`. If the minimum distance
 *     across all windows is ≤ `threshold`, it's a match.
 *  3. If the query is longer than the target, fall back to a full
 *     string distance check.
 *
 * @param {string} query     - The search string (possibly mis-typed).
 * @param {string} target    - The note field to search in.
 * @param {number} threshold - Max allowed edit distance (default 2).
 * @returns {{ match: boolean, minDistance: number }}
 */
function fuzzyMatch(query, target, threshold = 2) {
  if (!query || !target) return { match: false, minDistance: Infinity };

  const q = query.toLowerCase().trim();
  const t = target.toLowerCase();

  // Fast path: direct substring
  if (t.includes(q)) return { match: true, minDistance: 0 };

  const qLen = q.length;
  const tLen = t.length;

  if (qLen > tLen) {
    const dist = levenshtein(q, t);
    return { match: dist <= threshold, minDistance: dist };
  }

  // Sliding window across target
  let minDist = Infinity;
  for (let start = 0; start <= tLen - qLen; start++) {
    const window = t.slice(start, start + qLen);
    const dist = levenshtein(q, window);
    if (dist < minDist) minDist = dist;
    if (minDist === 0) break; // can't get better
  }

  return { match: minDist <= threshold, minDistance: minDist };
}

module.exports = { levenshtein, fuzzyMatch };
