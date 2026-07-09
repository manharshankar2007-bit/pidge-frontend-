const { getAllDocuments } = require("./documentStore");
const { createEmbedding } = require("./embeddings");

function cosineSimilarity(a, b) {
  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);

  if (magA === 0 || magB === 0) return 0;

  return dot / (magA * magB);
}

async function searchDocuments(query) {
  const documents = getAllDocuments();

  if (documents.length === 0) {
    return [];
  }

  const queryEmbedding = await createEmbedding(query);

  const scored = documents.map((doc) => ({
    ...doc,
    score: cosineSimilarity(queryEmbedding, doc.embedding),
  }));

  // Highest similarity first
  scored.sort((a, b) => b.score - a.score);

  // Remove duplicate chunks from the same document
  const uniqueDocuments = [];
  const seen = new Set();

  for (const doc of scored) {
    if (!seen.has(doc.filename)) {
      seen.add(doc.filename);
      uniqueDocuments.push(doc);
    }

    if (uniqueDocuments.length === 5) break;
  }

  return uniqueDocuments;
}

module.exports = searchDocuments;