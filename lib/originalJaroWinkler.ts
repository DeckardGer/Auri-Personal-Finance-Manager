export const jaroDistance = (s1: string, s2: string) => {
  if (s1 == s2) return 1.0;

  const len1 = s1.length;
  const len2 = s2.length;

  if (len1 == 0 || len2 == 0) return 0.0;

  const max_dist = Math.floor(Math.max(len1, len2) / 2) - 1;

  let match = 0;

  const hash_s1 = new Array(s1.length);
  hash_s1.fill(0);

  const hash_s2 = new Array(s2.length);
  hash_s2.fill(0);

  for (let i = 0; i < len1; i++) {
    for (let j = Math.max(0, i - max_dist); j < Math.min(len2, i + max_dist + 1); j++)
      if (s1[i] == s2[j] && hash_s2[j] == 0) {
        hash_s1[i] = 1;
        hash_s2[j] = 1;
        match++;
        break;
      }
  }

  if (match == 0) return 0.0;

  let t = 0;
  let point = 0;

  for (let i = 0; i < len1; i++)
    if (hash_s1[i] == 1) {
      while (hash_s2[point] == 0) point++;

      if (s1[i] != s2[point++]) t++;
    }

  t /= 2;

  return (match / len1 + match / len2 + (match - t) / match) / 3.0;
};

const jaroWinkler = (s1: string, s2: string) => {
  let jaro_dist = jaroDistance(s1, s2);

  if (jaro_dist > 0.7) {
    let prefix = 0;

    for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
      if (s1[i] == s2[i]) prefix++;
      else break;
    }

    prefix = Math.min(4, prefix);

    jaro_dist += 0.1 * prefix * (1 - jaro_dist);
  }

  return jaro_dist.toFixed(6);
};
