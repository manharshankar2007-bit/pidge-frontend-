const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "qwen3:8b";

async function generate(prompt) {
  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      stream: false,
      options: {
        temperature: 0.2,
        top_p: 0.9,
        num_predict: 2048,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json();

  return data.response.trim();
}

module.exports = {
  generate,
};