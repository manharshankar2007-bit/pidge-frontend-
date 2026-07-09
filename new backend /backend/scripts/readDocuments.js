const fs = require("fs");
const path = require("path");
const {
  DOCUMENTS_DIR,
  detectFileType,
  readDocument,
} = require("../services/documentReader");

/**
 * Print the resolved documents directory, then read every supported file.
 */
async function main() {
  // Always show where we are looking for documents
  console.log(`Resolved path:\n${path.resolve(DOCUMENTS_DIR)}`);

  // Check that the documents folder exists
  if (!fs.existsSync(DOCUMENTS_DIR)) {
    console.log("Documents folder not found");
    return;
  }

  const entries = fs.readdirSync(DOCUMENTS_DIR);

  // Filter out directories — only process files
  const files = entries.filter((entry) => {
    const fullPath = path.join(DOCUMENTS_DIR, entry);
    return fs.statSync(fullPath).isFile();
  });

  if (files.length === 0) {
    console.log("No files found.");
    return;
  }

  for (const filename of files) {
    const fileType = detectFileType(filename);

    // Skip files that are not PDF or EML
    if (!fileType) {
      continue;
    }

    const filePath = path.join(DOCUMENTS_DIR, filename);

    console.log(`Reading: ${filename}`);

    try {
      const result = await readDocument(filePath);

      console.log(`Finished: ${filename}`);
      console.log(
        `${result.filename} [${result.fileType}]: ${result.textLength} characters`
      );
    } catch (error) {
      console.log(`Finished: ${filename}`);
      console.error(`Error reading ${filename}: ${error.message}`);
    }
  }
}

main();
