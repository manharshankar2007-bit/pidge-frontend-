function splitIntoChunks(text, chunkSize = 800, overlap = 150) {
  if (!text) return [];

  const clean = text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const chunks = [];

  let start = 0;

  while (start < clean.length) {
    const end = Math.min(start + chunkSize, clean.length);

    chunks.push(clean.slice(start, end));

    if (end === clean.length) break;

    start = end - overlap;
  }

  return chunks;
}

module.exports = {
  splitIntoChunks,
};