const express = require("express");
const path = require("path");
const { readDocument } = require("../services/documentReader");

const router = express.Router();

function cleanEmailContent(text) {
  if (!text) return "";

  let cleaned = text;

  // Remove email headers
  cleaned = cleaned.replace(/^Subject:.*$/gim, "");
  cleaned = cleaned.replace(/^From:.*$/gim, "");
  cleaned = cleaned.replace(/^To:.*$/gim, "");
  cleaned = cleaned.replace(/^Cc:.*$/gim, "");
  cleaned = cleaned.replace(/^Bcc:.*$/gim, "");
  cleaned = cleaned.replace(/^Date:.*$/gim, "");
  cleaned = cleaned.replace(/^Reply-To:.*$/gim, "");
  cleaned = cleaned.replace(/^Message-ID:.*$/gim, "");
  cleaned = cleaned.replace(/^Content-Type:.*$/gim, "");
  cleaned = cleaned.replace(/^Content-Transfer-Encoding:.*$/gim, "");
  cleaned = cleaned.replace(/^MIME-Version:.*$/gim, "");

  // Remove image placeholders
  cleaned = cleaned.replace(/\[image:.*?\]/gi, "");

  // Remove HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, "");

  // Remove quoted-printable leftovers
  cleaned = cleaned.replace(/=20/g, " ");
  cleaned = cleaned.replace(/=3D/g, "=");

  // Remove long separators
  cleaned = cleaned.replace(/_{5,}/g, "");
  cleaned = cleaned.replace(/-{5,}/g, "");

  // Remove multiple spaces
  cleaned = cleaned.replace(/[ \t]+/g, " ");

  // Collapse blank lines
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  return cleaned.trim();
}

function cleanTitle(filename) {
  return filename
    .replace(/\.(eml|pdf)$/i, "")
    .replace(/💥|⚡|🚀|✨|🔥|📢|📌|📄/g, "")
    .replace(/^What's New[_ -]*/i, "")
    .replace(/_/g, " ")
    .trim();
}

router.get("/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;

    const filePath = path.join(
      __dirname,
      "..",
      "documents",
      filename
    );

    const doc = await readDocument(filePath);

    if (!doc) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
      });
    }

    const cleanedText = cleanEmailContent(doc.text);

    res.json({
      success: true,
      filename,
      title: cleanTitle(filename),
      fileType: doc.fileType,
      text: cleanedText,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;