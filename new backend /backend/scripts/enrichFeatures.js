const fs = require("fs");
const path = require("path");

const { readDocument } = require("../services/documentReader");
const { generate } = require("../services/aiService");

const FEATURES_PATH = path.join(
  __dirname,
  "..",
  "featureRegistry",
  "features.json"
);

const DOCUMENTS_DIR = path.join(
  __dirname,
  "..",
  "documents"
);

async function enrich() {

  const registry = JSON.parse(
    fs.readFileSync(FEATURES_PATH, "utf8")
  );

  const keys = Object.keys(registry);

  for (const key of keys) {

    const feature = registry[key];

    if (!feature.documents || feature.documents.length === 0) {
      continue;
    }

    console.log("\n=================================");
    console.log("Processing:", feature.title);
    console.log("=================================");

    let combinedText = "";

    for (const file of feature.documents) {

      const filePath = path.join(
        DOCUMENTS_DIR,
        file
      );

      try {

        const doc = await readDocument(filePath);

        combinedText += "\n\n----------------------\n\n";
        combinedText += doc.text;

      } catch (err) {

        console.log("Couldn't read:", file);

      }

    }

    const prompt = `
Extract information from this release note.

Return ONLY valid JSON.

For the "navigation" field:

- DO NOT copy document headings.
- DO NOT use headings like "What's New", "Overview", "Summary", "What's Next".
- navigation should describe the actual product hierarchy or feature path.
- Each item should be a meaningful feature category.

Good examples:

["Payments","COD Handling","Cash Limits"]

["Orders","Rider Earnings","Incentives"]

["Fleet","Vehicle Assignment","Driver"]

Bad examples:

["What's New"]

["Overview"]

["What This Means To You"]

["What's Next"]

Return:

{
  "module":"",
  "purpose":"",
  "summary":"",
  "keywords":[],
  "navigation":[],
  "related":[],
  "benefits":[],
  "how_to_use":[],
  "available_for":[]
}
${combinedText}
`;

    try {

      const answer = await generate(prompt);

      const start = answer.indexOf("{");
      const end = answer.lastIndexOf("}");

      if (start === -1 || end === -1) {
        throw new Error("No JSON found in AI response.");
      }

      const json = answer.substring(start, end + 1);

      const extracted = JSON.parse(json);

      feature.module = extracted.module || "";
      feature.purpose = extracted.purpose || "";
      feature.summary = extracted.summary || "";
      feature.keywords = extracted.keywords || [];
      feature.navigation = extracted.navigation || [];
      feature.related = extracted.related || [];
      feature.benefits = extracted.benefits || [];
      feature.how_to_use = extracted.how_to_use || [];
      feature.available_for = extracted.available_for || [];

      console.log("✓ Updated");

    } catch (err) {

      console.log("✗ Failed");
      console.log(err.message);

    }

  }
    fs.writeFileSync(
    FEATURES_PATH,
    JSON.stringify(registry, null, 2)
  );

  console.log("\n=================================");
  console.log("Feature enrichment complete!");
  console.log("=================================");

}

enrich().catch((err) => {
  console.error(err);
});