const fs = require("fs");
const path = require("path");
const { simpleParser } = require("mailparser");

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

async function extractImages() {

  const registry = JSON.parse(
    fs.readFileSync(FEATURES_PATH, "utf8")
  );

  for (const key of Object.keys(registry)) {

    const feature = registry[key];

    feature.images = [];

    if (!feature.documents) continue;

    for (const file of feature.documents) {

      const filePath = path.join(DOCUMENTS_DIR, file);

      if (!fs.existsSync(filePath)) continue;

      try {

        const email = await simpleParser(
          fs.readFileSync(filePath)
        );

        const html = email.html || "";

        const regex = /<img[^>]+src=["']([^"']+)["']/gi;

        let match;

        while ((match = regex.exec(html)) !== null) {

          const url = match[1];

          if (
            url.startsWith("http") &&
            !feature.images.includes(url)
          ) {
            feature.images.push(url);
          }

        }

      } catch (err) {

        console.log("Couldn't parse:", file);

      }

    }

    console.log(
      `${feature.title} -> ${feature.images.length} images`
    );

  }

  fs.writeFileSync(
    FEATURES_PATH,
    JSON.stringify(registry, null, 2)
  );

  console.log("\nFinished extracting images!");

}

extractImages();