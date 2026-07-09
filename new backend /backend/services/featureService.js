console.log("🚨 FEATURE SERVICE LOADED 🚨");

const fs = require("fs");
const path = require("path");

const featuresPath = path.join(
  __dirname,
  "..",
  "routes",
  "featureRegistry",
  "features.json"
);

console.log("📂 Features path:", featuresPath);
console.log("Exists:", fs.existsSync(featuresPath));
console.log("Current dir:", __dirname);

let features = {};

try {
  features = JSON.parse(fs.readFileSync(featuresPath, "utf8"));

  console.log("✅ Features loaded:", Object.keys(features).length);
  console.log(
    "Sample keys:",
    Object.keys(features).slice(0, 5)
  );
} catch (err) {
  console.error("❌ Failed to load features.json");
  console.error(err);
}

function normalize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function findFeature(question) {
  console.log("\n==============================");
  console.log("🔥 NEW FEATURE SERVICE VERSION");
  console.log("==============================");

  const query = normalize(question);

  console.log("Question:", query);

  const queryWords = query
    .split(" ")
    .filter((w) => w.length > 2);

  let bestFeature = null;
  let bestScore = 0;

  for (const key of Object.keys(features)) {
    const feature = features[key];

    const title = normalize(feature.title);
    const module = normalize(feature.module);

    console.log("------------------------");
    console.log("Checking:", feature.title);
    console.log("Title:", title);
console.log("Module:", module);
console.log("Keywords:", feature.keywords);
console.log("Documents:", feature.documents?.length);

    let score = 0;

    // Exact title
    if (query.includes(title) || title.includes(query)) {
      score += 100;
    }

    // Module
    if (module && (query.includes(module) || module.includes(query))) {
      score += 80;
    }

    // Word matching
    for (const word of queryWords) {
      if (title.includes(word)) score += 15;
      if (module.includes(word)) score += 10;
    }

    // Keywords
    if (Array.isArray(feature.keywords)) {
        // Aliases
if (Array.isArray(feature.aliases)) {

  for (const alias of feature.aliases) {

    const a = normalize(alias);

    if (
      query.includes(a) ||
      a.includes(query)
    ) {
      score += 70;
    }

    for (const word of queryWords) {

      if (a.includes(word)) {

        score += 15;

      }

    }

  }

}
      for (const keyword of feature.keywords) {
        const kw = normalize(keyword);

        if (query.includes(kw) || kw.includes(query)) {
          score += 50;
        }

        for (const word of queryWords) {
          if (kw.includes(word)) score += 10;
        }
      }
    }
console.log("Final score:", score);
    if (score > bestScore) {
      bestScore = score;
      bestFeature = feature;
    }
  }

  console.log("Best score:", bestScore);

  if (bestScore >= 30) {
    console.log("✅ FEATURE FOUND:", bestFeature.title);
    return bestFeature;
  }

  console.log("❌ NO FEATURE FOUND");
  return null;
}

module.exports = {
  findFeature,
  findFeatureFromFilename,
};
function findFeatureFromFilename(filename) {
  if (!filename) return null;

  const normalizedFilename = normalize(filename);

  let bestFeature = null;
  let bestScore = 0;

  for (const key of Object.keys(features)) {
    const feature = features[key];

    // Check every document attached to this feature
    for (const doc of feature.documents || []) {
      const normalizedDoc = normalize(doc);

      let score = 0;

      // Exact filename
      if (
        normalizedFilename === normalizedDoc ||
        normalizedFilename.includes(normalizedDoc) ||
        normalizedDoc.includes(normalizedFilename)
      ) {
        score += 100;
      }

      // Word overlap
      const words = normalizedFilename.split(" ");

      for (const word of words) {
        if (word.length < 3) continue;

        if (normalizedDoc.includes(word)) {
          score += 10;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestFeature = feature;
      }
    }
  }

  if (bestFeature) {
    console.log(
      "📄 Feature matched from filename:",
      bestFeature.title
    );
  }

  return bestFeature;
}