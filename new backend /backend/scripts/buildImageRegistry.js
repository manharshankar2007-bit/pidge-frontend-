const fs = require("fs");
const path = require("path");

const featuresPath = path.join(
    __dirname,
    "../routes/featureRegistry/features.json"
);

const outputPath = path.join(
    __dirname,
    "../routes/imageRegistry/imageRegistry.json"
);

const features = JSON.parse(
    fs.readFileSync(featuresPath, "utf8")
);

const registry = {};

for (const key in features) {

    const feature = features[key];

    registry[feature.title] = {
        feature: feature.title,
        module: feature.module,
        images: (feature.images || []).map((url, index) => ({
            id: `img${index + 1}`,
            title: "",
            description: "",
            url
        }))
    };

}

fs.writeFileSync(
    outputPath,
    JSON.stringify(registry, null, 2)
);

console.log("✅ Image Registry Created");