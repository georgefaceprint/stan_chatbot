import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import * as cheerio from "cheerio";
import cron from "node-cron";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KNOWLEDGE_BASE_PATH = path.join(__dirname, "public", "knowledge_base.txt");

async function scrapeExpressPrint() {
  console.log("Starting scheduled scrape of expressprint.co.za...");
  try {
    const urls = [
      "https://expressprint.co.za",
      "https://expressprint.co.za/flyers-printing-sandton/",
      "https://expressprint.co.za/poster-printing-sandton/",
      "https://expressprint.co.za/business-cards-printing-sandton/",
      "https://expressprint.co.za/signage-printing-sandton/"
    ];

    let allContent = "";

    for (const url of urls) {
      try {
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        const $ = cheerio.load(response.data);
        
        // Remove scripts, styles, and nav/footer to get clean content
        $('script, style, nav, footer, header').remove();
        
        const text = $('body').text().replace(/\s+/g, ' ').trim();
        allContent += `--- Source: ${url} ---\n${text}\n\n`;
        console.log(`Scraped ${url}`);
      } catch (err) {
        console.error(`Failed to scrape ${url}:`, err);
      }
    }

    if (!fs.existsSync(path.join(__dirname, "public"))) {
      fs.mkdirSync(path.join(__dirname, "public"));
    }

    fs.writeFileSync(KNOWLEDGE_BASE_PATH, allContent);
    console.log("Knowledge base updated successfully.");
  } catch (error) {
    console.error("Scraping error:", error);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Schedule scrape every 24 hours (at midnight)
  cron.schedule("0 0 * * *", () => {
    scrapeExpressPrint();
  });

  // API route to get knowledge base content
  app.get("/api/knowledge-base", (req, res) => {
    if (fs.existsSync(KNOWLEDGE_BASE_PATH)) {
      const content = fs.readFileSync(KNOWLEDGE_BASE_PATH, "utf-8");
      res.json({ content });
    } else {
      res.status(404).json({ error: "Knowledge base not yet generated." });
    }
  });

  // Manual trigger for testing
  app.post("/api/scrape-now", async (req, res) => {
    await scrapeExpressPrint();
    res.json({ message: "Scrape completed" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    // Initial scrape on startup if file doesn't exist
    if (!fs.existsSync(KNOWLEDGE_BASE_PATH)) {
      scrapeExpressPrint();
    }
  });
}

startServer();
