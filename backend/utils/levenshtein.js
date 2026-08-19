// Calculate edit distance between two strings
function levenshtein(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();

  const lenA = a.length;
  const lenB = b.length;

  if (lenA === 0) return lenB;
  if (lenB === 0) return lenA;

  let prev = Array.from({ length: lenB + 1 }, (_, i) => i);
  let curr = new Array(lenB + 1).fill(0);

  for (let i = 1; i <= lenA; i++) {
    curr[0] = i;
    for (let j = 1; j <= lenB; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + cost
      );
    }
    [prev, curr] = [curr, prev];
  }

  return prev[lenB];
}

// Perform fuzzy matching using sliding window Levenshtein algorithm
function fuzzyMatch(query, target, threshold = 2) {
  if (!query || !target) return { match: false, minDistance: Infinity };

  const q = query.toLowerCase().trim();
  const t = target.toLowerCase();

  if (t.includes(q)) return { match: true, minDistance: 0 };

  const qLen = q.length;
  const tLen = t.length;

  if (qLen > tLen) {
    const dist = levenshtein(q, t);
    return { match: dist <= threshold, minDistance: dist };
  }

  let minDist = Infinity;
  for (let start = 0; start <= tLen - qLen; start++) {
    const window = t.slice(start, start + qLen);
    const dist = levenshtein(q, window);
    if (dist < minDist) minDist = dist;
    if (minDist === 0) break;
  }

  return { match: minDist <= threshold, minDistance: minDist };
}

module.exports = { levenshtein, fuzzyMatch };
