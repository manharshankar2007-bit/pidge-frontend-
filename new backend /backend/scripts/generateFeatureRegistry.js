const fs = require("fs");
const path = require("path");
const { readDocument } = require("../services/documentReader");

const DOCUMENTS_DIR = path.join(__dirname, "..", "documents");
const OUTPUT_FILE = path.join(
  __dirname,
  "..",
  "featureRegistry",
  "features.json"
);

// -------------------------------
// Create feature key
// -------------------------------
function makeFeatureKey(filename) {
  return filename
    .replace(/\.(eml|pdf)$/i, "")
    .replace(/^💥⚡️\s*/g, "")
    .replace(/^🔔\s*/g, "")
    .replace(/^What's New[_ ]*/i, "")
    .replace(/^Coming Soon[_ ]*/i, "")
    .replace(/[^\w\s]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

// -------------------------------
// Clean title
// -------------------------------
function cleanTitle(filename) {
  return filename
    .replace(/\.(eml|pdf)$/i, "")
    .replace(/^💥⚡️\s*/g, "")
    .replace(/^🔔\s*/g, "")
    .replace(/^What's New[_ ]*/i, "")
    .replace(/^Coming Soon[_ ]*/i, "")
    .trim();
}

// -------------------------------
// Main
// -------------------------------
async function generateRegistry() {

  const files = fs.readdirSync(DOCUMENTS_DIR);

  const registry = {};

  for (const file of files) {

    if (
      !file.endsWith(".eml") &&
      !file.endsWith(".pdf")
    ) {
      continue;
    }

    console.log("Reading:", file);

    const filePath = path.join(DOCUMENTS_DIR, file);

    try {

      const doc = await readDocument(filePath);

      const key = makeFeatureKey(file);

      if (!registry[key]) {

        registry[key] = {
          title: cleanTitle(file),

          module: "",

          purpose: "",

          summary: "",

          keywords: [],

          navigation: [],

          related: [],

          benefits: [],

          how_to_use: [],

          documents: [],

          images: [],

          available_for: []
        };

      }

      registry[key].documents.push(file);

    } catch (err) {

      console.log("Failed:", file);

    }

  }

  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(registry, null, 2)
  );

  console.log(
    "\nFeature registry generated successfully."
  );

}

generateRegistry();