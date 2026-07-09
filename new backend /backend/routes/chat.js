
const express = require("express");
const searchDocuments = require("../services/searchDocuments");
const {
  findFeature,
  findFeatureFromFilename,
} = require("../services/featureService");
const imageRegistry = require("../routes/imageRegistry/imageRegistry.json");
const { generate } = require("../services/aiService");

const router = express.Router();
const { findNavigation } = require("../services/navigationService");

router.post("/", async (req, res) => {
  try {
    console.log("1. Request received");

    const { message } = req.body;
    console.log("2. Message:", message);

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    // Search the most relevant chunks
    // First identify the feature
let feature = findFeature(message);
let featureImages = [];

if (feature && imageRegistry[feature.title]) {
    featureImages = imageRegistry[feature.title].images || [];
}

console.log("========== FEATURE IMAGES ==========");
console.dir(featureImages, { depth: null });
console.log("===================================");
console.log(featureImages);
// Then search documents
const results = await searchDocuments(message);
console.log("Top Search Results:");

results.forEach((doc, i) => {
    console.log(
        i + 1,
        doc.filename,
        "Score:",
        doc.score
    );
});
// Only use filename if nothing matched
if (!feature && results.length > 0) {
    feature = findFeatureFromFilename(results[0].filename);
}
const navigationData = findNavigation(message);

console.log("========== NAVIGATION ==========");
console.dir(navigationData, { depth: null });
console.log("===============================");
console.log("========== FEATURE ==========");
console.log("Title:", feature?.title);
console.log("Module:", feature?.module);
console.log("=============================");
console.log("========== FEATURE ==========");
console.log(feature);
console.log("=============================");

console.log("User Question:", message);

console.log("========== NAVIGATION ==========");
console.log(navigationData);
console.log("===============================");

let featureContext = "";

if (feature) {
  featureContext = `
==========================
FEATURE INFORMATION
==========================

Feature:
${feature.title}

Purpose:
${feature.purpose}

Navigation:
${
  navigationData
    ? navigationData.path.join(" > ")
    : (feature?.navigation || []).join(" > ")
}

Related Features:
${feature.related.join(", ")}
`;
}
    // Build context
    const context = results
    .slice(0,4)
      .map(
        (doc, index) => `
Document ${index + 1}
Filename: ${doc.filename}
Chunk: ${doc.chunkIndex + 1}/${doc.totalChunks}

${doc.text}
`
      )
      .join("\n-----------------------------\n");
const q = message.toLowerCase();
// Images now come from the image registry.
// We DO NOT decide here whether to show them.
// The LLM will decide later.

const showImages =
    q.includes("show") ||
    q.includes("where") ||
    q.includes("find") ||
    q.includes("navigate") ||
    q.includes("dashboard") ||
    q.includes("page") ||
    q.includes("screen") ||
    q.includes("screenshot") ||
    q.includes("ui") ||
    q.includes("looks like");

const images = showImages
    ? featureImages.map(img => img.url)
    : [];
let intent = "overview";

if (
    q.startsWith("where") ||
    q.includes("where is") ||
    q.includes("navigate") ||
    q.includes("location") ||
    q.includes("dashboard")
) {
    intent = "navigation";
}
else if (
    q.startsWith("how") ||
    q.includes("steps") ||
    q.includes("configure") ||
    q.includes("setup") ||
    q.includes("create")
) {
    intent = "how";
}
else if (
    q.includes("benefit") ||
    q.includes("advantage")
) {
    intent = "benefits";
}
else if (
    q.includes("related")
) {
    intent = "related";
}
else if (
    q.startsWith("what") ||
    q.includes("overview")
) {
    intent = "overview";
}

console.log("Intent:", intent);
let questionType = "overview";

if (
  q.includes("show") ||
  q.includes("screenshot") ||
  q.includes("screen") ||
  q.includes("look like") ||
  q.includes("ui")
) {
  questionType = "ui";
}

else if (
  q.includes("compare") ||
  q.includes("difference") ||
  q.includes("vs") ||
  q.includes("instead")
) {
  questionType = "comparison";
}

else if (
  q.startsWith("how") ||
  q.includes("workflow") ||
  q.includes("process") ||
  q.includes("flow")
) {
  questionType = "workflow";
}

else if (
  q.includes("benefit") ||
  q.includes("advantage") ||
  q.includes("why") ||
  q.includes("problem")
) {
  questionType = "benefits";
}

else if (intent === "navigation") {
  questionType = "navigation";
}

console.log("Question Type:", questionType);
const responseData = {
  feature: feature
    ? {
        title: feature.title,
        purpose: feature.purpose,
        summary: feature.summary,
        benefits: feature.benefits || [],
        navigation: feature.navigation || [],
        related: feature.related || [],
        how_to_use: feature.how_to_use || [],
      }
    : null,
    

  answer: {
    overview: feature?.summary || "",
    benefits: feature?.benefits || [],
  navigation: navigationData?.path || [],
    relatedFeatures: feature?.related || [],
    howItWorks: feature?.how_to_use || [],
  },

  documents: results.map(doc => ({
    filename: doc.filename,
    text: doc.text,
  })),

  screenshots: featureImages,
};

// ------------------------------
// Direct answers (skip Ollama)
// ------------------------------

let directAnswer = "";

switch (intent) {
  case "navigation":
    directAnswer =
      "## Where to Find It\n\n" +
      
      (responseData.answer.navigation.length
        ? responseData.answer.navigation.join(" → ")
        : "Navigation not available.");
    break;

}
console.log("========== RESPONSE DATA ==========");
console.dir(responseData, { depth: null });
console.log("==================================");
if (intent === "navigation") {
  return res.json({
    success: true,
    answer: directAnswer,
    images: images,
    feature: feature?.title || ""
  });
}
const navigationSection =
  intent === "navigation"
    ? `
Navigation:
${responseData.answer.navigation.join(" > ")}
`
    : "";
    let promptInstructions = "";

switch (questionType) {
  case "overview":
    promptInstructions = `
- Give a short definition in 2–3 sentences.
- Explain what the feature does.
- Include at most 4 key points.
- Keep the answer under 120 words.
`;
    break;

  case "workflow":
    promptInstructions = `
- Explain the workflow step-by-step.
- Use numbered steps.
- Keep it concise.
`;
    break;

  case "benefits":
    promptInstructions = `
- Focus on business value.
- Mention only the important benefits.
`;
    break;

  case "comparison":
    promptInstructions = `
- Compare only the requested features.
- Highlight key differences.
- Recommend when each should be used.
`;
    break;

  case "navigation":
    promptInstructions = `
- Return only the navigation path.
- Do not explain the feature.
`;
    break;

  case "ui":
    promptInstructions = `
- Briefly introduce the screenshots.
- Keep the answer under 60 words.
`;
    break;
    default:
    promptInstructions = `
- Answer naturally.
- Keep the answer concise.
`;
}
    const prompt = `
You are Pidge AI, an expert assistant for the Pidge logistics platform.

Answer naturally like a product expert.

Use the structured feature information below as the PRIMARY source.

Use the document excerpts only when the feature information is insufficient.

Rules

- Write like a knowledgeable product expert, not a documentation page.
- Explain concepts instead of copying documentation.
- Prefer short, natural sentences.
- Avoid repeating the same information.
- Use the structured feature information first.
- Use document excerpts only when they add missing details.
- Never invent features or workflows.
- Only answer what the user asked.
- Do not mention information unrelated to the question.
- Avoid phrases like "This feature empowers..." or "The system enables..."

Tone

Your answers should sound like a senior product manager explaining the product to a customer.

Good example:
"Flexi Shift lets riders choose open shifts based on their availability instead of following fixed schedules."

Bad example:
"Flexi Shift is a shift management model that enables eligible riders to opt into broadcasted shifts."

Always prefer the first style.



Navigation Rules:

- Only mention navigation when the user asks where to find something.
- Do not include navigation in overview or explanation answers.

Screenshot Rules:
- Do not mention screenshots.
- If screenshots are returned by the system, assume they will be displayed automatically.
- Do not refer to screenshots in the text.
Question Type:
${questionType}

Instructions:
${promptInstructions}

User Question:
${message}

Feature Information
Feature:

${feature?.title || ""}

Purpose:

${feature?.purpose || ""}

Summary:

${responseData.feature?.summary || ""}

Benefits:
${responseData.answer.benefits.join("\n")}

How it Works:
${responseData.answer.howItWorks.join("\n")}

Related Features:
${responseData.answer.relatedFeatures.join("\n")}

${navigationSection}

Answer Style

Choose the best format for the user's question.

For overview questions:
- Start with a one-line definition.
- Follow with a short explanation.
- Include at most 3-4 bullet points if they add value.

For workflow questions:
- Explain using numbered steps.

For benefit questions:
- Focus only on business value.
- Avoid implementation details.

For comparison questions:
- Compare the requested features.
- Mention the key differences.
- Recommend when each should be used.

For navigation questions:
- Return only the navigation path.

Never use the exact same structure for every answer.

Keep answers concise and natural.
If the answer can be understood without bullet points, write it as a short paragraph instead.

Do not force bullet points into every response.

Relevant Documents:
${context}
`;
    const answer = await generate(prompt);
    console.log("========== OLLAMA ANSWER ==========");
console.log(answer);
console.log("==================================");

console.log("5. Ollama replied");
   
console.log("Images being returned:");
console.log(featureImages);
   res.json({
    success: true,
    answer,
    images,
    feature: feature?.title || null
});

    console.log("7. Response sent to frontend");

  } catch (err) {
    console.error("CHAT ERROR");
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;