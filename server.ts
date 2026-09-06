import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API health route
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Gemini API copy generation route
  app.post("/api/generate-copy", async (req, res) => {
    try {
      const { businessName, location, mainProductService, targetAudience } = req.body;
      console.log("[API] Received copy request for:", businessName);

      if (!businessName || !mainProductService) {
        return res.status(400).json({
          error: "Business Name and Main Product/Service are required.",
        });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "GEMINI_API_KEY is not configured on the server. Please check your AI Studio Secrets.",
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `Business Details:
- Business Name: ${businessName}
- Location: ${location ? location : "Online / Global"}
- Main Product/Service: ${mainProductService}
- Target Audience: ${targetAudience ? targetAudience : "Target customers & local community"}

Generate high-converting, authentic, professional marketing copy for this business.
1. Social Media Posts: 3 diverse posts (e.g. Introducing/Announcing, Value/Educational, Special Offer/Promotional) with compelling hooks, engaging captions, clear calls to action, and relevant hashtags.
2. Google Business Profile Update: A local update post tailored for Google Maps and Local Search. Include an eye-catching headline, local relevance, clear offer or update description, and recommended action.
3. SEO Keywords: High-value search terms separated into Primary Local Keywords, High-Intent Commercial Keywords, and Long-Tail Search Queries.`;

      const generateConfig = {
        systemInstruction:
          "You are an elite digital marketing copywriter and local SEO specialist. You craft clean, human, conversion-focused copy tailored to the business's industry, location, and audience. Avoid buzzwords and clichés. Provide practical, ready-to-post copy and actionable keyword recommendations.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            socialMedia: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                posts: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      theme: { type: Type.STRING, description: "e.g. New Announcement, Pro Tip / Value, Exclusive Offer" },
                      platform: { type: Type.STRING, description: "e.g. Instagram, Facebook, LinkedIn, X" },
                      hook: { type: Type.STRING, description: "Attention grabbing opening line" },
                      caption: { type: Type.STRING, description: "Full post body" },
                      callToAction: { type: Type.STRING, description: "Action prompt" },
                      hashtags: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                    },
                    required: ["theme", "platform", "hook", "caption", "callToAction", "hashtags"],
                  },
                },
                copyableText: {
                  type: Type.STRING,
                  description: "Complete ready-to-copy formatted plain text of all social media posts.",
                },
              },
              required: ["posts", "copyableText"],
            },
            googleBusinessProfile: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                updateBody: { type: Type.STRING },
                callToAction: { type: Type.STRING },
                suggestedButtonType: { type: Type.STRING, description: "e.g. Call Now, Learn More, Book Online" },
                copyableText: {
                  type: Type.STRING,
                  description: "Complete ready-to-copy formatted text for Google Business Profile update.",
                },
              },
              required: ["headline", "updateBody", "callToAction", "copyableText"],
            },
            seoKeywords: {
              type: Type.OBJECT,
              properties: {
                primaryLocalKeywords: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                highIntentKeywords: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                longTailQueries: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                copyableText: {
                  type: Type.STRING,
                  description: "Complete ready-to-copy formatted text list of all SEO keywords.",
                },
              },
              required: ["primaryLocalKeywords", "highIntentKeywords", "longTailQueries", "copyableText"],
            },
          },
          required: ["socialMedia", "googleBusinessProfile", "seoKeywords"],
        },
      };

      let response;
      try {
        response = await Promise.race([
          ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
            config: generateConfig,
          }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout waiting for gemini-3.8-flash")), 8000)
          ),
        ]);
      } catch (firstErr: any) {
        console.warn("Primary gemini-3.8-flash attempt failed or timed out, falling back to gemini-3.1-flash-lite:", firstErr?.message);
        response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: prompt,
          config: generateConfig,
        });
      }

      const responseText = response?.text || "{}";
      const parsed = JSON.parse(responseText);
      res.json(parsed);
    } catch (err: any) {
      console.error("Server error generating copy:", err);
      let userFriendlyMessage = err?.message || "Failed to generate copy. Please try again.";
      try {
        // If message is serialized JSON error, parse it
        const parsedErr = JSON.parse(err.message);
        if (parsedErr?.error?.message) {
          userFriendlyMessage = parsedErr.error.message;
        }
      } catch {
        // Not JSON
      }
      res.status(500).json({
        error: userFriendlyMessage,
      });
    }
  });

  // Vite middleware for dev / static for prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
