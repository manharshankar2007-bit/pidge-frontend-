const fs = require("fs");
const path = require("path");
const { Worker } = require("worker_threads");
const { simpleParser } = require("mailparser");

// Documents folder lives next to services/, inside the backend project
const DOCUMENTS_DIR = path.join(__dirname, "..", "documents");

/**
 * Detect file type from extension.
 * Supports only PDF and EML files.
 */
function detectFileType(filename) {
  const ext = path.extname(filename).toLowerCase();

  if (ext === ".pdf") {
    return "pdf";
  }

  if (ext === ".eml") {
    return "eml";
  }

  return null;
}

/**
 * Extract plain text from a PDF buffer.
 * Uses a worker thread because mailparser and pdf-parse conflict in the same process.
 */
async function extractPdfText(buffer) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, "pdfWorker.js"), {
      workerData: buffer,
    });

    let settled = false;

    worker.on("message", (message) => {
      settled = true;

      if (message.error) {
        reject(new Error(message.error));
        return;
      }

      resolve(message.text || "");
    });

    worker.on("error", (error) => {
      if (!settled) {
        reject(error);
      }
    });
  });
}

/**
 * Extract plain text from an EML (email) buffer.
 * Combines subject, from, to, and body text.
 */
async function extractEmlText(buffer) {
  const parsed = await simpleParser(buffer);

  const parts = [];

  if (parsed.subject) {
    parts.push(`Subject: ${parsed.subject}`);
  }

  if (parsed.from && parsed.from.text) {
    parts.push(`From: ${parsed.from.text}`);
  }

  if (parsed.to && parsed.to.text) {
    parts.push(`To: ${parsed.to.text}`);
  }

  if (parsed.text) {
    parts.push(parsed.text);
  } else if (parsed.html) {
    // Strip basic HTML tags if only HTML body is available
    parts.push(parsed.html.replace(/<[^>]+>/g, " "));
  }

  return parts.join("\n\n").trim();
}

/**
 * Route extraction to the correct handler based on file type.
 */
async function extractText(buffer, fileType) {
  if (fileType === "pdf") {
    return extractPdfText(buffer);
  }

  if (fileType === "eml") {
    return extractEmlText(buffer);
  }

  throw new Error(`Unsupported file type: ${fileType}`);
}

/**
 * Read a single document and return its extracted text.
 */
async function readDocument(filePath) {
  const filename = path.basename(filePath);
  const fileType = detectFileType(filename);

  if (!fileType) {
    throw new Error(`Unsupported file: ${filename}`);
  }

  const buffer = fs.readFileSync(filePath);
  const text = await extractText(buffer, fileType);

  return {
    filename,
    fileType,
    text,
    textLength: text.length,
  };
}

module.exports = {
  DOCUMENTS_DIR,
  detectFileType,
  extractPdfText,
  extractEmlText,
  extractText,
  readDocument,
};
