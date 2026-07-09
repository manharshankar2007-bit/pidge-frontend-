const fs = require("fs");
const path = require("path");

const featuresPath = path.join(
  __dirname,
  "../data/features.json"
);

const features = JSON.parse(
  fs.readFileSync(featuresPath, "utf8")
);

for (const key in features) {
  const feature = features[key];

  if (!Array.isArray(feature.images)) continue;

  feature.images = feature.images.map((url, index) => ({
    id: `img${index + 1}`,
    title: "",
    description: "",
    url
  }));
}

fs.writeFileSync(
  featuresPath,
  JSON.stringify(features, null, 2)
);

console.log("✅ Images converted successfully.");