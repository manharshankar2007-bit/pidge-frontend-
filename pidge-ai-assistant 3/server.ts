import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3001;

app.use(express.json());

// Source Document Pool for Logistics Company Pidge
interface SourceDoc {
  name: string;
  keywords: string[];
  description: string;
}

const SOURCES_POOL: SourceDoc[] = [
  {
    name: "route_optimization_v4.pdf",
    keywords: ["route", "optimize", "optimization", "gps", "distance", "traffic", "algorithm", "planning", "stops"],
    description: "Pidge proprietary multi-stop route planner and traffic heuristics manual"
  },
  {
    name: "rider_delay_sop_v2.eml",
    keywords: ["delay", "rider", "accident", "broken", "late", "weather", "exception", "incident", "emergency", "stuck"],
    description: "Operational SOP regarding delivery exceptions, delayed dispatches, and emergency rerouting"
  },
  {
    name: "pidge_tracking_api_spec.pdf",
    keywords: ["tracking", "api", "webhook", "status", "real-time", "integration", "url", "developers", "connect"],
    description: "Technical specifications for Pidge's real-time shipment status webhook and developer APIs"
  },
  {
    name: "consignment_pricing_manifest.pdf",
    keywords: ["price", "cost", "charge", "manifest", "invoice", "tier", "billing", "heavy", "bulk", "rate"],
    description: "Consignment rates, fuel surcharge structures, and volumetric weighing standards"
  },
  {
    name: "dispatcher_dashboard_guide.pdf",
    keywords: ["dashboard", "dispatcher", "assign", "manual", "auto-assign", "manager", "console", "portal", "control"],
    description: "User guide for the Pidge Dispatcher Control Tower and batch-assignment engine"
  },
  {
    name: "customer_complaints_handling.eml",
    keywords: ["complaint", "angry", "refund", "support", "ticket", "dispute", "missing", "damaged", "lost"],
    description: "Standard templates and escalations for high-priority delivery disputes"
  },
  {
    name: "pidge_rider_onboarding_faq.pdf",
    keywords: ["onboard", "join", "rider", "app", "payout", "salary", "bonus", "wallet", "document", "driver"],
    description: "Frequently Asked Questions for newly registered Pidge delivery riders and partners"
  },
  {
    name: "warehouse_sorting_layout_v1.pdf",
    keywords: ["warehouse", "sort", "hub", "inventory", "scan", "barcode", "packet", "bin", "shelf", "cross-dock"],
    description: "SOP for cross-docking operations and inbound package sorting layout plans"
  }
];

// Lazy initialized Gemini client to prevent start-up crash if GEMINI_API_KEY is not defined
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined. Falling back to high-quality local responses.");
      return null;
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// Rich rule-based responses if Gemini is not set up
function getRuleBasedResponse(message: string): string {
  const query = message.toLowerCase();

  if (query.includes("hello") || query.includes("hi") || query.includes("hey") || query.includes("welcome")) {
    return `# Welcome to Pidge AI Assistant! 🚚
    
I am your dedicated logistics control tower companion. I can assist you with a variety of operations:

1. **Route Optimization**: Ask me to plan a route or analyze fuel efficiency.
2. **Shipment Tracking**: Get status updates on transit packages.
3. **Rider Operations**: Inquire about automated dispatches, SLAs, or exceptions.
4. **API Integration**: Ask how to configure tracking webhooks for clients.

*How can I assist your logistics team today?*`;
  }

  if (query.includes("track") || query.includes("shipment") || query.includes("status") || query.includes("where")) {
    return `### Shipment Status Overview: Consignment **#PDG-98421-IN**

Here is the current transit information retrieved from the Pidge Central Hub:

| Stage | Location | Status | Timestamp | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **First-Mile** | Mumbai Sorting Hub | Completed | June 25, 09:15 | Package received and weighed (4.2 kg) |
| **Line-Haul** | Mumbai-Delhi Transit | Completed | June 25, 23:40 | Dispatched via Express Air Cargo flight |
| **Last-Mile** | New Delhi Okhla Hub | In Progress | June 26, 04:30 | Assigned to Rider Amit Kumar |
| **Delivery** | Destination | Scheduled | June 26, 11:30 | Delivery window confirmed by customer |

**Current Status**: 🟢 **On-Route (Last-Mile)**
Amit Kumar is currently 1.4 km away from the destination. Weather conditions are clear, and traffic is optimal.

*Refer to \`pidge_tracking_api_spec.pdf\` to set up automatic webhooks for your clients.*`;
  }

  if (query.includes("route") || query.includes("optimize") || query.includes("stop") || query.includes("distance")) {
    return `### Route Optimization Analysis: Delhi NCR Hub (Sector-62)

We have analyzed the stops requested for Dispatch Batch **#B-4421** using our proprietary genetic routing algorithms.

#### Recommended Dispatch Plan
1. **Rider 1 (Sector-62 to Sector-18)**
   - **Stops**: 6 deliveries
   - **Total Distance**: 8.4 km (optimized from 11.2 km)
   - **Estimated Time**: 34 mins
   - **Savings**: 25% fuel reduction

2. **Rider 2 (Sector-62 to Indirapuram)**
   - **Stops**: 8 deliveries
   - **Total Distance**: 12.1 km (optimized from 15.6 km)
   - **Estimated Time**: 48 mins
   - **Savings**: 22% fuel reduction

#### Traffic Alert ⚠️
Heavy congestion reported near Noida Link Road. Riders have been automatically rerouted through Noida Expressway to maintain under-45-minute delivery SLAs.

*For algorithm details, review \`route_optimization_v4.pdf\`.*`;
  }

  if (query.includes("delay") || query.includes("accident") || query.includes("late") || query.includes("exception")) {
    return `### Delivery Exception Protocol: Alert Registered

When a rider reports a delay or incident on the road, please trigger the following SOP immediately:

1. **Rider Safety First**: Ensure the rider is safe. If it is an accident, dispatch emergency support.
2. **Mark Delivery Exception**: Update the console to state "Rider Delayed due to Transit Incident."
3. **Auto-Trigger Customer SMS**: An automated notification is sent to the customer:
   > *"Hi [Name], your Pidge order has met with an unexpected delay. Our backup rider is on the way. Expected delivery is now in 45 mins. Thank you for your patience."*
4. **Trigger Backup Dispatch**: Arrange for a nearby standby rider to collect the package at the exception coordinate.

*For complete templates and emergency phone numbers, please refer to \`rider_delay_sop_v2.eml\`.*`;
  }

  if (query.includes("api") || query.includes("webhook") || query.includes("integrate") || query.includes("developer")) {
    return `### Pidge API Integration Guide

To integrate Pidge's real-time shipment updates into your client's ERP or e-commerce platform, use the following endpoints:

#### 1. Create shipment
\`\`\`http
POST /api/v1/shipments
Authorization: Bearer <API_TOKEN>
Content-Type: application/json

{
  "consignee": {
    "name": "Jane Doe",
    "phone": "+919876543210",
    "address": "Flat 302, Green Glen Layout, Bengaluru"
  },
  "package": {
    "weight_kg": 2.5,
    "dimensions_cm": "30x20x15"
  }
}
\`\`\`

#### 2. Webhook Registration
Register your webhook endpoint via the Dispatch console or:
\`\`\`http
POST /api/v1/webhooks/register
{
  "url": "https://api.clientdomain.com/pidge-callbacks",
  "events": ["shipment.dispatched", "shipment.delivered", "shipment.failed"]
}
\`\`\`

*Refer to \`pidge_tracking_api_spec.pdf\` for full authentication protocols and schemas.*`;
  }

  return `### Pidge Operational Query Received

Thank you for contacting the Pidge AI Logistics Support Engine.

Based on our central knowledge base, here are the recommendations for **"${message}"**:

- **Hub Verification**: Check if this query is specific to a regional hub (e.g., Delhi, Mumbai, Bengaluru).
- **Consignment Check**: Ensure package tracking IDs conform to the \`#PDG-[0-9]{5}-[A-Z]{2}\` pattern.
- **Support Path**: If this is a live incident, escalate to the Operations Coordinator via the main Dispatch dashboard.

You can ask me specific questions about:
- **"Optimize stops for Rider Amit"**
- **"Track shipment PDG-98421"**
- **"What to do if a rider is delayed?"**
- **"Show me the tracking API webhook specs"**

*I have attached \`pidge_onboarding_faq.pdf\` and \`dispatcher_dashboard_guide.pdf\` below for context.*`;
}

// Source matcher based on keywords in the message
function matchSources(message: string): string[] {
  const query = message.toLowerCase();
  const matched: string[] = [];

  for (const doc of SOURCES_POOL) {
    const hasKeyword = doc.keywords.some(keyword => query.includes(keyword));
    if (hasKeyword) {
      matched.push(doc.name);
    }
  }

  // If no specific sources match, suggest 2 general/useful ones
  if (matched.length === 0) {
    matched.push("dispatcher_dashboard_guide.pdf");
    matched.push("pidge_onboarding_faq.pdf");
  }

  // Return max 3 sources to keep it elegant and clean
  return matched.slice(0, 3);
}

// POST /chat API endpoint
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string" || message.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "Message parameter is required and must be a valid string."
    });
  }

  const ai = getGeminiClient();
  let answer = "";
  const sources = matchSources(message);

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: message,
        config: {
          systemInstruction: `You are Pidge AI Assistant, a highly professional, high-performance logistics, supply chain, and fleet automation AI companion for Pidge. 
          Pidge is a premium logistics platform providing unified delivery solutions, route optimizations, cross-dock automation, and dispatcher intelligence.
          
          Guidelines:
          - Keep your tone crisp, professional, objective, and authoritative yet friendly.
          - Structure responses beautifully using Markdown. Use bold subtitles, clear bullet points, code blocks, and formatted tables for structured/tabular data.
          - Incorporate logistics-specific knowledge like SLAs, first-mile/last-mile efficiency, driver dispatch thresholds, geo-fencing, sorting hubs, and delivery exceptions.
          - Do not use flowery or self-praising words.
          - Reference the matched sources naturally if they seem relevant to the user's query (e.g. "You can consult route_optimization_v4.pdf for deeper algorithmic constraints").
          - Matched sources for this query are: [${sources.join(", ")}]. Mention one or more of these in your answer if relevant!`,
        }
      });
      answer = response.text || "I was unable to formulate a response. Please try rephrasing your inquiry.";
    } catch (error: any) {
      console.error("Gemini API generation error:", error);
      // Fallback in case of API failure or quota limit
      answer = `*(Operational Notice: Running in standby mode due to temporary gateway latency)*\n\n${getRuleBasedResponse(message)}`;
    }
  } else {
    // Return high-quality rule-based local answer if API key is not present
    answer = getRuleBasedResponse(message);
  }

  res.json({
    success: true,
    answer,
    sources
  });
});

// Vite & Static file serving setup
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static files from:", distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
