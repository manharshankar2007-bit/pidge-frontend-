require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Routes
const chatRoutes = require("./routes/chat");
const documentRoutes = require("./routes/document");

// Services
const { loadDocuments } = require("./services/documentStore");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/chat", chatRoutes);
app.use("/document", documentRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({
    status: "Backend running",
    message: "Pidge Company Chatbot API",
  });
});

app.get("/test", (req, res) => {
  res.json({
    status: "Server is working",
  });
});

// Start Server
async function startServer() {
  try {
    console.log("Loading company documents...");

    await loadDocuments();

    console.log("✅ Documents loaded successfully.");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("❌ Failed to start server");
    console.error(err);
    process.exit(1);
  }
}

startServer();