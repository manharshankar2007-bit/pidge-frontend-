const { parentPort, workerData } = require("worker_threads");
const pdfParse = require("pdf-parse");

// Runs in a separate thread so mailparser does not interfere with pdf-parse
pdfParse(workerData)
  .then((data) => {
    parentPort.postMessage({ text: data.text || "" });
  })
  .catch((error) => {
    parentPort.postMessage({ error: error.message });
  });
