function frequencyAnalyze(text = "", bigramsMax = 20) {
  text = text.trim();

  if (typeof text !== "string") {
    throw new Error("Text must be a string");
  }

  if (text.length === 0) {
    throw new Error("Text cannot be empty");
  }

  if (text.match(/[^\sა-ჰ.,!?;\-—'"\(\)]/)) {
    throw new Error(
      "Text can only contain Georgian characters and basic punctuation"
    );
  }

  const total = text.length;
  const frequency = {};
  const letters = text.match(/[ა-ჰ]/g) || [];

  for (const char of letters) {
    frequency[char] = (frequency[char] || 0) + 1;
  }

  const charArray = Object.entries(frequency)
    .map(([ch, cnt]) => ({ ch, cnt, freq: ((cnt / total) * 100).toFixed(2) }))
    .sort((a, b) => b.cnt - a.cnt);

  const bigrams = letters
    .map((c, i, arr) => (arr[i + 1] ? c + arr[i + 1] : null))
    .filter(Boolean);
  const bgCounts = {};
  bigrams.forEach((bg) => (bgCounts[bg] = (bgCounts[bg] || 0) + 1));
  const bgArray = Object.entries(bgCounts)
    .map(([bg, cnt]) => ({
      bg,
      cnt,
      freq: ((cnt / bigrams.length) * 100).toFixed(2),
    }))
    .sort((a, b) => b.cnt - a.cnt)
    .slice(0, bigramsMax);

  return {
    characterFrequencies: charArray,
    topBigrams: bgArray,
  };
}
